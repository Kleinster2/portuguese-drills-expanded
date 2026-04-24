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

### 11. **Economicity and Atomicity** (Universal)

**Principle:** Everything in this project — lessons, units, worksheets, exercises, drills, dialogues, pronunciation lessons, primers, even the working process with Gil — must be atomic and granularly incremental. Introduce exactly one new conceptual step at a time. No bundling, no "while we're at it," no three-things-at-once.

This principle governs all levels of the system, from curriculum design down to individual exercise items and the cadence of edits.

**Applies to — curriculum/unit design:**
- Each lesson teaches exactly what is needed for its target exercise — nothing more
- If a word, structure, or phoneme isn't required by the lesson's exercises or dialogue, don't introduce it
- Don't teach exceptions before teaching the rule (e.g., don't teach "countries without articles" before the student has practiced countries WITH articles)
- If a concept can live in its own unit, it should — even if it's related to the current topic
- Vocabulary in exercises should come from the lesson's teaching sections, not appear for the first time in the exercise

**Applies to — worksheet/drill design:**
- Section-to-section difficulty progression: each new section adds exactly one step of cognitive demand (see `/worksheet-review` item 16)
- Multiple-choice → sentence-frame fill → word-bank fill → open production — no skipping bridging steps
- Don't combine two grammar points into a single exercise section (e.g., articles + tense both being tested in the same blank)
- Each exercise item tests one target — no compound blanks that require two separate rules to solve correctly
- Drill prompts reveal information step by step — the student solves one sub-question at a time, not a multi-part sentence in one shot

**Applies to — dialogue and example construction:**
- A dialogue line adds at most one new structure beyond what the worksheet has taught
- Example sentences illustrate one grammar point at a time — not "here's the contraction AND the new tense AND the new vocabulary word" in the same sentence

**Applies to — the working process with Gil:**
- Propose one change at a time rather than bundling five edits in a single pass — Gil steers better when the change is isolable
- When reviewing or fixing, surface findings in order of severity and confirm before moving to the next layer, rather than silently fixing everything
- When scoping a lesson, propose one target concept and one pronunciation distinction — never three new concepts in one session
- When extending a worksheet, extend one section at a time; don't add Part D, E, F in one uncommented pass
- When refactoring content, make the minimal change that solves the stated problem — don't bundle unrelated cleanup

**Examples:**
- A lesson on self-introduction with ser/morar/trabalhar does NOT need ser vs estar — estar gets its own unit
- A lesson practicing "de + article" contractions does NOT need to mention that some countries lack articles — that's a separate unit
- A dialogue should use only vocabulary already defined in the worksheet, not introduce new words for flavor
- A drill testing the preterite does NOT also introduce a new connector word ("enquanto") in its prompts — that's a second unit
- When Gil asks "fix the phonetic bug," don't also reorder the pronunciation sections — those are two separate atomic changes

**Rationale:** Overloading dilutes focus. A tight lesson with fewer concepts practiced well beats a comprehensive lesson where nothing sticks. The same principle scales up and down: atomic units build atomic lessons build atomic worksheets build atomic exercises build atomic edit passes. When any level bundles, the whole system absorbs friction — students lose focus, Gil loses steering authority, errors hide inside compound changes.

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

### 20. **Always Show Translation for Portuguese**

**Principle:** Every Portuguese word, phrase, sentence, dialogue line, example, prompt, or UI label in teaching material must be paired with an English translation. Untranslated Portuguese is a wall that stops engagement.

**Application:**
- Inline parenthetical for short items: "Olá! (Hello!)", "morar (to live)"
- Below or beside the Portuguese for full sentences and dialogue lines
- Section titles, exercise instructions, vocabulary boxes, grammar examples — all get translations
- Don't assume a word is "obvious" because it was taught earlier. Translate it again.

**Exception — Transparent Cognates:**
Never gloss a cognate, even on first appearance. If an English speaker recognizes the Portuguese word on sight (Brasil, português, diálogo, pronúncia, banco, universidade, hospital, medicina, Estudante, Data, Professor, Nome), the gloss is noise — drop it. Write `Estudante: _______`, not `Estudante (Student): _______`; write `Parte I — Pronúncia`, not `Parte I — Pronúncia (Pronunciation)`. Applies across all student-facing surfaces (worksheets, lessons, drills, diagnostic test, chrome).

