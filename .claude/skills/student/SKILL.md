---
name: student
description: Deep-dive on one student — read profile, read full email thread top-to-bottom, check WhatsApp, state last actual lesson and fate of every session scheduled since. Run before any answer about a specific student's status, schedule, or upcoming session.
argument-hint: "[student name]"
---

# Student

Enforces the rules in `feedback_read-full-email-threads` (rolling threads, top-to-bottom) and `feedback_calendar-is-not-the-roster` (authoritative source over convenient one). Composed by `/roster` for each active student.

## Prerequisite — sync local with origin

Run `git pull origin master` before reading the student file. The Gmail student check cron writes to origin every 6h and the daily-roster cron writes every morning; local state lags until pulled. Reading a stale profile produces stale answers. See `feedback_git-pull-before-state-checks`.

## 1. Read the student file

`Students/<Name>.md` in full — profile, session log, contact log, communications. Note:
- Email and WhatsApp number
- Default venue, rate, frequency
- Last 3 session log entries
- Any pending homework or open thread

## 2. Read the full email thread

Search Gmail for the most recent rolling thread:
```
from:<email> OR to:<email>  newer_than:60d
```

Open the thread in Chrome Gmail (or `get_thread` with `messageFormat: FULL_CONTENT`). **Read top-to-bottom** — never just the last 2-3 messages. Student threads with generic subjects ("Thursday", "Re: lesson") carry months of scheduling under one subject. The cancellation that explains today's gap might be 5 messages back.

Per `feedback_gmail-search-by-address`: search by `from:<email>` only. Never mix field operators with bare name keywords — it dilutes results.

## 3. Check WhatsApp

Open WhatsApp Web in Chrome (already a tab in most sessions). Find the student's chat. Read recent messages — at minimum back to the last confirmed lesson. For WhatsApp-only students (Amanda) this IS the schedule.

## 4. Mandatory check before answering

Before composing any "what's happening with X" answer, I must be able to state:

- **(a)** the date of the **last actual lesson** (not last scheduled — last that actually happened)
- **(b)** the fate of **every session scheduled since** (happened / cancelled / rescheduled / pending)

If I can't answer both from what I just read, I haven't read enough. Go back to Step 2.

## 5. Identify open actions

- Pending confirmation (Gil sent a proposed time, no reply yet)
- Pending send (worksheet drafted, not yet sent)
- Pending nudge (silence past expected cadence — e.g., Amanda 7+ days, Christian past Tuesday)
- Calendar mismatch (event location differs from confirmed venue — update per `feedback_auto-update-event-location`)

## 6. Update the student file

Per `feedback_ingest-communications`: every previously-unlogged message in the thread/chat gets a row in the contact log. Not just the messages relevant to the current question. If today's check uncovered a 4/14 cancellation that was never logged, log it now.

## 7. Output format

Concise summary, no preamble:

> **<Name>** — last lesson <date>; <fate of each subsequent scheduled session>. Next: <date/time/venue or "due — needs nudge">. Open actions: <list or "none">.

Example:
> **Amanda** — last lesson 2026-04-13 (Toby's Estate, 10:45 AM, confirmed via "Estou indo!"). Last contact 2026-04-15 (joke exchange). Next: due — no scheduling message this week. Open actions: send a nudge for this week.

## 8. Pre-draft re-anchor — composing outbound messages

**Mandatory whenever I'm about to draft any outbound message to this student** (Gmail, WhatsApp, anything they will read). Before composing the body, output in chat:

**Latest inbound from <Name> (verbatim):**
> Quote the student's most recent message exactly, with the sender timestamp. Don't paraphrase — the verbatim words are what anchor the natural reply.

**Facts on the table:**
- Specific dates / times / venues / asks the student offered or referenced (e.g., "today or tomorrow morning" → resolve to absolute dates: 2026-05-15 or morning of 2026-05-16)
- Current calendar state for this student (next event date/time/location, or "no event")
- Anything pending from the prior thread (homework due, worksheet drafted but unsent, etc.)

**Then compose.** Every temporal and contextual phrase in the draft body must derive from those facts — not from elsewhere in the session. If the draft says *"the weekend"* but the inbound said *"today or tomorrow morning,"* that phrase isn't anchored to this student's facts; rewrite using language derivable from the verbatim quote.

**Then show the draft as a block** (per `feedback_show-drafts-in-chat`) — To / Subject / Body inside a code fence — *before* any `create_draft` call or typing into WhatsApp.

This step is non-skippable, even for one-line replies. For short replies the block is compact, but the re-anchor still runs. The discipline catches frame transfer from cross-student session context (e.g., "weekend" phrasing bleeding from Marvin/Dexter profiles into an Ana draft on 2026-05-17). See `feedback_frame-capture` point 5.

## 9. Special-case students

- **Amanda** — schedules ad hoc on WhatsApp only. Don't expect calendar events. Default venues: Toby's Estate / PlantShed / Café Kitsuné / Air Mail.
- **Marvin** — recurring Tuesday. Pinned WhatsApp.
- **Christian** — recurring schedule. Pinned WhatsApp.
- **Dexter** — explicit one-offs on calendar (ZACA preferred venue).
