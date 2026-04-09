---
phase: 6
slug: acceleration-comparison-mode
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-10
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Existing infrastructure (no new test framework) |
| **Config file** | none |
| **Quick run command** | `npm run dev` (manual verification) |
| **Full suite command** | `npm run build` (type checking) |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Manual verification in browser
- **After every plan wave:** Type checking with `npm run build`
- **Before `/gsd-verify-work`:** Build must succeed, manual verification complete
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 6-01-01 | 1 | 1 | REQ-047 | — | Selection state properly typed | manual | — | ✅ | ⬜ pending |
| 6-02-01 | 2 | 1 | REQ-047 | — | Checkbox toggles selection | manual | — | ✅ | ⬜ pending |
| 6-03-01 | 3 | 1 | REQ-048 | — | Chart renders selected attempts | manual | — | ✅ | ⬜ pending |
| 6-04-01 | 4 | 1 | REQ-049 | — | Delta metrics calculated correctly | manual | — | ✅ | ⬜ pending |
| 6-05-01 | 5 | 2 | REQ-050 | — | Filtering works by time | manual | — | ✅ | ⬜ pending |
| 6-06-01 | 6 | 2 | — | — | Tab integration functional | manual | — | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No new test framework needed.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Checkbox selection in table | REQ-047 | UI interaction requires manual testing | 1. Load CSV file with acceleration attempts 2. Navigate to Comparison tab 3. Check checkboxes in table 4. Verify selection state persists |
| Chart displays selected attempts | REQ-048 | Visual verification required | 1. Select 2-3 attempts in table 2. Verify chart shows only selected attempts 3. Verify colors are distinct |
| Delta metrics calculation | REQ-049 | Requires visual verification of calculations | 1. Select attempts 2. Verify delta table shows correct differences from best attempt 3. Verify best attempt has zero deltas |
| Filtering by time | REQ-050 | Requires manual testing of filter buttons | 1. Select multiple attempts 2. Click "Best 5" filter 3. Verify only fastest 5 attempts shown |

---

## Validation Sign-Off

- [ ] All tasks have manual verification
- [ ] Sampling continuity: manual verification after each task
- [ ] Wave 0 covers all requirements (existing infrastructure)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
