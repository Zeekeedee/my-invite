# Deployment Guide - My Invite

This guide covers deploying the My Invite application to production across various platforms.

---

## Build Output

Before deploying, ensure the production build is complete:

```bash
npm run build
```

Output directory: `dist/`

**Final Metrics**:
- `dist/index.js`: 75.82 KB (28.45 KB gzipped)
- `dist/index.css`: 21.57 KB (4.51 KB gzipped)
- `dist/index.html`: 0.77 KB (0.47 KB gzipped)
- **Total**: ~33.4 KB gzipped (excellent for web delivery)

---

## Deployment Options

### Option 1: GitHub Pages (Recommended for GitHub-hosted projects)

#### Setup Steps

1. **Create GitHub Pages branch**:
```bash
# Create an orphan gh-pages branch
git checkout --orphan gh-pages
git rm -rf .
touch .nojekyll
git add .nojekyll
git commit -m "Create gh-pages branch"
git push origin gh-pages
git checkout main
```

2. **Configure package.json**:
```json
{
  "homepage": "https://yourusername.github.io/my-invite/",
  "scripts": {
    "build": "vite build",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Install gh-pages CLI**:
```bash
npm install -D gh-pages
```

4. **Deploy**:
```bash
npm run deploy
```

The site will be live at: `https://yourusername.github.io/my-invite/`

#### GitHub Actions (Automated CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test && npm run test:e2e || true

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: my-invite.example.com  # Optional: use custom domain
```

Benefits:
- Automatic deployment on every push to `main`
- Tests run before build
- Zero configuration needed (uses GitHub SSH keys)

---

### Option 2: Netlify (Easiest alternative)

#### Deploy via Web

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"

#### Deploy via CLI

```bash
# Install Netlify CLI
npm install -D netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Netlify Benefits**:
- Automatic HTTPS
- Global CDN
- Deploy previews for PRs
- Built-in analytics
- Serverless functions (future use)

---

### Option 3: Vercel (Nextjs-friendly, works great for Vue too)

#### Deploy via Web

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Framework preset: Select "Other" (Vue 3 + Vite)
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click "Deploy"

#### Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Vercel Benefits**:
- Fastest global CDN
- Automatic HTTPS
- One-click rollback
- Analytics integrations
- Blazing fast deployments

---

### Option 4: AWS S3 + CloudFront

#### Static Website Hosting

1. **Create S3 bucket**:
```bash
aws s3 mb s3://my-invite-bucket --region us-east-1
```

2. **Enable static website hosting**:
```bash
aws s3 website s3://my-invite-bucket --index-document index.html --error-document index.html
```

3. **Upload dist files**:
```bash
aws s3 sync dist/ s3://my-invite-bucket --delete
```

4. **Create CloudFront distribution** (optional, for CDN):
```bash
# Use AWS Console for one-time setup
# Point to S3 bucket as origin
# Enable HTTPS (free with AWS Certificate Manager)
```

**S3 Benefits**:
- Pay-as-you-go pricing (extremely cheap for static sites)
- Unlimited storage
- High availability

---

