extends SceneTree

## Unified Headless QA Test Runner for Astro-Smash: Arena
## Adheres strictly to Section 3 of AGENTS.md

const SUITES: Array[String] = [
	"res://tests/test_binary_frame_codec.gd",
	"res://tests/test_aerodynamics.gd",
	"res://tests/test_lcos_targeting.gd",
	"res://tests/test_vehicle_dynamics.gd",
	"res://tests/test_game_manager.gd",
	"res://tests/test_scenes_instantiation.gd",
	"res://tests/test_embedded_server.gd"
]

func _init() -> void:
	print("\n========================================================")
	print("  TACHYON STUDIOS // ASTRO-SMASH: ARENA HEADLESS QA HARNESS")
	print("========================================================")

	var godot_bin: String = OS.get_executable_path()
	var total_suites: int = SUITES.size()
	var passed_suites: int = 0
	var failed_suites: int = 0

	for suite_path in SUITES:
		var suite_name: String = suite_path.get_file()
		print("\n>> Executing Test Suite: %s ..." % suite_name)
		
		var output: Array = []
		var args: PackedStringArray = [
			"--headless",
			"--path", ".",
			"-s", suite_path
		]

		var exit_code: int = OS.execute(godot_bin, args, output, true)

		# Print suite execution log
		if output.size() > 0:
			for line in output:
				print(line)

		if exit_code == 0:
			print(">> Suite '%s' -> [PASSED]" % suite_name)
			passed_suites += 1
		else:
			printerr(">> Suite '%s' -> [FAILED] (Exit Code: %d)" % [suite_name, exit_code])
			failed_suites += 1

	print("\n========================================================")
	print("  QA TEST HARNESS SUMMARY:")
	print("  Total Suites Executed: %d" % total_suites)
	print("  Suites Passed:         %d" % passed_suites)
	print("  Suites Failed:         %d" % failed_suites)
	print("========================================================")

	if failed_suites == 0:
		print(">>> ALL ASTRO-SMASH: ARENA HEADLESS TESTS PASSED (100%) <<<\n")
		quit(0)
	else:
		printerr(">>> TEST SUITE REGRESSIONS DETECTED: %d FAILED <<<\n" % failed_suites)
		quit(1)