**Not cognates — still gloss:**
- Words without transparent cognate (morar, falar, obrigado, agora).
- False friends (`legal (cool)` in BP — looks like English "legal" but means informal "cool"). Always gloss to prevent wrong transfer.
- Borderline cases (escola/school, direito/law) — when in doubt, gloss.

**Exception — Text Simplifier:**
The simplifier (`config/prompts/simplifier-guidelines.md`) keeps its existing rule of skipping cognates (aeroporto, hospital, importante, etc.) to preserve readability. The blanket "always translate" rule does not apply to simplifier output.

**Rationale:** Students learning Portuguese constantly hit unknown words. Forcing them to guess from context or look up vocabulary breaks flow and discourages engagement. A translation alongside removes the friction without removing the learning — students still process the Portuguese first.

---

### 21. **Cloze Format for Dialogue Exercises**

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

### 22. **Standalone Materials — No References to Other Materials**

**Principle:** Every worksheet, primer, drill, or teaching document stands on its own. It teaches its content as fresh material. It does not reference prior lessons, future lessons, or adjacent materials.

**Banned framings in student-facing body:**
- "Recap of…", "Review of what you've learned"
- "So far", "earlier", "already", "previously", "covered before"
- "Next lesson", "next unit", "will be covered later"
- `NEW` tags or "new material" — these contrast with non-new = implicit reference
- "(cumulative)" on section titles
- Ordinal positioning: "this is the first primer that…", "four prior lessons"

**Banned framings in teacher notes:**
- "Still cannot do" (implies a sequence) → prefer "Out of scope for this primer"
- "Natural next lesson" pointers → remove or rephrase as adjacent topics without sequencing
- "We'll break that out in its own unit later"
- "Added with estar" / "covered cumulatively"

**What's fine:**
- Internal structure references ("see Parte II above", "as in the table on the left")
- Describing the material's own content ("this primer teaches X")
- Teacher notes listing adjacent topics by name without sequencing language

**Rationale:** Materials get reused, reordered, and assigned to students at different points. A primer that says "recap of what you've learned so far" breaks the moment it's given to a new student. A worksheet that says "next lesson covers X" makes sequence assumptions that may not hold. Sequencing belongs in curriculum docs and lesson plans, never inside the student-facing material.

**Procedural check:** Before declaring any material done, grep the file for: `so far`, `recap`, `Recap`, `earlier`, `next lesson`, `next unit`, `previously`, `already`, `covered before`, `prior`, `NEW`, `cumulative`. Any hit must be reframed or removed.

---

### 23. **Example Parsimony**

**Principle:** Each teaching example contains only the words needed to demonstrate the point being taught. Extra words are cut.

**Application:**
- Pronunciation contrast: show only the two sounds side by side, not a full sentence around them.
  - Bad: `Você é do Brasil? — closed ê, then open é.` (drags in `do`, `Brasil`, a question, an intonation pattern — none of which teach the ê/é contrast)
  - Good: `você é — closed ê, then open é.`
- Grammar rule: show the minimal pair or minimal sentence that exercises the rule.
  - Bad: `Eu moro no Brooklyn com a minha família. — shows em + o = no.` (family vocab, personal context — irrelevant to the contraction rule)
  - Good: `Eu moro no Brasil. — em + o = no.`
- Verb conjugation: show the bare form, not a story sentence.

**Relationship to Atomicity (§11):** §11 keeps a teaching *unit* to one concept; §23 keeps each *example within that unit* to the minimum words that exercise the concept. Both apply together — a unit can be atomic but its examples still bloated.

**Rationale:** Every extra word in an example (a) adds cognitive load, (b) may introduce vocabulary the student hasn't learned (scaffolding violation), and (c) dilutes the teaching signal so the student has to work harder to see what the example is actually showing. A minimum-viable example makes the point unmistakably — the contrast or rule is right there, with nothing else to decode.

**Procedural check:** For each teaching example, ask: if I delete any single word, does the example still demonstrate the point? If yes, delete it. Repeat until the example can't be cut further.

---

### 24. **No Fake Accents — Use Real Spellings Only**

