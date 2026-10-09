extends SceneTree

## Headless Unit Test: Scene Instantiation & Hierarchy Integrity
## Verifies that all game scenes instantiate without missing resources, broken paths, or null references.

const SCENE_PATHS: Array[String] = [
	"res://scenes/ball.tscn",
	"res://scenes/vehicle.tscn",
	"res://scenes/hud.tscn",
	"res://scenes/arena.tscn",
	"res://scenes/main.tscn"
]

func _init() -> void:
	print("\n=== [TEST SUITE] Scene Instantiation & Resource Integrity ===")
	var total_tests: int = 0
	var passed_tests: int = 0

	for scene_path in SCENE_PATHS:
		total_tests += 1
		print("  Loading scene: %s" % scene_path)
		var packed_scene = load(scene_path) as PackedScene
		if packed_scene == null:
			printerr("  [FAIL] Could not load resource at %s" % scene_path)
			continue

		var instance = packed_scene.instantiate()
		if instance == null:
			printerr("  [FAIL] Could not instantiate scene from %s" % scene_path)
			continue

		root.add_child(instance)
		print("  [PASS] Scene '%s' instantiated successfully as %s" % [scene_path.get_file(), instance.get_class()])
		passed_tests += 1

		# Verify specific key components
		if instance is MainGame:
			total_tests += 1
			var b = instance.get_node_or_null("Ball")
			var v = instance.get_node_or_null("Vehicle")
			var h = instance.get_node_or_null("TacticalHUD")
			var gm = instance.get_node_or_null("GameManager")
			var srv = instance.get_node_or_null("EmbeddedServer")
			if b != null and v != null and h != null and gm != null and srv != null:
				print("  [PASS] MainGame has valid Ball, Vehicle, TacticalHUD, GameManager, and EmbeddedServer nodes")
				passed_tests += 1
			else:
				printerr("  [FAIL] MainGame node bindings incomplete: ball=%s, vehicle=%s, hud=%s" % [b, v, h])

		instance.queue_free()

	# Summary
	print("--- Result: %d / %d Tests Passed ---" % [passed_tests, total_tests])
	if passed_tests == total_tests:
		print(">>> SUITE PASSED <<<\n")
		quit(0)
	else:
		printerr(">>> SUITE FAILED <<<\n")
		quit(1)
