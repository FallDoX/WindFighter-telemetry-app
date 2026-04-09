---
phase: 04
plan: 1
type: execute
wave: 1
depends_on: []
files_modified: [src/hooks/useAccelerationState.ts, src/App.tsx, src/components/AccelerationTab.tsx, src/components/TripOverview.tsx]
autonomous: true
requirements: []
user_setup: []

must_haves:
  truths:
    - useAccelerationState hook created in src/hooks/useAccelerationState.ts
    - Hook accepts data: TripEntry[] parameter
    - Hook returns object with attempts, threshold, setThreshold, showIncomplete, setShowIncomplete, selectedColumns, setSelectedColumns, clearSettings
    - accelerationThreshold and selectedColumns persisted to localStorage
    - localStorage keys: acceleration_threshold, acceleration_selected_columns
    - clearSettings function removes acceleration_threshold and acceleration_selected_columns from localStorage
    - Acceleration state removed from App.tsx
    - App.tsx uses useAccelerationState hook
    - AccelerationTab uses hook via props from App.tsx
    - Memoization of detectAccelerations inside hook
    - Button to clear settings added to TripOverview or AccelerationTab
  artifacts:
    - src/hooks/useAccelerationState.ts exists and exports useAccelerationState
    - src/App.tsx imports and uses useAccelerationState
    - src/App.tsx no longer has acceleration state declarations
    - localStorage contains acceleration_threshold and acceleration_selected_columns after changes
  key_links:
    - useAccelerationState follows pattern from useChartState
    - detectAccelerations memoized with same dependencies as before [data, threshold]
    - localStorage error handling with try-catch
    - Set<string> serialized as Array<string> for JSON
---

<objective>
Extract acceleration state from App.tsx to custom useAccelerationState hook with localStorage persistence

Purpose: Improve code organization by extracting acceleration state management into a reusable hook
Output: useAccelerationState hook, updated App.tsx, localStorage integration, clear settings button
</objective>

<execution_context>
@$HOME/.codeium/windsurf/get-shit-done/workflows/execute-plan.md
@$HOME/.codeium/windsurf/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/04-acceleration-state-refactoring/04-CONTEXT.md
@.planning/phases/04-acceleration-state-refactoring/04-RESEARCH.md
@.planning/phases/01-acceleration-detection-core/01-CONTEXT.md
@.planning/phases/02-acceleration-configuration-ui/02-CONTEXT.md
@.planning/phases/03-acceleration-visualization/03-CONTEXT.md
@src/App.tsx
@src/components/AccelerationTab.tsx
@src/hooks/useChartState.ts
@src/utils/acceleration.ts
@src/types.ts
</context>

<tasks>
<task>
<read_first>
- src/App.tsx (lines 173-176 for current acceleration state, lines 701-703 for memoization, line 718 for setAccelerationAttempts)
- src/hooks/useChartState.ts (for hook pattern reference)
- src/components/AccelerationTab.tsx (for component integration)
- src/utils/acceleration.ts (for detectAccelerations function)
- src/types.ts (for AccelerationAttempt type)
</read_first>
<action>
Create src/hooks/useAccelerationState.ts with the following structure:

1. Import useState, useMemo, useEffect from React
2. Import detectAccelerations from ../utils/acceleration
3. Import type AccelerationAttempt from ../types

4. Define useAccelerationState function that accepts data: TripEntry[] parameter

5. Initialize accelerationThreshold with lazy initialization:
   - Try to read 'acceleration_threshold' from localStorage
   - Parse as number, default to 60 if error or missing
   - Use try-catch for localStorage access

6. Initialize selectedColumns with lazy initialization:
   - Try to read 'acceleration_selected_columns' from localStorage
   - Parse as JSON, convert to Set<string>, default to ['time', 'distance', 'averagePower', 'peakPower', 'batteryDrop'] if error or missing
   - Use try-catch for localStorage access

7. Initialize showIncomplete as false (not persisted)

8. Create accelerationAttemptsMemoized with useMemo:
   - Call detectAccelerations(data, accelerationThreshold)
   - Dependencies: [data, accelerationThreshold]

9. Create useEffect to persist accelerationThreshold to localStorage:
   - JSON.stringify(accelerationThreshold) to 'acceleration_threshold'
   - Use try-catch for localStorage access
   - Dependency: [accelerationThreshold]

10. Create useEffect to persist selectedColumns to localStorage:
    - Convert Set to Array with Array.from(selectedColumns)
    - JSON.stringify to 'acceleration_selected_columns'
    - Use try-catch for localStorage access
    - Dependency: [selectedColumns]

11. Create clearSettings function:
    - Remove 'acceleration_threshold' from localStorage
    - Remove 'acceleration_selected_columns' from localStorage
    - Use try-catch for each removal
    - Return true if successful, false if error

12. Return object with:
    - accelerationAttempts: accelerationAttemptsMemoized
    - accelerationThreshold
    - setAccelerationThreshold
    - showIncomplete
    - setShowIncomplete
    - selectedColumns
    - setSelectedColumns
    - clearSettings

