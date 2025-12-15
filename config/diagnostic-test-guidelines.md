# Diagnostic Test Question Guidelines (v4.3 - Efficacy-Focused)

Best practices for creating effective grammar diagnostic assessment questions.

## Core Philosophy: Efficacy First

The goal of the diagnostic engine is to measure proficiency with the highest possible accuracy and efficiency. **Question type should be selected based on what best measures the specific topic.**

- **Production (Contextualized):** The default standard. Best for testing active command of grammar, conjugation, and syntax.
- **Comprehension / Concept Check:** Use *only* when production would introduce unnecessary friction (like rote vocabulary memorization) or when testing abstract rules (e.g., gender ambiguity awareness).

## Selecting Question Types

### When to use Production (`contextualizedProduction`)
Use for 90% of the test. It is the only way to prove a student can *use* the language.
- **Verb Conjugations:** "Eu __ (falar)" -> `falo`.
- **Prepositions:** "Gosto __ você" -> `de`.
- **Articles:** "Eu tenho __ carro" -> `um`.

### When to use Comprehension/Concept (`comprehension`)
Use when testing a rule or concept where "filling in the blank" would test the wrong thing (e.g., testing vocabulary instead of the rule).

**Example: Gender Ambiguity**
*   *Goal:* Test if the student knows that `-e` endings do not guarantee masculine/feminine gender.
*   *Production Failure:* Asking `__ ponte` tests if they memorized "ponte". It does not test if they know the *rule* of ambiguity.
*   *Comprehension Success:* "Which group of words contains both masculine and feminine nouns?" (Options: lists of words ending in -e). This tests the concept directly.

## No Explanations / No Hints

**Don't give away the answer or provide direct grammatical hints.**

The test should assess what students know, not teach them. The `hint` field is intentionally omitted in v10.9+ question banks.

Bad:
- EN: "I am in Brazil right now **(temporary location)**" → hints at estar
- Question: "Choose ser (not estar) for professions:" → gives the rule

Good:
- EN: "I am in Brazil right now"
- Question: "Complete the sentence:"

## Contextual Scenarios

Use the `scenario` field to provide a brief, realistic situation that justifies the English prompt. This adds naturalness and relevance without giving away the grammatical rule.

**Guideline:** The scenario should explain *why* the student is saying/writing the English sentence.

- `en`: "I am Brazilian"
- `scenario`: "You meet someone new at a café and they ask about your nationality."

## Chip Order Randomization

**All answer chips must be in random order - never place the correct answer in a predictable position.**

When creating or reviewing questions, ensure the correct answer is not always first, last, or in any consistent position. Students should not be able to guess based on chip placement.

- Randomize chip order for every question
- Verify correct answer position varies across the question bank
- Never have all correct answers in the same position (e.g., always first)

## Distractor Quality



**Distractors must be unambiguously incorrect translations of the English prompt.**



Chips should include:

1.  **Correct answers** - valid translations of the English.

2.  **Grammatically incorrect forms** - e.g., wrong conjugation for the subject.

3.  **Semantically incorrect choices** - e.g., wrong verb (saber vs conhecer).



**Strict Rule:** No other answer can be a plausible translation of the English prompt, even under a loose interpretation.

*   If the prompt is Present Tense ("Do you know?"), do **not** include Past Tense forms (`conhecia`) if they could confuse the student about the intended timeframe. Focus on the specific skill being tested (e.g., verb choice).



Do NOT include answers that are grammatically correct Portuguese but translate to something completely different (e.g., "cat" vs "dog").

## English-Portuguese Alignment

**The English prompt (`en`) and Portuguese template (`template`) must always match exactly**

The English sentence must be a complete, accurate translation of the Portuguese template with all blanks filled in.

- ✅ **Good:**
  - `en`: "If I were there, I would do things differently"
  - `template`: "Se eu estivesse lá, eu __ as coisas de forma diferente"
  - (The English shows the full sentence that matches the complete Portuguese)

- ❌ **Bad:**
  - `en`: "I would do things differently"
  - `template`: "Se eu estivesse lá, eu __ as coisas de forma diferente"
  - (The English is missing "If I were there" which is shown in the Portuguese)

This ensures students understand the full context and can accurately translate the intended meaning.

## Clear Gender Endings (For Production)

**Use nouns with obvious gender endings when testing gender agreement via Production**

When asking a student to *produce* an article or adjective:
- Use nouns ending in **-o / -os** (masc) or **-a / -as** (fem).
- **Avoid** nouns with ambiguous endings like **-e, -al, -or, -ão** unless the specific goal is to test knowledge of that specific exception.

## Vocabulary Choices

### Avoid Physical Characteristics

**Do not use physical descriptors like "tall", "short", "fat", "thin", "pretty", "ugly" in questions.**

When testing adjective agreement, use:
- ✅ Emotions/states: animado/a (excited), cansado/a (tired), ocupado/a (busy), preocupado/a (worried)
- ❌ Physical traits: alto/a (tall), baixo/a (short), gordo/a (fat), magro/a (thin)

