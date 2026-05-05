# Phase 6 — Pronunciation Migration Architectural Review

Status: **Decision pending.** No authoring or schema changes in this phase. This document surfaces options, recommends one, and lists decisions Gil must lock before Phase 7+ begins.

Drafted: 2026-05-04.

## Reframing the question

The Phase 1 architectural lock and `phase-3-backlog.md` close-out both refer to "the 4-phase pronunciation curriculum" as the artifact to migrate. **That framing is inaccurate** in two ways, and Phase 6 should start from the corrected picture rather than the inherited one.

### What "the 4-phase pronunciation curriculum" actually is

A read of every input named in the Phase 6 brief, plus a reference sweep across the repo, produces this corrected inventory:

| Artifact | Lines | What it actually is | Live? |
|---|---|---|---|
| `PRONUNCIATION_RULES.md` | 427 | Static reference doc — 6 obligatory BP pronunciation rules with notation, examples, exception lists. The canonical rule reference. | Static — not served. |
| `SYLLABUS_PHASE_1.md` | 2109 | **Self-introduction grammar curriculum** organised by 4 internal phases (eu → ele/ela → você → nós), 8 verbs each, 26 patterns total. Pronunciation annotations are applied throughout but the curriculum is grammar-driven. | Static — not served. |
| `SYLLABUS_PHASE_1.source.md` | 2109 | Clean (un-annotated) source for above. Annotation tooling generates `.md` from `.source.md`. | n/a — input to tooling. |
| `SYLLABUS_PHASE_2.md` / `_3.md` / `_4.md` | 134 / 126 / 158 | A2 / B1 / B2 grammar-vocab outlines. **No pronunciation focus.** Vestigial — superseded by the canonical CEFR primers archived in Phase 5. | Static — not served. |
| `lessons/lesson-1.html`, `lesson-2.html`, `unit-1.html` | 578 / 474 / 590 | Three orphan printable HTML lessons. Mix grammar boxes, sound boxes, phonetic respellings. | **Not linked** from `index.html`, `syllabus.html`, or any live page. Referenced only from a changelog and an archived task doc. |
| `lessons/a1/*.html` (47 files) | varied | A1 grammar/vocab printable lessons. Not pronunciation-specific. | Some linked from drills as printable companions. |
| `syllabus.html` | 434 | **Curriculum viewer for the 100-unit A1–B2 grammar/vocab curriculum.** Not a pronunciation viewer. | Live, linked from `index.html:90`. |
| `utils/annotate_pronunciation.py` | 600+ | Programmatic annotator implementing rules 1–6 over BP text. Mature, working. | Build tool; output goes into `SYLLABUS_PHASE_1.md`. |
| `utils/generate_annotated_syllabus.py` + `update_syllabus_annotations.py` + `strip_annotations.py` | small | Wrappers around the annotator that operate specifically on `SYLLABUS_PHASE_1.{source.,}md`. | Build-time only. |
| `config/dashboard.json` pronunciation drills | — | Two entries: `syllable-stress` (B1) and `phonetics-br` (B2). Both `topic: pronunciation`. | Live — appear under the Pronunciation filter pill. |
| `Students/primer-BP.html` | — | Single BP source-of-truth primer (consolidated 2026-04-23 per memory). Embeds pronunciation respellings inline (`KÔH-moo`, `is-TÔH`). | Linked at the student-material layer, not a pronunciation curriculum entry. |

The Phase 1 lock recorded **"no `topic: pronunciation` units exist in the corpus"** — verified: `grep "topic: pronunciation" docs/units/*.md` returns zero. The four pronunciation hits in `docs/units/` reference the topic in narrative prose, not in frontmatter.

### Two implications of the corrected picture

1. **There is no live pronunciation curriculum to migrate.** The only currently-served pronunciation content is two B1/B2 drills, the inline respellings inside `primer-BP.html`, and PEDAGOGY's own pronunciation principles. The 6 rules of `PRONUNCIATION_RULES.md` are documented but never assembled into a structured lesson sequence presented to students.
2. **`SYLLABUS_PHASE_1.md` is not a pronunciation curriculum.** It is a grammar curriculum (eu → ele/ela → você → nós, 8 verbs each) that has been *annotated with pronunciation*. Migrating its content would mean migrating ~32 grammar units (4 phases × 8 verbs) with pronunciation as a secondary surface — and many of those grammar units already exist in the canonical corpus under different slugs. The annotation tooling is what's worth preserving, not the file as a curriculum.

