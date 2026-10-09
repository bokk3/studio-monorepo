class_name LCOSTargeting
extends RefCounted

## Lead Computing Optical Sight (LCOS) & Gunnery Fire Control
## Computes predictive ballistic intercepts and subtle trajectory magnetism.

## Calculates the predictive intercept position and time-to-impact
## using quadratic solution for moving target interception.
static func calculate_lead_intercept(
	shooter_position: Vector3,
	target_position: Vector3,
	target_velocity: Vector3,
	projectile_speed: float = PhysicsConstants.CANNON_MUZZLE_VELOCITY,
	shooter_velocity: Vector3 = Vector3.ZERO
) -> Dictionary:
	var rel_pos: Vector3 = target_position - shooter_position
	# Relative target velocity from shooter's frame of reference
	var rel_vel: Vector3 = target_velocity - shooter_velocity

	var dist_sq: float = rel_pos.length_squared()
	if dist_sq < 0.001:
		return {
			"valid": true,
			"intercept_point": target_position,
			"time_to_intercept": 0.0,
			"aim_direction": -rel_pos.normalized()
		}

	# Quadratic equation coefficients: a*t^2 + b*t + c = 0
	var a: float = rel_vel.dot(rel_vel) - (projectile_speed * projectile_speed)
	var b: float = 2.0 * rel_pos.dot(rel_vel)
	var c: float = dist_sq

	var time_to_intercept: float = -1.0

	if absf(a) < 0.0001:
		# Linear fallback when relative speed matches projectile speed
		if absf(b) > 0.0001:
			var t: float = -c / b
			if t > 0.0:
				time_to_intercept = t
	else:
		var discriminant: float = b * b - 4.0 * a * c
		if discriminant >= 0.0:
			var sqrt_disc: float = sqrt(discriminant)
			var t1: float = (-b - sqrt_disc) / (2.0 * a)
			var t2: float = (-b + sqrt_disc) / (2.0 * a)

			if t1 > 0.0 and t2 > 0.0:
				time_to_intercept = minf(t1, t2)
			elif t1 > 0.0:
				time_to_intercept = t1
			elif t2 > 0.0:
				time_to_intercept = t2

	if time_to_intercept <= 0.0:
		# No valid future intercept possible (target escaping faster than projectile)
		return {
			"valid": false,
			"intercept_point": target_position,
			"time_to_intercept": 0.0,
			"aim_direction": rel_pos.normalized()
		}

	var intercept_point: Vector3 = target_position + (rel_vel * time_to_intercept)
	var aim_dir: Vector3 = (intercept_point - shooter_position).normalized()

	return {
		"valid": true,
		"intercept_point": intercept_point,
		"time_to_intercept": time_to_intercept,
		"aim_direction": aim_dir
	}

## Applies subtle trajectory magnetism if target is within a narrow cone
## Bends the trajectory up to max_bend_deg toward the ideal intercept direction.
static func apply_aim_assist(
	boresight_direction: Vector3,
	ideal_aim_direction: Vector3,
	max_cone_deg: float = PhysicsConstants.AIM_ASSIST_CONE_DEG,
	max_bend_deg: float = PhysicsConstants.AIM_ASSIST_MAX_BEND_DEG
) -> Vector3:
	var forward: Vector3 = boresight_direction.normalized()
	var ideal: Vector3 = ideal_aim_direction.normalized()

	var dot: float = clampf(forward.dot(ideal), -1.0, 1.0)
	var angle_rad: float = acos(dot)
	var angle_deg: float = rad_to_deg(angle_rad)

	# Outside acquisition cone: no aim assistance
	if angle_deg > max_cone_deg or angle_deg < 0.001:
		return forward

	# Calculate bend factor (proportional magnetism)
	var bend_amount_deg: float = minf(angle_deg, max_bend_deg)
	var weight: float = bend_amount_deg / angle_deg

	return forward.slerp(ideal, weight).normalized()
