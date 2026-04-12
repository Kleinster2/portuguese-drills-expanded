# Portuguese Drills Pedagogy & Design Principles

**Author:** Klein
**Last Updated:** 2026-03-04
**Status:** Living Document

---

## 🚀 Quick Start for Claude Code Sessions

**To load this methodology at the start of any session, simply say:**

```
Read PEDAGOGY.md
```

Or:

```
Read and apply the principles from PEDAGOGY.md
```

I will then internalize all principles and be ready to apply them to any question design or restructuring tasks.

---

## Variant Tagging (MANDATORY)

Every drill, worksheet, and exercise must be tagged with its Portuguese variant: **BP** (Brazilian) or **EP** (European). The platform defaults to BP.

**Why this matters:** BP and EP diverge in grammar, not just pronunciation. Teaching the wrong variant's forms confuses students and builds habits they'll have to unlearn.

### Rules:
1. **Tag everything.** Every drill JSON should have a `variant` field ("BP" or "EP"). Every printed worksheet should state the variant in the header.
2. **Never mix variants.** A BP drill contains zero EP forms. An EP drill contains zero BP forms. No contrastive exercises. No "in Brazil they say X, in Portugal they say Y." Completely separate tracks.
3. **Apply the variant's usage patterns.** Key divergences:
   - Politeness forms (condicional in BP vs imperfeito in EP — see Native Usage Filter below)
   - Gerúndio vs a + infinitivo ("estou fazendo" BP vs "estou a fazer" EP)
   - Tu conjugations (standard in EP, rarely drilled in BP)
   - Pronoun placement (proclisis default in BP, enclisis default in EP)
   - Vocabulary (ônibus/autocarro, trem/comboio, celular/telemóvel, etc.)
4. **Student variants:** Marvin = EP. All other students = BP. Default platform drills = BP. Always check before creating content.

### For printed worksheets:
- Header must state: "Português Europeu" or "Português Brasileiro"
- All example sentences, vocabulary, grammar, and answer keys must be 100% in that variant
- No footnotes about the other variant. No comparisons. Clean separation.

---

## Core Pedagogical Principles

### 1. **Eu/Você First, Then Ele/Ela, Then Plural**

**Principle:** Start with "eu" and "você" together — because any real conversation requires both. Use self-introduction dialogues to teach both forms from the start. Only after mastering eu/você do we introduce other subjects.

**Self-introduction sequence (absolute beginners):**
1. **Name**: Eu sou o/a [name] — NOT "Meu nome é" (too formal, not how Brazilians actually introduce themselves)
2. **Nationality**: Eu sou brasileiro/a, americano/a — adjective agreement (o/a) previews a pattern used everywhere
3. **Origin**: Eu sou de [city] / Eu sou do/da [country]
4. **Residence**: Eu moro em [city]
5. **Work/Status**: Eu sou professor / Eu trabalho em/como...
6. **Languages**: Eu falo [language] — last, because it's subordinate to the other identity-forming statements

**Progression:**
1. **Phase 1:** eu/você — self-introduction and addressing others directly. These are inseparable in a dialogue: "Eu sou de Brasília. E você?" requires both forms.
2. **Phase 2:** ele/ela — describing others ("Ele é do Brasil. Ela mora em São Paulo.")
3. **Phase 3:** a gente — informal "we" (conjugates as 3rd person singular)
4. **Phase 4:** Plural subjects — nós, vocês, eles/elas

**Rationale:** You can't have a conversation with just "eu." Every dialogue requires "você" — questions, redirects ("E você?"), verb echo answers. Teaching eu/você together reflects how language actually works: two people talking.

---

### 2. **Conjugation-Pattern Pedagogy (Singular Before Plural)**

**Principle:** Finish introducing ALL singular pronouns and everything that conjugates in the singular BEFORE moving on to the plural.

**Singular Subjects (Master First):**
- eu (I)
- você (you - singular, formal)
- ele/ela (he/she)
- a gente (we - informal, conjugates as 3rd person singular)
- alguém (someone)
- ninguém (no one)
- todo mundo (everyone)

**Checkpoint:** Unit 40 = 100% singular subjects mastered

