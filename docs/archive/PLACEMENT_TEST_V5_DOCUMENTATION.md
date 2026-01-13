# Placement Test v5.0.0 - Complete Documentation

**Created:** 2025-11-04
**Version:** 5.0.0
**File:** `config/placement-test-questions-v5.json`
**Status:** ✅ Production Ready

---

## 🎯 Overview

The v5.0.0 placement test is a **comprehensive 90-question assessment** that maps **1:1 with all 90 curriculum units**, providing precise placement from absolute beginner (A1) through upper-intermediate (B2) level.

### Key Features

- ✅ **90 questions** = **90 curriculum units** (perfect 1:1 mapping)
- ✅ Each question **references its specific unit** (unit number + unit name)
- ✅ **4 CEFR phases:** A1 (Beginner) → A2 (Elementary) → B1 (Intermediate) → B2 (Upper-Intermediate)
- ✅ **Progressive difficulty** matching curriculum sequence
- ✅ **Granular placement:** Identifies exact starting point in curriculum
- ✅ Tests **one primary concept** per unit (focused assessment)

---

## 📊 Test Structure

### Phase Breakdown

| Phase | Units | CEFR Level | Question Count | Topics Covered |
|-------|-------|------------|----------------|----------------|
| **Phase 1** | 1-25 | **A1 - Beginner** | 25 questions | Identity, ser/estar/ter, present tense -AR/-ER/-IR verbs, basic vocabulary, simple sentences |
| **Phase 2** | 26-50 | **A2 - Elementary** | 25 questions | Future (ir + inf), all persons (nós/vocês/eles), past tenses (preterite/imperfect), questions, comparatives, numbers, time |
| **Phase 3** | 51-75 | **B1 - Intermediate** | 25 questions | Dates, ordinals, weather, colors, body parts, emotions, locations, daily activities, food, transportation, hobbies, professions, health, imperative, demonstratives |
| **Phase 4** | 76-90 | **B2 - Upper-Intermediate** | 15 questions | Future tense, conditional, é que, crase, subjunctive (all 3 tenses), colloquial BP, discourse markers, advanced por/para, synthesis |

### Question Format

Each question includes:

```json
{
  "id": 1,                                    // Sequential question number (1-90)
  "unit": 1,                                  // Curriculum unit number
  "unitName": "Identity Statements (Eu sou)", // Full unit name
  "phase": 1,                                 // CEFR phase (1=A1, 2=A2, 3=B1, 4=B2)
  "pt": "Eu sou professor",                   // Portuguese example sentence
  "question": "What does 'Eu sou professor' mean?",
  "correct": "I am a teacher",
  "options": ["I am a teacher", "I am a student", "I have a teacher", "I work as a teacher"]
}
```

---

## 🎓 Complete Unit Coverage (1-90)

### **Phase 1: Foundation (A1) - Units 1-25**

**Units 1-10: Core Identity & Basic Verbs**
- Unit 1: Identity with "Eu sou" + professions/nationalities
- Unit 2: Origin with "de" contractions (do, da, dos, das)
- Unit 3: Definite articles (o, a, os, as) with gender agreement
- Unit 4: Indefinite articles (um, uma, uns, umas)
- Unit 5: Location with ESTAR (temporary position)
- Unit 6: Adjective agreement (gender + number)
- Unit 7-10: Basic -AR verbs (morar, falar, trabalhar, estudar)

**Units 11-20: Expanding Present Tense**
- Unit 11: FICAR for permanent location
- Unit 12: ESTAR for temporary states
- Unit 13: Location prepositions with contractions (em casa, no trabalho)
- Unit 14: Family vocabulary with possessives
- Unit 15: Negation with NÃO
- Unit 16-17: TER for possession and age
- Unit 18: Yes/no questions (same word order)
- Unit 19: PRECISAR DE (requires "de")
- Unit 20-21: Food and beverage vocabulary

**Units 22-25: All Three Verb Types**
- Unit 22: -ER verbs (comer, beber)
- Unit 23: Você/ele/ela forms (3rd person singular)
- Unit 24: Nós forms (1st person plural)
- Unit 25: GOSTAR DE (requires "de")
- Unit 26: -IR verbs (abrir, partir)

### **Phase 2: Elementary (A2) - Units 26-50**