**Principle:** Every Portuguese word is written with its real spelling. Never add a pedagogical acute or circumflex to a word that doesn't carry one, even to visually mark open vs closed vowel quality.

**Why:** The Portuguese acute/circumflex appears only when (a) stress falls on a non-default syllable (*você*, *português*, *avó*) or (b) a minimal pair needs disambiguating (*pôde* vs *pode*). Most stressed E and O sounds are written without any accent, and their open/closed quality is learned word by word. A primer that writes `móro`, `gósto`, or `cômo` teaches the student a false rule — "accent = open/closed marker" — which collapses the moment they see `moro`, `gosto`, or `como` in any real text. It also trains them to misread real texts: they see no accent and assume no sound distinction.

**Application:**

- Banned in all student-facing materials (primers, worksheets, lessons, drills, exercise items, answer keys, vocab boxes):
  - `móro`, `móra` → real: *moro*, *mora*
  - `gósto`, `gósta` → real: *gosto*, *gosta*
  - `cômo` (from *comer*) → real: *como*
  - `cóme` → real: *come*
  - `êle`, `éla`, `êsse`, `éssa` → real: *ele*, *ela*, *esse*, *essa*
  - `tôdo`, `tôdos`, `espôsa` → real: *todo*, *todos*, *esposa*
  - Any italicized PT token in a pronunciation-teaching context with an accent that isn't part of the real spelling
- Banned in teacher notes and internal memory files for the same reason — the convention has to stay clean in authoring habit, not just in student output.
- **Real accents are kept:** *você*, *português*, *café*, *ótimo*, *avó*, *avô*, *pôde* — all stay as written. Disambiguating accents (*pôr* vs *por*) stay.
- **Phonetic transliterations are a separate notation system and are fine.** `is-KÓH-lah`, `MÓH-roo`, `KÔH-moo` — ALL-CAPS or hyphenated respellings are pronunciation guides, not word spellings. Accents inside them mark stress and vowel quality. Keep the notation visually distinct from actual PT words (caps + hyphens is the current convention).

**How to teach open/closed on unaccented words (the honest replacement):**
- Use the real spelling.
- State the sound directly: *"In* moro *and* gosto *the O is open (law-sound), even though no accent is written."*
- Anchor on a real-accent minimal pair if one exists (*avó* vs *avô*) to establish the contrast, then explicitly note: "most stressed Os have no accent in writing — the sound has to be learned word by word."

**Caught Apr 2026 (primer-lessons-1-4, primer-dexter-lesson2, lessons/lesson-2):** Open-O teaching was using `móro`, `móra`, `gósto`, `gósta` as visual shorthand, and the -er/-ir alternation note used `cômo vs cóme`. All replaced with real spellings (*moro*, *mora*, *gosto*, *gosta*, *como* [I eat, closed], *come* [you eat, open]). The teaching box was rewritten to honestly state "spelling doesn't always tell you which sound" rather than implying the accent does.

**Procedural check:** After writing any material, grep for common fake-accent patterns — `móro`, `móra`, `gósto`, `gósta`, `cômo`, `cóme`, `êle`, `éla`, `tôdo`, `espôsa` — and fix any hits. Also inspect every italicized PT token next to an open/closed pronunciation label; if the accent isn't part of the real spelling, remove it.

---

### 25. **One Teaching Block, One Claim (with Category-Consistent Examples)**

**Principle:** Each explanatory paragraph or teaching block makes exactly one point. Supporting examples for that point must all belong to the same phonological/grammatical category so they illustrate the same rule, not overlapping rules.

**Two sub-rules:**

**25a. Single-claim blocks.** When drafting a teaching paragraph, name the one fact it's teaching before you write. If you can't reduce the paragraph's content to one sentence, split it into two blocks or cut the secondary material.

- Bad: *"Spelling doesn't always tell you which sound. The acute (ó) and circumflex (ô) are written only when the word needs a stress mark. Most stressed Os have no accent — you learn the sound word by word. In sou and como the O is closed; in moro and gosto it's open. Same spelling pattern, different sounds."* (Three claims: when accents appear, most Os unaccented, contrast examples. Each one competes for attention.)
- Good: *"You can't always tell from the spelling. When an O has no accent mark, it could be either sound. Como (how) is closed; moro (I live) is open. Neither word is marked — you learn the sound along with the word."* (One claim: unaccented Os can be either sound. Minimal contrast. Done.)

