# Architecture Research - Acceleration Analysis for Trip Log Analyzer

**Last updated:** 2026-04-09

## Current Architecture

**Component Hierarchy (existing):**
```
App (main container)
├─ File Upload Zone
├─ Dashboard (when data loaded)
│  ├─ TripOverview (component)
│  ├─ Main Chart Section
│  └─ FloatingDataPanel
└─ Demo Buttons
```

**Data Flow (existing):**
```
CSV Upload → Parser → TripEntry[] → State → Filtered/Downsampled Data → Chart Components
```

## Acceleration Analysis Integration

### New Component Structure

```
App (main container)
├─ File Upload Zone
├─ Dashboard (when data loaded)
│  ├─ TripOverview (component)
│  ├─ Main Chart Section
│  ├─ AccelerationAnalysisSection (NEW)
│  │  ├─ AccelerationConfig (threshold settings)
│  │  ├─ AccelerationTable (attempts list)
│  │  ├─ AccelerationChart (visualization)
│  │  └─ AccelerationComparison (comparison mode)
│  └─ FloatingDataPanel
└─ Demo Buttons
```

### Data Flow for Acceleration

```
CSV Upload → Parser → TripEntry[] → AccelerationDetector → AccelerationAttempt[] → State
                                                                       ↓
                                                               Acceleration Metrics
                                                                       ↓
                                                         Acceleration Visualization
```

### Component Boundaries

**AccelerationDetector (new utility):**
- Input: TripEntry[], threshold config
- Output: AccelerationAttempt[]
- Location: src/utils/acceleration.ts
- Responsibility: Detect acceleration attempts, calculate metrics

**AccelerationConfig (new component):**
- Input: threshold state, onThresholdChange
- Output: UI controls for thresholds
- Location: src/components/AccelerationConfig.tsx
- Responsibility: User interface for threshold configuration

**AccelerationTable (new component):**
- Input: AccelerationAttempt[]
- Output: Table display
- Location: src/components/AccelerationTable.tsx
- Responsibility: Display acceleration attempts in table format

**AccelerationChart (new component):**
- Input: AccelerationAttempt[]
- Output: Chart visualization
- Location: src/components/AccelerationChart.tsx
- Responsibility: Visualize acceleration curves

**AccelerationComparison (new component):**
- Input: Multiple AccelerationAttempt[] arrays
- Output: Comparison charts
- Location: src/components/AccelerationComparison.tsx
- Responsibility: Compare acceleration attempts

### State Management

**New State Required:**
- `accelerationAttempts: AccelerationAttempt[]`
- `accelerationThresholds: { fromSpeed: number, toSpeed: number }[]`
- `selectedAccelerationAttempt: AccelerationAttempt | null`
- `accelerationViewMode: 'table' | 'chart' | 'comparison'`

**State Location:**
- Add to App.tsx state (for now)
- Consider Context API if state grows (future enhancement)

### Build Order

**Phase 1: Core Detection**
1. Add AccelerationDetector utility
2. Add acceleration state to App.tsx
3. Run detection on CSV parse
4. Add basic AccelerationTable component

**Phase 2: Configuration**
1. Add AccelerationConfig component
2. Add threshold state
3. Connect threshold changes to re-detection
4. Add default threshold presets

**Phase 3: Visualization**
1. Add AccelerationChart component
2. Add view mode toggle (table/chart)
3. Add acceleration curve visualization
4. Add attempt selection and details

**Phase 4: Comparison**
1. Add AccelerationComparison component
2. Add comparison mode
3. Add multi-trip comparison logic
4. Add advanced metrics

### Data Flow Considerations

**Performance:**
- Acceleration detection runs once on CSV parse (cached in state)
- Re-detection only when thresholds change
- Downsampling applies to acceleration charts as well

**Integration Points:**
- Acceleration detection hooks into existing parseTripData flow
- Acceleration visualization uses existing Chart.js infrastructure
- Acceleration config integrates with existing settings pattern

---

*Phase: 01-initialization*
*Research gathered: 2026-04-09*