**Units 26-33: Expanding to All Persons**
- Unit 27: Future with IR + infinitive (near future)
- Unit 28: Vocês/eles/elas forms (3rd person plural)
- Unit 29: Time expressions (hoje, amanhã, ontem)
- Unit 30: Question words (onde, o que, quando, como, por que)
- Unit 31-33: Possessive adjectives (meu/minha, seu/sua, nosso/nossa)

**Units 34-40: Past Tenses (Preterite)**
- Unit 34: Preterite -AR verbs (completed actions)
- Unit 35: Preterite -ER/-IR verbs
- Unit 36: Irregular: ser/ir (fui, foi)
- Unit 37: Irregular: ter/estar (tive, estive)
- Unit 38: Irregular: fazer/dizer/trazer (fiz, disse, trouxe)
- Unit 39: Irregular: ver/vir/dar (vi, vim, dei)
- Unit 40: Irregular: poder/pôr/saber/querer (pude, pus, soube, quis)

**Units 41-50: Prepositions, Numbers, Imperfect**
- Unit 41: Contractions with A (ao, à, aos, às)
- Unit 42: POR vs PARA (through/duration vs to/purpose)
- Unit 43-44: Numbers 0-100 and beyond (cem, mil)
- Unit 45: Imperfect tense regular (habitual past, "used to")
- Unit 46: Imperfect irregular (era, tinha, vinha - only 3!)
- Unit 47: Comparatives (mais...que, menos...que, tão...quanto)
- Unit 48: Superlatives (o mais, o menos)
- Unit 49: Telling time (são três horas, é uma hora)
- Unit 50: Days of the week (segunda-feira, etc.)

### **Phase 3: Intermediate (B1) - Units 51-75**

**Units 51-60: Time, Weather, Descriptions**
- Unit 51: Months (em janeiro, no mês de junho - lowercase!)
- Unit 52: Dates (primeiro de maio - use "primeiro" for 1st)
- Unit 53: Ordinal numbers (primeiro/primeira, terceiro/terceira)
- Unit 54: Weather with FAZER (faz calor, faz frio)
- Unit 55: Colors (adjectives after noun, agreement)
- Unit 56: Clothing (camisa feminine, calça singular)
- Unit 57: Body parts with DOER (minha cabeça dói)
- Unit 58: Extended family (avós, tios, primos)
- Unit 59: Emotions (estar + emotion, ter + fome/sede/sono)
- Unit 60: Locations/directions (em cima de, ao lado de)

**Units 61-70: Daily Life Vocabulary**
- Unit 61: House and rooms (casa tem três quartos)
- Unit 62: Daily activities (acordo, durmo - irregular!)
- Unit 63: Frequency adverbs (sempre, nunca - before verb in BP)
- Unit 64: Food/meals expanded (café da manhã, almoço, jantar)
- Unit 65: Transportation (de ônibus, de carro, **a pé** exception)
- Unit 66: Hobbies (JOGAR sports, TOCAR instruments)
- Unit 67: Technology (ligar para, mandar mensagem)
- Unit 68: Shopping (quanto custa, Brazilian reais)
- Unit 69: Professions (ser + profession WITHOUT article)
- Unit 70: Health (estou doente, tenho febre)

**Units 71-75: Advanced Structures**
- Unit 71: Commands/imperative (flip vowel: fale, coma)
- Unit 72: Demonstratives 3-way (este, esse, aquele)
- Unit 73: Furniture (na sala tem um sofá)
- Unit 74: Nature/animals (tenho um cachorro, vou à praia)
- Unit 75: School subjects (estudo matemática - no article)

### **Phase 4: Upper-Intermediate (B2) - Units 76-90**

**Units 76-80: Essential Intermediate Grammar**
- Unit 76: Future tense (falarei - 3 irregulars: fazer/dizer/trazer)
- Unit 77: Conditional (gostaria de - polite requests, hypotheticals)
- Unit 78: É que emphatic (onde é que você mora - VERY common BP)
- Unit 79: Crase (à = a+a, às três horas, vou à praia)
- Unit 80: Todo vs tudo (adjective vs pronoun)

**Units 81-85: Complete Subjunctive System**
- Unit 81: Subjunctive intro (wishes, doubts, emotions vs facts)
- Unit 82: Present subjunctive regular (opposite vowel rule)
- Unit 83: Present subjunctive irregular (seja, esteja, tenha, vá)
- Unit 84: Imperfect subjunctive (se eu fosse rico, eu viajaria)
- Unit 85: Future subjunctive (quando eu tiver - unique to Portuguese!)

