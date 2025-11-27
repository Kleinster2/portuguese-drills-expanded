# Placement Test Question Guidelines

Best practices for creating effective grammar placement test questions.

## No Explanations

**Don't give away the answer**

The test should assess what students know, not teach them.

Bad:
- EN: "I am in Brazil right now **(temporary location)**" → hints at estar
- EN: "She is a teacher **(permanent profession)**" → hints at ser
- Question: "Choose ser (not estar) for professions:" → gives the rule

Good:
- EN: "I am in Brazil right now"
- EN: "She is a teacher"
- Question: "Complete the sentence:"

## Acceptable Clarifications

Some parenthetical hints are needed for disambiguation (not teaching):

| Type | Example | Why OK |
|------|---------|--------|
| Gender | "I bought them **(feminine)**" | Specifies which pronoun |
| Addressee | "Please speak slowly **(você)**" | Specifies singular/plural formal |
| Portuguese word | "The key is from the car **(o carro)**" | Shows gender of noun |
| Demonstrative distance | "Those flowers **(over there)**" | Distinguishes esse vs aquele |

## Blank Pattern for Multiple Valid Answers

**Use blanks in English when multiple answers are grammatically valid**

When testing gender agreement without requiring a specific article type:

```json
{
  "en": "___ boy is here",
  "template": "__ menino está aqui",
  "correct": "O",
  "alsoCorrect": ["Um"]
}
```

This tests:
- Gender agreement (menino → masculine → O/Um, not A/Uma)
- Both definite (O) and indefinite (Um) are valid

When to use blanks vs specific words:

| Goal | EN | Correct | alsoCorrect |
|------|-----|---------|-------------|
| Test gender only | "___ boy is here" | O | Um |
| Test definite article | "**The** boy is here" | O | — |
| Test indefinite article | "**A** boy is here" | Um | — |

### Other Double-Blank Patterns

**Demonstratives (distance unspecified):**
```json
{
  "en": "___ book is interesting",
  "template": "__ livro é interessante",
  "correct": "Este",
  "alsoCorrect": ["Esse", "Aquele"]
}
```

**Future Tense (both forms valid):**
```json
{
  "en": "I _ study tomorrow",
  "template": "Eu __ amanhã",
  "correct": "estudarei",
  "alsoCorrect": ["vou estudar"]
}
```

**Comparatives (que vs do que):**
```json
{
  "en": "She is taller _ her brother",
  "template": "Ela é mais alta __ o irmão",
  "correct": "que",
  "alsoCorrect": ["do que"]
}
```

**Ser/Estar (ambiguous adjectives):**
```json
{
  "en": "The food _ delicious",
  "template": "A comida __ deliciosa",
  "correct": "está",
  "alsoCorrect": ["é"]
}
```
Some adjectives allow both ser (inherent quality) and estar (current state):
- delicioso, bom, bonito, interessante, etc.

## Distractor Quality

**Distractors must be grammatically incorrect, not just different meanings**

Chips should only include:
1. **Correct answers** - valid translations of the English
2. **Grammatically wrong** - incorrect Portuguese

Do NOT include answers that are grammatically correct Portuguese but translate to something different. This creates unfair "trick questions."

Bad:
- EN: "Maria is **a** teacher"
- Chip: "a" (definite article) → "Maria é a professora" is valid Portuguese but means "the teacher"

Good:
- EN: "Maria is **a** teacher"
- Chips: ∅, uma (correct) | ela, como, ser (grammatically wrong in this position)

**Distractors should test grammar, not vocabulary**

Bad distractor:
- PT: "Eu sou professor"
- Option: "I am a student" → only tests if they know professor ≠ estudante

Good distractors test grammar understanding:
- "I am temporarily a teacher" → tests ser vs estar
- "I have a teacher" → tests ser vs ter
- "I was a teacher" → tests present vs past
- "I am the teacher" → tests article usage

## Multiple Correct Answers

Use `alsoCorrect` field when multiple answers are grammatically valid:

```json
{
  "correct": "∅",
  "alsoCorrect": ["uma"]
}
```

