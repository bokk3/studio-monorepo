class_name VehicleController6DOF
extends CharacterBody3D

## 6-DOF Jet/Hover Brawler Controller for Astro-Smash: Arena
## Aerodynamically bounded flight model with induced drag, dynamic stall, and G-force simulation.

signal telemetry_updated(telemetry: BinaryFrameCodec.TelemetryData)
signal primary_weapon_fired(origin: Vector3, direction: Vector3)

@export var vehicle_id: int = 1
@export var team_id: int = 1 # 1: Cyan, 2: Magenta

# Vehicle State
var current_throttle: float = 0.0
var is_boosting: bool = false
var current_g_force: float = 1.0
var g_loc_timer: float = 0.0
var is_stalled: bool = false
var is_g_loc: bool = false

# Hull & Shield Vitality
var hull_health: float = 100.0
var shield_health: float = 100.0
var boost_energy: float = 100.0

# Current angular turn rate in degrees/sec (for induced drag)
var current_turn_rate_deg: float = 0.0

# References & Codecs
var _frame_codec: BinaryFrameCodec = BinaryFrameCodec.new()
var _current_frame: BinaryFrameCodec.FrameData = BinaryFrameCodec.FrameData.new()
var _cached_telemetry: BinaryFrameCodec.TelemetryData = BinaryFrameCodec.TelemetryData.new()

# Previous velocity for G-force acceleration calculation
var _prev_velocity: Vector3 = Vector3.ZERO

func _ready() -> void:
	pass

## Consumes a 16-byte packed binary frame directly
func process_binary_input(frame_packet: PackedByteArray) -> void:
	_frame_codec.decode_frame(frame_packet, _current_frame)
	apply_frame_input(_current_frame)

## Applies parsed FrameData
func apply_frame_input(frame: BinaryFrameCodec.FrameData) -> void:
	current_throttle = frame.throttle
	is_boosting = frame.boost and (boost_energy > 5.0)

	if frame.fire and not is_g_loc:
		fire_primary_weapon()

## Physics update loop
func _physics_process(delta: float) -> void:
	var xform: Transform3D = global_transform if is_inside_tree() else transform
	var forward_basis: Vector3 = -xform.basis.z.normalized()
	var up_basis: Vector3 = xform.basis.y.normalized()
	var right_basis: Vector3 = xform.basis.x.normalized()

	var airspeed: float = velocity.dot(forward_basis)
	var speed: float = velocity.length()

	# 1. Update Dynamic Aerodynamic Stall State
	is_stalled = (speed < PhysicsConstants.STALL_AIRSPEED)

	# 2. Control Surface Authority (Agility Curve based on airspeed)
	var agility_factor: float = calculate_turn_agility(speed)
	if is_g_loc:
		agility_factor *= 0.15 # Heavily dampened stick input during G-LOC

	# 3. Angular Rotation Integration (Pitch & Roll from inputs)
	var target_pitch_rate: float = _current_frame.pitch * 60.0 * agility_factor
	var target_roll_rate: float = _current_frame.roll * 90.0 * agility_factor
	
	rotate_object_local(Vector3.RIGHT, deg_to_rad(target_pitch_rate * delta))
	rotate_object_local(Vector3.FORWARD, deg_to_rad(target_roll_rate * delta))

	current_turn_rate_deg = absf(target_pitch_rate) + absf(target_roll_rate) * 0.5

	# 4. Thrust & Afterburner Boost Forces
	var thrust_magnitude: float = current_throttle * PhysicsConstants.THRUST_FORWARD
	if is_boosting:
		thrust_magnitude *= PhysicsConstants.THRUST_BOOST_MULTIPLIER
		boost_energy = maxf(0.0, boost_energy - 35.0 * delta)
	else:
		boost_energy = minf(100.0, boost_energy + 15.0 * delta)

	var thrust_force: Vector3 = forward_basis * thrust_magnitude

	# 5. Aerodynamic Lift vs Gravity
	# At cruise speed (>= 65 m/s), lift equals 1.0g. Below stall, lift collapses.
	var lift_ratio: float = 0.0
	if speed >= PhysicsConstants.STALL_AIRSPEED:
		lift_ratio = clampf((speed - PhysicsConstants.STALL_AIRSPEED) / (PhysicsConstants.CRUISE_AIRSPEED - PhysicsConstants.STALL_AIRSPEED), 0.0, 1.2)
	
	var gravity_force: Vector3 = Vector3(0, -PhysicsConstants.GRAVITY * PhysicsConstants.VEHICLE_MASS, 0)
	var lift_force: Vector3 = up_basis * (PhysicsConstants.GRAVITY * PhysicsConstants.VEHICLE_MASS * lift_ratio)

	# 6. Aerodynamic Drag & Induced Drag (Braking on tight turns)
	var parasitic_drag: Vector3 = Aerodynamics.calculate_drag_force(
		velocity,
		PhysicsConstants.AIR_DENSITY,
		0.35, # Streamlined craft drag coefficient
		2.4   # Frontal area m^2
	)
	var induced_drag: Vector3 = Aerodynamics.calculate_induced_drag_force(
		velocity,
		current_turn_rate_deg,
		PhysicsConstants.INDUCED_DRAG_FACTOR
	)

	# Total Force & Acceleration
	var total_force: Vector3 = thrust_force + gravity_force + lift_force + parasitic_drag + induced_drag
	var linear_accel: Vector3 = total_force / PhysicsConstants.VEHICLE_MASS

	velocity += linear_accel * delta

	# Move vehicle using CharacterBody3D if in tree, otherwise kinematic advance
	if is_inside_tree():
		move_and_slide()
	else:
		position += velocity * delta

	# 7. G-Force Calculation & Physiological State
	var accel_vec: Vector3 = (velocity - _prev_velocity) / delta if delta > 0.0 else Vector3.ZERO
	_prev_velocity = velocity

	# Normal G along vehicle Up axis (1.0g at level rest)
	current_g_force = (accel_vec.dot(up_basis) / PhysicsConstants.GRAVITY) + 1.0

	# Track G-LOC threshold
	if current_g_force > PhysicsConstants.G_BLACKOUT_THRESHOLD or current_g_force < PhysicsConstants.G_REDOUT_THRESHOLD:
		g_loc_timer += delta
		if g_loc_timer >= PhysicsConstants.G_LOC_TIMEOUT:
			is_g_loc = true
	else:
		g_loc_timer = maxf(0.0, g_loc_timer - delta * 1.5)
		if g_loc_timer <= 0.5:
			is_g_loc = false

	# 8. Build Telemetry Frame (10Hz)
	_build_telemetry()

