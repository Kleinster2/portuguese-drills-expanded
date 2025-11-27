# Text Simplifier Guidelines

This document outlines the rules and procedures for the Portuguese text simplifier across all CEFR levels.

## Overview

The simplifier takes text in any language and outputs Brazilian Portuguese at a target CEFR level with inline translations for words not deducible from English.

## Output Format

All levels use **inline translations** - no separate glossary or notes section.

```
Eu estou (estar - to be, temporary) no aeroporto faz (fazer - time elapsed) seis horas.
```

### Translation Rules

1. **Cognates** - Do NOT translate words recognizable from English:
   - aeroporto, horas, minutos, importante, problema, economia
   - restaurante, telefone, hotel, hospital, universidade
   - médico, música, família, etc.

2. **Non-cognate nouns/adjectives** - Translate in parentheses:
   - voo (flight), vizinha (neighbor, female), prédio (building)
   - cansado (tired), simpática (friendly, female)

3. **Verbs** - Show infinitive and meaning:
   - cancelaram (cancelar - to cancel)
   - disse (dizer - to say)
   - mora (morar - to live)

4. **Verbs with specific meanings** - Add context:
   - saber = to know (facts/how to do something)
   - conhecer = to know (people/places)
   - ser = to be (permanent/identity)
   - estar = to be (temporary/location)
   - ficar = to stay/become/be located
   - faz (time) = fazer - time elapsed

5. **Don't over-annotate**:
   - Don't translate common words after first appearance
   - Keep text readable

## A1 Level (Beginner)

### Allowed Grammar

| Structure | Example |
|-----------|---------|
| Present tense | Eu falo, ela come |
| Preterite (simple past) | Eu falei, ela comeu |
| Immediate future (ir + inf) | Eu vou falar |

### Forbidden Grammar

- Subjunctive (any form)
- Conditional tense
- Simple future tense
- Imperfect tense
- Compound tenses
- **Passive voice** (ZERO TOLERANCE)

### Passive Voice Prohibition

**NEVER use ser/estar + past participle:**

| Forbidden | Correct |
|-----------|---------|
| Meu voo foi cancelado | Eles cancelaram meu voo |
| O livro foi escrito por ele | Ele escreveu o livro |
| A casa foi construída | Eles construíram a casa |
| O produto é vendido aqui | Eles vendem o produto aqui |

When subject is unknown, use:
- "eles" (they) - PREFERRED
- "a empresa" (the company)
- "as pessoas" (people)
- "alguém" (someone)

### Haver Prohibition

**NEVER use "há" - too formal for A1:**

| Forbidden | Correct | Meaning |
|-----------|---------|---------|
| Eu estou aqui há duas horas | Eu estou aqui faz duas horas | Time duration |
| Há muitas pessoas | Tem muitas pessoas | There is/are |
| Não há problema | Não tem problema | There is no... |

### Pronoun Rule

Always use **"você"** for "you" (singular). Never use "tu".

### Sentence Structure

- Maximum 10-12 words per sentence
- Simple Subject-Verb-Object structure
- Basic connectors only: e (and), mas (but), porque (because), então (so/then)
- Avoid relative clauses (que, o qual)

## A2 Level (Elementary)

### Additional Allowed Grammar

- Imperfect tense (estava, tinha, era)
- More complex connectors (quando, enquanto, porque)
- Relative clauses with "que"

### Still Forbidden

- Subjunctive
- Conditional
- Passive voice (can be introduced sparingly)

## B1 Level (Intermediate)

### Additional Allowed Grammar

- Present subjunctive (basic uses)
- Conditional tense
- Passive voice (allowed)
- Future tense
- More complex sentence structures

### Simplification Focus

- Reduce highly formal/literary vocabulary
- Break very long sentences
- Explain idiomatic expressions

## B2 Level (Upper-Intermediate)

### Additional Allowed Grammar

- All subjunctive forms
- Complex conditional structures
- Literary/formal constructions

### Simplification Focus

- Minimal simplification
- Replace archaic/rare vocabulary
- Maintain original style when possible

## Common Verb Translations

| Verb | Context | Translation |
|------|---------|-------------|
| saber | facts/skills | to know (facts/how to) |
| conhecer | people/places | to know (people/places) |
| ser | permanent | to be (permanent/identity) |
| estar | temporary | to be (temporary/location) |
| ficar | location/become | to stay/become/be located |
| faz | time duration | fazer - time elapsed |
| ter | possession | to have |
| ter | there is (informal) | there is/are |

## Quality Checklist

Before outputting simplified text, verify:

- [ ] No forbidden grammar for target level
- [ ] No passive voice (A1/A2)
- [ ] No "há" - use "faz" or "tem" (A1)
- [ ] Cognates not translated
- [ ] Non-cognates have inline translations
- [ ] Verbs show infinitive form
- [ ] Context verbs have usage notes
- [ ] Sentences are appropriate length
- [ ] No preamble or glossary section
