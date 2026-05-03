---
name: primer-review
description: Review a multi-part primer (BP or EP) against the full quality checklist. Covers per-part content, TOC integrity, phase discipline, capability lists, restructure ripple, and consolidation coherence. Run after creating or editing any primer.
argument-hint: "[path to primer file, e.g., Students/primer-BP.html]"
---

# Primer Review

Review a multi-part primer against the full quality checklist. Run this after creating or editing any primer — and to audit `primer-BP.html` or the eventual `primer-EP.html`.

A primer is structurally different from a worksheet:
- multi-part with phase relationships (Part N depends on Parts 1..N-1)
- top-of-document TOC summary
- ends with capability lists ("Can do", "Grammar tools", "Not in this primer")
- often ends with a consolidation dialogue covering everything taught

Use this skill *in addition to* `worksheet-review` — the per-part rules in worksheet-review apply to every teaching block inside a primer too. Primer-review focuses on the structural concerns that emerge at primer scale.

**Mandatory precondition:** invoke the `pedagogy` skill via the Skill tool before any other step. Phase discipline (§28), the Native Usage Filter, and Principle 20 (English glossing) all matter here — at primer scale, drift is hard to spot without the rules in active context.

## Setup

Read the primer end to end. Note:
- How many parts?
- What does each part claim to teach (per the TOC)?
- Where are the capability lists, "not in this primer" list, and final dialogue (if any)?

## Top-of-document checks

1. **Variant declared explicitly** — for BP: paulista vs carioca stated at the top of Part I. For EP: dialect/region stated. Phonetic respellings throughout match the declared variant.
2. **Estudante/Data header** present at top (worksheet convention extends to primers).
3. **TOC summary box** — lists every part with a one-line description. Each TOC entry corresponds to actual content in that part. No "Part X covers Y" claim that's not delivered, and no part in the body that the TOC doesn't list.
4. **No "NEW" tags, "next lesson" cross-document references, or "we'll see this later" forward-pointers in active teaching.** Internal cross-part references are unavoidable in a primer, but they must not preview material a later part is supposed to introduce. **Test what the student sees, not what the source calls things** — a CSS class named `.new-box` is fine if the rendered output has no "NEW" label visible; a `<span class="tag">NEW</span>` actually rendering on the page is the violation.

## Per-part content (apply worksheet-review rules to every part)

5. Every PT word, phrase, sentence, dialogue line, exercise, and example shows its English translation (Principle 20). Cognate worksheet labels (*Estudante, Data, Pronúncia*) are the standing exception — never gloss those.
6. Every grammar concept is *explained* in a grammar box before exercises test it. Reference tables alone are not teaching.
7. **Native Usage Filter** applied throughout — no prescriptive-but-dead forms (mesoclisis, *quereria* in EP, hyper-formal clitic placement) presented as canonical.
8. **Spelling integrity** — both directions:
    - No fake accents (PEDAGOGY §24): *moro* not *móro*, *como* not *cômo*.
    - No missing accents on real PT words: *você* not *voce*, *café* not *cafe*, *até* not *ate*, *amanhã* not *amanha*.
