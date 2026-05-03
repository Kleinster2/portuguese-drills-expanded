---
name: worksheet-review
description: Review a worksheet or handout against the full quality checklist. Run after creating or editing any student-facing material.
argument-hint: "[path to worksheet file]"
---

# Worksheet Review

Review a worksheet or handout against the full quality checklist. Run this after creating or editing any student-facing material.

## Content checklist

1. Is every verb form one a native speaker would actually use?
2. If teaching a formal/literary form, is there an explicit usage note?
3. Are example sentences things a real person would say (not textbook artifacts)?
4. For EP worksheets: have you checked imperfeito vs condicional usage?
5. For EP worksheets: have you checked futuro simples vs ir + infinitivo?
6. Is every Portuguese word defined before its first use in exercises? (PEDAGOGY Principle 14)
7. Does each exercise use different vocabulary — no repeated words across exercises in the same section?
8. Do pronunciation examples preview vocabulary from later sections? (PEDAGOGY Principle 15)
9. Does the title describe content, not lesson sequence? No "Primeira Aula", "Lesson 1", etc.
10. Does the self-introduction use "Eu sou o/a" (not "Meu nome e") for BP?
11. Does every word pass the centrality test? "Professor" and "escola" yes. "Engenheiro" and "firma" no.
11a. **Gloss every dish/named-item in teaching boxes** (PEDAGOGY P20 extension): Every Portuguese dish name (or other named cultural item — *azulejos, fado, ginja*) appearing in a vocab box, regional box, usage box, or pattern box gets a short English gloss describing what it is — composition, key ingredient, or preparation. Even famous ones (*pastel de nata*, *bifana*, *cataplana*). When a single ingredient inside the gloss is also unfamiliar (*chouriço*, *bacalhau*, *natas*), gloss that too. Exception: matching exercises where the description IS the gloss.
12. **Concept scaffolding**: Is every grammar concept explained (not just listed in a table) before exercises test it? A reference table cell is not teaching. If an exercise requires understanding direct vs indirect objects, that distinction must be explicitly taught in a grammar box first.
13. **Answer scaffolding**: List every unique correct answer across all sections. For each, verify the student has practiced selecting it (in an earlier exercise) before being asked to produce it (in a later exercise).
14. **No student personal data in exercises** (extends to verbatim phrasings): Use generic Portuguese names (Maria, Pedro, Ana, João) — not the student's name, spouse, or personal details. Dialogue speakers with names are fine. **Verbatim quotes also banned**: don't paste a student's recent writing into teaching boxes, exercises, or "Erros comuns" wrong/right pairs — they'd recognize their own characteristic phrasings even without a name. Use generic equivalents that teach the same pattern. Personalization stays at the live-session layer ("here's a sentence from your writing — what's the fix?"), never inside the document. The fingerprint test: while drafting, if I think *"this is exactly what she wrote"*, that's the tripwire.
15. **BP worksheets use você-form imperatives**: Complete, Escolha, Substitua, Reescreva, Preencha — not tu-form (Completa, Escolhe, Substitui, Reescreve, Preenche). EP worksheets use tu-form.
15a. **Every Portuguese has a translation** (PEDAGOGY Principle 20): Every PT word, phrase, sentence, dialogue line, example, section title, and exercise instruction has an English translation alongside. No untranslated Portuguese — even cognates and previously-taught words get the translation. (Exception: text simplifier output, which skips cognates by design.)
15b. **Phonemic integrity** (PEDAGOGY §27): For every "open/closed" or "nasal/oral" label in teaching boxes, exercises, or answer keys, confirm a minimal pair exists in the target variant (BP or EP). *avó/avô* justifies "open/closed O." *sé/sê* justifies "open/closed E." No minimal pair in BP justifies "open/closed A" — the acute on *está* marks stress, not quality. Remove cosmetic labels; teach the sound via respelling (§26) instead.
15c. **Phase discipline — no previews** (PEDAGOGY §28): If the worksheet is part of a sequenced primer or multi-lesson arc, verify that no teaching block introduces forms scheduled for a later part. Passive exposure (a word appearing as a phonetic exemplar) is fine; active teaching (a box with verb-meaning glosses, a grammar paradigm) is a violation. When a preview is tempting, find a no-morphology alternative (echo responses, one-word answers) that delivers the same communicative payoff.
15d. **Lead with the unmarked response** (Native Usage Filter extension): For any communicative function (greetings, thanks, agreement, polite requests), the first response taught must be the statistically modal one in the target variant. *Tudo bem* echo before *Tudo ótimo*. Ornaments and enthusiastic variants layer on top, never in place. When uncertain, corpus-check the function-phrase pair.