The real Phase 6 question becomes: **how should the 6 pronunciation rules acquire taxonomic placement in the canonical corpus, and what happens to the auxiliary artifacts (annotated syllabus, orphan lessons, BP-only annotation tooling)?**

## Options

Three viable architectural paths. All assume the Phase 1 lock holds — the canonical schema is `docs/units/*.md` with frontmatter; `topic: pronunciation` is a reserved enum value already in the schema.

### Option A — Full migrate

Decompose `PRONUNCIATION_RULES.md` into individual units (one per rule, possibly finer for compound rules like Rule 5's nasal-vowel cases). Each unit has frontmatter + body containing the rule, examples, exception lists, and links to audio/respelling material. `SYLLABUS_PHASE_1.md` either gets archived or its eu/ele/você/nós exemplar passages migrate into the relevant grammar unit bodies.

**What changes**:
- ~6–12 new unit files at `docs/units/a1-pron-*.md` (and possibly `-bp` / `-ep` suffixes if EP forks now).
- Schema gains an `audio_assets:` field (frontmatter array of audio file paths) — required for any meaningful pronunciation unit body.
- Possibly a `phase:` field if the 4-phase grouping (final vowels → palatalization → epenthesis → nasals → l-vocalization) needs to be preserved orthogonally to CEFR; or all rules CEFR=A1 with `sequence_position` carrying the order.
- Generators (`generate-cefr-primer.py`, `generate-ms-sequence.py`) automatically pick up the new units (already filter by topic; pronunciation slot in section ordering is `verbs → tenses → grammar → vocabulary → conversation → pronunciation`).
- `annotate_pronunciation.py` either stays as a build tool feeding unit body Examples sections, or its outputs are dropped from the corpus entirely (pronunciation taught via respellings + audio links inside unit bodies, not via the `[_u_]`-style annotation system).

**Pros**:
- Pronunciation participates in concept-tagging (`docs/concepts.md`), prereq chains, lesson-plan tooling, validator gates.
- One canonical surface for the rules, queryable via `topic-query.py`.
- Symmetry with the rest of the curriculum.

**Cons**:
- The rule body is **already** good in `PRONUNCIATION_RULES.md`. Migrating means duplicating it into 6+ unit files OR truncating each unit body to a stub that links out — at which point the unit is a near-empty pointer.
- Audio + annotation tooling is a sub-system the schema doesn't currently model. Adding `audio_assets:` / `phase:` is schema growth for one topic.
- EP fork pressure: PEDAGOGY explicitly flags that EP can use different reference words (`closed ô = "boat"` not `"go"`). Full migrate forces a now-or-later call on EP variants.
- Rule 6's strikethrough-plus-bracket notation, Rule 4's epenthesis dictionary, etc., live in tooling — moving them to markdown bodies fragments the canonical rule definition.

### Option B — Coexist with cross-references

Leave `PRONUNCIATION_RULES.md`, `SYLLABUS_PHASE_1.md`, and the annotation tooling exactly where they are. Add cross-references: existing grammar units that depend on pronunciation knowledge (e.g., `a1-ser-identity` introducing `eu sou o[_u_]`) gain a `pronunciation_refs:` array in frontmatter, or just embed a "Pronunciation" sub-section in the body that links out to the relevant rule in `PRONUNCIATION_RULES.md`.

**What changes**:
- No new pronunciation unit files. `topic: pronunciation` stays unused except for the two existing `dashboard.json` drills.
- Optional new frontmatter field `pronunciation_refs: ["rule-1", "rule-3a"]` — small, additive.
- Pronunciation tooling untouched.
- `lessons/lesson-1.html`, `lesson-2.html`, `unit-1.html` either archived (orphan) or kept dormant.

**Pros**:
- Cheapest. Zero authoring. No schema growth beyond an optional field.
- Preserves the working annotation pipeline as a self-contained sub-system.
- Doesn't force the EP-pronunciation question.

**Cons**:
- Pronunciation is structurally invisible in the canonical corpus. `topic-query.py` can never report "concepts under pronunciation"; lesson-plan tooling can't prereq pronunciation; concept tagging cannot reach into rules.
- The 6 rules remain a parallel system with its own conventions, indefinitely.
- Phase 6 closes with a "documented coexistence decision" but the architectural debt — pronunciation ungoverned by the canonical corpus — persists.

### Option C — Hybrid (recommended)

Migrate **rule metadata** as units. Each of the 6 rules becomes a thin unit file at `docs/units/a1-pron-*.md` with full frontmatter (id, cefr_level=A1, topic=pronunciation, variant, sequence_position, concepts, prereqs, status, ms_legacy=null, cefr_legacy=[]) and a **minimal body**: Outcomes (1–2 bullets), a one-paragraph Grammar section summarising the rule, and a link out to `PRONUNCIATION_RULES.md` for the canonical rule reference. The Vocabulary, Drills & artifacts, and Traps sections may be empty (or carry only the existing dashboard drills + trap-topic links).

`PRONUNCIATION_RULES.md`, the annotation tooling, and `SYLLABUS_PHASE_1.md` stay where they are. The unit body is a **taxonomic anchor**, not a duplicate of the rule reference. Audio links and respellings continue to live in the artifacts that already host them — primers, worksheets, the existing two drills — which the unit body links to via `Drills & artifacts:` wikilinks.

**What changes**:
- 6 (or near-6) new unit files. Slugs: `a1-pron-final-o`, `a1-pron-final-e`, `a1-pron-palatalization`, `a1-pron-epenthesis`, `a1-pron-nasal-vowels`, `a1-pron-l-vocalization`.
- All start `variant: shared` (the rules are universal BP — see EP question below).
- All `cefr_level: A1` with `sequence_position` reflecting Rule 1 → Rule 6 introduction order.
- Concepts: extend `docs/concepts.md` with 6 new slugs (`pronunciation-final-o`, `pronunciation-palatalization-de`, etc.) — the existing `phonetics-broad` and `syllable-stress` concepts stay for the legacy drills.
- No schema additions. Existing fields are sufficient because the unit body is a pointer, not a teaching artifact.
- Generators pick up the units automatically; they will appear in the A1 CEFR primer under the "Pronunciation" section (already last in the section ordering rule per the canonical schema).

**Pros**:
- Pronunciation gets taxonomic placement: queryable, prereqable, concept-tagged.
- No duplication. The rule body remains in `PRONUNCIATION_RULES.md`; the unit is a pointer.
- No schema growth. `audio_assets:` / `phase:` aren't needed because the unit isn't trying to be the teaching artifact.
- EP fork is deferred cleanly: if/when EP gets its own pronunciation reference words (PEDAGOGY footnote), the 6 shared units fork to `bp` / `ep` pairs at the same `sequence_position` (per validator rule 8's `{bp, ep}` allowance). Today, BP-only is acceptable as `shared`.
- Minimal effort: ~6 unit files of <30 lines each plus 6 concept-list extensions.

**Cons**:
- The unit bodies are intentionally thin — a reviewer comparing them to grammar units may flag them as under-developed. Mitigation: validator soft-warning for empty body sections is documented as expected for `topic: pronunciation` units (or those units are excluded from the warning).
- Two surfaces for pronunciation persist (the rule reference + the units). If the rule reference is the canonical surface, the units feel ceremonial.
- Doesn't resolve `lesson-1.html` / `lesson-2.html` / `unit-1.html` — these orphan files are tangential to the migration question and should be triaged separately.

## Recommendation

**Option C — Hybrid.**

Reasoning, in priority order:

1. **PEDAGOGY explicitly says pronunciation lives at the point of use** (P14: "Pronunciation Must Be Audible and At Point of Use"; P16: "Pronunciation Examples Should Preview Later Vocabulary"; P26: "Show the Phonetic Pronunciation, Don't Just Label It"). This argues against migrating teaching content into standalone pronunciation unit bodies — the actual teaching belongs embedded in worksheets, primers, and self-introduction sequences, not in a parallel pronunciation curriculum. **The canonical corpus needs pronunciation present as taxonomy, not as a teaching destination.**

2. **The annotation pipeline is a sub-system, not curriculum content.** `annotate_pronunciation.py` produces a deterministic annotated rendering of any BP text by applying 6 rules. Migrating its output (`SYLLABUS_PHASE_1.md`) means importing 2000+ lines of generated text into the canonical corpus, where the source of truth is now split between the unit file and the annotator. Hybrid leaves the pipeline as a build tool feeding annotation-bearing artifacts (primers, worksheets) and avoids the divergence.

3. **CEFR alignment is fake for pronunciation.** All 6 rules apply from the first word a student says. Forcing them into B1 or B2 misrepresents when they're learned; assigning them all A1 with `sequence_position` carrying the order is correct but means the CEFR field is doing little work. This is fine in Hybrid (the units are pointers; the misalignment is harmless) but is a structural problem under Full migrate (where the unit bodies would suggest, falsely, that students "complete" pronunciation rules at A1 in a sequenceable way).

4. **EP scope is genuinely uncertain.** Marvin is a real EP student; PEDAGOGY says EP needs separate pronunciation reference words; but no EP pronunciation curriculum exists today and tutoring scope is BP-dominant. Hybrid handles this with a single `variant: shared` placement that can fork later. Full migrate forces the question now and either (a) duplicates the 6 units BP/EP each from day one or (b) commits BP-only by default and creates fork debt.

5. **Storage and provenance argue mildly for migration, not strongly.** The canonical corpus benefits from having pronunciation queryable and concept-taggable. But this benefit is fully achieved by Hybrid — the unit *exists* in the corpus, it just doesn't duplicate the rule body.

Coexist (Option B) is rejected because it leaves a permanent gap: pronunciation never enters the concept-tagging system and stays a parallel artifact indefinitely. The cost of migrating metadata-only is small enough that it's worth doing.

Full migrate (Option A) is rejected because the pedagogical evidence (P14/P16/P26) actively contradicts the model of "standalone pronunciation lessons taught as their own track." The rule reference is already a quality artifact; duplicating it in unit bodies adds a second source of truth without a clear consumer.

## Schema decisions needed if Hybrid proceeds

These are the questions Phase 7 must lock before any unit files get authored. None are blocking *this* review.

1. **Granularity.** Six unit files (one per rule), or finer (split Rule 5 into 5 sub-units for `-em` / `-am` / `-im` / `-om` / `-um`), or coarser (omnibus "BP pronunciation rules" as a single unit)?
   - **Default recommendation**: 6 units, one per rule. Matches the rule numbering in `PRONUNCIATION_RULES.md`. Splitting Rule 5 fragments a coherent reference; combining all 6 loses the per-rule prereq surface.
2. **Concept slugs.** Do the 6 rules each get their own concept slug in `docs/concepts.md`, or do they share a single `pronunciation-rules-bp` slug, or do they reuse the existing `phonetics-broad` / `syllable-stress` concepts?
   - **Default recommendation**: 6 new slugs (`pronunciation-final-o-bp`, `pronunciation-final-e-bp`, `pronunciation-palatalization-bp`, `pronunciation-epenthesis-bp`, `pronunciation-nasal-vowels-bp`, `pronunciation-l-vocalization-bp`). Per-rule slugs let worksheets tag exactly which rule they exemplify. The `-bp` suffix anticipates EP forks; alternatively drop the suffix if EP uses *the same rules with different reference words* (likely true for rules 1–4; less clear for 5–6).
3. **Variant.** All 6 rules `shared`, all `bp`, or per-rule call?
   - **Default recommendation**: `shared` for all 6 today. The rule mechanics are universal Brazilian; EP differs in reference *words* (PEDAGOGY footnote) but the rule **inventory** is BP-specific anyway. EP would need its own pronunciation rule corpus, not a fork of these.
   - **But this needs Gil's confirmation**: if EP rules are wholly different (not "same rule, different reference words"), then the 6 units should be `bp` from day one and EP gets its own future track.
4. **Body section minima.** Phase 1 schema requires all 5 body sections present (Outcomes / Vocabulary / Grammar / Drills & artifacts / Traps). Validator soft-warns on empty published units. Pronunciation units will have largely empty Vocabulary and Drills & artifacts sections by design.
   - **Default recommendation**: all 5 headers present per schema; mark units `status: published` when authored; accept the soft warning, or relax the warning to exempt `topic: pronunciation`. Don't change the schema — just document that pronunciation units exemplify a thin-body legitimate use case.
5. **Prereq chain.** Should pronunciation rules be prereqs of grammar units (e.g., does `a1-ser-identity` prereq `a1-pron-final-o` because "Eu sou" requires it)?
   - **Default recommendation**: no. Pronunciation rules are universal-from-day-one; making every grammar unit prereq them adds noise to the dependency graph. Pronunciation units can prereq each other (Rule 3 prereqs Rule 2 because palatalization depends on `[_i_]` which is the final-e rule's output) but should not feed into grammar prereqs.
6. **Existing dashboard.json drills.** `syllable-stress` (B1) and `phonetics-br` (B2) currently use `topic: pronunciation`. They are NOT covered by the 6 rules. Do they get unit files of their own, or stay as drills with no canonical unit anchor?
   - **Default recommendation**: author 2 additional units (`b1-pron-syllable-stress`, `b2-pron-phonetics-broad`) so the existing drills have anchors. This brings the pronunciation unit count to 8, not 6. Same Hybrid approach — thin bodies pointing at the existing drill JSON.

## Tooling implications

For Phase 7+ if Hybrid proceeds:

- **`scripts/validate-units.py`** — no schema changes needed. The soft-warning for empty body sections may need a documented exemption for `topic: pronunciation` units, or the warnings get treated as expected noise. Decision: add an explicit comment in the validator (`# topic:pronunciation units intentionally have thin bodies`) rather than silence the warning.
- **`scripts/generate-cefr-primer.py`** — no changes. Already handles `topic: pronunciation` per the section ordering rule (`verbs → tenses → grammar → vocabulary → conversation → pronunciation`). The new A1 units will appear in the A1 BP primer under a "Pronunciation" section.
- **`scripts/generate-ms-sequence.py`** — no changes. Pronunciation units interleave by `sequence_position` like every other topic.
- **`scripts/topic-query.py`** — works automatically. `python scripts/topic-query.py pronunciation-final-o-bp` will list the new unit + the existing trap-topic entries + any tagged drills.
- **`scripts/rename-unit.py`** — works automatically (slug rename + prereq sweep applies regardless of topic).
- **`utils/annotate_pronunciation.py`** — **untouched.** Stays as a build tool. Its outputs feed worksheets and primers, not the canonical corpus.
- **`utils/generate_annotated_syllabus.py` + `update_syllabus_annotations.py`** — these are tied to `SYLLABUS_PHASE_1.md`. If that file is archived (see Decision 4 below), these scripts archive with it. If it's kept as an exemplar text store, the scripts stay.
- **`scripts/check_note_compliance.py` (vault gate)** — n/a, this is the investing-vault gate; doesn't apply to the Portuguese corpus.

## Phase 7+ scope estimate

Assuming Hybrid is approved:

| Phase | Action | Estimated effort |
|---|---|---|
| 7 | Schema-decisions lock — answer the 6 schema questions above. Update `docs/concepts.md` with 6 new slugs. Document the validator exemption. Decide fate of `lessons/lesson-1.html`, `lesson-2.html`, `unit-1.html` and `SYLLABUS_PHASE_1.md`. | 1 session, no code changes. |
| 8 | Mechanical authoring — write 6 (or 8) unit files. ~30 lines each. Run validator. Run the two generators. Verify A1 primer + MS sequence regenerate cleanly. | 1 session. |
| 9 | Auxiliary cleanup — archive or retain `SYLLABUS_PHASE_*.md`, `lessons/lesson-1.html`, `lessons/lesson-2.html`, `lessons/unit-1.html`, `SYLLABUS_PHASE_1.source.md` per Phase 7 decision. Update `CLAUDE.md` curriculum sections to reflect pronunciation unit count. | 0.5 session. |

If Coexist is approved instead: Phase 7 is closeout-only — document the decision in this file's successor, add `pronunciation_refs:` to `<5` units that genuinely need it, done. No Phases 8/9.

If Full migrate is approved: Phase 7 schema decisions plus `audio_assets:` / `phase:` field additions, Phase 8 authoring of 6 fully-bodied units (each ~150 lines), Phase 9 archive of `PRONUNCIATION_RULES.md` (now subsumed) and the annotation tooling decommission. Total ~3× the Hybrid effort.

## Decisions for Gil (cannot be locked without your input)

1. **Approve the corrected framing.** The "4-phase pronunciation curriculum" is `PRONUNCIATION_RULES.md` + the 6 rules + the BP-only annotation pipeline. `SYLLABUS_PHASE_1.md` is a grammar curriculum with pronunciation annotations, not a pronunciation curriculum. Confirm this matches your understanding.

2. **Pick the path: Hybrid (recommended), Coexist, or Full migrate.**

3. **EP variant scope.** Three sub-options:
   - (a) `variant: shared` for all 6 rules now, fork to `bp`/`ep` later if EP curriculum diverges. **Default.**
   - (b) `variant: bp` for all 6 from day one, plan EP units as a future Phase 6.5.
   - (c) Author EP units alongside BP in Phase 8 (means Marvin's pronunciation curriculum gets canonical placement immediately).

4. **Auxiliary file fate.** What happens to:
   - `SYLLABUS_PHASE_1.md` and `.source.md` — archive (move to `docs/archive/`), retain (as exemplar text store the annotation tooling can rebuild from), or migrate (decompose into 32 grammar units — **not recommended**, most are duplicates of existing canonical units).
   - `SYLLABUS_PHASE_2.md` / `_3.md` / `_4.md` — these are vestigial A2/B1/B2 grammar outlines superseded by Phase 5's archived primers. Recommend archive in Phase 9.
   - `lessons/lesson-1.html`, `lesson-2.html`, `unit-1.html` — orphan printables not linked from any live page. Recommend archive in Phase 9.

5. **Existing dashboard.json drills.** Do `syllable-stress` and `phonetics-br` get unit anchors (8 units total) or stay drill-only (6 units)?

6. **Concept-slug naming convention.** `-bp` suffix on each of the 6 concept slugs, or unsuffixed (deferring the suffix until EP forks)?

## What's not in scope for this review

- Authoring any pronunciation unit files (Phase 8).
- Modifying `PRONUNCIATION_RULES.md`, the annotation pipeline, or any HTML lesson file.
- Touching the canonical schema in `curriculum-canonical.md` except to identify what would need to change (none under Hybrid).
- Decisions about `primer-BP.html` / `primer-EP.html` — these are student-material artifacts, not curriculum-corpus artifacts; their pronunciation content stays inline as PEDAGOGY P14 dictates.
- The `lessons/a1/*.html` 47-file directory — these are A1 grammar/vocab printable companions, not pronunciation lessons; out of scope for Phase 6.
- Changes to PEDAGOGY.md.

## Phase trajectory

- **Hybrid approved** → Phase 7 (schema-decisions lock) → Phase 8 (author 6–8 unit files) → Phase 9 (archive auxiliary). ~2.5 sessions total.
- **Coexist approved** → Phase 6 closes with this document plus a small `pronunciation_refs:` extension if any units genuinely need it. ~0.5 session total.
- **Full migrate approved** → Phase 7 (schema lock + `audio_assets:`/`phase:` additions) → Phase 8 (author 6 fully-bodied units) → Phase 9 (decommission `PRONUNCIATION_RULES.md` and annotation pipeline). ~7 sessions total. Not recommended.

---

## Phase 7 outcome (2026-05-04)

All six decisions locked as recommended:

1. **Reframing approved.** "4-phase pronunciation curriculum" was inaccurate; the canonical reference is `PRONUNCIATION_RULES.md` plus the BP-only annotation pipeline.
2. **Hybrid (Option C).** Thin anchor units only — no rule-content duplication.
3. **`variant: shared` for all 8 anchors.** EP fork deferred as a future opportunistic task if an EP curriculum genuinely needs differentiated reference words.
4. **Auxiliary archive expanded from 7 to 14 files.** Pre-flight grep surfaced a connected sub-system (`SYLLABUS_PHASE_1.source.md`, 3 wrapper scripts, 3 workflow docs) that justified archive on its own merits. `utils/annotate_pronunciation.py` (the rule engine) stays live as a generic tool.
5. **8 anchor units total** — 6 rule anchors + 2 drill-concept anchors (`b1-pron-syllable-stress`, `b2-pron-phonetics-broad`).
6. **Concept slugs unsuffixed.** Three new slugs added: `final-o-reduction`, `final-e-reduction`, `epenthesis-borrowed-words`. Existing `palatalization-d-t`, `nasal-vowels`, `final-l`, `syllable-stress`, `phonetics-broad` reused.

### Anchor units shipped

`docs/units/a1-pron-final-o.md`, `a1-pron-final-e.md`, `a1-pron-palatalization.md`, `a1-pron-epenthesis.md`, `a1-pron-nasal-vowels.md`, `a1-pron-l-vocalization.md`, `b1-pron-syllable-stress.md`, `b2-pron-phonetics-broad.md`.

Sequence positions: A1 80.0–85.0 contiguous (after `a1-discourse-markers`@88… wait, that's B1; after the highest A1 placeholder-free position at 73.0, before the placeholder range at 200+); B1 89.0; B2 91.0.

### Validator + generators

176 units parsed cleanly (was 168). All hard-fail rules pass. 8 expected new soft warnings (thin-body Vocabulary) + 1 expected B2-A1-prereq warning. CEFR primers regenerate with new "## Pronunciation" sections per level/variant. MS sequences: BP=164 / EP=159.

### Trajectory

Curriculum spine consolidation (Phases 0–7) **complete.** No further phases planned. Future enrichment is opportunistic, surfacing-driven, not phased.

---

End of review.
