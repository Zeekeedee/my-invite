# Tasks: Pixel borders & heart icons (invite UI)

Phase 1: Setup

- [ ] T001 Update `specs/001-add-pixel-hearts/plan.md` with final implementation details and links to artifacts (specs/001-add-pixel-hearts/plan.md)
- [ ] T002 [P] Add/verify contract files under `specs/001-add-pixel-hearts/contracts/` (invitation-visual.schema.json, heart-pattern.schema.json)
- [ ] T003 [P] Add quickstart and research artifacts to `specs/001-add-pixel-hearts/` (quickstart.md, research.md, data-model.md)

Phase 2: Foundational (blocking prerequisites)

- [ ] T004 Create BEMIT modifier `invitation__box--pixel` in `src/styles/invitation.bemit.css`
- [ ] T005 [P] Create placeholder decorative container markup in `src/components/InvitationDisplay.vue` with `aria-hidden="true"` and `pointer-events: none` (element: `.invitation__hearts`)
- [ ] T006 [P] Add an inline SVG `<symbol id="heart">` definition in `src/components/InvitationDisplay.vue` (or move to `src/assets/heart.svg` as documentation choice)
 - [x] T004 Create BEMIT modifier `invitation__box--pixel` in `src/styles/invitation.bemit.css`
 - [x] T005 [P] Create placeholder decorative container markup in `src/components/InvitationDisplay.vue` with `aria-hidden="true"` and `pointer-events: none` (element: `.invitation__hearts`)
 - [x] T006 [P] Add an inline SVG `<symbol id="heart">` definition in `src/components/InvitationDisplay.vue` (or move to `src/assets/heart.svg` as documentation choice)

Phase 3: User Stories (priority order)

**User Story 1 — Pixelated `invitation__box` (P1)**

Story goal: Render a clearly stepped, 8-bit style border framing the `invitation__box` including the outer visible shadow.

Independent test criteria: Visual inspection at desktop scale confirms stepped border frames the box and shadow; DOM contains `invitation__box--pixel` modifier.

- [x] T010 [US1] Add `invitation__box--pixel` modifier usage in `src/components/InvitationDisplay.vue` template (apply class to the `invitation__box` root element)
- [x] T011 [US1] Insert inline SVG element that renders the pixel-art border positioned to include the outer shadow in `src/components/InvitationDisplay.vue`
- [x] T012 [US1] Implement pixel-border CSS rules in `src/styles/invitation.bemit.css` to position and size the SVG and ensure `pointer-events: none` (file: src/styles/invitation.bemit.css)

**User Story 2 — Replace and align hearts as pixel icons (P1)**

Story goal: Decorative hearts render at 24×24 with a black outline and are arranged in alternating up/down vertical columns behind the invitation.

Independent test criteria: DOM contains heart instances sized 24×24 with class `invitation__heart`; columns use modifier classes `invitation__hearts-column--up` / `--down`.

- [ ] T020 [US2] Add decorative hearts container markup and column scaffolding to `src/components/InvitationDisplay.vue` (`.invitation__hearts` and `.invitation__hearts-column`)
- [ ] T021 [P] [US2] Populate heart instances using the `<use xlink:href="#heart">` pattern in `src/components/InvitationDisplay.vue` (ensure each `.invitation__heart` has width/height 24)
- [ ] T022 [P] [US2] Add CSS for `.invitation__hearts`, `.invitation__hearts-column`, `.invitation__hearts-column--up`, `.invitation__hearts-column--down`, and `.invitation__heart` in `src/styles/invitation.bemit.css`
- [ ] T023 [US2] Ensure decorative container is placed behind `invitation__box` in `src/components/InvitationDisplay.vue` and marked `aria-hidden="true" role="presentation"`
 - [x] T020 [US2] Add decorative hearts container markup and column scaffolding to `src/components/InvitationDisplay.vue` (`.invitation__hearts` and `.invitation__hearts-column`)
 - [x] T021 [P] [US2] Populate heart instances using the `<use xlink:href="#heart">` pattern in `src/components/InvitationDisplay.vue` (ensure each `.invitation__heart` has width/height 24)
 - [x] T022 [P] [US2] Add CSS for `.invitation__hearts`, `.invitation__hearts-column`, `.invitation__hearts-column--up`, `.invitation__hearts-column--down`, and `.invitation__heart` in `src/styles/invitation.bemit.css`
 - [x] T023 [US2] Ensure decorative container is placed behind `invitation__box` in `src/components/InvitationDisplay.vue` and marked `aria-hidden="true" role="presentation"`

**User Story 3 — Responsive and non-intrusive layout (P2)**

Story goal: At narrow viewports the pixel borders and heart pattern scale or reflow so they never overlap primary content.

Independent test criteria: At 320px / 375px / 768px viewports the invitation content remains readable; decorative hearts are reduced or hidden per media queries.

