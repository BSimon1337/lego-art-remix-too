# Refactor Map (2026)

This map is for the current `lego-art-remix-too` app structure and aims to modernize the codebase without breaking the existing browser-first product model.

## Progress

- Phase 0 baseline setup has been started in-repo:
  - Tooling/config files added
  - Unit tests and smoke e2e added
  - CI workflow added
- Phase 1 boundary extraction has started:
  - Shared UI helpers extracted from `index.js` to `app/js/core-ui-utils.js`
  - Override undo/redo state handling extracted to `app/js/override-history.js`
- Phase 2 reliability work has started:
  - Replaced several `setTimeout`-based image/depth sequencing paths with async frame/file/image helpers in `app/js/index.js`
  - Replaced timeout deferrals in `runStep1`/`runStep2`/`runStep3`/`runStep4` and 3D preview setup with frame-scheduled sequencing
- Phase 3 modernization has started:
  - Added npm-managed vendor sync pipeline (`scripts/sync-vendor.cjs`, `npm run vendor:sync`)
  - Migrated Bootstrap/jQuery/Popper/jsPDF/D3/d3-color-difference/Cropper/Firebase from CDN links to local `app/vendor/*` assets
  - Added module bootstrap entry (`app/js/module-entry.js`) and switched HTML to `type="module"` startup
  - Promoted `metrics.js` from classic script loading to direct ESM import via module entry
  - Promoted `ux-sharing.js` to ESM import via `AppBridge` interface instead of implicit global coupling
  - Promoted `bricklink-colors.js` and `stud-maps.js` to ESM imports with compatibility `window` exports

## Goals

- Keep the product model: client-side processing, privacy-first, low hosting complexity
- Reduce change risk by splitting the monolith into testable modules
- Add a modern build/test/release baseline
- Preserve current behavior while improving maintainability and performance

## Current State Summary

- Large orchestration file: `app/js/index.js` (~2.7k lines)
- Algorithm layer exists but still coupled through globals/events
- UI is script-driven from one large HTML shell
- Mixed maturity: newer UX helpers exist, but many are MVP/scaffold level
- Manual deployment/build steps and no committed package/tooling baseline

## Target Architecture

### Runtime

- Keep browser-only runtime for core image processing
- Keep worker-based depth inference
- Keep static deploy compatibility

### Code Organization

- `src/core/` for pure algorithms and transforms
- `src/state/` for typed app state and actions
- `src/ui/` for DOM adapters/controllers
- `src/workers/` for depth worker and worker protocol
- `src/infra/` for analytics, storage, and feature flags

### Tooling

- Vite + TypeScript + ESLint + Prettier
- Vitest for unit tests
- Playwright for basic end-to-end regression checks

## Phased Plan

## Phase 0: Baseline and Safety Net (Low risk, high value)

- Add `package.json`, scripts, lint, format, type-check, test commands
- Add a smoke e2e flow (load app, upload sample, run pipeline, export)
- Add snapshot/golden tests for representative algorithm outputs
- Capture current behavior docs to prevent accidental regressions

Deliverables:

- `package.json`, `tsconfig.json`, `eslint.config.*`
- CI workflow for lint/typecheck/tests
- `tests/` baseline with 3-5 high-value cases

## Phase 1: Boundary Extraction (No UX redesign yet)

- Extract pure functions from `app/js/index.js` into modules (no behavior change)
- Introduce a central `AppState` object and typed action methods
- Replace global mutable variables with state selectors/update functions
- Keep existing DOM IDs and UI structure initially

Key extractions from current files:

- `app/js/index.js` -> `src/state/app-state.ts`
- `app/js/index.js` -> `src/ui/events.ts`
- `app/js/index.js` -> `src/pipeline/run-step1..4.ts`
- `app/js/algo.js` -> `src/core/color-quantization.ts`, `src/core/stud-map.ts`

## Phase 2: Async and Worker Reliability

- Replace timeout-driven sequencing with deterministic async flow
- Define worker message contract types (`request`, `progress`, `result`, `error`)
- Add explicit cancellation/ignore-stale-run behavior for rapid user edits
- Add error surfaces (UI banners/toasts) instead of silent failures

Current hotspot to fix first:

- Repeated `setTimeout(..., 50)` sequencing around image/depth pipeline and worker handoff

## Phase 3: Dependency and Build Modernization

- Move from CDN globals to npm-managed imports
- Upgrade legacy dependencies where needed (or remove if no longer necessary)
- Generate service worker in a repeatable script integrated in build
- Keep output static-deploy friendly

Concrete outcomes:

- Reproducible `npm run build`
- Predictable lockfile and dependency updates
- Single source of truth for app version/build metadata

## Phase 4: UX/Accessibility Hardening

- Replace `alert()` flows with non-blocking in-app notifications
- Improve keyboard support and ARIA labels in heavy control panels
- Tighten contrast/focus states in both light and dark themes
- Preserve existing workflow but reduce interaction friction

## Phase 5: Observability and Data Hygiene

- Isolate analytics in one module with explicit event schema
- Remove hardcoded operational details from HTML where possible
- Make telemetry optional/configurable by environment
- Add small diagnostics panel for local perf debugging

## Suggested Execution Order (Practical)

1. Phase 0 (baseline tooling + tests)
2. Phase 1 (module extraction)
3. Phase 2 (async/worker reliability)
4. Phase 3 (dependency/build modernization)
5. Phase 4 and 5 (UX/accessibility + observability)

## Estimated Effort

- Phase 0: 1-2 days
- Phase 1: 3-5 days
- Phase 2: 2-3 days
- Phase 3: 2-4 days
- Phase 4/5: 2-4 days

Total: ~2-4 weeks part-time, depending on regression scope and depth of test coverage.

## Risks and Mitigations

- Risk: behavior regressions in quantization/correction logic
  - Mitigation: golden output tests before structural changes
- Risk: worker/inference differences after dependency updates
  - Mitigation: fixed sample inputs and pixel-level tolerance checks
- Risk: long-lived UI assumptions tied to DOM structure
  - Mitigation: keep DOM contract stable until late phases

## Definition of Done

- New contributor can run `install -> dev -> test -> build` without tribal knowledge
- Core pipeline is modular and test-covered
- No timeout-based orchestration for critical pipeline paths
- Static deployment remains supported
- Attribution and project ownership are clearly documented
