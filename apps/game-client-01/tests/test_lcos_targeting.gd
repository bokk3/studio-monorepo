extends SceneTree

## Headless Unit Test: LCOS Predictive Targeting & Aim Magnetism
## Verifies quadratic intercept calculations and trajectory magnetism limits.

func _init() -> void:
	print("\n=== [TEST SUITE] LCOS Predictive Targeting & Aim Magnetism ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	# Test 1: Stationary Target Intercept
	total_tests += 1
	var shooter_pos: Vector3 = Vector3.ZERO
	var target_pos: Vector3 = Vector3(0, 0, 200.0)
	var target_vel: Vector3 = Vector3.ZERO
	var muzzle_vel: float = 1000.0 # m/s

	var sol1 = LCOSTargeting.calculate_lead_intercept(shooter_pos, target_pos, target_vel, muzzle_vel)
	if sol1.valid and sol1.intercept_point.is_equal_approx(target_pos) and is_equal_approx(sol1.time_to_intercept, 0.20):
		print("  [PASS] Stationary target intercept exact (t = %.2fs, pos = %s)" % [sol1.time_to_intercept, sol1.intercept_point])
		passed_tests += 1
	else:
		printerr("  [FAIL] Stationary target intercept failed: %s" % sol1)

	# Test 2: Crossing Target Intercept (Quadratic Solution Verification)
	total_tests += 1
	var crossing_pos: Vector3 = Vector3(100.0, 0, 100.0)
	var crossing_vel: Vector3 = Vector3(60.0, 0, 0) # Crossing laterally at 60 m/s
	var proj_speed: float = 600.0 # m/s

	var sol2 = LCOSTargeting.calculate_lead_intercept(shooter_pos, crossing_pos, crossing_vel, proj_speed)
	if sol2.valid:
		var t_sol: float = sol2.time_to_intercept
		var predicted_point: Vector3 = crossing_pos + crossing_vel * t_sol
		var distance_to_predicted: float = shooter_pos.distance_to(predicted_point)
		var proj_travel_distance: float = proj_speed * t_sol

		if is_equal_approx(distance_to_predicted, proj_travel_distance):
			print("  [PASS] Crossing target ballistic convergence confirmed: projectile travel (%.3fm) == target distance (%.3fm) at t = %.3fs" % [proj_travel_distance, distance_to_predicted, t_sol])
			passed_tests += 1
		else:
			printerr("  [FAIL] Crossing target travel distance mismatch: proj=%.3f, target=%.3f" % [proj_travel_distance, distance_to_predicted])
	else:
		printerr("  [FAIL] Crossing target reported no valid solution")

	# Test 3: Impossible Intercept (Target Escaping Faster Than Shell)
	total_tests += 1
	var fleeing_pos: Vector3 = Vector3(0, 0, 50.0)
	var fleeing_vel: Vector3 = Vector3(0, 0, 1200.0) # Moving away faster than shell
	var slow_muzzle: float = 800.0

	var sol3 = LCOSTargeting.calculate_lead_intercept(shooter_pos, fleeing_pos, fleeing_vel, slow_muzzle)
	if not sol3.valid:
		print("  [PASS] Target outrunning projectile correctly classified as invalid intercept")
		passed_tests += 1
	else:
		printerr("  [FAIL] Outrunning target incorrectly reported valid solution")

	# Test 4: Aim Assist Magnetism Inside 5-degree Cone
	total_tests += 1
	var boresight: Vector3 = Vector3(0, 0, -1.0)
	# Target offset by 2.0 degrees
	var offset_axis: Vector3 = Vector3.UP
	var ideal_dir: Vector3 = boresight.rotated(offset_axis, deg_to_rad(2.0))
	var assisted_dir: Vector3 = LCOSTargeting.apply_aim_assist(boresight, ideal_dir, 5.0, 2.5)

	var angle_before: float = rad_to_deg(boresight.angle_to(ideal_dir))
	var angle_after: float = rad_to_deg(assisted_dir.angle_to(ideal_dir))

	if angle_after < 0.01:
		print("  [PASS] Aim assist within 5 deg cone successfully converged trajectory (error: %.3f deg -> %.3f deg)" % [angle_before, angle_after])
		passed_tests += 1
	else:
		printerr("  [FAIL] Aim assist inside cone failed: remaining error = %.3f deg" % angle_after)

	# Test 5: Aim Assist Rejection Outside 5-degree Cone
	total_tests += 1
	var wide_ideal_dir: Vector3 = boresight.rotated(offset_axis, deg_to_rad(12.0))
	var unassisted_dir: Vector3 = LCOSTargeting.apply_aim_assist(boresight, wide_ideal_dir, 5.0, 2.5)

	if unassisted_dir.is_equal_approx(boresight):
		print("  [PASS] Aim assist rejected target outside 5 deg acquisition cone (no deflection applied)")
		passed_tests += 1
	else:
		printerr("  [FAIL] Aim assist outside cone inappropriately bent trajectory")

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
