# Studio Development Roadmap & Tracker

This document tracks the initialization, scaffolding, and ongoing development of the AI-Assisted Game Studio.

## ✅ Completed (What We Have Built)

### Infrastructure & Guidelines
- [x] **Monorepo Scaffolding:** Initialized the directory structure (`apps/`, `packages/`, `scripts/`, `docs/`) separating logic across the studio.
- [x] **Workspace Configuration:** Root `package.json` with npm workspaces configured, plus the core `README.md`.
- [x] **Agent Rulebook (`AGENTS.md`):** Defined the strict tech boundaries, networking philosophies (WebRTC/Edge), and automated testing mandates for all AI agents.
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
- [ ] **Math & Physics Copilot:** Implement reusable math libraries for Magnus effect aerodynamics, 6-DOF gyroscopic offsets, and trajectory intersection (LCOS).

### 3. Backend & Cloud
- [x] **Cloudflare Edge Presence:** Write the `api/presence.ts` worker script for zero-cost room matchmaking and peer signaling.
- [ ] **Supabase Schema:** Define the initial PostgreSQL tables for pilot/player clearance, leaderboards, and cloud saves.

### 4. Game Applications
- [ ] **Web Gateway Companion (PWA):** Scaffold the Vite + Tailwind mobile frontend that acts as the smartphone HOTAS / controller interface.
- [ ] **Game Client 01:** Initialize the first Godot 4.x project directory inside `/apps/` to begin testing the pipeline end-to-end.
