# Testing

<!-- GSD-MARKER:DOC-GENERATED -->

## Overview

WindFighter Telemetry App uses two testing frameworks:
- **Vitest** for unit tests
- **Playwright** for end-to-end (E2E) tests

## Unit Testing

### Framework: Vitest

Vitest is used for unit testing utility functions, custom hooks, and component logic.

### Running Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run with UI
npm run test:unit:ui

# Run with coverage
npm run test:unit:coverage

# Run in watch mode
npm run test:unit -- --watch
```

### Test Structure

Unit tests are located in:
- `src/__tests__/` - General test files
- `src/**/*.test.ts` - Co-located with source files
- `src/**/*.test.tsx` - Component tests

### Writing Unit Tests

Example test for utility function:

```typescript
import { describe, it, expect } from 'vitest';
import { downsampleData } from '../utils/performance';

describe('downsampleData', () => {
  it('should reduce data size to target', () => {
    const data = Array.from({ length: 1000 }, (_, i) => ({ x: i, y: i * 2 }));
    const result = downsampleData(data, 100);
    expect(result.length).toBeLessThanOrEqual(100);
  });

  it('should preserve peaks and valleys', () => {
    const data = [
      { x: 0, y: 0 },
      { x: 1, y: 100 },
      { x: 2, y: 0 },
      { x: 3, y: 50 },
    ];
    const result = downsampleData(data, 2);
    expect(result.some(p => p.y === 100)).toBe(true);
  });
});
```

### Testing Custom Hooks

Use `@testing-library/react` for hook testing:

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAccelerationState } from '../hooks/useAccelerationState';

describe('useAccelerationState', () => {
  it('should initialize with empty attempts', () => {
    const { result } = renderHook(() => useAccelerationState());
    expect(result.current.attempts).toEqual([]);
  });

  it('should add attempt when called', () => {
    const { result } = renderHook(() => useAccelerationState());
    act(() => {
      result.current.addAttempt({ id: '1', time: 5, distance: 100 });
    });
    expect(result.current.attempts).toHaveLength(1);
  });
});
```

### Testing Components

Example component test:

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render with data', () => {
    render(<MyComponent data="test" onAction={() => {}} />);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should call onAction when button clicked', () => {
    const onAction = vi.fn();
    render(<MyComponent data="test" onAction={onAction} />);
    screen.getByRole('button').click();
    expect(onAction).toHaveBeenCalled();
  });
});
```

### Coverage

Generate coverage report:

```bash
npm run test:unit:coverage
```

Coverage reports are generated in `coverage/` directory.

Target coverage:
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## E2E Testing

### Framework: Playwright

Playwright is used for end-to-end testing of user flows across browsers.

### Running E2E Tests

```bash
# Run all E2E tests
npm run test

# Run with UI
npm run test:ui

# Run in headed mode (show browser)
npm run test:headed

# Debug mode
npm run test:debug
```

### Test Structure

E2E tests are located in `e2e/` directory:

```
e2e/
├── upload.spec.ts       # CSV upload tests
├── charts.spec.ts       # Chart rendering tests
├── acceleration.spec.ts # Acceleration analysis tests
└── settings.spec.ts     # Settings panel tests
```

### Writing E2E Tests

Example test for CSV upload:

```typescript
import { test, expect } from '@playwright/test';

test.describe('CSV Upload', () => {
  test('should upload and parse CSV file', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Upload file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-data/sample.csv');
    
    // Wait for charts to render
    await expect(page.locator('.chart')).toBeVisible();
    
    // Verify statistics
    await expect(page.locator('.stat-max-speed')).toContainText('km/h');
  });

  test('should show error for invalid file', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('test-data/invalid.csv');
    
    await expect(page.locator('.error-message')).toBeVisible();
  });
});
```

### Test Data

Place test CSV files in `test-data/` directory:

```
test-data/
├── sample.csv           # Valid CSV with all fields
├── old-format.csv       # Old format CSV
├── new-format.csv       # New format CSV
└── invalid.csv          # Invalid CSV for error testing
```

### Browser Testing

Playwright tests run across multiple browsers:

- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

Configure in `playwright.config.ts`:

```typescript
projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox', use: { browserName: 'firefox' } },
  { name: 'webkit', use: { browserName: 'webkit' } },
]
```

### Mobile Testing

Test mobile responsiveness:

```typescript
test.use({ viewport: { width: 375, height: 667 } });

test('should work on mobile', async ({ page }) => {
  await page.goto('http://localhost:5173');
  // Test mobile-specific behavior
});
```

## Test Configuration

### Vitest Configuration

`vitest.config.ts`:

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

### Playwright Configuration

`playwright.config.ts`:

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
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Pull requests
- Push to main branch
- Manual trigger

Example workflow:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:unit
      - run: npm run test
```

## Best Practices

### Unit Tests

- Test public interfaces, not implementation details
- Use descriptive test names
- One assertion per test when possible
- Mock external dependencies
- Test edge cases and error conditions

### E2E Tests

- Test user flows, not implementation
- Use data-testid selectors for reliability
- Wait for elements before interacting
- Clean up state between tests
- Test across browsers

### General

- Keep tests fast
- Maintain high coverage
- Review test failures before committing
- Update tests when changing behavior

## Troubleshooting

### Unit Test Failures

**Issue:** Test fails in CI but passes locally

**Solutions:**
- Check Node version
- Verify dependencies
- Check environment variables
- Review CI logs

### E2E Test Failures

**Issue:** Flaky tests

**Solutions:**
- Add retries in Playwright config
- Use explicit waits
- Check for race conditions
- Increase timeouts

### Coverage Issues

**Issue:** Low coverage

**Solutions:**
- Add tests for uncovered code
- Refactor to improve testability
- Check coverage configuration
- Review coverage exclusions

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Documentation](https://testing-library.com/)