13. Export useAccelerationState as default export
</action>
<acceptance_criteria>
- src/hooks/useAccelerationState.ts exists
- File contains export function useAccelerationState(data: TripEntry[])
- Function returns object with accelerationAttempts, accelerationThreshold, setAccelerationThreshold, showIncomplete, setShowIncomplete, selectedColumns, setSelectedColumns, clearSettings
- accelerationThreshold initialized from localStorage with try-catch
- selectedColumns initialized from localStorage with try-catch
- useEffect persists accelerationThreshold to localStorage
- useEffect persists selectedColumns to localStorage
- clearSettings function removes both localStorage keys
- detectAccelerations memoized with useMemo
</acceptance_criteria>
</task>

<task>
<read_first>
- src/App.tsx (current acceleration state at lines 173-176, memoization at 701-703, setAccelerationAttempts at 718)
- src/hooks/useAccelerationState.ts (newly created hook)
</read_first>
<action>
Update src/App.tsx to use useAccelerationState hook:

1. Add import: import useAccelerationState from './hooks/useAccelerationState'

2. Remove acceleration state declarations (lines 173-176):
   - Remove: const [accelerationAttempts, setAccelerationAttempts] = useState<AccelerationAttempt[]>([]);
   - Remove: const [showIncomplete, setShowIncomplete] = useState<boolean>(false);
   - Remove: const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(['time', 'distance', 'averagePower', 'peakPower', 'batteryDrop']));
   - Remove: const [accelerationThreshold, setAccelerationThreshold] = useState<number>(60);

3. Remove accelerationAttemptsMemoized (lines 701-703)

4. Call useAccelerationState hook after data state:
   - const { accelerationAttempts, accelerationThreshold, setAccelerationThreshold, showIncomplete, setShowIncomplete, selectedColumns, setSelectedColumns, clearSettings } = useAccelerationState(data);

5. Remove setAccelerationAttempts(accelerationAttemptsMemoized) from handleFile (line 718) - hook handles this internally

6. Pass clearSettings to TripOverview or AccelerationTab as prop (to be added in next task)
</action>
<acceptance_criteria>
- src/App.tsx imports useAccelerationState
- src/App.tsx no longer has acceleration state declarations
- src/App.tsx calls useAccelerationState(data)
- src/App.tsx destructures all returned values from hook
- setAccelerationAttempts removed from handleFile
- accelerationAttemptsMemoized removed
- TypeScript compiles without errors
</acceptance_criteria>
</task>

<task>
<read_first>
- src/components/TripOverview.tsx (for button placement)
- src/components/AccelerationTab.tsx (for clearSettings prop)
- src/App.tsx (to pass clearSettings prop)
</read_first>
<action>
Add clear settings button:

1. Choose location for button (TripOverview or AccelerationTab) based on CONTEXT.md decision

2. If TripOverview:
   - Add clearSettings prop to TripOverview component interface
   - Add button in TripOverview with label "Очистить настройки" or "Сбросить настройки"
   - Call clearSettings() on button click
   - Add visual feedback (toast or confirmation)

3. If AccelerationTab:
   - Add clearSettings prop to AccelerationTab component interface
   - Add button in AccelerationTab with label "Очистить настройки" or "Сбросить настройки"
   - Call clearSettings() on button click
   - Add visual feedback (toast or confirmation)

4. Update App.tsx to pass clearSettings prop to chosen component
</action>
<acceptance_criteria>
- Button to clear settings exists in chosen component
- Button labeled "Очистить настройки" or "Сбросить настройки"
- Button calls clearSettings() on click
- Visual feedback shown after click (toast or confirmation)
- App.tsx passes clearSettings prop to component
- TypeScript compiles without errors
</acceptance_criteria>
</task>

<task>
<read_first>
- src/App.tsx
- src/components/AccelerationTab.tsx
- src/hooks/useAccelerationState.ts
</read_first>
<action>
Verify integration and test localStorage:

1. Load a CSV file in the application
2. Change acceleration threshold
3. Reload page
4. Verify threshold persisted (should match previous value)
5. Change selected columns in acceleration table
6. Reload page
7. Verify selected columns persisted
8. Click clear settings button
9. Verify threshold reset to 60
10. Verify selected columns reset to defaults
11. Verify localStorage keys removed
</action>
<acceptance_criteria>
- Threshold changes persist after page reload
- Selected columns changes persist after page reload
- Clear settings button resets threshold to 60
- Clear settings button resets selected columns to defaults
- localStorage contains acceleration_threshold after changes
- localStorage contains acceleration_selected_columns after changes
- localStorage keys removed after clear settings
</acceptance_criteria>
</task>
</tasks>

<verification>
- Acceleration state successfully extracted to useAccelerationState hook
- Hook follows pattern from useChartState
- localStorage integration works correctly
- Memoization maintained inside hook
- App.tsx reduced in complexity
- Components work correctly with new hook
- Clear settings button functional
- No TypeScript errors
- No runtime errors in console
</verification>
