---
name: exercise-draft-contractions
description: Topic-specific structure and traps for preposition-article contraction exercises (de+o=do, em+a=na, etc.). Use alongside /exercise-draft when the topic involves preposition-article contractions. Does NOT cover pronoun contractions (dele/nele) — those are a separate topic without a skill yet.
argument-hint: "[contraction type: de+article, em+article, a+article, por+article]"
disable-model-invocation: true
---

# Exercise Draft: Contractions (Preposition + Article)

Structure and traps specific to preposition-article contraction exercises. Run alongside `/exercise-draft`, not instead of it. Also referenced by `/exercise-scaffold` for section planning.

**Scope:** This skill covers preposition + article contractions only (do, da, no, na, ao, pelo, etc.). Pronoun contractions (dele/dela, nele/nela) are a separate topic — see drills `contractions-de.json` and `contractions-em.json` but no drafting skill exists for them yet.

---

## Section structure

Organize contraction exercises by preposition type, then applied contexts, then mixed practice:

1. **de + artigo** (do, da, dos, das) — most common, teach first
2. **em + artigo** (no, na, nos, nas) — location and time contexts
3. **a + artigo** (ao, a, aos, as) — direction and movement
4. **por + artigo** (pelo, pela, pelos, pelas) — less frequent, teach last
5. **Applied contexts** (countries/places, professions, daily routines) — sentences that naturally require contractions from multiple prepositions
6. **Mixed practice** — all preposition types combined, no grouping cues

Each preposition section should use fill-in-the-blank. Applied contexts can use translation or sentence completion. Mixed practice should include some error correction ("find and fix the mistake").

---

## Trap 1: Generic nouns don't force contractions

A blank testing a contraction (de+o = do) only works if the sentence context forces the definite article. Generic nouns, mass nouns, and abstract concepts take bare prepositions — no article, no contraction.

**Broken:** "Eu gosto ___ cafe com leite" (answer: "do")
- A native speaker says "Eu gosto de cafe com leite" — generic coffee, no article needed.

**Broken:** "Nos gostamos ___ filmes brasileiros" (answer: "dos")
- "de filmes brasileiros" (generic) is equally valid. An adjective alone doesn't make a noun definite.

**Fix:** Make the noun specific so the article is required:
- Relative clause: "Eu gosto ___ cafe que voce fez"
- Demonstrative: "Eu gosto ___ cafe daquela padaria"
- Possessive: "Eu gosto ___ cafe do seu pai"
- "o X que...": "gostamos ___ filmes que voce indicou"

**Test:** Strip the blank and ask — does this sentence need a definite article? If not, the contraction blank is broken.

## Trap 2: Definite-forcing contexts

Know which contexts actually force the article (and thus the contraction):
- **Forces article:** relative clauses, demonstratives, possessives, superlatives, previously mentioned specific referents, unique entities ("do sol", "da lua")
- **Does NOT force article:** generic/habitual statements, mass nouns in general sense, bare plurals expressing categories, first mentions without specificity

## Trap 3: Place name articles

Place names have their own article rules that override generic/specific logic:
- Countries generally take articles: "do Brasil", "dos Estados Unidos"
- Cities generally don't: "de Nova York", "de Sao Paulo"
- Neighborhoods in BP typically do: "do Brooklyn", "da Tijuca"
- Venues in BP typically do: "no Brookfield Place", "no Starbucks"

Always search .com.br sources for actual usage. Prescriptive rules are unreliable here.

---

## Lessons learned

- Christian's contractions worksheet: "Eu gosto ___ cafe com leite" had generic usage where no contraction was needed. Same worksheet: "Eu sou do Brooklyn" was falsely flagged as wrong by applying prescriptive rules — Brazilian sources universally use the article.
- Adjective-modified nouns ("filmes brasileiros", "cafe brasileiro") are a recurring false positive — the adjective makes them look specific but they're still generic.
- The worksheet had 7 sections (A-G) with 100 exercises total. The structure (by preposition, then applied, then mixed) worked well but the count was unbalanced — 20 mixed-practice exercises vs 12 in the smaller sections.