### Option 5: Docker Container (Advanced)

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html index.htm;

    # SPA routing: redirect 404s to index.html
    location / {
        try_files $uri /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|icon|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # No cache for HTML
    location ~ \.html?$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Build and run:

```bash
docker build -t my-invite:latest .
docker run -p 80:80 my-invite:latest
```

---

## Custom Domain Setup

### 1. Register domain (GoDaddy, Namecheap, etc.)

### 2. Point to hosting provider

**For GitHub Pages**:
- Create `CNAME` file in root with domain:
```
my-invite.example.com
```

**For Netlify**:
- Go to Domain settings
- Add custom domain
- Follow DNS instructions

**For Vercel**:
- Add domain in project settings
- Vercel provides DNS records to add

### 3. Verify SSL/TLS

All major providers offer free HTTPS (Let's Encrypt).

---

## Performance Optimization for Deployment

### 1. Enable Gzip Compression

Most hosting providers enable this automatically. Verify:

```bash
# Check if assets are gzipped
curl -I https://my-invite.example.com/dist/index.js | grep "Content-Encoding"
```

### 2. Cache Headers

Set aggressive caching for assets:

```
# For static assets (JS, CSS)
Cache-Control: public, max-age=31536000, immutable

# For HTML (SPA entry point)
Cache-Control: no-cache, no-store, must-revalidate
```

**Netlify/Vercel** do this automatically.

### 3. CDN Configuration

All platforms above include CDN by default. For AWS, add CloudFront in front of S3.

---

## Pre-Deployment Checklist

- [ ] All tests passing: `npm run test && npm run test:e2e`
- [ ] Production build succeeds: `npm run build`
- [ ] No console errors in `dist/index.js`
- [ ] Bundle sizes acceptable (< 100KB gzipped)
- [ ] GIF and image URLs are accessible and CORS-enabled
- [ ] Test invitation creation and viewing flow
- [ ] Test on mobile, tablet, desktop
- [ ] Verify localStorage works in production
- [ ] Check mobile performance: Lighthouse score > 90
- [ ] WCAG 2.1 AA compliance verified
- [ ] Cross-browser testing complete:
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari
  - [ ] Edge

---

## Post-Deployment Verification

### 1. Smoke Tests

```bash
# Test production URL
curl -s https://my-invite.example.com/ | grep "You're invited"

# Check assets loaded
curl -I https://my-invite.example.com/dist/index.js
```

### 2. Functional Testing

1. Create an invitation with all fields
2. Copy and test the shareable link
3. Test on mobile browser
4. Click Yes and No buttons
5. Verify localStorage in DevTools

### 3. Performance Metrics

Use [web.dev/measure](https://web.dev/measure) or Lighthouse:

```bash
npm install -D lighthouse
npm run lighthouse https://my-invite.example.com
```

**Target Scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

---

## Rollback Procedure

### GitHub Pages
```bash
git revert <commit-hash>
git push origin main
# Re-deploy with GitHub Actions or manual deploy
```

### Netlify
```bash
# One-click rollback in Netlify Dashboard
# or via CLI:
netlify deploy --prod --dir=dist
```

### Vercel
```bash
# One-click rollback in Vercel Dashboard
# Automatic on previous versions
```

---

## Monitoring & Analytics

### 1. Google Analytics

Add to `src/main.js`:

```javascript
import { createApp } from 'vue'
import App from './App.vue'

// Google Analytics (optional)
if (import.meta.env.PROD) {
  // Add gtag script to index.html or use vue-gtag package
}

createApp(App).mount('#app')
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/vue @sentry/tracing
```

```javascript
import * as Sentry from "@sentry/vue"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE
})
```

### 3. Web Vitals Monitoring

```bash
npm install web-vitals
```

Track in your app and send to analytics service.

---

## Updating After Deployment

### New Features

1. Develop on feature branch
2. Create PR (runs tests in GitHub Actions)
3. Merge to `main`
4. GitHub Actions automatically deploys
5. Site updates within 1-2 minutes

### Bug Fixes

Same process as features. Emergency hotfixes can be deployed directly.

### Dependency Updates

```bash
# Check for outdated packages
npm outdated

# Update safely
npm update

# Run tests
npm run test && npm run test:e2e

# Deploy if passing
npm run build && npm run deploy
```

---

## Troubleshooting

### Issue: 404 errors on page refresh

**Cause**: SPA routing not configured

**Solution**: Ensure `_redirects` file for Netlify or `vercel.json` for Vercel:

**For Netlify** (`_redirects`):
```
/*    /index.html   200
```

**For Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Issue: Assets not loading (404)

**Cause**: Homepage path mismatch in `vite.config.js`

**Solution**: Update if deploying to subdirectory:

```javascript
// vite.config.js
export default defineConfig({
  base: '/my-invite/' // Add if deploying to subdirectory
})
```

### Issue: CORS errors with GIF URLs

**Solution**: Use CORS-enabled GIF URLs:
- Use Giphy API with proper CORS headers
- Ensure `crossOrigin="anonymous"` on img tags
- Test GIF URL before sharing link

### Issue: Invitation links broken after deployment

**Cause**: Base URL changed

**Solution**: Ensure invitations use relative paths:
```javascript
// ✅ Correct: window.location.origin automatically uses correct domain
generateUrl(id) {
  return window.location.origin + '/?id=' + id
}

// ❌ Wrong: hardcoded domain
return 'https://localhost:5173/?id=' + id
```

---

## References

- [GitHub Pages Docs](https://pages.github.com/)
- [Netlify Docs](https://docs.netlify.com/)
- [Vercel Docs](https://vercel.com/docs)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Web Performance Guide](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)

---

**Ready to go live! 🚀**
