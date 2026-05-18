---
name: cascade
description: Plan, gate, and execute a multi-message coordination cascade across 2+ students and/or calendar events. Use whenever a single decision (new-student onboarding, travel consolidation, conflict resolution, multi-student cancellation) requires coordinated changes whose order depends on each recipient's reply. Each individual message still goes through `/draft`; `/cascade` handles the orchestration above `/draft`.
argument-hint: "[short trigger description, optional]"
---

# Cascade

Multi-message coordination orchestration. Use whenever a single logistics decision touches 2+ students or calendar events and the order of asks depends on which replies come back.

Per-message composition is still `/draft`'s job. `/cascade` handles what `/draft` doesn't: inter-message dependencies, in-flight state, and end-of-cascade cleanup.

## 1. Identify the cascade

Before drafting any message, output in chat:

- **Trigger.** What created the need — new student onboarding, travel consolidation, conflict, Gil unavailable, etc.
- **Current state.** All existing bookings touched (calendar events, profile next-session lines, WhatsApp confirmations).
- **Desired end state.** Specifically what should be true after the cascade resolves.
- **Affected parties.** Every student touched, every calendar event touched, every Gmail/WhatsApp thread.

## 2. Map the dependency graph

For each message in the cascade, name:

- **Preconditions** — what must be true before this message can be drafted (e.g., *"Dexter confirms Thursday"*).
- **Postconditions** — what becomes possible after this message resolves.
- **Failure branch** — what changes if the recipient declines or counter-proposes outside the plan's expected range.

Output the graph explicitly in chat. Example:

```
Trigger: Ana onboarded Thu 5/21 early-afternoon Carroll Gardens
Desired end: Brooklyn-only Thursday for Gil; Amanda moved off Thu 4 PM Toby's

Message 1 — Dexter: ask to move from Tue 5/19 → Thu 5/21 evening at ZACA
  - Preconditions: none (independent)
  - On YES: enables Message 2; calendar Tue 5/19 ZACA → move to Thu 5/21
  - On NO: cascade collapses; Amanda stays Thu 4 PM; Ana logistics need re-check

Message 2 — Amanda: ask to move from Thu 5/21 4 PM Toby's to Wed/Fri/Thu AM
  - Preconditions: Dexter confirms YES on Message 1
  - On YES: calendar Thu 5/21 4 PM Toby's → new slot
  - On NO: Amanda stays Thu 4 PM; cascade partially complete

Calendar / profile updates (deferred until all relevant replies in):
  - Dexter Tue 5/19 6:30 PM ZACA → Thu 5/21 [time] (when Dexter confirms)
  - Amanda Thu 5/21 4 PM Toby's → [new slot] (when Amanda confirms)
  - Add Ana Thu 5/21 [time] Carroll Gardens (when Ana proposes venue+time)
```

After the graph, **validate physical feasibility** — for each consecutive pair of sessions in the desired end state, run `/logistics` to verify travel feasibility. If any pair returns *Tight*, flag it; if any returns *Infeasible*, the plan needs revision before drafting any messages.

The cascade plan is a hypothesis about Gil's schedule; `/logistics` is the physical-reality check on that hypothesis. Run it before drafting any messages — otherwise an infeasible cascade gets messages sent on its behalf before reality intervenes. If venue/time specifics aren't known yet (e.g., a new student hasn't proposed a venue), run with best-guess proxies, flag the assumptions, and re-run when specifics land.

## 3. Draft only messages whose preconditions are met

Hard rule: do not draft a message whose preconditions are unmet. Surface the gate to Gil instead.

For each unblocked message:
- Invoke `/draft <recipient>` — runs the per-message discipline (re-anchor → compose → 6-question whole-draft check → show paired with inbound).
- After Gil approves and sends, mark the message in-flight.

For each gated message:
- State explicitly in chat: *"Drafting [recipient] now would be premature — gated on [precondition]. Will draft when [signal] arrives."*

This is the same family as `/draft` check #6 (recipient POV — don't act on signals you haven't received), lifted from intra-message to inter-message.

## 4. Track in-flight state — show the ledger

After each cascade event (message sent, reply received, calendar moved), output the ledger in chat:

| Message / action | Recipient or target | Status | Awaiting | Resolves when |
|---|---|---|---|---|
| Msg 1 | Dexter | Sent (draft `r-...`) | Email reply | She picks a Thursday slot or counter-proposes |
| Msg 2 | Amanda | Gated | Dexter's reply | After Msg 1 resolves YES |
| Calendar move 1 | Dexter Tue 5/19 ZACA | Deferred | Dexter's reply | After Msg 1 resolves YES |
| Calendar add | Ana Thu 5/21 | Deferred | Ana's venue+time proposal | After Ana replies with specifics |

Re-show the ledger every time state changes.

## 5. Re-evaluate after each reply

When a reply lands:
- Update the ledger.
- For any newly-unblocked message: invoke `/draft`.
- For any cascade-collapsing reply (recipient declines a key move): reassess the plan and propose an alternative cascade structure to Gil before drafting anything new.

Don't auto-fire downstream messages without re-showing the updated plan. Give Gil the chance to redirect — the cascade plan was a hypothesis, the reply is data.

## 6. Cleanup at end

When all replies are in and the cascade is resolved, state explicitly *"Cascade closed"* and perform:

- Calendar events deleted, moved, or created as planned.
- Each affected student's profile updated: `Next session`, status line, contact log, session log.
- Obsolete Gmail drafts noted for Gil's manual cleanup (cross-MCP delete fails as of 2026-05).
- WhatsApp threads needing ack-back or follow-up flagged.
- A summary line: *"Cascade [trigger] closed. End state: [final config]."*

## When to invoke

- **New-student onboarding** that conflicts with or abuts existing students' slots.
- **Travel consolidation** — moving 2+ students to the same neighborhood or day to compress Gil's travel.
- **Conflict resolution** — two existing students need to shuffle around a third.
- **Multi-student cancellation** — Gil sick / traveling / unavailable; notify all affected.
- Anytime a single decision requires coordinated changes across 2+ students whose reschedules depend on each other.

Skip `/cascade` if the change is purely single-student (reschedule X to Y); use `/draft <student>` directly.

## Cross-references

- `/draft` — per-message composition discipline; invoked for each individual cascade message.
- `/logistics` — travel-feasibility check between consecutive sessions; run before locking a cascade plan that abuts two venues.
- `/student` — per-student deep-dive; sanity-check the cascade against a student's current state.
- `/roster` — surfaces in-flight cascades during session-start triage (the cascade ledger lives in Step 5 Urgent items).
- `feedback_recipient-pov-check` — joint-implication discipline at the per-message level; cascade gating is the same rule one level up.
- `feedback_patch-mode-myopia` — re-evaluate whole after revisions; applies at both the message level (after edits) and the cascade level (after each reply).
- `feedback_multi-message-cascade-gating` — conceptual record of the cascade discipline.