## Calculates turn agility curve: peaks in optimal cornering envelope (65-75 m/s)
static func calculate_turn_agility(speed: float) -> float:
	if speed < PhysicsConstants.STALL_AIRSPEED:
		return clampf((speed / PhysicsConstants.STALL_AIRSPEED) * 0.4, 0.15, 0.4)
	elif speed < PhysicsConstants.CORNERING_AIRSPEED_MIN:
		# Rising ramp from stall recovery up to optimal cornering window
		var t: float = (speed - PhysicsConstants.STALL_AIRSPEED) / (PhysicsConstants.CORNERING_AIRSPEED_MIN - PhysicsConstants.STALL_AIRSPEED)
		return lerpf(0.4, 1.0, t)
	elif speed <= PhysicsConstants.CORNERING_AIRSPEED_MAX:
		# Peak optimal cornering envelope (65-75 m/s)
		return 1.0
	else:
		# High-speed inertia widen
		var overspeed: float = speed - PhysicsConstants.CORNERING_AIRSPEED_MAX
		return maxf(0.35, 1.0 - (overspeed / 100.0) * 0.65)

func fire_primary_weapon() -> void:
	var xform: Transform3D = global_transform if is_inside_tree() else transform
	var pos: Vector3 = global_position if is_inside_tree() else position
	var forward: Vector3 = -xform.basis.z.normalized()
	primary_weapon_fired.emit(pos + forward * 2.0, forward)

func _build_telemetry() -> void:
	var alerts: int = 0
	if is_stalled: alerts |= BinaryFrameCodec.ALERT_STALL_WARNING
	if is_g_loc: alerts |= BinaryFrameCodec.ALERT_OVER_G_WARNING

	_cached_telemetry.hull_percent = int(hull_health)
	_cached_telemetry.shield_percent = int(shield_health)
	_cached_telemetry.energy_percent = int(boost_energy)
	_cached_telemetry.alert_flags = alerts
	_cached_telemetry.speed = velocity.length()
	_cached_telemetry.altitude = global_position.y if is_inside_tree() else position.y
	_cached_telemetry.g_force = current_g_force

	telemetry_updated.emit(_cached_telemetry)