**25b. Category-consistent contrast examples.** When a teaching block uses examples to illustrate a contrast, every example must sit in the same phonological (or grammatical) context. Pulling an example from an adjacent-but-different category teaches an over-broad or incorrect generalization.

- Bad: Using *sou* and *como* together as examples of "closed O." *Sou*'s closed sound comes from the **ou** diphthong; *como*'s comes from an **interior stressed O**. Different phonological contexts, different rules. A student generalizing from both walks away thinking the rule applies across contexts when it doesn't.
- Good: Contrast *como* (closed interior O) with *moro* (open interior O). Both are interior stressed Os with no written accent — the contrast isolates exactly the distinction being taught.

**Test:** After drafting a teaching block, ask: *"If a reader asked what I just taught them, can I answer in one sentence?"* If no, the block is overloaded. Then ask: *"Do all my examples sit in the same phonological/grammatical slot?"* If no, at least one example is from the wrong category.

**Relationship to §11 and §23:**
- §11 (Atomicity) — one concept per curriculum unit.
- §23 (Example Parsimony) — minimum words within each example.
- §25 — one claim per explanatory block; all within-block examples share category.

Each operates at a different scale (unit → example → paragraph). All three must be satisfied simultaneously.

**Rationale:** Overloaded paragraphs force the student to parse three teaching signals simultaneously and pick the one that matters. Mixed-category examples train the student on a wider rule than the one being taught — which they then misapply. Both failures compound: a three-claim paragraph with a miscategorized example in it is a triple confusion. Clean paragraphs and clean contrast sets are how teaching parsimony extends from individual examples up to full explanatory prose.

**Caught Apr 2026 (primer-lessons-1-4 Open/Closed O box):** The teaching paragraph crammed three claims together and used *sou* (ou-diphthong closed O) in a contrast set aimed at interior stressed Os (*como*, *moro*, *gosto*). Replaced with a single-claim paragraph using only interior Os: *como* (closed) vs *moro* (open), no *sou*.

---

### 26. **Show the Phonetic Pronunciation, Don't Just Label It**

**Principle:** When teaching any pronunciation distinction in writing, the phonetic respelling is the primary teaching device — not an optional decoration around a label. Labels ("closed", "open", "nasal", "reduced") name the category; respellings deliver the sound.

**Why:** "*Como* is closed" is an abstraction. The student has to mentally translate "closed" into a sound they've never produced, applied to a word they haven't heard. "*Como* = **KÔH**-moo" shows the sound directly. Without the respelling, the student is studying categories. With it, they're studying sounds.

**How to apply:**

- Any teaching block describing a pronunciation feature (open/closed vowel, nasal, diphthong, consonant quality, reduced vowel, silent letter) includes the phonetic respelling **in the block** — not after it, not in a separate reference, not implied.
- Format: real PT spelling in italics + phonetic respelling in ALL-CAPS with the stressed syllable marked. Accents inside the respelling mark open/closed and stress — this is the transliteration notation (separate from PT orthography) permitted under §24.
  - *escola* = is-**KÓH**-lah
  - *como* = **KÔH**-moo
- When contrasting two sounds, place the respellings side by side so the contrast scans at a glance:
  - *como* (how) = **KÔH**-moo — stressed O is **closed**
  - *moro* (I live) = **MÓH**-roo — stressed O is **open**
- The label stays — it names the category. But the respelling is what teaches the sound.

**When a respelling is not needed:**
- Words whose pronunciation is fully determined by the real spelling — regular cognates, or minimal pairs whose accents already disambiguate (*avó* vs *avô*, *pôde* vs *pode*). The written accent does the work.
- **Derived/applied references** where the sound isn't the teaching. If an earlier block in the same material already taught the sound with respellings, downstream references (verb-pattern footnotes, exercise prompts, review bullets) don't need to repeat them. Respellings live at the *point of sound teaching*, not every mention.
  - Example: a Closed/Open O box teaches *como* = **KÔH**-moo / *moro* = **MÓH**-roo with respellings. A follow-up note like *"In -ar verbs the stressed O stays open: eu moro / você mora"* is a pattern fact, not a sound lesson — no respellings needed.