**Plural Subjects (Introduce After Checkpoint):**
- nós (we - formal)
- vocês (you all)
- eles/elas (they)

**Rationale:** Singular conjugation patterns are simpler and more common. Mastering singular before plural reduces cognitive load and builds solid foundation.

---

### 3. **Implicit Subjects (Pronoun Dropping)**

**Principle:** After introducing "eu" thoroughly, teach that "eu" can be dropped (implicit subjects).

**Teaching Sequence:**
1. Introduce with explicit "eu": "Eu moro em São Paulo"
2. Practice extensively with explicit subject
3. Then introduce implicit form: "Moro em São Paulo"
4. Explain that Portuguese often drops pronouns when context is clear

**Rationale:** Students understand the conjugation pattern before learning shortcuts.

---

### 4. **Yes/No Answer Pattern (Verb Echo)**

**Principle:** Portuguese answers yes/no questions by echoing the verb, not by saying "sim" or "não" alone. This is non-obvious to English speakers and must be taught explicitly from the first lesson.

**The pattern:**
- **Yes:** Sim, [verb]. — "Você mora em Nova York?" → "Sim, moro." (or just "Moro.")
- **No:** Não, não [verb]. — "Você mora em Nova York?" → "Não, não moro."

**Key points to teach:**
1. A bare "sim" or "não" is grammatically possible but sounds incomplete — like answering "Do you live in New York?" with just "Yes." instead of "Yes, I do."
2. The verb echo carries the real confirmation/denial. In casual speech, the "sim" is often dropped entirely: just "Moro." or "Não moro."
3. **The verb conjugates for the answerer's subject, not the questioner's.** "Você mora?" → "Moro." (eu), not "Mora." This is the critical point — the echo is the same verb but shifted to first person. Same applies in reverse: "Eu estou atrasado?" → "Está." (você).
4. Negative answers use "não" twice: once as the interjection ("no"), once as the verb negator ("not"). English speakers will resist this — it feels redundant to them.
5. This pattern applies to all verbs, all tenses. It's structural, not vocabulary.

**Teaching sequence:**
1. Introduce with full form: "Sim, eu moro." / "Não, eu não moro."
2. Then drop the pronoun (connects to Principle 3): "Sim, moro." / "Não, não moro."
3. Practice extensively through Q&A pairs using self-introduction verbs (morar, falar, trabalhar)

**Anti-Pattern:** Teaching "sim = yes, não = no" as standalone vocabulary without the verb echo. This produces students who answer "Sim." to everything, which sounds unnatural.

**Rationale:** This is one of the first structural differences between Portuguese and English that beginners encounter. Getting it right early prevents fossilized English-transfer habits.

---

### 5. **Each Subject Introduction is Its Own Unit**

**Principle:** Each new pronoun/subject type deserves dedicated introduction in its own unit.

**Examples:**
- Unit for introducing "ele/ela"
- Separate unit for introducing "você"
- Dedicated unit for "a gente"
- Unit for indefinite pronouns (alguém, ninguém, todo mundo)

**Rationale:** Prevents overwhelming students with multiple subjects at once. Allows focused practice with each new subject type.

---

### 6. **Grammar in Service of Communication**

**Principle:** Don't teach grammar mechanics in isolation. Always contextualize within meaningful communication goals.

**Application:**
- Definite articles taught through "I have THE dog" (self-introduction context)
- Adjective agreement taught through "I have a tall friend" (describing relationships)
- All grammar serves the goal of self-introduction in Phase 1

**Anti-Pattern:** Teaching "the boy is here" just to demonstrate articles when it doesn't serve self-introduction goals.

**Rationale:** Students learn grammar as a tool for real communication, not as abstract rules.

---

### 7. **Centrality Ranking for Vocabulary**

**Principle:** Prioritize universal, high-frequency vocabulary over situational vocabulary.

**The Self-Introduction Trinity (Most Central -ar Verbs):**
1. **morar** - Where you live (everyone lives somewhere)
2. **falar** - What you speak (language ability is fundamental)
3. **trabalhar** - Where you work (most adults work)

**Less Central Verbs:**
4. **estudar** - What you study (only students, situational)
5. **ficar** - Where you stay (less common than morar)

