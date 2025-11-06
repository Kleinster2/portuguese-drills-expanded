# Subject Handling Discrepancies: Placement Test vs Drills

**Analysis Date:** 2025-01-06
**Status:** Critical issues identified

---

## Executive Summary

A comprehensive analysis comparing how drill prompts specify subject usage versus how the placement test actually uses subjects reveals **5 critical discrepancies**. The placement test significantly underrepresents subjects that drills emphasize as essential for Brazilian Portuguese.

---

## Methodology

1. Analyzed all drill system prompts (`config/prompts/*.json`) for subject handling specifications
2. Counted subject usage in all 216 production questions in placement test
3. Compared specifications against reality
4. Identified gaps and misalignments

---

## Drill Specification (BP Mode)

All verb drills (`regular-ar`, `regular-er`, `regular-ir`, `irregular-verbs`, `preterite-tense`, `imperfect-tense`, `reflexive-verbs`, etc.) specify:

### **Critical Rules:**
- ✅ **NEVER use "tu"** in Brazilian Portuguese mode
- ✅ **ALWAYS use "você"** for singular "you"
- ✅ **Use "a gente" occasionally** (~1 in 10 questions = 10%)
- ✅ **Occasionally use indefinite pronouns**: alguém, ninguém, todo mundo
- ✅ **Ensure good mix of subjects**: eu, você, ele/ela, nós, eles/elas

### **Quoted from Drill Prompts:**
```
🚨 CRITICAL: SUBJECT PRONOUN "TU" USAGE 🚨
- IN BRAZILIAN PORTUGUESE (BP) MODE: NEVER, EVER use the subject
  pronoun "tu" in questions or exercises. ALWAYS use "você" for
  singular "you".
```

```
BP Mode Only: Occasionally (about 1 in 10 questions), use a gente
as the subject. The English prompt must still use "We".
```

```
Occasionally, use the indefinite pronouns alguém (someone), ninguém
(no one), or todo mundo (everyone) as the subject.
```

---

## Placement Test Reality

### **Subject Distribution (216 production questions):**

| Subject | Count | Percentage | Expected (Drill Spec) |
|---------|-------|------------|----------------------|
| **eu** | 79 | **36.6%** | ~15-20% (balanced) |
| **você** | 13 | **6.0%** | ~15-20% (primary singular "you") |
| **tu** | 0 | **0.0%** ✅ | 0% (never in BP) |
| **a gente** | 0 | **0.0%** ❌ | ~10% (occasional use) |
| **nós** | 15 | 6.9% | ~10-15% |
| **ele** | 14 | 6.5% | ~10-15% |
| **ela** | 9 | 4.2% | ~10-15% |
| **eles** | 4 | 1.9% | ~10-15% |
| **vocês** | 1 | 0.5% | ~5-10% |
| **alguém** | 0 | **0.0%** ❌ | Occasional |
| **ninguém** | 0 | **0.0%** ❌ | Occasional |
| **todo mundo** | 0 | **0.0%** ❌ | Occasional |

---

## Discrepancies Identified

### **DISCREPANCY #1: "você" (singular you) [CRITICAL]**

**Drill Specification:**
ALWAYS use "você" for singular "you" in BP mode (emphasized as critical distinction from EP)

**Placement Test Reality:**
Only 13 questions (6.0%) use "você"

**Impact:**
- Students practice "você" conjugations extensively in drills
- Placement test barely tests this form
- Mismatch between what's taught and what's tested
- Students may appear weaker in "você" forms than they actually are

**Recommendation:**
Add 20-30 more "você" questions to placement test (target: ~15-20%)

**Example Questions Needed:**
- "Você __ português?" (falar - present)
- "Você __ no Brasil?" (morar - present)
- "Você __ ontem?" (trabalhar - preterite)

---

### **DISCREPANCY #2: "a gente" (informal "we") [CRITICAL]**

**Drill Specification:**
Use "a gente" occasionally (~1 in 10 questions = 10%)

**Placement Test Reality:**
0 questions (0.0%) use "a gente"

**Impact:**
- Drills explicitly teach "a gente" as common informal BP usage
- Placement test NEVER tests it
- Complete gap in assessment of this essential BP structure
- Students learn it in drills but are never evaluated on it

**Recommendation:**
Add 15-20 "a gente" questions to placement test (target: ~10%)

**Example Questions Needed:**
- "A gente __ ao cinema." (ir - present)
- "A gente __ português." (falar - present)
- "A gente __ no Rio." (morar - imperfect)

**Pedagogical Note:**
"a gente" takes 3rd person singular form (like "ele/ela") but means "we". This is a critical BP concept that should be tested.

