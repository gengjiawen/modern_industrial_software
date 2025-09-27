### AGENTS Overview

- **Project**: Modern Industrial Software (Electron + React + TypeScript + MantineUI)
- **Goal**: Provide extensible desktop data processing and visualization, with cross-platform builds and auto-updates.
- **Main Modules**:
  - `src/main/`: Electron main process (window management, IPC, worker scheduling)
  - `src/preload/`: preload scripts (secure API bridge)
  - `src/renderer/`: frontend UI (React + MantineUI)

Use pnpm as the package manager

#### i18n Conventions
- Stack: i18next + react-i18next; init at src/renderer/src/i18n.ts and import once in src/renderer/src/main.tsx.
- Locale files: src/renderer/src/locales/*.json, flattened (no nested folders).
- Filenames: BCP-47 tags (e.g., en-US.json, zh-CN.json).
- Current supportedLngs: ['en-US', 'zh-CN']; fallbackLng: 'en-US'.
- Usage: useTranslation and t('Key'); avoid hardcoded UI text; keep keys consistent across all locale files.