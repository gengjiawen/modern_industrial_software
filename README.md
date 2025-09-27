# Modern Industrial Software

> A modern, production-grade Electron + React + TypeScript + MantineUI template — out of the box, extensible, cross‑platform, with auto‑updates and built‑in i18n.

### Why this template

- **Lightning‑fast DX**: electron‑vite with instant HMR for a silky development loop.
- **Modern UI**: Mantine UI + charts demo, theming, easy light/dark mode.
- **Data processing & visualization**: Excel (.xlsx) parsing + line chart demo for common industrial data scenarios.
- **Secure bridge**: minimal, testable `contextBridge` API over IPC.
- **Cross‑platform + auto‑updates**: one codebase for Windows / macOS / Linux, integrated with `electron-updater`.
- **Built‑in i18n**: i18next + react-i18next with `en-US` and `zh-CN` out of the box.

### Project layout

- `src/main/`: Electron main process (window management, IPC, worker scheduling)
- `src/preload/`: preload scripts (secure API bridge)
- `src/renderer/`: frontend UI (React + MantineUI)

### Featured demos

- File upload & Excel parsing: `src/renderer/src/UploadPage.tsx` (renderer parsing and main‑process worker parsing paths)
- Secure bridge API: `src/preload/index.ts` exposes `window.electron.readExcelFile`
- Excel worker: `src/main/excel_worker.ts`
- Charts: `src/renderer/src/ChartDemo.tsx` using `@mantine/charts`

---

## Quick start

### Install

```bash
pnpm install
```

### Develop

```bash
pnpm dev
```

### Preview built app

```bash
pnpm start
```

### Build installers

```bash
# Windows
pnpm build:win

# macOS
pnpm build:mac

# Linux (deb / rpm)
pnpm build:linux
```
