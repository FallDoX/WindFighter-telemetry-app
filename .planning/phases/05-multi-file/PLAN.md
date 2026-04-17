---
phase: 05-multi-file
status: planned
created: 2026-04-17
---

# Phase 5: Multi-File Support

## Objective
Allow loading and comparing multiple CSV files simultaneously.

## Scope

**Multi-file features:**
- Multi-file upload UI
- File management (add/remove files)
- Data model for multiple datasets
- File comparison features

## Implementation Plans

### Plan 5.1: Add Multi-File Upload UI
**Description:** Add UI for uploading multiple CSV files.

**Files to modify:**
- src/App.tsx

**Actions:**
- Update file input to accept multiple files
- Add file list display
- Add remove file button
- Update drag-and-drop for multiple files

**Verification:**
- Multiple files can be selected
- File list displays correctly
- Files can be removed

---

### Plan 5.2: Update Data Model for Multiple Datasets
**Description:** Extend data model to support multiple files.

**Files to modify:**
- src/App.tsx
- src/types.ts

**Actions:**
- Add FileDataset interface
- Update state to hold multiple datasets
- Add active file selection
- Update data processing logic

**Verification:**
- Multiple datasets can be stored
- Active file can be selected
- Data processing works with multiple files

---

### Plan 5.3: Add File Switching UI
**Description:** Add UI to switch between loaded files.

**Files to modify:**
- src/App.tsx

**Actions:**
- Add file selector dropdown
- Add file tabs
- Update chart to show active file
- Update summary to show active file

**Verification:**
- File switching works
- Charts update correctly
- Summary updates correctly

---

### Plan 5.4: Add Side-by-Side Comparison
**Description:** Add feature to compare two files side by side.

**Files to modify:**
- src/App.tsx

**Actions:**
- Add comparison mode toggle
- Add second chart for comparison
- Sync time ranges between charts
- Add comparison summary

**Verification:**
- Comparison mode works
- Charts display side by side
- Time ranges sync correctly

---

### Plan 5.5: Test Multi-File Functionality
**Description:** Test all multi-file features.

**Files to test:**
- src/App.tsx

**Actions:**
- Test loading multiple files
- Test file switching
- Test comparison mode
- Test removing files

**Verification:**
- All features work correctly
- No performance issues
- No bugs

---

## Success Criteria

- Multiple files can be loaded
- Files can be switched between
- Comparison mode works
- Performance acceptable

## Estimated Duration

**Total:** 3-4 hours

## Dependencies

- Depends on: Phase 4 completion
- Blocked by: None

## Notes

Focus on making the multi-file experience intuitive. Use tabs or dropdown for file selection. Ensure performance doesn't degrade with multiple files.
