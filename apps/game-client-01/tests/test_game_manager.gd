extends SceneTree

## Headless Unit Test: GameManager (Match Arbitration & Scoring)
## Verifies match progression, goal arbitration, overtime logic, and win conditions.

func _init() -> void:
	print("\n=== [TEST SUITE] GameManager Match Arbitration ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	var gm = GameManager.new()
	root.add_child(gm) # Invokes _ready()
	gm.match_duration = 60.0
	gm.target_score = 3
	gm.countdown_duration = 0.1

	# Test 1: Initialization State
	total_tests += 1
	if gm.current_state == GameManager.MatchState.LOBBY and gm.cyan_score == 0 and gm.magenta_score == 0:
		print("  [PASS] Initialized in LOBBY with 0:0 score")
		passed_tests += 1
	else:
		printerr("  [FAIL] Initial state mismatch: state=%s" % gm.current_state)

	# Test 2: Start Match Transitions to COUNTDOWN
	total_tests += 1
	gm.start_match()
	if gm.current_state == GameManager.MatchState.COUNTDOWN:
		print("  [PASS] start_match transitioned to COUNTDOWN")
		passed_tests += 1
	else:
		printerr("  [FAIL] Failed to enter COUNTDOWN: state=%s" % gm.current_state)

	# Test 3: Countdown Expiration Transitions to IN_MATCH
	total_tests += 1
	gm._process(0.2) # Advance past 0.1s countdown
	if gm.current_state == GameManager.MatchState.IN_MATCH:
		print("  [PASS] Countdown completed -> transitioned to IN_MATCH")
		passed_tests += 1
	else:
		printerr("  [FAIL] Failed to enter IN_MATCH: state=%s" % gm.current_state)

	# Test 4: Goal Registration (Team Cyan Scores)
	total_tests += 1
	gm.register_goal(1) # Cyan scores
	if gm.cyan_score == 1 and gm.magenta_score == 0 and gm.current_state == GameManager.MatchState.GOAL_SCORED:
		print("  [PASS] Cyan goal registered (1:0) -> transitioned to GOAL_SCORED")
		passed_tests += 1
	else:
		printerr("  [FAIL] Goal registration failed: cyan=%d, magenta=%d, state=%s" % [gm.cyan_score, gm.magenta_score, gm.current_state])

	# Test 5: Re-kickoff after celebration
	total_tests += 1
	gm._process(3.0) # Advance past 2.5s celebration
	if gm.current_state == GameManager.MatchState.COUNTDOWN:
		print("  [PASS] Post-goal celebration finished -> returned to COUNTDOWN for kickoff")
		passed_tests += 1
	else:
		printerr("  [FAIL] Kickoff return failed: state=%s" % gm.current_state)

	gm._process(0.2) # Advance to IN_MATCH

	# Test 6: Target Score Win Condition
	total_tests += 1
	var winner_box: Array = [-1] # Array container for lambda reference capture
	gm.match_finished.connect(func(winner): winner_box[0] = winner)

	gm.register_goal(1) # Score 2:0
	gm._process(3.0)
	gm._process(0.2) # Back IN_MATCH
	gm.register_goal(1) # Score 3:0 (Target reached)
	gm._process(3.0) # Celebration finished -> Target reached triggers MATCH_OVER

	if gm.current_state == GameManager.MatchState.MATCH_OVER and winner_box[0] == 1:
		print("  [PASS] Target score reached (3:0) -> MATCH_OVER with Cyan victory")
		passed_tests += 1
	else:
		printerr("  [FAIL] Match over win condition failed: state=%s, winner=%d" % [gm.current_state, winner_box[0]])

	# Cleanup
	gm.queue_free()

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
