class_name TacticalHUD
extends CanvasLayer

## Tactical Vector HUD for Astro-Smash: Arena
## Immediate-mode vector rendering with zero GC overhead, LCOS lead pip, and telemetry.

@export var is_hud_active: bool = true

# Telemetry and state caches
var current_speed: float = 0.0
var current_g_force: float = 1.0
var current_energy: float = 100.0
var is_stalled: bool = false
var is_over_g: bool = false

var lead_pip_screen_pos: Vector2 = Vector2.ZERO
var has_lead_solution: bool = false

var match_time_remaining: float = 180.0
var cyan_score: int = 0
var magenta_score: int = 0

# Colors adhering to Tachyon Brand Guidelines
const COLOR_CYAN: Color = Color(0.0, 0.95, 1.0, 0.85)     # #00F3FF
const COLOR_MAGENTA: Color = Color(1.0, 0.0, 1.0, 0.85)   # #FF00FF
const COLOR_AMBER: Color = Color(1.0, 0.75, 0.0, 0.9)
const COLOR_RED: Color = Color(1.0, 0.2, 0.2, 0.95)
const COLOR_DIM: Color = Color(0.0, 0.95, 1.0, 0.3)

func _ready() -> void:
	pass

func update_telemetry(telemetry: BinaryFrameCodec.TelemetryData) -> void:
	current_speed = telemetry.speed
	current_g_force = telemetry.g_force
	current_energy = float(telemetry.energy_percent)
	is_stalled = (telemetry.alert_flags & BinaryFrameCodec.ALERT_STALL_WARNING) != 0
	is_over_g = (telemetry.alert_flags & BinaryFrameCodec.ALERT_OVER_G_WARNING) != 0

func update_lead_solution(screen_pos: Vector2, valid: bool) -> void:
	lead_pip_screen_pos = screen_pos
	has_lead_solution = valid

func update_scoreboard(cyan: int, magenta: int, time_sec: float) -> void:
	cyan_score = cyan
	magenta_score = magenta
	match_time_remaining = time_sec

func _process(_delta: float) -> void:
	# Trigger redraw of canvas layer
	var canvas_item: Control = get_node_or_null("Overlay") as Control
	if canvas_item:
		canvas_item.queue_redraw()
