# Studio Development Roadmap & Tracker

This document tracks the initialization, scaffolding, and ongoing development of the AI-Assisted Game Studio.

## ✅ Completed (What We Have Built)

### Infrastructure & Guidelines
- [x] **Monorepo Scaffolding:** Initialized the directory structure (`apps/`, `packages/`, `scripts/`, `docs/`) separating logic across the studio.
- [x] **Workspace Configuration:** Root `package.json` with npm workspaces configured, plus the core `README.md`.
- [x] **Agent Rulebook (`AGENTS.md`):** Defined the strict tech boundaries, networking philosophies (WebRTC/Edge), and automated testing mandates for all AI agents.
- [x] **Company Structure & Starter Prompts:** Formalized department hierarchy, file ownership matrix, and ready-to-use starter prompts in `docs/company_structure_and_prompts.md`.
- [x] **Lead Gameplay Engineer Appointed:** Onboarded dedicated Godot 4.x & deterministic physics specialist subagent.
- [x] **Relic Codebase Audit Completed:** Cataloged all reusable physics, networking, CAD, and UI assets from Pong and Vanguard in `docs/relic_reusability_matrix.md`.
- [x] **Shared Networking Package:** Scaffolded the `@studio/shared-network` package boilerplate.
- [x] **Toolchain Integration Guide:** Documented the exact pipelines for collaborating across Fusion 360, Blender (headless), Godot 4.x, and Unreal Engine 5.

---

## 🚧 Pending (What We Need To Build)

### 1. Automation & AI Pipelines
- [x] **Blender Headless Bridge (`cad_to_mesh.py`):** Write the Python script that AI agents will use to convert `.STEP` files from Fusion 360 into Godot-ready `.GLTF` files (including LODs and normal baking).
- [ ] **Godot Headless QA Generator:** Create the prompt templates or Python tools the AI will use to automatically spin up `godot --headless` test suites when new logic is committed.
- [ ] **Unreal Engine 5 Python Commandlets:** Draft the basic `ue5_import.py` for automated Datasmith processing in preparation for AAA development.

### 2. Core Libraries
- [x] **Flesh out `@studio/shared-network`:** Implement the actual WebRTC DataChannel handshake logic, local UDP discovery, and binary frame packing structs.
- [x] **Math & Physics Core:** Implement reusable math libraries for Magnus effect aerodynamics, quadratic drag, 6-DOF gyroscopic dynamics, and predictive trajectory intersection (LCOS).

### 3. Backend & Cloud
- [x] **Cloudflare Edge Presence:** Write the `api/presence.ts` worker script for zero-cost room matchmaking and peer signaling.
- [ ] **Supabase Schema:** Define the initial PostgreSQL tables for pilot/player clearance, leaderboards, and cloud saves.

### 4. Game Production Pipeline (The 3 Confirmed Titles)
- [x] **Web Gateway Companion (PWA):** Deployed live on Cloudflare Pages (`https://web-gateway.truyensboris.workers.dev`) with router, transparent brand assets, and mobile viewport support.
- [x] **Game Client 01 &rarr; `Astro-Smash: Arena` (Web F2P):** 3v3 physics brawler in Godot 4.7.2 with Magnus curve aerodynamics, 6-DOF vehicle dynamics, LCOS targeting, 16-byte binary protocol codec, and 7 automated headless test suites (100% pass rate).
- [ ] **Game Client 02 &rarr; `Orbit Runner: Gyro Dash` (Mobile F2P):** 6-DOF endless vertical flight dodger using physical phone gyro fusion (`controller.js`) and daily chest drops.
- [ ] **Game Client 03 &rarr; `Vanguard: The Outer War` (AAA Premium):** 32v32 space combat simulator in Unreal Engine 5 with CAD asset pipeline (`cad_to_mesh.py`) and Founder cross-game prestige.
