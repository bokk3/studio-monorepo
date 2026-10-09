class_name EmbeddedServer
extends Node

## Embedded Dual Server (HTTP & WebSocket)
## Enables zero-install mobile HOTAS control and local LAN streaming within Godot.

signal client_connected(client_id: int)
signal client_disconnected(client_id: int)
signal frame_received(client_id: int, packet: PackedByteArray)

@export var http_port: int = 8080
@export var ws_port: int = 8081

var _http_server: TCPServer = TCPServer.new()
var _ws_server: TCPServer = TCPServer.new()

# Connected WebSocket peers
class ConnectedClient extends RefCounted:
	var id: int = 0
	var ws_peer: WebSocketPeer = WebSocketPeer.new()
	var tcp_stream: StreamPeerTCP = null
	var is_websocket_handshake_done: bool = false

var _clients: Dictionary = {} # int -> ConnectedClient
var _next_client_id: int = 1

var _codec: BinaryFrameCodec = BinaryFrameCodec.new()

func _ready() -> void:
	start_servers()

func _exit_tree() -> void:
	stop_servers()

## Starts the dual servers with port fallback
func start_servers() -> void:
	# 1. Start HTTP Server
	var http_err = _http_server.listen(http_port)
	if http_err != OK:
		# Fallback to alternate port
		http_port = 8082
		http_err = _http_server.listen(http_port)
		if http_err != OK:
			push_warning("EmbeddedServer: Failed to bind HTTP server on ports 8080/8082")
	
	# 2. Start WebSocket Server
	var ws_err = _ws_server.listen(ws_port)
	if ws_err != OK:
		ws_port = 8083
		ws_err = _ws_server.listen(ws_port)
		if ws_err != OK:
			push_warning("EmbeddedServer: Failed to bind WebSocket server on ports 8081/8083")

## Stops and closes all listening servers and client connections
func stop_servers() -> void:
	for id in _clients.keys():
		var client: ConnectedClient = _clients[id]
		if client.ws_peer:
			client.ws_peer.close()
	_clients.clear()

	if _http_server.is_listening():
		_http_server.stop()
	if _ws_server.is_listening():
		_ws_server.stop()

func _process(_delta: float) -> void:
	_poll_http_requests()
	_poll_websocket_connections()
	_poll_connected_clients()

var _pending_http_clients: Array[StreamPeerTCP] = []

## Serves lightweight HTTP responses / status
func _poll_http_requests() -> void:
	if not _http_server.is_listening():
		return

	# Close and clean up previous HTTP clients whose data was transmitted
	for client in _pending_http_clients:
		if client:
			client.disconnect_from_host()
	_pending_http_clients.clear()

	while _http_server.is_connection_available():
		var tcp: StreamPeerTCP = _http_server.take_connection()
		if tcp:
			var response_body: String = "{\"status\":\"ok\",\"game\":\"Astro-Smash: Arena\",\"ws_port\":%d}" % ws_port
			var response: String = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: %d\r\n\r\n%s" % [response_body.length(), response_body]
			tcp.put_data(response.to_utf8_buffer())
			_pending_http_clients.append(tcp)

## Accepts incoming TCP connections and begins WebSocket handshake
func _poll_websocket_connections() -> void:
	if not _ws_server.is_listening():
		return

	while _ws_server.is_connection_available():
		var tcp: StreamPeerTCP = _ws_server.take_connection()
		if tcp:
			var client = ConnectedClient.new()
			client.id = _next_client_id
			_next_client_id += 1
			client.tcp_stream = tcp
			client.ws_peer.accept_stream(tcp)
			_clients[client.id] = client

## Polls all connected WebSocket peers for binary frames
func _poll_connected_clients() -> void:
	var to_remove: Array[int] = []

	for id in _clients.keys():
		var client: ConnectedClient = _clients[id]
		client.ws_peer.poll()

		var state = client.ws_peer.get_ready_state()
		if state == WebSocketPeer.STATE_OPEN:
			if not client.is_websocket_handshake_done:
				client.is_websocket_handshake_done = true
				client_connected.emit(client.id)

			# Drain packet queue
			while client.ws_peer.get_available_packet_count() > 0:
				var packet: PackedByteArray = client.ws_peer.get_packet()
				if packet.size() >= BinaryFrameCodec.FRAME_SIZE:
					frame_received.emit(client.id, packet)

		elif state == WebSocketPeer.STATE_CLOSED:
			to_remove.append(id)

	for id in to_remove:
		_clients.erase(id)
		client_disconnected.emit(id)

## Broadcasts reverse telemetry packet (10Hz) to all connected mobile controllers
func broadcast_telemetry(telemetry_packet: PackedByteArray) -> void:
	for id in _clients.keys():
		var client: ConnectedClient = _clients[id]
		if client.ws_peer.get_ready_state() == WebSocketPeer.STATE_OPEN:
			client.ws_peer.put_packet(telemetry_packet)