- Adding respellings outside the point of teaching creates visual noise that competes with the actual teaching point of that block (see §25 — one claim per block).

**Broader application:** not limited to vowel quality. Any time you're teaching *how something sounds* — consonant clusters (*nh*, *lh*), nasal vowels (*ão*, *em*, *im*), reduced vowels (final *-o* → "oo", final *-e* → "ee"), silent letters, diphthongs — lead with the respelling. A student who can read the respelling knows what to say; a student with only a label knows only what to call it.

**Relationship to §14 and §24:**
- §14 (Audio) — pronunciation must be audible at point of use (speaker buttons). §26 operates on the written axis: a respelling serves the same function when the student is offline (printed worksheet, primer). Both should be present when possible.
- §24 (No Fake Accents) — real PT spelling never gets invented accents. Phonetic respellings are a *different notation system* (ALL-CAPS, hyphens) and can use accents inside to mark open/closed without violating §24.

**Test:** After drafting any teaching block that mentions a sound, check: *Is the sound on the page, or only its label?* If only its label, add the respelling.

**Caught Apr 2026 (primer-lessons-1-4 Open/Closed O box):** The box first taught "*como* is closed; *moro* is open" in flat prose — ambiguous (two Os per word) and abstract. Bolding the stressed letter wasn't enough. The working fix was adding the respelling: *como* = **KÔH**-moo; *moro* = **MÓH**-roo. The respelling points at the stressed syllable and carries its quality on its face. Gil's validation: *"that is a good approach"* — specifically pointing at the respelling as the key move.

---

### 27. **Phonemic Integrity — Sound Contrasts Require Minimal Pairs**

**Principle:** Before teaching any sound contrast (open/closed, nasal/oral, reduced/full), verify it is a real phonemic distinction in the target variant — minimal pair exists, meaning changes. Labels like "open á" or "closed u" are only legitimate if removing the distinction changes word identity.

**Why:** Portuguese accents serve at least three different jobs: (a) stress location (*está* — stress falls on the last syllable), (b) vowel quality (*avó* vs *avô* — open vs closed O, different grandparent), (c) syllable or word disambiguation (*pôde* vs *pode* — tense differentiation). Teaching all three as "the accent tells you the sound" collapses distinct phenomena into one category and trains the student to listen for non-existent contrasts.

**How to apply:**

- **Before labeling a contrast:** produce a minimal pair. *avó/avô* justifies "open vs closed O." *sé/sê* justifies "open vs closed E." No minimal pair exists for "open vs closed A" in BP — the acute on *está* marks stress, not quality. Drop the label.
- **When an accent is a stress marker only:** teach stress position, not vowel quality. *está* is "is-TAH" (stress on last syllable); the á is just the normal open low /a/ that appears in *casa, fala, mora, nada*.
- **Exemplar discipline:** every word in a pronunciation block must be pulling its weight on phonetic grounds. Diagnostic: *remove the word — does any phonetic rule become under-exemplified?* If no, the word is there for grammar, not sound, and the block is cross-purposed.
- **Check adjacent categories aren't being smuggled in.** If a block is nominally about vowel quality but an example demonstrates a stress pattern or a reduction phenomenon, split the block.

**Test:** For every "open/closed X" or "nasal/oral X" label in the material, ask: *what's the minimal pair?* If you can't produce one, the label is cosmetic — remove it and teach the sound directly via respelling (§26).

**Relationship to §25 and §26:**
- §25 requires category-consistent examples within a block.
- §26 requires the sound on the page, not just the label.
- §27 is upstream of both: the *category itself* must be phonemically real before §25 can enforce consistency or §26 can attach a respelling.

**Caught Apr 2026 (primer-BP Part I estou/está):** Exercise A and its answer key taught *está* as an "open á" example, parallel to *café* (open é) and *avó* (open ó). But no "closed á" exists in BP to contrast against — the acute marks stress, not quality. Removing the row (and the whole *estou/está* block) eliminated a three-way category claim where only two legs were real.

---

### 28. **No Previews — Phase Discipline Is Absolute**

