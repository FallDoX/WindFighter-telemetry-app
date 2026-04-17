---
phase: 01-acceleration-detection-core
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/types.ts, src/utils/acceleration.ts, src/utils/parser.ts, src/components/AccelerationTable.tsx, src/components/AccelerationTab.tsx, src/App.tsx]
autonomous: true
requirements: [REQ-040, REQ-041, REQ-042, REQ-043]
user_setup: []

must_haves:
  truths:
    - AccelerationAttempt type defined with all required fields
    - detectAccelerations function correctly identifies acceleration attempts from Speed field
    - Detection uses hardware wheel speed, not GPS
    - Incomplete attempts marked with isComplete flag
    - Data gaps > 500ms filtered out
    - Minimum duration filter prevents false positives
    - Default threshold preset (0-60 km/h) implemented
    - Acceleration table displays in separate tab
    - Edge cases handled (incomplete attempts, data gaps)
  artifacts:
    - src/types.ts contains AccelerationAttempt interface
    - src/utils/acceleration.ts contains detectAccelerations function
    - src/utils/parser.ts integrates detectAccelerations into CSV parser flow
    - src/components/AccelerationTable.tsx displays acceleration attempts
    - src/components/AccelerationTab.tsx wraps table with toggle controls
    - src/App.tsx adds AccelerationTab to tab system with default threshold
  key_links:
    - detectAccelerations uses Speed field from TripEntry
    - AccelerationAttempt includes all metrics (time, distance, power, current, voltage, battery, temperature)
    - AccelerationTable shows user-selectable columns
    - Incomplete attempts hidden by default, toggle to show
---

<objective>
Implement basic acceleration detection algorithm and display results in table format

Purpose: Add acceleration analysis capability to detect and display acceleration attempts from trip data
Output: Complete acceleration detection system with table visualization
</objective>

<execution_context>
@$HOME/.codeium/windsurf/get-shit-done/workflows/execute-plan.md
@$HOME/.codeium/windsurf/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-acceleration-detection-core/01-CONTEXT.md
@.planning/phases/01-acceleration-detection-core/01-RESEARCH.md
@.planning/phases/01-acceleration-detection-core/01-VALIDATION.md
@src/types.ts
@src/utils/parser.ts
@src/App.tsx
@src/components/TripOverview.tsx
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Add AccelerationAttempt type definition</name>
  <files>src/types.ts</files>
  <read_first>src/types.ts</read_first>
  <behavior>
    - Test 1: AccelerationAttempt interface exists with id, startTimestamp, endTimestamp, startSpeed, endSpeed, targetSpeed, time, distance, averagePower, peakPower, averageCurrent, averageVoltage, batteryDrop, averageTemperature, isComplete fields
    - Test 2: All fields have correct types (string, number, boolean)
    - Test 3: Interface is exported correctly
  </behavior>
  <action>Add AccelerationAttempt interface to src/types.ts with the following structure:
- id: string (unique identifier)
- startTimestamp: number
- endTimestamp: number
- startSpeed: number (km/h)
- endSpeed: number (km/h)
- targetSpeed: number (km/h)
- time: number (seconds)
- distance: number (meters)
- averagePower: number (watts)
- peakPower: number (watts)
- averageCurrent: number (amps)
- averageVoltage: number (volts)
- batteryDrop: number (percentage)
- averageTemperature: number (celsius)
- isComplete: boolean

Per CONTEXT.md decision: Use hardware wheel speed (Speed field) not GPS speed for detection.</action>
  <verify>
    <automated>grep -q "export interface AccelerationAttempt" src/types.ts && grep -q "isComplete: boolean" src/types.ts</automated>
  </verify>
  <done>AccelerationAttempt interface exists in src/types.ts with all required fields and correct types</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Implement acceleration detection algorithm</name>
  <files>src/utils/acceleration.ts</files>
  <read_first>src/types.ts</read_first>
  <behavior>
    - Test 1: detectAccelerations function exists and exports correctly
    - Test 2: Function accepts TripEntry[] and targetSpeed parameters
    - Test 3: Function returns AccelerationAttempt[]
    - Test 4: Threshold crossing detection works correctly
    - Test 5: Incomplete attempts marked with isComplete: false
    - Test 6: Data gaps > 500ms filtered out
    - Test 7: Metrics calculated correctly (time, distance, power, etc.)
  </behavior>
  <action>Create src/utils/acceleration.ts with detectAccelerations function that:
