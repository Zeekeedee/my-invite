# Implementation Plan: Cute Invitation Website

**Branch**: `001-cute-invite` | **Date**: February 11, 2026 | **Spec**: [spec.md](spec.md)

## Summary

Build a delightful, responsive invitation website using Vue 3 that allows senders to create personalized invitations using an animated 8-bit hearts background and an optional image. Recipients receive shareable links displaying cute, interactive interfaces with a playfully unclickable "No" button. Implement with BEMIT CSS and pixel-art helpers for a consistent 8-bit aesthetic.

## Technical Context

- Language/Version: JavaScript (ES2020+) + Vue 3 (Composition API)
- Bundler: Vite
- Storage: URL-encoded invitation payload (Base64 or compact JSON); optional localStorage for sender history
- Testing: Vitest (unit), Playwright (E2E)
- Target: Modern browsers (Chrome, Firefox, Safari, Edge), mobile-first responsive
- Constraint: Static hosting (GitHub Pages)

## Phases & Timeline

Phase 1 — Foundation & Components (Week 1)
- Scaffold or reuse existing Vue project
- Confirm `src/styles/main.css` contains hearts background and pixel helpers (already applied)
- Implement/remove form controls: remove GIF upload, keep optional image upload
- Data encoding utilities and unit tests

Phase 2 — Display & UX (Week 2)
- `InvitationDisplay.vue`: renders names, optional image, and applies pixel styling
- `YesNoButtons.vue`: implement evasive "No" behavior and accessible fallback
- Apply `.pixel-border` and `button.pixel` classes where appropriate
- Component/unit tests

Phase 3 — Polish, Tests & Launch (Week 3)
- E2E tests (Playwright) for create → view → respond flows
- Performance tuning and cross-browser visual verification
- Deployment to GitHub Pages and release notes

## Implementation Tasks (priority order)

1. Update `InvitationForm.vue`: remove GIF upload UI, validate recipient and sender names, keep optional image input. Update form submission to encode data without GIF.
2. Ensure `src/styles/main.css` contains the pastel 8-bit palette and animated hearts background (done). Add a `HeartsBackground.vue` wrapper only if componentization helps reuse.
3. Update `InvitationDisplay.vue` to read URL-encoded invitation payload and render recipient/sender names, optional image, and apply pixel styling.
4. Implement `YesNoButtons.vue` evasive logic: on pointerenter, compute a new position within the viewport; ensure it never leaves the view and keep movement smooth. Provide keyboard-accessible alternative (e.g., reveal an explanation and a confirm keystroke).
5. Apply `.pixel-border` and `button.pixel` styles to key UI elements (invitation card, CTA buttons).
6. Update unit tests: `dataEncoder.spec.js`, `urlParser.spec.js`, `InvitationForm.spec.js`, `InvitationDisplay.spec.js`, `YesNoButtons.spec.js` to reflect removal of GIF requirement.
7. Run Playwright tests and manual visual checks on desktop and mobile widths; tweak heart pattern scale/speed if needed.
8. Prepare release: update `PROJECT_SUMMARY.md`, add short release notes, and deploy.

## Risks & Mitigations

- Rendering differences (pixelated CSS) across browsers: include static pastel fallback and validate on major browsers.
- Accessibility of evasive "No" button: provide keyboard flow and ARIA explanation; ensure assistive tech can complete the flow.
- URL size if images inlined: prefer storing images as optional hostable links or limit inline sizes; show upload guidance in the UI.

## Acceptance Criteria (implementation-focused)

- Form accepts recipient and sender names, optional image; GIF upload control removed.
- Generated shareable link encodes all required data and renders correctly in `InvitationDisplay.vue`.
- Animated hearts background visible and animated on load; static pastel fallback present if animation fails.
- "Yes" button records responses; "No" button repositions on pointer attempts and remains inaccessible via pointer, with documented keyboard alternative.
- Visual style matches pastel 8-bit aesthetic (pixel borders, `Press Start 2P` font applied).

---

*Prepared by the dev agent to reflect clarification on background choice (8-bit hearts, no GIF uploads).*