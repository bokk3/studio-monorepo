<p align="center">
  <img src="docs/assets/tachyon_banner.svg" alt="Tachyon Studio Banner" width="100%" />
</p>

<p align="center">
  <strong>Human-Directed. AI-Accelerated. Zero-Friction Multiplayer.</strong>
</p>

<p align="center">
  <a href="https://tachyon.get.be.eu.org/"><img src="https://img.shields.io/badge/Live%20Portal-tachyon.get.be.eu.org-00F3FF?style=for-the-badge&logo=cloudflare" alt="Live Website" /></a>
  <a href="#-the-tachyon-ecosystem"><img src="https://img.shields.io/badge/Ecosystem-Web%20%7C%20Mobile%20%7C%20AAA-00F3FF?style=for-the-badge" alt="Ecosystem" /></a>
  <a href="#-core-architecture"><img src="https://img.shields.io/badge/Networking-WebRTC%20P2P%20%2B%20Edge-FF00FF?style=for-the-badge" alt="Networking" /></a>
  <a href="#-license--open-source"><img src="https://img.shields.io/badge/Engine-Godot%204%20%7C%20UE5-0055FF?style=for-the-badge" alt="Engine" /></a>
</p>

<p align="center">
  🌐 <strong>Official Dev Portal:</strong> <a href="https://tachyon.get.be.eu.org/">https://tachyon.get.be.eu.org/</a>
</p>

---

## ⚡ Welcome to Tachyon Studios

**Tachyon** is an AI-assisted game development studio engineering the next generation of seamless, cross-platform multiplayer titles. By pairing open-source game engines (Godot 4, Three.js) and high-end cinematic engines (Unreal Engine 5) with serverless edge computing and WebRTC peer-to-peer data channels, we eliminate server hosting costs and physical controller barriers forever.

---

## 🎨 Transparent Brand Assets & Visual Identity

All official studio marks and artwork are maintained strictly in **100% transparent vector (SVG)** and **32-bit RGBA (PNG)** formats with zero background grid or bounding box:

- **Branding Hero Graphic:** [`docs/assets/tachyon_website_branding.png`](docs/assets/tachyon_website_branding.png) (Full 32-bit alpha transparency)
- **High-Res 3D Emblem:** [`docs/assets/tachyon_logo_highres.png`](docs/assets/tachyon_logo_highres.png) (1024x1024 transparent isometric emblem)
- **Full Vector Logo:** [`docs/assets/tachyon_logo_full.svg`](docs/assets/tachyon_logo_full.svg) | [PNG](docs/assets/tachyon_logo_full.png)
- **Primary Emblem:** [`docs/assets/tachyon_mark.svg`](docs/assets/tachyon_mark.svg) | [PNG](docs/assets/tachyon_mark.png)
- **Studio Banner:** [`docs/assets/tachyon_banner.svg`](docs/assets/tachyon_banner.svg)
- **Gameplay Silhouettes:** [Fighter Interceptor](docs/assets/tachyon_fighter_concept.svg) · [Sentry Drone](docs/assets/tachyon_drone_concept.svg) · [Magnus Plasma Core](docs/assets/tachyon_ball_concept.svg)
- **Category Badges:** [Web F2P](docs/assets/tachyon_icon_web.svg) · [Mobile F2P](docs/assets/tachyon_icon_mobile.svg) · [AAA Premium](docs/assets/tachyon_icon_aaa.svg)
- **Brand Book:** Read the complete [Tachyon Brand Guidelines](docs/brand_guidelines.md).

---

## 🎮 The Tachyon Ecosystem (3 Unified Titles)

All titles share a unified **Supabase Player Profile** with cross-game progression, hard currency (*Diamonds*), and cosmetic rewards:

1. **🌐 Web-Based F2P:** Zero-install 3D browser games running at locked 60Hz over WebRTC DataChannels (e.g. *Astro-Smash: Arena*).
2. **📱 Mobile F2P:** Installable iOS/Android experiences utilizing physical phone gyroscope sensor fusion as high-precision 6-DOF controllers (e.g. *Orbit Runner: Gyro Dash*).
3. **💻 AAA Steam & Console:** Cinematic Unreal Engine 5 titles (e.g. *Vanguard: The Outer War*). Purchasing grants exclusive *Founder Prestige* and cross-game pet/skin unlocks across the Web and Mobile titles.

