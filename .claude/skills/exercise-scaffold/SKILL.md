---
name: exercise-scaffold
description: Plan the scaffolding for worksheet exercises before any writing begins. Builds concept inventory, answer inventory, section plan, exercise count, variant check, and name selection. Run before /exercise-draft.
argument-hint: "[topic, level, variant (BP/EP), target grammar/vocabulary]"
disable-model-invocation: true
---

# Exercise Scaffold

Plan the structure of exercises before writing any. This step prevents structural problems that are hard to fix later — missing concept explanations, unscaffolded answers, aimless section structure, worksheets that are too long or too short.

**Prerequisites:** PEDAGOGY.md must be loaded (run `/pedagogy` first). Student file and matching drills from `config/prompts/` should already be reviewed.

---

## 1. Concept inventory

List every grammar concept the exercises will test. For each one, plan a grammar/usage box that **explains** it — not just lists it in a reference table. A table cell is not teaching.

If an exercise requires understanding a distinction (e.g., direct vs indirect object), that distinction must be explicitly taught in a grammar box before the exercise that tests it.

**Output:** A numbered list of concepts, each with a one-line description of how it will be taught.

## 2. Answer inventory

List every unique correct answer the exercises will require. Plan the exercise order so that each answer is first **selected** (from choices) before being **produced** (in open exercises).

If Section C requires producing "lhe", Section A must have an exercise where "lhe" is the correct choice. An answer appearing only as a distractor doesn't count as scaffolding.

**Output:** A list of every unique answer, with the section where it's first selected and the section where it's first produced.

## 3. Section plan

Organize the practice into sections. If a topic-specific drafting skill exists (e.g., `/exercise-draft-contractions`), check it for structural guidance on how to organize sections for this topic.

For each section, specify:
- **Organizing principle:** What groups exercises into this section? (by sub-topic, by difficulty, by exercise format)
- **Exercise type:** Multiple choice, fill-in-the-blank, error correction, translation, sentence transformation, free production
- **Target exercise count:** Derived from the answer inventory — each unique answer needs at least one selection exercise and one production exercise

**Progression order:**
1. Isolated practice (one concept per section, selection exercises — multiple choice, matching)
2. Guided production (fill-in-the-blank, sentence completion — still one concept)
3. Applied contexts (real-world scenarios that naturally require the target forms)
4. Mixed practice (combines concepts from earlier sections)
5. Free production or dialogue (if applicable — always last, per Principle 19)

**Exercise count — propose, then confirm with Gil:**
- Derive the minimum from the answer inventory: (unique answers) x 2 (one selection + one production each)
- Add mixed practice exercises: ~25% of the subtotal
- Note the split: in-class vs homework. A reasonable in-class pace is ~1-2 exercises per minute for fill-in-the-blank, slower for translation and production.
- Present the proposed count per section and total. Gil sets the final target based on the student's pace, session plan, and how much is classwork vs homework.

**Output:** A numbered list of sections with exercise type, target count, and which concepts/answers each section covers.

## 4. Variant check

- **BP worksheets**: all instructions use voce-form imperatives (Complete, Escolha, Substitua, Reescreva, Preencha). All vocabulary is BP (celular not telemovel, onibus not autocarro).
- **EP worksheets**: all instructions use tu-form imperatives (Completa, Escolhe, Substitui, Reescreve, Preenche). All vocabulary is EP.

Scan the concept inventory, answer inventory, and section plan for any variant contamination. Flag and fix before drafting begins.

## 5. Names

Use generic Portuguese names (Maria, Pedro, Ana, Joao) in exercises. Do not use the student's name, spouse, or personal details. Dialogue speakers with character names are fine.

Pick names now so they're consistent across all exercises.

---

## Output

The scaffold is complete when you have:
1. A concept list with teaching plans for each
2. An answer list with selection-before-production ordering
3. A section plan with exercise types, target counts, and progression
4. Variant confirmed clean
5. Names chosen

Pass all five to `/exercise-draft`.

---

## Lessons learned

- Amanda's clitic worksheet had "lhe" in a reference table but never explained direct vs indirect objects, and never made "lhe" a correct answer before Section C required producing it. The concept inventory (Step 1) would have caught the missing explanation; the answer inventory (Step 2) would have caught the missing scaffolding.
- Christian's contractions worksheet grew to 100 exercises with no target count driving the structure. A section plan with targets (Step 3) would have set a ceiling and flagged the imbalance — 20 mixed-practice exercises vs 12 in smaller sections.
