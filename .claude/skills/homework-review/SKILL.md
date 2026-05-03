---
name: homework-review
description: Review a student's assigned homework — check submission, identify error patterns, feed findings into the next lesson plan.
argument-hint: "[student name]"
---

# Homework Review

Run before `/lesson-plan` to surface what went well, what went wrong, and what needs reinforcement.

## 1. Identify the assignment

Read `Students/[Name].md` session log for the most recent "homework" entry:
- Which worksheet
- Which sections (often Parts C-G, not the whole thing)
- When it was due — usually by the next scheduled session

If no homework was assigned last time, return "nothing to review" and suggest `/lesson-plan` directly.

## 2. Look for submission

Check in order:
- **WhatsApp** — photos of completed pages
- **Gmail** — attached files or inline answers (search both `from:` and `to:`)
- **In-class** — did the student bring the physical sheet?

If no submission and it's past due, flag to Gil to follow up gently — don't auto-send a reminder.

## 3. Grade (if submitted)

For each exercise:
- Correct / incorrect
- Identify **error patterns**, not just counts — e.g., "drops article on masculine countries", "consistently picks da where do is required"
- Classify each error: vocabulary gap (missing word) vs grammar gap (wrong rule applied) vs carelessness

Cross-reference against PEDAGOGY Principle 15 (vocabulary scaffolding) — was the vocabulary introduced before the exercise expected it?

## 4. Log findings

Update `Students/[Name].md`:
- What was submitted (date, sections)
- Completion rate + accuracy
- Error patterns (specific, not "made some mistakes")
- **What to reteach or reinforce** in the next lesson

## 5. Feed forward

Hand off to `/lesson-plan`:
- If error patterns cluster around a single concept → next lesson reinforces that concept, not a new topic
- If completion was clean → next lesson can advance to the planned next topic
- If the student didn't submit at all → raise before planning new material