- Accepts TripEntry[] data and targetSpeed (number in km/h)
- Iterates through TripEntry[] using Speed field (hardware wheel speed per CONTEXT.md)
- Detects when speed crosses from below targetSpeed to above targetSpeed
- Tracks start point (speed first crosses targetSpeed) and end point (speed reaches targetSpeed)
- Calculates metrics:
  - Time: endTimestamp - startTimestamp (convert to seconds)
  - Distance: integrate speed over time using trapezoidal method (convert km/h to m/s)
  - Average power: mean(Power) during acceleration
  - Peak power: max(Power) during acceleration
  - Average current: mean(Current) during acceleration
  - Average voltage: mean(Voltage) during acceleration
  - Battery drop: BatteryLevel at end - BatteryLevel at start
  - Average temperature: mean(Temperature) during acceleration
- Marks isComplete: false if targetSpeed not reached
- Filters out attempts with gaps > 500ms between consecutive points
- Returns AccelerationAttempt[]

Per CONTEXT.md decision: Detect on raw data to preserve peak values (no downsampling).
Per CONTEXT.md decision: Ignore incomplete attempts (only show full accelerations where target speed reached).</action>
  <verify>
    <automated>grep -q "export function detectAccelerations" src/utils/acceleration.ts && grep -q "gap.*500" src/utils/acceleration.ts</automated>
  </verify>
  <done>detectAccelerations function correctly identifies acceleration attempts from Speed field with proper filtering and metric calculation</done>
</task>

<task type="auto" tdd="true">
  <name>Task 3: Add acceleration detection to CSV parser flow</name>
  <files>src/utils/parser.ts</files>
  <read_first>src/utils/parser.ts, src/utils/acceleration.ts</read_first>
  <behavior>
    - Test 1: parseTripData function imports detectAccelerations
    - Test 2: detectAccelerations called after TripEntry[] parsing
    - Test 3: AccelerationAttempt[] returned alongside TripSummary
    - Test 4: Default threshold (60 km/h) used for detection
  </behavior>
  <action>Modify src/utils/parser.ts to:
- Import detectAccelerations from src/utils/acceleration.ts
- Call detectAccelerations(parsedData, 60) after parseTripData returns TripEntry[]
- Add accelerationAttempts to return type (extend TripSummary or return separate object)
- Ensure detection runs on raw data before any downsampling

Per RESEARCH.md integration point: Call detectAccelerations after parseTripData() returns TripEntry[]</action>
  <verify>
    <automated>grep -q "detectAccelerations" src/utils/parser.ts && grep -q "acceleration" src/utils/parser.ts</automated>
  </verify>
  <done>Acceleration detection integrated into CSV parser flow with default 60 km/h threshold</done>
</task>

<task type="auto" tdd="true">
  <name>Task 4: Create AccelerationTable component</name>
  <files>src/components/AccelerationTable.tsx</files>
  <read_first>src/types.ts, src/components/TripOverview.tsx</read_first>
  <behavior>
    - Test 1: AccelerationTable component exists and exports correctly
    - Test 2: Component accepts accelerationAttempts prop (AccelerationAttempt[])
    - Test 3: Table renders with columns for key metrics (time, distance, power, battery drop)
    - Test 4: Incomplete attempts displayed in gray/muted color
    - Test 5: Component uses glassmorphism styling (backdrop-blur, gradients)
  </behavior>
  <action>Create src/components/AccelerationTable.tsx component that:
- Accepts accelerationAttempts: AccelerationAttempt[] prop
- Renders table with columns: Time, Distance, Avg Power, Peak Power, Battery Drop (default per CONTEXT.md)
- Uses glassmorphism styling matching TripOverview patterns
- Displays incomplete attempts in gray/muted color (isComplete: false)
- Shows all metrics available in AccelerationAttempt
- Uses React.memo for performance

Per CONTEXT.md decision: User-selectable columns via settings (add in future phase, show defaults now)</action>
  <verify>
    <automated>grep -q "export.*AccelerationTable" src/components/AccelerationTable.tsx && grep -q "glassmorphism\|backdrop" src/components/AccelerationTable.tsx</automated>
  </verify>
  <done>AccelerationTable component displays acceleration attempts with proper styling and incomplete attempt highlighting</done>
</task>

<task type="auto" tdd="true">
  <name>Task 5: Integrate acceleration table into dashboard</name>
  <files>src/components/AccelerationTab.tsx, src/App.tsx</files>
  <read_first>src/App.tsx, src/components/AccelerationTable.tsx</read_first>
  <behavior>
    - Test 1: AccelerationTab component exists and wraps AccelerationTable
    - Test 2: AccelerationTab added to App.tsx tab system
    - Test 3: Tab appears alongside existing chart tabs
    - Test 4: accelerationAttempts state passed to AccelerationTab
  </behavior>
  <action>Create src/components/AccelerationTab.tsx that:
- Wraps AccelerationTable component
- Accepts accelerationAttempts prop from App.tsx
- Uses glassmorphism styling for tab container
- Integrates with existing tab navigation pattern

