# Modern Industrial Software

> A modern Electron + React + TypeScript desktop app for industrial data processing and visualization, with hash-based routing, built-in i18n, and cross-platform packaging.

### Why this app

- **Lightning‑fast DX**: electron‑vite with instant HMR for a silky development loop.
- **Modern UI**: React + shadcn/ui + Tailwind CSS, with theming and desktop-oriented layout primitives.
- **Structured navigation**: TanStack Router file-based routing with Electron-friendly hash URLs.
- **Lean loading**: route-level and component-level chunking keeps chart and preview code out of the initial path until needed.
- **Data processing & visualization**: Excel (.xlsx) parsing, workbook preview, and chart views for industrial data scenarios.
- **Secure bridge**: minimal, testable `contextBridge` API over IPC.
- **Cross‑platform + auto‑updates**: one codebase for Windows / macOS / Linux, integrated with `electron-updater`.
- **Built‑in i18n**: i18next + react-i18next with `en-US` and `zh-CN` out of the box.
- **High‑performance tooling**: Oxc-powered linting and formatting (oxlint + oxfmt) for instant feedback and consistent code style without the slowdown of traditional tools.

### Quality & Performance

This project uses the [Oxc](https://oxc.rs/) toolchain for code quality:

- **Linting**: `pnpm lint` / `pnpm lint:fix` — oxlint is 50–100× faster than ESLint with extensive rule coverage.
- **Formatting**: `pnpm run format` — oxfmt replaces Prettier with near-instant formatting.
- Zero-config defaults with sensible presets; customize via `.oxlintrc.json` and `.oxfmtrc.json`.

### Project layout

- `src/main/`: Electron main process (window management, IPC, worker scheduling)
- `src/preload/`: preload scripts (secure API bridge)
- `src/renderer/`: frontend UI (React + shadcn/ui + Tailwind CSS)

### Featured demos

- File upload & Excel parsing: `src/renderer/src/UploadPage.tsx`
- Secure bridge API: `src/preload/index.ts` exposes `window.electron.readExcelFile`
- Excel worker: `src/main/excel_worker.ts`
- Charts: `src/renderer/src/features/charts/SignalTrendOverview.tsx` and `src/renderer/src/features/charts/WorkbookPreviewChart.tsx`

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

### Regenerate route tree

```bash
pnpm run routes:generate
```

### Preview built app

```bash
pnpm start
```

### Run E2E tests

```bash
# Builds the app and verifies Electron starts without crashing or white screen
pnpm test:e2e
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
