---
name: exercise-draft
description: Draft exercises, deduplicate, and build answer key for a Portuguese worksheet. Use after /exercise-scaffold. Run /exercise-verify after this skill completes.
argument-hint: "[topic, level, variant (BP/EP), concept inventory, answer inventory]"
disable-model-invocation: true
---

# Exercise Draft

Write exercises, deduplicate across sections, build the answer key. This skill assumes `/exercise-scaffold` has already run and produced a concept inventory, answer inventory, variant confirmation, and name choices.

**Mandatory precondition:** invoke the `pedagogy` skill via the Skill tool before any other step. This loads the hard rules (no fake accents, BP/EP separation, paulista pronunciation, native usage filter) and PEDAGOGY.md. Skipping this is the #1 cause of past pedagogy violations.

**Other prerequisites:**
- `/exercise-scaffold` output (concept inventory, answer inventory, variant, names)
- Student context if applicable

**After this skill:** Run `/exercise-verify` to check every sentence against real-world usage.

---

## 0. Check for topic-specific guidance

Before drafting, check two places for known traps on this topic:
1. **Topic-specific drafting skill** (e.g., `/exercise-draft-contractions`) — if one exists, run it alongside this skill.
2. **`docs/known-trap-topics.md`** — inventory of trap-prone topics. Even topics without dedicated skills have documented failure modes here. Read the entry for your topic if listed.

Topic skills are spun up when ≥2 distinct failures on the same topic accumulate. The inventory captures everything before that bar — including topics with one failure and topics that match high-frequency error patterns from `diagnostic-test-manager`. No skill and no inventory entry doesn't mean no traps — but those two places are the documented universe.

---

## 1. Draft — write the exercises

Apply the First Question Rule: start each section with the easiest example to build confidence.

### 1a. Blank integrity (fill-in-the-blank exercises)
Every blank must **require** its target answer. Before finalizing each sentence, ask: could a native speaker naturally produce this sentence WITHOUT the target form?

### 1b. Proper nouns — research before using
For any place name (city, neighborhood, venue, country):
- **Search Brazilian sources (.com.br)** for actual usage with prepositions before deciding whether it takes an article. Never rely on prescriptive rules alone.
- Don't use EP sources (publico.pt, etc.) as evidence for BP.
- When WebFetch fails, use Chrome. Don't skip the search.

### 1c. English hints
Write each English hint as **standalone natural English**, not a literal translation of the Portuguese structure. Read it back as English only — if it sounds wrong in English, fix it.
- PT present + "ha" = EN present perfect continuous ("has been living," not "lives")
- PT preterito perfeito = EN simple past or present perfect depending on context
- PT imperfeito = EN "used to" / "was doing" / "would"

### 1d. Vocabulary check
Every Portuguese word in exercises must either:
- Be defined in a grammar box or vocabulary box earlier in the worksheet, OR
- Be a cognate or previously taught word the student knows (check their file)

### 1e. Grammatical isolation
Each blank tests ONE concept. Don't require the student to get two things right to fill one blank. If a blank requires both a contraction AND a gender decision, split it into two exercises or provide one of the two.

---

## 2. Deduplicate

After all exercises are drafted, list every sentence in a compact block (stripped of blanks) and compare across all sections. A sentence that fits two sections (e.g., "Estados Unidos" fits both "em + artigo" and "countries") must only appear once — pick the section where it adds the most value and write a different sentence for the other.

---

## 3. Answer key

Build the answer key immediately — not as a separate pass later. For each exercise:
- Write the answer
- Verify gender and number match the noun
- Verify the answer is the ONLY correct option (no ambiguity)
- Cross-check against the answer inventory from `/exercise-scaffold` — every planned answer should appear
