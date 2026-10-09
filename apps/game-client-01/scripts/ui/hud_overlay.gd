class_name HUDOverlay
extends Control

## Immediate Mode Canvas Drawer for Tactical HUD
@onready var hud: TacticalHUD = get_parent() as TacticalHUD

func _draw() -> void:
	if not hud or not hud.is_hud_active:
		return

	var center: Vector2 = size * 0.5
	if center.is_zero_approx():
		center = Vector2(640, 360)

	# 1. Central Crosshair (Cyan)
	var cross_size: float = 12.0
	draw_line(center - Vector2(cross_size, 0), center - Vector2(3, 0), TacticalHUD.COLOR_CYAN, 1.5)
	draw_line(center + Vector2(3, 0), center + Vector2(cross_size, 0), TacticalHUD.COLOR_CYAN, 1.5)
	draw_line(center - Vector2(0, cross_size), center - Vector2(0, 3), TacticalHUD.COLOR_CYAN, 1.5)
	draw_line(center + Vector2(0, 3), center + Vector2(0, cross_size), TacticalHUD.COLOR_CYAN, 1.5)
	draw_arc(center, 24.0, 0, TAU, 32, TacticalHUD.COLOR_DIM, 1.0)

	# 2. LCOS Lead Intercept Pip
	if hud.has_lead_solution:
		var pip_pos: Vector2 = hud.lead_pip_screen_pos
		draw_arc(pip_pos, 8.0, 0, TAU, 16, TacticalHUD.COLOR_MAGENTA, 1.5)
		draw_circle(pip_pos, 2.0, TacticalHUD.COLOR_MAGENTA)
		# Line connecting reticle center to lead pip (lead indicator)
		draw_line(center, pip_pos, TacticalHUD.COLOR_DIM, 1.0)

	# 3. Telemetry Gauges (Speed & G-Force)
	var speed_text: String = "SPD: %03.0f M/S" % hud.current_speed
	var g_text: String = "G: %+04.1f G" % hud.current_g_force
	draw_string(ThemeDB.fallback_font, center + Vector2(-160, 80), speed_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, TacticalHUD.COLOR_CYAN)
	draw_string(ThemeDB.fallback_font, center + Vector2(-160, 100), g_text, HORIZONTAL_ALIGNMENT_LEFT, -1, 14, TacticalHUD.COLOR_CYAN)

	# 4. Warnings
	if hud.is_stalled:
		draw_string(ThemeDB.fallback_font, center + Vector2(-80, -60), "! STALL // RECOVER !", HORIZONTAL_ALIGNMENT_CENTER, -1, 16, TacticalHUD.COLOR_AMBER)
	if hud.is_over_g:
		draw_string(ThemeDB.fallback_font, center + Vector2(-90, -85), "!! OVER-G // G-LOC WARNING !!", HORIZONTAL_ALIGNMENT_CENTER, -1, 16, TacticalHUD.COLOR_RED)

	# 5. Scoreboard & Timer
	var score_text: String = "CYAN %d  :  %d MAGENTA" % [hud.cyan_score, hud.magenta_score]
	var mins: int = int(hud.match_time_remaining) / 60
	var secs: int = int(hud.match_time_remaining) % 60
	var time_text: String = "%02d:%02d" % [mins, secs]
	draw_string(ThemeDB.fallback_font, Vector2(center.x - 90, 40), score_text, HORIZONTAL_ALIGNMENT_CENTER, -1, 18, Color.WHITE)
	draw_string(ThemeDB.fallback_font, Vector2(center.x - 30, 65), time_text, HORIZONTAL_ALIGNMENT_CENTER, -1, 16, TacticalHUD.COLOR_CYAN)
