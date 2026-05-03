---
name: session-log
description: Log a completed lesson — student file, worksheet link, calendar event, and chat log updated in one pass. Run after every lesson.
argument-hint: "[student name]"
---

# Session Log

Consolidates scattered post-session bookkeeping into one step. Covers the rules in `feedback_link-worksheets-in-session-log`, `feedback_session-log-meta-context`, `feedback_auto-update-calendar`, `feedback_log-everything`, and `feedback_ingest-communications`.

## 1. Gather

Ask Gil (or infer from context):
- What was taught (concept, worksheet used)
- How it went — what landed, what stumbled
- Homework assigned (sections + due date)
- Planned next topic
- Any WhatsApp / email around the session

## 2. Update Students/[Name].md — session log

Append an entry:
- **Date** — absolute (e.g., 2026-04-12), never "today" (per `feedback_count-days-from-anchor`)
- **Topic** + **why this topic** (alternatives considered, error patterns targeted) — not just "did contractions"
- **Relative link** to worksheet used (`[Contractions Worksheet](../printables/contractions-worksheet-christian.html)`)
- **Homework assigned** — which sections, due by which date
- **Error patterns noticed** — concrete, e.g., "conflates de/do on masculine countries"
- **Planned next topic**

## 3. Update calendar (Gilberto Aulas)

- Session ran as scheduled → no change needed, but verify event exists
- Session ran over / changed venue → update the event
- Session was cancelled → **delete** the event entirely (per `feedback_delete-cancelled-events`), don't rename or grey out

## 4. Update chat log

If any WhatsApp / email happened around the session:
- Append to the chat log section in `Students/[Name].md`
- Search Gmail for **both `from:` and `to:` the student address** to catch Gil's replies (per `feedback_check-outbound-replies`)

## 5. Log even if it's nothing

Per `feedback_log-everything`: "sent worksheet, no reply yet" still gets logged. Every interaction, no exceptions.

## 6. Verify

Re-read the appended entry. Worksheet linked? Meta context present? Homework spelled out? Calendar matches reality? If all four — done.
