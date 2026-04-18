# Architecture

<!-- GSD-MARKER:DOC-GENERATED -->

## System Overview

WindFighter Telemetry App is a client-side web application for analyzing electric unicycle (EUC) trip data from CSV logs. All data processing happens in the browser - no server uploads required.

## Core Architecture

### Client-Side Only Design

**Privacy-First Approach:**
- All CSV parsing happens in the browser using PapaParse
- No data is sent to any server
- Settings are stored in localStorage
- Session state is maintained in React components

**Benefits:**
- Complete privacy for user data
- No backend infrastructure required
- Works offline after initial load
- Easy deployment to static hosting (Netlify, GitHub Pages)

### Component Architecture

```
App.tsx (Root)
├── TripOverview (Main dashboard)
│   ├── FloatingDataPanel (Statistics cards)
│   ├── TimeRangeSlider (Time filtering)
│   └── Tab System
│       ├── AccelerationTab (Acceleration analysis)
│       │   ├── AccelerationConfig (Preset configuration)
│       │   ├── AccelerationTable (Attempt results)
│       │   ├── ChartWithZoom (Speed chart)
│       │   └── AttemptButton (Toggle visibility)
│       ├── AccelerationComparison (Comparison mode)
│       │   ├── AccelerationTable (Comparison table)
│       │   └── ScatterPlot (Power curve)
│       └── GPSMap (Route visualization)
│           └── Leaflet map with route overlay
├── SettingsPanel (Configuration UI)
└── ErrorBoundary (Error handling)
```

## Data Flow

### CSV Parsing Pipeline

```
CSV File Upload
    ↓
PapaParse (raw parsing)
    ↓
detectCSVFormat (format detection)
    ↓
parseCSV (unified format)
    ↓
TripEntry[] (normalized data)
    ↓
calculateTripSummary (statistics)
    ↓
detectAccelerationAttempts (acceleration analysis)
    ↓
AccelerationAttempt[] (attempt data)
```

### State Management

**React State:**
- Component-level state for UI interactions
- Custom hooks for complex state logic:
  - `useAccelerationState` - Acceleration analysis state
  - `useChartState` - Chart configuration
  - `useChartOptions` - Chart options generation

**Persistence:**
- localStorage for user settings
- Session state for current trip data
- No database - all data is ephemeral per session

## Key Modules

### Parser Module (`src/utils/parser.ts`)

**Responsibilities:**
- CSV format detection (old vs new format)
- Data normalization
- Type conversion and validation

**Key Functions:**
- `detectCSVFormat()` - Analyzes CSV headers
- `parseCSV()` - Parses and normalizes CSV data
- `unifyEntry()` - Converts to TripEntry format

### Acceleration Module (`src/utils/acceleration.ts`)

**Responsibilities:**
- Detect acceleration attempts from telemetry
- Calculate advanced metrics
- Filter and classify attempts

**Key Functions:**
- `detectAccelerationAttempts()` - Finds acceleration runs
- `calculateAccelerationMetrics()` - Computes metrics
- `filterAttempts()` - Filters by completion status

### Performance Module (`src/utils/performance.ts`)

**Responsibilities:**
- Data downsampling for large datasets
- Throttling for UI performance
- Memoization strategies

**Key Functions:**
- `downsampleData()` - Reduces data point density
- `throttle()` - Rate limiting for event handlers

### Settings Module (`src/utils/settings.ts`)

**Responsibilities:**
- User preference management
- localStorage persistence
- Default configuration

**Key Functions:**
- `loadSettings()` - Load from localStorage
- `saveSettings()` - Persist to localStorage
- `resetSettings()` - Restore defaults

## Component Design Patterns

### Custom Hooks

**useAccelerationState:**
```typescript
- Manages acceleration attempt state
- Handles preset configuration
- Filters and sorts attempts
```

**useChartState:**
```typescript
- Manages chart visibility
- Handles chart options
- Manages zoom state
```

**useChartOptions:**
```typescript
- Generates Chart.js configuration
- Applies styling and theming
- Handles responsive behavior
```

### Component Composition

**ChartWithZoom:**
- Reusable chart component with zoom/pan
- Accepts data and configuration as props
- Handles chart lifecycle

**FloatingDataPanel:**
- Draggable statistics panel
- Collapsible sections
- Responsive layout

**TimeRangeSlider:**
- Custom range slider implementation
- Handles time filtering
- Visual feedback for selected range

