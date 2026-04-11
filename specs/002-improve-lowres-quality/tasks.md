# Tasks: Low-Resolution Quality Boost

**Input**: Design documents from `/specs/002-improve-lowres-quality/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This task list adds/updates targeted automated tests where regression risk is highest and includes full quality-gate validation in the polish phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app paths used in this feature: `app/index.html`, `app/css/styles.css`, `app/js/`, `tests/`
- Feature documentation paths: `specs/002-improve-lowres-quality/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare low-resolution feature scaffolding and user-facing panel placeholders without changing core pipeline behavior yet.

- [X] T001 Add low-resolution quality mode copy placeholders and hints in app/index.html
- [X] T002 [P] Add low-resolution recommendation panel style hooks and responsive states in app/css/styles.css
- [X] T003 [P] Add feature-level validation workflow notes in specs/002-improve-lowres-quality/quickstart.md
- [X] T004 Add low-resolution feature constants and initialization guards in app/js/index.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared low-resolution assessment and option primitives used across all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Implement LowResolutionAssessment creation and stale-detection helpers in app/js/index.js
- [X] T006 [P] Implement low-resolution style option generation/scoring helpers (`cleaner_shapes`, `stronger_contrast`, `fewer_speckles`) in app/js/algo.js
- [X] T007 [P] Implement low-resolution profile serialization/deserialization helpers in app/js/ux-sharing.js
- [X] T008 Wire low-resolution contract request/response payload builders to specs/002-improve-lowres-quality/contracts/lowres-recommendation-ui-contract.md in app/js/index.js
- [X] T009 Add low-resolution error-state mapping (`NO_VALID_IMAGE_CONTEXT`, `PREPROCESSING_INCOMPLETE`, `NO_SUITABLE_RECOMMENDATION`, `STALE_SNAPSHOT`, `PROFILE_SAVE_FAILED`, `PROFILE_APPLY_INCOMPATIBLE`) in app/js/index.js
- [X] T010 Add low-resolution telemetry event definitions for option-generate/preview/apply/profile outcomes in app/js/metrics.js

**Checkpoint**: Foundation ready; user story implementation can proceed independently.

---

## Phase 3: User Story 1 - Preserve Subject Clarity (Priority: P1) MVP

**Goal**: Improve low-resolution output readability with subject-preserving option recommendations.

**Independent Test**: Use a low target resolution on a subject-focused image and verify generated output preserves subject silhouette/landmarks with reduced background noise.

### Implementation for User Story 1

- [ ] T011 [US1] Implement low-resolution mode activation and threshold detection in app/js/index.js
- [ ] T012 [US1] Implement subject-readability-oriented default recommendation flow for low-resolution context in app/js/index.js
- [ ] T013 [US1] Implement low-resolution picture-setting mapping (edge emphasis + noise control) in app/js/index.js
- [ ] T014 [US1] Update recommendation summary text to report readability improvements for low-resolution mode in app/index.html
- [ ] T015 [US1] Implement fallback guidance path when low-resolution optimization cannot improve current image in app/index.html
- [ ] T016 [US1] Add unit coverage for low-resolution recommendation option scoring and output shape in tests/unit/algo.spec.js
- [ ] T017 [US1] Add smoke scenario for low-resolution recommendation generation visibility in tests/e2e/smoke.spec.js

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Choose Low-Resolution Style Goals (Priority: P2)

**Goal**: Let users compare low-resolution style options safely and confirm one explicit working configuration.

**Independent Test**: Generate low-resolution options, switch between at least two goals, verify preview/metadata update, and confirm one option without losing manual editability.

### Implementation for User Story 2

- [ ] T018 [US2] Render low-resolution style option cards with active state and tradeoff labels in app/index.html
- [ ] T019 [US2] Implement low-resolution option preview switch handler (no implicit apply) in app/js/index.js
- [ ] T020 [US2] Add selected-option metadata panel updates (goal/tradeoff/confidence) for low-resolution styles in app/index.html
- [ ] T021 [US2] Persist explicitly applied low-resolution option as active working configuration in app/js/index.js
- [ ] T022 [US2] Enforce manual edit preservation when switching low-resolution options until explicit apply in app/js/index.js
- [ ] T023 [US2] Add smoke scenario validating option compare flow does not auto-apply state in tests/e2e/smoke.spec.js

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Reuse Low-Resolution Defaults (Priority: P3)