**Application:** Units 7-9 form the trinity with dedicated, parallel structure. Less central verbs come after or are deprioritized.

**This applies to all vocabulary, not just verbs.** Every noun, adjective, and expression in exercises must pass the centrality test. "Professor" and "escola" are universal — everyone knows teachers and schools. "Engenheiro" and "firma" are niche — they waste a vocabulary slot on words the student is unlikely to use or encounter in basic conversation.

**Rationale:** Teach what everyone needs first, situational vocabulary second.

---

### 8. **Parallel Unit Structure for Related Concepts**

**Principle:** When teaching related concepts, use parallel structure across units.

**Example - The Trinity (Units 7-9):**
- Unit 7: morar (C + P questions, same structure)
- Unit 8: falar (C + P questions, same structure)
- Unit 9: trabalhar (C + P questions, same structure)

**Benefits:**
- Students recognize patterns
- Reduces cognitive load
- Creates coherent learning narrative

---

### 9. **Frequency Over Grammar Complexity**

**Principle:** "Gostar" (to like) is more important than "precisar" (to need) even though both use "de".

**Application:**
- Gostar taught in Phase 1 (Unit 19)
- Precisar moved to Phase 2 (Unit 25)

**Rationale:**
- Expressing preferences is more fundamental than expressing needs
- Daily usage frequency matters more than grammatical similarity
- Natural acquisition order

---

### 10. **Pure Phase Focus**

**Principle:** Each phase should have clear, unified focus without violations.

**Phase 1 Achievement:**
- 100% eu/você focus
- 0% violations (no ele/ela/generic nouns in core content)
- Complete self-introduction toolkit with dialogue capability

**Rationale:** Mixed subjects break learning narrative and dilute focus.

---

### 11. **Economicity and Atomicity**

**Principle:** Do not overload a unit or lesson with content that could be left to another unit. Each lesson teaches exactly what is needed for its target exercise — nothing more.

**Rules:**
- If a word, structure, or phoneme isn't required by the lesson's exercises or dialogue, don't introduce it
- Don't teach exceptions before teaching the rule (e.g., don't teach "countries without articles" before the student has practiced countries WITH articles)
- If a concept can live in its own unit, it should — even if it's related to the current topic
- Vocabulary in exercises should come from the lesson's teaching sections, not appear for the first time in the exercise

**Examples:**
- A lesson on self-introduction with ser/morar/trabalhar does NOT need ser vs estar — estar gets its own unit
- A lesson practicing "de + article" contractions does NOT need to mention that some countries lack articles — that's a separate unit
- A dialogue should use only vocabulary already defined in the worksheet, not introduce new words for flavor

**Rationale:** Overloading dilutes focus and overwhelms beginners. A tight lesson with fewer concepts practiced well beats a comprehensive lesson where nothing sticks.

---

### 12. **Show All Main Meanings**

**Principle:** When introducing vocabulary, always show all main meanings of a word, not just the one used in the current context.

**Example:**
- ✅ **de** = from, of
- ❌ **de** = from (only showing contextual meaning)

**Rationale:** Students benefit from seeing the full picture. They can figure out which meaning applies in context. This builds deeper vocabulary understanding and prepares them for encountering the word in different situations.

**Application:**
- Vocabulary lists show all primary translations
- Inline definitions include multiple meanings separated by commas
- Trust the student to apply the correct meaning from context

---

### 13. **All Portuguese Text Should Be Hoverable**

**Principle:** Every Portuguese word or phrase in a lesson should benefit from the hover dictionary, not just example sentences.

**Application:**
- Pattern templates like "Eu sou de + [city]" should be hoverable
- Vocabulary words in explanations (e.g., "sou" in "Why sou?") should be hoverable
- Inline Portuguese in English text should be wrapped with `data-hoverable="true"`

**Implementation:**
```html
<!-- Pattern template -->
<span data-hoverable="true">Eu sou de</span> + [city]

<!-- Vocabulary in explanation -->
<strong data-hoverable="true">sou</strong> = am
```

**Rationale:** Students may encounter unfamiliar words anywhere in the lesson, not just in example sentences. Consistent hover support reduces friction and encourages exploration.

