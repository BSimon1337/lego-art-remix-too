# Phase 0 Research: Low-Resolution Quality Boost

## Decision 1: Use resolution-aware optimization only when target size is small

- Decision: Enable low-resolution quality guidance only when width/height are within a configured small-size range.
- Rationale: Limits visual behavior changes to contexts where low-resolution quality loss is most severe.
- Alternatives considered:
  - Always-on optimization: rejected because it can over-process medium/high-resolution outputs.
  - Manual-only toggle with no auto behavior: rejected because first-time low-res users may miss the feature.

## Decision 2: Preserve existing recommendation architecture and extend it for low-res goals

- Decision: Extend existing recommendation option generation/selection/apply flows rather than introducing a separate low-res pipeline.
- Rationale: Minimizes integration risk and keeps behavior aligned with current recommendation UX.
- Alternatives considered:
  - Create a separate low-res module and UI flow: rejected due to duplicated logic and higher regression risk.
  - Backend-assisted recommendation computation: rejected because browser-first runtime is a core constraint.

## Decision 3: Prioritize subject readability with configurable style goals

- Decision: Offer low-res style goals centered on clarity outcomes (for example cleaner shapes, stronger contrast, fewer speckles).
- Rationale: Different images need different tradeoffs; style goals provide transparent control without manual trial-and-error.
- Alternatives considered:
  - Single fixed style: rejected because it does not generalize across image types.
  - Fully manual tuning only: rejected because it is slower and less consistent for low-res workflows.

## Decision 4: Keep explicit apply semantics during option comparisons

- Decision: Preview and compare options without overwriting current working settings until explicit apply.
- Rationale: Protects user intent and preserves manual adjustments during exploration.
- Alternatives considered:
  - Auto-apply on every option switch: rejected because it can silently overwrite manual edits.

## Decision 5: Reuse existing Firebase + local fallback profile persistence pattern

- Decision: Store low-resolution profiles using existing Firebase-backed profile storage with local fallback behavior.
- Rationale: Maintains consistency with current persistence model and supports cross-session reuse.
- Alternatives considered:
  - Local-only storage: rejected as primary path because it limits cross-device continuity.

## Decision 6: Validate with full repository quality gates and low-res focused behavior checks

- Decision: Require lint/typecheck/unit/smoke/build plus behavioral checks on low-res clarity and style switching.
- Rationale: Low-res tuning affects pipeline behavior and UI state; full gates reduce regression risk.
- Alternatives considered:
  - Partial test-only validation: rejected due to high chance of subtle UI/pipeline regressions.
