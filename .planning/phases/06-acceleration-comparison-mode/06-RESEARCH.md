# Phase 6: Acceleration Comparison Mode - Research

**Research Date:** 2026-04-10
**Status:** RESEARCH COMPLETE

## Domain Analysis

**Phase Goal:** Add comparison mode for multiple acceleration attempts.

This phase builds on existing acceleration visualization infrastructure from Phases 1-5. The key challenge is enabling users to select multiple acceleration attempts and compare them side-by-side with delta metrics.

## Existing Infrastructure

### Acceleration Detection (Phase 1)
- `AccelerationAttempt` type in `src/types.ts` with all metrics (time, distance, power, current, voltage, battery drop, temperature)
- `detectAccelerations` function in `src/utils/acceleration.ts`
- Attempts stored in `accelerationAttempts` array in `useAccelerationState` hook

### Acceleration Visualization (Phase 3)
- `AccelerationTab` component with Chart.js Line visualization
- Preset-based filtering (0-25, 0-60, 0-90, 0-100, custom)
- Overlaid curves with color coding
- `ATTEMPT_COLORS` array for distinct colors

### State Management (Phase 4)
- `useAccelerationState` hook manages all acceleration state
- LocalStorage persistence for threshold pairs and selected columns
- Memoization of detection results

### Multiple Thresholds (Phase 5)
- `ThresholdPair` type: `{ from: number; to: number }`
- `thresholdPair` field in `AccelerationAttempt`
- Multiple threshold pairs supported simultaneously

## Technical Approach

### 1. Comparison Component Architecture

**Option A: Separate Component (Recommended)**
- Create `AccelerationComparison` component
- Reuse Chart.js Line infrastructure from `AccelerationTab`
- Separate state for selected attempts (not in useAccelerationState)
- Cleaner separation of concerns

**Option B: Extend AccelerationTab**
- Add comparison mode as a toggle within AccelerationTab
- Share state with existing visualization
- More complex state management

**Recommendation:** Option A - separate component follows established pattern (AccelerationTab is separate from table)

### 2. Attempt Selection Mechanism

**Current State:**
- AccelerationTable displays all attempts
- No selection mechanism currently

**Approach:**
- Add checkbox column to AccelerationTable
- Maintain selected attempts in parent component state (App.tsx or new hook)
- Pass selected attempts to AccelerationComparison component

**Implementation:**
- Add `selectedAttempts: Set<string>` state
- Add checkbox in table row (col 0 before attempt number)
- Checkbox toggles attempt in selectedAttempts Set
- Clear selection button for UX

### 3. Comparison Visualization

**Current Pattern (AccelerationTab):**
- Overlaid Line charts with different colors
- Each dataset represents one attempt
- TimeScale x-axis, speed y-axis

**Comparison Visualization:**
- Same pattern: overlaid curves
- Filter to only selected attempts
- Use existing `ATTEMPT_COLORS` array
- Highlight "best" attempt (thicker line, different color)

**Best Attempt Detection:**
- Best = minimum time (per user decision in context)
- Calculate on-the-fly from selected attempts
- Add visual indicator (legend or annotation)

### 4. Delta Metrics Table

**Metrics to Compare:**
- Time (seconds)
- Distance (meters)
- Peak Power (watts)
- Average Power (watts)
- Battery Drop (percentage)

**Delta Calculation:**
- Identify best attempt (minimum time)
- For each selected attempt:
  - Δtime = attempt.time - best.time
  - Δdistance = attempt.distance - best.distance
  - ΔpeakPower = attempt.peakPower - best.peakPower
  - ΔavgPower = attempt.averagePower - best.averagePower
  - ΔbatteryDrop = attempt.batteryDrop - best.batteryDrop

**Table Structure:**
- Rows: selected attempts
- Columns: attempt #, time, distance, peak power, avg power, battery drop, Δtime, Δdistance, Δpeak power, Δavg power, Δbattery
- Color coding: positive deltas in green (better), negative in red (worse) - or reverse based on metric

