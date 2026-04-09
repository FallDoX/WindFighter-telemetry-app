---
phase: 03
slug: acceleration-visualization
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification (no automated tests for UI phase) |
| **Config file** | none |
| **Quick run command** | npm run dev |
| **Full suite command** | npm run dev |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Manual visual verification in browser
- **After every plan wave:** Full manual verification of all features
- **Before `/gsd-verify-work`:** All features verified manually
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | REQ-047 | — | Mode toggle switches between telemetry and acceleration | manual | Open browser and verify | N/A | ⬜ pending |
| 03-01-02 | 01 | 1 | REQ-048 | — | Attempt buttons render correctly | manual | Open browser and verify | N/A | ⬜ pending |
| 03-01-03 | 01 | 1 | REQ-049 | — | Selected attempts display on chart | manual | Open browser and verify | N/A | ⬜ pending |
| 03-01-04 | 01 | 1 | REQ-051 | — | Attempt details show in floating panel | manual | Open browser and verify | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No automated tests needed for UI visualization phase.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Mode toggle switches chart mode | REQ-047 | UI interaction requires visual verification | 1. Load CSV with acceleration attempts 2. Click "Ускорение" button 3. Verify chart shows attempt buttons instead of metric toggles 4. Click again to switch back |
| Attempt buttons render with correct colors | REQ-048 | Visual color assignment requires manual check | 1. Switch to acceleration mode 2. Verify attempt buttons have distinct colors 3. Verify selected attempts have active state |
| Selected attempts display on chart | REQ-049 | Chart rendering requires visual verification | 1. Select multiple attempts 2. Verify curves display with correct colors 3. Verify non-selected attempts are dimmed |
| Attempt details show in floating panel | REQ-051 | Floating panel behavior requires manual check | 1. Hover over attempt button 2. Verify floating panel shows attempt metrics 3. Verify panel updates on different attempt hover |

---

## Validation Sign-Off

- [ ] All tasks have manual verification steps
- [ ] Sampling continuity: no 3 consecutive tasks without verification
- [ ] Wave 0 covers all MISSING references (N/A - manual verification)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
