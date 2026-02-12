# quickstart.md

Overview

Implement the pixel border and heart pattern with minimal changes to existing Vue components and styles. No new dependencies.

Files to edit
- `src/components/InvitationDisplay.vue` — add decorative SVG wrapper and optional `invitation__box--pixel` modifier
- `src/styles/invitation.bemit.css` — add styles for `.invitation__box--pixel`, `.invitation__hearts`, and heart columns

CSS snippets (BEMIT)

1) Pixel border wrapper (example)

```css
.invitation__box { position: relative; }
.invitation__box--pixel::before {
  content: '';
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  pointer-events: none;
  /* inline SVG can also be injected as background-image; here we prefer an inline SVG element for precise control */
}
```

2) Decorative hearts container

```css
.invitation__hearts {
  position: absolute;
  inset: 0; /* behind the box */
  pointer-events: none;
  aria-hidden: true;
}
.invitation__hearts-column {
  display: flex;
  flex-direction: column;
  gap: 6px; /* spacing between hearts */
}
.invitation__hearts-column--up { transform: translateY(-6px); }
.invitation__hearts-column--down { transform: translateY(6px); }
.invitation__heart { width: 24px; height: 24px; }
```

Implementation notes
- Place an inline SVG for the pixel border either via a small `<svg>` sibling absolutely positioned outside the `.invitation__box` (preferred for exact control), or render it inside the component markup with `aria-hidden="true"`.
- Use an `<svg>` `<symbol id="heart">...</symbol>` and reference it with `<use xlink:href="#heart" />` for repeated instances.
- Alternate columns using BEMIT modifier classes `--up` and `--down` applied in the template with `v-for`.
- Respect the constraints: do not use gradients, blur, or rounded borders. Keep corners square and edges stepped in the SVG path.

Responsiveness
- For small viewports, reduce the number of heart columns via CSS media queries or hide decorative hearts entirely to avoid overlap.

Accessibility
- Mark decorative container with `aria-hidden="true"` and `role="presentation"`.
- Ensure no focusable elements are added for decoration.

Review & Verification
- Provide a screenshot for desktop (>=1024px) and mobile (<=375px) for visual review.
- Use DOM checks to verify heart icon dimensions (24×24) and presence of class names.
Verification (automated)
- Add a CI job to run visual-regression comparisons and DOM checks:
  - Capture reference screenshots (desktop >=1024px, mobile <=375px).
  - Compare PR screenshots using Playwright image snapshot or the project's chosen VRT runner with tolerance <= 3% pixel-diff.
  - Run a small DOM assertion to confirm heart instances render at 24×24 and `invitation__box--pixel` is set.
If CI VRT cannot be added for this PR, attach approved reference screenshots to the PR and mark manual verification steps in the PR description.

