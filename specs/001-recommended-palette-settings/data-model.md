# Data Model: Recommended Color Palettes and Picture Settings

## Entity: ImageAnalysisSnapshot

- Purpose: Captures the image/crop context used to generate recommendation options.
- Fields:
  - `snapshotId` (string, required): unique identifier for analysis run.
  - `sourceImageId` (string, required): reference to uploaded image session.
  - `cropBounds` (object, required): normalized crop rectangle.
  - `targetDimensions` (object, required): selected mosaic width/height context.
  - `colorComplexityScore` (number, required): normalized image complexity estimate.
  - `contrastScore` (number, required): normalized contrast estimate.
  - `generatedAt` (datetime, required): timestamp for stale detection.
- Validation:
  - `colorComplexityScore` and `contrastScore` must be in [0,1].
  - Snapshot is invalid if crop or target dimensions no longer match current UI state.

## Entity: RecommendationOption

- Purpose: A generated candidate configuration users can review and apply.
- Fields:
  - `optionId` (string, required)
  - `goal` (enum, required): `balanced_quality`, `lower_piece_count`, `stronger_detail`
  - `paletteId` (string, required)
  - `pictureSettings` (object, required): selected tunable settings for image conversion pipeline.
  - `summary` (object, required): human-readable label plus expected tradeoff text.
  - `confidence` (number, required): normalized confidence estimate for option suitability.
  - `snapshotId` (string, required): parent ImageAnalysisSnapshot reference.
- Validation:
  - `confidence` must be in [0,1].
  - `pictureSettings` must satisfy current control ranges used by the app.

## Entity: RecommendationProfile

- Purpose: User-confirmed recommendation configuration for immediate use and optional reuse.
- Fields:
  - `profileId` (string, required)
  - `name` (string, required)
  - `paletteId` (string, required)
  - `pictureSettings` (object, required)
  - `sourceGoal` (enum, optional): originating recommendation goal.
  - `createdAt` (datetime, required)
  - `updatedAt` (datetime, required)
  - `ownerRef` (string, optional): project/user scope key in existing persistence model.
- Validation:
  - `name` length 1-80 chars.
  - `pictureSettings` must remain editable after apply.

## Relationships

- One `ImageAnalysisSnapshot` can generate many `RecommendationOption` records.
- One chosen `RecommendationOption` can become one `RecommendationProfile`.
- A `RecommendationProfile` can be applied to many future images/projects.

## State Transitions

1. `ImageAnalysisSnapshot`: `created` -> `active` -> (`stale` when crop/dimensions changed) -> `archived`.
2. `RecommendationOption`: `generated` -> `presented` -> (`applied` | `discarded`).
3. `RecommendationProfile`: `draft-from-option` -> `saved` -> (`updated` | `deleted`).