**Principle:** Earlier parts of a primer or curriculum must not anticipate material scheduled for later parts. Previews that feel "helpful" — giving the student a day-one payoff by seeding a grammar form early — fracture the phase discipline established by §10 and force the later part to un-teach assumptions.

**Why:** Phase discipline (eu → você → ele/ela → plural) is not a stylistic preference; it's a load-bearing constraint that lets each part stand on a closed set of forms. A preview breaks that closure: the student's mental model now contains a half-taught form introduced out of order, and the part that was supposed to *teach* it has to renegotiate with an existing impression. The "day-one payoff" can almost always be delivered with material that doesn't anticipate later grammar.

**How to apply:**

- **When tempted to preview, search for a no-morphology alternative first.** Before introducing *Estou bem* in Part I, ask: is there a canonical response that doesn't require a verb? (*Tudo bem* echo — same three words as the question, zero grammar imported from Part IV.)
- **Distinguish passive exemplification from active teaching.** A word can appear in an earlier part as a byproduct of a phonetic rule without being actively taught. *estou* as the ou→ô diphthong exemplar in Part I is passive exposure; a full "*eu estou* / *você está*" box with verb-meaning glosses is active teaching and violates the phase.
- **Vocabulary seeding is fine; morphology seeding is not.** Nationality adjectives (*brasileiro/americano*) seeded in Part II as vocabulary, then formalized as an agreement system in Part XI, is legitimate staging — no grammar import. Verb forms smuggled in from a later part are not.
- **If no no-morphology alternative exists and the material genuinely must appear early, the phase boundary is wrong.** Move the material's home, don't preview it.

**Test:** For every teaching block, ask: *does this block teach a form that is the subject of a later part?* If yes, either (a) remove it and find a no-morphology alternative, or (b) accept that the part boundary has drifted and restructure the phase.

**Relationship to §10:**
- §10 establishes the phase order (eu → você → ele/ela → plural).
- §28 enforces that the phase order is inviolable: a preview is a silent violation of §10 even if every part individually looks disciplined.

**Caught Apr 2026 (primer-BP Part I estou/está block):** An entire *estou/está* teaching block lived in Part I (nominally Pronunciation), delivering the greeting response *Estou bem* four parts before estar was formally introduced in Part IV. It passed review because Part IV still "owned" ser/estar — but Part IV had to open by teaching forms the student had been reading for five sections. Replacing *Estou bem* with the *Tudo bem* echo response in Part IV restored the phase and made Part IV's estar introduction clean.

---

### 29. **Answer Keys Are Primary Content**

**Principle:** An answer key is not a support artifact — it's the most authoritative teaching document in the material. Every content edit triggers a mandatory answer-key review pass. A claim in an answer key is categorical; the same claim in a grammar box can be hedged.

**Why:** Students treat answer keys as ground truth. A hedge in a grammar paragraph ("*como* is usually closed — you learn this word by word") reads as teaching and invites the student to listen. The same claim in an answer key ("*como* — **closed** (ô)") reads as fact and settles the question. When an answer key contains an error — a miscategorization, a form not actually used by natives, a claim that contradicts §24/§25/§27 — the error reaches the student with full authority, and the student has no hedge to push against.

**How to apply:**

- **Every edit to teaching content triggers an answer-key pass.** If you change an example, a rule, a phonetic claim, or a vocabulary item, open the answer key and check every reference. If you remove a row from an exercise, remove the corresponding answer-key row.
- **Apply the same audits to keys as to grammar boxes.** §24 (no fake accents), §25 (one claim per block), §26 (respellings at point of teaching), §27 (phonemic reality) — all apply inside answer keys.
- **Dead references in answer keys are errors.** An answer referencing an exercise item that no longer exists, or a grammar box that has been rewritten, misleads the student about what was taught.
- **Answer keys must match the variant of the material.** A BP worksheet's answer key must never use EP forms (enclisis, *tu* forms, *gostava* for polite requests) or vice versa.

**Test:** After any content edit, read the answer key section-by-section against the current exercise text. Ask: *does every answer still correspond to a live exercise item? is every claim in the answer still supported by current teaching? does every form pass the Native Usage Filter?*

