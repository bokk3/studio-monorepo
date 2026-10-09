extends SceneTree

## Headless Unit Test: Aerodynamics & Magnus Effect
## Verifies mathematical correctness of Magnus forces, quadratic drag, and spin bounces.

func _init() -> void:
	print("\n=== [TEST SUITE] Aerodynamics & Magnus Physics ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	# Test 1: Magnus Topspin Dip
	# Forward velocity = Vector3(0, 0, -20.0), Topspin omega = Vector3(-10.0, 0, 0)
	# omega x v = (-10, 0, 0) x (0, 0, -20) = (0, -200, 0) -> Downward Y acceleration
	total_tests += 1
	var v_forward: Vector3 = Vector3(0, 0, -20.0)
	var omega_topspin: Vector3 = Vector3(-10.0, 0, 0)
	var a_magnus_topspin: Vector3 = Aerodynamics.calculate_magnus_acceleration(omega_topspin, v_forward, 0.5, 0.002)

	if a_magnus_topspin.y < 0.0 and is_zero_approx(a_magnus_topspin.x) and is_zero_approx(a_magnus_topspin.z):
		print("  [PASS] Topspin generates pure downward acceleration (dip: a_y = %.2f m/s^2)" % a_magnus_topspin.y)
		passed_tests += 1
	else:
		printerr("  [FAIL] Topspin failed: accel = %s" % a_magnus_topspin)

	# Test 2: Magnus Backspin Float
	# Backspin omega = Vector3(+10.0, 0, 0)
	# omega x v = (10, 0, 0) x (0, 0, -20) = (0, +200, 0) -> Upward Y acceleration
	total_tests += 1
	var omega_backspin: Vector3 = Vector3(10.0, 0, 0)
	var a_magnus_backspin: Vector3 = Aerodynamics.calculate_magnus_acceleration(omega_backspin, v_forward, 0.5, 0.002)

	if a_magnus_backspin.y > 0.0 and is_zero_approx(a_magnus_backspin.x) and is_zero_approx(a_magnus_backspin.z):
		print("  [PASS] Backspin generates pure upward acceleration (float: a_y = +%.2f m/s^2)" % a_magnus_backspin.y)
		passed_tests += 1
	else:
		printerr("  [FAIL] Backspin failed: accel = %s" % a_magnus_backspin)

	# Test 3: Magnus Sidespin Lateral Break
	# Sidespin omega = Vector3(0, 10.0, 0)
	# omega x v = (0, 10, 0) x (0, 0, -20) = (-200, 0, 0) -> Leftward X acceleration
	total_tests += 1
	var omega_sidespin: Vector3 = Vector3(0, 10.0, 0)
	var a_magnus_sidespin: Vector3 = Aerodynamics.calculate_magnus_acceleration(omega_sidespin, v_forward, 0.5, 0.002)

	if a_magnus_sidespin.x < 0.0 and is_zero_approx(a_magnus_sidespin.y) and is_zero_approx(a_magnus_sidespin.z):
		print("  [PASS] Sidespin generates pure lateral acceleration (curve: a_x = %.2f m/s^2)" % a_magnus_sidespin.x)
		passed_tests += 1
	else:
		printerr("  [FAIL] Sidespin failed: accel = %s" % a_magnus_sidespin)

	# Test 4: Magnus Acceleration Perpendicularity
	# By vector definition, (omega x v) must be orthogonal to both omega and v
	total_tests += 1
	var v_arb: Vector3 = Vector3(15.0, -8.0, 22.0)
	var omega_arb: Vector3 = Vector3(5.0, 12.0, -3.0)
	var a_arb: Vector3 = Aerodynamics.calculate_magnus_acceleration(omega_arb, v_arb)
	var dot_v: float = a_arb.dot(v_arb)
	var dot_omega: float = a_arb.dot(omega_arb)

	if is_zero_approx(dot_v) and is_zero_approx(dot_omega):
		print("  [PASS] Magnus force is strictly orthogonal to velocity and spin vectors")
		passed_tests += 1
	else:
		printerr("  [FAIL] Orthogonality failed: dot_v=%.6f, dot_omega=%.6f" % [dot_v, dot_omega])

	# Test 5: Aerodynamic Drag Quadratic Scaling
	# Doubling speed must quadruple drag force (F_drag proportional to v^2)
	total_tests += 1
	var v1: Vector3 = Vector3(0, 0, 10.0)
	var v2: Vector3 = Vector3(0, 0, 20.0)
	var f1: Vector3 = Aerodynamics.calculate_drag_force(v1)
	var f2: Vector3 = Aerodynamics.calculate_drag_force(v2)
	var ratio: float = f2.length() / f1.length()

	if is_equal_approx(ratio, 4.0):
		print("  [PASS] Quadratic aerodynamic drag verified: 2x speed yielded %.2fx drag force" % ratio)
		passed_tests += 1
	else:
		printerr("  [FAIL] Drag quadratic scaling expected 4.0, got %.4f" % ratio)

	# Test 6: Induced Drag Turn-Rate Scaling
	# Doubling turn rate (30 deg/s to 60 deg/s) must quadruple induced braking force
	total_tests += 1
	var ind_drag_30: Vector3 = Aerodynamics.calculate_induced_drag_force(Vector3(0, 0, -50), 30.0)
	var ind_drag_60: Vector3 = Aerodynamics.calculate_induced_drag_force(Vector3(0, 0, -50), 60.0)
	var ind_ratio: float = ind_drag_60.length() / ind_drag_30.length()

	if is_equal_approx(ind_ratio, 4.0):
		print("  [PASS] Induced drag scaling verified: 2x turn rate yielded %.2fx induced drag" % ind_ratio)
		passed_tests += 1
	else:
		printerr("  [FAIL] Induced drag scaling expected 4.0, got %.4f" % ind_ratio)

	# Test 7: Spin Bounce Deflection
	# Ball traveling down (v_y = -10, v_z = -10) with heavy topspin (omega_x = -30) contacts floor
	total_tests += 1
	var v_bounce_in: Vector3 = Vector3(0, -10.0, -10.0)
	var omega_heavy_topspin: Vector3 = Vector3(-30.0, 0, 0) # Topspin exceeds linear speed -> kicks forward!
	var bounce_res: Dictionary = Aerodynamics.resolve_spin_bounce(
		v_bounce_in, Vector3.UP, omega_heavy_topspin, 0.85, 0.3, 0.5
	)
	var v_out: Vector3 = bounce_res.velocity

	# v_y must be reflected (+8.5 m/s), and v_z must accelerate forward (< -10.0 m/s)
	if v_out.y > 0.0 and is_equal_approx(v_out.y, 8.5) and v_out.z < v_bounce_in.z:
		print("  [PASS] Spin bounce resolved normal restitution (vy = +%.2f) and topspin forward kick (vz = %.2f -> %.2f)" % [v_out.y, v_bounce_in.z, v_out.z])
		passed_tests += 1
	else:
		printerr("  [FAIL] Spin bounce failed: v_out = %s" % v_out)

	# Test 8: Deterministic Substep Numerical Integration
	total_tests += 1
	var initial_pos: Vector3 = Vector3(0, 10, 0)
	var initial_vel: Vector3 = Vector3(0, 0, -30)
	var initial_spin: Vector3 = Vector3(-15, 0, 0)
	var substep_res: Dictionary = Aerodynamics.integrate_substeps(initial_pos, initial_vel, initial_spin, 0.1, 4)

	if substep_res.position.z < initial_pos.z and substep_res.position.y < initial_pos.y:
		print("  [PASS] Deterministic RK2 multi-substep integration executed cleanly")
		passed_tests += 1
	else:
		printerr("  [FAIL] Substep integration failed")

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