- [ ] T030 [US3] Add responsive media queries to `src/styles/invitation.bemit.css` to reduce/hide heart columns and scale border at small breakpoints (file: src/styles/invitation.bemit.css)
- [ ] T031 [US3] Adjust DOM structure in `src/components/InvitationDisplay.vue` to prefer non-overlapping layout (ensure decorative container uses `inset` positioning and does not increase the flow size)
 - [x] T030 [US3] Add responsive media queries to `src/styles/invitation.bemit.css` to reduce/hide heart columns and scale border at small breakpoints (file: src/styles/invitation.bemit.css)
 - [x] T031 [US3] Adjust DOM structure in `src/components/InvitationDisplay.vue` to prefer non-overlapping layout (ensure decorative container uses `inset` positioning and does not increase the flow size)

Final Phase: Polish & Cross-cutting Concerns

- [ ] T040 [P] Implement `@media print` rules in `src/styles/invitation.bemit.css` to hide decorative elements when printing (file: src/styles/invitation.bemit.css)
- [ ] T041 [P] Add accessibility attributes and documentation comment in `src/components/InvitationDisplay.vue` describing decorative elements and `aria-hidden` usage
- [ ] T042 [P] Prepare two review screenshots (desktop >=1024px, mobile <=375px) and add them to the PR description or `specs/001-add-pixel-hearts/` (files: specs/001-add-pixel-hearts/desktop-ref.png, specs/001-add-pixel-hearts/mobile-ref.png)
 - [x] T042 [P] Prepare two review screenshots (desktop >=1024px, mobile <=375px) and add them to the PR description or `specs/001-add-pixel-hearts/` (files: specs/001-add-pixel-hearts/desktop-ref.png, specs/001-add-pixel-hearts/mobile-ref.png)
 - [ ] T040 [P] Implement `@media print` rules in `src/styles/invitation.bemit.css` to hide decorative elements when printing (file: src/styles/invitation.bemit.css)
 - [ ] T041 [P] Add accessibility attributes and documentation comment in `src/components/InvitationDisplay.vue` describing decorative elements and `aria-hidden` usage
 - [ ] T042 [P] Prepare two review screenshots (desktop >=1024px, mobile <=375px) and add them to the PR description or `specs/001-add-pixel-hearts/` (files: specs/001-add-pixel-hearts/desktop-ref.png, specs/001-add-pixel-hearts/mobile-ref.png)
 - [ ] T050 [P] Add automated visual-regression task: capture reference screenshots (desktop >=1024px and mobile <=375px) and add a CI job (Playwright or existing e2e tool) to compare PR screenshots to approved references (tolerance <= 3% pixel-diff). Document commands and CI step in `quickstart.md`.
 - [ ] T051 [P] Add DOM-level verification task: add a small script or e2e assertion to confirm each decorative heart element has `width=24` and `height=24`, and that `invitation__box--pixel` class is present when feature enabled (integrate into existing e2e/spec checks).
 - [x] T040 [P] Implement `@media print` rules in `src/styles/invitation.bemit.css` to hide decorative elements when printing (file: src/styles/invitation.bemit.css)
 - [x] T041 [P] Add accessibility attributes and documentation comment in `src/components/InvitationDisplay.vue` describing decorative elements and `aria-hidden` usage
 - [ ] T042 [P] Prepare two review screenshots (desktop >=1024px, mobile <=375px) and add them to the PR description or `specs/001-add-pixel-hearts/` (files: specs/001-add-pixel-hearts/desktop-ref.png, specs/001-add-pixel-hearts/mobile-ref.png)
 - [x] T050 [P] Add automated visual-regression task: capture reference screenshots (desktop >=1024px and mobile <=375px) and add a CI job (Playwright or existing e2e tool) to compare PR screenshots to approved references (tolerance <= 3% pixel-diff). Document commands and CI step in `quickstart.md`.
 - [x] T051 [P] Add DOM-level verification task: add a small script or e2e assertion to confirm each decorative heart element has `width=24` and `height=24`, and that `invitation__box--pixel` class is present when feature enabled (integrate into existing e2e/spec checks).

Dependencies

- Foundational tasks (T004–T006) must be completed before implementing User Stories (T010–T031).
- User Story 1 (T010–T012) and User Story 2 (T020–T023) can be implemented in parallel after foundational tasks complete.
- User Story 3 (T030–T031) depends on completion of T010–T012 and T020–T023 for accurate responsive adjustments.

Parallel execution examples

- Example A: Engineer A implements CSS changes T004, T012, T022, T030 while Engineer B implements template changes T005, T010, T011, T020, T021 concurrently (different files except minor overlap in `InvitationDisplay.vue` which needs coordination).
- Example B: Split work by file: One contributor edits `src/styles/invitation.bemit.css` (T004, T012, T022, T030, T040) while another edits `src/components/InvitationDisplay.vue` (T005, T010, T011, T020, T021, T023, T031, T041) — merge carefully.

Implementation strategy

- MVP: Implement User Story 1 first (T010–T012) to establish the pixel border and visual frame. Deliver a simple, reviewable screenshot.
- Next: Implement User Story 2 (T020–T023) for decorative hearts and layout.
- Finally: Implement User Story 3 (T030–T031) and polish tasks (T040–T042) to ensure responsive behavior and accessibility.

Checklist validation

- All tasks use the required checklist format `- [ ] T### [P]? [US?] Description with file path`.

