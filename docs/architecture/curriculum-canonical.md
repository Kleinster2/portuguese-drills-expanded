# Curriculum Canonical Schema

Status: Phase 1 lock. Authoritative.

## Purpose

One source of truth for every teaching unit in the Portuguese curriculum. Per-unit markdown files at `docs/units/[slug].md` replace both `docs/drills/[A1-B2]-curriculum-primer.md` and `docs/drills/syllabus-micro-sequence.md`. Both legacy formats become generated views.

This file documents the schema. All migration scripts, validators, and generators must conform to it.

## Storage

- Path: `docs/units/[slug].md`. Flat — no level subdirectories. Slug carries the level prefix.
- One file per unit. YAML frontmatter for structure, body for human-authored content.
- File encoding UTF-8, LF line endings.

## Frontmatter spec

```yaml
id: b1-subj-emotion-verbs        # required, string, slug-form, unique, == filename stem
title: Subjuntivo após verbos de emoção  # required, string, free-form Portuguese
cefr_level: B1                    # required, enum: A1 | A2 | B1 | B2
sequence_position: 81.5           # required, float, unique within (variant, cefr_level)
topic: tenses                     # required, enum (see "Topic enum" below)
variant: bp                       # required, enum: bp | ep | shared
status: draft                     # required, enum: draft | published | archived
section: Subjunctive Mood         # optional, string, overrides default section grouping in CEFR primer view
concepts: [subjuntivo-presente, emotion-verbs-trigger]  # required, array of slugs from docs/concepts.md
prereqs: [b1-subj-presente-regular, b1-subj-presente-irregular]  # required, array of unit IDs (may be empty)
ms_legacy: null                   # required, int 1-90 or null
cefr_legacy: [B1.11]              # required, array of strings matching /^(A1|A2|B1|B2)\.\d+$/, may be empty
```

### Field-by-field

**`id`** — Unique within the corpus. Must equal the filename stem. Slug rules below. Tutor-editable for clarity; renames require a sweep of all `prereqs:` references (validator catches dangling refs).

**`title`** — Human-readable Portuguese. Free-form. No length cap; keep under ~80 chars for legibility.

**`cefr_level`** — Stable taxonomy attribute, not the teaching order. A unit's CEFR level reflects the standard mapping; variant-specific sequencing happens via `sequence_position`. (Example: a BP-only construct that BP students meet earlier than EP students still has the CEFR level of the underlying topic.)

**`sequence_position`** — Decimal, lets new units insert between existing without renumbering. **Uniqueness scope is `cefr_level`**, with a per-position variant-set constraint: for each `(cefr_level, sequence_position)` pair, the set of variants present at that position must be one of `{shared}`, `{bp}`, `{ep}`, or `{bp, ep}`. A `shared` unit at a given position blocks both `bp` and `ep` at the same position — otherwise the BP-track generator (which merges `bp + shared`) would see two units at the same position and produce ambiguous order. The `{bp, ep}` case is allowed and intended: BP and EP variants of the same conceptual slot can share a position because they are never merged together. The MS sequence generator merges streams: for a target variant `T`, it includes units where `variant in (T, shared)`, ordered by `sequence_position`. Two parallel sequences (BP, EP) are produced from one corpus.

**`topic`** — Constrained to the six values used in `config/dashboard.json`: `verbs | vocabulary | tenses | grammar | pronunciation | conversation`. Drives dashboard filter alignment and default section grouping in the generated CEFR primer.

**`variant`** — Three values. **Pushback on the original two-value spec:** most A1/A2 content (numbers, family vocab, basic prepositions, regular conjugation) does not diverge between BP and EP. Forcing every unit into `bp` or `ep` would either duplicate identical content or assign one variant arbitrarily. `shared` units appear in both generated sequences. Use `bp` or `ep` only when content materially diverges (clitic placement, gerund vs `a +` infinitive, paulista pronunciation respellings, vocabulary like ônibus/autocarro).

**`status`** — Added field, not in the original spec. **Pushback rationale:** Phase 2 mechanical migration plus Phase 3 author-the-gaps means the corpus will have half-baked units in flight for weeks. Generators must filter `status == published` for live output; `draft` units are visible in tooling but excluded from generated docs. `archived` preserves history without polluting views.

**`section`** — Optional override. If null, the CEFR primer generator derives the section name from `topic + cefr_level` using a default mapping. Override when the legacy primer used a non-standard section name worth preserving (e.g., A1 "Immediate Production" vs A2 "Past Tenses" — neither matches `topic` directly).

**`concepts`** — Array of slugs from the canonical list in `docs/concepts.md`. Validator rejects unknown slugs. Concepts stay variant-agnostic and level-agnostic per existing convention; `variant` and `cefr_level` live on the unit, not the concept.

