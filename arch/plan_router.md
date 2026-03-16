# TanStack Router + Hash History Migration Plan

## Summary
- Migrate the renderer from the current `useState`/`hashchange` approach to file-based routing with `TanStack Router`.
- Use `createHashHistory()` consistently across the entire Electron app, with the URL convention fixed as `#/...`.
- Use router preloading conservatively, with `defaultPreload: 'viewport'` as the global baseline to improve repeat navigation without eagerly preloading every route on render.
- Preserve the current "dual-entry settings page" behavior: the main window can navigate to settings, while the menu/shortcuts continue to open a standalone settings window.
- Keep the migration focused on routing and shell ownership, without introducing extra chart-specific bundling rules beyond normal route-level and component-level lazy loading.
- Tighten the plan into implementation-level rules so development, production, typecheck, and build flows all behave consistently without hidden assumptions.

## Key Changes
- Dependencies and build configuration:
  - Add the runtime dependency `@tanstack/react-router`.
  - Add the development dependency `@tanstack/router-plugin`.
  - Add the TanStack Router Vite plugin to `renderer.plugins` in `electron.vite.config.ts`, and place it before `react()`.
  - Enable `autoCodeSplitting: true` for the TanStack Router plugin, with `routesDirectory` fixed at `src/renderer/src/routes` and `generatedRouteTree` fixed at `src/renderer/src/routeTree.gen.ts`.
  - Keep all renderer Vite configuration in one place so the Electron renderer build and any standalone renderer config use the same router plugin, aliases, and chunking rules.
  - Commit `routeTree.gen.ts` to the repository so `typecheck` does not depend on running dev/build first.
  - Define one canonical regeneration workflow for `routeTree.gen.ts` and require it to be updated in the same change whenever routes are added, removed, or renamed.
- Routing structure and layout:
  - Create file routes for `/`, `/upload`, `/messages`, `/community`, `/forums`, `/support`, and `/settings`.
  - Let the root route own the shared layout, including the current sidebar, top bar, user menu, and title area.
  - Support the search parameter `standalone=1` on `/settings`; when present, render only the settings page content without the main shell.
  - Add a not-found route experience so unknown hashes show a visible fallback with a way back to the home page.
  - Treat `/settings` and `/settings?standalone=1` as the only supported settings URLs; do not preserve legacy variants such as `#settings` or ad hoc hash parsing once the migration is complete.
  - Use typed route search validation for `standalone` so unsupported values do not create ambiguous behavior.
- Component split and lazy loading:
  - Extract the shell, home cards, placeholder pages, sidebar, and similar pieces currently in `src/renderer/src/App.tsx` into regular components composed by the root route.
  - Turn the `messages` page into an independent route, and let TanStack Router automatic code splitting generate a dedicated route chunk.
  - Move the existing `src/renderer/src/ChartDemo.tsx` into `features/charts/` as a chart UI module instead of mounting it directly in `App.tsx`.
  - Extract the chart rendering area in `src/renderer/src/UploadPage.tsx` into `features/charts/WorkbookPreviewChart`; render it through dynamic import only when `chartPreview` exists, so no chart chunk is requested when no file is uploaded or no plottable data exists.
  - Keep spreadsheet parsing, worksheet selection, and chart preview derivation in the upload feature so chart chunks contain presentation code, not upload business logic.
  - Ensure the idle upload state and the "no chartable data" state render without importing `recharts` or the chart UI chunk.
  - Provide a lightweight skeleton/fallback consistently for chart lazy-loading to avoid blank flashes on route switches or first render.
- Navigation and state:
  - Convert sidebar buttons, home shortcut buttons, and Logo/Home navigation to Router-based navigation.
  - Derive active state and page titles from the current pathname instead of maintaining `activeView`.
  - Remove `SETTINGS_HASHES`, `isSettingsRoute`, the `hashchange` listener, and all page-switching logic based on local state.
  - Remove navigation patterns such as `href="#"` that bypass router state.
  - Keep navigation state single-sourced from the router; do not mirror route state into local `useState` unless a view-specific UI concern requires it.
- Main process integration:
  - Keep the `loadRenderer(window, hash?)` interface shape unchanged.
  - Keep the main window loading the default entry.
  - Make the standalone settings window always load `#/settings?standalone=1`; use the same hash convention in both development and production.
  - Require all callers of `loadRenderer(window, hash?)` to pass a complete hash fragment, including the leading `#/` and any search string, rather than passing route names or partial fragments.
  - Do not keep compatibility shims in the main process for old hash forms after the router migration is merged.
  - Preserve menu and shortcut logic, changing only the target hash for the settings window.
