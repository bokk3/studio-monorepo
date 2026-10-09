# Studio Operations & AI Agent Guidelines

Welcome to the AI-Assisted Game Studio monorepo. As an AI Agent working within this repository, you must adhere strictly to the following technical rules and design philosophies. 

These rules apply to all applications and scripts created inside `/apps`, `/packages`, and `/scripts`.

## 1. Engine & Stack Boundaries
- **Game Engine:** Use Godot 4.x (GDScript or C#) for desktop/console targets.
- **Web 3D Engine:** Use Three.js for browser-based 3D games or WebGL components.
- **Backend Infrastructure:** Use Cloudflare Pages / Workers for serverless edge computing. DO NOT propose dedicated VPS servers (e.g., AWS EC2, Heroku, Node.js stateful servers).
- **Database / Auth:** Use Supabase (PostgreSQL) for persistence and authentication.
- **Web Gateway:** Use Vite + Tailwind + Vanilla JS/TS for Progressive Web Apps (PWAs). Avoid heavy SPA frameworks unless absolutely required for complex routing.

## 2. Networking Architecture (Zero-Friction Multiplayer)
- **P2P Authority:** High-frequency multiplayer state (physics, paddle position, ship velocity) must be handled peer-to-peer via **WebRTC DataChannels** or local UDP broadcast.
- **Edge Lobbies:** Use Cloudflare edge workers exclusively for lightweight matchmaking, presence (heartbeats), and signaling (STUN/TURN handshakes via PeerJS).
- **Embedded Servers:** When using Godot, prefer embedded HTTP/WebSocket servers (`TCPServer`, `WebSocketPeer`) over external relay nodes to allow local LAN play without internet connectivity.

## 3. QA Automation & Headless Testing
- **Test-Driven AI:** When you write or modify core logic (especially networking or physics), you MUST provide an accompanying headless test script.
- **Godot Tests:** Execute Godot tests using CLI: `godot --headless --path <project> -s <test_script.gd>`.
- **Target Metrics:** Validate deterministic physics, avoid garbage collection stutter in Three.js (e.g., use `BufferGeometry` and pre-allocate vertices), and ensure tests catch race conditions.

## 4. Asset Pipeline, Geometry & Visual Formats
- **Procedural Generation:** Prefer mathematical/procedural meshes (NURBS, CAD lofting, Three.js algorithmic generation) over traditional polygon modeling.
- **Mandatory Transparent Formats (SVG / PNG):** All logos, brand marks, HUD icons, UI widgets, and graphic assets MUST be authored strictly in transparent vector (**SVG**) or transparent 32-bit RGBA (**PNG**). NEVER generate or commit opaque JPEG bounding boxes for UI or logos.
- **LOD Scripts:** If creating Python or Node asset scripts (inside `/scripts/asset-pipeline`), automate the generation of multiple LODs and collision hulls for performance.

## 5. Mobile Companion Integration
- Assume players may use their smartphones as controllers.
- Ensure all web frontends implement robust responsive design, handling orientation locks, zero-tare sensor fusion (DeviceOrientation), and haptic feedback via the Web Vibration API.

## 6. Versioning & Documentation Discipline
- **Conventional Commits:** All git commits generated or suggested by the AI must follow the Conventional Commits specification (e.g., `feat:`, `fix:`, `chore:`, `docs:`).
- **Semantic Versioning:** Production releases should be strictly tagged using SemVer (e.g., `v1.2.4`). 
- **Continuous Documentation:** The AI is strictly responsible for keeping the documentation in sync with the codebase. If you complete a feature, you MUST check off the task in `ROADMAP.md` and update any relevant guides inside the `docs/` folder in the same workflow step.

By following these rules, you will ensure our studio remains lean, our operating costs remain near zero, and our gameplay experiences maintain AA/AAA performance standards.