Examples where this applies:
- Articles with professions: "Maria é __ professora" (∅ or uma)
- Possessives in BP: "__ Minha casa é grande" (∅ or A)
- Personal "a": "Eu visitei __ Maria" (∅ or a)

## Nothing (∅) Questions

When testing that nothing is needed, ensure only ONE answer is valid.

Bad (ambiguous):
- "Maria é __ professora" → both ∅ and "uma" work

Good (unambiguous):
- "Eu posso __ falar português" → only ∅ (modal + infinitive, no preposition)
- "Eu sei __ nadar" → only ∅ (saber + infinitive)

## Neutral Question Prompts

Use neutral prompts that don't hint at the answer:

| Avoid | Use Instead |
|-------|-------------|
| "Choose ser (not estar)..." | "Complete the sentence:" |
| "Choose the formal imperative:" | "Complete the sentence:" |
| "Use the simple future tense:" | "Complete the sentence:" |
| "Choose imperfect (ongoing)..." | "Complete the sentence:" |

## Chip/Option Count

- Production questions: 6-10 chips
- Comprehension questions: 6 options
- Include plausible distractors from related grammar points

## Randomize Chip Order

**Never place the correct answer in a predictable position**

The correct answer should be randomly distributed across all chip positions. If the correct answer is always first (or always in another position), students can game the test.

Bad: Correct answer always in position 1
Good: Correct answer evenly distributed across positions 1-10

Use random shuffling when generating questions to ensure fair distribution.

## Question Order

**JSON files: Follow syllabus order** - Keep questions organized by unit/topic for maintainability and easier editing.

**Runtime: Automatically randomized** - Questions are shuffled at test start (`placementTest.js`), so the static JSON order doesn't affect test-takers. This prevents:
- Topic clustering (adjacent questions priming students)
- Comprehension questions revealing answers for production questions
- Pattern recognition from predictable ordering

## Clear Gender Endings

**Use nouns with obvious gender endings when testing gender agreement**

When testing grammar that involves gender (articles, prepositions with contractions, demonstratives, adjective agreement), use nouns that end in:
- **-o / -os** for masculine (carro, livros, banco)
- **-a / -as** for feminine (casa, mesas, rosa)

Avoid nouns with ambiguous endings like:
- **-e** (estudante, ponte)
- **-al** (hospital, animal)
- **-or** (flor, cor)
- **-ão** (can be masc or fem)

| Bad | Good | Why |
|-----|------|-----|
| hospital | banco | -al ending doesn't show gender |
| flores | rosas | -es ending doesn't show gender |
| estudante | aluno/aluna | -e ending is ambiguous |

## English Must Be Natural

**Distractors and prompts must be grammatical English**

All English text (prompts, options, distractors) must be natural, grammatical English.

Bad:
- "I am teacher" (missing article)
- "I am being a teacher" (unnatural)

Good:
- "I am a teacher"
- "I am temporarily a teacher"

## Avoid Redundant Context

**Don't add unnecessary framing**

Bad:
- "João says: I am Brazilian"

Good:
- "I am Brazilian"

The template already shows first person (Eu __), so no need to specify who is speaking.

## Schema Reference

### Production Question
```json
{
  "id": 1,
  "unit": 1,
  "phase": 1,
  "type": "production",
  "en": "I am Brazilian",
  "question": "Complete the sentence:",
  "template": "Eu __ brasileiro",
  "chips": ["sou", "é", "está", "estou", "era", "foi"],
  "correct": "sou",
  "alsoCorrect": [],          // optional
  "unitTopic": "Ser"
}
```

### Comprehension Question
```json
{
  "id": 2,
  "unit": 1,
  "phase": 1,
  "type": "comprehension",
  "pt": "Eu sou professor",
  "question": "What does this mean?",
  "correct": "I am a teacher",
  "options": [
    "I am a teacher",
    "I am temporarily a teacher",
    "I have a teacher",
    "I work as a teacher",
    "I was a teacher",
    "I am the teacher"
  ],
  "unitTopic": "Ser"
}
```