This avoids potentially sensitive content and focuses on more universally applicable vocabulary.

### Use Adult Vocabulary

**Prefer adult/young adult terms over child-specific vocabulary.**

- ✅ **rapaz / rapazes** (young man / young men) instead of menino/meninos
- ✅ **moça / moças** (young woman / young women) instead of menina/meninas
- ✅ **criança** (child) only when contextually appropriate (e.g., playing with toys)

This reflects vocabulary learners will actually use in adult contexts.

## Demonstratives - Scenario Clarity

**Scenarios for demonstrative questions must unambiguously establish physical distance**

Demonstratives test spatial proximity awareness (este/esse/aquele). The scenario must make it obvious which demonstrative is needed.

### Distance Guidelines

- **Este/Esta (this - close to speaker):**
  - "You're pointing to a specific book among several in front of you."
  - "You're inside a house showing it to a visitor."
  - **Key:** Object is very close to the speaker, within immediate reach

- **Esse/Essa (that - near listener/medium distance):**
  - "You're pointing to a bag near your friend."
  - "You're referring to something the listener is holding."
  - **Key:** Object is closer to listener than speaker, or at medium distance

- **Aquele/Aquela (that - far from both):**
  - "You're looking at a distant building from your window."
  - "You see a tall building on the horizon."
  - **Key:** Object is far from both speaker and listener

### Avoid Ambiguous Scenarios

- ❌ **Bad:** "You're pointing to something across the street." (Could be esse or aquele)
- ❌ **Bad:** "You're comparing the sizes of two options." (No distance information)
- ✅ **Good:** "You're looking at a distant building from your window." (Clearly far = aquele)

### Proficiency-Level Distractors

Remove demonstratives that are plausible alternatives at higher proficiency levels:

- **B1 Level (Basic Demonstratives - Unit 71):** Test textbook distinctions. Remove informal alternatives.
  - Testing "estas"? Remove "essas" (acceptable in informal BP but taught at B2)
  - Testing "essa"? Remove "esta" (too similar unless clearly wrong)

- **B2 Level (Advanced Demonstratives - Unit 87):** Can include informal BP usage where esse/isso substitutes for este/isto.

## Schema Reference

### Production Question
```json
{
  "id": 1,
  "unit": 1,
  "unitName": "Identity Statements",
  "phase": 1,
  "type": "contextualizedProduction",
  "en": "I am Brazilian",
  "question": "Complete the sentence:",
  "template": "Eu __ brasileiro",
  "chips": ["sou", "é", "está", "estou", "era", "foi"],
  "correct": "sou",
  "scenario": "You meet someone new at a café and they ask about your nationality."
}
```

### Concept/Comprehension Question
```json
{
  "id": 200,
  "unit": 95,
  "unitName": "Gender Rules - Ambiguity",
  "phase": 2,
  "type": "comprehension",
  "en": "Which of these words is Feminine?",
  "question": "Identify the gender pattern:",
  "options": ["O Leite", "O Dente", "A Ponte", "O Tapete"],
  "correct": "A Ponte",
  "scenario": "Analyzing noun genders."
}
```

## Question Review Format

**When reviewing questions, always display them as they appear to the student:**

```
### **Q[ID] - [Unit Name]** ([N] of [Total])

---

**Phase [N] ([Level])** | Unit [N]: [Unit Name]

*[Scenario text]*

**"[English prompt]"**

[Question text]:

> [Template with ____ for blank]

| chip1 | chip2 | chip3 | chip4 | chip5 | chip6 |

**Correct answer: [answer]**

---

**Analysis**: [Assessment of correctness and quality]
```

This format mirrors the student experience and makes it easier to spot UX issues, unclear scenarios, or confusing chip arrangements.

<br>
<hr>
<br>
**Change Log:**
- **v4.3 (2025-12-15):** Added "Vocabulary Choices" section - avoid physical characteristics, use adult vocabulary (rapaz/moça).
- **v4.2 (2025-12-11):** Added "Chip Order Randomization" section - correct answers must never be in predictable positions.
- **v4.1 (2025-12-11):** Added "Question Review Format" section specifying how to display questions during review (as they appear to students, not as JSON).
- **v4.0 (2025-12-08):** Updated terminology from "Placement Test" to "Diagnostic Test" to accurately reflect the adaptive diagnostic engine nature of the assessment.
- **v3.3 (2025-12-08):** Added "English-Portuguese Alignment" section requiring `en` and `template` to always match exactly.
- **v3.2 (2025-12-08):** Added "Demonstratives - Scenario Clarity" section with guidelines for unambiguous distance scenarios and proficiency-level distractor selection.
- **v3.1 (2025-12-03):** Shifted philosophy to "Efficacy-Focused". Explicitly allows non-production questions when they better measure the specific topic (e.g., metalinguistic rules).
- **v3.0 (2025-12-03):** Updated for Diagnostic Engine. Emphasized production-only, contextual scenarios, and no hints.
