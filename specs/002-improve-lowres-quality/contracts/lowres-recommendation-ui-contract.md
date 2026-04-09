# Low-Resolution Recommendation UI Contract

## Purpose

Define the UI-level contract for low-resolution style recommendation, comparison, apply, and profile reuse.

## Inputs

### Generate Low-Res Options Request

- Trigger: recommendation generation when low-resolution context is active or requested.
- Payload:
  - `sourceImageId` (string)
  - `cropBounds` (object)
  - `targetDimensions` (object)
  - `activeConstraints` (object)
  - `lowResMode` (boolean)

### Apply Low-Res Option Request

- Trigger: user confirms selected low-resolution option.
- Payload:
  - `optionId` (string)
  - `assessmentId` (string)

### Save Low-Res Profile Request

- Trigger: user saves current low-resolution working configuration.
- Payload:
  - `name` (string)
  - `sourceGoal` (string, optional)
  - `paletteId` (string)
  - `pictureSettings` (object)
  - `ownerRef` (string, optional)

## Outputs

### Low-Res Options Ready Response

- Payload:
  - `assessmentId` (string)
  - `options` (array of LowResolutionStyleOption)
  - `generatedAt` (datetime)

### Low-Res Option Preview Response

- Payload:
  - `previewOptionId` (string)
  - `summary` (object)
  - `metadata` (object: goal, tradeoff, confidence)

### Low-Res Option Apply Response

- Payload:
  - `appliedOptionId` (string)
  - `activeProfile` (LowResolutionQualityProfile-compatible object)
  - `previewRefreshRequired` (boolean, expected true)

### Saved Profiles List Response

- Payload:
  - `profiles` (array of LowResolutionQualityProfile)
  - `source` (enum: `firebase`, `local`, `merged`)

## Errors

- `NO_VALID_IMAGE_CONTEXT`: missing valid image/crop input.
- `PREPROCESSING_INCOMPLETE`: request attempted before preprocessing readiness.
- `NO_SUITABLE_RECOMMENDATION`: no acceptable low-resolution option generated.
- `STALE_SNAPSHOT`: apply/preview attempted using stale assessment context.
- `PROFILE_SAVE_FAILED`: profile persistence attempt failed.
- `PROFILE_APPLY_INCOMPATIBLE`: saved profile cannot be safely mapped to current context.

## UI Behavior Guarantees

- Switching options for comparison does not overwrite active working configuration until explicit apply.
- Applying low-resolution option preserves manual editing capability.
- Crop/dimension changes invalidate stale low-res options and trigger regeneration guidance.
- Saved profile apply maps settings to current controls while keeping all controls editable.
