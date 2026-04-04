# Quickstart: Recommended Color Palettes and Picture Settings

## Goal

Validate the recommendation workflow end-to-end in the existing browser app.

## Prerequisites

- Node dependencies installed
- Local app runs via existing dev script
- Test image file available

## Steps

1. Start the app with `npm run dev`.
2. Upload and crop a test image.
3. Trigger recommendation generation.
4. Confirm at least three recommendation options are shown with clear labels.
5. Apply the default option and verify preview updates.
6. Switch to another option and verify preview + summary update again.
7. Make a manual adjustment after applying recommendation and verify manual control is preserved.
8. Save the current profile for reuse.
9. Load a second image and apply the saved profile.
10. Verify settings are pre-filled and editable.

## Validation Commands

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:smoke`
- `npm run build`

## Expected Result

- Recommendation workflow speeds initial setup while preserving all existing manual tuning behavior.