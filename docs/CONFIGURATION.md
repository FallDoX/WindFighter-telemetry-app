# Configuration

<!-- GSD-MARKER:DOC-GENERATED -->

## Overview

WindFighter Telemetry App uses a client-side configuration system stored in localStorage. All settings are user-configurable through the Settings Panel (⚙️ button in the UI).

## Settings Storage

### localStorage Keys

All settings are stored under the `wfeucapp_` prefix in browser localStorage:

```typescript
// Settings structure
interface AppSettings {
  // Chart visibility
  showSpeedChart: boolean;
  showPowerChart: boolean;
  showVoltageChart: boolean;
  showTemperatureChart: boolean;
  
  // Chart options
  downsampleEnabled: boolean;
  downsampleThreshold: number;
  
  // Acceleration settings
  accelerationEnabled: boolean;
  minAccelerationDuration: number;
  accelerationThresholds: number[];
  
  // UI preferences
  language: 'en' | 'ru';
  theme: 'light' | 'dark';
  
  // Advanced
  debugMode: boolean;
}
```

### Default Settings

```typescript
const DEFAULT_SETTINGS: AppSettings = {
  // Charts
  showSpeedChart: true,
  showPowerChart: true,
  showVoltageChart: true,
  showTemperatureChart: true,
  
  // Performance
  downsampleEnabled: true,
  downsampleThreshold: 10000,
  
  // Acceleration
  accelerationEnabled: true,
  minAccelerationDuration: 2.0, // seconds
  accelerationThresholds: [25, 60, 90, 100],
  
  // UI
  language: 'en',
  theme: 'light',
  
  // Advanced
  debugMode: false,
};
```

## Configuration Files

### vite.config.ts

Vite configuration for development and build:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### tailwind.config.js

Tailwind CSS configuration:

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#8b5cf6',
      },
    },
  },
  plugins: [],
};
```

### tsconfig.json

TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.app.json" }]
}
```

### eslint.config.js

ESLint configuration:

```javascript
export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: [reactRefresh, reactHooks],
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
```

### playwright.config.ts

Playwright E2E test configuration:

```typescript
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### vitest.config.ts

Vitest unit test configuration:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'e2e/'],
    },
  },
});
```

## Environment Variables

**No environment variables required** - all configuration is client-side.

### Optional Variables (for future use)

If you add environment variables in the future, use the Vite convention:

```bash
# .env.local
VITE_API_URL=https://api.example.com
VITE_TELEGRAM_BOT_TOKEN=your_token_here
```

Access in code:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Acceleration Presets Configuration

### Default Presets

Acceleration presets are configured in `AccelerationConfig.tsx`:

```typescript
const DEFAULT_PRESETS = [
  { id: '0-25', from: 0, to: 25, label: '0-25' },
  { id: '0-60', from: 0, to: 60, label: '0-60' },
  { id: '0-90', from: 0, to: 90, label: '0-90' },
  { id: '0-100', from: 0, to: 100, label: '0-100' },
];
```

### Custom Presets

Users can create custom presets through the UI. These are stored in component state (not persisted across sessions currently).

## Chart Configuration

### Chart.js Defaults

Global Chart.js configuration in `ChartWithZoom.tsx`:

```typescript
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
Chart.defaults.color = '#374151';
Chart.defaults.borderColor = '#e5e7eb';
```

### Zoom Plugin Configuration

```typescript
zoom: {
  pan: {
    enabled: true,
    mode: 'x',
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    mode: 'x',
  },
},
```

## Internationalization Configuration

### Supported Languages

Language files in `src/i18n.ts`:

```typescript
const translations = {
  en: {
    // English translations
  },
  ru: {
    // Russian translations
  },
};
```

### Adding a New Language

1. Add translation object to `src/i18n.ts`
2. Add language option to SettingsPanel
3. Update type definitions

## Deployment Configuration

### Netlify

**netlify.toml** configuration:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

Deploy using `gh-pages` branch:

```bash
npm run build
git subtree push --prefix dist origin gh-pages
```

## Bot Configuration

### Telegram Bot (Optional)

Bot configuration in `bot/` directory:

```typescript
// bot/bot.ts
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
```

**Security:** Never hardcode tokens. Use environment variables.

## Performance Configuration

### Downsampling Thresholds

```typescript
const DOWNSAMPLE_THRESHOLDS = {
  SMALL: 1000,    // No downsampling
  MEDIUM: 10000,  // Light downsampling
  LARGE: 50000,   // Aggressive downsampling
};
```

### Chart Rendering Optimization

```typescript
const CHART_OPTIONS = {
  animation: {
    duration: 0, // Disable animation for performance
  },
  elements: {
    point: {
      radius: 0, // Hide points for large datasets
    },
  },
};
```

## Debug Configuration

### Debug Mode

Enable debug mode in Settings Panel or localStorage:

```javascript
localStorage.setItem('wfeucapp_debugMode', 'true');
```

Debug mode adds:
- Console logging for data processing
- Performance metrics
- Additional UI information

## Testing Configuration

### Unit Tests

Run unit tests with Vitest:

```bash
npm run test:unit          # Run unit tests
npm run test:unit:ui       # Run with UI
npm run test:unit:coverage # Run with coverage
```

### E2E Tests

Run E2E tests with Playwright:

```bash
npm run test               # Run all E2E tests
npm run test:ui            # Run with UI
npm run test:headed       # Run in headed mode
npm run test:debug         # Debug mode
```

## Browser Compatibility

### Supported Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Polyfills

No polyfills required - uses modern browser APIs.

## Security Configuration

### Content Security Policy

If using CSP headers, add:

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
```

### HTTPS Required

For production, always use HTTPS (required for localStorage in some contexts).

## Troubleshooting Configuration

### Reset Settings

Reset all settings to defaults:

```javascript
localStorage.removeItem('wfeucapp_settings');
// Reload page
```

### Clear Cache

Clear browser cache and localStorage:

```javascript
// In browser console
localStorage.clear();
location.reload();
```

### Check Configuration

View current settings in browser console:

```javascript
JSON.parse(localStorage.getItem('wfeucapp_settings'));
```