9. Generic audience — no roster names, no verbatim quotes from any specific student. Personalization stays at the live-session layer.
10. **Variant discipline** — BP primer never uses *tu* as subject, never uses *estar a + infinitivo*. EP primer never uses *você* as bare subject, never uses *gostaria*/*quereria* (uses *queria*).
11. **Fill-in-the-blank integrity** — every blank requires its target answer. Generic contexts where the article is optional don't force a contraction.
12. **Phonemic integrity (PEDAGOGY §27)** — every "open/closed" or "nasal/oral" label is anchored by a minimal pair in the target variant. *avó/avô* justifies "open/closed O." No minimal pair in BP justifies "open/closed A."
13. **Lead with the unmarked response** (Native Usage Filter extension) — the first response taught for any communicative function (greetings, thanks, agreement) is the statistically modal one. *Tudo bem* echo before *Tudo ótimo*.

## Phase discipline (PEDAGOGY §28) — primer-specific

14. **No teaching block introduces forms scheduled for a later part.** A grammar paradigm, conjugation table, or vocab box for material assigned to Part N must not appear in Parts < N. Passive exposure (a word as a phonetic exemplar) is fine; active teaching (verb-meaning glosses, paradigm) is a violation.
15. **Each part builds only on prior parts.** Part VIII can cite Parts I–VII; it cannot cite Part IX. If a part requires forms that haven't been taught yet, that's a phase break.
16. **Element-probe sweep** on load-bearing teaching blocks: pick the central item in each part and ask *why is this here, in this part, at this position?* If the answer requires forward-referencing, the placement is wrong.

## Capability lists (end-of-primer Teacher Notes)

17. **"Can do" list reflects actual content** — walk the list and find each claim's home part. Stale claims (listed but not taught after a restructure) are errors.
18. **"Grammar tools" list reflects actual content** — same check. Numerical claims ("seven verbs", "four ending patterns", "fourth irregular") must match the primer's current count.
19. **"Not in this primer" list integrity** — items listed here must *not* actually appear in the primer. After a content addition, recheck this list — it's a common drift point.

## Consolidation integrity

20. **Consolidation dialogues use everything taught up to that point** (PEDAGOGY §22). A "use everything from this primer" capstone dialogue must reference moved/added material. Re-read each consolidation point and verify recent additions appear naturally.
21. **Final dialogue line-by-line** — for each line, identify which part(s) introduced the structures used. No structures from outside the primer's scope. Walk it once forward to check coverage, once backward to check phase order.

## Restructure ripple (MANDATORY for content moves)

When a concept moves from one part to another, the edit list extends beyond the moved content itself. Audit:

22. **Exercise coverage in receiving part** — every new teaching block must have practice in that same part. "We'll exercise it in a later part" is a §18 violation.
23. **Originating-part reframe** — the part that previously taught the concept must no longer frame itself as the introduction. Verbs like "introduce," "new," "first time" become stale.
24. **Capability lists updated** — moved concept's home part may have changed; capability claims and grammar-tools-list claims must match.
25. **TOC updated** — both the source and destination part descriptions reflect the new structure.
26. **Numerical claims** — "first irregular," "six verbs," "three patterns" drift silently after restructures. Recount.
27. **Answer key swept** — every exercise answer references current exercise text. Dead references to removed exercises are errors.

## Final pass

28. **Walk the primer in sequence.** At each part, ask: *would a student reading this in order form the correct mental model of what they've learned so far?* If a part claims to introduce something already taught, or summarizes a state that doesn't include newly-moved content, the ripple audit isn't done.
29. **Pronunciation respelling consistency** — paulista throughout (for BP), no carioca contamination unless explicitly contrasting. Open é = AY, closed ê = EH labels consistent across all parts.
30. **Final answer key sweep** — every answer corresponds to a live exercise; every answer passes the Native Usage Filter; no dead references.
31. **Punch-list output** — produce a numbered list of failures with quoted lines and part numbers. Pass/fail summary at the top. Don't bury issues in prose.

## Lessons learned

- May 2026 (smoke test on `primer-BP.html`): primer uses a `.new-box` CSS class on 6+ teaching divs (highlights first introduction of a concept with green border + background). The CSS-class name suggests a "NEW" tag, but the rendered output never shows the word "NEW" to students — there's a `.new-tag` class defined but unused (dead CSS). This was initially flagged as a standalone-materials violation; on closer inspection it's not. The rule check has to be against rendered output, not source markup. Item 4 widened to make this explicit.
- May 2026: `primer-BP.html` is in good shape for a smoke-test target — variant declared, no forward-pointers, no fake/missing accents, no `tu`/`gostaria`/`estar a` contamination, capability lists present and well-organized. Future audits should focus on phase discipline (§28), TOC↔body alignment, and restructure ripple after content moves — those are the surfaces most likely to drift, not the basic content rules.
