# Concept Taxonomy

Granular concept-level slugs for cross-referencing teaching content (drills, worksheets, trap inventory). Sits one level below the dashboard's coarse `topic` buckets (verbs / vocabulary / tenses / grammar / pronunciation / conversation), which already exist in `config/dashboard.json`.

## How to use

Tag artifacts with one or more `concept` slugs from this list. Concepts are atomic — each represents one skill the student can practice independently. Drills already living in `dashboard.json` get a `concept` field (single slug or array). Trap-inventory entries in `docs/known-trap-topics.md` get a `concept:` line.

When you need a new concept, add it here first (with a one-line description), then start tagging artifacts with it. The query script (`scripts/topic-query.py`) reads this file as the canonical list — unknown concepts on artifacts will surface as warnings.

## Naming conventions

- Slugs are kebab-case: `preposition-article-contractions`.
- For variant-split drills (BP/EP), the concept is variant-agnostic (`imperative-mood`, not `imperative-bp`). Variant lives in the drill JSON's `variant` field.
- For multi-level drills (basic/advanced), the concept is level-agnostic (`demonstratives`, not `demonstratives-basic`). CEFR lives in the dashboard sidecar.
- Where drill slug and concept slug align cleanly, keep them aligned (e.g., drill `crase` → concept `crase`).

---

<!-- BEGIN CONCEPT LIST -->

## verbs

- `regular-ar-conjugation` — regular -ar verb endings (eu falo, você fala)
- `regular-er-conjugation` — regular -er verb endings
- `regular-ir-conjugation` — regular -ir verb endings
- `irregular-verb-conjugation` — irregular forms (ser, ir, ter, vir, fazer, etc.)
- `ser-vs-estar` — distinction between the two "to be" verbs
- `saber-vs-conhecer` — distinction between the two "to know" verbs
- `reflexive-verbs` — verbs with reflexive pronouns (chamar-se, levantar-se)
- `subject-identification` — identifying subject from verb form (pro-drop)

## tenses

- `present-tense` — present-tense conjugation across persons (covered by the three regular-* drills)
- `present-continuous` — estar + gerúndio (BP) / estar a + infinitive (EP)
- `preterite-regular` — pretérito perfeito of regular verbs
- `preterite-irregular` — pretérito perfeito of irregular verbs
- `preterite-imperfect` — pretérito imperfeito
- `preterite-vs-imperfect-aspect` — when to use perfect vs imperfect
- `imperative-mood` — você-form (BP) / tu-form (EP) commands
- `conditional-formation` — verb endings for conditional
- `conditional-usage` — when to use conditional (polite requests, hypotheticals)
- `subjunctive-present` — present-tense subjunctive forms
- `subjunctive-imperfect` — past-tense subjunctive forms
- `subjunctive-future` — future-tense subjunctive forms
- `subjunctive-triggers` — when subjunctive is required
- `subjunctive-broad` — multi-tense subjunctive practice
- `compound-tenses` — perfect tenses (ter + past participle)
- `future-tense` — futuro do indicativo
- `future-immediate` — ir + infinitive (near future)
- `progressive-broad` — progressive aspect across multiple tenses

## grammar

### prepositions and contractions
- `common-prepositions` — em, de, para, por, com, sem, sobre, entre, até, desde
- `preposition-article-contractions` — de+o=do, em+a=na, etc.
- `pronoun-contractions` — dele, dela, nele, nela (preposition + pronoun)
- `crase` — à, às (preposition a + feminine article a)
- `por-vs-para` — distinction
- `preposition-collocations` — verb + preposition pairs (gostar de, precisar de)
- `place-name-articles` — article usage with proper nouns (no Brooklyn, no Brookfield Place); BP-specific corpus rules

### articles, agreement, plurals
- `definite-articles` — o, a, os, as (incl. with names and place names)
- `adjective-agreement` — gender and number agreement
- `adjective-comparison` — comparatives and superlatives
- `noun-plurals` — pluralization rules

### pronouns and demonstratives
- `personal-pronouns` — subject pronoun system
- `demonstratives` — este/esse/aquele system (all variants)
- `possessives` — meu/minha/seu/sua + dele/dela
- `object-pronouns` — direct/indirect object pronouns and placement
- `relative-pronouns` — que, quem, onde, qual, cujo

### aspectual shifts (verb meaning changes by tense)
- `aspectual-shift-saber` — saber preterite ≠ saber imperfect
- `aspectual-shift-conhecer` — conhecer preterite ≠ conhecer imperfect
- `aspectual-shift-poder` — poder preterite ≠ poder imperfect
- `aspectual-shift-querer` — querer preterite ≠ querer imperfect

