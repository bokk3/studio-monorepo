# 🚀 Antigravity AI-Assisted Game Studio

Welcome to the central monorepo for our AI-assisted, human-directed game development studio. 

This repository serves as the single source of truth for all game clients, web gateways, serverless edge APIs, and AI automation scripts. By combining human creativity with autonomous AI pipelines, we can develop AA and AAA titles with zero-friction multiplayer, device-agnostic controls, and heavily optimized asset pipelines.

---

## 📖 Table of Contents
1. [Core Philosophy](#-core-philosophy)
2. [Repository Architecture](#-repository-architecture)
3. [Getting Started (Developers & AI)](#-getting-started)
4. [The AI Rulebook (`AGENTS.md`)](#-the-ai-rulebook)
5. [Toolchain Integration](#-toolchain-integration)
6. [Roadmap & Tracking](#-roadmap--tracking)

---

## 🧠 Core Philosophy
Our games are built on four foundational pillars:
- **Zero-Cost Scalability:** We utilize Cloudflare Edge Workers and WebRTC DataChannels for multiplayer. Our central servers handle matchmaking and presence; all physics and real-time state are arbitrated peer-to-peer.
- **Hardware Agnosticism:** We eliminate the need for expensive hardware (like HOTAS setups) by utilizing PWAs, smartphone gyroscope sensor fusion, and lightweight computer-vision webcam tracking.
- **Open-Source & Web-Native:** Primary development is driven through Godot 4.x and Three.js (WebGL).
- **Procedural Asset Generation:** We design parametric models (NURBS) in Autodesk Fusion 360 and rely on AI-driven Blender scripts to mathematically generate LODs, collision hulls, and normal maps.

---

## 🏗️ Repository Architecture
This is an NPM Workspace monorepo. Shared code and specific applications are isolated into their own domains.

```text
studio-monorepo/
├── AGENTS.md                  # 🤖 The strict technical rulebook for all AI agents
├── ROADMAP.md                 # 🗺️ Current studio development progress and pending tasks
├── package.json               # 📦 Root workspace configuration
│
├── ideas/                     # 💡 Sandboxed idea board, game pitches, and WIP devlogs
│
├── apps/                      # 🎮 Deployable Applications
│   ├── edge-workers/          # Serverless matchmaking & presence (Cloudflare TS)
│   ├── web-gateway/           # (Planned) Mobile PWA controller & companion app
│   └── game-client-01/        # (Planned) Core Godot 4.x or Three.js projects
│
├── packages/                  # 🧱 Shared Libraries
│   └── shared-network/        # WebRTC, UDP discovery, and binary payload packing
│
├── scripts/                   # ⚙️ AI Automation & Tooling
│   ├── ai-pipelines/          # Prompts, headless testing triggers, math copilots
│   └── asset-pipeline/        # Python/Node CAD-to-Mesh conversion scripts
│
└── docs/                      # 📚 Studio Documentation
    └── toolchain_integration_guide.md # SOPs for Fusion 360, Blender, Godot, and UE5
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **Godot 4.x** (Configured in your system PATH for CLI headless testing)
- **Blender 4.0+** (Configured in your system PATH for headless Python processing)
- **Wrangler CLI** (For deploying Cloudflare Edge workers)

### 2. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone https://github.com/your-org/studio-monorepo.git
cd studio-monorepo
npm install
```

### 3. Running Edge Matchmaking Locally
```bash
cd apps/edge-workers
npm run dev
```

---

## 🤖 The AI Rulebook (`AGENTS.md`)
This repository heavily utilizes the **Antigravity Customization System**. 

At the root of the repo is an `AGENTS.md` file. **You do not need to configure anything.** Simply by opening this repository in your terminal or IDE, your local AI agents will instantly absorb this file. 

The rulebook restricts the AI from proposing expensive server architecture, enforces the WebRTC/P2P paradigms, and strictly mandates that the AI must write headless automated test suites (Godot CLI) for any physics or networking logic it generates. If you change a studio standard, simply commit the change to `AGENTS.md` and the entire team's AI will update automatically upon pulling.

---

## 🛠️ Toolchain Integration
Our asset pipeline flows from Mechanical CAD to real-time engine without manual box-modeling.

1. **Design:** Create models in Autodesk Fusion 360 (or OpenSCAD).
2. **Bridge:** The AI invokes `scripts/asset-pipeline/cad_to_mesh.py` via Blender headless.
3. **Deploy:** The bridge outputs engine-ready `.GLTF` (for Godot/Web) or `.FBX` (for Unreal Engine).

For highly detailed standard operating procedures, see the [Toolchain Integration Guide](docs/toolchain_integration_guide.md).

---

## 🗺️ Roadmap & Tracking
We track all immediate, short-term, and long-term studio tasks internally. 
Please refer to the [ROADMAP.md](ROADMAP.md) file to see what the AI and the engineering team are currently building next!
