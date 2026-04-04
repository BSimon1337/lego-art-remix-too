# Phase 0 Research: Recommended Color Palettes and Picture Settings

## Decision 1: Keep recommendation logic in existing frontend JS pipeline

- Decision: Implement recommendation generation in the existing browser-side orchestration flow.
- Rationale: Preserves the established product model and avoids adding backend coupling for core behavior.
- Alternatives considered:
  - Add server-side recommendation service: rejected due to deployment complexity and privacy/runtime shift.
  - Defer recommendation generation to worker only: not selected for v1 because UI integration and orchestration still
    need main-thread coordination.

## Decision 2: Use Bootstrap-native UI components for recommendation presentation

- Decision: Render recommendation options with existing Bootstrap card/list/button patterns.
- Rationale: Matches current visual system and minimizes UI inconsistency risk.
- Alternatives considered:
  - Introduce new component framework: rejected; high migration cost and low incremental value.
  - Custom non-Bootstrap styling: rejected for maintainability and consistency concerns.

## Decision 3: Persist reusable recommendation profiles using Firebase storage conventions

- Decision: Store reusable profiles in Firebase-backed project/user storage pathways already used for save/load/share.
- Rationale: Reuses existing persistence patterns and supports cross-session retrieval for returning creators.
- Alternatives considered:
  - Local-only browser storage: rejected as primary because it limits cross-device/session reuse.
  - New external storage provider: rejected due to additional dependency and governance overhead.

## Decision 4: Recommendation option model

- Decision: Provide at least three recommendation goals in v1: balanced quality, lower piece count, stronger detail.
- Rationale: Covers common user intents while remaining simple and explainable.
- Alternatives considered:
  - Single recommendation only: rejected because it does not support compare-and-choose workflow.
  - Large set of advanced options in v1: rejected due to cognitive overload and slower delivery.

## Decision 5: Recalculation and stale-state handling

- Decision: Invalidate and regenerate recommendations when crop or target dimensions change.
- Rationale: Prevents mismatched previews and preserves trust in recommendation outputs.
- Alternatives considered:
  - Keep prior recommendations and warn only: rejected; risk of incorrect application is too high.
  - Auto-apply regenerated recommendation immediately: rejected to preserve user control.