**Units 86-90: Advanced & Synthesis**
- Unit 86: Colloquial BP (tô, tá, cê, vô, num, pra)
- Unit 87: Advanced demonstratives (temporal/discourse use)
- Unit 88: Discourse markers (então, pois é, enfim, aliás)
- Unit 89: Advanced por/para (está para chover, por exemplo)
- Unit 90: Comprehensive synthesis (integration of all skills)

---

## 📈 Scoring & Placement Guidance

### Scoring Ranges

| Score Range | CEFR Level | Recommended Start | Description |
|-------------|------------|-------------------|-------------|
| **0-12** | Pre-A1 | **Unit 1** | Start from absolute beginning |
| **13-25** | **A1** | **Units 1-25** | Basic present tense, identity, simple sentences |
| **26-37** | **A1/A2** | **Units 26-37** | Expanding to all persons, introducing past tense |
| **38-50** | **A2** | **Units 38-50** | Past tenses mastery, prepositions, numbers |
| **51-62** | **A2/B1** | **Units 51-62** | Time expressions, descriptions, daily vocabulary |
| **63-75** | **B1** | **Units 63-75** | Advanced vocabulary, imperative, demonstratives |
| **76-82** | **B1/B2** | **Units 76-82** | Future/conditional, subjunctive introduction |
| **83-90** | **B2** | **Units 83-90** | Complete subjunctive, colloquial speech, synthesis |

### Placement Logic

**Precise Unit Placement:**
1. Student answers questions 1-90 in sequence
2. Test stops when student gets **3 consecutive wrong** (or completes all 90)
3. Placement = **last correct unit number**
4. Student starts curriculum at their **placed unit + 1**

**Example:**
- Student answers correctly through Unit 42
- Gets Units 43, 44, 45 wrong (3 consecutive)
- **Placement: Unit 42** → Start curriculum at **Unit 43**

---

## 🆚 Comparison with Previous Versions

| Feature | v4.0.0 | v5.0.0 |
|---------|--------|--------|
| **Total Questions** | 70 | **90** |
| **Curriculum Coverage** | Partial (Units 1-~60) | **Complete (Units 1-90)** |
| **Unit References** | None | **Every question shows unit** |
| **CEFR Levels** | A1-B1 | **A1-B2** |
| **Subjunctive Coverage** | None | **Complete (all 3 tenses)** |
| **Colloquial BP** | None | **Included (Unit 86)** |
| **Advanced Grammar** | Limited | **Future, conditional, é que, crase, subjunctive** |
| **Granularity** | 10 "lessons" | **90 precise units** |

---

## 🔧 Implementation Notes

### For Developers

**File Location:**
```
config/placement-test-questions-v5.json
```

**Loading the Test:**
```javascript
fetch('/config/placement-test-questions-v5.json')
  .then(response => response.json())
  .then(data => {
    // data.metadata = test info
    // data.phases = CEFR phase breakdown
    // data.questions = array of 90 questions
    // data.scoring = placement ranges
  });
```

**Question Navigation:**
```javascript
// Questions are ordered 1-90 by difficulty
// Each question has:
question.id          // 1-90
question.unit        // curriculum unit number
question.unitName    // human-readable unit name
question.phase       // 1=A1, 2=A2, 3=B1, 4=B2
```

**Adaptive Testing (Optional):**
- Present questions sequentially (1→90)
- Stop after 3 consecutive wrong answers
- Placement = last correct unit number
- Estimated completion: 20-45 minutes (depends on level)

**Fixed-Length Testing (Alternative):**
- Present all 90 questions
- Calculate total correct
- Use scoring ranges for placement
- Estimated completion: 45 minutes

---

## 📝 Question Design Principles

### 1. **One Concept per Question**
Each question tests **the primary concept** from its unit:
- Unit 2 → Tests "de" contractions (do, da)
- Unit 27 → Tests "ir + infinitive" for future
- Unit 82 → Tests present subjunctive formation

### 2. **Grammatical Isolation**
Questions test **only the target concept**, not incidental grammar:
- ✅ "What does 'Eu sou do Brasil' mean?" → Tests Unit 2 (contractions)
- ❌ "Translate 'My father is from Brazil'" → Tests possessives + contractions + vocabulary

