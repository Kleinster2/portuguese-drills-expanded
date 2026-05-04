---
name: drift-audit
description: Periodic content drift audit. Samples drills using a rotating cursor (oldest-audited first), runs /drill-review on each, writes a dated report to docs/audit-log/drift-YYYY-Www.md. Updates the cursor so the next run picks fresh drills. All 131 drills get audited within ~13 weeks at the default sample size.
argument-hint: "[optional: number of drills to sample, default 10]"
---

# Drift Audit

Periodic content audit on drills. Samples a rotating subset each run, audits each with `/drill-review`, produces a dated report. Designed for a weekly cron via the `/schedule` skill — also runnable manually any time.

Scope today is drills only (`config/prompts/*.json`). Worksheets and primers are out of scope for v1 — they're authored on demand and reviewed at creation time, so drift is a less acute concern. If that changes, extend the sample sources here.

**Mandatory precondition:** invoke the `pedagogy` skill via the Skill tool before any other step. `/drill-review` requires it, and we'll be invoking that skill once per sampled drill.

## Setup

Confirm:
- **Sample size**: argument value or default 10.
- **Today's date** (UTC for cron compatibility).
- **ISO week** in `YYYY-Www` format — used for the report filename and report header. PowerShell: `[System.Globalization.ISOWeek]::GetWeekOfYear((Get-Date).ToUniversalTime())`.

## 1. Read the cursor

Read `docs/audit-log/.cursor.json`. Schema:

```json
{
  "audited": {
    "<drill-slug>": "<YYYY-MM-DD>"
  }
}
```

If the file doesn't exist, treat as `{ "audited": {} }` — every drill is never-audited.

## 2. Pick the sample

List all drill JSONs in `config/prompts/`. For each, derive the slug from the filename (strip `.json`).

Sort by:
1. **Never-audited drills first** (no entry in cursor).
2. Then by **oldest audit date ascending**.

Take the first N (default 10).

This rotation guarantees no drill goes unaudited for more than `131 / N` weeks at the default sample size — about 13 weeks. New drills jump to the front (no entry); manually-audited drills rotate to the back as their cursor entries get refreshed.

## 3. Audit each sampled drill

For each drill in the sample:
1. Read the JSON file (`config/prompts/<slug>.json`).
2. Invoke `/drill-review` via the Skill tool, passing the file path.
3. Capture the punch-list output: pass/fail per item, quoted evidence for failures.

Don't inline the `/drill-review` checklist here — keep that skill as the single source of truth. If `/drill-review` adds or removes items, drift-audit gets the change for free.

## 4. Write the report

Compute filename: `docs/audit-log/drift-YYYY-Www.md` (e.g., `drift-2026-W18.md`).

If a file for this week already exists (re-run), append a new dated section; don't overwrite.

Report structure:

```markdown
# Drift Audit — Week YYYY-Www (Mon DD–DD)

**Run date:** YYYY-MM-DD
**Scope:** drills (N sampled out of <total>)
**Cursor state before:** <count> drills audited at least once / <count> never audited

## Sampled this week
- slug-1
- slug-2
- ...

## Findings

### slug-1
- ❌ Item N: <description>. Evidence: `"<quoted line>"`
- ⚠️ Item M: <description>.
- Other 21 checks pass.

[repeat per drill]

## Summary
- Clean (all pass): X
- Minor issues only (⚠️ but no ❌): Y
- Critical issues (≥1 ❌): Z

## Recurring patterns
Any check that failed on ≥3 drills this week:
- Item 19 (accent stripping): N/N drills affected
- ...

## Cursor state after
- Drills audited at least once: <new count> / <total>
- Never-audited drills remaining: <count>
- Estimated weeks until full corpus coverage: <weeks>
```

## 5. Update the cursor

For each drill in this week's sample, set `cursor.audited[slug]` to today's date (YYYY-MM-DD).

Write the cursor file back. The cursor lives in `docs/audit-log/.cursor.json` — tracked in git so audit history is preserved across machines.

## 6. Brief the operator

Output a 3–5 line summary at the top of the chat:

```
Drift audit Week YYYY-Www complete. N drills sampled.
- X clean, Y minor, Z critical.
- Recurring: <top recurring pattern, if any>.
- Full report: docs/audit-log/drift-YYYY-Www.md
```

This is what surfaces in the cron log and in the chat for manual runs. The full punch list lives in the file.

## Triggering

- **Manual:** invoke `/drift-audit` from any session.
- **Scheduled:** create a weekly cron via the `/schedule` skill. Recommended cadence: Sunday 6am ET, parallel to the daily roster routine. Confirm via `RemoteTrigger action=list` before creating to avoid duplicates.

## Lessons learned

(populated as audits surface recurring failure modes — these become inputs to the next round of skill or pedagogy improvements)
