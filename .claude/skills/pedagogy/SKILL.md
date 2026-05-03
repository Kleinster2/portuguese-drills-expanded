---
name: pedagogy
description: Apply the Brazilian/European Portuguese teaching methodology to any learner-facing content — drills, worksheets, primers, dialogues, exercises, diagnostics, lesson plans, even small edits. Enforces hard rules (no fake accents, BP/EP separation, paulista respellings, native usage filter, line-by-line English glossing, Estudante/Data worksheet headers) and loads PEDAGOGY.md for the rest. Use whenever creating OR editing any text a Portuguese learner will see, even short fixes.
---

# Pedagogy

The hard rules below are the floor — apply them before anything else. The full doctrine, with examples and rationale, lives in `PEDAGOGY.md` at the project root; read it for context and detail beyond what's here.

## Hard rules

1. **No fake accents on Portuguese words (PEDAGOGY §24).** Use real spellings. Don't invent accents to mark vowel quality. *moro*, *gosto*, *como*, *ele*, *ser* — none of these take an accent. Writing *móro*, *gósto*, *cômo*, *êle*, or rendering *ser* as *SÊR* is a hard fail. Phonetic respellings (`KÔH-moo`, ALL-CAPS or hyphenated) are a separate notation system and remain accented — the ban is only on actual PT word spellings.

2. **Translate every Portuguese line to English (PEDAGOGY §20).** Every PT word, phrase, sentence, and dialogue line shows its English gloss inline or directly adjacent. A vocabulary table alone does not satisfy this — dialogue lines need their own per-line translation. Cognate exception: worksheet labels like *Estudante*, *Data*, *Nome*, *Professor*, *Pronúncia* are never glossed.

3. **BP and EP are separate tracks. Never mix.** Declare the variant explicitly at the top of any worksheet, drill, or primer. BP uses *você*, *estar + gerúndio*, *moro* / *mora* without diphthong. EP uses *tu*, *queria* / *era* for polite requests, *estar a + infinitive* for ongoing action. A "Brazilian Portuguese" worksheet that uses *tu* or *gostaria* is broken; an EP worksheet that uses *você* as the subject is broken.

4. **BP pronunciation = paulista, no Y-glide.** Closed Ê in BP is a pure vowel. Don't add a Y-glide to closed-vowel respellings — `SÊY`, `MÊYS`, `TRÊYS` are carioca-style diphthongs and are wrong for our materials. Drop carioca alternatives from respellings unless the lesson is explicitly contrasting variants.

5. **Native Usage Filter (PEDAGOGY: MANDATORY section).** Never teach a form a native speaker wouldn't actually use, even if it's prescriptively correct. *Quereria* is grammatical EP that nobody says at a counter — teach *queria*. The textbook form gets a footnote at most, never the lead.

6. **A1: singular before plural.** Fixed openers and first-exposure exercises use only *eu*, *você*, *ele/ela* (and *a gente* for BP). Plural conjugations (*nós*, *vocês*, *eles*) come later, in their own units. Putting *Nós moramos* in an A1 fixed opener violates atomic-focus.

7. **Worksheet conventions.** Worksheets carry `Estudante:` and `Data:` headers at the top. Audience is a generic learner of the variant — no roster names, no "for Christian", no personalization inside the material. Personalization happens at the session-plan layer, never in the worksheet itself.

8. **One claim per teaching block (PEDAGOGY §25).** Each section or paragraph teaches exactly one point. Contrast pairs in a single block must share the same phonological or grammatical category. Don't pair *sou* (ou-diphthong closed O) with *como* (interior closed O) in a "closed O" contrast set — different contexts, different rules.

9. **Show the phonetic respelling, don't just label (PEDAGOGY §26).** When teaching a sound distinction, the respelling on the page is the lesson. Labels like "closed" and "open" are abstractions; the respelling makes the sound concrete and copyable for the learner.

10. **Vocabulary scaffolding (PEDAGOGY §15).** Connector words and grammar pieces are defined the first time they appear in the document. Don't drop *com*, *onde*, *ainda* into an exercise without a quick gloss.

## Then read PEDAGOGY.md

Read `PEDAGOGY.md` for fuller context: the Self-Introduction Trinity, Eu/Você-First sequencing, centrality ranking, the BP/EP divergence table, the worksheet generation checklist, and the rationale behind every rule above. The ten hard rules here are the floor; PEDAGOGY.md is the rest of the building.

## Related skills

- `/worksheet-review` — full quality checklist for student-facing materials
- `/worksheet-layout` — CSS and print formatting rules
- `/drill-create` — author a new drill following the 10 best practices
