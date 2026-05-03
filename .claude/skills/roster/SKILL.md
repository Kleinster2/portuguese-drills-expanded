---
name: roster
description: Active-roster scan — who's currently taking lessons, where each one stands, any open actions. Run at session start and whenever Gil asks "where do we stand", "who's active", etc. Catches WhatsApp-only students the Aulas calendar misses.
---

# Roster

Enforces the rule in `feedback_calendar-is-not-the-roster`: never answer a roster question from the calendar alone.

## 1. Grep the authoritative source

```
Grep pattern: 2026-MM-\d{2}  path: Students  glob: *.md  mode: files_with_matches
```

Run for the **current month and the prior month**. Every `Students/*.md` file with a hit in that window is an active student. This is the working roster — it is not negotiable, not filterable, not "probably active."

## 2. List calendar events for the same window

`list_events` on the Gilberto Aulas calendar (`fmn4i9pf5s3ile6hbl5d9rngeg@group.calendar.google.com`) for the current month + prior month.

## 3. Cross-reference

- **In calendar + in grep** → standard case. Proceed to Step 4.
- **In grep, not in calendar** → WhatsApp-only student (Amanda pattern). **Always open WhatsApp in Chrome and scan their thread for unread messages — no exceptions, even on fast headcounts.** The calendar is structurally blind to them; the local chat-log file is not auto-synced. Live WhatsApp Web is the only source of truth.
- **In calendar, not in grep** → either stale recurring event (e.g., Nick Curran's Zoom), non-student event, or the dog ("Katie"). Filter out before reporting.

## 4. Per-student deep-dive (optional but default)

For any student where Gil is likely to want current state — i.e., unless the question is strictly "list names" — run `/student <name>` on each active student. That handles thread read, WhatsApp check, last-lesson confirmation, and open actions.

If the question is a fast headcount, skip Step 4 and just report names — **but the WhatsApp scan in Step 3 for WhatsApp-only students is never skipped.**

## 5. Output format

Group by status:

**Active — next 7 days**
- Student — next session date/time/venue, open action (if any)

**Active — slow or due**
- Student — last session, why no next yet, suggested nudge

**Leads**
- Prospective student — current state, next action

**Cold / dormant**
- Student — last contact date, status (e.g., "postponed indefinitely")

## 6. Must-cite rule

Any roster answer must name both sources explicitly. Example footer: *"Grep surfaced: Christian, Marvin, Dexter, Amanda, Daniel-McNamara. Calendar window shows: Christian (recurring), Marvin (recurring), Dexter (4/21 ZACA)."* If I can't write that footer, I haven't done the work — go back to Step 1.

## 7. Known WhatsApp-only students

- **Amanda Hynynen Pilnik** — Wed/Thu/Fri ad hoc, $60/90min, Toby's Estate / PlantShed / Café Kitsuné / Air Mail. Full chat at `Students/Amanda-whatsapp-chat.txt`.

## 8. Known non-students to filter

- **Katie** — Gil's dog. Vet/walk events. Never a student (per `user_katie-dog`).
- Kate-Macina and Katherine-Katie-Harrigan are real students but would have surnames on the calendar, not bare "Katie."
