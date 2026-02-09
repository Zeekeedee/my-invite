# My Invite - Cute Invitation Website

A delightful, responsive invitation website that lets you create personalized invitations with custom GIF backgrounds and optional images. Recipients enjoy a cute interface with playful yes/no buttons.

## Features

- 🎉 **Create invitations** with custom GIF backgrounds and optional images
- 🔗 **Shareable links** that encode all invitation data
- 📱 **Fully responsive** design (mobile-first, works perfectly on all devices)
- 💝 **Adorable animations** and cute design aesthetic
- 🎯 **Playful interaction** with repositioning "No" button
- ⚡ **Lightning fast** - built with Vue 3 and Vite

## Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/my-invite.git
cd my-invite

# Install dependencies
npm install

# Start development server
npm run dev
```

The app opens automatically at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output goes to `dist/` directory, ready for GitHub Pages or other static hosting.

## Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run unit and component tests
- `npm run test:ui` - Run tests with interactive UI
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint and fix code

## Project Structure

```
src/
├── components/         # Vue components
│   ├── InvitationForm.vue
│   ├── InvitationDisplay.vue
│   └── YesNoButtons.vue
├── pages/              # Page components
│   ├── CreatePage.vue
│   └── ViewPage.vue
├── styles/             # BEMIT CSS styles
│   ├── main.css
│   ├── components.bemit.css
│   ├── responsive.bemit.css
│   └── animations.css
├── utils/              # Utility functions
│   ├── dataEncoder.js
│   ├── urlParser.js
│   ├── validator.js
│   └── fileHandler.js
├── App.vue             # Root component
└── main.js             # Entry point

tests/
├── unit/               # Unit tests
├── components/         # Component tests
└── e2e/                # End-to-end tests

public/
└── index.html          # HTML entry point
```

## Development Guide

### Creating an Invitation

1. Navigate to the home page (default view)
2. Fill in the form:
   - **Recipient Name**: Who will receive the invitation
   - **Sender Name**: Your name
   - **Background GIF**: URL to a GIF file
   - **Image** (optional): URL to an optional image
3. Click "Generate Link"
4. Copy and share the link

### Viewing an Invitation

Recipients open the shared link and see:
- GIF background playing
- Sender and recipient names
- Optional image (if included)
- Yes/No buttons for responding
- The "No" button playfully repositions on hover!

## CSS Architecture: BEMIT

This project uses BEMIT (BEM + IT) CSS methodology for scalable, maintainable styles:

```css
/* Block */
.invitation { }

/* Block Element */
.invitation__content { }

/* Block Modifier */
.invitation--loading { }

/* IT Responsive Suffix */
.invitation@sm { }   /* tablet */
.invitation@md { }   /* desktop */
.invitation@lg { }   /* large desktop */
```

**Mobile-first approach**: Default styles are for mobile; media queries enhance for larger screens.

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Data Flow

### Creating an Invitation

```
User Input → Form Validation → Base64 Encoding → URL Generation
```

**Example**: 
```javascript
const invitation = {
  recipientName: 'Alice',
  senderName: 'Bob',
  gifUrl: 'https://example.com/confetti.gif',
  imageUrl: 'https://example.com/photo.jpg'
};

// Encoded in URL: /?id=base64EncodedData
```

### Viewing an Invitation

```
URL Parameter → Base64 Decode → Verify Validity → Render Content
```

## Performance Targets

- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **Animations**: 60 FPS

## Deployment

### GitHub Pages

```bash
# Build project
npm run build

# Deploy dist/ to GitHub Pages
# (Configure via package.json or GitHub Actions)
```

### Other Platforms

Upload the `dist/` directory to:
- **Netlify**: Drag and drop
- **Vercel**: Connect GitHub repo
- **AWS S3 + CloudFront**: Sync dist/ to bucket

## Documentation

- [Feature Specification](specs/001-cute-invite/spec.md) - Complete requirements
- [Implementation Plan](specs/001-cute-invite/plan.md) - Technical architecture
- [Data Model](specs/001-cute-invite/data-model.md) - Entity definitions
- [Quick-Start Guide](specs/001-cute-invite/quickstart.md) - Developer guide
- [Tasks](specs/001-cute-invite/tasks.md) - Implementation tasks

## Contributing

1. Create a feature branch from `001-cute-invite`
2. Follow the project structure and BEMIT CSS conventions
3. Write tests for new features
4. Ensure all tests pass: `npm run test && npm run test:e2e`
5. Submit a PR with clear description

## License

MIT

## Questions?

Refer to the documentation files in `specs/001-cute-invite/` for detailed information about features, architecture, and development guidelines.

---

**Let's build something adorable! 🎉**
