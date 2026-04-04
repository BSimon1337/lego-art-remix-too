# Tasks: Recommended Color Palettes and Picture Settings

**Input**: Design documents from `/specs/001-recommended-palette-settings/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This task list does not add new automated tests by default. Validation is executed through existing quality gates and smoke coverage unless test additions are requested in implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app paths used in this feature: `app/index.html`, `app/css/`, `app/js/`, `tests/`
- Feature documentation paths: `specs/001-recommended-palette-settings/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare UI placeholders and feature-scoped scaffolding without changing user-visible behavior yet.

- [X] T001 Add recommendation panel placeholders and action controls in app/index.html
- [X] T002 [P] Add recommendation panel layout and responsive Bootstrap-aligned styling in app/css/styles.css
- [X] T003 [P] Add feature notes for recommendation workflow checkpoints in specs/001-recommended-palette-settings/quickstart.md
- [X] T004 Create feature constants and initialization guards for recommendations in app/js/index.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core recommendation domain logic and shared orchestration used by all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Implement ImageAnalysisSnapshot creation and stale-detection helpers in app/js/index.js
- [X] T006 [P] Implement RecommendationOption generation helpers and scoring goals in app/js/algo.js
- [X] T007 [P] Implement RecommendationProfile serialization/deserialization helpers in app/js/ux-sharing.js
- [X] T008 Wire recommendation contract payload assembly to match specs/001-recommended-palette-settings/contracts/recommendation-ui-contract.md in app/js/index.js
- [X] T009 Add recommendation error-state mapping (`NO_VALID_IMAGE_CONTEXT`, `PREPROCESSING_INCOMPLETE`, `NO_SUITABLE_RECOMMENDATION`, `STALE_SNAPSHOT`) in app/js/index.js
- [X] T010 Add recommendation telemetry events for generate/apply/fallback outcomes in app/js/metrics.js

**Checkpoint**: Foundation ready; user story implementation can proceed independently.

---

## Phase 3: User Story 1 - Get a Starter Recommendation (Priority: P1) MVP

**Goal**: Provide at least one apply-ready recommendation immediately after valid image context exists.

**Independent Test**: Upload an image, request recommendations, apply the default option, and verify preview updates while controls remain editable.

### Implementation for User Story 1

- [ ] T011 [US1] Implement recommendation request trigger flow after valid upload/crop context in app/js/index.js
- [ ] T012 [US1] Render recommendation list with labels and summary text in app/index.html
- [ ] T013 [US1] Bind recommendation render/update DOM logic for starter option display in app/js/index.js
- [ ] T014 [US1] Implement one-click apply handler that updates active palette and picture settings in app/js/index.js
- [ ] T015 [US1] Ensure manual controls stay enabled after recommendation apply in app/js/index.js
- [ ] T016 [US1] Show fallback message path when no suitable recommendation is returned in app/index.html

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Compare Recommendation Options (Priority: P2)

**Goal**: Let users review multiple recommendation goals and switch options safely before confirming one.

**Independent Test**: Generate recommendations, switch between at least two options, confirm one option, and verify preview + summary alignment.

### Implementation for User Story 2

- [ ] T017 [US2] Expand recommendation generation to provide balanced/lower-piece/stronger-detail options in app/js/algo.js
- [ ] T018 [US2] Render selectable option cards and active selection state in app/index.html
- [ ] T019 [US2] Implement option-switch handler that refreshes preview and summary in app/js/index.js
- [ ] T020 [US2] Add selected-option metadata panel (goal/tradeoff/confidence) in app/index.html
- [ ] T021 [US2] Persist active option as current working configuration in app/js/index.js
- [ ] T022 [US2] Ensure option comparisons do not overwrite user manual changes until explicit apply in app/js/index.js

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Reuse Recommendations Across Similar Images (Priority: P3)

**Goal**: Allow users to save and later reapply recommendation profiles for faster repeat workflows.

**Independent Test**: Save a recommendation profile from image A, load image B, apply saved profile, and verify settings are prefilled and editable.

### Implementation for User Story 3

- [ ] T023 [US3] Add save-profile control and profile naming UI in app/index.html
- [ ] T024 [US3] Implement save-profile action using existing Firebase persistence patterns in app/js/ux-sharing.js
- [ ] T025 [US3] Implement profile list retrieval and rendering for reuse in app/js/ux-sharing.js
- [ ] T026 [US3] Add apply-saved-profile action that maps profile values to active controls in app/js/index.js
- [ ] T027 [US3] Add profile update/delete support for saved recommendations in app/js/ux-sharing.js
- [ ] T028 [US3] Ensure saved-profile apply keeps all controls editable and compatible with current image context in app/js/index.js

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, validation, and documentation updates across stories.

- [ ] T029 [P] Update recommendation UX copy and error/help text consistency in app/index.html
- [ ] T030 [P] Tighten recommendation panel spacing/accessibility states in app/css/styles.css
- [ ] T031 Validate stale snapshot regeneration behavior on crop/dimension change in app/js/index.js
- [ ] T032 Run and record applicable quality gates in specs/001-recommended-palette-settings/quickstart.md using commands from package.json
- [ ] T033 Confirm no dependency changes were introduced and document policy compliance in specs/001-recommended-palette-settings/plan.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phases 3-5)**: Depend on Foundational completion.
  - US1 (P1) first for MVP value.
  - US2 (P2) and US3 (P3) follow, and can proceed in parallel after US1 core contracts are stable.
- **Polish (Phase 6)**: Depends on completion of selected user stories.

### User Story Dependencies

- **US1**: No dependency on other user stories.
- **US2**: Depends on US1 recommendation generation/apply baseline.
- **US3**: Depends on US1 apply flow and foundational persistence helpers; independent from US2 once baseline exists.

### Within Each User Story

- Implement core data/logic wiring before UI interactions that depend on it.
- Apply handlers before advanced UX refinements.
- Confirm independent test criteria before moving to next story.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T006 and T007 can run in parallel.
- Polish tasks T029 and T030 can run in parallel.

---

## Parallel Example: User Story 2

```bash
Task: "T018 [US2] Render selectable option cards and active selection state in app/index.html"
Task: "T019 [US2] Implement option-switch handler that refreshes preview and summary in app/js/index.js"
Task: "T020 [US2] Add selected-option metadata panel (goal/tradeoff/confidence) in app/index.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independent test and quality gates.
4. Demo/release MVP increment.

### Incremental Delivery

1. Ship US1 starter recommendation.
2. Add US2 comparison experience.
3. Add US3 profile save/reuse.
4. Run Phase 6 polish and full validation before final merge.

### Parallel Team Strategy

1. Developer A: US1 + core orchestration touchpoints in app/js/index.js.
2. Developer B: US2 UI and comparison presentation in app/index.html and app/css/styles.css.
3. Developer C: US3 persistence and profile workflows in app/js/ux-sharing.js.

---

## Notes

- [P] tasks touch different files and can run concurrently.
- User story labels map every implementation task to a specific outcome.
- Keep recommendation features reversible and preserve manual controls by design.
- Do not add new dependencies in this feature unless constitution policy checks are updated.
