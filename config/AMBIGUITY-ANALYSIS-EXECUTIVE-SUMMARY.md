# Ambiguity Analysis: Portuguese Placement Test v7.0

**Date:** 2025-11-05
**Total Questions Analyzed:** 308
**Critical Issues Found:** 18
**Minor Issues Found:** 4

---

## Executive Summary

Out of 308 questions in the v7.0 placement test, **18 critical ambiguity issues (5.8%)** and **4 minor issues (1.3%)** were identified. The vast majority of ambiguity issues stem from **tense ambiguity** in comprehension questions, where Portuguese present tense can validly translate to either English simple present OR present continuous without temporal context.

### Issue Breakdown

| Issue Type | Severity | Count | % of Total |
|-----------|----------|-------|-----------|
| Tense ambiguity (PT present = EN simple OR continuous) | CRITICAL | 17 | 5.5% |
| Gender ambiguity (speaker gender assumed) | CRITICAL | 1 | 0.3% |
| Preposition variation (at/in work, at/in school) | MINOR | 4 | 1.3% |
| **Total** | | **22** | **7.1%** |

---

## Critical Issues (18 total)

### 1. **Tense Ambiguity** - 17 questions affected

**Problem:** Portuguese present tense is ambiguous in English - it can mean both simple present (habitual) AND present continuous (ongoing).

**Example:**
- **Q25:** "Eu falo português"
  - Current correct: "I speak Portuguese"
  - Also valid: "I am speaking Portuguese"
  - **Why ambiguous:** Without temporal context, both are correct translations

**Affected Questions:**
- Q23, Q25, Q27, Q30 (Basic verbs: moro, falo, trabalho, estudo)
- Q58, Q62, Q65, Q66 (Food/drinks: como, bebo)
- Q78 (abro - open)
- Q139 (faço - do)
- Q165 (trabalho na segunda-feira - work on Monday)
- Q185, Q236 (compro - buy)
- Q221, Q223 (como peixe, bebo leite)
- Q229 (leio - read)
- Q259 (estudo matemática)

**Note:** Q90 ("Eu moro aqui agora") and Q275 ("Todo dia eu estudo") have temporal markers ("agora", "todo dia") but are still somewhat ambiguous as "agora" can mean "now" or "nowadays".

**Recommended Fixes:**
1. **Add temporal adverbs** to Portuguese sentences:
   - For habitual: "sempre", "todos os dias", "geralmente"
   - For continuous: "agora mesmo", "neste momento", "atualmente"
   - Example: "Eu falo português" → "Eu sempre falo português" (clearly habitual)

2. **Alternative:** Accept both simple and continuous as correct answers by adding to options or alternatives array

---

### 2. **Gender Ambiguity** - 1 question affected

**Problem:** Speaker gender is unknown, but template assumes masculine form.

**Example:**
- **Q2:** "I am Brazilian"
  - Template: "Eu __ brasileiro"
  - Current correct: "sou"
  - **Why ambiguous:** Template hardcodes "brasileiro" (masculine), but without context (name, photo), speaker could be female (brasileira)

**Recommended Fixes:**
1. Add gender context (character name like "João" or "Maria", avatar, or explicit "male"/"female" label)
2. Modify template to have TWO blanks: "Eu __ brasileir__" with chips for both verb and gender ending
3. Accept answer as correct regardless (template is testing verb "ser", not gender agreement)

**Note:** This is the ONLY gender ambiguity found because other adjectives either:
- Are used with 3rd person (he/she) where gender is specified
- Are invariable (feliz)
- Are not tested in "I am [adjective]" format

---

## Minor Issues (4 total)

### **Preposition Variations** - 4 questions

**Problem:** English allows multiple prepositions for locations, but test expects only one.

**Affected Questions:**
- **Q16, Q40:** "Eu estou no trabalho" → "I am at work" (also: "in work")
- **Q39:** "Eu estou em casa" → "I am at home" (also: "I am home")
- **Q41:** "Eu estou na escola" → "I am at school" (also: "in school")

**Severity:** MINOR - Standard usage prefers "at work", "at school", "at home" but regional/dialectal variations exist

**Recommended Fix:** Add alternative forms to `alternatives` array, or accept as MINOR (test is prescriptive)

---

## Issues NOT Found (Good News!)

The following potential issues were checked but **NOT** found:

✅ **No pronoun dropping ambiguity** - All production questions properly use "Eu" in templates when testing first-person conjugation

✅ **No vous/tu formality confusion** - No questions include both "você" and "tu" forms as viable chips

✅ **No onde/aonde critical ambiguity** - While both appear in chips, they're used with appropriate contexts (static vs motion)

✅ **No correctSequence issues** - Zero questions use multiple blanks that could create ordering ambiguity

✅ **No stative verb continuous** - "I am liking" etc. were not flagged (correctly, as these are non-standard English)

✅ **No duplicate meaning chips** - No obvious cases where two chips mean the same thing

---

## Top 10 Most Problematic Questions