## Data Structures

### TripEntry (Core Data Structure)

```typescript
interface TripEntry {
  // Core fields
  Speed: number;
  Voltage: number;
  PWM: number;
  Current: number;
  Power: number;
  BatteryLevel: number;
  TotalDistance: number;
  Temperature: number;
  GPSSpeed: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Altitude: number | null;
  timestamp: number;

  // Extended fields (new format)
  PhaseCurrent?: number;
  Torque?: number;
  Temp2?: number;
  Distance?: number;
  Mode?: string;
  Alert?: string;

  // IMU/Orientation
  Tilt?: number | null;
  Roll?: number | null;
  Pitch?: number | null;

  // Raw data
  rawData?: Record<string, string | number | null>;
}
```

### AccelerationAttempt

```typescript
interface AccelerationAttempt {
  id: string;
  startTimestamp: number;
  endTimestamp: number;
  thresholdPair: { from: number; to: number };
  time: number;
  distance: number;
  averagePower: number;
  peakPower: number;
  batteryDrop: number;
  isComplete: boolean;
  
  // Advanced metrics
  powerEfficiency: number;
  powerConsistency: number;
  powerDistribution: { low: number; medium: number; high: number };
  batteryDropRate: number;
  energyPerKm: number;
  temperaturePowerCorrelation: number;
  temperatureEfficiency: number;
}
```

## Performance Optimizations

### Data Downsampling

**Strategy:**
- Downsample large datasets (>10,000 points)
- Preserve peaks and valleys
- Maintain temporal accuracy

**Implementation:**
```typescript
downsampleData(data, targetSize)
```

### Memoization

**React.memo:**
- Component memoization for expensive renders
- Prevents unnecessary re-renders

**useMemo:**
- Expensive calculations cached
- Dependency arrays for invalidation

**useCallback:**
- Event handler memoization
- Prevents child re-renders

### Lazy Loading

**Code Splitting:**
- Dynamic imports for large components
- Reduces initial bundle size

## Internationalization (i18n)

**Implementation:**
- `src/i18n.ts` - Translation strings
- English and Russian support
- Extensible for additional languages

**Usage:**
```typescript
const t = (key: string) => translations[language][key];
```

## Testing Architecture

### Unit Tests

**Framework:** Vitest

**Coverage:**
- Utility functions (parser, acceleration, performance)
- Custom hooks
- Component logic

### E2E Tests

**Framework:** Playwright

**Coverage:**
- User flows (upload, analyze, export)
- Cross-browser testing
- Mobile responsiveness

## Deployment Architecture

### Static Hosting

**Platforms:**
- Netlify (primary)
- GitHub Pages (alternative)

**Build Process:**
```bash
npm run build
# Outputs to dist/
# Deploy dist/ to static hosting
```

### Environment Variables

**No environment variables required** - all configuration is client-side.

## Security Considerations

### Client-Side Only

**Benefits:**
- No server-side vulnerabilities
- No API endpoints to secure
- No database to protect

**Limitations:**
- No user authentication
- No server-side validation
- Relies on browser security

### Data Privacy

**Guarantees:**
- Data never leaves browser
- No tracking or analytics
- No third-party data sharing

## Technology Stack

### Frontend Framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Styling
- **Tailwind CSS 4** - Utility-first CSS
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Visualization
- **Chart.js 4** - Charting library
- **react-chartjs-2** - React wrapper
- **chartjs-plugin-zoom** - Zoom/pan functionality
- **Leaflet** - Map visualization
- **react-leaflet** - React wrapper

### Data Processing
- **PapaParse** - CSV parsing
- **date-fns** - Date/time utilities

### Testing
- **Vitest** - Unit testing
- **Playwright** - E2E testing
- **Testing Library** - Component testing

## Future Architecture Considerations

### Potential Enhancements

**State Management:**
- Consider Redux/Zustand if state complexity grows
- Currently using React state + custom hooks

**Data Persistence:**
- IndexedDB for larger datasets
- File API for local file management

**Performance:**
- Web Workers for CPU-intensive processing
- WebGL for chart rendering (large datasets)

### Scalability Limits

**Current Limit:**
- Single-user, single-session
- No multi-user features
- No data persistence across sessions

**If Scaling Needed:**
- Add backend with user authentication
- Implement database for data persistence
- Add real-time collaboration features
