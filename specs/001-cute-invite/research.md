# Research Findings: Cute Invitation Website

**Phase**: 0 - Outline & Research  
**Date**: February 9, 2026  
**Feature**: 001-cute-invite

## Technology Stack Decisions

### Decision: Vue 3 (Composition API)

**Rationale**: Vue provides reactive component-based architecture aligned with the personalized, interactive nature of the invitation website. Composition API enables clean, reusable logic for form handling, link generation, and dynamic content rendering. Lightweight bundle footprint compared to alternatives.

**Alternatives Considered**:
- Vanilla JavaScript: Would require manual state management; significantly more boilerplate for reactive form handling and URL parameter decoding
- React: Larger bundle size; overkill for single-page invitation display
- Svelte: Excellent DX but smaller ecosystem for component libraries; Vue more established for cute/design-focused projects

**Bundle Impact**: ~35KB gzipped (Vue 3 + essential utilities)

---

### Decision: BEMIT CSS Methodology

**Rationale**: BEMIT (BEM + IT theory) provides scalable, maintainable CSS architecture essential for responsive design iterations. Combines BEM's modularity with IT's responsive suffixes, enabling clean media query handling for mobile/tablet/desktop breakpoints. Supports cute, adorable visual design patterns without style conflicts.

**BEMIT Structure**:
- **Block**: `.invitation`, `.form-section`, `.button`
- **Element**: `.invitation__content`, `.form-section__input`, `.button__text`
- **Modifier**: `.button--primary`, `.button--disabled`, `.invitation--loading`
- **IT Suffix**: `.button@sm`, `.button@md`, `.button@lg` for responsive variants

**Alternatives Considered**:
- CSS Modules: Scopes styles but requires additional tooling; BEMIT simpler for static generation
- Tailwind CSS: Conflicts with "cute" design aesthetic requiring custom utilities anyway; BEMIT more readable
- CSS-in-JS: Runtime overhead; BEMIT with PostCSS achieves same benefits without JS dependency

**No External CSS Library Needed**: Pure CSS with BEMIT follows constitution principle of minimizing dependencies

---

### Decision: Responsive Design Strategy

**Breakpoints**:
- **Mobile (xs)**: 0px - 480px - Primary target (recipient opening on phone)
- **Tablet (sm)**: 481px - 768px
- **Desktop (md)**: 769px - 1024px
- **Large Desktop (lg)**: 1025px+

**Rationale**: Three-tier breakpoint strategy balances complexity. GIF background and interactive buttons resize fluidly. Form submission responsive with touch-friendly input sizes on mobile (min 44px tap targets).

**Cute Responsive Patterns**:
- Text size scales smoothly (clamp for fluid typography)
- Buttons stay playfully proportioned across all devices
- GIF background maintains aspect ratio with object-fit
- Optional image scales responsively without distortion
- Layout switches from side-by-side to stacked on mobile

**Mobile-First Development**: Styles written for mobile first, then enhanced for larger screens

---

## Invitation Data Encoding Strategy

**Decision: URL Query Parameters with Base64 Encoding**

**Data Structure**:
```json
{
  "recipient": "Alice",
  "sender": "Bob",
  "gifUrl": "https://example.com/animation.gif",
  "imageUrl": "https://example.com/photo.jpg",
  "createdAt": "2026-02-09T10:30:00Z"
}
```

**URL Format**: `/?id=base64EncodedData` or `/?data=base64EncodedData`

**Rationale**: 
- Static hosting compatible (no server-side storage needed initially)
- Shareable URL self-contained
- Base64 encoding protects special characters in names
- Optional: localStorage/IndexedDB for persistent storage of created invitations on sender side

**Alternatives Considered**:
- Server-side storage with ID lookup: Requires backend; beyond scope for static-first approach
- JSON in URL: Base64 cleaner and URL-safe
- Fragment-only storage: Less shareable in social contexts; query params better

---

## Build & Deployment Strategy

**Decision: Vite for Vue Development**

**Rationale**:
- Lightning-fast HMR (Hot Module Replacement) for cute design iterations
- ESM-first, modern JavaScript
- Fast production builds with tree-shaking
- Zero-config setup aligned with static-first principles
- Outputs plain HTML/CSS/JS to `dist/` directory ready for GitHub Pages

**Build Output**: Single HTML entry point with bundled Vue + CSS + assets, deployable to GitHub Pages

**Asset Handling**: GIFs and images uploaded as URLs (external) or embedded as base64 in data URI for small assets

---

## Browser Support & Performance

**Target Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

**Performance Targets**:
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- GIF playback: 60 FPS on mobile

**Cute UX Optimizations**:
- Lazy load optional image only when visible
- Smooth animations via CSS transforms (GPU-accelerated)
- Debounce "No" button reposition event handler to prevent jank

---

## Accessibility for Cute Design

**WCAG 2.1 AA Compliance**:
- Button text clear and readable
- Color contrast >= 4.5:1 for text on GIF background (semi-transparent overlay if needed)
- No auto-playing audio (GIFs are silent, fine)
- Touch targets >= 44x44px on mobile
- Keyboard navigation for form and buttons

---

## Summary of Zero-Dependency Approach

**Kept Zero-Dependency**:
- Pure CSS (BEMIT, no preprocessor initially)
- Vanilla JavaScript for utilities where possible
- No UI component libraries

**Justified Single Dependency**:
- **Vue 3**: Required for reactive form handling, component reusability, and dynamic content rendering. Lightweight (35KB gzipped) and necessary for cute UI interactivity.

**Optional Future Dependencies**:
- PostCSS + autoprefixer for CSS vendor prefixes (dev-time only, not runtime)
- Vite (dev-time bundler, not runtime dependency)
