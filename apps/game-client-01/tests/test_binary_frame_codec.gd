extends SceneTree

## Headless Unit Test: BinaryFrameCodec (16-Byte Network Protocol)
## Verifies bitmasks, floating point precision, sequence numbers, and telemetry packing.

func _init() -> void:
	print("\n=== [TEST SUITE] BinaryFrameCodec (16-Byte Protocol) ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	var codec = BinaryFrameCodec.new()

	# Test 1: Basic Encode and Decode roundtrip
	total_tests += 1
	var pitch_in: float = 0.75
	var roll_in: float = -0.33
	var throttle_in: float = 0.90
	var bitmask_in: int = BinaryFrameCodec.BIT_BOOST | BinaryFrameCodec.BIT_FIRE
	var power_in: int = BinaryFrameCodec.PowerMode.WEAPONS
	var seq_in: int = 1420

	var packet: PackedByteArray = codec.encode_frame(pitch_in, roll_in, throttle_in, bitmask_in, power_in, seq_in)
	
	if packet.size() == 16:
		print("  [PASS] Packet size is exactly 16 bytes")
		passed_tests += 1
	else:
		printerr("  [FAIL] Packet size expected 16, got %d" % packet.size())

	# Test 2: Verify Unpacked Values
	total_tests += 1
	var decoded = codec.decode_frame(packet)
	if is_equal_approx(decoded.pitch, pitch_in) and is_equal_approx(decoded.roll, roll_in) and is_equal_approx(decoded.throttle, throttle_in):
		print("  [PASS] Float32 Pitch, Roll, Throttle match within epsilon")
		passed_tests += 1
	else:
		printerr("  [FAIL] Float mismatch: pitch=%.4f (exp %.4f), roll=%.4f, throttle=%.4f" % [decoded.pitch, pitch_in, decoded.roll, decoded.throttle])

	# Test 3: Bitmask Flags Verification
	total_tests += 1
	if decoded.boost and decoded.fire and not decoded.missile and not decoded.flare and not decoded.tare:
		print("  [PASS] Bitmask boolean flags (Boost=True, Fire=True, others=False) verified")
		passed_tests += 1
	else:
		printerr("  [FAIL] Bitmask flag mismatch: boost=%s, fire=%s, missile=%s" % [decoded.boost, decoded.fire, decoded.missile])

	# Test 4: Power Mode & Sequence Number
	total_tests += 1
	if decoded.power_mode == BinaryFrameCodec.PowerMode.WEAPONS and decoded.seq_num == seq_in:
		print("  [PASS] Power mode (WEAPONS) and sequence number (%d) verified" % seq_in)
		passed_tests += 1
	else:
		printerr("  [FAIL] PowerMode or SeqNum mismatch: power=%d, seq=%d" % [decoded.power_mode, decoded.seq_num])

	# Test 5: Clamping of Out-of-Bounds Floats
	total_tests += 1
	var clamped_packet = codec.encode_frame(2.5, -4.0, 1.8, 0, 0, 0)
	var clamped_decoded = codec.decode_frame(clamped_packet)
	if is_equal_approx(clamped_decoded.pitch, 1.0) and is_equal_approx(clamped_decoded.roll, -1.0) and is_equal_approx(clamped_decoded.throttle, 1.0):
		print("  [PASS] Out-of-bounds float inputs correctly clamped to [-1.0, 1.0] and [0.0, 1.0]")
		passed_tests += 1
	else:
		printerr("  [FAIL] Clamping failed: pitch=%.2f, roll=%.2f, throttle=%.2f" % [clamped_decoded.pitch, clamped_decoded.roll, clamped_decoded.throttle])

	# Test 6: Make Bitmask Helper
	total_tests += 1
	var custom_mask = BinaryFrameCodec.make_bitmask(false, false, true, true, false)
	var expected_mask = BinaryFrameCodec.BIT_MISSILE | BinaryFrameCodec.BIT_FLARE
	if custom_mask == expected_mask:
		print("  [PASS] make_bitmask helper correctly generated mask (0x%X)" % custom_mask)
		passed_tests += 1
	else:
		printerr("  [FAIL] make_bitmask returned 0x%X, expected 0x%X" % [custom_mask, expected_mask])

	# Test 7: Reverse Telemetry Packing & Decoding
	total_tests += 1
	var telem_packet = codec.encode_telemetry(85, 90, 72, BinaryFrameCodec.ALERT_STALL_WARNING, 68.5, 14.2, 1.0)
	var telem_decoded = codec.decode_telemetry(telem_packet)
	if telem_decoded != null and telem_decoded.hull_percent == 85 and telem_decoded.shield_percent == 90 and is_equal_approx(telem_decoded.speed, 68.5):
		print("  [PASS] Reverse telemetry 16-byte packet encoded and decoded accurately")
		passed_tests += 1
	else:
		printerr("  [FAIL] Telemetry decode failed")

	# Test 8: Rejection of Corrupt / Short Packets
	total_tests += 1
	var short_packet = PackedByteArray([1, 2, 3, 4])
	var corrupt_result = codec.decode_frame(short_packet)
	if corrupt_result == null:
		print("  [PASS] Undersized packet (<16 bytes) safely rejected returning null")
		passed_tests += 1
	else:
		printerr("  [FAIL] Short packet was not rejected")

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
