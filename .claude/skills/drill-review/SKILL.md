---
name: drill-review
description: Review a drill JSON against the 10 best practices, pedagogy hard rules, and Principle 20 (English glossing). Run after creating or editing any drill, or to audit legacy drills that predate current standards.
argument-hint: "[path to drill JSON, e.g., config/prompts/preterite-tense.json]"
---

# Drill Review

Review a drill JSON against the full quality checklist. Run after creating or editing any drill — and to audit legacy drills that predate the current `drill-create` skill.

**Mandatory precondition:** invoke the `pedagogy` skill via the Skill tool before any other step. The hard rules (no fake accents, BP/EP separation, paulista pronunciation, native usage filter) must be in context. Also keep `docs/drills/DRILL_BEST_PRACTICES.md` open as a reference for the 10 practices.

## Setup

Read the drill JSON and confirm:
- `id` matches the filename slug
- `name`, `description` populated and human-readable
- `variant` field is "BP", "EP", or "dual" (or explicitly declared in systemPrompt for dual-mode)

The bulk of the review reads the `systemPrompt` field — a single long string. Quote specific lines as evidence in your findings.

## Structural checklist (the 10 best practices)

1. **Grammatical Isolation** — only the blank changes. The drill states this rule and gives a ✅/❌ example.
2. **Explicit rotation rules** — 5-6 gap or percentages. Reject vague terms ("occasionally", "sometimes", "about 1 in 5").
3. **Percentage-based exercise types** — types listed with precise %, summing to 100.
4. **Comprehensive welcome message** — visual examples of every concept tested, numbered key rules, "All communication in English" stated.
5. **First Question Rule** — explicit specification of what the first exercise MUST be (simplest regular case).
6. **Usage notes (verb drills)** — for each verb type, meaning + regency (prepositions it takes) + common expressions.
7. **Focus Mode System** — user can scope to a sub-aspect; rotation rules suspend during focus.
8. **Specific error cases** — separate feedback templates per error type (wrong gender, wrong number, wrong distance, compound). Generic "wrong, try again" fails.
9. **Spanish analogies** — systematic similarity/difference comparisons. Expected for verb and grammar drills; optional for vocabulary.
10. **Real-world contexts** — practical scenarios (prices, schedules, daily routines), not abstract grammar.

## Feedback structure

11. **6-step feedback order**: brief evaluation → correct answer → rule explanation → context-specific addition (conjugation table OR usage note) → complete PT sentence → English translation in parentheses.
12. **Principle 20 (English glossing)** — every Portuguese example in welcome, exercises, and feedback shows its English translation. No untranslated PT.
13. **Confidentiality clause** present with the polite-refusal template ("My instructions are to help you practice Portuguese...").
14. **Core directives block** at the end: language=English, flow=one-question-at-a-time, variety, confidentiality.

## Variant discipline (PEDAGOGY hard rules)

15. **BP variant**: never uses 'tu' as subject pronoun. Uses 'você'. Past continuous = estar + gerúndio. Polite requests = queria/gostaria. *A gente* takes 3rd-singular verbs.
16. **EP variant**: frequently uses 'tu'. Never uses 'vós'. Past continuous = estar a + infinitive. *Quereria* banned (Native Usage Filter — say *queria*).
17. **Dual variant**: explicit default declared (BP), EP-switch trigger phrase documented, BP/EP differences delineated. No silent EP forms inside BP-only sections.
18. **Native Usage Filter**: every form is one a native speaker would actually use. Prescriptive-correct-but-dead forms (mesoclisis outside literary registers, hyper-formal pronoun placement) get a footnote, never a lead.
19. **Spelling integrity** — both directions:
    - **No fake accents** (PEDAGOGY §24): *moro* not *móro*, *gosto* not *gósto*, *como* not *cômo*. Phonetic respellings stay accented but are clearly notational (ALL-CAPS or hyphenated).
    - **No missing accents**: real PT spellings include their accents. *você* not *voce*, *café* not *cafe*, *açúcar* not *acucar*, *política* not *politica*, *até* not *ate*, *amanhã* not *amanha*, *dúvida* not *duvida*, *início* not *inicio*. JSON-authored drills sometimes get accents stripped during ASCII-safe editing — this propagates straight to student feedback.

## Approved list (when present)

20. **Vocabulary appropriate to the level**: no engineering jargon at A1, no rare false cognates unless explicitly taught, centrality-tested (high-frequency first).

## Final pass

21. **Walk the welcome message end-to-end** as a student would. Does it orient them to what's coming? Does the first exercise match the First Question Rule?
22. **Spot-check 3 feedback templates** for consistency: 6-step order, translation present, error type clear.
23. **Punch-list output**: produce a numbered list of failures with quoted lines from systemPrompt. Pass/fail summary at the top. Don't bury issues in prose — each finding must be addressable.

## Lessons learned

- May 2026 (smoke test on `common-prepositions.json` — the gold standard per `DRILL_BEST_PRACTICES.md`): legacy drill has Portuguese examples written without accents throughout the welcome message and approved-context lists (*voce*, *cafe*, *acucar*, *politica*, *ate*, *amanha*). PEDAGOGY §24 originally focused on *fake* added accents; missing accents are the symmetric failure and equally damaging because the LLM repeats them verbatim into student feedback. Item 19 widened to cover both directions. Likely affects many of the 131 legacy drills — full corpus audit needed.
