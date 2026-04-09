# Phase 2: Acceleration Configuration UI - Research

**Gathered:** 2026-04-09
**Status:** Complete

## Domain Analysis

Phase 2 adds UI for configuring acceleration detection thresholds. This builds on Phase 1's acceleration detection core by adding user controls for threshold configuration.

## Technical Approach

### Component Structure
Based on Phase 1 context and existing codebase patterns:
- Follow TripOverview component pattern (settings panel within tab)
- Glassmorphism styling with 8-point spacing (established pattern)
- Use shadcn UI components (Switch, Input, Button) for form elements
- State management via React hooks (useState, useCallback, useMemo)

### Integration Points
From CONTEXT.md decisions:
- Place configuration UI inside Acceleration tab
- Integrate with existing acceleration state in App.tsx (accelerationThreshold from Phase 1)
- Re-detection on blur from input fields
- Auto-correct invalid threshold pairs

### Performance Considerations
From Phase 1 research:
- Large CSV files (10,000+ data points) require efficient re-detection
- Debounce threshold changes to prevent excessive re-computation
- Memoize acceleration detection results (already implemented in Phase 1)

### State Management
From codebase conventions:
- Local component state with useState
- Props drilling for nested components (no Context API yet)
- Custom hooks opportunity (useAccelerationState could be extracted)

## Implementation Strategy

### Task Breakdown
Based on ROADMAP.md plans:
1. Create AccelerationConfig component (settings panel pattern)
2. Add threshold state to App.tsx (fromSpeed, toSpeed)
3. Implement threshold change handler with re-detection on blur
4. Add preset buttons (25, 60, 90, 100 km/h)
5. Add custom threshold input fields
6. Implement debounce for threshold changes
7. Add threshold validation (auto-correct from > to)
8. Add visual examples for threshold configuration

### Dependencies
- Phase 1: Acceleration detection core (detectAccelerations, AccelerationAttempt type)
- Existing components: TripOverview (pattern reference), shadcn UI components
- Existing state: accelerationThreshold, accelerationAttempts in App.tsx

## Risks and Mitigations

### Performance Risk
- **Risk:** Re-detection on every blur could be slow with large CSV files
- **Mitigation:** Debounce (300-500ms), memoization already in place from Phase 1

### State Complexity
- **Risk:** Adding more state to App.tsx (already ~2500 lines)
- **Mitigation:** Consider extracting to custom hook (useAccelerationState) in future phase

### Validation Edge Cases
- **Risk:** Invalid threshold pairs (from > to, negative values)
- **Mitigation:** Auto-correct inline per CONTEXT.md decision

## Validation Architecture

### Automated Verification
- Component renders without errors
- Threshold state updates correctly
- Re-detection triggers on blur
- Auto-correction swaps invalid pairs
- Preset buttons set correct values

### Manual Verification
- Load CSV file
- Change threshold via preset
- Change threshold via custom input
- Verify re-detection runs
- Verify table updates with new results

---

*Phase: 02-acceleration-configuration-ui*
*Research gathered: 2026-04-09*
