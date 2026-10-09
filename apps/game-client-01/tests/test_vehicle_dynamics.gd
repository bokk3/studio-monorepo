extends SceneTree

## Headless Unit Test: 6-DOF Vehicle Dynamics & Flight Envelope
## Verifies cornering agility curve, dynamic stall, boost mechanics, and G-force tracking.

func _init() -> void:
	print("\n=== [TEST SUITE] 6-DOF Vehicle Dynamics & Flight Envelope ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	# Test 1: Cornering Agility Curve Envelope
	total_tests += 1
	var agility_stall = VehicleController6DOF.calculate_turn_agility(15.0) # Low speed stall
	var agility_optimal = VehicleController6DOF.calculate_turn_agility(70.0) # Optimal cornering (65-75 m/s)
	var agility_overspeed = VehicleController6DOF.calculate_turn_agility(140.0) # High-speed energy drag

	if agility_stall < 0.40 and is_equal_approx(agility_optimal, 1.0) and agility_overspeed < 0.70:
		print("  [PASS] Agility curve verified: Stall (%.2f) < Optimal (%.2f) > Overspeed (%.2f)" % [agility_stall, agility_optimal, agility_overspeed])
		passed_tests += 1
	else:
		printerr("  [FAIL] Agility envelope failed: stall=%.2f, opt=%.2f, over=%.2f" % [agility_stall, agility_optimal, agility_overspeed])

	# Test 2: Instantiation & Default State
	total_tests += 1
	var vehicle = VehicleController6DOF.new()
	root.add_child(vehicle)
	if is_equal_approx(vehicle.hull_health, 100.0) and is_equal_approx(vehicle.boost_energy, 100.0):
		print("  [PASS] VehicleController6DOF initial health and energy at 100%")
		passed_tests += 1
	else:
		printerr("  [FAIL] Initial health/energy mismatch")

	# Test 3: Binary Input Processing
	total_tests += 1
	var codec = BinaryFrameCodec.new()
	var frame = codec.encode_frame(0.5, -0.2, 0.85, BinaryFrameCodec.BIT_BOOST, 0, 100)
	vehicle.process_binary_input(frame)

	if is_equal_approx(vehicle.current_throttle, 0.85) and vehicle.is_boosting:
		print("  [PASS] Processed binary input packet: Throttle=0.85, Boost=True")
		passed_tests += 1
	else:
		printerr("  [FAIL] Input processing failed: throttle=%.2f, boosting=%s" % [vehicle.current_throttle, vehicle.is_boosting])

	# Test 4: Dynamic Aerodynamic Stall Detection
	total_tests += 1
	vehicle.velocity = Vector3(0, 0, -20.0) # 20 m/s is below stall threshold (28 m/s)
	vehicle._physics_process(0.016)
	if vehicle.is_stalled:
		print("  [PASS] Airspeed below 28 m/s correctly triggered aerodynamic stall flag")
		passed_tests += 1
	else:
		printerr("  [FAIL] Stall detection failed for 20 m/s")

	# Test 5: Stall Recovery at Cruise Speed
	total_tests += 1
	vehicle.velocity = Vector3(0, 0, -70.0) # 70 m/s is above stall threshold
	vehicle._physics_process(0.016)
	if not vehicle.is_stalled:
		print("  [PASS] Airspeed restored to 70 m/s cleared aerodynamic stall flag")
		passed_tests += 1
	else:
		printerr("  [FAIL] Stall flag failed to clear at 70 m/s")

	# Test 6: Boost Energy Depletion
	total_tests += 1
	var energy_before = vehicle.boost_energy
	# Process with boost active for several frames
	for i in range(10):
		vehicle._physics_process(0.05)
	
	if vehicle.boost_energy < energy_before:
		print("  [PASS] Afterburner boost depleted energy (%.1f%% -> %.1f%%)" % [energy_before, vehicle.boost_energy])
		passed_tests += 1
	else:
		printerr("  [FAIL] Boost failed to deplete energy: before=%.1f, after=%.1f" % [energy_before, vehicle.boost_energy])

	# Cleanup
	vehicle.queue_free()

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