---

### 14. **Pronunciation Must Be Audible and At Point of Use**

**Principle:** Any time a phoneme, sound, or pronunciation is mentioned in text, a speaker button must be immediately available to hear it. Pronunciation guides belong **at the point of first use**, not in a separate section pages earlier.

**Application:**
- Pronunciation notes (e.g., "'de' sounds like 'djee'") must include a speaker button
- Phonetic explanations should let students hear the sound instantly
- Don't describe a sound without providing a way to hear it
- When a word like "de" or "em" first appears in an exercise, include its pronunciation inline — don't assume the student remembers a pronunciation section from earlier

**Example:**
```html
<div class="pronunciation-note">
    <strong>Pronunciation:</strong> "de" sounds like "djee"
    <button class="speaker-btn" data-text="de">🔊</button>
</div>
```

**Rationale:** Reading about pronunciation is insufficient. Students need to hear sounds immediately when they're being explained. The moment of explanation is the moment of highest curiosity.

---

### 15. **Vocabulary Scaffolding (Define Before You Use, Never Repeat)**

**Principle:** Never use a Portuguese word in an exercise that hasn't been explicitly defined. Every word appearing in a prompt, question, or exercise must have been introduced — either in a vocabulary box, inline definition, or prior section. And never repeat vocabulary across exercises — each exercise should introduce or test different words.

**Application:**
- Add **vocabulary boxes** immediately before each exercise section containing every new word that section uses
- Even simple function words (onde, em, de, mas, porque) need explicit introduction for absolute beginners
- If a section uses "Onde você mora?", the student must have seen "onde = where" before reaching that exercise
- **Every exercise uses different vocabulary.** If exercise 1 uses "aeroporto", no other exercise in that section uses "aeroporto". This maximizes exposure to new words and prevents lazy repetition.

**Anti-Patterns:**
- Using "Qual é o seu nome?" in exercise B when "qual" was never introduced. The student stares at an unknown word and can't engage with the exercise.
- Using "contente" in exercises 7 and 10 of the same section. That's a wasted slot — exercise 10 should introduce a different word.

**Rationale:** Undefined vocabulary creates a wall. Repeated vocabulary wastes exposure. Every exercise slot is a chance to teach something new.

---

### 16. **Pronunciation Examples Should Preview Later Vocabulary**

**Principle:** Don't use throwaway examples in pronunciation sections that never reappear. Instead, seed vocabulary from upcoming exercises so students encounter each word twice — once as a sound example, once in context.

**Application:**
- T palatalization: use **contente**, **quente** (not noite, arte)
- D palatalization: use **dinheiro**, **cidade** (not just dia)
- R/RR: use **Rio** (not carro, if carro never appears)
- Soft R: use **mora**, **para**
- Final -o: use **obrigado** (not lado)
- -em nasal: use **contente** (not cem)

**Rationale:** Every example is a teaching opportunity. If a student learns the "chee" sound through "contente" and then meets "contente" in an exercise five minutes later, the double exposure reinforces both pronunciation and meaning. Throwaway examples waste that opportunity.

---

### 17. **Comprehension Before Production (But Not Too Much)**

**Principle:** Balance comprehension and production appropriately for level.

**Phase 1 Balance:**
- Comprehension: 21.9% (7 questions)
- Production: 78.1% (25 questions)

**Phase 2 Balance:**
- Comprehension: 7.6% (6 questions)
- Production: 92.4% (73 questions)

**Rationale:** Beginners need more comprehension to build confidence. As students advance, shift toward active production.

---

### 18. **Interleaved Structure (Teach Then Immediately Exercise)**

**Principle:** After teaching a concept, exercise it immediately — before moving to the next concept. Don't batch all teaching sections first and all exercises second.

**Structure:**
- Teach topic A → Exercise A
- Teach topic B → Exercise B
- Teach topic C → Exercise C
- Synthesis exercises (translation, dialogue) come last

**Anti-Pattern:** Teaching prepositions, contractions, verb echo, and residence all upfront, then presenting exercises A–D at the end. By the time the student reaches Exercise A, they've forgotten the preposition rules under the weight of everything else.

