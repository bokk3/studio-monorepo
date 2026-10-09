# Astro-Smash: Arena // Gameplay Engineering & Technical Architecture

**Department:** Lead Gameplay Engineering  
**Target Title:** Astro-Smash: Arena (Category 1: Web-Based F2P)  
**Engine & Stack:** Godot 4.7.2 (Forward+ / GL Compatibility / WebGL), GDScript 2.0, WebSockets / TCP, WebRTC DataChannels  
**Client Directory:** `apps/game-client-01`

---

## 1. Executive Summary

**Astro-Smash: Arena** is a fast-paced 3v3 physics sports brawler combining aerodynamically driven Magnus curve mechanics from *Spin Pong 3D* with high-speed 6-DOF vehicle dynamics from *Project Vanguard*. 

Operating under Tachyon Studios' zero-operating-cost architecture, the client runs on desktop, browser (WebGL), and mobile PWA viewports, supporting direct smartphone HOTAS controls via an embedded dual server and peer-to-peer 60Hz binary state synchronization.

---

## 2. Core Physics & Aerodynamics Architecture

### 2.1 The Magnus Effect Aerodynamic Subsystem (`scripts/physics/aerodynamics.gd`)
The match ball exhibits dynamic trajectory curving based on 3D angular spin:
$$\vec{a}_{\text{magnus}} = \frac{S_0}{m} (\vec{\omega} \times \vec{v})$$

- **Topspin ($\omega_x < 0$):** Forces the ball downward into a steep dive, kicking sharply forward on ground bounce.
- **Backspin ($\omega_x > 0$):** Generates vertical aerodynamic lift, creating floating trajectories for defensive clears.
- **Sidespin ($\omega_y \ne 0$):** Induces sharp lateral curling breaks around defending vehicles.
- **Quadratic Aerodynamic Drag:**
  $$\vec{F}_{\text{drag}} = -\frac{1}{2} \rho C_d A \|\vec{v}\| \vec{v}$$
  Prevents unconstrained acceleration, calibrated with standard atmospheric density ($\rho = 1.225\text{ kg/m}^3$) and spherical drag ($C_d = 0.45$).

### 2.2 6-DOF Vehicle Dynamics & Aerodynamic Stall (`scripts/physics/vehicle_controller_6dof.gd`)
Each player commands an aerodynamic hover/jet interceptor:
- **Optimal Cornering Envelope:** Agility peaks between $65.0\text{ m/s}$ and $75.0\text{ m/s}$ ($1.0\times$ authority). Flying above $75.0\text{ m/s}$ expands the turning radius due to inertia.
- **Dynamic Aerodynamic Stall:** When airspeed drops below $28.0\text{ m/s}$, lift collapses exponentially, nose drops occur, and stick authority is reduced to $0.15\text{--}0.40\times$.
- **Induced Drag Braking:** Hard turns induce aerodynamic braking proportional to turn rate squared ($C_{Di} \propto \omega_{\text{turn}}^2$), bleeding forward speed unless afterburners are engaged.
- **Human Physiological G-Force Tolerances:** Sustained positive Gs ($> 7.5g$) or negative Gs ($< -3.0g$) for $> 3.5\text{s}$ trigger G-LOC, dampening stick inputs and streaming alert warnings to the HUD.

### 2.3 Lead Computing Optical Sight (LCOS) (`scripts/physics/lcos_targeting.gd`)
Assists players targeting high-speed maneuvering balls and opponents:
$$\|\vec{P}_{\text{target}} + \vec{V}_{\text{rel}} \cdot t_{\text{intercept}}\| = v_{\text{muzzle}} \cdot t_{\text{intercept}}$$
- Solves the quadratic intercept equation in real-time ($1,200\text{ m/s}$ projectile speed).
- Unprojects predicted 3D intercept points onto the 2D viewport, rendering a dynamic magenta lead pip.
- Implements subtle trajectory magnetism ($< 2.5^\circ$ deflection within a $5.0^\circ$ boresight cone).

---

## 3. Networking & Protocol Architecture

### 3.1 16-Byte Packed Binary Protocol (`scripts/network/binary_frame_codec.gd`)
Matches `@studio/shared-network` byte-for-byte with zero-allocation memory hygiene:

| Byte Offset | Type | Field | Semantics |
| :--- | :--- | :--- | :--- |
| `0..3` | `Float32` | `pitch` | Range: `[-1.0, 1.0]` |
| `4..7` | `Float32` | `roll` | Range: `[-1.0, 1.0]` |
| `8..11` | `Float32` | `throttle` | Range: `[0.0, 1.0]` |
| `12` | `Uint8` | `bitmask` | Bit 0: Boost, Bit 1: Fire, Bit 2: Missile, Bit 3: Flare, Bit 4: Tare |
| `13` | `Uint8` | `power_mode` | 0: Balanced, 1: Weapons, 2: Shields, 3: Engines |
| `14..15` | `Uint16` | `seq_num` | Sequence counter for packet loss & jitter tracking |

### 3.2 In-Engine Dual Server (`scripts/network/embedded_server.gd`)
- **HTTP Server (:8080 / :8082):** Serves instant status and controller gateway payloads to smartphones on the local Wi-Fi without internet connectivity.
- **WebSocket Server (:8081 / :8083):** Ingests 30--60Hz binary frames from mobile HOTAS or WebRTC DataChannel relays, and broadcasts 10Hz reverse telemetry (Hull %, Shield %, Speed, G-Force, Alert Flags).

---

## 4. Headless Automated QA Harness (`tests/`)

Compliant with **Section 3 of `AGENTS.md`**, all core physics, network codecs, targeting solutions, and scene hierarchies are validated via headless command-line execution:

```bash
# Run all 7 test suites via unified test runner
godot --headless --path apps/game-client-01 -s tests/test_runner.gd

# Run individual test suites
godot --headless --path apps/game-client-01 -s tests/test_binary_frame_codec.gd
godot --headless --path apps/game-client-01 -s tests/test_aerodynamics.gd
godot --headless --path apps/game-client-01 -s tests/test_lcos_targeting.gd
godot --headless --path apps/game-client-01 -s tests/test_vehicle_dynamics.gd
godot --headless --path apps/game-client-01 -s tests/test_game_manager.gd
godot --headless --path apps/game-client-01 -s tests/test_scenes_instantiation.gd
godot --headless --path apps/game-client-01 -s tests/test_embedded_server.gd
```

### Verified Test Matrix:
- **`test_binary_frame_codec.gd`:** 8/8 tests pass (16-byte packing, float clamping, bitmasks, telemetry roundtrip).
- **`test_aerodynamics.gd`:** 8/8 tests pass (Magnus topspin/backspin/sidespin, quadratic drag, induced drag, spin bounce).
- **`test_lcos_targeting.gd`:** 5/5 tests pass (stationary/crossing target quadratic solver, aim assist cone and bend).
- **`test_vehicle_dynamics.gd`:** 6/6 tests pass (cornering agility curve, dynamic stall, afterburner boost, G-force).
- **`test_game_manager.gd`:** 6/6 tests pass (state transitions, 3v3 scoring arbitration, kickoff countdown, win conditions).
- **`test_scenes_instantiation.gd`:** 6/6 tests pass (all 5 `.tscn` scenes instantiate without missing references).
- **`test_embedded_server.gd`:** 4/4 tests pass (HTTP & WebSocket listening, loopback client handshake, telemetry broadcast).
- **Total:** **43 Unit Assertions across 7 Suites (100% Pass Rate)**.
