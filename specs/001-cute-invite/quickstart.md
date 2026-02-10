# Quick-Start Guide: Cute Invitation Website

**Feature**: 001-cute-invite  
**For**: Frontend developers implementing the Vue.js invitation website  
**Date**: February 9, 2026

## Project Overview

The Cute Invitation Website is a Vue 3 single-page application that enables:

1. **Senders** to create personalized invitations with custom GIFs, names, and optional images
2. **Recipients** to view beautifully designed invitations on any device
3. **Playful Interaction** via a "Yes" button and an unclickable, repositioning "No" button

**Key Characteristics**:
- Responsive design (mobile-first) with React breakpoints
- BEMIT CSS for scalable, maintainable styling
- No backend required; data encoded in URLs
- Cute, adorable aesthetics throughout

## Getting Started (5-minute setup)

### Prerequisites
- Node.js 18+ and npm installed
- Basic familiarity with Vue 3 and ES6 JavaScript
- Git for version control

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/my-invite.git
cd my-invite

# Install dependencies
npm install
```

### 2. Project Structure

```
src/
├── components/
│   ├── InvitationForm.vue      # Sender form → [Priority: P1]
│   ├── InvitationDisplay.vue   # Recipient view → [Priority: P2]
│   └── YesNoButtons.vue        # Interactive buttons → [Priority: P3]
├── pages/
│   ├── CreatePage.vue          # Form page
│   └── ViewPage.vue            # Invitation display page
├── styles/
│   ├── main.css                # Base BEMIT styles
│   ├── components.bemit.css    # Component-specific rules
│   ├── responsive.bemit.css    # Mobile/tablet/desktop breakpoints
│   └── animations.css          # Cute animations
├── utils/
│   ├── dataEncoder.js          # Base64 encoding/decoding
│   ├── urlParser.js            # URL parameter parsing
│   ├── validator.js            # Form validation
│   └── fileHandler.js          # File upload handling
└── main.js                     # Vue app entry point
```

### 3. Development Workflow

#### Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

#### Build for Production
```bash
npm run build
```
Output goes to `dist/` directory (ready for GitHub Pages).

#### Run Tests
```bash
npm run test                # Unit + component tests
npm run test:ui             # Vitest UI
npm run test:e2e            # E2E tests (Playwright)
```

## Implementation Roadmap

### Phase 1: Sender Form (P1 Priority)

**Goal**: Enable senders to create invitations

**Component**: `InvitationForm.vue`

**Key Features**:
- Input fields: recipient name, sender name, GIF URL, optional image URL
- Form validation and error messages
- "Generate Link" button
- Display generated shareable link with copy button

**Data Flow**:
```
User Input → Validation → Base64 Encode → Generate URL → Display Link
```

**BEMIT Styles**:
```css
.form
.form__section
.form__input
.form__button
.form__button--primary
.form__error
```

**Responsive Breakpoints**:
- Mobile (`@sm`): Stack inputs vertically, full-width buttons
- Tablet (`@md`): Side-by-side layout, buttons larger
- Desktop (`@lg`): Centered form, optimal spacing

### Phase 2: Recipient Display (P2 Priority)

**Goal**: Display personalized invitations with cute aesthetics

**Component**: `InvitationDisplay.vue`

**Key Features**:
- Parse invitation data from URL parameter (`?id=base64Data`)
- Display GIF as full-screen background
- Overlay recipient name, sender name prominently
- Display optional image in center (if provided)
- Show "Yes" and "No" buttons
- Handle expired or invalid invitations gracefully

**Data Flow**:
```
URL ↓
→ Decode Base64 → Validate → Extract data → Render with GIF + Content
```

**BEMIT Styles**:
```css
.invitation
.invitation__background
.invitation__content
.invitation__title
.invitation__author
.invitation__image
.invitation--loading
.invitation--error
```

**Animations**:
- Soft fade-in on load (0.6s ease-out)
- GIF plays continuously (CSS: `animation: infinite`)

### Phase 3: Interactive Buttons (P3 Priority)

**Goal**: Implement playful yes/no interaction with unclickable "No"

**Component**: `YesNoButtons.vue`

**"Yes" Button**:
- Remains in fixed position
- Clickable and records response
- Provides feedback (highlight, text change)

**"No" Button**:
- Repositions on hover (CSS `transform` + JavaScript event listener)
- Never clickable; prevents default click
- Smooth animation (0.2s easing)
- Stays within viewport bounds

**Data Flow**:
```
Recipient hovers over "No" → Button repositions
Recipient clicks "Yes" → Response recorded → Confirmation message shown
```

**BEMIT Styles**:
```css
.buttons
.buttons__button
.buttons__button--yes
.buttons__button--no
.buttons__button--no.is-repositioning
```

**JavaScript Logic**:
```javascript
// On "No" button hover
element.addEventListener('mouseenter', () => {
  moveButtonToRandomPosition();
});

// On "Yes" button click
yesButton.addEventListener('click', () => {
  recordResponse();
  showConfirmation();
});
```

## BEMIT CSS Patterns

### Base Syntax

```css
/* Block */
.invitation { }