### 3. **Progressive Difficulty**
Questions follow curriculum sequence:
- Questions 1-25: Basic present tense (A1)
- Questions 26-50: Past tenses, questions (A2)
- Questions 51-75: Vocabulary expansion, complex structures (B1)
- Questions 76-90: Advanced grammar, subjunctive (B2)

### 4. **Multiple Choice Format**
- 4 answer options per question
- 1 correct answer
- 3 plausible distractors (common errors)
- Portuguese sentence provided when applicable

### 5. **Unit Attribution**
Every question shows:
```json
"unit": 42,
"unitName": "Prepositions Por and Para"
```
This allows:
- Precise placement reporting
- Targeted review recommendations
- Gap analysis in student knowledge

---

## 🎯 Use Cases

### 1. **Initial Placement**
**Scenario:** New student, unknown Portuguese level
**Method:** Adaptive testing (stop after 3 wrong)
**Result:** "You tested at Unit 42. Start curriculum at Unit 43."

### 2. **Progress Assessment**
**Scenario:** Student completed Units 1-50, wants to verify mastery
**Method:** Test questions 1-50 only
**Result:** Identify weak units for review

### 3. **Curriculum Validation**
**Scenario:** Verify curriculum completeness
**Method:** All 90 questions map to all 90 units
**Result:** 100% coverage confirmed

### 4. **Gap Analysis**
**Scenario:** Student knows some Portuguese but has gaps
**Method:** Full 90-question test
**Result:** "Strong: Units 1-30, 45-55. Weak: Units 31-44 (possessives, past tense)"

---

## 📚 Educational Value

### For Students
- **Precise placement** in 90-unit curriculum
- **Clear feedback** on strengths/weaknesses
- **Unit references** enable targeted study
- **Gradual difficulty** reduces frustration
- **Comprehensive coverage** A1→B2

### For Teachers
- **Granular assessment** (90 data points, not 10)
- **Unit-specific feedback** for remediation
- **Progress tracking** over time
- **Curriculum alignment** (test matches teaching)
- **Diagnostic tool** for identifying knowledge gaps

---

## 🚀 Future Enhancements (Optional)

### Potential v5.1 Features
1. **Listening component:** Audio for Portuguese sentences
2. **Production questions:** Type answer, not multiple choice
3. **Timed mode:** Add time pressure for proficiency assessment
4. **Skill breakdown:** Grammar vs vocabulary vs comprehension scores
5. **BP vs EP variant:** Separate tests for dialects
6. **Mobile optimization:** Responsive design for phones
7. **Progress saving:** Resume test later
8. **Detailed report:** Visual charts of strengths/weaknesses by unit

### Potential v6.0 (Comprehensive Assessment)
- **Writing component:** Short answer questions
- **Speaking component:** Record and transcribe
- **Cultural knowledge:** Brazilian/Portuguese culture questions
- **Colloquial comprehension:** Authentic BP speech patterns
- **Adaptive difficulty:** AI-adjusted question selection

---

## ✅ Quality Assurance Checklist

- [x] All 90 units represented (1 question each)
- [x] Every question references unit number + name
- [x] Questions ordered by curriculum sequence (1→90)
- [x] Progressive difficulty (A1→A2→B1→B2)
- [x] Each question tests ONE primary concept
- [x] Grammatical isolation (no incidental grammar)
- [x] Portuguese examples provided where applicable
- [x] 4 answer options per question (1 correct + 3 distractors)
- [x] Phase attribution (1=A1, 2=A2, 3=B1, 4=B2)
- [x] Complete subjunctive coverage (Units 81-85)
- [x] Colloquial BP included (Unit 86)
- [x] Advanced grammar covered (Units 76-90)
- [x] Metadata complete (version, title, description, structure)
- [x] Scoring guidance provided
- [x] JSON format valid and parseable

---

## 📞 Support & Feedback

**Version:** 5.0.0
**Created:** 2025-11-04
**Status:** Production Ready
**Curriculum Compatibility:** 90-unit curriculum (Beginner A1 → Upper-Intermediate B2)

For questions or suggestions about the placement test, refer to this documentation and the curriculum file: `docs/curriculum/syllabus-micro-sequence.md`

---

**🎉 The placement test now provides complete, granular assessment across all 90 curriculum units with precise unit attribution for optimal student placement and progress tracking!**
