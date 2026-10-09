class_name PhysicsConstants
extends RefCounted

## Atmospheric & Aerodynamic Constants
const AIR_DENSITY: float = 1.225 # kg/m^3 standard sea level
const GRAVITY: float = 9.80665 # m/s^2

## Ball Physical Properties (Astro-Smash Ball)
const BALL_RADIUS: float = 0.5 # meters
const BALL_MASS: float = 0.50 # kg
const BALL_CROSS_SECTION: float = PI * BALL_RADIUS * BALL_RADIUS # ~0.785 m^2
const BALL_DRAG_COEFFICIENT: float = 0.45 # Spherical aerodynamic drag
const BALL_MAGNUS_COEFFICIENT: float = 0.0018 # S0 calibrated for punchy curves
const BALL_RESTITUTION: float = 0.88 # Table/wall bounce bounciness
const BALL_FRICTION: float = 0.28 # Spin-to-velocity friction coefficient
const BALL_MAX_SPEED: float = 120.0 # m/s terminal safety cap

## Vehicle Dynamics (6-DOF Jet/Hover Brawler)
const VEHICLE_MASS: float = 1200.0 # kg
const THRUST_FORWARD: float = 38000.0 # Newtons
const THRUST_BOOST_MULTIPLIER: float = 1.85 # Afterburner boost
const THRUST_BRAKE: float = 24000.0 # Newtons
const THRUST_LATERAL: float = 18000.0 # Strafe thrusters
const THRUST_VERTICAL: float = 22000.0 # Vertical lift thrusters

## Flight Envelope & Aerodynamics
const STALL_AIRSPEED: float = 28.0 # m/s
const CORNERING_AIRSPEED_MIN: float = 65.0 # m/s (Optimal agility window)
const CORNERING_AIRSPEED_MAX: float = 75.0 # m/s
const CRUISE_AIRSPEED: float = 70.0 # m/s
const MAX_BOOST_AIRSPEED: float = 140.0 # m/s
const INDUCED_DRAG_FACTOR: float = 0.0042 # Drag penalty per (deg/s)^2 of turn rate

## Human Physiological G-Force Tolerances
const G_BLACKOUT_THRESHOLD: float = 7.5 # Positive G limit (pitch-up)
const G_REDOUT_THRESHOLD: float = -3.0 # Negative G limit (pitch-down)
const G_LOC_TIMEOUT: float = 3.5 # Seconds over-G before G-LOC

## Gunnery & Targeting (LCOS)
const CANNON_MUZZLE_VELOCITY: float = 1200.0 # m/s
const AIM_ASSIST_CONE_DEG: float = 5.0 # Degrees
const AIM_ASSIST_MAX_BEND_DEG: float = 2.5 # Degrees