**Goal**: Save, list, and reapply low-resolution quality profiles across similar images.

**Independent Test**: Save an applied low-resolution profile from image A, load image B, apply the saved profile, and verify settings are restored and editable.

### Implementation for User Story 3

- [ ] T024 [US3] Add low-resolution save-profile UX affordances and helper text in app/index.html
- [ ] T025 [US3] Implement low-resolution profile save action using Firebase-backed + local fallback persistence patterns in app/js/ux-sharing.js
- [ ] T026 [US3] Implement low-resolution profile list retrieval/merge/render for reuse in app/js/ux-sharing.js
- [ ] T027 [US3] Add apply-saved-low-resolution-profile mapping to active controls and preview refresh in app/js/index.js
- [ ] T028 [US3] Implement low-resolution profile update/delete operations in app/js/ux-sharing.js
- [ ] T029 [US3] Add profile-apply compatibility guard and editable-control guarantee in app/js/index.js
- [ ] T030 [US3] Add smoke scenario for saved low-resolution profile apply flow in tests/e2e/smoke.spec.js

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, stale-regeneration validation, and quality-gate documentation.

- [ ] T031 [P] Tighten low-resolution recommendation copy and accessibility messaging in app/index.html
- [ ] T032 [P] Refine low-resolution recommendation panel spacing/focus/pressed states in app/css/styles.css
- [ ] T033 Validate stale assessment invalidation/regeneration behavior on crop and dimension changes in app/js/index.js
- [ ] T034 Run and record full quality gates (`npm run lint`, `npm run typecheck`, `npm test`, `npm run test:smoke`, `npm run build`) in specs/002-improve-lowres-quality/quickstart.md
- [ ] T035 Confirm no dependency changes and document constitution/dependency-policy compliance in specs/002-improve-lowres-quality/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phases 3-5)**: Depend on Foundational completion.
  - US1 (P1) first for MVP value.
  - US2 (P2) follows once US1 low-res generation baseline is stable.
  - US3 (P3) follows once apply flow and profile primitives are stable.
- **Polish (Phase 6)**: Depends on selected user story completion.

### User Story Dependencies

- **US1**: No dependency on other user stories.
- **US2**: Depends on US1 low-resolution generation/preview baseline.
- **US3**: Depends on US1 apply baseline and foundational profile helpers; independent from US2 once baseline exists.

### Within Each User Story

- Implement data and orchestration logic before UI interactions that depend on them.
- Keep compare/preview behavior separate from explicit apply semantics.
- Validate independent test criteria before moving to next story.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T006 and T007 can run in parallel.
- T031 and T032 can run in parallel.

---

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] Render low-resolution style option cards with active state and tradeoff labels in app/index.html"
Task: "T019 [US2] Implement low-resolution option preview switch handler (no implicit apply) in app/js/index.js"
Task: "T020 [US2] Add selected-option metadata panel updates (goal/tradeoff/confidence) for low-resolution styles in app/index.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independent test and quality gates.
4. Demo/release MVP increment.

### Incremental Delivery

1. Ship US1 low-resolution readability improvements.
2. Add US2 style comparison and explicit apply controls.
3. Add US3 profile save/reuse support.
4. Run Phase 6 polish and full validation before merge.

### Parallel Team Strategy

1. Developer A: US1 + low-resolution orchestration in app/js/index.js and app/js/algo.js.
2. Developer B: US2 comparison presentation and interaction UX in app/index.html + app/css/styles.css.
3. Developer C: US3 profile persistence/list CRUD in app/js/ux-sharing.js.

---

## Notes

- [P] tasks touch different files and can run concurrently.
- User story labels map implementation tasks directly to user outcomes.
- Keep low-resolution improvements reversible and preserve manual controls by design.
- Do not add dependencies in this feature unless constitution dependency policy steps are explicitly documented.
