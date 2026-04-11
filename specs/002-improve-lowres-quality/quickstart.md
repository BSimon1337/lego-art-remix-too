# Quickstart: Low-Resolution Quality Boost

## Goal

Validate low-resolution recommendation quality improvements end-to-end in the browser app.

## Prerequisites

- Node dependencies installed
- App runs locally via existing scripts
- At least two test images (subject-focused and noisy-background examples)

## Phase 1 Setup Checkpoints

- Recommendation panel includes a low-resolution quality hint scaffold.
- Low-resolution mode badge placeholder exists and is initialization-ready.
- Low-resolution style hooks are present in CSS without changing current runtime behavior.
- Low-resolution constants and initialization guards load once at startup.

## Steps

1. Start the app with `npm run dev`.
2. Upload and crop a subject-forward image.
3. Set a low target resolution (for example 32x32 or 48x48).
4. Generate low-resolution recommendation options.
5. Confirm at least two distinct style options are visible with clear summaries.
6. Switch between options and verify preview and metadata change without applying.
7. Apply one option and verify output updates while manual controls remain editable.
8. Save the active low-resolution profile.
9. Upload a second image and apply the saved low-resolution profile.
10. Verify settings are restored and still fully editable.
11. Change crop or dimensions and confirm stale options are invalidated/regenerated.

## Validation Commands

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:smoke`
- `npm run build`

## Expected Result

- Low-resolution outputs show improved subject readability and reduced visual noise while preserving manual workflow control.
