# Implementation Plan: Cute Invitation Website

**Branch**: `001-cute-invite` | **Date**: February 9, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-cute-invite/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a delightful, responsive invitation website using Vue 3 that allows senders to create personalized invitations with GIF backgrounds and optional images. Recipients receive shareable links displaying cute, interactive interfaces with a playfully unclickable "No" button. Implement with BEMIT CSS for scalable, responsive design targeting mobile, tablet, and desktop experiences.

## Technical Context

**Language/Version**: JavaScript (ES2020+) + Vue 3 (Composition API)  
**Primary Dependencies**: Vue 3 (35KB gzipped); Vite (dev-time bundler)  
**Storage**: Client-side URL encoding with optional localStorage for sender history; no backend required  
**Testing**: Vitest for unit tests, Playwright for component/E2E tests  
**Target Platform**: Web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+); mobile-first responsive  
**Project Type**: Single-page web application (SPA) with two routes: form creation + invitation display  
**Performance Goals**: FCP <1.5s, LCP <2.5s, CLS <0.1, 60 FPS animations  
**Constraints**: Static hosting compatible (GitHub Pages); no server-side logic; GIF playback must remain smooth on mobile  
**Scale/Scope**: Single-page app; ~3 primary components; mobile-responsive from phone to desktop

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Static-First ✅ PASS
- Output: Single HTML page with bundled Vue + CSS + assets
- All content pre-built and deployed to `dist/` directory
- No server-side rendering or dynamic backends required

### Client-Side Only ✅ PASS
- All interactivity (form handling, link generation, button repositioning) runs in browser
- No external API calls for core functionality
- Invitation data encoded in URL or stored in localStorage

### Zero Dependencies ⚠️ JUSTIFIED EXCEPTION
- **Violation**: Vue 3 is a runtime dependency (35KB gzipped)
- **Justification**: Vue necessary for reactive form handling, component reusability, and interactive button behavior. Core feature complexity (dynamic invitation generation, playful "No" button repositioning with smooth animations) would require extensive vanilla JS boilerplate or be impossible to implement cleanly without framework
- **Mitigation**: Vue is singular dependency; no additional UI libraries (no Vuetify, no component frameworks). All CSS written in pure BEMIT. Build remains deterministic with Vite
- **Alternative Rejected**: Vanilla JS would add 2-3x more code complexity and maintenance burden; specifically, reactive state binding and smooth animation handling extremely verbose

### Build Reproducibility ✅ PASS
- Build process: `npm run build` with Vite
- Output: `dist/` directory contains complete static HTML/CSS/JS ready for GitHub Pages
- Source organized in `src/` (components, pages, styles, utils)
- Deterministic builds with lockfile (package-lock.json)

### Basic Testing ✅ PASS
- Unit tests via Vitest for utility functions (data encoding, validation)
- Component tests for invitation display and form
- Manual testing of critical paths: form submission → link generation → invitation view
- E2E tests for mobile responsiveness

### Constitution Status: APPROVED with Documented Exception
The Vue dependency is justified by feature complexity and enables cleaner, more maintainable code. All other principles remain intact.

## Project Structure

### Documentation (this feature)

```text
specs/001-cute-invite/
├── spec.md              # Feature specification
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1 data model and entities
├── quickstart.md        # Phase 1 quick-start guide
├── contracts/           # Phase 1 API contracts (JSON schema)
│   ├── invitation.schema.json
│   └── response.schema.json
└── checklists/
    └── requirements.md  # Specification validation
```

### Source Code (repository root - Single Web Application)

