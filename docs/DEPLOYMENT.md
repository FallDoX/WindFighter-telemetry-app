# Deployment

<!-- GSD-MARKER:DOC-GENERATED -->
<!-- VERIFY: Netlify and GitHub Pages deployment configurations are based on standard static hosting practices -->

## Overview

WindFighter Telemetry App is a static web application that can be deployed to any static hosting service. No backend server required.

## Build Process

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

## Deployment Options

### Netlify (Recommended)

**Automatic Deployment:**

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy automatically on push to main branch

**Manual Deployment:**

```bash
npm run build
# Drag and drop dist/ folder to Netlify
```

**Configuration:**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

**Environment Variables:**

No environment variables required for this application.

### GitHub Pages

**Setup:**

1. Enable GitHub Pages in repository settings
2. Select source: `gh-pages` branch
3. Deploy using:

```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

**Or using gh-pages package:**

```bash
npm install -g gh-pages
npm run build
gh-pages -d dist
```

**Configuration:**

Update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/WindFighter-telemetry-app/', // Your repository name
  // ... other config
});
```

### Vercel

**Setup:**

1. Import project in Vercel
2. Configure:
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy

**Configuration:**

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Static Hosting (Apache/Nginx)

**Apache:**

Create `.htaccess` in `dist/`:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Deployment Checklist

### Before Deployment

- [ ] Run tests: `npm run test:unit` and `npm run test`
- [ ] Build production: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Update version in package.json
- [ ] Update CHANGELOG.md (if applicable)
- [ ] Review environment variables

### After Deployment

- [ ] Test all features
- [ ] Test on mobile devices
- [ ] Test across browsers
- [ ] Verify charts render correctly
- [ ] Check console for errors
- [ ] Test CSV upload functionality

## CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:unit
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Netlify CI/CD

Netlify automatically builds and deploys on push. Configure in Netlify dashboard.

## Performance Optimization

### Build Optimizations

- Code splitting
- Tree shaking
- Minification
- Asset optimization

### CDN Configuration

For better performance, consider using a CDN:
- Netlify provides built-in CDN
- Cloudflare can be used for custom domains
- Vercel provides global CDN

### Caching

Configure caching headers in your hosting platform:
- Cache static assets (CSS, JS) for 1 year
- Cache HTML for shorter duration
- Use cache-busting with file hashes

## Monitoring

### Analytics

Add analytics if needed:
- Google Analytics
- Netlify Analytics
- Vercel Analytics

### Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket

## Security

### HTTPS

Always use HTTPS in production:
- Netlify provides free SSL
- GitHub Pages provides HTTPS
- Use Let's Encrypt for custom hosting

### CSP Headers

Consider adding Content Security Policy headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

### CORS

No CORS configuration needed - all data is client-side.

## Troubleshooting

### Build Fails

**Issue:** Build fails with errors

**Solutions:**
- Check Node version (requires 18+)
- Clear node_modules and reinstall
- Check for dependency conflicts
- Review build logs

### Deployment Fails

**Issue:** Deployment fails

**Solutions:**
- Check build output locally first
- Verify build configuration
- Check hosting platform logs
- Ensure sufficient permissions

### 404 Errors

**Issue:** Pages return 404 on refresh

**Solutions:**
- Configure SPA routing
- Add redirect rules
- Verify server configuration

### Assets Not Loading

**Issue:** CSS/JS not loading

**Solutions:**
- Check base path configuration
- Verify asset paths
- Check CDN configuration
- Clear browser cache

## Rollback

### Netlify

1. Go to Deploys in Netlify dashboard
2. Select previous deploy
3. Click "Publish to production"

### GitHub Pages

```bash
git checkout previous-commit
npm run build
git add dist -f
git commit -m "Rollback"
git subtree push --prefix dist origin gh-pages
```

## Domain Configuration

### Custom Domain

**Netlify:**
1. Add domain in Netlify dashboard
2. Configure DNS records
3. Enable SSL

**GitHub Pages:**
1. Add custom domain in repository settings
2. Configure DNS records
3. Enable Enforce HTTPS

### DNS Records

Typical DNS configuration:

```
A    @    192.0.2.1
CNAME www    your-domain.netlify.app
```

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
