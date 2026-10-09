class_name GoalDetector
extends Area3D

## Detects when the ball enters a goal volume
signal goal_entered(team_id: int)

@export var defending_team_id: int = 1 # 1: Cyan defending (Magenta scores), 2: Magenta defending (Cyan scores)

func _ready() -> void:
	body_entered.connect(_on_body_entered)

func _on_body_entered(body: Node3D) -> void:
	if body is BallController:
		# If Cyan is defending, Magenta scored (2). If Magenta is defending, Cyan scored (1).
		var scoring_team: int = 2 if defending_team_id == 1 else 1
		goal_entered.emit(scoring_team)
