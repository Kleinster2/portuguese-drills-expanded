# Placement Test Question Guidelines (v3.1 - Efficacy-Focused)

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

## Distractor Quality



**Distractors must be unambiguously incorrect translations of the English prompt.**



Chips should include:

1.  **Correct answers** - valid translations of the English.

2.  **Grammatically incorrect forms** - e.g., wrong conjugation for the subject.

3.  **Semantically incorrect choices** - e.g., wrong verb (saber vs conhecer).



**Strict Rule:** No other answer can be a plausible translation of the English prompt, even under a loose interpretation.

*   If the prompt is Present Tense ("Do you know?"), do **not** include Past Tense forms (`conhecia`) if they could confuse the student about the intended timeframe. Focus on the specific skill being tested (e.g., verb choice).



Do NOT include answers that are grammatically correct Portuguese but translate to something completely different (e.g., "cat" vs "dog").

## Clear Gender Endings (For Production)

**Use nouns with obvious gender endings when testing gender agreement via Production**

When asking a student to *produce* an article or adjective:
- Use nouns ending in **-o / -os** (masc) or **-a / -as** (fem).
- **Avoid** nouns with ambiguous endings like **-e, -al, -or, -ão** unless the specific goal is to test knowledge of that specific exception.

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

<br>
<hr>
<br>
**Change Log:**
- **v3.1 (2025-12-03):** Shifted philosophy to "Efficacy-Focused". Explicitly allows non-production questions when they better measure the specific topic (e.g., metalinguistic rules).
- **v3.0 (2025-12-03):** Updated for Diagnostic Engine. Emphasized production-only, contextual scenarios, and no hints.
