---
name: simplifier-review
description: Validate text simplifier output against simplifier-guidelines.md — level constraints, cognate rule, passive voice, verb annotations.
argument-hint: "[simplified text, target CEFR level]"
---

# Simplifier Review

Validate simplifier output against `config/prompts/simplifier-guidelines.md`.

**Note:** The simplifier is the one place where PEDAGOGY Principle 20 ("always translate Portuguese") does NOT apply — simplifier skips cognates by design to preserve readability.

## Checklist

### Grammar constraints for target level

**A1:**
- No subjunctive, conditional, simple future, imperfect, compound tenses
- **Zero passive voice** — convert "foi cancelado" → "eles cancelaram"
- No "há" — use "faz" (time) or "tem" (there is)
- Max 10-12 words per sentence
- Simple Subject-Verb-Object only
- Basic connectors only: e, mas, porque, então
- você for "you", never tu

**A2:** A1 rules + imperfect allowed. Still no subjunctive/conditional. Passive allowed sparingly.

**B1:** Subjunctive basics, conditional, passive, future tense, relative clauses all allowed.

**B2:** All forms allowed. Minimal simplification — focus on replacing archaic/rare vocabulary.

### Translation rules

- **Cognates NOT translated** — aeroporto, hospital, importante, família, música, economia, universidade, problema, telefone, restaurante, médico
- **Non-cognate nouns/adjectives** get inline translation: "voo (flight)", "cansado (tired)"
- **Verbs** show infinitive + meaning: "cancelaram (cancelar - to cancel)"
- **Context verbs** get usage notes: saber = to know (facts/how), conhecer = to know (people/places), ser = to be (permanent), estar = to be (temporary), ficar = to stay/become, faz (time) = time elapsed
- **Don't re-translate** a word after its first appearance

## Output

List every violation found with:
- The offending line
- Which rule it breaks
- The fix

If clean: confirm "No violations found" and note any edge cases worth flagging (borderline cognate, ambiguous tense, etc.).
