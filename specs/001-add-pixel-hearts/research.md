# research.md

Decision: Use inline SVG + CSS for pixel border and SVG icons for hearts

Rationale:
- Inline SVG gives precise control over crisp, non-anti-aliased pixel edges without relying on CSS gradients or raster images.
- SVG hearts at 24×24 with a black `stroke` ensure a visible outline at device scales and remain vector-sharp at different scales.
- Position decorative hearts in an absolutely-positioned, `pointer-events: none` container behind `.invitation__box` to keep them decorative and non-interactive.
- Use simple CSS transforms and `nth-child` offsets to alternate column vertical alignment (up / down) — this avoids JS and keeps rendering cheap.
- No new dependencies required; implementation touches only `src/components/*` and `src/styles/invitation.bemit.css`.

Alternatives considered:
- CSS box-shadow stacking or multi-layered box-shadow to simulate stepped borders: feasible but complex to maintain and limited in accurately following the visible outer shadow area.
- `border-image` with a repeating SVG or PNG: works but requires creating/maintaining a separate asset and may complicate scaling across breakpoints.
- Pure raster (PNG) pixel border: smaller implementation cost but less flexible for responsive scaling and higher maintenance.

Decision details:
- Pixel border: implement as an inline SVG rectangle that sits just outside the `.invitation__box` and visually includes the outer visible shadow; keep SVG crisp by using integer coordinates and sharp edges.
- Hearts: implement as inline SVG symbols (24×24 viewBox) with `fill` for interior and `stroke="black"` for outline. Place repeated instances in columns inside a decorative container and alternate vertical offset with `transform: translateY(-Npx)` / `translateY(Npx)` via `:nth-child` selectors.
- Accessibility: mark decorative container with `aria-hidden="true"` and `role="presentation"`. Ensure `pointer-events: none` and no DOM focusable elements.
- Responsiveness: at narrow viewports, reduce heart columns or hide decorative hearts via media queries to avoid overlap; the SVG border scales to container size.

Risks & Mitigations:
- High zoom rendering artifacts — addressed by keeping SVG and alignment at integer pixel units where possible.
- Print/PDF output — provide `@media print` to hide decorative elements if they conflict with layout.

Files to produce:
- `data-model.md`, `contracts/*.schema.json`, `quickstart.md` (implementation steps and CSS snippets)


