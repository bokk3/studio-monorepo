class_name GameManager
extends Node

## Match State Machine & Authoritative Host Arbitrator
## Governs match progression, 3v3 scoring, overtime, and kickoff synchronization.

signal state_changed(new_state: MatchState)
signal score_updated(cyan_score: int, magenta_score: int)
signal timer_updated(time_remaining: float)
signal match_finished(winning_team: int)

enum MatchState {
	BOOT,
	LOBBY,
	COUNTDOWN,
	IN_MATCH,
	GOAL_SCORED,
	OVERTIME,
	MATCH_OVER
}

@export var match_duration: float = 180.0 # 3 minutes
@export var target_score: int = 5
@export var countdown_duration: float = 3.0

var current_state: MatchState = MatchState.LOBBY
var cyan_score: int = 0
var magenta_score: int = 0
var time_remaining: float = 180.0
var _state_timer: float = 0.0

func _ready() -> void:
	time_remaining = match_duration
	transition_to(MatchState.LOBBY)

func _process(delta: float) -> void:
	match current_state:
		MatchState.COUNTDOWN:
			_state_timer -= delta
			if _state_timer <= 0.0:
				transition_to(MatchState.IN_MATCH)

		MatchState.IN_MATCH:
			time_remaining -= delta
			timer_updated.emit(maxf(0.0, time_remaining))
			if time_remaining <= 0.0:
				if cyan_score == magenta_score:
					transition_to(MatchState.OVERTIME)
				else:
					transition_to(MatchState.MATCH_OVER)

		MatchState.OVERTIME:
			# Sudden death: first goal wins
			pass

		MatchState.GOAL_SCORED:
			_state_timer -= delta
			if _state_timer <= 0.0:
				if cyan_score >= target_score or magenta_score >= target_score:
					transition_to(MatchState.MATCH_OVER)
				elif time_remaining <= 0.0:
					transition_to(MatchState.MATCH_OVER)
				else:
					transition_to(MatchState.COUNTDOWN)

func transition_to(new_state: MatchState) -> void:
	current_state = new_state
	match new_state:
		MatchState.LOBBY:
			cyan_score = 0
			magenta_score = 0
			time_remaining = match_duration
			score_updated.emit(cyan_score, magenta_score)
		MatchState.COUNTDOWN:
			_state_timer = countdown_duration
		MatchState.GOAL_SCORED:
			_state_timer = 2.5 # Celebration & replay pause
		MatchState.MATCH_OVER:
			var winner: int = 0
			if cyan_score > magenta_score:
				winner = 1
			elif magenta_score > cyan_score:
				winner = 2
			match_finished.emit(winner)
	
	state_changed.emit(new_state)

## Registers a goal scored by team (1: Cyan, 2: Magenta)
func register_goal(scoring_team: int) -> void:
	if current_state != MatchState.IN_MATCH and current_state != MatchState.OVERTIME:
		return

	if scoring_team == 1:
		cyan_score += 1
	elif scoring_team == 2:
		magenta_score += 1
	
	score_updated.emit(cyan_score, magenta_score)
	transition_to(MatchState.GOAL_SCORED)

func start_match() -> void:
	cyan_score = 0
	magenta_score = 0
	time_remaining = match_duration
	score_updated.emit(cyan_score, magenta_score)
	transition_to(MatchState.COUNTDOWN)