## Dialogue checklist

Use `/dialogue-generate` when creating dialogues from scratch. For review, verify:

17. Left speaks FIRST, right RESPONDS. The student's line in row N answers whatever the other speaker asked at the end of row N-1.
18. No implied knowledge — a speaker can only react to what they've been told.
19. Both speakers share information (reciprocity).
20. Names at the greeting, not after "how are you?"
21. Answer key has one entry per table row — count them.

## Section difficulty progression

16. **Difficulty ramp between sections**: List each exercise section in order with its task type (e.g., "pick from options," "fill in frame," "full production," "dialogue"). The cognitive demand must increase gradually. Red flags:
    - A section with full scaffolding (multiple-choice) followed immediately by zero scaffolding (open production) — there must be an intermediate step (e.g., complete a sentence frame, word bank without per-question options).
    - Two adjacent sections testing the same skill at the same difficulty level.
    - A harder section appearing before an easier one (unless deliberately reviewing).

    **The fix when a gap is found:** Insert a bridging section. Common bridge types:
    - **Phrase completion**: Sentence frame given, student fills in 1-3 words (no options).
    - **Word bank**: Shared pool of options for all items (harder than per-item multiple choice).
    - **Sentence reordering**: Jumbled words the student puts in order.
    - **Transformation**: Change a sentence (e.g., statement → polite request, present → past).

## Fill-in-the-blank validation

22. **Does every blank REQUIRE its answer?** If a native speaker could naturally produce the sentence without the target form (e.g., generic "gostar de café" vs specific "gostar do café"), the exercise is broken — it doesn't force the skill being practiced.
22a. **Lock syntactic context in wrong/right error pairs**: When teaching a context-dependent rule (article-before-name, crase, ser/estar, indicative/subjunctive, pronoun placement), each "Erros comuns" or wrong/right pair must include enough surrounding text to lock the syntactic role. *"Como vai Mariana?"* alone is ambiguous — could be missing vocative comma OR missing article. Expand the fragment until the role is unambiguous (e.g. *"Você viu Mariana ontem?"* — *você* as subject locks third-person reference), add a parenthetical role label, or show contrast pairs that teach when each form applies. Decontextualized fragments fail to teach.
23. **Proper noun article check**: Does each place name actually take a definite article in BP? Don't rely on prescriptive rules — search Brazilian sources (.com.br) for actual usage. Prescriptive rules say "no common-noun origin = no article" but native usage often overrides this (e.g., Brazilians consistently write "no Brooklyn", "do Brooklyn").
24. **No duplicate exercises**: After drafting all exercises, list every sentence stripped of blanks in a compact block and compare. Duplicates happen when the same sentence fits two sections (e.g., "Estados Unidos" fits both "em + artigo" and "countries") — always check whether an earlier section already used that noun/context.
25. **English hints are grammatical and match the Portuguese**: The translation must be natural English and must match the meaning of the target Portuguese sentence (including tense — "mora há cinco anos" = "has been living for five years", not "lives for five years").

## Final pass

26. After all granular edits, re-read the entire worksheet end to end as a student would experience it. Individual sentences can all be correct while the whole piece makes no sense.

27. **Corpus verification gate (MANDATORY — PEDAGOGY §Corpus verification).** If any Portuguese sentence, teaching example, or grammar claim was added or changed since the last verify pass, run `/exercise-verify` on those sentences before declaring review complete. Grammatical confidence is not a substitute. Log the queries inline so the search is visible, not implicit. The review is not done until this step is done.

28. **Answer key sweep (MANDATORY — PEDAGOGY §29).** After any content edit, read the answer key section-by-section against the current exercise text. Every answer must correspond to a live exercise item; every claim must be supported by current teaching; every form must pass the Native Usage Filter; all §24/§25/§27 rules apply inside keys. Dead references (answers to removed exercises) are errors. A hedge in a grammar box can survive review; the same claim in an answer key reaches the student as ground truth, so the bar is higher. The review is not done until the key has been swept.