**Rationale:** Immediate practice reinforces the concept while it's fresh. Batching creates cognitive overload and forces students to page back to the teaching section.

---

### 19. **Dialogue as Synthesis Exercise**

**Principle:** The dialogue is the culminating exercise of a lesson, not the starting point of its design. First determine what the lesson should teach (based on the previous lesson's capability inventory), then build teaching sections and exercises, then write a dialogue that synthesizes everything taught.

**Process:**
1. Review the previous lesson's capability inventory (what the student can/can't do)
2. Determine the lesson's target capabilities — what should the student be able to do after this lesson?
3. Build teaching sections and exercises for exactly those capabilities (interleaved per Principle 18)
4. Write a dialogue that uses everything taught — the dialogue is the final exercise
5. Verify: every word in the dialogue was defined in the lesson; every target structure appears in the dialogue

**Anti-Pattern:** Writing the dialogue first and deriving the lesson from it. This over-constrains the lesson's scope to what fits naturally in one conversation, and may miss capabilities the student needs.

**Rationale:** The lesson serves the student's progression, not the dialogue. The dialogue serves the lesson — it's a synthesis exercise that proves the student can combine everything in a real conversation.

---

### 20. **Cloze Format for Dialogue Exercises**

**Principle:** Dialogue exercises should use cloze (fill-in-the-blank) format, not fully blank lines. Provide the sentence structure with specific words blanked out — targeting the grammar points being tested.

**Example (good — cloze):**
- Eu sou _________ Brasília. Eu sou _________ Ana!
- (tests: de, a — preposition and article)

**Example (bad — fully blank):**
- _________________________________ (student must guess the entire line)

**Scaffolding difficulty:**
- Easier: one blank per sentence ("Não, não _________ .")
- Harder: multiple blanks ("Não, _________ _________ . Eu estudo direito, _________ universidade _________ Califórnia.")

**Rationale:** Fully blank lines require clairvoyance — the student must guess what the speaker would say with no structural support. Cloze format focuses attention on the target grammar while the surrounding text provides context. It also allows graduated difficulty by controlling the number and type of blanks.

---

## Design Guidelines

### Question Design

1. **Chips (Multiple Choice Options):**
   - Average 10 options per question
   - Include plausible distractors:
     - Different verb persons (sou/és/é/somos/são)
     - Different verb tenses (present/past/future)
     - Similar verbs (ser/estar/ficar)
     - Related prepositions (de/do/da/em/no/na)

2. **Comprehension Questions:**
   - Show complete, natural Portuguese sentences
   - Focus on "eu" in Phase 1
   - 6 options for multiple choice
   - Test meaning recognition, not just translation

3. **Production Questions:**
   - Test active recall and conjugation
   - Blanks require selecting correct form from chips
   - Focus on forms students will use immediately

### Unit Organization

1. **Phase 1 (A1 - Beginner):**
   - Units 1-19: Core self-introduction
   - Unit 21: Transitional (less central content)
   - Total: 30-32 questions

2. **Phase 2 (A2 - Elementary):**
   - Units 22+: Introduce other subjects
   - Expand verb tenses (preterite focus)
   - Introduce pronouns (reflexive, object)

3. **Unit Gaps Are Intentional:**
   - Not all numbers 1-21 need to exist
   - Gaps allow for future expansion
   - Focus on logical grouping, not sequential numbering

---

## Question Conversion Guidelines

### When to Convert a Question

Convert when it violates Phase 1's "pure eu" focus:
- Uses você, ele, ela as subject
- Uses generic nouns (the boy, the girls)
- Doesn't serve self-introduction goals

### How to Convert

1. **Subject-only changes:**
   - "You have a house" → "I have a house"
   - "He likes to study" → "I like to study"

2. **Subject + content changes:**
   - "The boy is here" → "I have the dog" (teaches same grammar)
   - "The tall boy" → "I have a tall friend" (teaches same agreement)

3. **Test focus changes:**
   - "Eu trabalho __ hospital" (testing preposition) → "Eu __ no hospital" (testing verb)

### What NOT to Change

- Don't sacrifice grammar teaching objectives
- Don't make conversions that lose pedagogical value
- Ensure chips remain appropriate for new question

