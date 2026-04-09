# Phase 7: Advanced Metrics - Context

**Gathered:** 2026-04-10
**Status:** Ready for planning
**Source:** assumptions mode (--auto)

<domain>
## Phase Boundary

Add advanced power analysis and battery impact metrics to acceleration attempts. The phase builds on existing power/battery/temperature calculations in AccelerationAttempt to provide deeper insights through visualization, derived metrics, filtering, and thresholding.

</domain>

<decisions>
## Implementation Decisions

### Power Analysis
- **D-01:** Build on existing power calculations (averagePower, peakPower) already in AccelerationAttempt
- **D-02:** Add power curve visualization as toggleable overlay on acceleration charts
- **D-03:** Add power efficiency metrics (power per speed unit, power consistency score)
- **D-04:** Add power distribution analysis (percentage of time in power bands)

### Battery Impact Analysis
- **D-05:** Add battery drop rate metrics (% per second, % per km)
- **D-06:** Add energy consumption per km (Wh/km) for each attempt
- **D-07:** Add battery efficiency comparison across attempts

### Temperature Impact Analysis
- **D-08:** Add temperature correlation with power output analysis
- **D-09:** Add temperature efficiency curves (how temperature affects performance)
- **D-10:** Add temperature warnings for high-temp attempts

### Power Curve Visualization
- **D-11:** Add power curves as toggleable overlay on AccelerationComparison charts
- **D-12:** Use dual-axis chart (speed on left, power on right) or separate power chart option

### Metrics Filtering/Sorting
- **D-13:** Add sorting to AccelerationTable for power efficiency, battery efficiency, temperature
- **D-14:** Add filtering by power thresholds (e.g., show only attempts > 2000W peak)
- **D-15:** Add filtering by temperature ranges

### Metrics Thresholds
- **D-16:** Implement preset thresholds for high power (> 2500W) and high temperature (> 45°C)
- **D-17:** Add user-configurable thresholds in AccelerationConfig (similar to speed threshold pattern from Phase 5)
- **D-18:** Add visual warnings for attempts exceeding thresholds (highlighting or badges)

### Claude's Discretion
- Exact threshold values for power/temperature warnings
- Whether to use dual-axis or separate chart for power curves
- Specific power efficiency calculation formulas
- UI placement for threshold configuration (in AccelerationConfig or separate panel)
- Sorting/filtering UI pattern (dropdowns, sliders, or other controls)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Context
- `.planning/phases/01-acceleration-detection-core/01-CONTEXT.md` — Acceleration detection algorithm and AccelerationAttempt structure
- `.planning/phases/02-acceleration-configuration-ui/02-CONTEXT.md` — AccelerationConfig component pattern
- `.planning/phases/05-multiple-threshold-pairs/05-CONTEXT.md` — Threshold configuration UI pattern
- `.planning/phases/06-acceleration-comparison-mode/06-CONTEXT.md` — AccelerationComparison component and chart visualization

### Codebase
- `src/utils/acceleration.ts` — Existing power/battery/temperature calculations in detectAccelerations (lines 59-77)
- `src/types.ts` — AccelerationAttempt interface with existing power/battery/temperature fields (lines 74-91)
- `src/components/AccelerationTable.tsx` — Table component with column selector (lines 84-119)
- `src/components/AccelerationComparison.tsx` — Chart visualization with Chart.js (lines 68-161)
- `src/components/AccelerationConfig.tsx` — Threshold configuration UI pattern for reference
- `src/hooks/useAccelerationState.ts` — State management for acceleration data

### Requirements
- `.planning/REQUIREMENTS.md` — REQ-049 (acceleration attempt statistics)

No external specs — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Power calculations:** Already implemented in detectAccelerations (averagePower, peakPower from lines 59-77 of acceleration.ts)
- **Battery calculations:** Battery drop already calculated (line 76 of acceleration.ts)
- **Temperature tracking:** Average temperature already calculated (line 77 of acceleration.ts)
- **Chart infrastructure:** Chart.js with dual-axis support available in AccelerationComparison
- **Table infrastructure:** AccelerationTable with column selector pattern (lines 84-119)
- **Threshold configuration:** AccelerationConfig with list UI pattern from Phase 5

### Established Patterns
- **Metric calculation:** Calculate metrics during detection attempt, store in AccelerationAttempt
- **Visualization overlay:** Toggleable chart overlays in AccelerationComparison (speed curves)
- **Column selection:** Checkbox-based column selector in AccelerationTable
- **Threshold configuration:** List UI with add/remove buttons for threshold pairs
- **Glassmorphism styling:** Consistent glassmorphism pattern across components

### Integration Points
- **AccelerationAttempt type:** Add new fields for advanced metrics (power efficiency, battery drop rate, etc.)
- **detectAccelerations function:** Add calculation logic for new metrics
- **AccelerationComparison component:** Add power curve toggle and visualization
- **AccelerationTable component:** Add sorting/filtering controls
- **AccelerationConfig component:** Add metrics threshold configuration section

</code_context>

<specifics>
## Specific Ideas

- Power curve toggle button in AccelerationComparison (next to existing filter buttons)
- Dual-axis chart: speed on left Y-axis, power on right Y-axis
- Power efficiency = peakPower / (endSpeed - startSpeed) or similar formula
- Battery drop rate = batteryDrop / time (percentage per second)
- Energy per km = (averagePower * time) / distance (Wh/km)
- Threshold warnings: red badge or highlight for attempts exceeding thresholds
- Sorting controls: dropdown in AccelerationTable header or separate filter panel
- Threshold config: new section in AccelerationConfig with preset buttons and custom inputs

</specifics>

<deferred>
## Deferred Ideas

None — analysis stayed within phase scope.

</deferred>

---

*Phase: 07-advanced-metrics*
*Context gathered: 2026-04-10 via assumptions mode (--auto)*
