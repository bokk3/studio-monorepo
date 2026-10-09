# Studio Monorepo

Welcome to the AI-assisted game development studio monorepo. This workspace is designed for rapid iteration, cross-project code sharing, and AI-driven automation pipelines.

## Structure

- **/apps**: Contains all deployed applications.
  - E.g., `game-client-3d` (Godot projects), `web-gateway` (Vite PWAs), `edge-workers` (Cloudflare).
- **/packages**: Shared internal libraries.
  - E.g., `shared-network` (WebRTC & WebSocket logic), `math-core` (Physics and trajectory helpers).
- **/scripts**: Automation tools acting as our AI pipeline.
  - `/ai-pipelines`: Headless test generation, math/copilot utilities.
  - `/asset-pipeline`: Python/Node scripts for converting CAD files (Fusion 360/OpenSCAD) into engine-ready LODs (Godot `res://`).
- **/.github/workflows**: Automated CI/CD pipelines (e.g., Godot headless tests).

## Getting Started

This repository uses [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) to link local packages.

```bash
# Install dependencies across all apps and packages
npm install
```
