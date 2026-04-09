# Requirements - Trip Log Analyzer

**Last updated:** 2026-04-09

## v1 Requirements (Validated)

### Core Functionality

- [REQ-001] User can upload CSV file via drag-and-drop - existing
- [REQ-002] User can upload CSV file via file picker - existing
- [REQ-003] System automatically detects CSV format (old/new) - existing
- [REQ-004] System parses CSV data into TripEntry array - existing
- [REQ-005] System calculates trip statistics (max speed, distance, peak power, battery drop, etc.) - existing
- [REQ-006] System handles parse errors gracefully - existing

### Visualization

- [REQ-007] System displays speed profile chart (Speed vs GPS Speed) - existing
- [REQ-008] System displays power and current chart - existing
- [REQ-009] System displays voltage and battery level chart - existing
- [REQ-010] System displays temperature chart - existing
- [REQ-011] Charts use Chart.js library - existing
- [REQ-012] Charts are responsive and maintain aspect ratio - existing
- [REQ-013] Vertical cursor plugin shows hover position - existing

### Interaction

- [REQ-014] User can filter data by time range via slider - existing
- [REQ-015] User can toggle chart visibility for each metric - existing
- [REQ-016] User can zoom in/out on charts - existing
- [REQ-017] User can drag floating data panel - existing
- [REQ-018] System downsamples data for performance (default 2000 points) - existing
- [REQ-019] System throttles chart hover events for performance - existing

### Export

- [REQ-020] User can export screenshot as PNG - existing
- [REQ-021] Screenshot includes entire dashboard - existing
- [REQ-022] Screenshot uses high resolution (1.5x scale) - existing

### Internationalization

- [REQ-023] System supports English language - existing
- [REQ-024] System supports Russian language - existing
- [REQ-025] System auto-detects browser language - existing
- [REQ-026] User can manually switch language - existing

### Demo Data

- [REQ-027] System provides demo-trip.csv for testing - existing
- [REQ-028] System provides demo-trip-small.csv for testing - existing
- [REQ-029] System provides demo-trip-6hours.csv for testing - existing

### Architecture

- [REQ-030] Application is single-page app (SPA) - existing
- [REQ-031] All data processing is client-side (no server) - existing
- [REQ-032] Application uses React 19 - existing
- [REQ-033] Application uses TypeScript - existing
- [REQ-034] Application uses Vite for build - existing
- [REQ-035] Application uses Tailwind CSS for styling - existing
- [REQ-036] Application has component-based architecture - existing
- [REQ-037] Application uses custom hooks for logic separation - existing

## v2 Requirements (Active)

### Acceleration Analysis

- [REQ-040] System detects acceleration attempts from CSV data - new
- [REQ-041] System identifies speed thresholds for acceleration analysis - new
- [REQ-042] System calculates acceleration time between speed points - new
- [REQ-043] System displays top acceleration attempts - new
- [REQ-044] User can configure custom speed thresholds - new
- [REQ-045] User can set "from speed" threshold - new
- [REQ-046] User can set "to speed" threshold - new

### Acceleration Comparison

- [REQ-047] System compares multiple acceleration attempts - new
- [REQ-048] System displays acceleration comparison chart - new
- [REQ-049] System shows acceleration attempt statistics (time, distance, power) - new
- [REQ-050] User can filter acceleration attempts by criteria - new

### Acceleration Visualization

- [REQ-051] System displays acceleration attempt charts - new
- [REQ-052] System displays acceleration attempt table - new
- [REQ-053] System highlights best acceleration attempts - new
- [REQ-054] System shows acceleration attempt details on hover - new

## Out of Scope

- [OUT-001] Server-side data processing - privacy constraint
- [OUT-002] User accounts and authentication - privacy constraint
- [OUT-003] Data persistence (localStorage/database) - out of scope for v1
- [OUT-004] Real-time data streaming - static CSV analysis only
- [OUT-005] Mobile app version - web-only application
- [OUT-006] Backend API - client-side only

## Traceability

| Requirement ID | Phase | Status |
|----------------|-------|--------|
| REQ-001 to REQ-037 | Existing | Validated |
| REQ-040 to REQ-054 | Future | Active |

---

*Last updated: 2026-04-09*