29. **Class handouts stay local — don't deploy.** Worksheets built for a single in-person session don't need a public Cloudflare Pages URL. Save in `printables/`, run `python -m http.server` (or `wrangler pages dev`) for local preview, print or open the local file for the lesson. Deploy is only for materials students access on their own — drills, simplifier, diagnostic test, dashboard. The audience question: if the URL's audience is just Gil and one student in a room together, skip the deploy. Tripwire: if I find myself running `wrangler pages deploy` after writing a worksheet, ask *who reaches this URL?*

## Deep-audit technique (for primer / multi-section reviews)

When auditing a multi-part primer or a dense worksheet rather than running a routine check, use the **element-probe** pattern instead of scanning top-down:

1. Pick one load-bearing teaching block (the one that anchors a section, or the one a student would spend the most time on).
2. Ask *why is this specific element in this specific part?* — force an explicit justification.
3. Challenge each internal claim: does every label have a minimal pair (§27)? does every example share a category (§25)? does every form pass the Native Usage Filter? is the element previewing later material (§28)?
4. Find the smallest replacement that preserves the intent.

This surfaces structural issues (phase violations, cosmetic labels, non-default responses taught as canonical) that top-down scanning tends to miss because everything looks locally correct.

## Restructure ripple (MANDATORY for content moves)

When a concept moves from one part/section to another — a verb paradigm relocated to an earlier chapter, a vocabulary item resequenced, an exercise migrated — the edit list must extend beyond the moved content itself. The failure mode is an **absence audit**: things that should now exist but don't. Grep can't catch absence, so this needs explicit walk-through.

After any content move, audit every downstream consumer:

1. **Exercise coverage (§18 Interleaved Structure).** Every new teaching block in the receiving part must have practice in that same part. "We'll exercise it in a later part" is a §18 violation. If the move introduced a new pair / paradigm / phrase, add at least one exercise item to the receiving part.

2. **Consolidation integrity (§22).** Any "use everything from this primer" dialogue, capstone, or summary must *actually* use the moved concept. Cloze dialogues often predate the restructure; re-read each consolidation point and verify the newly-added material appears as a natural turn.

3. **Originating-part reframe.** The part that previously taught the concept must no longer frame itself as the introduction. Verbs like "introduce," "new," "short forms, all stressed" become stale. Reframe as "extension," "paradigm reference," "recap and widen."

4. **Receiving-part cross-references.** The part where the concept lands should acknowledge what it builds on — but without §22-violating "next we'll see..." forward-references.

5. **Answer-key sweep (§29).** Every exercise answer referencing the moved concept must match its new home. Dead references to removed sections are errors. This is an obligatory pass after any restructure.

6. **Teacher Notes sweep.** Capability lists and grammar-tools lists must reflect the new sequence. Numerical claims ("first irregular," "six verbs," "three patterns") drift silently and are especially prone to becoming stale.

7. **Table of contents / top-of-primer summary boxes.** Part descriptions must match the new structure. A move from Part X to Part IV/VI requires edits in *both* TOC entries, not just the source.

**Test:** After a restructure, walk the primer in order and at each part ask: *would a student reading this in sequence form the correct mental model of what they've learned so far?* If any part claims to introduce something the student already knows, or summarizes a state that doesn't include newly-moved content, the ripple audit isn't done.

**Why this is a separate audit:** Content-quality audits (§24–§29, Native Usage Filter) ask "is each block correct in isolation?" Restructure audits ask "does the system remain coherent after the move?" — a different question. Strong guards on content quality don't catch completeness gaps after a move. Both audits are required.

## Lessons learned

