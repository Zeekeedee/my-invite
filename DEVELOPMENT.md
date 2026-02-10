# Development Guide - My Invite

This guide provides detailed information about the project architecture, components, and development workflow.

## Project Overview

**My Invite** is a Vue 3 single-page application (SPA) built with Vite, enabling users to create personalized invitations with custom backgrounds and send shareable links. Recipients view invitations and respond with playful Yes/No buttons.

### Technology Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 5.4
- **CSS Methodology**: BEMIT (BEM + IT responsive suffixes)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Hosting**: Static files (GitHub Pages / Netlify / Vercel)

### Key Principles

1. **Client-Side Only**: No backend required - all data encoded in URLs
2. **Mobile First**: Responsive design starting with mobile, enhancing for larger screens
3. **Zero Dependencies**: Custom utilities for encoding/validation (no external libs)
4. **60 FPS Animations**: Smooth, performant interactions across all devices
5. **Accessibility First**: WCAG 2.1 AA compliance, touch-friendly targets, reduced motion support

---

## Component Architecture

### Core Components

#### **InvitationForm.vue** (User Story 1: Create)

**Purpose**: Sender-facing form for creating and sharing invitations

**Location**: `src/components/InvitationForm.vue`

**Template Structure**:
```vue
<form>
  <input name="recipientName" />
  <input name="senderName" />
  <input name="gifUrl" />
  <input name="imageUrl" optional />
  <button @click="submitForm">Create Invitation</button>
  <div v-if="generatedLink">Copy Link</div>
</form>
```

**Reactive State**:
- `formData`: Form input values
- `formErrors`: Field-level validation errors
- `isLoading`: Form submission state
- `generatedLink`: Shareable URL after submission
- `copiedText`: Copy-to-clipboard feedback

**Key Methods**:
- `validateForm()`: Uses validator.js to check all fields
- `submitForm()`: Encodes data → generates URL → displays link
- `copyToClipboard()`: Copies link with 2-second feedback

**Behavior**:
- Field-level blur validation with red error text
- Copy-to-clipboard with "✓ Copied!" feedback
- "Create Another" button for repeated use
- slideUp animation on result display

**Styling**: `.form`, `.form__section`, `.form__input`, `.form__button`, `.form__error`, `.form__result`

**Dependencies**: validator.js, dataEncoder.js, urlParser.js

---

#### **InvitationDisplay.vue** (User Story 2: View)

**Purpose**: Recipient-facing display of personalized invitations

**Location**: `src/components/InvitationDisplay.vue`

**Template Structure**:
```vue
<div class="invitation">
  <!-- Fullscreen GIF Background -->
  <div class="invitation__background">
    <img :src="invitation.gifUrl" />
    <div v-if="isLoadingGif">Loading...</div>
  </div>

  <!-- Content Overlay -->
  <div class="invitation__content">
    <div class="invitation__box">
      <img v-if="invitation.imageUrl" :src="invitation.imageUrl" />
      <h1>You're invited, {{ invitation.recipientName }}!</h1>
      <p>— from {{ invitation.senderName }} with love</p>
      <p v-if="expiresIn < 3 days">⏰ Expires in {{ formatExpiryTime() }}</p>
      <YesNoButtons />
    </div>
  </div>

  <!-- Error States -->
  <div v-if="isExpired">This invitation has expired</div>
  <div v-if="isInvalid">Invalid invitation</div>
</div>
```

**Reactive State**:
- `invitation`: Decoded invitation data
- `isLoading`: Initial load state
- `isExpired`: Expiration detection
- `isInvalid`: Malformed/corrupted data
- `expiresIn`: Seconds remaining (updates every 60s)
- Media states: `isLoadingGif`, `gifError`, `imageError`

**Key Methods**:
- `loadInvitation()`: Fetches URL param, decodes, checks expiration
- `formatExpiryTime()`: Human-readable countdown (days/hours/minutes)
- `handleGifLoad()` / `handleGifError()`: Media event handlers

**Behavior**:
- Fullscreen GIF with object-fit: cover
- Content overlaid with semi-transparent background
- Expiration timer updates every 60 seconds
- Graceful fallbacks for missing/broken images
- Empty state handling for invalid invitations

**Styling**: `.invitation`, `.invitation__background`, `.invitation__gif`, `.invitation__content`, `.invitation__box`, `.invitation__title`, `.invitation__author`, `.invitation__image`, `.invitation__error-box`

**Dependencies**: dataEncoder.js, urlParser.js, YesNoButtons.vue

---

#### **YesNoButtons.vue** (User Story 3: Respond)

**Purpose**: Interactive buttons allowing recipient to respond

**Location**: `src/components/YesNoButtons.vue`

**Template Structure**:
```vue
<div class="buttons">
  <!-- Before Response -->
  <div v-if="!isResponded" class="buttons__container">
    <button class="buttons__button--yes" @click="handleYes">Yes! 🎉</button>
    <button class="buttons__button--no" @mouseenter="repositionNoButton">No 😊</button>
  </div>

  <!-- After Response -->
  <div v-else class="buttons__confirmation">
    <h2>✨ Yay! {{ recipientName }} is coming! ✨</h2>
    <p>Thanks for confirming! 🎊</p>
  </div>
</div>
```

