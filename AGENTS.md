### AGENTS Overview

- **Project**: Modern Industrial Software (Electron + React + TypeScript + shadcn/ui + Tailwind CSS)
- **Goal**: Provide extensible desktop data processing and visualization, with cross-platform builds and auto-updates.
- **Routing**: TanStack Router file-based routing in the renderer, using `createHashHistory()` with Electron URLs in the form `#/...`.
- **State Management**: Jotai for renderer-side client state.
- **Main Modules**:
  - `src/main/`: Electron main process (window management, IPC, worker scheduling)
  - `src/preload/`: preload scripts (secure API bridge)
  - `src/renderer/`: frontend UI (React + shadcn/ui + Tailwind CSS)

Use pnpm as the package manager

#### Code Quality Conventions

- **Linting**: oxlint (via `pnpm lint` / `pnpm lint:fix`). Configuration in `.oxlintrc.json`.
- **Formatting**: oxfmt (via `pnpm run format`). Configuration in `.oxfmtrc.json`.

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

#### Routing Conventions

- Router bootstrap lives in `src/renderer/src/main.tsx` and `src/renderer/src/router.tsx`; do not reintroduce local view switching in `App.tsx`.
- File routes live in `src/renderer/src/routes/`; keep `src/renderer/src/routeTree.gen.ts` checked in and regenerate it when routes change.
- The shared desktop shell belongs to the root route; leaf routes should own page content only.
- Use Router navigation primitives (`Link`, router state/hooks) instead of manual hash parsing or `hashchange` listeners.
- The global router preload strategy is `defaultPreload: 'viewport'`; treat it as the default unless a measured issue justifies a narrower or broader strategy.
- Supported settings URLs are `#/settings` and `#/settings?standalone=1`; menu/shortcut driven standalone settings should use the latter.
- Prefer normal route-level or component-level lazy loading only; do not add extra chart-specific bundle rules unless there is a demonstrated need.

#### Dependency Conventions

- Dependencies used **only in the renderer process** (`src/renderer/`) must be installed as `devDependencies`. Vite bundles them into the renderer output, and `electron-builder` excludes `devDependencies` from the packaged app, keeping the final package size smaller. See: https://electron-vite.org/guide/dependency-handling
- Dependencies used in the **main process** (`src/main/`) or **preload** (`src/preload/`) must remain in `dependencies`, because `electron-vite` externalizes them (`externalizeDeps: true`) and they are resolved from `node_modules` at runtime.
- When adding a new package, determine which process(es) import it and place it in the correct section accordingly.

#### Documentation Conventions

- Changes that alter project-wide architecture, routing, public entry points, build workflows, or core stack assumptions must update the relevant docs in the same change.
- At minimum, check whether `AGENTS.md`, `README.md`, and any related `arch/*.md` plan or architecture document need to be updated.
- Generated artifacts that are required for normal development flows, such as `src/renderer/src/routeTree.gen.ts`, must remain committed and reflected in docs when their workflow changes.