Modify src/App.tsx to:
- Add accelerationAttempts state (initialized from parser)
- Add AccelerationTab to tab system alongside existing chart tabs
- Pass accelerationAttempts to AccelerationTab
- Add tab navigation for "Acceleration" view

Per CONTEXT.md decision: Separate tab "Acceleration" alongside existing chart views</action>
  <verify>
    <automated>grep -q "AccelerationTab" src/App.tsx && grep -q "accelerationAttempts" src/App.tsx</automated>
  </verify>
  <done>Acceleration table integrated into dashboard as separate tab with proper state management</done>
</task>

<task type="auto" tdd="true">
  <name>Task 6: Add default threshold preset (0-60 km/h)</name>
  <files>src/App.tsx</files>
  <read_first>src/App.tsx</read_first>
  <behavior>
    - Test 1: accelerationThreshold state initialized to 60
    - Test 2: Threshold used in detectAccelerations call
    - Test 3: Default preset applied on app load
  </behavior>
  <action>Modify src/App.tsx to:
- Add accelerationThreshold state (default: 60)
- Pass threshold to detectAccelerations in parser flow
- Store threshold in localStorage for persistence
- Apply default 0-60 km/h preset on initial load

Per CONTEXT.md decision: Default threshold preset: 0-60 km/h</action>
  <verify>
    <automated>grep -q "accelerationThreshold" src/App.tsx && grep -q "60" src/App.tsx</automated>
  </verify>
  <done>Default threshold preset (0-60 km/h) implemented with localStorage persistence</done>
</task>

<task type="auto" tdd="true">
  <name>Task 7: Implement minimum duration filter</name>
  <files>src/utils/acceleration.ts</files>
  <read_first>src/utils/acceleration.ts</read_first>
  <behavior>
    - Test 1: Minimum duration filter implemented (2 seconds per RESEARCH.md)
    - Test 2: Attempts shorter than 2 seconds filtered out
    - Test 3: Filter prevents false positives from noise
  </behavior>
  <action>Modify src/utils/acceleration.ts detectAccelerations to:
- Add minimum duration filter (2 seconds)
- Filter out acceleration attempts with time < 2 seconds
- Apply filter after metric calculation
- Return only attempts meeting minimum duration

Per RESEARCH.md: Minimum duration filter value (research suggests 2 seconds, but adjust based on testing)</action>
  <verify>
    <automated>grep -q "duration\|2.*second" src/utils/acceleration.ts</automated>
  </verify>
  <done>Minimum duration filter (2 seconds) prevents false positives from noise</done>
</task>

<task type="auto" tdd="true">
  <name>Task 8: Handle edge cases (incomplete attempts, data gaps)</name>
  <files>src/components/AccelerationTable.tsx, src/utils/acceleration.ts</files>
  <read_first>src/components/AccelerationTable.tsx, src/utils/acceleration.ts</read_first>
  <behavior>
    - Test 1: Incomplete attempts (target speed not reached) marked with isComplete: false
    - Test 2: Data gaps > 500ms filtered out
    - Test 3: Empty state displays when no acceleration attempts found
    - Test 4: Toggle to show/hide incomplete attempts (default hidden)
  </behavior>
  <action>Modify src/utils/acceleration.ts to:
- Ensure isComplete flag set correctly for incomplete attempts
- Verify data gap filtering (> 500ms) working

Modify src/components/AccelerationTable.tsx to:
- Add showIncomplete state (default: false)
- Add toggle button to show/hide incomplete attempts
- Display incomplete attempts in gray/muted color when toggle enabled
- Show empty state when no acceleration attempts found
- Filter attempts based on showIncomplete state

Per CONTEXT.md decision: Show incomplete attempts in different color with toggle to show/hide, default hidden</action>
  <verify>
    <automated>grep -q "showIncomplete\|incomplete" src/components/AccelerationTable.tsx && grep -q "isComplete" src/utils/acceleration.ts</automated>
  </verify>
  <done>Edge cases handled: incomplete attempts marked, data gaps filtered, toggle for incomplete attempts, empty state displayed</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| CSV Input | User-provided CSV files parsed client-side - no server trust boundary |
| Browser Storage | All data remains in browser memory - no persistence trust boundary |

## Input Validation

- Speed field validation: Ensure Speed is finite number >= 0
- Timestamp validation: Ensure timestamps are monotonically increasing
- Data gap filtering: Filter gaps > 500ms to prevent false positives
- Minimum duration filter: Filter attempts < 2 seconds to prevent noise

## Output Sanitization

- All metric calculations use validated numeric inputs
- No user-controlled data in error messages
- No HTML/JS injection vectors in table display

## Security Considerations

- No external API calls or data transmission
- No code execution from CSV data
- No authentication required (client-side only)
</threat_model>
