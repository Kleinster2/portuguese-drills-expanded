# Known Trap-Prone Topics

Topics where Portuguese drills, worksheets, primers, and dialogues have produced failures in the past. Consult this inventory before drafting any teaching material on a listed topic.

Some topics have dedicated drafting skills (`/exercise-draft-*`). Others are tracked here pending failure pressure to justify spinning one up — the bar is "real failures that share a structural pattern," not theoretical concern.

## How to use

Before drafting exercises on a listed topic:
1. Read the trap notes for that topic.
2. If a skill is linked, follow it.
3. If no skill exists, the notes here are the documented traps — apply them manually.

When you hit a new failure on an unlisted topic, add an entry. When entries on an unlisted topic accumulate (≥2 distinct failures), that's the signal to spin up a dedicated `/exercise-draft-*` skill.

---

## Topics with documented failures

### Preposition + article contractions (de+o=do, em+a=na)
- **Concept:** `preposition-article-contractions`
- **Skill:** `/exercise-draft-contractions`
- **Traps:**
  - Generic nouns don't force contractions: *Eu gosto de café* (generic) is correct; the blank doesn't require *do*.
  - Adjective-modified nouns can look specific but stay generic: *filmes brasileiros* is generic.
  - Place names override prescriptive rules (see "Place name articles" below).
- **Past failures:** Christian's contractions worksheet (Mar 2026) — *Eu gosto ___ café com leite* with answer *do* was broken because generic.

### Pronoun contractions (dele, nele, deles)
- **Concept:** `pronoun-contractions`
- **Skill:** none yet — separate from preposition+article above.
- **Traps:**
  - Existing drills `contractions-de.json` and `contractions-em.json` cover the surface but no drafting skill exists.
  - Confusable with preposition+article forms (*do* = de+o vs *dele* = de+ele).
  - Agreement is with the pronoun's antecedent, not the noun in the sentence.
- **Past failures:** none documented yet — but distinct enough from preposition+article to warrant separate trap notes.

### Imperatives (BP você-form vs EP tu-form)
- **Concept:** `imperative-mood`
- **Skill:** none.
- **Traps:**
  - BP instructions: *Complete, Escolha, Substitua, Reescreva, Preencha*.
  - EP instructions: *Completa, Escolhe, Substitui, Reescreve, Preenche*.
  - Copying EP templates into BP material without converting is the recurring failure mode.
  - Worksheet-review item 15 codifies this; not yet a draft-time skill.
- **Past failures:** Amanda's clitic worksheet (Mar 2026) — used tu-form imperatives copied from an EP template.

### Crase (à, às)
- **Concept:** `crase`
- **Skill:** none.
- **Traps:**
  - Wrong/right contrast pairs need surrounding text to lock the syntactic role.
  - *"Como vai Mariana?"* alone is ambiguous — could be missing vocative comma OR missing article.
  - Worksheet-review item 22a codifies the lock-the-context rule.
  - Frame capture risk (memory `feedback_frame-capture`): once "this is a crase problem" is established, downstream reasoning filters out non-crase answers silently. Check the natural answer independent of the frame.
- **Past failures:** Amanda's crase worksheet (Apr 2026) — decontextualized *"Como vai Mariana?"* error pair.

### Place name articles (BP)
- **Concept:** `place-name-articles`
- **Skill:** none.
- **Traps:**
  - Brazilian usage routinely overrides prescriptive rules.
  - Neighborhoods, named venues take articles in BP: *no Brooklyn*, *do Brooklyn*, *no Brookfield Place*.
  - **Always verify against .com.br sources** — never EP sources, never prescriptive rules.
  - Worksheet-review item 23, exercise-draft section 1b codify this.
- **Past failures:** Christian's contractions worksheet audit (Mar 2026) — *no Brooklyn* falsely flagged as wrong by applying prescriptive rules.

### Open/closed vowel labels — phonemic integrity
- **Concept:** `open-vs-closed-vowels`
- **Skill:** none — covered by PEDAGOGY §27 and worksheet-review item 15b.
- **Traps:**
  - Every "open/closed" or "nasal/oral" label needs a minimal pair in the target variant.
  - *avó/avô* anchors "open/closed O" ✓.
  - *pé/pê* anchors "open/closed E" ✓.
  - **No minimal pair in BP justifies "open/closed A"** — the acute in *está* marks stress, not quality.
- **Past failures:** primer-BP Part I (Apr 2026) — taught *está* as "open á" parallel to *café*/*avó*; same error propagated into the answer key as categorical fact.

### -ar verb vowel quality
- **Concept:** `regular-ar-conjugation` (also relates to `open-vs-closed-vowels`)
- **Skill:** none — covered by PEDAGOGY native-usage notes.
- **Traps:**
  - **-ar verbs have NO open/closed O alternation.** *moro* and *mora* are both open.
  - Alternation appears only in -er/-ir verbs (e.g., *mexo* ↔ *mexe* with different O qualities).
- **Past failures:** memory `feedback_vowel-alternation-ar-verbs` — described -ar verbs as alternating; would have been caught by corpus search.

### Native Usage Filter — prescriptive vs spoken forms
- **Skill:** none — but PEDAGOGY MANDATORY section governs.
- **Traps:**
  - EP: *quereria*, *gostaria* as polite request — nobody says these at counters; teach *queria*.
  - BP: hyper-formal clitic placement, mesoclisis outside literary registers.
  - Always lead with the unmarked response (worksheet-review item 15d).
- **Past failures:** Feb 2026 condicional worksheet included *quereria* — prescriptively correct, never said.

### Spelling integrity in drill JSONs
- **Skill:** none — covered by drill-review item 19.
- **Traps:**
  - Drill JSON files frequently have accents stripped during ASCII-safe authoring (*voce*, *cafe*, *acucar*, *politica*, *ate*, *amanha*).
  - The LLM repeats stripped forms verbatim into student-facing feedback.
  - Symmetric to PEDAGOGY §24 (no fake added accents): no missing accents either.
- **Past failures:** drill-review smoke test on `common-prepositions.json` (May 2026) — gold-standard drill has accent-stripping throughout. Likely affects most of the 131 legacy drills.

### Fill-in-the-blank integrity
- **Skill:** none — covered by worksheet-review item 22, exercise-draft section 1a.
- **Traps:**
  - Every blank must *require* its target answer.
  - Generic nouns don't force articles or contractions.
  - Adjective-modified nouns are a recurring false positive.
- **Past failures:** Christian's contractions worksheet (Mar 2026) — multiple blanks where the target form was optional in natural usage.

---

## Future candidates (no documented failures yet)

These are high-error-frequency topics per `diagnostic-test-manager` SLA notes, but haven't produced specific drill/worksheet failures in our project yet. Move them up to the main section with notes when failures surface.

- Pretérito perfeito vs imperfeito (aspectual choice triggers)
- Ser vs estar
- Saber vs conhecer
- Por vs para
- Direct vs indirect object pronouns (o/a vs lhe)
- Subjunctive triggers
- Gender on -e endings (e.g., *o lápis* vs *a chave*)
- Object pronoun placement (proclisis, mesoclisis, enclisis — register-conditional)

---

## Maintenance

This file is authored, not generated. Update it when:
- A new topic-specific drafting skill is created → update the topic's status line.
- A new failure surfaces on an unlisted topic → add an entry under "Topics with documented failures."
- A topic accumulates ≥2 distinct failures without a skill → consider authoring `/exercise-draft-<topic>`.
- A "future candidate" produces a real failure → promote it to the main section with notes.
