### Implementation Plan: Pixel borders & heart icons (invite UI)

**Branch**: `001-add-pixel-hearts` | **Date**: 2026-02-12 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-add-pixel-hearts/spec.md`

## Summary

Add an 8-bit / pixel-art style border that frames the `invitation__box` (including the visible outer shadow area) and replace decorative hearts with 24×24 SVG heart icons with a black outline arranged in vertical columns that alternate vertical offset. Implementation will be purely frontend CSS + SVG changes inside existing Vue components; no architecture changes or new runtime dependencies.

## Technical Context

**Language/Version**: JavaScript (ES2022) + Vue (project uses Vue via src/main.js)  
**Primary Dependencies**: Vite, Vue — NO new runtime dependencies (conforms to constitution)  
**Storage**: N/A  
**Testing**: Automated visual-regression tests + DOM checks required. Add CI task to capture desktop and mobile reference screenshots and compare against approved references (tolerance <= 3% pixel-diff). If CI VRT is not possible, document manual verification steps and attach approved screenshots to the PR.
**Target Platform**: Modern browsers (desktop & mobile; last 2 versions)  
**Project Type**: Frontend web app (single-page app)  
**Performance Goals**: Minimal impact to bundle size; pure CSS/SVG approach preserves fast paint  
**Constraints**: Keep existing Vue structure and BEMIT naming; Do NOT use gradients, blur, or rounded borders; changes must be static assets only and not introduce new npm dependencies.  
**Scale/Scope**: Small UI change limited to `InvitationDisplay.vue`, `InvitationForm.vue` and styles in `src/styles/invitation.bemit.css`.

## Constitution Check

GATE: Confirmed — changes are frontend-only, add no dependencies, and follow the project's Static Web App Constitution (client-side only, static assets). No violations detected.

## Project Structure (selected)

```text
src/
├── App.vue
├── main.js
├── components/
│   ├── InvitationDisplay.vue   # primary target
│   ├── InvitationForm.vue
│   └── YesNoButtons.vue
└── styles/
    └── invitation.bemit.css     # main style updates

specs/001-add-pixel-hearts/
├── spec.md
├── plan.md        # this file
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    ├── invitation-visual.schema.json
    └── heart-pattern.schema.json
```

**Structure Decision**: Keep all changes local to existing frontend files under `src/components` and `src/styles`. Create supporting docs and small JSON schemas under `specs/001-add-pixel-hearts/contracts/` for verification and review; these are documentation artifacts only.

## Complexity Tracking

No constitution violations or complex technical trade-offs requiring exceptions.

---

Next steps:
- Phase 0: Research decisions and alternatives saved to `research.md`
- Phase 1: Produce `data-model.md`, `contracts/*`, and `quickstart.md`, and update agent context script as required.
