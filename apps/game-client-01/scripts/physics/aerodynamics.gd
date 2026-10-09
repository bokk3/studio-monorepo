class_name Aerodynamics
extends RefCounted

## Aerodynamic Physics Engine
## Computes Magnus effect, quadratic drag, induced drag, and spin-bounce conversions.

## Computes the Magnus acceleration vector:
## a_magnus = (S0 / m) * (omega x v)
static func calculate_magnus_acceleration(
	angular_velocity: Vector3, # omega (rad/s)
	velocity: Vector3,         # v (m/s)
	mass: float = PhysicsConstants.BALL_MASS,
	s0: float = PhysicsConstants.BALL_MAGNUS_COEFFICIENT
) -> Vector3:
	if mass <= 0.0 or velocity.is_zero_approx() or angular_velocity.is_zero_approx():
		return Vector3.ZERO
	var lift_force: Vector3 = s0 * angular_velocity.cross(velocity)
	return lift_force / mass

## Computes quadratic aerodynamic drag force:
## F_drag = -0.5 * rho * Cd * A * |v| * v
static func calculate_drag_force(
	velocity: Vector3,
	air_density: float = PhysicsConstants.AIR_DENSITY,
	drag_coeff: float = PhysicsConstants.BALL_DRAG_COEFFICIENT,
	cross_section: float = PhysicsConstants.BALL_CROSS_SECTION
) -> Vector3:
	var speed_sq: float = velocity.length_squared()
	if speed_sq < 0.0001:
		return Vector3.ZERO
	var speed: float = sqrt(speed_sq)
	var drag_magnitude: float = 0.5 * air_density * drag_coeff * cross_section * speed_sq
	return -velocity.normalized() * drag_magnitude

## Computes total linear acceleration on a projectile in flight
static func calculate_total_acceleration(
	velocity: Vector3,
	angular_velocity: Vector3,
	mass: float = PhysicsConstants.BALL_MASS,
	gravity: Vector3 = Vector3(0, -PhysicsConstants.GRAVITY, 0),
	air_density: float = PhysicsConstants.AIR_DENSITY,
	drag_coeff: float = PhysicsConstants.BALL_DRAG_COEFFICIENT,
	cross_section: float = PhysicsConstants.BALL_CROSS_SECTION,
	s0: float = PhysicsConstants.BALL_MAGNUS_COEFFICIENT
) -> Vector3:
	var a_magnus: Vector3 = calculate_magnus_acceleration(angular_velocity, velocity, mass, s0)
	var f_drag: Vector3 = calculate_drag_force(velocity, air_density, drag_coeff, cross_section)
	var a_drag: Vector3 = f_drag / mass if mass > 0.0 else Vector3.ZERO
	return gravity + a_magnus + a_drag

## Computes induced drag energy bleed for turning aircraft/vehicles:
## Bleeds forward speed proportional to turn rate squared.
static func calculate_induced_drag_force(
	forward_velocity: Vector3,
	turn_rate_deg: float,
	induced_factor: float = PhysicsConstants.INDUCED_DRAG_FACTOR
) -> Vector3:
	var speed: float = forward_velocity.length()
	if speed < 0.01:
		return Vector3.ZERO
	var drag_ratio: float = induced_factor * (turn_rate_deg * turn_rate_deg)
	return -forward_velocity.normalized() * (drag_ratio * speed * 100.0)

## Resolves surface collision with spin conversion:
## Evaluates restitution, tangential slip, spin-to-velocity kick, and angular damping.
static func resolve_spin_bounce(
	incoming_velocity: Vector3,
	surface_normal: Vector3,
	incoming_spin: Vector3,
	restitution: float = PhysicsConstants.BALL_RESTITUTION,
	friction: float = PhysicsConstants.BALL_FRICTION,
	radius: float = PhysicsConstants.BALL_RADIUS
) -> Dictionary:
	var n: Vector3 = surface_normal.normalized()
	var v_norm: float = incoming_velocity.dot(n)
	
	# Only bounce if moving towards the surface
	if v_norm >= 0.0:
		return {
			"velocity": incoming_velocity,
			"angular_velocity": incoming_spin
		}

	# Normal restitution bounce
	var v_normal_reflected: Vector3 = -n * (v_norm * restitution)
	
	# Tangential linear velocity
	var v_tangent: Vector3 = incoming_velocity - (n * v_norm)
	
	# Surface slip velocity at contact patch from rotational spin
	# Contact point relative to center is -radius * n
	# v_contact_spin = omega x (-r * n) = -r * (omega x n)
	var v_contact_spin: Vector3 = -radius * incoming_spin.cross(n)
	var v_slip: Vector3 = v_tangent + v_contact_spin
	
	# Friction impulse opposing slip
	var delta_v_tangent: Vector3 = -friction * v_slip
	var new_v_tangent: Vector3 = v_tangent + delta_v_tangent
	
	# Angular momentum change for solid sphere (I = 2/5 * m * r^2)
	# Delta_omega = (5 / (2 * r)) * (n x delta_v_tangent)
	var delta_spin: Vector3 = (2.5 / radius) * n.cross(delta_v_tangent)
	var new_spin: Vector3 = (incoming_spin + delta_spin) * 0.92 # 8% spin loss to rolling resistance

	var new_velocity: Vector3 = new_v_tangent + v_normal_reflected

	return {
		"velocity": new_velocity,
		"angular_velocity": new_spin
	}

## Deterministic fixed-substep numerical integration (RK2 Midpoint)
static func integrate_substeps(
	position: Vector3,
	velocity: Vector3,
	angular_velocity: Vector3,
	delta: float,
	substeps: int = 4,
	mass: float = PhysicsConstants.BALL_MASS,
	s0: float = PhysicsConstants.BALL_MAGNUS_COEFFICIENT
) -> Dictionary:
	var dt: float = delta / float(substeps)
	var current_pos: Vector3 = position
	var current_vel: Vector3 = velocity
	var current_spin: Vector3 = angular_velocity

	for i in range(substeps):
		# RK2 Step 1: Acceleration at start of substep
		var a1: Vector3 = calculate_total_acceleration(
			current_vel, current_spin, mass,
			Vector3(0, -PhysicsConstants.GRAVITY, 0),
			PhysicsConstants.AIR_DENSITY,
			PhysicsConstants.BALL_DRAG_COEFFICIENT,
			PhysicsConstants.BALL_CROSS_SECTION,
			s0
		)
		
		# Midpoint prediction
		var mid_vel: Vector3 = current_vel + a1 * (0.5 * dt)
		
		# RK2 Step 2: Acceleration at midpoint
		var a2: Vector3 = calculate_total_acceleration(
			mid_vel, current_spin, mass,
			Vector3(0, -PhysicsConstants.GRAVITY, 0),
			PhysicsConstants.AIR_DENSITY,
			PhysicsConstants.BALL_DRAG_COEFFICIENT,
			PhysicsConstants.BALL_CROSS_SECTION,
			s0
		)
		
		current_pos += mid_vel * dt
		current_vel += a2 * dt
		
		# Slight aerodynamic spin decay over time
		current_spin *= (1.0 - 0.015 * dt)

	return {
		"position": current_pos,
		"velocity": current_vel,
		"angular_velocity": current_spin
	}