**Reactive State**:
- `isResponded`: Response submission state
- `isProcessing`: Recording in progress
- `noButtonPosition`: Dynamic X/Y coordinates
- `noButtonStyle`: Computed transform property

**Key Methods**:
- `handleYes()`: Records response, updates localStorage, shows confirmation
- `repositionNoButton()`: Randomizes position within viewport bounds
- `calculateRandomPosition()`: Ensures button stays on-screen
- `checkExistingResponse()`: Checks localStorage on mount

**Behavior**:
- **Yes Button**: Stationary, clickable, records response with ✨ processing state
- **No Button**: Repositions on hover/touchstart, unclickable (pointer-events: none)
- **Response**: Stored to localStorage with RecipientResponse object
- **Confirmation**: Shows celebratory message with confetti animation
- **Persistence**: Response survives page reload

**RecipientResponse Object**:
```javascript
{
  invitationId: string,
  recipientName: string,
  response: 'yes',
  respondedAt: ISO string,
  userAgent: string,
  viewport: { width, height }
}
```

**Styling**: `.buttons`, `.buttons__container`, `.buttons__button`, `.buttons__button--yes`, `.buttons__button--no`, `.buttons__confirmation`, `.confetti-particle`

**Dependencies**: localStorage API

---

### Page Components

#### **CreatePage.vue**