---

## Key Metrics to Track

### Phase 1 Metrics
- ✅ "Eu" questions: Should be 100%
- ✅ Comprehension/Production ratio: ~20/80
- ✅ Converted questions: Track count and type
- ✅ The Trinity coverage: Units 7-9 complete

### Phase 2+ Metrics
- Subject distribution (track all pronouns)
- Indefinite pronoun coverage (alguém, ninguém, todo mundo)
- Checkpoint: 100% singular before plural introduction

---

## Evolution Notes

### Major Changes Log

**2025-01-06:**
1. Pure self-introduction transformation (9 questions converted)
2. Gostar/Precisar swap (frequency over similarity)
3. -ar verb restructuring (The Trinity established)
4. Ficar deprioritization (centrality ranking applied)

**2026-03-04:**
1. Added self-introduction sequence with specific ordering (name → nationality → origin → residence → work → languages)
2. "Eu sou o/a" replaces "Meu nome é" as BP default (native usage filter)
3. New Principle 4: Yes/No Answer Pattern — verb echo (sim, moro / não, não moro), not bare sim/não
4. New Principle 14: Vocabulary Scaffolding — define every word before exercises use it
5. New Principle 15: Pronunciation examples should preview later vocabulary (double exposure)
6. Pronunciation at point of first use added to Principle 13
7. All principles renumbered (4→5, 5→6, etc.) to accommodate new additions

**2026-03-06:**
1. Removed nationalities from beginner materials — "de + place" is transferable, nationality adjectives are a closed set
2. Self-intro sequence updated: name → origin → residence → work/status → languages (no nationality)
3. Centrality ranking extended to all vocabulary, not just verbs
4. Worksheet checklist and layout rules moved to skills (`/worksheet-review`, `/worksheet-layout`) to keep PEDAGOGY.md focused on methodology

**2026-03-08:**
1. New Principle 11: Economicity and Atomicity — don't overload units with content that belongs elsewhere
2. New Principle 18: Interleaved Structure — teach then immediately exercise, don't batch
3. New Principle 19: Dialogue-First Worksheet Design — dialogue defines scope, worksheet serves it
4. New Principle 20: Cloze Format for Dialogues — partial sentences with targeted blanks, not fully blank lines
5. Total principles: 20 (was 17)

---

## Quick Reference: Decision Framework

When making changes to questions or units, ask:

1. **Does it serve self-introduction in Phase 1?** If no, move it or convert it.
2. **Is it singular or plural?** Singular comes first.
3. **How central is this vocabulary?** Most central gets priority.
4. **Does it maintain pure "eu" focus in Phase 1?** If no, convert or remove.
5. **Is the grammar taught in meaningful context?** If no, recontextualize.
6. **Do related units have parallel structure?** If no, align them.
7. **Is the frequency appropriate for the level?** High-frequency first.

---

## Native Usage Filter (MANDATORY)

**Rule: Never teach a form that a native speaker wouldn't use in conversation.**

When generating drills or worksheets, every verb form, expression, and construction must pass this test:

> "Would an educated native EP speaker actually say this in real life?"

If the answer is no — even if the form is prescriptively correct — **do not include it in a drill without an explicit usage note.**

### Key cases where prescriptive grammar ≠ EP usage:

| Prescriptive form | What EP speakers actually say | Context |
|-------------------|-------------------------------|---------|
| eu **quereria** (condicional) | eu **queria** (imperfeito) | Polite requests, hypotheticals |
| eu **poderia** (condicional) | eu **podia** (imperfeito) | Ability, permission |
| eu **deveria** (condicional) | eu **devia** (imperfeito) | Obligation, advice |
| tu **haverias de** (condicional) | tu **havias de** (imperfeito) | Futurity/intention |
| futuro do indicativo (eu farei) | ir + infinitivo (eu vou fazer) | Future actions (spoken) |

**In EP, the imperfeito has largely replaced the condicional for querer, poder, dever, and haver de.** The condicional forms exist grammatically but sound overly formal/literary. Teaching them without this context misleads students into learning forms they'll never hear.

