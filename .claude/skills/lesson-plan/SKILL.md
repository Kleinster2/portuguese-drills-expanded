---
name: lesson-plan
description: Plan the next lesson for a specific student based on their capability inventory and error patterns. Outputs a scoped brief that feeds into /worksheet-create.
argument-hint: "[student name]"
---

# Lesson Plan

Plan the next 90-minute lesson for a student. Reads their capability inventory, applies PEDAGOGY.md, outputs a scoped lesson brief.

**Prerequisites:**
- `/pedagogy` loaded
- Student file exists at `Students/[Name].md` with session log and capability inventory
- `/homework-review` already run if homework was assigned last time

## 1. Read current state

- `Students/[Name].md` — session log, capability inventory, error patterns, preferences, variant (BP/EP)
- Most recent worksheet (linked in session log per `feedback_link-worksheets-in-session-log`)
- WhatsApp / Gmail since last session
- Gilberto Aulas calendar — confirm next session is scheduled

## 2. Derive current capabilities

From the last lesson, write (or update) the capability inventory:
- **Can do:** specific communicative acts
- **Grammar tools:** specific forms taught
- **Pronunciation:** specific rules taught
- **Cannot do:** the gap that defines next lesson's scope

## 3. Propose scope

Apply PEDAGOGY Principle 11 (Economicity): one new conceptual step, not three. Propose:
- 1 target grammar concept OR 1 vocabulary topic
- 1 new pronunciation distinction if appropriate
- Specific capabilities this lesson unlocks

Cross-check with `docs/drills/[LEVEL]-curriculum-primer.md` for the student's level.

## 4. Factor in error patterns

If `/homework-review` surfaced recurring errors, prioritize reinforcement over new material. A student conflating de/do doesn't need imperfeito next — they need another contractions pass with tightened blanks.

## 5. Confirm with Gil

Present scope + expected duration (90 min) + rationale. **Do not** start drafting a worksheet until Gil confirms.

## 6. Handoff

On confirmation, hand scope to `/worksheet-create` with:
- Topic, CEFR level, variant
- Vocabulary already seen (so new material doesn't repeat and old material isn't re-taught)
- Error patterns to target