- Simple wrapper for InvitationForm
- Gradient background (#ffeaa7 → #fab1a0)
- Entry point for new invitation creation

#### **ViewPage.vue**

- Wrapper for InvitationDisplay
- Receives `invitationId` prop from App.vue
- Entry point for viewing shared invitations

#### **App.vue** (Root)

**Routing Logic**:
```javascript
// No ?id parameter → Show CreatePage
// Has ?id parameter → Show ViewPage

const isCreating = !getUrlParam('id')
```

**Features**:
- Client-side routing without router library
- Browser history support (popstate event)
- CSS import ordering (main → responsive → animations → components/invitation)

---

## Utility Functions

### **dataEncoder.js** (Data Layer)

Handles all invitation encoding/decoding operations.

**Functions**:

```javascript
// Create invitation with expiration
createInvitation(recipientName, senderName, gifUrl, imageUrl, expiresInDays = 30)
→ { id, ...invitation, expiresAt }

// Encode to Base64
encodeInvitation(invitation)
→ base64string

// Decode from Base64
decodeInvitation(encodedData)
→ invitation object or null

// Check if expired
isInvitationExpired(invitation)
→ boolean

// Validate schema
validateInvitationSchema(data)
→ boolean
```

**Implementation Details**:
- Uses `crypto.subtle.digest('SHA-256')` for deterministic invitation IDs
- Expiration stored as timestamp (ms since epoch)
- Base64 encoding handles special characters safely

---

### **urlParser.js** (URL Utilities)

Manages URL parameter manipulation.

**Functions**:

```javascript
// Get parameter by key
getUrlParam(key)
→ value or null

// Set single parameter
setUrlParams({ key: value })
→ new URL with parameter

// Remove parameter
removeUrlParam(key)
→ new URL without parameter

// Check existence
hasUrlParam(key)
→ boolean

// Generate shareable URL
generateUrl(invitationId)
→ window.location.origin + '?id=' + invitationId
```

---

### **validator.js** (Form Validation)

Validates all form inputs before submission.

**Functions**:

```javascript
validateRequired(value, fieldName) → { isValid, error }
validateLength(value, min, max, fieldName) → { isValid, error }
validateUrl(url, fieldName) → { isValid, error }
validateGifUrl(url) → { isValid, error }  // Must be .gif
validateImageUrl(url) → { isValid, error }  // Optional
validateInvitationForm(formData) → { isValid, errors: {} }
```

---

### **fileHandler.js** (File Uploads)

Handles optional image file uploads.

**Functions**:

```javascript
fileToDataUrl(file) → Promise<data:url>
getFileSizeMB(file) → number
isValidImageType(file) → boolean
validateImageFile(file) → { isValid, error }
getImageDimensions(url) → Promise<{ width, height }>
validateImageDimensions(url) → boolean
```

---

## CSS Architecture: BEMIT

### Structure

```
Breakpoints:
- xs: 0-480px (mobile default)
- sm: 481-768px (tablet)
- md: 769-1024px (desktop)
- lg: 1025px+ (large desktop)

File Organization:
src/styles/
├── main.css                 # Reset, typography, colors, shadows
├── responsive.bemit.css     # Media queries, breakpoints
├── animations.css           # Keyframe animations, transitions
├── components.bemit.css     # Component-specific overrides
├── form.bemit.css          # Form styling (integrated)
├── invitation.bemit.css    # Invitation display styling
└── buttons.bemit.css       # Button styling
```

### Naming Convention

```css
/* Block */
.form { }

/* Block__Element */
.form__input { }

/* Block__Element--Modifier */
.form__input--error { }

/* Responsive IT Suffix */
@media (min-width: 481px) {
  .form@sm { }  /* tablet */
}

@media (min-width: 769px) {
  .form@md { }  /* desktop */
}
```

### Key Animations

- **fadeIn**: 0.8s ease-out, opacity 0 → 1
- **slideUp**: 0.6s ease-out, translateY(30px) → 0
- **scaleIn**: 0.6s ease-out, scale(0.9) → 1
- **pulse**: Heart-beat effect for highlights
- **confetti-fall**: 3s ease-out for celebration animation

All animations respect `prefers-reduced-motion` for accessibility.

---

## Testing Strategy

### Unit Tests (118 tests total)

**Location**: `tests/unit/`

**Coverage**:
- `validator.spec.js` (22 tests): All validation functions with edge cases
- `dataEncoder.spec.js` (14 tests): Encoding/decoding round-trips, expiration
- `urlParser.spec.js` (13 tests): URL parameter handling, special characters
- `InvitationForm.spec.js` (25 tests): Form logic, validation, submission
- `InvitationDisplay.spec.js` (17 tests): Decoding, error states, media handling
- `YesNoButtons.spec.js` (27 tests): Buttons, response storage, repositioning

**Run Tests**:
```bash
npm run test              # Run all unit tests
npm run test:ui          # Run with interactive UI
npm run test -- --watch  # Watch mode
```

### E2E Tests (18 total)

**Location**: `tests/e2e/`

**Scenarios**:
- `form-submission.spec.js` (10 tests): Form creation flow, validation, link generation
- `invitation-view.spec.js` (10 tests): Recipient journey, error states, responsive viewports
- `button-interaction.spec.js` (8 tests): Yes/No interactions, response storage, mobile

**Run Tests**:
```bash
npm run test:e2e         # Run end-to-end tests
```

**Test Prerequisites**:
- Development server running (`npm run dev`)
- Tests run against `http://localhost:5173`

---

## Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Start dev server with HMR
npm run dev

# In separate terminal: watch tests
npm run test -- --watch
```

### Before Committing

```bash
# Run all tests
npm run test && npm run test:e2e

# Build for production
npm run build

# Check bundle size
# (See dist/ directory for final output)
```

### Performance Tips

1. **Lazy load images**: Mark images with `loading="lazy"`
2. **Optimize GIF URLs**: Choose reasonable-sized GIFs (< 5MB)
3. **Use `transform`/`opacity`**: Animate these properties for 60 FPS
4. **Debounce expensive operations**: Reposition handler uses implicit debounce
5. **Profile in DevTools**: Check FCP, LCP, CLS metrics

---

## Debugging

### Vue 3 DevTools

Install [Vue 3 DevTools](https://devtools.vuejs.org/) browser extension to inspect:
- Component hierarchy
- Reactive state changes
- Event emissions

### Console Debugging

```javascript
// Check invitation data
const encoded = localStorage.getItem('lastInvitation')
console.log(JSON.parse(atob(encoded)))

// Check stored responses
Object.keys(localStorage).filter(k => k.startsWith('response_'))
```

### Network Issues

1. Check GIF CORS headers (must have `crossorigin="anonymous"`)
2. Verify Base64 encoding doesn't exceed URL limits (~2000 chars)
3. Test with various image sizes and formats

---

## Deployment Checklist

- [ ] All unit tests passing (`npm run test`)
- [ ] All E2E tests passing (`npm run test:e2e`)
- [ ] Build succeeds (`npm run build`)
- [ ] Bundle sizes acceptable (target: < 100KB gzipped)
- [ ] No broken image links
- [ ] WCAG 2.1 AA compliance verified
- [ ] Mobile, tablet, desktop testing complete
- [ ] Cross-browser testing: Chrome, Firefox, Safari, Edge
- [ ] Update CHANGELOG with new features
- [ ] Update documentation (README, this file)

---

## Common Issues & Solutions

### Issue: GIF doesn't load in production

**Solution**: Verify GIF URL has CORS headers. Many CDNs block direct embedding.

```html
<!-- ❌ May block -->
<img src="https://media.giphy.com/media/abc123.gif" />

<!-- ✅ Use Giphy CDN -->
<img src="https://media0.giphy.com/media/abc123/giphy.gif?cid=..." />
```

### Issue: URL too long after encoding

**Solution**: Reduce image resolution or use smaller GIFs. Base64 can inflate size 25-30%.

### Issue: Button repositioning janky on mobile

**Solution**: Ensure `pointer-events: none` is on No button. Check DevTools performance profile for layout thrashing.

### Issue: Tests fail in CI but pass locally

**Solution**: Ensure Node.js version matches (18+). Clear node_modules and reinstall.

---

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [BEMIT Methodology](https://cssguidelin.es/)
- [Web Performance](https://web.dev/performance/)

---

**Happy developing! 🚀**
