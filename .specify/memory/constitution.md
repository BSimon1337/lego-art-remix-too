<!--
Sync Impact Report
- Version change: 1.0.0 -> 1.1.0
- Modified principles:
  - II. Modernization With Measurable Value -> II. Modernization With Measurable Value
    (expanded with npm exact-pin and 7-day minimum-age requirements)
- Added sections:
  - None
- Removed sections:
  - None
- Templates requiring updates:
  - updated: .specify/templates/plan-template.md
  - updated: .specify/templates/spec-template.md
  - updated: .specify/templates/tasks-template.md
  - pending: .specify/templates/commands/*.md (directory not present in this repo)
- Follow-up TODOs:
  - None
-->

# Lego Art Remix Too Constitution

## Core Principles

### I. Pattern-First Evolution
Changes in legacy areas MUST follow existing user-facing and codebase patterns when those patterns still
serve correctness, readability, and maintainability. Deviations are allowed only when the change records
why the current pattern is insufficient and what safer replacement is introduced.
Rationale: This repository is an active fork with substantial legacy behavior that users rely on.

### II. Modernization With Measurable Value
Modernization work MUST deliver a measurable improvement in at least one of these areas:
maintainability, reliability, performance, accessibility, or developer workflow. Modernization that only
changes style or structure without operational value SHOULD be deferred.
When introducing or updating npm packages, versions MUST be pinned to exact versions (no range operators)
and selected releases MUST be at least 7 days old at the time of adoption.
Rationale: The project should evolve, but only where value exceeds migration risk.

### III. Regression Safety (NON-NEGOTIABLE)
Behavior-preserving changes MUST be validated with repository quality gates relevant to the touched scope:
`npm run lint`, `npm run typecheck`, `npm test`, `npm run test:smoke`, and `npm run build` when applicable.
For bug fixes and high-risk refactors, contributors SHOULD add or update a failing test first when feasible.
Rationale: The app has a complex browser pipeline where subtle regressions are costly.

### IV. Browser-First Runtime and Privacy
Core image and mosaic workflows MUST remain functional in a browser-first, static-deploy-compatible model.
Any change that adds backend dependence to core workflows requires explicit approval and a migration plan.
User data handling MUST remain privacy-conscious and minimal by default.
Rationale: Browser execution and low hosting complexity are core product characteristics.

### V. Small, Reversible Delivery
Work SHOULD ship in small, reviewable slices that can be independently validated and rolled back.
Large cross-cutting refactors MUST include checkpoints and compatibility notes for in-flight work.
Rationale: Incremental delivery protects velocity and lowers integration risk in a long-running codebase.

## Engineering Constraints

- Primary runtime MUST remain a static web application rooted in `app/`.
- Existing orchestration flows in `app/js/index.js` and adjacent modules MUST be treated as compatibility
  boundaries during refactors unless a documented migration step is included.
- Dependency updates SHOULD prefer npm-managed and reproducible workflows over ad-hoc CDN/runtime drift.
- All `dependencies` and `devDependencies` entries in `package.json` MUST use exact pinned versions.
- New npm package versions MUST have a published age of at least 7 days before adoption unless a documented
  maintainer exception is approved for a critical fix.
- New tools and conventions MUST be documented in repository guidance before they become required gates.

## Workflow and Quality Gates

- Every implementation plan MUST include a Constitution Check that maps proposed work to all five principles.
- Every feature spec MUST explicitly state:
  - which existing patterns are preserved;
  - which modern updates are introduced and why they provide measurable value;
  - how npm dependency choices satisfy the 7-day minimum-age and exact-pin policy when dependencies change;
  - how regression safety will be validated.
- Task breakdowns MUST include explicit validation tasks for affected quality gates and compatibility checks.
- Pull requests MUST document risk level, validation evidence, and any intentional principle exceptions.

## Governance

This constitution overrides conflicting local habits for planning and delivery in this repository.
Amendments require: (1) a documented proposal, (2) maintainer approval, and (3) updates to impacted
templates under `.specify/templates/`.

Versioning policy:
- MAJOR: Removes or fundamentally redefines a principle/governance guarantee.
- MINOR: Adds a new principle/section or materially expands existing obligations.
- PATCH: Clarifies wording without changing obligations.

Compliance review expectations:
- `/speckit.plan`, `/speckit.specify`, and `/speckit.tasks` outputs MUST pass constitution checks before
  implementation starts.
- Reviews MUST block merges that violate NON-NEGOTIABLE rules unless an approved exception is recorded.

**Version**: 1.1.0 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-04