**`prereqs`** — Array of unit IDs (may be empty). **Pushback on richer DSL:** the original deliverable asked whether to support `must_complete: [...] / recommended: [...]`. Recommendation: stay with a flat array. Reasons: (a) student-progress tracking on `Students/*.md` already uses simple complete/in-progress/not-started granularity — no infrastructure consumes a must/recommended split; (b) YAGNI — easier to widen the schema later than to migrate richer data into a simpler one. If the need ever arises, the upgrade path is `prereqs: [id]` → `prereqs: { required: [id], recommended: [id] }`, validator accepts both.

**`ms_legacy`, `cefr_legacy`** — Bridge fields. **Decision: keep permanently.** Cost is two fields per unit. Benefits: (a) auditable provenance ("where did this unit come from"); (b) the alignment table from Phase 0 stays reproducible from the corpus alone; (c) if a Phase 5 regression surfaces later — wrong unit migrated to wrong shape — the back-pointers make diagnosis trivial; (d) concept-tagging scripts (`add-syllabus-concept-tags.py`) can use these for backward compatibility during Phase 5 transition. The "remove after Phase 5" alternative trades 0% storage saving for permanent loss of provenance. **Shared-variant units may carry `cefr_legacy` entries from both BP and EP primer columns** — the legacy primers are variant-collapsed, so a single shared unit often back-maps to the same CEFR cell in both, but if the BP and EP primers number that cell differently or split it asymmetrically, list every legacy reference.

### Topic enum (canonical)

Must match `config/dashboard.json` exactly:

- `verbs` — verb conjugation, verb-specific topics (saber/conhecer)
- `vocabulary` — vocab-centric units (food, clothing, body, family)
- `tenses` — tense systems (present, preterite, imperfect, subjunctive, conditional)
- `grammar` — non-verb grammar (articles, possessives, prepositions, contractions, comparatives, demonstratives, relative pronouns)
- `pronunciation` — sound rules, phoneme distinctions
- `conversation` — applied/communicative units (greetings, telling time, narration, argumentation)

### Default section mapping (for CEFR primer generation)

Used when `section:` is null. The CEFR primer generator groups units within a level by these defaults:

| topic | default section name |
|---|---|
| verbs | "Verb System" |
| tenses | "Tenses" |
| grammar | "Grammar" |
| vocabulary | "Vocabulary" |
| pronunciation | "Pronunciation" |
| conversation | "Communication" |

Units with explicit `section:` overrides take precedence. Section ordering within a level: verbs → tenses → grammar → vocabulary → conversation → pronunciation, with override sections inserted in `sequence_position` order of their first member.

## Slug naming convention

Format: `[level]-[topic-shorthand]-[specific][-variant?]`

Rules:
- Lowercase, hyphenated kebab-case.
- Max 40 characters total.
- Match regex `^(a1|a2|b1|b2)-[a-z0-9-]+$`.
- Variant suffix `-bp` or `-ep` is **required iff** `variant != shared`. Omit for `shared` units.
- `[topic-shorthand]` draws from a controlled vocabulary (extend as needed; document additions in this file):

| shorthand | meaning |
|---|---|
| `ser`, `estar`, `ter`, `ir`, `pôr`, `vir`, `fazer` | the named verb |
| `subj` | subjunctive |
| `cond` | conditional |
| `imp` | imperfeito |
| `pret` | pretérito perfeito |
| `fut` | future (synthetic) |
| `prog` | progressive (gerúndio / a+inf) |
| `refl` | reflexive |
| `dop`, `iop` | direct/indirect object pronouns |
| `pron` | pronouns (subject) |
| `prep` | prepositions |
| `art` | articles |
| `poss` | possessives |
| `dem` | demonstratives |
| `num` | numbers |
| `crase` | crase |
| `voc-[domain]` | vocabulary unit (`voc-family`, `voc-food`, `voc-clothes`) |
| `disc` | discourse markers |
| `colloq` | colloquial register |

Examples (valid):
- `a1-ser-identity` (Eu sou — productive identity statement, shared variant)
- `a1-num-0-20`
- `a1-poss-meu` / `a1-poss-meus` / `a1-poss-seu-dele` / `a1-poss-nosso`
- `b1-subj-emotion-verbs`
- `b1-cond-bp` / `b1-cond-ep` (variant-divergent — EP uses imperfeito de cortesia where BP uses condicional)
- `b2-personal-infinitive`

Examples (invalid):
- `a1-Ser-Identity` (uppercase) — fails regex
- `b1-subjunctive-with-emotion-verbs-and-related-triggers` (51 chars) — exceeds max
- `subj-emotion-verbs` (no level prefix) — fails regex

