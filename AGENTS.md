### AGENTS Overview

- **Project**: Modern Industrial Software (Electron + React + TypeScript + MantineUI)
- **Goal**: Provide extensible desktop data processing and visualization, with cross-platform builds and auto-updates.
- **Main Modules**:
  - `src/main/`: Electron main process (window management, IPC, worker scheduling)
  - `src/preload/`: preload scripts (secure API bridge)
  - `src/renderer/`: frontend UI (React + MantineUI)

Use pnpm as the package manager