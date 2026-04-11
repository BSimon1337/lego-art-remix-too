# Data Model: Low-Resolution Quality Boost

## Entity: LowResolutionAssessment

- Purpose: Captures low-resolution suitability and current context constraints used to drive optimization guidance.
- Fields:
  - `assessmentId` (string, required): unique identifier for assessment run.
  - `sourceImageId` (string, required): reference to active image session.
  - `targetDimensions` (object, required): selected output width/height.
  - `isLowResolution` (boolean, required): whether current dimensions trigger low-res logic.
  - `subjectContrastScore` (number, required): normalized estimate of subject/background separation.
  - `noiseLevelScore` (number, required): normalized estimate of high-frequency noise.
  - `generatedAt` (datetime, required): assessment timestamp.
- Validation:
  - Scores must be in [0,1].
  - Assessment is stale if crop bounds or dimensions no longer match current UI state.

## Entity: LowResolutionStyleOption

- Purpose: A generated candidate configuration tuned for a specific low-resolution quality goal.
- Fields:
  - `optionId` (string, required)
  - `goal` (enum, required): `cleaner_shapes`, `stronger_contrast`, `fewer_speckles`
  - `pictureSettings` (object, required): recommendation settings mapped to current controls.
  - `summary` (object, required): label and tradeoff explanation.
  - `confidence` (number, required): normalized suitability score.
  - `assessmentId` (string, required): parent LowResolutionAssessment reference.
- Validation:
  - `confidence` must be in [0,1].
  - Mapped settings must stay within current UI control ranges.

## Entity: LowResolutionQualityProfile

- Purpose: User-saved reusable profile for low-resolution quality settings.
- Fields:
  - `profileId` (string, required)
  - `name` (string, required)
  - `sourceGoal` (enum, optional): originating style goal.
  - `paletteId` (string, required)
  - `pictureSettings` (object, required)
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
  - `ownerRef` (string, optional): project/user storage scope key.
- Validation:
  - `name` length must be 1-80 characters.
  - Profile apply must preserve editability of all manual controls.

## Relationships

- One `LowResolutionAssessment` can generate many `LowResolutionStyleOption` records.
- One `LowResolutionStyleOption` can be applied as the active working configuration.
- One applied style can be persisted as one `LowResolutionQualityProfile`.
- A `LowResolutionQualityProfile` can be reused across many projects/images.

## State Transitions

1. `LowResolutionAssessment`: `generated` -> `active` -> (`stale` when crop/dimensions change) -> `archived`.
2. `LowResolutionStyleOption`: `generated` -> `previewed` -> (`applied` | `discarded`).
3. `LowResolutionQualityProfile`: `draft` -> `saved` -> (`updated` | `deleted`).
