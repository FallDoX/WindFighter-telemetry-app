---
phase: 02-acceleration-configuration-ui
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/components/AccelerationConfig.tsx, src/App.tsx]
autonomous: true
requirements: [REQ-044, REQ-045, REQ-046]
user_setup: []

must_haves:
  truths:
    - AccelerationConfig component renders in Acceleration tab
    - Preset buttons (25, 60, 90, 100 km/h) set correct threshold values
    - Custom input fields accept user threshold values
    - Re-detection triggers on blur from input fields
    - Auto-correction swaps invalid threshold pairs (from > to)
    - Debounce prevents excessive re-detection
  artifacts:
    - src/components/AccelerationConfig.tsx exists
    - src/App.tsx includes AccelerationConfig component
    - Threshold state managed in App.tsx
    - Threshold change handler implemented
  key_links:
    - Per CONTEXT.md: Configuration UI inside Acceleration tab
    - Per CONTEXT.md: Presets next to input fields
    - Per CONTEXT.md: Re-detection on blur
    - Per CONTEXT.md: Auto-correct invalid pairs
---

<objective>
Create AccelerationConfig component and integrate threshold configuration UI into Acceleration tab

Purpose: Add user interface for custom threshold configuration with preset buttons and custom input fields
Output: Working threshold configuration that triggers re-detection on blur with auto-correction
</objective>

<execution_context>
@$HOME/.codeium/windsurf/get-shit-done/workflows/execute-plan.md
@$HOME/.codeium/windsurf/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/02-acceleration-configuration-ui/02-CONTEXT.md
@.planning/phases/02-acceleration-configuration-ui/02-RESEARCH.md
@.planning/phases/01-acceleration-detection-core/01-CONTEXT.md
@src/App.tsx
@src/components/TripOverview.tsx
@src/components/AccelerationTable.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Create AccelerationConfig component</name>
  <files>src/components/AccelerationConfig.tsx</files>
  <read_first>src/components/TripOverview.tsx</read_first>
  <action>Create src/components/AccelerationConfig.tsx component with:
    - Props: fromSpeed (number), toSpeed (number), onFromSpeedChange (function), onToSpeedChange (function), onPresetSelect (function)
    - Preset buttons: 25, 60, 90, 100 km/h (as per CONTEXT.md)
    - Custom input fields for fromSpeed and toSpeed
    - Glassmorphism styling matching TripOverview pattern (bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-6)
    - 8-point spacing (gap-2, p-6)
    - Use shadcn Input components for number fields
    - Use shadcn Button components for presets
    - Preset buttons placed next to input fields (as per CONTEXT.md)
    - Use memo() for performance optimization
    - Export as default component

    This component follows the TripOverview settings panel pattern established in Phase 1.</action>
  <verify>
    <automated>grep -q "export.*AccelerationConfig" src/components/AccelerationConfig.tsx && grep -q "memo" src/components/AccelerationConfig.tsx</automated>
  </verify>
  <done>AccelerationConfig component created with preset buttons and custom input fields</done>
</task>

<task type="auto">
  <name>Task 2: Add threshold state to App.tsx</name>
  <files>src/App.tsx</files>
  <read_first>src/App.tsx</read_first>
  <action>In src/App.tsx:
    - Import AccelerationConfig component
    - Add fromSpeed state with useState (default: 0)
    - Add toSpeed state with useState (default: 60)
    - Add onFromSpeedChange handler function
    - Add onToSpeedChange handler function
    - Add onPresetSelect handler function that sets both fromSpeed and toSpeed
    - These handlers should use useCallback for performance
    - Update accelerationThreshold state to use fromSpeed and toSpeed values
    - Follow existing state management patterns in App.tsx</action>
  <verify>
    <automated>grep -q "fromSpeed" src/App.tsx && grep -q "toSpeed" src/App.tsx && grep -q "onFromSpeedChange" src/App.tsx && grep -q "onToSpeedChange" src/App.tsx</automated>
  </verify>
  <done>Threshold state added to App.tsx with change handlers</done>
</task>