### The imperfeito-condicional overlap as a teaching moment

The EP use of imperfeito in place of the condicional is **not colloquial or informal** — it is standard spoken Portuguese at all registers. This should be taught explicitly, not avoided:

**What to teach:**
1. The condicional form exists (quereria, poderia, deveria) — students should recognize it in writing and formal contexts
2. In speech, EP speakers use the imperfeito instead (queria, podia, devia) — this is the default, not a shortcut
3. This means the imperfeito carries **double duty** in EP: past habitual ("quando era criança, queria ser médico") AND polite/hypothetical ("queria um café, por favor")
4. Context disambiguates — students need to learn to read context, not rely on the verb form alone
5. The condicional still has distinct uses in EP: counterfactuals with "se" clauses ("se eu fosse rico, **compraria** uma casa"), formal writing, and news attribution ("o ministro **teria** dito que...")

### Content creator reference: EP vs BP divergence table

**This is for Gil and AI content generators only. Never expose this to students.**

| Feature | BP (Christian, platform default) | EP (Marvin) |
|---------|----------------------------------|-------------|
| Polite requests | Condicional: gostaria, poderia, deveria | Imperfeito: gostava, podia, devia |
| Progressive | Gerúndio: estou fazendo | a + infinitivo: estou a fazer |
| Tu forms | Regional (drill você) | Standard (drill tu) |
| Pronoun placement | Proclisis default: me diga | Enclisis default: diga-me |
| "Eu queria um café" | ✅ Works | ✅ Works (one of few crossovers) |
| "Eu gostava de ir" | ❌ Past tense only | ✅ Standard polite |
| "Eu gostaria de ir" | ✅ Standard polite | ⚠️ Overly formal |
| Bus | ônibus | autocarro |
| Phone | celular | telemóvel |
| Train | trem | comboio |

**Drill design implication for EP:** The best exercise isn't "conjugate querer in the condicional" — it's "here are 5 situations, which form would a Portuguese speaker use and why?" For BP, the condicional forms (gostaria, poderia, deveria) are the standard polite forms and should be drilled normally.

### Corpus verification (MANDATORY enforcement)

The Native Usage Filter is enforced by **searching real-world Brazilian/Portuguese corpora before any form enters teaching material** — drills, worksheets, diagnostic questions, simplifier output, dialogue examples. Training-data grammar knowledge is not a substitute.

**Rule:** Before asserting that any Portuguese form is correct, natural, or appropriate for a given level, search the corpus. If a construction returns few or no natural hits, rewrite it.

**Where it applies:**
- Every sentence drafted for a drill, worksheet, or diagnostic test question
- Every article/preposition choice with proper nouns (place names, neighborhoods, institutions)
- Every claim about pronunciation, vowel quality, or verb alternation
- Every "in BP/EP they say X" assertion
- Any time a prescriptive rule and native usage might diverge

**How to search:**
- **BP content:** quoted searches on `.com.br` sources (e.g., `"o amigo está ocupado" site:.com.br`)
- **EP content:** quoted searches on `.pt` sources
- Never cite an EP source as evidence for BP usage, or vice versa
- If WebFetch returns 403/blocked, switch to Chrome browser tools — do not skip the search

**Why this is mandatory:** A sentence can be 100% grammatically correct and still be something no native speaker would ever say. Teaching those forms builds bad instincts the student has to unlearn. Past failures this rule addresses:
- Claimed `"de Brooklyn"` was correct when BP universally uses `"do Brooklyn"` (.com.br evidence)
- Claimed `-ar` verbs alternate open/closed O between `eu` and `você` (they don't)
- Used `"O amigo ocupado."` as a diagnostic test stem when bare attributive noun phrases are not natural BP

### Worksheet quality

Use `/worksheet-review` for the full content and dialogue checklist.
Use `/worksheet-layout` for CSS and print formatting rules.

---

## Teaching Philosophy Summary

> "Start with self. Master singular. Teach in context. Prioritize frequency. Build systematically. **Never teach a form nobody uses.**"

The student should be able to introduce themselves completely and confidently before learning to talk about others. Every grammatical concept should serve this communicative goal, taught in order of universal applicability and daily usage frequency.
