# Recommendation UI Contract

## Purpose

Define the UI-level contract between recommendation generation logic and the existing application orchestration.

## Inputs

### Generate Recommendations Request

- Trigger: user requests recommendations after valid image upload/crop context.
- Payload:
  - `sourceImageId` (string)
  - `cropBounds` (object)
  - `targetDimensions` (object)
  - `activeConstraints` (object): current palette/piece or other user-selected limits.

## Outputs

### Recommendations Ready Response

- Payload:
  - `snapshotId` (string)
  - `options` (array of RecommendationOption)
  - `generatedAt` (datetime)

### Recommendation Apply Response

- Payload:
  - `appliedOptionId` (string)
  - `activeProfile` (RecommendationProfile-compatible object)
  - `previewRefreshRequired` (boolean, expected true)

## Errors

- `NO_VALID_IMAGE_CONTEXT`: no valid input image/crop context.
- `PREPROCESSING_INCOMPLETE`: recommendation requested before required preprocessing.
- `NO_SUITABLE_RECOMMENDATION`: generation completed with no acceptable options.
- `STALE_SNAPSHOT`: apply attempted after crop/dimension change invalidated source snapshot.

## UI Behavior Guarantees

- Applying an option never removes manual-edit capability.
- Changing crop or target dimensions invalidates old options and prompts regeneration.
- User can confirm one option as active configuration without losing ability to fine-tune.