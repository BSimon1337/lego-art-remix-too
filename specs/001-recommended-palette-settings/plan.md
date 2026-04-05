# Implementation Plan: Recommended Color Palettes and Picture Settings

**Branch**: `001-recommended-palette-settings` | **Date**: 2026-04-04 | **Spec**: [/specs/001-recommended-palette-settings/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-recommended-palette-settings/spec.md`

## Summary

Add a recommendation layer that suggests color palette and picture-setting profiles immediately after image
upload/crop, lets users compare options, and supports saving/reusing profiles. The implementation keeps the
existing browser-first flow and manual controls intact while adding guided defaults to reduce setup time.

## Technical Context

**Language/Version**: Vanilla JavaScript (ES modules in existing Vite-served app)  
**Primary Dependencies**: Bootstrap (existing UI styling system), Firebase (existing storage and sharing stack)  
**Storage**: Firebase (profile persistence), existing in-browser state for active session  
**Testing**: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:smoke`, `npm run build`  
**Target Platform**: Modern desktop/mobile browsers for static web app delivery  
**Project Type**: Single frontend web application (static deploy)  
**Performance Goals**: First recommendation visible within 2 seconds after image preprocessing for typical inputs  
**Constraints**: Preserve current upload -> configure -> preview workflow and keep full manual override capability  
**Scale/Scope**: Initial rollout for current creator workflow, with reusable profiles per user/project context

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Pattern-First Evolution**: Existing upload, crop, manual adjust, and preview patterns remain primary.
- [x] **Modernization Value**: Recommendation workflow improves setup speed and reduces failed first attempts.
- [x] **Dependency Policy**: No new package adoption in scope; existing pinned dependency policy remains intact.
- [x] **Regression Safety**: Plan includes full repository quality gates plus workflow behavior checks.
- [x] **Browser-First Runtime**: Feature remains fully browser-first and static deploy compatible.
- [x] **Small, Reversible Delivery**: Work split into recommendation generation, comparison, then save/reuse.

Post-design re-check: PASS. Artifacts in this plan preserve all constitutional constraints with no exceptions.

## Project Structure

### Documentation (this feature)

```text
specs/001-recommended-palette-settings/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- recommendation-ui-contract.md
`-- tasks.md
```

### Source Code (repository root)

```text
app/
|-- index.html
|-- css/
|   `-- styles.css
`-- js/
    |-- index.js
    |-- algo.js
    |-- ux-sharing.js
    |-- metrics.js
    |-- bricklink-colors.js
    |-- stud-maps.js
    `-- depth-map-web-worker.js

tests/
|-- unit/
|-- integration/
`-- e2e/
```

**Structure Decision**: Use the current single-project static web structure under `app/` and implement
feature logic in existing JS orchestration/modules with tests in the current `tests/` layout.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase 6 Compliance Check (2026-04-05)

- Dependency policy: PASS. No dependency or lockfile changes were introduced (`package.json` and `package-lock.json` unchanged).
- Quality gates: PASS for `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:smoke`, and `npm run build`.
