# 🧩 Relic Reusability Matrix & Technical Asset Audit
**Sources Audited:**
1. `Pong` (`C:\Users\Boris\Documents\Websites\pong`)
2. `Project Vanguard` / `lucid-davinci` (`C:\Users\Boris\Documents\antigravity\lucid-davinci`)

---

## 1. Executive Summary

Both relic codebases contain battle-tested, production-grade systems that directly map to our upcoming titles:
*   **Web F2P (*Astro-Smash: Arena*):** Directly reuses Pong's Magnus physics, trajectory predictor, Web Audio synth, and zero-GC trail geometry, combined with Vanguard's binary packet structure and Cloudflare edge presence.
*   **Mobile F2P (*Orbit Runner: Gyro Dash*):** Directly reuses Vanguard's mobile PWA gyroscopic HOTAS controller, 1-tap zero tare sensor fusion, and reward wheel economy.
*   **AAA Steam/Console (*Vanguard: The Outer War*):** Reuses Vanguard's 6-DOF aerodynamic flight model, G-force human tolerance shaders, LCOS predictive gunnery, and the Fusion 360/Blender CAD pipelines.

---

## 2. Reusability Breakdown by Subsystem

### A. Physics & Aerodynamics
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `BallPhysics.ts` | `pong/src/physics/` | Magnus lift vector $\vec{a} = \frac{S_0}{m}(\vec{\omega} \times \vec{v})$, quadratic drag, spin decay, and bounce restitution matrix. | Port to Godot: `apps/game-client-01/scripts/physics/aerodynamics.gd` & Web: `packages/math-core/aerodynamics.ts` |
| `TrajectoryPredictor.ts` | `pong/src/physics/` | Runge-Kutta / substepped trajectory projection under Magnus forces. | Port to `packages/math-core/trajectory_predictor.ts` (used for AI aiming & LCOS pips). |
| `spaceship_controller.gd` | `lucid-davinci/godot_project/` | Airspeed-dependent lift, dynamic stall curve ($v < 28\text{ m/s}$), induced drag ($C_{Di} \propto \alpha^2$), cornering envelope ($65\text{--}75\text{ m/s}$), and G-force blackout/redout tracking. | Direct reuse in Godot flight client: `apps/game-client-01/scripts/physics/vehicle_controller_6dof.gd` |

---

### B. Networking & Serverless Infrastructure
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `network_controller_server.gd` | `lucid-davinci/godot_project/` | Dual in-engine HTTP server (:8080) streaming standalone controller HTML + high-performance WebSocket server (:8081) with dynamic port fallback. | Direct reuse in Godot client for zero-install couch co-op & LAN play. |
| `NetworkManager.ts` & `NetworkProtocol.ts` | `pong/src/network/` | PeerJS WebRTC DataChannel handshakes, Google/Twilio public STUN fallback, and native browser `BroadcastChannel` for multi-tab testing. | Consolidate into `@studio/shared-network`. |
| `functions/api/presence.ts` | `pong/functions/api/` | Cloudflare Pages edge presence with ephemeral in-memory active rooms and 20s heartbeat purge loop. | Already adapted to `apps/edge-workers/src/presence.ts`. |
| `network_manager.gd` | `lucid-davinci/godot_project/` | UDP broadcast LAN peer discovery, room matchmaking, and high-frequency transform interpolation. | Integrate into Godot multiplayer lobby module. |

---

### C. Controls & Mobile Companions
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `controller.js` & `controller.html` | `lucid-davinci/website/src/` | iOS 13+ `DeviceOrientationEvent` permission flow, 1-tap `TARE HORIZON` sensor fusion, $3.5^\circ$ central deadzone, $x^2 \cdot \text{sgn}(x)$ exponential response curves, and Web Vibration API haptics. | Port to `apps/web-gateway/` as our universal mobile controller companion. |
| `bundle-standalone-controller.js` | `lucid-davinci/website/scripts/` | Script that inlines all CSS, JS, and HTML into a single standalone 94KB file embedded inside Godot `res://`. | Add to `scripts/ai-pipelines/` for bundling offline companion PWAs. |
| `WebcamController.ts` | `pong/src/controllers/` | Zero-dependency frame-diff pixel tracking on raw HTML5 video canvas. Detects horizontal hand centroid and vertical swipe velocity ($dY/dt$). | Integrate into web games as optional webcam gesture control. |

---