- i18n and existing behavior:
  - Keep the current i18n initialization approach unchanged.
  - Only update `en-US.json` and `zh-CN.json` when new visible text is introduced.
  - Keep preload / IPC interfaces unchanged.
  - Keep existing translated labels stable where possible so the migration remains primarily infrastructural rather than a UI copy change.

## Implementation Rules
- Routing ownership:
  - `src/renderer/src/main.tsx` should bootstrap the router once and stop rendering `App` as a local view switcher.
  - Route components own page content; the root route owns shell composition; reusable layout primitives stay outside the route tree.
  - Keep router preloading at `defaultPreload: 'viewport'` unless profiling shows it should be changed; prefer route-level overrides over churn in the global default.
- Hash handling:
  - Renderer code must treat the router as the only source of truth for the current location.
  - Main-process code must never inspect or normalize route meaning beyond passing the agreed hash string into `loadRenderer`.
  - Unknown hashes should render the not-found route rather than silently redirecting to home.
- Chunk boundaries:
  - Route-level and component-level lazy loading should be sufficient; do not add extra named chart bundle contracts unless a measurable build or runtime problem appears.
  - Upload-specific parsing, workbook state, and preview-shaping utilities remain with the upload feature or upload route chunk.
  - `xlsx` should load only when the upload route is entered, not on the home route or messages route.
- Generated files:
  - `routeTree.gen.ts` is a checked-in generated artifact, not a hand-edited file.
  - Any route structure change is incomplete unless the generated route tree is refreshed and committed in the same change.

## Public Interfaces / Contracts
- The renderer URL contract is fixed as:
  - `#/`
  - `#/upload`
  - `#/messages`
  - `#/community`
  - `#/forums`
  - `#/support`
  - `#/settings`
  - `#/settings?standalone=1`
- The chart loading contract is fixed as:
  - The `messages` route is a standalone lazy-loaded route chunk
  - The upload-page chart preview is loaded on demand only when preview data exists
- `xlsx` must stay out of the main bundle; it loads with the upload route chunk.
- The main-process hash contract is fixed as:
  - `loadRenderer(window)` loads the default renderer entry
  - `loadRenderer(window, '#/settings?standalone=1')` opens standalone settings
  - Callers pass complete hash fragments only; no caller passes bare values such as `'settings'`
- The unknown-route contract is fixed as:
  - Unknown hashes render a not-found route
  - Unknown hashes do not silently coerce to home

## Delivery Sequence
1. Add router dependencies and shared Vite configuration support for TanStack Router generation and chunk rules.
2. Introduce the route tree, root layout route, and leaf routes without changing main-process settings-window behavior yet.
3. Move current `App.tsx` shell/view logic into route components and remove local route state.
4. Move chart UI into `features/charts/`, keep only the necessary lazy-loading boundaries, and verify bundle outputs.
5. Switch the main-process settings-window target to `#/settings?standalone=1` and remove old hash compatibility logic.
6. Run verification, refresh `routeTree.gen.ts`, and commit the generated artifact with the route migration.

## Test Plan
- Static checks:
  - `pnpm run typecheck`
  - `pnpm run build`
- Build output checks:
  - Confirm that the renderer build output contains a dedicated `messages` route chunk.
  - Confirm that chart code is not pulled into the initial home-route path unless a chart route or chart preview is actually rendered.
- Manual verification:
  - On startup, confirm the app lands on the home page by default and the main shell layout matches the current behavior.
  - Click through sidebar routes one by one and confirm the hash, active state, and title update together.
  - Refresh the app while on `#/`, `#/upload`, `#/messages`, `#/settings`, and `#/settings?standalone=1`, and confirm each location restores correctly.
  - Visit `#/messages` directly and confirm the chart page renders correctly.
  - Open `#/upload` without uploading a file and confirm no chart preview code is requested.
  - Upload plottable data on the upload page and confirm the chart preview appears only at that point.
  - Upload a spreadsheet with no plottable data and confirm only a "no plottable data" placeholder is shown, without loading the chart preview code.
  - From the main window, open settings and confirm it navigates to `#/settings` while keeping the main shell.
  - Open settings via the menu or shortcut and confirm it navigates to `#/settings?standalone=1` and shows only settings content.
  - Enter an unknown hash and confirm the not-found page appears with a way back to home.
  - Confirm that unknown hashes do not redirect automatically to home.
  - Confirm the standalone settings window and main window both work in development and packaged builds with the same hash format.

## Assumptions
- The routing solution has been chosen as `TanStack Router + file-based routing + createHashHistory()`.
- The settings-page behavior has been chosen to preserve both the main-window settings page and the standalone settings window.
- Chart handling should stay minimal: use normal route-level and component-level lazy loading only, without additional named chart chunk strategy.
- This migration does not introduce a new test framework; it relies only on existing `typecheck/build` checks and manual smoke testing.
- No backward-compatibility requirement exists for legacy hash formats after this migration lands.