<task type="auto">
  <name>Task 3: Implement threshold change handler with re-detection on blur</name>
  <files>src/App.tsx</files>
  <read_first>src/App.tsx</read_first>
  <action>In src/App.tsx:
    - Modify onFromSpeedChange and onToSpeedChange handlers to trigger re-detection on blur
    - Add onBlur handler to input fields (passed from AccelerationConfig)
    - When blur occurs, call detectAccelerations with updated threshold values
    - Update accelerationAttempts state with new results
    - Use existing accelerationAttemptsMemoized pattern from Phase 1
    - Ensure re-detection uses current data and updated threshold values
    - Follow existing memoization pattern to prevent unnecessary re-computation</action>
  <verify>
    <automated>grep -q "onBlur" src/App.tsx && grep -q "detectAccelerations" src/App.tsx</automated>
  </verify>
  <done>Re-detection triggers on blur from input fields</done>
</task>

<task type="auto">
  <name>Task 4: Implement debounce for threshold changes</name>
  <files>src/App.tsx</files>
  <read_first>src/App.tsx</read_first>
  <action>In src/App.tsx:
    - Import throttle utility from src/utils/performance (already exists)
    - Add debounce logic for threshold change handlers
    - Debounce duration: 300-500ms (as per RESEARCH.md)
    - Apply debounce to onFromSpeedChange and onToSpeedChange
    - Ensure debounced handlers still trigger re-detection on blur
    - Use useCallback to memoize debounced handlers
    - Follow existing performance patterns in App.tsx (throttle for chart hover events)</action>
  <verify>
    <automated>grep -q "throttle" src/App.tsx && grep -q "useCallback" src/App.tsx</automated>
  </verify>
  <done>Debounce implemented for threshold changes to prevent excessive re-detection</done>
</task>

<task type="auto">
  <name>Task 5: Add threshold validation with auto-correction</name>
  <files>src/components/AccelerationConfig.tsx</files>
  <read_first>src/components/AccelerationConfig.tsx</read_first>
  <action>In src/components/AccelerationConfig.tsx:
    - Add validation logic in onFromSpeedChange and onToSpeedChange handlers
    - If fromSpeed > toSpeed, auto-swap values (as per CONTEXT.md decision)
    - If values are negative, auto-correct to 0
    - Apply validation immediately on change (no error messages, auto-correct inline)
    - Ensure auto-correction updates both state and input field values
    - Follow CONTEXT.md decision: auto-correct invalid pairs inline</action>
  <verify>
    <automated>grep -q "auto-swap\|auto-correct\|swap" src/components/AccelerationConfig.tsx</automated>
  </verify>
  <done>Auto-correction implemented for invalid threshold pairs</done>
</task>

<task type="auto">
  <name>Task 6: Integrate AccelerationConfig into Acceleration tab</name>
  <files>src/App.tsx</files>
  <read_first>src/App.tsx</read_first>
  <action>In src/App.tsx:
    - Import AccelerationConfig component
    - Add AccelerationConfig to Acceleration tab (TabsContent value="acceleration")
    - Place AccelerationConfig above AccelerationTable in the tab
    - Pass fromSpeed, toSpeed, onFromSpeedChange, onToSpeedChange, onPresetSelect props
    - Follow existing tab styling patterns (glassmorphism, consistent with other tabs)
    - Ensure component renders correctly within TabsContent structure
    - Per CONTEXT.md: configuration UI inside Acceleration tab</action>
  <verify>
    <automated>grep -q "AccelerationConfig" src/App.tsx && grep -q "fromSpeed" src/App.tsx && grep -q "toSpeed" src/App.tsx</automated>
  </verify>
  <done>AccelerationConfig integrated into Acceleration tab with proper state wiring</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Component Props | Props passed from parent component - no external trust boundary |
| User Input | Threshold values from user input - validate and auto-correct |
| State Management | React state - no persistence trust boundary |

## Input Validation

- fromSpeed: Validate number type, auto-correct negative values to 0
- toSpeed: Validate number type, auto-correct negative values to 0
- Threshold pair: Auto-swap if fromSpeed > toSpeed

## Output Sanitization

- All props validated before passing to child components
- No user-controlled HTML in component rendering
- Auto-correction ensures state remains valid

## Security Considerations

- No external API calls
- No code execution from props
- Component is presentational only
- Input validation prevents invalid state
</threat_model>
