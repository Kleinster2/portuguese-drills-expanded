---
name: draft
description: Universal composition discipline for any outbound message Gil will send to any recipient — Gmail, WhatsApp, Messages, calendar invite descriptions, doc shares, any text someone other than Gil will read. Run before any create_draft / update_draft / message typing / event description. /student references this for student communications; direct invocation handles every other context.
argument-hint: "[recipient name or context, optional]"
---

# Draft

Universal composition discipline. Skill-agnostic to recipient — applies whether Gil is writing to a student, his lawyer, his brother, a vendor, a calendar invitee, or anyone else.

The discipline has four phases: **re-anchor → compose → whole-draft check → show paired with inbound**. Non-skippable, even for one-line replies. For short replies the blocks are compact, but every gate still runs.

## 1. Pre-draft re-anchor

Before composing the body, output in chat:

**Latest inbound from <Recipient> (verbatim):**

> Quote the recipient's most recent message exactly, with sender + timestamp. Don't paraphrase — the verbatim words are what anchor the natural reply. If the draft is a fresh outbound (no inbound to reply to), state that explicitly and skip the verbatim quote, but still list the trigger facts that prompted the message.

**Facts on the table:**
- Specific dates / times / venues / asks / commitments the recipient offered or referenced. Resolve relative dates to absolute (`"tomorrow morning"` → `morning of 2026-05-18`).
- Current state with this recipient (e.g., next calendar event, open commitments, pending obligations).
- Anything pending from prior threads (a decision owed, a delivery owed, a question unanswered).

## 2. Compose

Every temporal and contextual phrase in the draft body must derive from those facts — not from elsewhere in the session. If the draft says `"the weekend"` but the inbound said `"today or tomorrow morning,"` that phrase is inherited from another task in the session, not anchored to this recipient's facts; rewrite using language derivable from the verbatim quote.

Per `feedback_communication-and-drafting`: thin-and-true beats full-and-invented. If a sentence slot needs content Gil hasn't provided, ask — don't silently default to omit.

## 3. Whole-draft check (post-compose AND after every revision)

Output a structured check answering each question in chat. Non-skippable. Each question gets a one-line answer:

1. **Tone match — calibrate register from the moment, not from any default.** No baseline register exists for Gil; he modulates by context (`feedback_effusive-on-substance`: warm on real moments, terse only on cursory replies — don't read brevity in logistics exchanges as a universal default). Two comparisons: (a) does the draft reciprocate the inbound's register? — warm inbound (`"Hi Gil!!"`, thank-you, exclamations) deserves at least one warmth marker; (b) does it match Gil's own established register *with this specific recipient*, given the substance of the moment? Scan Gil's most recent 2–3 outbounds in the thread — if he's historically opened *"Great to hear from you"* or used "!" with this recipient, a flat `"Hi Ana."` is a register break. Never assume terse as a baseline. The inbound + recipient + substance of the moment determine the register.
2. **Acknowledgment of context.** If the inbound created an obligation owed back (missed window, slow reply, declined a specific offer, etc.), is that acknowledged? If a prior revision cut the acknowledgment, restore it.
3. **Substantive asks — registered or surfaced.** Did the inbound name a topic of substance (a trip, a goal, a problem, a deadline)? Either register it in the draft using Gil-derivable phrasing, OR surface the gap to Gil explicitly ("she named X — fold it in or save for the call?") so he can decide. Don't silently default to omit.
4. **Temporal anchors.** Every time-referent in the draft traces to the inbound's specific facts or to a fact Gil stated in this conversation — not to session-ambient phrasing inherited from another task.
5. **Cumulative integrity (revision-specific).** If this is a revision, has any earlier necessary content been silently dropped by the patch? A correction to one phrase shouldn't cut the apology, the warmth marker, or the substantive engagement that was correctly in the prior version.
6. **Recipient POV — joint implications.** Each clause can be locally true while the joint message implies something about the recipient they haven't signaled. *"I'm around anytime today. What time works for you?"* — both clauses derive from Gil's stated availability (true), but the joint frame asks the recipient to pick a time today when they've said nothing about today (false implication). If the joint message asks the recipient to act on an availability, preference, or commitment they haven't signaled, fix: ask them to signal first, or reframe as an open offer without binding their next action to my assumption.

If any check fails, fix and re-run — don't ship a failing draft expecting Gil to catch it.

## 4. Show paired with the inbound

Per `feedback_show-drafts-in-chat`: every draft displayed in chat must be paired with the message being replied to. Print:

- **The inbound being replied to** — sender, timestamp, subject if different from the draft's, body quoted. Goes *first*, above the draft block, so Gil can read what we're responding to and what we're sending side-by-side.
- **The draft ID** once created (for follow-up reference).
- **To / Recipients**
- **Subject or title**
- **The full body** inside a code fence.

For revisions, re-show paired even if the inbound was shown earlier in the session. Re-display moments ("show the draft") still require the pairing.

## 5. Send only on explicit command

Per CLAUDE.md hard rule and `feedback_send-email-via-chrome`: only `"send"` / `"send it"` / `"go ahead and send"` counts as approval to send. Revisions, "looks good," "perfect" — NOT approval. Default: DO NOT SEND.

## When to invoke

- **From `/student`:** Step 8 of `/student` delegates here for any outbound message to a student.
- **Direct invocation, standalone:** Drafting an email to anyone outside the student roster — accountant, lawyer, family, friends, vendors, contractors, business contacts, building staff, doctors, building co-op board.
- **WhatsApp / Messages / Signal / Telegram / Slack:** Same disciplines apply to any messaging surface. The "show-paired-with-inbound" rule and the no-`\n`-into-input rule from CLAUDE.md still apply at the keystroke level.
- **Calendar invite descriptions:** The description is content the invitee will read — treat it as a draft to them.
- **Document share with message:** The message body that accompanies a shared doc is itself a draft.

## Recipient-class hints

When recipient is a student: load context via `/student <name>` first. Facts on the table should include calendar state, pending pedagogy items (homework owed, worksheet drafted), and any standing register guidance (e.g., `feedback_marvin-ep-only`, `feedback_amanda-tobys-default`, `feedback_student-message-register`).

When recipient is non-student: facts on the table should still be specific (dates, times, asks, commitments). Tone register defaults to Gil's stated relationship with the recipient — terse with family logistics, full and warm on real moments (`feedback_effusive-on-substance`).

## Cross-references

- `feedback_show-drafts-in-chat` — paired-with-inbound rule, every display
- `feedback_frame-capture` (esp. point 5) — drafted-language temporal/contextual phrase bleed
- `feedback_patch-mode-myopia` — re-read whole after every revision
- `feedback_recipient-pov-check` — joint implications about recipient
- `feedback_send-email-via-chrome` — never send without explicit command
- `feedback_communication-and-drafting` — collaborative framing, thin-and-true surfaces gaps
- `feedback_count-days-from-anchor` — temporal phrasing from anchor date, not guess
