---
name: roster
description: Active-roster scan — who's currently taking lessons, where each one stands, any open actions. Run at session start and whenever Gil asks "where do we stand", "who's active", etc. Catches WhatsApp-only students the Aulas calendar misses.
---

# Roster

Enforces the rule in `feedback_calendar-is-not-the-roster`: never answer a roster question from the calendar alone.

## Prerequisite — sync local with origin

Run `git pull origin master` before anything else. Cron jobs (Gmail student check every 6h, daily roster check 7 AM ET, weekly slow-student sweep Mon 9 AM ET) write to origin while Gil is between sessions; the local clone is stale until pulled. Skipping this step caused a self-inflicted "cron is broken" misdiagnosis on 2026-05-14 — every subsequent diagnostic (grep, file mtimes) was reading frozen local state instead of current origin state. See `feedback_git-pull-before-state-checks`.

## 1. Grep the authoritative source

```
Grep pattern: 2026-MM-\d{2}  path: Students  glob: *.md  mode: files_with_matches
```

Run for the **current month and the prior month**. Every `Students/*.md` file with a hit in that window is an active student. This is the working roster — it is not negotiable, not filterable, not "probably active."

## 2. List calendar events for the same window

`list_events` on the Gilberto Aulas calendar (`fmn4i9pf5s3ile6hbl5d9rngeg@group.calendar.google.com`) for the current month + prior month.

## 3. Sweep Gmail for missed comms

Extract the email address from each active student's profile (`**Email:**` line). Run one combined Gmail search across all of them:

```
(from:<email1> OR to:<email1> OR from:<email2> OR to:<email2> ...) newer_than:7d
```

For each returned thread, identify the student (by sender or recipient address) and check whether the message is already captured in `Students/<Name>.md` (session/contact log) or `Students/<Name>-email-log.txt`. Any undocumented thread is a **missed comm** — flag it in the report under the student's open actions and offer to ingest.

**Snippet caveat.** `search_threads` returns at most ~5 message previews per thread, oldest-first — the latest reply on a long thread can be hidden. For any thread that bears on current state, follow up with `get_thread` `messageFormat: FULL_CONTENT` and check the newest message's `labelIds` (`UNREAD` matters). See `feedback_read-full-email-threads`.

This Gmail step is also a backstop for the standing "Gmail student check" cron (`newer_than:2d`, every 6h). A 7d sweep at session start catches anything the cron silently dropped (the cron has failed in the past without surfacing any signal). Belt-and-suspenders; one query, cheap.

## 4. Cross-reference

- **In calendar + in grep** → standard case. Proceed to Step 5.
- **In grep, not in calendar** → WhatsApp-only student (Amanda pattern). **Always open WhatsApp in Chrome and scan their thread for unread messages — no exceptions, even on fast headcounts.** The calendar is structurally blind to them; the local chat-log file is not auto-synced. Live WhatsApp Web is the only source of truth.
- **In calendar, not in grep** → either stale recurring event (e.g., Nick Curran's Zoom), non-student event, or the dog ("Katie"). Filter out before reporting.
- **Gmail thread without a file record** → undocumented comm. Flag as a missed-ingest action, attached to the student in the relevant Active or Leads bucket below.

## 5. Identify urgent items

**Non-skippable, even on fast headcounts.** Before composing the output, scan all gathered signals for items that demand top billing regardless of student status. See `feedback_roster-lead-with-urgent`.

What qualifies as urgent:

- **Expired or expiring-today prospect call windows.** A prospect offered a specific call slot (today, tomorrow morning, etc.) that has passed or passes today with no logged contact. Read the latest inbound message in every prospect's `*-email-log.txt` or profile.
- **Unread inbox emails** from any prospect or active student. The `UNREAD` label only shows via `get_thread` `messageFormat: FULL_CONTENT` — `search_threads` snippets won't show it and may also truncate to the 5 oldest messages, hiding the latest inbound entirely.
- **Confirmation gaps within 24–48h.** A Tentative session needing Gil to send a confirmation today or tomorrow.
- **Any flag the prior-day daily-roster cron raised that isn't resolved.** Read `daily-roster/YYYY-MM-DD.md` for yesterday (and the day before, if today is Monday). The cron's `Flags` section is a stronger prior than this skill's status-group ordering — if it flagged something yesterday and it hasn't been resolved, it stays urgent today.
- **Multi-message cascades in flight.** Any reschedule or coordination cascade (touching 2+ students or calendar events) that hasn't fully resolved. State the cascade ledger explicitly in the output: which messages are sent / gated / pending, which calendar updates are deferred, what reply unblocks what. See `/cascade` skill for the structural procedure and `feedback_multi-message-cascade-gating` for the rule.

Every urgent item identified here goes in the output's top section (Step 7), even if the student also appears in the per-status breakdown below.

## 6. Per-student deep-dive (optional but default)

For any student where Gil is likely to want current state — i.e., unless the question is strictly "list names" — run `/student <name>` on each active student. That handles thread read, WhatsApp check, last-lesson confirmation, and open actions.

If the question is a fast headcount, skip Step 6 and just report names — **but the WhatsApp scan in Step 4 for WhatsApp-only students is never skipped, the Gmail sweep in Step 3 is never skipped, and the urgent-items scan in Step 5 is never skipped.**

## 7. Output format

Lead with urgency, then group by status.

**Urgent — surface first (any group)**

Every item identified in Step 5. If Step 5 found nothing, write `(none today)` — never omit this section, since omission can't be distinguished from "didn't bother to scan."

- Item — what it is, what action it needs, deadline. Pulled directly from Step 5.

**Inbound-message rule.** Whenever an Urgent item is triggered by an actual message from a student or prospect (email, WhatsApp, SMS), quote the message in full — sender / timestamp / body — before any summary, task framing, or proposed action. Parallel to [[feedback_show-drafts-in-chat]] (which governs outbound drafts): the same surface-the-text discipline applies to inbound when it's load-bearing. Summarized one-liners ("Dexter replied: busy Thu, blocking Thu 5/28") force Gil to ask "what did she actually say?" — that nudge means the skill failed. Quote first, summarize/act second. If Gil's own reply has already been sent in response, quote that too (paired below the inbound), and note its sync status to local files.

**Active — next 7 days**
- Student — next session date/time/venue, open action (if any)

**Active — slow or due**
- Student — last session, why no next yet, suggested nudge

**Leads**
- Prospective student — current state, next action

**Cold / dormant**
- Student — last contact date, status (e.g., "postponed indefinitely")

## 8. Must-cite rule

Any roster answer must name all input sources explicitly and explicitly confirm the urgent-items scan was performed. Example footer: *"Grep surfaced: Christian, Marvin, Dexter, Amanda, Daniel-McNamara. Calendar window: Christian (recurring), Marvin (recurring), Dexter (4/21 ZACA). Gmail sweep (7d): no missed threads. Urgent scan (Step 5): 1 item — Ana call window expired 5/16, email UNREAD."* If a sweep found undocumented threads, list them in the footer too. If I can't write that footer, I haven't done the work — go back to Step 1.

## 9. Known WhatsApp-only students

- **Amanda Hynynen Pilnik** — Wed/Thu/Fri ad hoc, $60/90min, Toby's Estate / PlantShed / Café Kitsuné / Air Mail. Full chat at `Students/Amanda-whatsapp-chat.txt`.

## 10. Known non-students to filter

- **Katie** — Gil's dog. Vet/walk events. Never a student (per `user_katie-dog`).
- Kate-Macina and Katherine-Katie-Harrigan are real students but would have surnames on the calendar, not bare "Katie."
