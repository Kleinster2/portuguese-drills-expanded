---
name: worksheet-create
description: Create a new Portuguese language worksheet. Use when building exercises, drills, or assessment materials for students.
argument-hint: "[description of worksheet: topic, student, level, focus areas]"
disable-model-invocation: true
---

# Worksheet Create

Step-by-step process for generating a student-facing worksheet. Follow in order.

## 1. Inputs

Before writing anything, confirm:
- **Student**: who is this for? Read their file in `Students/`.
- **Topic**: what grammar/vocabulary is being practiced?
- **Level**: CEFR level (A1, A2, B1, B2)?
- **Variant**: BP or EP? This determines imperative forms, vocabulary, and clitic rules.
- **Context**: why this topic now? What did the student just finish? What errors have they been making?
- **Matching drills**: check `config/prompts/` for existing drills on the same topic. Read them — they contain curated vocabulary, example sentences, error cases, and BP/EP distinctions that the worksheet should stay consistent with. Don't contradict what the drill teaches.

## 2. Load pedagogy and best practices

Run `/pedagogy` to load PEDAGOGY.md. All content decisions must follow it.

Also review [DRILL_BEST_PRACTICES.md](docs/drills/DRILL_BEST_PRACTICES.md) — these principles apply to printed worksheets too:
- **Grammatical Isolation**: each blank tests ONE concept. Don't require the student to get two things right to fill one blank.
- **Real-World Contexts**: sentences should be things a real person would say, not textbook artifacts.
- **Approved vocabulary**: use high-frequency, centrality-tested words. Check the student's level and known vocabulary.
- **First Question Rule**: start each section with the easiest example to build confidence.

If the worksheet includes a dialogue, follow **Principle 19 (Dialogue as Synthesis Exercise)**: determine the lesson's target capabilities first, build teaching sections and exercises, then write the dialogue last as the culminating exercise. The dialogue must only use vocabulary and structures already taught in the lesson. Use `/dialogue-generate` for dialogue creation after the teaching sections are finalized.

## 3. Scaffold exercises

Run `/exercise-scaffold` with the topic, level, and variant from Step 1. This produces:
- Concept inventory with teaching plans
- Answer inventory with selection-before-production ordering
- Variant confirmation
- Name choices

Do not skip this step. Structural problems from missing scaffolding are the hardest to fix later.

## 4. Draft exercises

Run `/exercise-draft` with the scaffold output from Step 3. This handles:
- Writing exercises with blank integrity, proper noun research, English hints, vocabulary check
- Deduplication across sections
- Answer key construction and verification

## 5. Verify exercises

Run `/exercise-verify` on the drafted exercises. This handles:
- Searching each sentence against real-world .com.br/.pt sources
- Verifying grammar/phonetic claims in teaching boxes
- Self-audit for truth

Do not skip this step. It catches constructions that are grammatically valid but unnatural.

## 6. Layout

Apply `/worksheet-layout` rules (CSS, print margins, page breaks, answer key formatting).

## 7. Teacher notes (optional)

If the worksheet targets a specific student's error patterns, add teacher notes on a separate page with `page-break-before: always`. Include:
- Why this topic, why now
- Language interference analysis (if relevant)
- Session plan: what to cover in class vs homework
- What to watch for

## 8. Review

Run `/worksheet-review` against the finished worksheet before printing or sending.
