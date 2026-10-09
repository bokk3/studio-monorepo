class_name MainGame
extends Node3D

## Master Game Coordinator for Astro-Smash: Arena
## Ties Arena, Ball, Vehicle, HUD, LCOS Targeting, and Network Server together.

@onready var game_manager: GameManager = $GameManager
@onready var embedded_server: EmbeddedServer = $EmbeddedServer
@onready var hud: TacticalHUD = $TacticalHUD
@onready var arena: Node3D = $Arena
@onready var ball: BallController = $Ball
@onready var vehicle: VehicleController6DOF = $Vehicle
@onready var camera: Camera3D = $Vehicle/CameraMount/Camera3D

func _ready() -> void:
	# 1. Connect Game Manager to HUD
	game_manager.score_updated.connect(_on_score_updated)
	game_manager.timer_updated.connect(_on_timer_updated)
	game_manager.state_changed.connect(_on_state_changed)

	# 2. Connect Goal Detectors
	var goal_cyan: GoalDetector = arena.get_node_or_null("GoalCyan") as GoalDetector
	var goal_magenta: GoalDetector = arena.get_node_or_null("GoalMagenta") as GoalDetector
	if goal_cyan:
		goal_cyan.goal_entered.connect(_on_goal_entered)
	if goal_magenta:
		goal_magenta.goal_entered.connect(_on_goal_entered)

	# 3. Connect Vehicle Telemetry to HUD & Embedded Server
	vehicle.telemetry_updated.connect(_on_vehicle_telemetry)

	# 4. Connect Embedded Server inputs to Vehicle
	embedded_server.frame_received.connect(_on_network_frame_received)

	# Start initial match
	game_manager.start_match()

func _physics_process(_delta: float) -> void:
	_update_lcos_lead_pip()

## Calculates predictive LCOS lead intercept to assist player targeting the ball
func _update_lcos_lead_pip() -> void:
	if not ball or not vehicle or not camera:
		return

	var intercept: Dictionary = LCOSTargeting.calculate_lead_intercept(
		vehicle.global_position,
		ball.global_position,
		ball.linear_velocity,
		PhysicsConstants.CANNON_MUZZLE_VELOCITY,
		vehicle.velocity
	)

	if intercept.valid:
		var target_world_pos: Vector3 = intercept.intercept_point
		# Only draw if in front of camera
		if not camera.is_position_behind(target_world_pos):
			var screen_pos: Vector2 = camera.unproject_position(target_world_pos)
			hud.update_lead_solution(screen_pos, true)
		else:
			hud.update_lead_solution(Vector2.ZERO, false)
	else:
		hud.update_lead_solution(Vector2.ZERO, false)

func _on_score_updated(cyan: int, magenta: int) -> void:
	hud.update_scoreboard(cyan, magenta, game_manager.time_remaining)

func _on_timer_updated(time_remaining: float) -> void:
	hud.update_scoreboard(game_manager.cyan_score, game_manager.magenta_score, time_remaining)

func _on_state_changed(state: GameManager.MatchState) -> void:
	if state == GameManager.MatchState.COUNTDOWN:
		ball.reset_to_center()

func _on_goal_entered(scoring_team: int) -> void:
	game_manager.register_goal(scoring_team)

func _on_vehicle_telemetry(telemetry: BinaryFrameCodec.TelemetryData) -> void:
	hud.update_telemetry(telemetry)
	# Reverse stream to mobile controller via embedded server
	var packet = vehicle._frame_codec.encode_telemetry(
		telemetry.hull_percent,
		telemetry.shield_percent,
		telemetry.energy_percent,
		telemetry.alert_flags,
		telemetry.speed,
		telemetry.altitude,
		telemetry.g_force
	)
	embedded_server.broadcast_telemetry(packet)

func _on_network_frame_received(_client_id: int, packet: PackedByteArray) -> void:
	vehicle.process_binary_input(packet)
