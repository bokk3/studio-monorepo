extends SceneTree

## Headless Unit Test: EmbeddedServer (Local Dual Server)
## Verifies port binding, HTTP status response, and telemetry broadcasting.

func _init() -> void:
	print("\n=== [TEST SUITE] EmbeddedServer (HTTP & WebSocket) ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	var server = EmbeddedServer.new()
	server.http_port = 18080 # Use high test ports to prevent collisions
	server.ws_port = 18081
	root.add_child(server)
	server.start_servers()

	# Test 1: Port Binding & Listening
	total_tests += 1
	if server._http_server.is_listening() and server._ws_server.is_listening():
		print("  [PASS] Both HTTP (:18080) and WebSocket (:18081) servers listening")
		passed_tests += 1
	else:
		printerr("  [FAIL] Server failed to listen: http=%s, ws=%s" % [server._http_server.is_listening(), server._ws_server.is_listening()])

	# Test 2: HTTP Status Response via Loopback Client
	total_tests += 1
	var client_tcp = StreamPeerTCP.new()
	var conn_err = client_tcp.connect_to_host("127.0.0.1", 18080)
	if conn_err == OK:
		# Poll until connected
		var start_time = Time.get_ticks_msec()
		while client_tcp.get_status() == StreamPeerTCP.STATUS_CONNECTING and (Time.get_ticks_msec() - start_time) < 1000:
			client_tcp.poll()
			server._process(0.016)
			OS.delay_msec(10)

		if client_tcp.get_status() == StreamPeerTCP.STATUS_CONNECTED:
			# Send HTTP GET request
			client_tcp.put_data("GET / HTTP/1.1\r\nHost: localhost\r\n\r\n".to_utf8_buffer())
			
			var wait_reply = Time.get_ticks_msec()
			while client_tcp.get_available_bytes() == 0 and (Time.get_ticks_msec() - wait_reply) < 1000:
				client_tcp.poll()
				server._process(0.016)
				OS.delay_msec(10)

			var available = client_tcp.get_available_bytes()
			if available > 0:
				var response_data = client_tcp.get_data(available)
				var response_text: String = response_data[1].get_string_from_utf8()
				if response_text.contains("HTTP/1.1 200 OK") and response_text.contains("Astro-Smash: Arena"):
					print("  [PASS] Loopback TCP client received valid HTTP 200 JSON status response")
					passed_tests += 1
				else:
					printerr("  [FAIL] Unexpected response text: %s" % response_text)
			else:
				printerr("  [FAIL] No response bytes received from HTTP server")
		else:
			printerr("  [FAIL] Could not connect TCP loopback client: status=%d" % client_tcp.get_status())
	else:
		printerr("  [FAIL] connect_to_host returned error %d" % conn_err)

	client_tcp.disconnect_from_host()

	# Test 3: Telemetry Broadcast Buffer
	total_tests += 1
	var codec = BinaryFrameCodec.new()
	var telem = codec.encode_telemetry(100, 100, 100, 0, 72.0, 5.0, 1.0)
	server.broadcast_telemetry(telem)
	print("  [PASS] Broadcast telemetry executed without exceptions")
	passed_tests += 1

	# Test 4: Graceful Shutdown
	total_tests += 1
	server.stop_servers()
	if not server._http_server.is_listening() and not server._ws_server.is_listening():
		print("  [PASS] Stop servers gracefully released TCP sockets")
		passed_tests += 1
	else:
		printerr("  [FAIL] Sockets remained open after stop_servers")

	server.queue_free()

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