**Relationship to all prior principles:**
- §27 (phonemic integrity) applies to answer keys the same way it applies to teaching boxes.
- §22 (standalone materials) extends: a worksheet's answer key must also be standalone — no references to removed exercises, earlier versions, or other materials.
- Native Usage Filter (below) applies categorically inside answer keys; a "correct" answer that no native would produce is a teaching failure.

**Caught Apr 2026 (primer-BP Exercise A answer key):** When the *estou/está* pronunciation block was removed from Part I, the answer key for Exercise A still listed *está — **open** (á)* and *estou — **closed** (ô)*. The first line propagated the rejected "open á" claim as categorical fact; the second referenced a removed exercise row. Both had to be deleted as part of the same edit — the answer-key sweep caught what a grammar-only pass would have missed.

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

### Pronunciation Reference Words (BP)

When describing a Portuguese vowel by analogy to an English word, use the canonical reference words below. Consistency across materials matters: a student who learns `ê = "bait"` in one primer should never encounter `ê = "say"` in another.

| Portuguese vowel | English reference | Example |
|---|---|---|
| closed **ê** | `"ai" in "bait"` | *você*, *português* |
| open **é** | `"e" in "bed"` | *é*, *café* |
| closed **ô** | `"oh" in "go"` | *sou*, *como* |
| open **ó** | `"aw" in "law"` | *ótimo*, *móra* |

**Teaching order — closed before open:** when a primer introduces the open/closed contrast, lead with the closed vowel. Closed ê [eɪ] and closed ô [oʊ] are the defaults an English ear already hears; they're also the sounds carried by the highest-frequency self-introduction tokens (*você*, *português*, *sou*, *como*). Anchoring on the familiar sound first, then introducing the open vowel as the contrast, is easier than the reverse. Apr 2026 decision — earlier primers listed open first by dictionary convention; flipped because the closed sound is both more familiar and more frequent.

**Why "bait" and not "say" for closed ê:** both English words share the [eɪ] diphthong, so phonetically they're equivalent, but "bait" has a final /t/ that cuts off the glide earlier — students tend to stretch the vowel less, landing closer to the Portuguese pure /e/. Decided Apr 2026 after a "say" reference was introduced in a newer primer and flagged as inconsistent with the older BP primer's standard.

**EP materials may use different reference words** (e.g., `closed ô = "boat"`, `open ó = "bought"` in the existing EP primer). That's fine — EP and BP are separate tracks (§2) and need not share phonetic analogies. Consistency is required *within* a variant, not across variants.

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

**2026-04-12:**
1. New Principle 20: Always Show Translation for Portuguese — every PT word/phrase/sentence in teaching material gets an English translation. Cloze Format renumbered 20 → 21.
2. Simplifier exempted: the text simplifier continues to skip cognates per its existing guidelines.
3. Total principles: 21 (was 20)

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

### Lead with the unmarked response

The Native Usage Filter is usually described as "reject forms natives don't use." It also has a second, quieter application: **among forms that natives do use, lead with the most frequent / unmarked variant.**

**The distinction:** "Correct but unused" forms (like EP *quereria*) are banned outright. "Correct and used but non-default" forms (like *Tudo ótimo* as a response to *Tudo bem?*) are fine to teach — but only after the unmarked default. Students should meet the modal response first; variants and ornaments come second.

**How to apply:**

- For every communicative function (greeting, agreement, thanks, polite request), identify the single most frequent real-world response in the target variant and lead with it.
- Layer ornaments on top of the default, never in place of it. Tiered structure helps: *Tudo bem* (echo, neutral) → *Estou bem* (estar + adj) → *Estou cansado / com fome* (specific state).
- When in doubt about frequency, search `.com.br` or `.pt` corpora for the function itself, not just the form. Quoted searches for *"tudo bem, e você"* vs *"tudo ótimo, e você"* reveal the modal response.

**Caught Apr 2026 (primer-BP Part IV greeting exchange):** The original box led with *Tudo bem? — Tudo ótimo! E você?* as the canonical exchange. Both parts are grammatical and both are used — but *Tudo bem* echo is the statistically unmarked response, and leading with *Tudo ótimo* taught a slightly enthusiastic variant as if it were default. Restructured as an explicit three-tier ladder (*Tudo bem* → *Estou bem* → *Estou cansado/com fome*) with the unmarked response on top.

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