- Feb 2026: A condicional worksheet included "quereria" — prescriptively correct but no Portuguese speaker uses it.
- Mar 2026: A dialogue survived 15+ rounds of edits without anyone noticing one speaker never answered a single question about himself.
- Mar 2026: A rewritten dialogue had the answer key off by one row — Marcelo answered profession when Luis had asked residence — because alignment wasn't traced row by row.
- Mar 2026: Amanda's BP clitic worksheet had "lhe" in a reference table but never explained direct vs indirect objects, never made "lhe" a correct answer before Section C required producing it, used tu-form imperatives (copied from EP template), and wove student/spouse names into exercises. Three separate checklist items (12, 13, 14, 15) added to catch these.
- Mar 2026: Five EP travel worksheets were bulk-created without running any review skills. Restaurant worksheet jumped from trivial multiple-choice (pick 1 word from 3) straight to open production (write full sentences) with no intermediate step. Hotel worksheet used student's real surname ("Michel") in exercises. Root cause: no checklist item for section-to-section difficulty progression. Item 16 added to catch scaffolding gaps; requires listing each section's task type and verifying a smooth cognitive ramp.
- Mar 2026: Christian's contractions worksheet — "Eu gosto ___ café com leite" used generic usage where no article is needed (answer "do" implies specific coffee, but the English hint is generic). Root cause: no check that fill-in blanks actually require the target answer. Audit of the same worksheet falsely flagged "Eu sou do Brooklyn" and "no Brookfield Place" as wrong by applying prescriptive rules without searching Brazilian sources. Both forms are correct in BP. Lesson: verify with .com.br sources before claiming any form is wrong.
- Apr 2026: Amanda's crase worksheet — 10 new exercise sentences (Part D) were added during an "expand the worksheet" pass and I ran /worksheet-review without running /exercise-verify. Grammatical confidence substituted for corpus search. Root cause: the review checklist didn't require corpus verification as a gate; running review felt sufficient. Item 27 added to close this — review is not complete until any new/changed PT has been corpus-verified via /exercise-verify.
- Apr 2026: primer-BP Part I taught *está* as "open á" parallel to *café* (open é) and *avó* (open ó). No minimal pair exists in BP for open/closed A — the acute marks stress, not quality. The same error propagated into the Answer Key as categorical fact. Same primer smuggled a full *estou/está* teaching block into Part I (nominally Pronunciation), delivering *Estou bem* four parts before estar was introduced in Part IV. Both caught by element-probe audit ("why is *está* in Part I? does 'open á' survive scrutiny?"), not by top-down scan. Items 15b, 15c, 15d, and 28 added: verify phonemic integrity of every sound label, enforce phase discipline, lead with unmarked responses, sweep the answer key on every edit. PEDAGOGY §27/§28/§29 added and Native Usage Filter extended to cover unmarked-response-first.
- Apr 2026: primer-BP *ir* restructure — *vou/vai* moved from Part X to Part IV (eu/você pair) with the full paradigm extended in Part VI. Immediate edits shipped clean: paradigm tables in Parts IV/VI updated, Part X's "Verb IR" section retitled to "paradigm reference," TOC entries updated, Teacher Notes numerical claims corrected. But three downstream gaps were missed by the immediate audit: (a) Part IV had no exercise practice of *vou/vai* — §18 violation; (b) Part V's "use everything" consolidation dialogue didn't include ir — §22 violation; (c) Part X still introduced *para* as if new even though Part IV now taught it. All three are absence failures — grep verification (no stale "seis verbos" / no stale "open á") catches positive-presence issues but cannot find silence where sound is needed. Post-hoc fixes: extended Exercise H with 3 vou items, added a 6th row to the Part V dialogue exercising vou/vai, reframed Part X's "Ir + para" box as extension. "Restructure ripple" section added to this skill to codify the absence audit for future content moves.
- Apr 2026 (Marvin EP travel + Amanda BP detalhes): four worksheet-design rules surfaced and added as checklist items. (a) Item 11a — dish names in regional boxes were unglossed (*tripas à moda do Porto*, *vinho verde*) on the assumption that famous names are recognizable; not for a generic learner. (b) Item 14 extension — Amanda's verbatim WhatsApp lines (*"As 4 funciona?"*, *"Na tarde seria bom?"*) ended up inside the BP detalhes worksheet's "Erros comuns" box. The generic-audience rule extends to phrasings, not just names. (c) Item 22a — the worksheet's *"Como vai Mariana?" → "Como vai a Mariana?"* pair was syntactically ambiguous (could be missing vocative comma or missing article); error pairs for context-dependent rules must lock the syntactic role through surrounding text. (d) Item 29 — class handouts were being reflexively deployed to public Cloudflare Pages because the Chrome `navigate` MCP tool can't load `file://` URLs. Local preview via `python -m http.server` is the right substitute; deploy is only for student-facing portals.