### D. Artificial Intelligence & NPC Behavior
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `AIController.ts` | `pong/src/controllers/` | Predictive baseline intercept calculation factoring in Magnus curve, with difficulty tiers and humanized reaction latency/noise. | Direct reuse in `Astro-Smash: Arena` bot AI. |
| `CurveController.ts` | `pong/src/controllers/` | Multi-probe wing sensors, canyon avoidance, dynamic wall-pinning, and forward trajectory cut-off maneuvers. | Reusable for obstacle avoidance and predator AI in `Orbit Runner` and combat drones. |
| `target_drone.gd` & `boss_combine_ghost.gd` | `lucid-davinci/godot_project/` | State machines for combat drones, evasion maneuvers, missile dodging, and multi-phase boss behaviors. | Integrate into Godot campaign enemy formations. |

---

### E. Graphics, VFX & Shaders
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `Stadium.ts` | `pong/src/entities/` | Procedural 3D crowd simulation with spectator head tracking that follows the ball/lead player and Mexican wave jump celebrations. | Adapt to 3D stadium spectators in `Astro-Smash: Arena`. |
| `CurveTrail.ts` | `pong/src/entities/` | Pre-allocated dynamic `BufferGeometry` (`MAX_VERTICES = 15000`) for zero-GC trail ribbons and periodic gap generator. | Adapt to vehicle exhaust trails and projectile tracers. |
| `hud.gd` | `lucid-davinci/godot_project/` | LCOS dynamic lead reticle pip, aim magnetism ($< 2.5^\circ$), artificial horizon ladder, radar compass, and blackout/redout vignette shaders. | Direct reuse in Godot HUD canvas layers. |

---

### F. Backend, Auth & Tokenomics
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `auth_manager.gd` | `lucid-davinci/godot_project/` | Supabase authentication, guest fallback, session persistence, callsign claiming, and squadron badges. | Core of our unified Supabase cross-progression account system. |
| `reward_manager.gd` & `rewards_dialog.gd` | `lucid-davinci/godot_project/` | Stars economy, daily login streaks, spin wheels, skin unlocks, and cross-platform reward claims. | Direct blueprint for our F2P lootbox and diamond reward system. |
| `leaderboard_dialog.gd` | `lucid-davinci/godot_project/` | Real-time global leaderboards aggregated via Supabase PostgreSQL queries. | Unified leaderboard for all 3 titles. |

---

### G. Toolchain & CAD Pipelines
| Source File | Relic Location | Key Reusable Code | Target Destination in Tachyon |
| :--- | :--- | :--- | :--- |
| `fusion_addin/AntigravityBridge/` | `lucid-davinci/` | Autodesk Fusion 360 add-in for automated parametric CAD component extraction. | Adopt into `scripts/asset-pipeline/fusion_bridge/`. |
| `blender_addon/antigravity_bridge/` | `lucid-davinci/` | Blender headless addon for auto-LOD generation, PBR material mapping, and GLTF/FBX export. | Merge into `scripts/asset-pipeline/cad_to_mesh.py`. |
| `generate_*.py` | `lucid-davinci/scripts/models/` | Procedural mesh generation scripts for interceptors, capital ships, jammer towers, and canyon terrains. | Template library for procedural hard-surface assets. |

---

### H. Automated Headless QA Test Suites
*Project Vanguard* contains **24 battle-tested headless Godot suites** that can be adapted immediately:
*   `test_lcos_lead.gd`: Mathematical verification of lead intercept calculation.
*   `test_mobile_controller_integration.gd`: Spins up internal HTTP/WS servers, connects a simulated client, validates handshakes and telemetry.
*   `test_aim_assist_and_combat.gd`: Verifies bullet magnetism and drone damage.
*   `test_player_collision.gd`: Verifies collision boxes and terrain impulse absorption.
*   `test_auth_system.gd` & `test_rewards_system.gd`: Validates Supabase auth and economy state machines.

---

## 3. Recommended Phased Porting Plan

1. **Step 1 (Core Math & Physics):** Port `BallPhysics.ts` into GDScript (`aerodynamics.gd`) and combine with Vanguard's `spaceship_controller.gd` into a shared module.
2. **Step 2 (Network Codec):** Adapt Vanguard's `network_controller_server.gd` to Godot 4.7 using our new 16-byte packed binary format.
3. **Step 3 (Mobile Companion):** Copy Vanguard's `controller.js` (gyro tare, haptics) into `apps/web-gateway/` so any smartphone immediately controls the game.
4. **Step 4 (Headless QA):** Port the 5 critical test suites (`test_mobile_controller_integration.gd`, `test_lcos_lead.gd`, etc.) into `apps/game-client-01/tests/`.