Renames are allowed but expensive: validator hard-fails any dangling `prereqs:` reference, so a rename requires updating every referrer in the same commit. The `id` field must always equal the filename stem.

## Prereq DSL

Flat array of unit IDs. Empty array `[]` means no prereqs (typical for early A1 units).

```yaml
prereqs: []
prereqs: [a1-ser-identity]
prereqs: [b1-subj-presente-regular, b1-subj-presente-irregular]
```

Semantics:
- **Direct only.** Don't list transitive ancestors. The lesson-planning tooling can compute transitive closure.
- **Cross-variant.** A `bp` unit may list `shared` prereqs (and should, for shared foundations). A `bp` unit must not list `ep` prereqs and vice versa. Validator enforces.
- **No cycles.** Validator detects.
- **No level-skipping.** A B2 unit may have B1 prereqs but should not have A1 prereqs (assume transitive coverage). Soft warning, not hard error.

Future expansion path (do not implement now): if must/recommended distinction becomes needed, the schema accepts both shapes:

```yaml
prereqs: [id1, id2]                               # current
prereqs: { required: [id1], recommended: [id2] }  # future
```

The validator should be written to accept both from day one even though we only emit the array form. Cheap forward compatibility.

## Body section spec

Markdown body after the YAML frontmatter. Sections in this fixed order:

```markdown
## Outcomes
What the student can produce/comprehend after this unit. Bulleted, learner-facing.

## Vocabulary
Key vocabulary introduced. Format: Portuguese — English gloss. One per line.

## Grammar
Rules introduced. Use sub-sections for multi-rule units. Include exemplar sentences.

## Drills & artifacts
Wikilinks to drills, worksheets, lessons that practice this unit.
- [[a1-ser-identity-drill]]
- [[../printables/ser-identity-worksheet.html]]

## Traps
Common errors and variant-specific warnings. Pull from `docs/known-trap-topics.md` where relevant — link, don't duplicate.
```

All five sections are required headers. Empty sections allowed during draft status; validator warns on empty published units.

## Validation rules

A `scripts/validate-units.py` (Phase 4 deliverable, scope here) must enforce:

1. **File ↔ id consistency** — filename stem == frontmatter `id`.
2. **Required fields present** — see frontmatter spec above.
3. **Enum values** — `cefr_level`, `topic`, `variant`, `status` must match enums.
4. **Slug format** — `id` matches regex and length cap; variant suffix presence matches `variant` value.
5. **Concept refs** — every entry in `concepts:` exists in `docs/concepts.md`.
6. **Prereq refs** — every entry in `prereqs:` exists as a unit file.
7. **Cross-variant prereq prohibition** — `bp`-variant units cannot have `ep` prereqs; `ep` cannot have `bp`. Either may have `shared` prereqs.
8. **Sequence uniqueness (variant-set rule)** — for each `(cefr_level, sequence_position)` pair, the multiset of variants present must be exactly one of: `{shared}`, `{bp}`, `{ep}`, or `{bp, ep}`. Equivalently: no duplicates within the same variant at the same position; a `shared` unit forbids any `bp` or `ep` unit at the same position. Across different `cefr_level` values, position collisions are unrestricted because the MS sequence interleaves levels.
9. **No prereq cycles.**
10. **Legacy field shape** — `ms_legacy` is null or int 1..90; `cefr_legacy` is array (possibly empty) of strings matching `^(A1|A2|B1|B2)\.\d+$`.
11. **Soft warning** — published unit with one or more empty body sections.
12. **Soft warning** — B2 unit with any A1 prereq (assume transitive coverage; explicit A1 dependency is suspicious).
13. **Soft warning** — concept count > 5 on a single unit (likely under-atomized; consider splitting).

## Generator contract

`scripts/generate-cefr-primer.py` (Phase 4):
- Input: `docs/units/*.md` filtered by `cefr_level` and `variant in (target, shared)` and `status == published`.
- Group by `section` (or default per topic mapping).
- Within section, order by `sequence_position`.
- Render summary form (title, outcomes bullet, grammar bullet — not full body).
- Output: `docs/drills/[level]-curriculum-primer.md` (one per CEFR level, one per variant).

`scripts/generate-ms-sequence.py` (Phase 4):
- Input: `docs/units/*.md` filtered by `variant in (target, shared)` and `status == published`.
- Order globally by `sequence_position`.
- Render full body form.
- Output: `docs/drills/syllabus-micro-sequence-[variant].md` (one per variant — BP and EP get separate sequences).

Note: legacy `syllabus-micro-sequence.md` is variant-mixed; the new generator emits two files. This is a deliberate change — the BP/EP separation rule from PEDAGOGY.md was violated by the original mixed sequence.