**Selectable Columns:**
- Reuse existing column selector pattern from AccelerationTable
- Default to showing key metrics + deltas

### 5. Tab Integration

**Current Tab Structure (App.tsx):**
- Trip Telemetry (main chart)
- Acceleration (AccelerationTab + AccelerationTable)

**New Tab Structure:**
- Trip Telemetry
- Acceleration
- Comparison (AccelerationComparison + AccelerationTable with checkboxes)

**Implementation:**
- Add new tab state in App.tsx
- Create AccelerationComparison component
- Add tab button in UI
- Pass selectedAttempts state to both AccelerationComparison and AccelerationTable

### 6. Filtering (Best/Worst by Time)

**Implementation:**
- Add filter buttons: "Best 5", "Worst 5", "All"
- Sort selected attempts by time
- Filter to top/bottom N attempts
- Update visualization and table accordingly

**State:**
- `comparisonFilter: 'all' | 'best' | 'worst'`
- Filter applied in useMemo in AccelerationComparison

## Dependencies

### Internal Dependencies
- `src/types.ts` - AccelerationAttempt type
- `src/hooks/useAccelerationState.ts` - accelerationAttempts, thresholdPairs
- `src/components/AccelerationTable.tsx` - needs checkbox column
- `src/components/AccelerationTab.tsx` - reference for Chart.js pattern

### External Dependencies
- Chart.js - already used, no new dependency
- react-chartjs-2 - already used
- lucide-react - for icons (Check, X for selection)

## Implementation Order

1. Add checkbox column to AccelerationTable
2. Add selectedAttempts state to App.tsx
3. Create AccelerationComparison component (chart + delta table)
4. Add Comparison tab to App.tsx
5. Implement filtering (best/worst by time)
6. Add clear selection button
7. Polish UI (colors, highlighting, tooltips)

## Potential Issues

### Performance
- Large number of selected attempts could slow down rendering
- Mitigation: limit max selections (e.g., 10 attempts)
- Use useMemo for delta calculations

### State Complexity
- Selected attempts state needs to be accessible to both table and comparison
- Consider creating useComparisonState hook
- Or lift state to App.tsx (simpler for now)

### UX Considerations
- How to indicate which attempts are selected in table?
- Visual feedback when selection changes
- Empty state when no attempts selected

## Validation Architecture

**Dimension 1: Functional Correctness**
- Checkbox selection works correctly
- Selected attempts display in comparison chart
- Delta metrics calculated correctly
- Filtering works as expected

**Dimension 2: Type Safety**
- AccelerationComparison component props typed correctly
- Selected attempts state typed as Set<string>
- Delta calculations use correct types

**Dimension 3: Performance**
- Chart rendering remains smooth with multiple datasets
- Delta calculations don't block UI
- Memoization prevents unnecessary recalculations

**Dimension 4: Data Integrity**
- Selected attempts persist across tab switches
- Delta calculations always reference correct best attempt
- Filter state doesn't corrupt selection

**Dimension 5: Error Handling**
- Handle case where no attempts selected
- Handle case where all attempts have same time (no best)
- Handle case with fewer than 5 attempts for filtering

**Dimension 6: Accessibility**
- Checkboxes have proper labels
- Keyboard navigation for selection
- Screen reader announcements for selection changes

**Dimension 7: Internationalization**
- Comparison tab label in i18n
- Delta column labels in i18n
- Filter button labels in i18n

**Dimension 8: Validation**
- Delta metrics display with correct units
- Color coding follows established pattern
- Chart legend shows attempt numbers

## Conclusion

Phase 6 is a straightforward extension of existing acceleration infrastructure. The main work involves:
1. Adding selection mechanism to AccelerationTable
2. Creating AccelerationComparison component with chart and delta table
3. Integrating new tab into App.tsx

No new external dependencies required. Implementation should follow established patterns from Phases 3-5.

---

*Research complete: 2026-04-10*
