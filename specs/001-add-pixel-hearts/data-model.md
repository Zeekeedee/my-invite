# data-model.md

This feature is UI-only. Data model is purely descriptive for review and verification.

Entities

- InvitationContainer
  - description: The visual block rendered by `InvitationDisplay.vue` using class `invitation__box`.
  - fields:
    - id: string (component instance identifier) - optional for testing
    - width: css-size (visual) - not stored data
    - pixelBorderApplied: boolean (true when pixel border is enabled)
  - relationships: none

- HeartIcon
  - description: Decorative SVG icon displayed at 24×24 pixels.
  - fields:
    - width: 24 (px)
    - height: 24 (px)
    - outline: black stroke (required)
    - fill: optional (design choice)
    - role: decorative - not focusable
  - relationships: belongs to decorative pattern behind InvitationContainer

Validation rules
- All heart icons must render at 24×24 at default device scale.
- Heart icons must have a visible black outline (stroke width >= 1px at default scale).
- The pixelBorderApplied boolean, if present in visual verification artifacts, must be true when border is visible.

State transitions
- Visual-only; no persistent state beyond CSS/SVG rendering.

