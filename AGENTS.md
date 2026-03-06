### AGENTS Overview

- **Project**: Modern Industrial Software (Electron + React + TypeScript + shadcn/ui + Tailwind CSS)
- **Goal**: Provide extensible desktop data processing and visualization, with cross-platform builds and auto-updates.
- **State Management**: Jotai for renderer-side client state.
- **Main Modules**:
  - `src/main/`: Electron main process (window management, IPC, worker scheduling)
  - `src/preload/`: preload scripts (secure API bridge)
  - `src/renderer/`: frontend UI (React + shadcn/ui + Tailwind CSS)

Use pnpm as the package manager

#### i18n Conventions

- Stack: i18next + react-i18next; init at src/renderer/src/i18n.ts and import once in src/renderer/src/main.tsx.
- Locale files: src/renderer/src/locales/\*.json, flattened (no nested folders).
- Filenames: BCP-47 tags (e.g., en-US.json, zh-CN.json).
- Current supportedLngs: ['en-US', 'zh-CN']; fallbackLng: 'en-US'.
- Usage: useTranslation and t('Key'); avoid hardcoded UI text; keep keys consistent across all locale files.

#### State Conventions

- Use Jotai for shared renderer state.
- Prefer Jotai `atomWithStorage` or related storage utilities for persisted renderer state.
- Prefer colocating atoms with their feature under `src/renderer/src/`.
- Keep atoms focused and composable; derive computed state with derived atoms when possible.
