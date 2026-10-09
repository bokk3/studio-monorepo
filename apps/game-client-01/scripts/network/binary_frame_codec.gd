class_name BinaryFrameCodec
extends RefCounted

## 16-Byte Packed Binary Protocol Codec
## Parity with @studio/shared-network (NetworkManager.ts)

const FRAME_SIZE: int = 16
const TELEMETRY_FRAME_SIZE: int = 16

# Button/Trigger Bitmasks (Byte 12)
const BIT_BOOST: int = 1 << 0   # 0x01: Boost / Afterburner
const BIT_FIRE: int = 1 << 1    # 0x02: Primary Fire / Kinetic Strike
const BIT_MISSILE: int = 1 << 2 # 0x04: Secondary Weapon / Tactical Ability
const BIT_FLARE: int = 1 << 3   # 0x08: Defensive Flare / Barrier
const BIT_TARE: int = 1 << 4    # 0x10: Zero-Tare Gyro Baseline

# Power Modes (Byte 13)
enum PowerMode {
	BALANCED = 0,
	WEAPONS = 1,
	SHIELDS = 2,
	ENGINES = 3
}

# Telemetry Alert Flags
const ALERT_MISSILE_WARNING: int = 1 << 0
const ALERT_TARGET_LOCKED: int = 1 << 1
const ALERT_STALL_WARNING: int = 1 << 2
const ALERT_OVER_G_WARNING: int = 1 << 3

## Container for unpacked frame data
class FrameData extends RefCounted:
	var pitch: float = 0.0
	var roll: float = 0.0
	var throttle: float = 0.0
	var bitmask: int = 0
	var boost: bool = false
	var fire: bool = false
	var missile: bool = false
	var flare: bool = false
	var tare: bool = false
	var power_mode: int = 0
	var seq_num: int = 0

	func reset() -> void:
		pitch = 0.0
		roll = 0.0
		throttle = 0.0
		bitmask = 0
		boost = false
		fire = false
		missile = false
		flare = false
		tare = false
		power_mode = 0
		seq_num = 0

## Container for vehicle reverse telemetry (10Hz)
class TelemetryData extends RefCounted:
	var hull_percent: int = 100
	var shield_percent: int = 100
	var energy_percent: int = 100
	var alert_flags: int = 0
	var speed: float = 0.0
	var altitude: float = 0.0
	var g_force: float = 1.0

# Pre-allocated reusable buffer to prevent GC allocations during 60Hz loop
var _send_buffer: PackedByteArray = PackedByteArray()
var _telemetry_buffer: PackedByteArray = PackedByteArray()

func _init() -> void:
	_send_buffer.resize(FRAME_SIZE)
	_send_buffer.fill(0)
	_telemetry_buffer.resize(TELEMETRY_FRAME_SIZE)
	_telemetry_buffer.fill(0)

## Encodes control inputs into a 16-byte packed binary frame
func encode_frame(
	pitch: float,
	roll: float,
	throttle: float,
	bitmask: int,
	power_mode: int = 0,
	seq_num: int = 0
) -> PackedByteArray:
	# Byte 0..3: Pitch (-1.0 to 1.0)
	_send_buffer.encode_float(0, clampf(pitch, -1.0, 1.0))
	# Byte 4..7: Roll (-1.0 to 1.0)
	_send_buffer.encode_float(4, clampf(roll, -1.0, 1.0))
	# Byte 8..11: Throttle (0.0 to 1.0)
	_send_buffer.encode_float(8, clampf(throttle, 0.0, 1.0))
	# Byte 12: Bitmask
	_send_buffer.encode_u8(12, bitmask & 0xFF)
	# Byte 13: Power Mode
	_send_buffer.encode_u8(13, power_mode & 0xFF)
	# Byte 14..15: Sequence Number
	_send_buffer.encode_u16(14, seq_num & 0xFFFF)
	return _send_buffer

## Helper to create bitmask from boolean flags
static func make_bitmask(boost: bool, fire: bool, missile: bool, flare: bool, tare: bool) -> int:
	var mask: int = 0
	if boost: mask |= BIT_BOOST
	if fire: mask |= BIT_FIRE
	if missile: mask |= BIT_MISSILE
	if flare: mask |= BIT_FLARE
	if tare: mask |= BIT_TARE
	return mask

## Decodes a 16-byte packed binary frame into FrameData
func decode_frame(packet: PackedByteArray, out_data: FrameData = null) -> FrameData:
	if packet.size() < FRAME_SIZE:
		push_warning("BinaryFrameCodec: Packet size %d < %d bytes" % [packet.size(), FRAME_SIZE])
		return null
	
	var data: FrameData = out_data
	if data == null:
		data = FrameData.new()

	data.pitch = packet.decode_float(0)
	data.roll = packet.decode_float(4)
	data.throttle = packet.decode_float(8)
	
	var mask: int = packet.decode_u8(12)
	data.bitmask = mask
	data.boost = (mask & BIT_BOOST) != 0
	data.fire = (mask & BIT_FIRE) != 0
	data.missile = (mask & BIT_MISSILE) != 0
	data.flare = (mask & BIT_FLARE) != 0
	data.tare = (mask & BIT_TARE) != 0
	
	data.power_mode = packet.decode_u8(13)
	data.seq_num = packet.decode_u16(14)
	
	return data

## Encodes reverse vehicle telemetry into a 16-byte packed packet
func encode_telemetry(
	hull: int,
	shield: int,
	energy: int,
	alert_flags: int,
	speed: float,
	altitude: float,
	g_force: float
) -> PackedByteArray:
	_telemetry_buffer.encode_u8(0, clampi(hull, 0, 100))
	_telemetry_buffer.encode_u8(1, clampi(shield, 0, 100))
	_telemetry_buffer.encode_u8(2, clampi(energy, 0, 100))
	_telemetry_buffer.encode_u8(3, alert_flags & 0xFF)
	_telemetry_buffer.encode_float(4, speed)
	_telemetry_buffer.encode_float(8, altitude)
	_telemetry_buffer.encode_float(12, g_force)
	return _telemetry_buffer

## Decodes a 16-byte telemetry packet into TelemetryData
func decode_telemetry(packet: PackedByteArray, out_data: TelemetryData = null) -> TelemetryData:
	if packet.size() < TELEMETRY_FRAME_SIZE:
		push_warning("BinaryFrameCodec: Telemetry packet size %d < %d bytes" % [packet.size(), TELEMETRY_FRAME_SIZE])
		return null
	
	var data: TelemetryData = out_data
	if data == null:
		data = TelemetryData.new()

	data.hull_percent = packet.decode_u8(0)
	data.shield_percent = packet.decode_u8(1)
	data.energy_percent = packet.decode_u8(2)
	data.alert_flags = packet.decode_u8(3)
	data.speed = packet.decode_float(4)
	data.altitude = packet.decode_float(8)
	data.g_force = packet.decode_float(12)
	return data