Read the full [Monetary Optimization & Revenue Strategy](docs/revenue_strategy.md) for detailed LTV and tokenomics.

---

## 🏗️ Repository Architecture

This monorepo uses **NPM Workspaces** to share libraries and coordinate builds:

```text
studio-monorepo/
├── AGENTS.md                  # 🤖 AI Agent operational rules & guidelines
├── ROADMAP.md                 # 🗺️ Live task tracker and engineering milestones
├── package.json               # 📦 Monorepo workspace configuration
│
├── apps/                      # 🚀 Deployable Applications
│   ├── web-gateway/           # 🌐 React + Vite + Tailwind PWA Studio Portal (Live on Cloudflare)
│   ├── edge-workers/          # ⚡ Cloudflare Edge presence & room matchmaking
│   └── game-client-01/        # 🎮 Astro-Smash: Arena (Godot 4.7 WebGL client)
│
├── packages/                  # 🧱 Shared Libraries
│   └── shared-network/        # 📡 WebRTC DataChannels, PeerJS & binary frame packing
│
├── scripts/                   # ⚙️ Autonomous AI Tooling
│   ├── ai-pipelines/          # 🧠 Headless testing harnesses & copilot prompts
│   └── asset-pipeline/        # 🎨 CAD-to-Mesh Python scripts (Fusion 360 -> Blender -> Godot/UE5)
│
├── ideas/                     # 💡 Studio Brain & Voting Board (18 Pitch Candidates)
│   └── VOTING_BOARD.md        # 🗳️ Team pitch voting registry (Official winners locked)
│
└── docs/                      # 📚 Studio Documentation & Brand Registry
    ├── assets/                # 🖼️ Transparent SVG and PNG logos, marks, and badges
    ├── astro_smash_arena_architecture.md # 🎮 Game Client 01 Godot 4.7 specifications
    ├── brand_guidelines.md    # 🎨 Tachyon visual identity & color system
    ├── company_structure_and_prompts.md # 🏢 Org hierarchy, file ownership & starter prompts
    ├── press_kit.md           # 📰 Fact sheet, executive boilerplate & media assets
    ├── relic_reusability_matrix.md      # 🧩 Code reuse audit from Pong & Vanguard
    ├── revenue_strategy.md    # 💰 Cross-game economy & monetization model
    ├── technical_architecture.md        # 📐 Zero-cost edge networking topology & sequence flows
    └── toolchain_integration_guide.md # 🛠️ SOPs for Fusion 360, Blender, Godot & UE5
```

---

## 🚀 Quickstart: Web Gateway Portal

The Tachyon Studio Web Gateway is built with **Vite, React 19, and Tailwind CSS v4** and deploys instantly to **Cloudflare Pages**:

```bash
# Clone the repository
git clone https://github.com/bokk3/studio-monorepo.git
cd studio-monorepo

# Install dependencies across all workspaces
npm install

# Start the Web Gateway locally
cd apps/web-gateway
npm run dev

# Or build for production
npm run build
```

---

## 🤖 The AI Rulebook (`AGENTS.md`)

This repository is designed for collaborative pair-programming between humans and autonomous AI agents using the **Antigravity Customization System**.

Opening this repository in your IDE or CLI automatically mounts [`AGENTS.md`](AGENTS.md). The AI is governed by strict technical guardrails:
- Mandatory headless QA test generation (`godot --headless`) for all physics and netcode.
- Zero-cost serverless edge deployment on Cloudflare (no stateful AWS/Node servers).
- Strict Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- **Mandatory transparent formats (SVG / PNG)** for all visual assets.

---

## 📄 License & Open-Source Foundation

- Engine core powered by [Godot Engine](https://godotengine.org/) (MIT) and [Three.js](https://threejs.org/) (MIT).
- Cloud services powered by [Cloudflare Pages](https://pages.cloudflare.com/) and [Supabase](https://supabase.com/).
- Studio intellectual property & game code &copy; 2026 Tachyon Studios.
