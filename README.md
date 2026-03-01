# Lego Art Remix Too

Browser-based LEGO mosaic builder with optional depth-map support.

This repository is a maintained fork/remix of the original **Lego Art Remix** project created by **Deb Banerji**. It includes additional features and ongoing maintenance by the current maintainer(s) of this repo.

This project is not affiliated with The LEGO Group.

## Attribution

- Original project and concept: [debkbanerji/lego-art-remix](https://github.com/debkbanerji/lego-art-remix)
- This repository: independent maintained fork with added functionality and refactors

## What It Does

- Upload and crop an image
- Quantize colors to selected LEGO/Bricklink color sets
- Enforce available piece constraints
- Optionally generate depth maps in-browser (ONNX model in a web worker)
- Paint/tweak output manually
- Export instructions and Bricklink XML
- Save/load/share project snapshots

## Current Tech Snapshot

- Static web app (`app/index.html` + script files in `app/js`)
- Canvas-heavy rendering and processing
- Web worker for depth inference (`app/js/depth-map-web-worker.js`)
- Service worker registration (`app/js/sw-register.js`)
- No modern package/build/test baseline committed yet

## Repository Layout

- `app/index.html`: primary app shell and UI markup
- `app/js/index.js`: main orchestration, state, events, pipeline wiring
- `app/js/algo.js`: core image/color/pixel algorithms
- `app/js/ux-sharing.js`: save/load/share/export/palette helper features
- `app/js/depth-map-web-worker.js`: ONNX depth processing worker
- `app/css/styles.css`: styling
- `build-service-worker.js`: service worker build helper

## Development Notes

This codebase currently runs as a static site.

If you regenerate a service worker, use `build-service-worker.js` after setting up Node dependencies (workbox).

## Local Setup

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Quality Gates (Phase 0)

```bash
npm run lint
npm run typecheck
npm test
npm run test:smoke
npm run build
```

## Vendor Dependency Management (Phase 3)

Selected browser dependencies are now synced from `node_modules` into `app/vendor/` so the app can run without those CDNs (including Bootstrap, jQuery, Popper, jsPDF, D3, Cropper, and Firebase runtime scripts).

```bash
npm run vendor:sync
```

`postinstall` runs this automatically after `npm install`.

## Module Bootstrap (Phase 3)

The app now starts from a single module entry script: `app/js/module-entry.js`.
This module bootstraps vendor scripts and legacy app scripts in deterministic order, enabling incremental migration away from global script tags.

## Refactor Plan

A concrete modernization/refactor plan is documented in [REFACTOR_MAP.md](./REFACTOR_MAP.md).

## License

See [LICENSE](./LICENSE).