`scripts/rename-unit.py` (Phase 4):
- Invocation: `rename-unit.py [old-slug] [new-slug]`.
- Validates that `old-slug` exists as a unit file and `new-slug` does not, and that `new-slug` passes slug-format rules.
- Renames `docs/units/[old-slug].md` → `docs/units/[new-slug].md`.
- Updates the `id:` frontmatter field in the renamed file to match.
- Sweeps every unit file's `prereqs:` array, replacing `old-slug` with `new-slug` where present.
- Sweeps generated content references (drill JSON files, manifest entries, student profile unit-progress tables) for the slug — reports each replacement before applying. Dry-run mode required (`--dry-run`).
- Required because at 150-unit scale, manual renames will leave dangling refs and cause validator hard-fails.

## What lives outside this schema

- **Drills** — `config/prompts/*.json` + `config/dashboard.json` sidecar. Untouched by this work.
- **Worksheets, primers, lessons** — `printables/*.html`, `lessons/*.html`. Linked from unit body, not owned by it.
- **Concepts** — `docs/concepts.md` is the canonical source for the concept slug list. Units reference; they do not redefine.
- **Diagnostic tests** — `config/diagnostic-test-*.json`. Linked via concept tags, not via direct unit refs.
- **Student progress** — `Students/*.md` unit-progress tables. Free to reference unit IDs once the corpus stabilizes; no schema obligation here.

## Migration phases

| Phase | Action | Status |
|---|---|---|
| 0 | Discovery — alignment table built | ✓ |
| 1 | **This doc — schema lock** | ✓ |
| 2 | Mechanical migration: 90 MS + 105 CEFR primer units → per-unit files | ✓ |
| 3 | Author missing B1/B2 sequence-form units (13 clusters; ~35 net new) | ✓ |
| 4 | Build validator + rename + 2 generators | ✓ |
| 5 | Archive legacy primers + MS sequence; deprecate `add-syllabus-concept-tags.py` (consumer `topic-query.py` updated to read from `docs/units/`) | ✓ |
| 6 | Migrate 4-phase pronunciation curriculum into `docs/units/` with `topic: pronunciation` | pending |

## Phase 5 closeout (2026-05-04)

Single canonical source of truth: **`docs/units/*.md`** (164 units).

### Archived

Moved to `docs/archive/` with git history preserved:
- `A1-curriculum-primer.md`, `A2-curriculum-primer.md`, `B1-curriculum-primer.md`, `B2-curriculum-primer.md` (legacy CEFR primers)
- `syllabus-micro-sequence.md` (legacy mixed-variant MS sequence)

### Deleted

- `docs/syllabus-units.json` (derived artifact, replaced by direct read from `docs/units/*.md` frontmatter)
- `scripts/add-syllabus-concept-tags.py` (producer of the deleted JSON)
- `restructure_curriculum*.py`, `test_parse.py`, `debug_parse.py` (5 inert one-shot scripts from Mar 2026 that mutated the legacy MS sequence; their effects are baked into the corpus, git history preserves them via commit `fd2f91b`)

### Updated

- `scripts/topic-query.py` — replaced `load_syllabus_units()` (read JSON) with `load_canonical_units()` (parse `docs/units/*.md` frontmatter). Display shows level + position + variant + slug + section.
- `CLAUDE.md` — curriculum sections point at `docs/units/*.md` as canonical, generated CEFR primers (8 files) + MS sequences (2 files) as artifacts.
- `docs/README.md` — same.
- This doc — Phase 5 closeout section + migration phases status updates.

### Generated artifacts (refresh on demand)

Run `python scripts/generate-cefr-primer.py --all` after editing units → produces 8 `docs/drills/[level]-curriculum-primer-[variant].md` files.

Run `python scripts/generate-ms-sequence.py --all` → produces 2 `docs/drills/syllabus-micro-sequence-[variant].md` files.

Final corpus target: ~150–170 units.

## Open questions for later phases

Not blocking Phase 1 lock. Capture for Phase 2+:

- **Drills sidecar parity.** `config/dashboard.json` has `concept` (singular). Should it gain a `unit` field linking to the unit it primarily practices? Defer to Phase 5.
- **Worksheet manifest parity.** `docs/content-manifest.json` already has `concepts: []`. Should it gain `units: []`? Same question, same answer — defer.
- **Per-unit estimated minutes.** Possibly useful for `/lesson-plan`. Not added now; Phase 3 will surface whether tutors actually want it.
- **Pronunciation lessons.** Locked: the 4-phase pronunciation curriculum (`SYLLABUS_PHASE_1.md` + `lessons/*.html`) folds into `docs/units/` under `topic: pronunciation` in Phase 6. No `topic: pronunciation` units exist before then.
