```markdown
# Feature Specification: Pixel borders & heart icons (invite UI)

**Feature Branch**: `001-add-pixel-hearts`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: "display UI improvements. add 8 bit or pixel borders to the container invitation__box along its box shadows. the hearts don't look like hearts, change them to look like hearts 24x24 with black outline and make the hearts align into columns with columns alternating from going up and down."
 
## Clarifications

### Session 2026-02-11

- Q: Where should decorative hearts and pixel borders be placed relative to the invitation content? → A: D (Render as background pattern behind the box)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Make `invitation__box` visually pixelated (Priority: P1)

As a user viewing an invitation, I want the invitation container to have an 8-bit / pixel-art style border that follows the box-shadow so the design matches the project's retro aesthetic.

**Why this priority**: This is a visible visual update that defines the project's aesthetic and should be delivered first to enable review and sign-off.

**Independent Test**: Load the invitation page and compare a rendered screenshot to an approved reference image (visual regression) or verify by manual inspection that the border appears stepped/pixelated and follows the outer shadow.

**Acceptance Scenarios**:

1. **Given** the invitation is displayed, **When** the page renders, **Then** the `invitation__box` shows a clearly stepped, pixel-art style border around its outer edge and along the outermost visible box-shadow region.
2. **Given** the invitation has a box-shadow, **When** inspected visually, **Then** the pixel border appears contiguous with the shadow (i.e., it frames both the box and the visible shadow area) and is visually distinct from a smooth/anti-aliased border.

---

### User Story 2 - Replace and align hearts as pixel icons (Priority: P1)

As a user, I want the decorative hearts to look like hearts (24×24) with a black outline and to be arranged in vertical columns that alternate direction (one column visually offset up, the next offset down) so the pattern feels intentional and decorative.

**Why this priority**: Heart icons are core to the invitation's look; replacing them with clearly shaped icons prevents visual confusion and improves perceived polish.

**Independent Test**: Inspect the DOM or use a visual regression test to confirm heart icons are 24×24 pixels with a visible black outline and that columns alternate vertical offset (up / down) across the component.

**Acceptance Scenarios**:

1. **Given** the invitation is displayed, **When** the page renders, **Then** every decorative heart is 24×24 pixels and has a clearly visible black outline at the device's default scale.
2. **Given** multiple heart columns are present, **When** viewing the layout, **Then** columns are arranged vertically and alternate their vertical alignment (column 1 shifted up, column 2 shifted down, column 3 up, etc.), producing an alternating up/down pattern.

---

### User Story 3 - Responsive and non-intrusive layout (Priority: P2)

As a user on smaller screens, I want the pixel borders and hearts to scale or reflow without overlapping content so the invitation remains readable and usable.

**Why this priority**: Ensures visual changes don't break layout or accessibility on small screens.

**Independent Test**: Resize viewport to common breakpoints (e.g., 320px, 375px, 768px) and verify invitation content remains readable and decorative hearts do not overlap primary content.

**Acceptance Scenarios**:

1. **Given** a small viewport (<= 360px wide), **When** the invitation is displayed, **Then** borders and hearts either scale down proportionally or reflow so no essential content is clipped or overlapped.

---

### Edge Cases

- Very high zoom (browser zoom > 200%) — icons and borders should remain visually distinct and not produce rendering artifacts that block content.
- Print view / PDF export — decorative elements should not break the content flow; if necessary they may be hidden in print media.
- Screen readers / reduced-motion settings — decorative hearts are non-essential; they should not interfere with accessibility or focus order.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The `invitation__box` MUST render a pixel-art style border that visually frames the element and follows the outer visible box-shadow region.
- **FR-002**: Decorative hearts used in or around the invitation MUST be replaced with clearly shaped heart icons sized 24×24 pixels and rendered with a visible black outline.
- **FR-003**: Decorative hearts MUST be implemented as a decorative background pattern behind the `invitation__box`. The pattern should visually present hearts arranged in vertical columns that alternate vertical offset (up/down). The background pattern MUST be non-interactive and MUST NOT overlap or block primary invitation content.
- **FR-004**: The visual changes MUST be responsive: at narrow viewports the invitation layout MUST remain readable and decorative elements MUST not overlap primary content.
- **FR-005**: The changes MUST be verifiable by visual regression tests (approved reference images) and by simple DOM-level checks (icon dimensions and presence of descriptive class names).

Clarifications / measurable criteria (added)
- **FR-001.a**: Visual verification for the pixel border MUST match approved reference images using an automated visual-regression tool with a tolerance of <= 3% pixel-diff (or an alternate threshold agreed in review). If automated comparison is unavailable, an explicit set of approved reference screenshots MUST be attached to the PR and manual sign-off recorded.
- **FR-002.a**: Heart icons MUST use a black stroke (#000) with stroke width >= 1px at default device scale (100% zoom). The SVG `viewBox` should be 0 0 24 24 and produced so that the icon renders at exactly 24×24 CSS pixels with no additional scaling.
- **FR-003.a**: Default layout behavior: Desktop (>=1024px) show 4 heart columns with 6px vertical gap; Tablet (>=768px and <1024px) show 2 columns; Mobile (<=375px) collapse to 1 column or hide decorative hearts to avoid overlap. These defaults may be adjusted by design review but must be documented in the PR.

### Key Entities *(include if feature involves data)*

- **Invitation container**: the visual block rendered on the invitation page that currently uses the `invitation__box` class.
- **Heart icon**: decorative element (24×24) used in columns around or inside the invitation; does not carry business data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visual regression tests pass against an approved reference for desktop (>= 1024px) and mobile (<= 375px) viewports for the updated invitation component.
- **SC-002**: 100% of decorative heart icons render at 24×24 pixels with a visible black outline on default device scale.
- **SC-003**: The `invitation__box` displays a pixel-art style border that clearly frames both the box and its outer visible shadow in manual inspection or screenshot comparison.
- **SC-004**: No UI overlap or clipping of primary invitation content is observed at common breakpoints (320px, 375px, 768px) during manual inspection.

Notes:
- SC-001 is the primary verification gate for FR-001 and FR-002; automated VRT (task T050) is the preferred verification path. Manual screenshots (task T042) are acceptable only when automated VRT cannot be run, and must be recorded in the PR.

## Assumptions

- The project uses standard CSS/HTML rendering; visual changes will be implemented with CSS and/or vector icons (SVG) but the specification remains implementation-agnostic.
- Existing components `InvitationDisplay` and `InvitationForm` are the primary places where styles will be applied.
- Approved reference images for visual regression will be provided or recorded in the PR for sign-off.

```
