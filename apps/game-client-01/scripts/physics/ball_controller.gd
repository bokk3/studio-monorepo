class_name BallController
extends RigidBody3D

## Aerodynamic Ball for Astro-Smash: Arena
## Applies real-time Magnus effect acceleration and quadratic drag in 3D space.

signal goal_scored(scoring_team: int)

@export var ball_radius: float = PhysicsConstants.BALL_RADIUS
@export var ball_mass: float = PhysicsConstants.BALL_MASS
@export var magnus_s0: float = PhysicsConstants.BALL_MAGNUS_COEFFICIENT
@export var drag_cd: float = PhysicsConstants.BALL_DRAG_COEFFICIENT

# Visual trail / spin indicators
var current_magnus_force: Vector3 = Vector3.ZERO
var current_drag_force: Vector3 = Vector3.ZERO

func _ready() -> void:
	mass = ball_mass
	gravity_scale = 1.0
	continuous_cd = true # Continuous collision detection to prevent tunneling

## Custom physics integrator injecting real aerodynamic forces every tick
func _integrate_forces(state: PhysicsDirectBodyState3D) -> void:
	var vel: Vector3 = state.linear_velocity
	var omega: Vector3 = state.angular_velocity

	# 1. Magnus Effect Force: F_magnus = S0 * (omega x v)
	if not vel.is_zero_approx() and not omega.is_zero_approx():
		current_magnus_force = magnus_s0 * omega.cross(vel)
		state.apply_central_force(current_magnus_force)
	else:
		current_magnus_force = Vector3.ZERO

	# 2. Quadratic Aerodynamic Drag: F_drag = -0.5 * rho * Cd * A * |v| * v
	current_drag_force = Aerodynamics.calculate_drag_force(
		vel,
		PhysicsConstants.AIR_DENSITY,
		drag_cd,
		PhysicsConstants.BALL_CROSS_SECTION
	)
	state.apply_central_force(current_drag_force)

	# 3. Terminal Safety Velocity Clamp
	var speed: float = vel.length()
	if speed > PhysicsConstants.BALL_MAX_SPEED:
		state.linear_velocity = vel.normalized() * PhysicsConstants.BALL_MAX_SPEED

## Strikes the ball with linear momentum and angular spin
## e.g., topspin (negative X in craft frame), backspin (positive X), curve (Y axis)
func strike(linear_impulse: Vector3, spin_vector: Vector3) -> void:
	apply_central_impulse(linear_impulse)
	apply_torque_impulse(spin_vector)

## Resets ball to center kickoff position
func reset_to_center(initial_height: float = 2.0) -> void:
	global_position = Vector3(0, initial_height, 0)
	linear_velocity = Vector3.ZERO
	angular_velocity = Vector3.ZERO