---

### **DISCREPANCY #3: "tu" (European Portuguese "you") [ALIGNED ✅]**

**Drill Specification:**
NEVER use "tu" in BP mode

**Placement Test Reality:**
0 questions (0.0%) use "tu"

**Impact:**
No discrepancy - both placement test and drills correctly avoid "tu" for BP

**Recommendation:**
No action needed - correct alignment

---

### **DISCREPANCY #4: "eu" over-representation [MODERATE]**

**Drill Specification:**
Good mix of different subjects (balanced distribution)

**Placement Test Reality:**
79 questions (36.6%) use "eu" - heavily overrepresented

**Impact:**
- Placement test overemphasizes first person singular
- Underrepresents other subject forms
- May give inflated sense of competency if student only knows "eu" forms
- Doesn't accurately assess ability across all conjugations

**Recommendation:**
Rebalance placement test:
- Reduce "eu" questions to ~30-40 (15-20%)
- Redistribute to você, a gente, vocês, eles/elas

---

### **DISCREPANCY #5: Indefinite pronouns [MODERATE]**

**Drill Specification:**
Occasionally use alguém (someone), ninguém (no one), todo mundo (everyone)

**Placement Test Reality:**
0 questions use any indefinite pronouns

**Impact:**
- Drills teach these as taking 3rd person singular
- Placement test never assesses understanding of this
- Gap in testing subject-verb agreement for indefinite pronouns

**Recommendation:**
Add 5-10 questions using indefinite pronouns (target: ~3-5%)

**Example Questions Needed:**
- "Alguém __ aqui?" (morar - present)
- "Ninguém __ a resposta." (saber - present)
- "Todo mundo __ português." (falar - present)

---

## Impact Analysis

### **Critical Issues:**
1. **você forms under-tested** (6% vs. expected 15-20%)
2. **a gente never tested** (0% vs. expected 10%)

### **Consequence:**
- Students complete placement test → told to practice certain drills
- Drills emphasize "você" and "a gente" extensively
- Students wonder why they're practicing forms they weren't tested on
- Potential confusion about what's actually important in BP

### **Pedagogical Concern:**
The placement test doesn't accurately assess competency in two of the most essential Brazilian Portuguese subject forms:
- "você" (the standard singular "you")
- "a gente" (the colloquial "we")

---

## Recommended Actions

### **Priority 1: Add "você" questions**
- Target: 20-30 additional questions (~15-20% of total)
- Distribute across all verb topics (regular -ar/-er/-ir, preterite, imperfect, subjunctive, etc.)

### **Priority 2: Add "a gente" questions**
- Target: 15-20 questions (~10% of total)
- Focus on common verbs where "a gente" is frequently used
- Ensure students understand 3rd person singular agreement

### **Priority 3: Rebalance "eu" questions**
- Reduce from 79 to ~30-40 questions
- Redistribute across other subjects

### **Priority 4: Add indefinite pronoun questions**
- Target: 5-10 questions (~3-5%)
- Test alguém, ninguém, todo mundo

### **Priority 5: Increase "vocês/eles/elas" representation**
- Currently very low (1-4 questions each)
- Target: ~10-15 questions each

---

## Subject Distribution Target

Based on drill specifications and BP usage patterns:

| Subject | Current | Target | Change Needed |
|---------|---------|--------|---------------|
| eu | 79 (36.6%) | 35-40 (15-20%) | -35 to -40 |
| você | 13 (6.0%) | 35-40 (15-20%) | +22 to +27 |
| a gente | 0 (0.0%) | 20-25 (10%) | +20 to +25 |
| nós | 15 (6.9%) | 20-25 (10%) | +5 to +10 |
| ele/ela | 23 (10.6%) | 30-35 (15%) | +7 to +12 |
| vocês | 1 (0.5%) | 15-20 (8%) | +14 to +19 |
| eles/elas | 4 (1.9%) | 15-20 (8%) | +11 to +16 |
| Indefinite | 0 (0.0%) | 8-10 (4%) | +8 to +10 |

**Net change:** ~+60 to +80 questions needed (or rebalance existing)

---

## Conclusion

The placement test and drill prompts show significant misalignment in subject handling. The drills correctly emphasize "você" and "a gente" as essential BP forms, but the placement test barely tests "você" and never tests "a gente".

This creates a disconnect between assessment and instruction that should be resolved by:
1. Adding substantial "você" and "a gente" coverage to the placement test
2. Rebalancing away from "eu" over-representation
3. Including indefinite pronouns as tested subjects

These changes would ensure the placement test accurately assesses the subject forms that students will be expected to master in the drills.