### derivative verbs
- `ter-derivatives` — manter, conter, obter, deter
- `vir-derivatives` — convir, intervir, sobrevir
- `por-derivatives` — propor, repor, dispor, compor, expor, impor, opor, supor, depor, transpor

### adverbs
- `adverbs-frequency` — sempre, nunca, às vezes
- `adverbs-manner` — -mente adverbs
- `muito` — quantifier vs adverb usage
- `todo-vs-tudo` — distinction

### numbers, dates, time
- `numbers` — cardinals and ordinals
- `colors` — color vocabulary + agreement
- `days-of-week` — segunda, terça, etc.
- `months` — janeiro, fevereiro, etc.
- `dates` — date formats and prepositions
- `time-expressions` — telling time, durations

### questions
- `question-words` — onde, como, quando, qual, quem
- `interrogatives` — yes/no questions, intonation
- `e-que-questions` — what is X (o que é X?)

### connectives and clauses
- `conjunctions` — e, mas, porque, embora
- `conditional-sentences` — if-then constructions
- `conditional-conjunctions` — caso, se, embora
- `concessive-clauses` — embora, mesmo que
- `purpose-clauses` — para que, a fim de que (subjuntivo)
- `result-clauses` — tão/tanto … que (consecutive, indicative)
- `purpose-result-clauses` — legacy combined tag (deprecated; use `purpose-clauses` or `result-clauses`)
- `reported-speech` — direct vs indirect speech
- `tense-backshift` — tense shifts in reported speech (presente → imperfeito, etc.)
- `indirect-questions` — yes/no via *se*, content via wh-words, no inversion
- `cohesion-coherence` — discourse-level connectors
- `textual-connectives` — additive / contrastive / consequential / enumerative / summative connectives (além disso, contudo, por conseguinte, em primeiro lugar, em suma)

### advanced
- `passive-voice` — active vs passive (default ser-passive transformation)
- `passive-se` — impersonal/passive *se* construction (Vendem-se livros)
- `personal-infinitive` — inflected infinitive
- `double-participles` — verbs with two participles (e.g., aceito/aceitado)

### domain
- `ir-transportation` — ir + de + transport (carro, ônibus, metrô…)
- `articles-broad` — generic article practice (separate from definite-articles for legacy drill)

## vocabulary

- `body-parts`, `clothing`, `emotions`, `family`, `food-meals`, `greetings`, `hobbies`, `house-rooms`, `weather`, `directions`, `shopping`, `health-medical`, `technology`, `work-professions`, `common-expressions`, `false-cognates`, `idioms-proverbs`, `lodging`

## pronunciation

- `phonetics-broad` — overall sound system
- `syllable-stress` — stress patterns and acute/circumflex
- `open-vs-closed-vowels` — open é/ê, open ó/ô (and the open-A trap)
- `nasal-vowels` — ã, õ, m/n in coda position
- `palatalization-d-t` — paulista vs carioca (di/de, ti/te)
- `final-l` — BP w-realization, EP retention
- `lh-nh` — palatal consonants
- `final-o-reduction` — unstressed final -o → [u] (Rule 1)
- `final-e-reduction` — unstressed final -e → [i] (Rule 2)
- `epenthesis-borrowed-words` — consonant-final loanwords gain epenthetic [i] (Rule 4)

## conversation

- `self-introduction` — greetings + identity + origin + residence
- `narration-storytelling` — past-tense narrative
- `expressing-opinions` — acho que, na minha opinião
- `conversational-answers` — yes/no echo, agreement markers
- `register-formal-informal` — você/tu/o senhor; formal vs casual phrasing
- `bp-vs-ep-distinctions` — variant differences
- `portuguese-for-spanish` — false cognates, distinct forms
- `argumentation` — rhetorical structures
- `academic-portuguese` — formal written register
- `business-portuguese` — workplace register
- `colloquial-speech` — informal contractions and slang
- `media-current-events` — news vocabulary

<!-- END CONCEPT LIST -->

---

## Maintenance

- New artifact on a topic that doesn't have a concept slug → add the slug here first.
- Concept never tagged on any artifact for a long time → consider deleting; an empty concept is noise.
- Concept consistently surfaces failures (via `/drift-audit` reports) → strong candidate for a dedicated `/exercise-draft-<concept>` skill.