| Rank | Q# | Type | Issue | Severity |
|------|-----|------|-------|----------|
| 1 | Q2 | PROD | Gender assumption (brasileiro) | CRITICAL |
| 2 | Q23 | COMP | Tense: "moro" = live/am living | CRITICAL |
| 3 | Q25 | COMP | Tense: "falo" = speak/am speaking | CRITICAL |
| 4 | Q27 | COMP | Tense: "trabalho" = work/am working | CRITICAL |
| 5 | Q30 | COMP | Tense: "estudo" = study/am studying | CRITICAL |
| 6 | Q58 | COMP | Tense: "como" = eat/am eating | CRITICAL |
| 7 | Q62 | COMP | Tense: "bebo" = drink/am drinking | CRITICAL |
| 8 | Q65 | COMP | Tense: "bebo suco" = drink/am drinking | CRITICAL |
| 9 | Q66 | COMP | Tense: "como pão" = eat/am eating | CRITICAL |
| 10 | Q78 | COMP | Tense: "abro" = open/am opening | CRITICAL |

---

## Recommendations by Priority

### Priority 1: Fix Tense Ambiguity (affects 17 questions, 5.5%)

**Option A - Preferred:** Add temporal context to Portuguese sentences
- Low-effort for most questions
- Makes questions pedagogically clearer
- Example changes:
  - Q25: "Eu falo português" → "Eu sempre falo português"
  - Q62: "Eu bebo água" → "Estou bebendo água agora" (if testing continuous)

**Option B:** Add continuous form to options as distractor
- Accept that ambiguity exists in real Portuguese
- Teaches students that context matters
- Lower pedagogical value

### Priority 2: Fix Gender Ambiguity (affects 1 question, 0.3%)

**Q2 Specific Fix:**
- Add character context: "João says: I am Brazilian" → makes masculine clear
- OR modify template: "Eu __ brasileir__" (test both verb + gender)
- OR accept as-is (question is testing "sou" conjugation, not gender)

### Priority 3: Document Preposition Variations (affects 4 questions, 1.3%)

**Recommendation:** Accept as-is
- Standard English strongly prefers "at work", "at school", "at home"
- "in work" and "in school" are dialectal/regional
- Test can be prescriptive about standard usage

**Alternative:** Add to `alternatives` array for flexible grading

---

## Conclusion

The v7.0 placement test is **well-designed overall** with only 7.1% of questions showing any ambiguity. The main issue is **tense ambiguity in comprehension questions** (17/308 = 5.5%), which is easily fixable by adding temporal adverbs to Portuguese sentences.

**Recommended Action Items:**
1. **High Priority:** Add temporal context to 17 tense-ambiguous comprehension questions
2. **Medium Priority:** Fix Q2 gender ambiguity with character context
3. **Low Priority:** Document preposition variations as acceptable dialect differences

**Estimated Fix Time:** 2-3 hours for developer to add temporal markers and test changes

---

## Detailed List: All Ambiguous Questions

### Critical - Tense Ambiguity (17)

1. **Q23** (Unit 7) - "Eu moro em São Paulo" → I live / I am living
2. **Q25** (Unit 8) - "Eu falo português" → I speak / I am speaking
3. **Q27** (Unit 9) - "Eu trabalho no banco" → I work / I am working
4. **Q30** (Unit 10) - "Eu estudo português" → I study / I am studying
5. **Q58** (Unit 20) - "Eu como arroz e feijão" → I eat / I am eating
6. **Q62** (Unit 21) - "Eu bebo água" → I drink / I am drinking
7. **Q65** (Unit 21) - "Eu bebo suco" → I drink / I am drinking
8. **Q66** (Unit 22) - "Eu como pão" → I eat / I am eating
9. **Q78** (Unit 26) - "Eu abro a porta" → I open / I am opening
10. **Q139** (Unit 42) - "Eu faço isso para você" → I do / I am doing
11. **Q165** (Unit 50) - "Eu trabalho na segunda-feira" → I work / I am working
12. **Q185** (Unit 56) - "Eu compro calças" → I buy / I am buying
13. **Q221** (Unit 64) - "Eu como peixe" → I eat / I am eating
14. **Q223** (Unit 64) - "Eu bebo leite" → I drink / I am drinking
15. **Q229** (Unit 66) - "Eu leio livros" → I read / I am reading
16. **Q236** (Unit 68) - "Eu compro pão" → I buy / I am buying
17. **Q259** (Unit 75) - "Eu estudo matemática" → I study / I am studying

### Critical - Gender Ambiguity (1)

18. **Q2** (Unit 1) - "I am Brazilian" → Template assumes masculine "brasileiro"

### Minor - Preposition Variation (4)

1. **Q16** (Unit 5) - "no trabalho" → at work / in work
2. **Q39** (Unit 13) - "em casa" → at home / home
3. **Q40** (Unit 13) - "no trabalho" → at work / in work
4. **Q41** (Unit 13) - "na escola" → at school / in school