```text
my-invite/
├── src/
│   ├── components/
│   │   ├── InvitationForm.vue      # P1: Sender form (recipient, sender, GIF, image)
│   │   ├── InvitationDisplay.vue   # P2: Recipient view (cute display + button logic)
│   │   ├── YesNoButtons.vue        # P3: Interactive buttons with reposition behavior
│   │   └── LoadingState.vue        # Loading/error states
│   ├── pages/
│   │   ├── CreatePage.vue          # Form creation page (P1)
│   │   └── ViewPage.vue            # Invitation view page (P2)
│   ├── styles/
│   │   ├── main.css                # BEMIT base styles
│   │   ├── components.bemit.css    # Component-specific BEMIT styles
│   │   ├── responsive.bemit.css    # Responsive breakpoint variants
│   │   └── animations.css          # Cute animations (button reposition, fade-ins)
│   ├── utils/
│   │   ├── dataEncoder.js          # Base64 encoding/decoding invitation data
│   │   ├── urlParser.js            # URL parameter parsing
│   │   ├── validator.js            # Form validation logic
│   │   └── fileHandler.js          # File upload and base64 conversion
│   ├── App.vue                     # Root component (routing logic)
│   └── main.js                     # Vue app entry point
├── tests/
│   ├── unit/
│   │   ├── dataEncoder.spec.js
│   │   ├── urlParser.spec.js
│   │   └── validator.spec.js
│   ├── components/
│   │   ├── InvitationForm.spec.js
│   │   ├── InvitationDisplay.spec.js
│   │   └── YesNoButtons.spec.js
│   └── e2e/
│       ├── form-submission.spec.js     # Test P1 flow
│       ├── invitation-view.spec.js     # Test P2 flow
│       └── mobile-responsive.spec.js   # Test mobile experience
├── public/
│   └── index.html                  # HTML entry point
├── dist/                           # Build output (generated)
├── vite.config.js                  # Vite configuration
├── vitest.config.js                # Test configuration
├── package.json                    # Dependencies, scripts
└── README.md                       # Development guide
```

**Structure Decision**: Single web application (SPA) with Vue 3. Two primary routes:
1. **Create** (`/`): Form page for senders to input invitation details
2. **View** (`/?id=...`): Recipient display page showing personalized invitation with playful buttons

All styles follow BEMIT methodology with responsive suffixes. Components organize by feature alignment with user stories: form creation (P1), display logic (P2), interactive buttons (P3).

## Implementation Phases

### Phase 1: Foundation & Components (Weeks 1-2)

**Deliverables**:
- Vue 3 project scaffold with Vite
- BEMIT CSS structure and responsive system
- `InvitationForm.vue` component with form validation
- Data encoding utilities (Base64 encode/decode, URL parser)
- Unit tests for utilities

**Success Criteria**:
- Form renders correctly on mobile, tablet, desktop
- Form validation works (required fields, URL format)
- Generated link is shareable and copyable

### Phase 2: Display & UX (Weeks 2-3)

**Deliverables**:
- `InvitationDisplay.vue` component for viewing invitations
- `YesNoButtons.vue` with playful "No" button repositioning
- Animations and cute styling
- Responsive design verified on mobile devices
- Component tests

**Success Criteria**:
- Invitation displays correctly from URL parameters
- "Yes" button is clickable and records response
- "No" button repositions smoothly on hover
- Layout looks adorable on all device sizes

### Phase 3: Polish & Launch (Week 4)

**Deliverables**:
- E2E tests for full user journeys
- Performance optimization (bundle size, animations)
- Error handling (expired links, invalid data)
- Deployment setup (GitHub Pages or Netlify)
- Documentation

**Success Criteria**:
- All tests passing
- FCP <1.5s, LCP <2.5s, CLS <0.1
- Deployed and live on GitHub Pages

## Related Documentation

- **Feature Specification**: [spec.md](spec.md) — Requirements and acceptance criteria
- **Research Findings**: [research.md](research.md) — Technology decisions and rationale
- **Data Model**: [data-model.md](data-model.md) — Entity definitions and relationships
- **JSON Schemas**: [contracts/](contracts/) — Data validation schemas
- **Quick-Start Guide**: [quickstart.md](quickstart.md) — Developer setup and implementation patterns
