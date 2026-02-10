# Static Web App Constitution

## Core Principles

### I. Static-First
All content must be pre-built HTML, CSS, and JavaScript. No server-side rendering or dynamic backends. All assets serve from a single output directory.

### II. Client-Side Only
All interactivity runs in the browser. No external API calls required for core functionality. Third-party dependencies must be carefully evaluated.

### III. Zero Dependencies
Minimize npm/package dependencies. Prefer vanilla JavaScript unless a feature is impossible to build without external libraries. Document all dependencies with their purpose.

### IV. Build Reproducibility
Build process must be deterministic and documented. output/ directory contains the complete static site ready to deploy. Source files must be organized logically (src/, assets/, etc.).

### V. Basic Testing
Validate build output correctness. Test critical user paths. Ensure no broken links or missing assets in the built site.

## Technical Requirements

- **Build Tool**: Standard build process (npm scripts, Vite, or simple build script)
- **Output Format**: Plain HTML, CSS, JavaScript (no proprietary formats)
- **Performance**: Optimize bundle sizes; minimal uncompressed output
- **Compatibility**: Support modern browsers (last 2 versions)

## Development Workflow

1. Features developed in src/ directory
2. Build runs and validates output
3. Deploy output/ directory to static hosting (GitHub Pages, Netlify, etc.)
4. No local database or server needed for development

## Governance

All PRs must verify:
- Build completes without errors
- Output/ directory is deployable
- No broken links or missing resources
- New dependencies are justified

**Version**: 1.0.0 | **Ratified**: 2026-02-08 | **Last Amended**: 2026-02-08
