# Development

<!-- GSD-MARKER:DOC-GENERATED -->

## Development Workflow

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Modern web browser

### Setup

```bash
# Clone repository
git clone https://github.com/FallDoX/WindFighter-telemetry-app.git
cd WindFighter-telemetry-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

```
src/
├── components/          # React components
│   ├── AccelerationTab.tsx
│   ├── AccelerationComparison.tsx
│   ├── AccelerationConfig.tsx
│   ├── ChartWithZoom.tsx
│   ├── GPSMap.tsx
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAccelerationState.ts
│   ├── useChartState.ts
│   └── useChartOptions.ts
├── utils/              # Utility functions
│   ├── parser.ts       # CSV parsing
│   ├── acceleration.ts # Acceleration analysis
│   ├── performance.ts  # Performance utilities
│   └── settings.ts     # Settings management
├── lib/                # Library utilities
│   ├── design-tokens.ts
│   └── utils.ts
├── types.ts            # TypeScript type definitions
├── i18n.ts             # Internationalization
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Code Style

### TypeScript

- Use strict TypeScript mode
- Define interfaces for all data structures
- Use type inference where appropriate
- Avoid `any` type

### React

- Use functional components with hooks
- Use `memo` for expensive components
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Follow React best practices

### CSS/Tailwind

- Use Tailwind utility classes
- Follow existing color scheme
- Use responsive prefixes (`md:`, `lg:`)
- Maintain mobile-first approach

## Component Development

### Creating a New Component

1. Create component file in `src/components/`
2. Define props interface
3. Use `memo` for performance
4. Add TypeScript types
5. Write tests

Example:

```typescript
import { memo } from 'react';

interface MyComponentProps {
  data: string;
  onAction: () => void;
}

export const MyComponent = memo<MyComponentProps>(({ data, onAction }) => {
  return (
    <div className="p-4">
      <p>{data}</p>
      <button onClick={onAction}>Action</button>
    </div>
  );
});
```

### Custom Hooks

Create custom hooks for reusable state logic:

```typescript
import { useState, useCallback } from 'react';

export function useMyHook(initialValue: string) {
  const [value, setValue] = useState(initialValue);

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return { value, updateValue };
}
```

## Testing

### Unit Tests

Run unit tests:

```bash
npm run test:unit          # Run tests
npm run test:unit:ui       # Run with UI
npm run test:unit:coverage # Run with coverage
```

Write tests in `__tests__/` or alongside source files:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should return expected result', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### E2E Tests

Run E2E tests:

```bash
npm run test           # Run all E2E tests
npm run test:ui        # Run with UI
npm run test:headed    # Run in headed mode
npm run test:debug     # Debug mode
```

Write tests in `e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('user can upload CSV', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.setInputFiles('input[type="file"]', 'test.csv');
  await expect(page.locator('.chart')).toBeVisible();
});
```

## Git Workflow

### Branch Strategy

- `main` - Production branch
- Feature branches - For new features
- Use descriptive branch names: `feature/acceleration-comparison`

### Commit Messages

Follow conventional commits:

```
feat: Add acceleration comparison feature
fix: Fix chart rendering bug
docs: Update README
refactor: Improve performance
test: Add unit tests
```

### Pull Requests

1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request
5. Request review
6. Merge after approval

## Performance Optimization

### Memoization

Use `useMemo` for expensive calculations:

```typescript
const filteredData = useMemo(() => {
  return data.filter(item => item.value > threshold);
}, [data, threshold]);
```

### Code Splitting

Use dynamic imports for large components:

```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Data Downsampling

Implement downsampling for large datasets:

```typescript
const downsampled = downsampleData(data, targetSize);
```

## Debugging

### Browser DevTools

Use Chrome DevTools for debugging:

- React DevTools for component inspection
- Performance tab for profiling
- Network tab for API calls
- Console for logging

### Debug Mode

Enable debug mode in settings:

```typescript
localStorage.setItem('wfeucapp_debugMode', 'true');
```

### Logging

Use console.log for debugging (remove before commit):

```typescript
console.log('Debug:', { data, state });
```

## Build Process

### Development Build

```bash
npm run dev
```

- Hot module replacement
- Source maps
- Fast refresh

### Production Build

```bash
npm run build
```

- Minified code
- Optimized assets
- Tree shaking
- Output in `dist/`

### Preview Build

```bash
npm run preview
```

Preview production build locally.

## Common Tasks

### Add New Chart Type

1. Create chart configuration in `useChartOptions.ts`
2. Add chart data processing
3. Update UI to include new chart
4. Add tests
5. Update documentation

### Add New Metric

1. Define metric type in `types.ts`
2. Implement calculation in utils
3. Add to TripSummary
4. Update UI to display
5. Add tests

### Add New Language

1. Add translations to `i18n.ts`
2. Update language selector
3. Test all UI elements
4. Update documentation

## Troubleshooting

### Build Errors

**Issue:** TypeScript errors

**Solution:**
```bash
npm run build
# Check error messages
# Fix type errors
```

**Issue:** Import errors

**Solution:**
- Check file paths
- Verify exports
- Check tsconfig.json

### Runtime Errors

**Issue:** Component not rendering

**Solution:**
- Check console for errors
- Verify props
- Check component lifecycle

**Issue:** Data not displaying

**Solution:**
- Verify data parsing
- Check data format
- Add debug logging

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