/* Block Element */
.invitation__content { }

/* Block Modifier */
.invitation--loading { }

/* IT Suffix (Responsive) */
.invitation@sm { }   /* mobile */
.invitation@md { }   /* tablet */
.invitation@lg { }   /* desktop */

/* Combined */
.button--primary@sm { padding: 1rem; }
.button--primary@md { padding: 1.25rem; }
```

### Mobile-First Approach

```css
/* Mobile (default) */
.invitation { width: 100%; }

/* Tablet and up */
@media (min-width: 481px) {
  .invitation@md { width: 80%; margin: 0 auto; }
}

/* Desktop and up */
@media (min-width: 769px) {
  .invitation@lg { width: 60%; }
}
```

## Responsive Breakpoints

- **Mobile (xs)**: 0–480px — Primary focus
- **Tablet (sm)**: 481–768px
- **Desktop (md)**: 769–1024px
- **Large Desktop (lg)**: 1025px+

**Example**: Buttons should be:
- Mobile: Full-width or stacked, 44px min height
- Tablet: Side-by-side, increased padding
- Desktop: Centered, ~120px wide each

## Data Encoding Example

### Creating an Invitation

```javascript
import { encodeInvitation } from '@/utils/dataEncoder.js';

const invitationData = {
  recipientName: 'Alice',
  senderName: 'Bob',
  gifUrl: 'https://example.com/confetti.gif',
  imageUrl: 'https://example.com/photo.jpg',
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
};

const encodedData = encodeInvitation(invitationData);
const shareLink = `${window.location.origin}/?id=${encodedData}`;
```

### Viewing an Invitation

```javascript
import { decodeInvitation } from '@/utils/dataEncoder.js';

const params = new URLSearchParams(window.location.search);
const encodedData = params.get('id');

try {
  const invitation = decodeInvitation(encodedData);
  // Render invitation with decoded data
} catch (error) {
  // Handle invalid/expired invitation
}
```

## Testing Strategy

### Unit Tests (`tests/unit/`)
- Test data encoding/decoding
- Test URL parsing
- Test form validation logic
- Example: `expect(encodeInvitation({...})).toBe('valid_base64')`

### Component Tests (`tests/components/`)
- Test InvitationForm submission
- Test InvitationDisplay rendering
- Test YesNoButtons interaction
- Example: Verify "No" button repositions on hover

### E2E Tests (`tests/e2e/`)
- Test full user journey: create form → generate link → view invitation
- Test mobile responsiveness
- Test button interactions
- Example: Navigate to form, fill inputs, verify link generated

## Performance Targets

- **First Contentful Paint (FCP)**: <1.5s
- **Largest Contentful Paint (LCP)**: <2.5s
- **Cumulative Layout Shift (CLS)**: <0.1
- **GIF Playback**: 60 FPS on mobile

**Optimization Tips**:
- Lazy-load optional image element
- Use CSS transforms for button repositioning (GPU-accelerated)
- Debounce "No" button reposition event handler
- Minimize bundle size (Vue 3 + utilities only)

## Styling Philosophy: Cute & Adorable

The aesthetic should feel:
- **Playful**: Fun interactions (repositioning button, smooth animations)
- **Warm**: Soft colors, rounded corners, friendly typography
- **Accessible**: Good contrast, readable text, touch-friendly
- **Responsive**: Delightful on all device sizes

**Design Principles**:
- Large, readable font sizes (16px minimum on mobile)
- Soft shadows and subtle gradients
- Rounded buttons and containers
- Color palette: pastels, warm accents
- Generous whitespace
- Subtle animations (easing, fade-ins, scale transforms)

## Common Tasks

### Add a New Component

```
1. Create `src/components/MyComponent.vue`
2. Import in `src/App.vue` or parent component
3. Add component-specific BEMIT styles to `src/styles/components.bemit.css`
4. Test with `npm run test`
```

### Update Responsive Styles

Edit `src/styles/responsive.bemit.css` and use breakpoint suffixes:

```css
.my-component { /* Mobile default */ }
@media (min-width: 481px) {
  .my-component@md { /* Tablet */ }
}
```

### Debug URL Encoding

```javascript
// In browser console
import { decodeInvitation } from '@/utils/dataEncoder.js';
const data = decodeInvitation(urlParams.get('id'));
console.log(data);
```

## Deployment

### To GitHub Pages

```bash
# Build the project
npm run build

# Deploy dist/ to GitHub Pages
# (Configure gh-pages npm package or manual GitHub Actions)
```

### To Other Static Hosts

The `dist/` directory contains everything needed. Upload to:
- Netlify: Drag & drop `dist/`
- Vercel: Connect GitHub repo
- AWS S3 + CloudFront: Sync `dist/` to S3

## Questions & Support

Refer to the feature specification: [spec.md](spec.md)  
Data model details: [data-model.md](data-model.md)  
JSON schemas: [contracts/](contracts/)

---

**Happy coding! Let's build something adorable! 🎉**
