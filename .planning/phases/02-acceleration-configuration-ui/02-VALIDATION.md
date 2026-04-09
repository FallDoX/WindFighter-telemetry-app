---
phase: 2
slug: acceleration-configuration-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification (no test framework for UI components) |
| **Config file** | none |
| **Quick run command** | npm run dev (manual verification in browser) |
| **Full suite command** | Manual verification checklist |
| **Estimated runtime** | ~5 minutes |

---

## Sampling Rate

- **After every task commit:** Manual verification in browser
- **After every plan wave:** Full manual verification checklist
- **Before `/gsd-verify-work`:** All manual checks must pass
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | REQ-044 | — | Input validation prevents XSS | manual | Browser verification | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | REQ-045 | — | State updates are controlled | manual | Browser verification | ✅ | ⬜ pending |
| 02-01-03 | 01 | 1 | REQ-046 | — | Auto-correction prevents invalid state | manual | Browser verification | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements (React dev server for manual verification)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Threshold configuration UI renders | REQ-044 | UI component requires visual verification | Load app, navigate to Acceleration tab, verify configuration panel appears |
| Preset buttons set correct values | REQ-045 | UI interaction requires manual testing | Click preset buttons (25, 60, 90, 100 km/h), verify threshold state updates |
| Custom input fields accept values | REQ-045 | UI interaction requires manual testing | Enter custom threshold values, verify state updates |
| Re-detection triggers on blur | REQ-045 | Behavior verification requires manual testing | Change threshold, blur from field, verify acceleration table updates |
| Auto-correction swaps invalid pairs | REQ-046 | Edge case requires manual testing | Enter "from: 60, to: 30", verify auto-swaps to "from: 30, to: 60" |
| Debounce prevents excessive re-detection | Performance | Performance verification requires manual testing | Rapidly change threshold, verify re-detection doesn't run on every keystroke |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
