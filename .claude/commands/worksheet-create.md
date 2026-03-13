# Worksheet Create

Step-by-step process for generating a student-facing worksheet. Follow in order.

## 1. Inputs

Before writing anything, confirm:
- **Student**: who is this for? Read their file in `Students/`.
- **Topic**: what grammar/vocabulary is being practiced?
- **Level**: CEFR level (A1, A2, B1, B2)?
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

## 3. Draft exercises

For each exercise:

### 3a. Blank integrity (fill-in-the-blank exercises)
Every blank must **require** its target answer. Before finalizing each sentence, ask:
- Could a native speaker naturally produce this sentence WITHOUT the target form?
- Generic vs specific: "gostar de café" (generic, no article) vs "gostar do café daquela padaria" (specific, article required). If the English hint is generic, the blank doesn't force a contraction.
- If the answer is "yes, a native could skip it," rewrite the sentence to force the target.

### 3b. Proper nouns — search before using
For any place name (city, neighborhood, venue, country):
- **Search Brazilian sources (.com.br)** for actual usage with prepositions before deciding whether it takes an article.
- Never rely on prescriptive rules alone. "no [lugar]" is standard BP when referring to being at/in a location.
- Don't use EP sources (publico.pt, etc.) as evidence for BP.

### 3c. English hints
Write each English hint as **standalone natural English**, not a literal translation of the Portuguese structure. Read it back as English only — if it sounds wrong in English, fix it.
- PT present + "há" → EN present perfect continuous ("has been living," not "lives")
- PT pretérito perfeito → EN simple past or present perfect depending on context
- PT imperfeito → EN "used to" / "was doing" / "would"

### 3d. Vocabulary check
Every Portuguese word in exercises must either:
- Be defined in a grammar box or vocabulary box earlier in the worksheet, OR
- Be a cognate or previously taught word the student knows (check their file)

## 4. Duplicate check

After all exercises are drafted, list every sentence in a compact block (stripped of blanks) and compare across all sections. A sentence that fits two sections (e.g., "Estados Unidos" fits both "em + artigo" and "countries") must only appear once — pick the section where it adds the most value and write a different sentence for the other.

## 5. Answer key

Build the answer key immediately after drafting exercises — not as a separate pass later. For each exercise:
- Write the answer
- Verify gender and number match the noun
- Verify the answer is the ONLY correct option (no ambiguity)

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
