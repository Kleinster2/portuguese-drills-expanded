# Phase 3 Backlog — Authoring Plan

Status: **Active.** Authored cluster-by-cluster. As clusters land, units move from "pending" to "complete" here and prereq chains backfill.

## Goal

Add ~60–80 net-new units to grow the Phase 2 corpus (129) into the final canonical (~150–170 units). Each unit replaces or supplements a CEFR-only placeholder, or splits a `-bp` Phase-3 split candidate into a `bp + ep` pair.

## Ordering rationale

Clusters are ranked by **error-frequency leverage** — how often the topic is the actual blocker in real student sessions, weighted by how much downstream learning depends on it. Pedagogically high-leverage topics (aspectual shifts, subjunctive triggers, the conditional system) come first because they unblock other content. EP-twin work and specialized topics come later: necessary, but lower per-unit leverage.

Cross-reference: `docs/known-trap-topics.md` documents which topics have produced real-session failures vs. high-frequency-but-not-yet-failing candidates. Most "future candidates" map directly to the high-leverage clusters below.

## Side tasks (interspersed, not blocking any cluster)

These run alongside cluster work, not as a separate phase:

- **A2.20 conjunctions atomization.** MS6 covers only "e" but its `cefr_legacy` includes A2.20 (Basic Conjunctions). The remaining conjunctions (ou, mas, porque, quando, se, como) need their own units. Pedagogy-aligned answer: split into `a2-conjuncoes-coordenativas` (e, ou, mas) and `a2-conjuncoes-subordinativas` (porque, quando, se, como). Do this when authoring touches A2 grammar.
- **Sequence-position normalization.** Each cluster touches CEFR-only placeholders currently at 200–500.xx range positions. As authoring lands, move them into proper interleaved decimals (e.g., `a2-pret-vs-imp` from 300.04 → 46.5 to sit right after the imperfect units). The 200–500.xx range is for unauthored placeholders only; authored content lives in proper MS-sequence interleave.
- **Prereq backfill.** Phase 2 left every unit's `prereqs: []`. As each cluster authors, prereqs get populated for the new unit AND for the prerequisite chain leading to it (where pedagogically obvious). Don't try to backfill the entire corpus at once.

---

## Clusters

### Cluster 1 — Aspectual shifts (B1.4–7) [HIGH LEVERAGE — ACTIVE]

**Why first:** Top-frequency real-session error. `known-trap-topics.md` lists "Pretérito perfeito vs imperfeito (aspectual choice triggers)" and "Saber vs conhecer" as future-candidate trap topics. Aspectual shifts on saber/conhecer/poder/querer are the most surprising for English speakers because the same verb form changes meaning by tense. Marvin and Christian have both produced documented errors here.

**Atomization decision: 4 units (one per verb), not 8 (one per verb-tense combo).**

Reasoning:
- The contrast IS the unit — teaching `soube` without `sabia` produces no understanding.
- 8 units would atomize past the point of pedagogical coherence; the student needs both forms in a single mental model.
- MS-grain says "split rather than combine" but the principle is "atomic concept per unit." The atomic concept here is the verb's aspect-pair, not the individual tense form.
- Each verb is genuinely independent: knowing `soube` ≠ `sabia` doesn't help with `pude` ≠ `podia`. So 4 separate units stand.

**Units (replacing placeholders b1-aspect-saber, b1-aspect-conhecer, b1-aspect-poder, b1-aspect-querer):**

| New slug | Concept | Variant | Prereqs |
|---|---|---|---|
| `b1-saber-aspect-bp` | aspectual-shift-saber | bp | a2-pret-poder-querer-saber, a2-imp-regular, a2-pret-vs-imp, a2-saber-vs-conhecer |
| `b1-conhecer-aspect-bp` | aspectual-shift-conhecer | bp | a2-pret-regular-er-ir, a2-imp-regular, a2-pret-vs-imp, a2-saber-vs-conhecer |
| `b1-poder-aspect-bp` | aspectual-shift-poder | bp | a2-pret-poder-querer-saber, a2-imp-regular, a2-pret-vs-imp |
| `b1-querer-aspect-bp` | aspectual-shift-querer | bp | a2-pret-poder-querer-saber, a2-imp-regular, a2-pret-vs-imp |

**Variant call:** `bp` for all 4. The aspectual readings themselves are essentially the same in EP, but BP and EP differ in usage frequency (EP uses pluperfect more often, where BP uses imperfeito). Cluster 5 (EP twins) revisits whether these need separate `-ep` units or just shared body content.

**Sequence positions:** 46.6, 46.7, 46.8, 46.9 — right after `a2-pret-vs-imp` (which gets reseated from 300.04 to 46.5 as part of this cluster).

---

### Cluster 2 — Subjuntivo triggers (B1.11) [HIGH LEVERAGE]

**Why high leverage:** Subjunctive is the gate from B1 to B2. Generic "subjunctive triggers" placeholder doesn't teach the actual mental model (which is per-trigger-class). Per-class atomization gives the student a concrete pattern to match.

**Estimated 6–10 units:**
- `b1-subj-emotion-bp` — verbs of emotion (gostar que, lamentar que, ter medo que)
- `b1-subj-doubt-bp` — verbs of doubt (duvidar que, não acreditar que)
- `b1-subj-desire-bp` — verbs of desire/will (querer que, esperar que, preferir que)
- `b1-subj-impersonal-bp` — impersonal expressions (é importante que, é possível que)
- `b1-subj-conjunctions-bp` — adverbial conjunctions (para que, antes que, embora, mesmo que)
- `b1-subj-relatives-bp` — relative-clause subjunctive (procuro alguém que…)
- `b1-subj-hypothetical-bp` — se-clauses (covered partially by b2-condicionais-sistema; coordinate)

Replaces placeholder `b1-subj-triggers`. Sequence interleaved after `b1-subj-imperfeito` (84.0).

---

### Cluster 3 — Conditional system (B2.3) [HIGH LEVERAGE]

**Why high leverage:** Hypothetical reasoning is the unlock for opinion/argumentation register at B2. The current placeholder (`b2-condicionais-sistema`) is a single unit — should be three.

**3 units:**
- `b2-cond-real-bp` — Type 1 (real conditions): Se chover, fico em casa (futuro do subj + indicativo)
- `b2-cond-irreal-bp` — Type 2 (hypothetical present): Se eu fosse rico, viajaria (imperfect subj + conditional)
- `b2-cond-passado-bp` — Type 3 (hypothetical past): Se eu tivesse estudado, teria passado (pluperfect subj + conditional perfect)

Replaces `b2-condicionais-sistema`. Sequence after `b2-subj-futuro` (85.0).

---

### Cluster 4 — Compound tenses (B1.3 + B2.5) [MODERATE LEVERAGE]

**4–5 units:** ter + past participle compounds.
- `b1-perfeito-composto-bp` — Tenho falado (recent/ongoing relevance — BP usage differs from EP)
- `b1-mais-que-perfeito-bp` — Tinha falado (pluperfect)
- `b2-futuro-composto-bp` — Terei falado (future perfect)
- `b2-condicional-composto-bp` — Teria falado (conditional perfect)
- (optional) `b2-subj-composto-bp` — Tivesse falado (past perfect subjunctive) — only if not absorbed into Cluster 3 Type 3

Replaces `b1-compound-tenses` and `b2-compound-tenses-all`.

---

### Cluster 5 — EP-twin creation [OPERATIONAL DEBT]

**Why now (mid-priority, not last):** The 7 split candidates carry `<!-- TODO: split into bp/ep -->` markers in their bodies. Until paired, they violate the variant-discipline goal that motivated the consolidation. Doing this after Clusters 1–4 means the high-leverage authoring is done first, but before the long tail.

Each pair: split the existing `-bp` unit into a `-bp` (BP-specific content) + `-ep` (EP-specific content). Shared content stays in… a third `shared` unit? Or duplicated? **Decision deferred to authoring time** — lean toward duplication for now (cleanest variant separation) unless the shared content is non-trivial.

Pairs to create:
- ~~`a1-pron-voce-bp` + `a1-pron-voce-ep`~~ → **shipped as `a1-pron-voce-bp` + `a1-pron-tu-ep`** (slug rename — EP uses tu, not você, as the informal default)
- ~~`a2-estar-gerundio-bp` + `a2-estar-gerundio-ep`~~ → **shipped as `a2-estar-gerundio-bp` + `a2-estar-a-infinitivo-ep`** (slug rename — EP construction is structurally different)
- ~~`a2-reflexivos-bp` + `a2-reflexivos-ep`~~ → **shipped** (parallel slugs)
- ~~`a2-dop-bp` + `a2-dop-ep`~~ → **shipped** (parallel slugs)
- ~~`a2-iop-bp` + `a2-iop-ep`~~ → **shipped** (parallel slugs)
- ~~`a2-imperativo-bp` + `a2-imperativo-ep`~~ → **shipped** (parallel slugs)
- ~~`b1-condicional-bp` + `b1-condicional-ep`~~ → **shipped** (parallel slugs)

**Cluster 5a complete (2026-05-04).** All 7 Phase-2 split candidates resolved. The 7 existing `-bp` units had their TODO markers removed in the same commit.

**Additional EP twins added by Cluster 3 (conditional system):**

- ~~`b1-cond-real-bp` + `b1-cond-real-ep`~~ → **shipped** (Cluster 5b)
- ~~`b2-cond-irreal-bp` + `b2-cond-irreal-ep`~~ → **shipped** (Cluster 5b — register-split as core content)
- ~~`b2-cond-contra-bp` + `b2-cond-contra-ep`~~ → **shipped** (Cluster 5b — register-split as core content; Option C prereq slate selected)
- ~~`b2-condicional-composto-bp` + `b2-condicional-composto-ep`~~ → **shipped** (Cluster 5b)

4 additional `-ep` units (the original Cluster 3 list of 5 minus mais-que-perfeito-subj-ep — Cluster 4 reclassified `b2-mais-que-perfeito-subj` to shared, removing the EP-twin need). Total Cluster 5 scope: **11 new EP units**.

**Cluster 5 fully resolved (2026-05-04).** All 11 BP/EP variant-discipline twins shipped: 7 from Phase-2 split candidates (Cluster 5a) + 4 from Cluster 3 (Cluster 5b). 0 pending.

**Cluster 4 also added an EP-paired authoring outside the Cluster 5 model:**

- `b1-pret-perfeito-composto-bp` and `b1-pret-perfeito-composto-ep` were authored as a paired set in Cluster 4 itself (Path A: BP carries habitual/recent-iterative reading, EP carries present-perfect-continuous reading). Both shipped together; no Cluster 5 backlog entry needed.

---

### Cluster 6 — Pôr / Ter / Vir derivatives (B1.12–14) [LOW DAILY USE]

**3–6 units:** Each derivative family follows the base verb's pattern, so atomization could be one unit per family or one unit per verb.
- `b1-por-derivados-bp` (single unit — propor/repor/dispor/compor/expor/impor/opor/supor/depor/transpor)
- `b1-ter-derivados-bp` (manter/conter/obter/reter/deter/entreter)
- `b1-vir-derivados-bp` (convir/intervir/provir)

3 units replacing `b1-por-derivados`, `b1-ter-derivados`, `b1-vir-derivados`. Possibly split each into base-pattern + irregular-individuals if any verb deviates.

---

### Cluster 7 — Relative pronouns (B1.15) [MODERATE LEVERAGE]

**3–4 units:**
- `b1-rel-que-bp` — que (most common)
- `b1-rel-quem-bp` — quem (after prepositions)
- `b1-rel-onde-bp` — onde (locative)
- `b1-rel-cujo-bp` — cujo (formal possessive)

Replaces `b1-relativos`. The `b2-relativas-avancadas` placeholder is downstream — may absorb some content.

---

### Cluster 8 — Passive voice (B1.17) [LOW DAILY USE]

**2 units:**
- `b1-voz-passiva-ser-bp` — ser + particípio (O livro foi escrito por ele)
- `b1-voz-passiva-se-bp` — passive se (Fala-se português)

Replaces `b1-voz-passiva`.

---

### Cluster 9 — Reported speech (B1.18) [MODERATE]

**2 units:**
- `b1-discurso-indireto-tempos-bp` — tense backshifts (disse que falava, not fala)
- `b1-discurso-indireto-pronomes-bp` — pronoun + time/place word changes

Replaces `b1-discurso-indireto`.

---

### Cluster 10 — Personal infinitive (B2.4) [LOW DAILY USE, HIGH DISTINCTIVENESS]

**2–3 units:** Portuguese-unique feature; valuable for completeness.
- `b2-inf-pessoal-prep-bp` — after prepositions (para eu fazer)
- `b2-inf-pessoal-impessoal-bp` — impersonal expressions (é importante eu fazer)
- (optional) `b2-inf-pessoal-distinto-bp` — different-subject usage

Replaces `b2-infinitivo-pessoal`.

---

### Cluster 11 — BP vs EP deep dive (B2.12) [META/REFERENCE]

**3–5 units:** Explicit cross-variant comparison rather than a single dump.
- `b2-bp-ep-pronouns-bp` (and `-ep` twin)
- `b2-bp-ep-prog-aspect-bp` (and `-ep` twin)
- `b2-bp-ep-vocabulary-bp` (and `-ep` twin)
- `b2-bp-ep-phonetics` (shared?)

Replaces `b2-bp-vs-ep-deep`. **Cluster 11 may produce more `-ep` twins for variants not covered by Cluster 5.**

---

### Cluster 12 — Concessive / purpose / result / conditional conjunctions (B2.9–11) [MODERATE]

**4–5 units:**
- `b2-concessivas-bp` — embora, mesmo que, ainda que + subj
- `b2-finalidade-bp` — para que, a fim de que + subj
- `b2-resultado-bp` — de modo que, de forma que (indicative/subj)
- `b2-cond-conjuncoes-bp` — caso, desde que, contanto que (also see Cluster 3)

Replaces `b2-concessivas`, `b2-finalidade-resultado`, `b2-conj-condicionais`.

---

### Cluster 13 — Discourse / argumentation / register (B2.16–22) [MODERATE]

**5–8 units:** Each placeholder gets atomized into one or two production-grade units.
- `b2-argumentacao-estrutura-bp`, `b2-argumentacao-counterarg-bp`
- `b2-coesao-conectivos-bp`, `b2-coesao-substituicao-bp`
- `b2-academico-bp`
- `b2-business-bp`
- `b2-midia-bp`

Replaces `b2-argumentacao`, `b2-coesao`, `b2-academico`, `b2-business`, `b2-midia`.

---

## Estimated final unit count

| Source | Count |
|---|---|
| Phase 2 corpus | 129 |
| Cluster 1 (4 verbs) | +4 (replaces 4 placeholders → net +0; but each placeholder deletion → 1 net new unit) → **net +0** |
| Cluster 2 (subjuntivo triggers, 7) | +6 (replaces 1 placeholder) |
| Cluster 3 (conditional system, 3) | +2 (replaces 1) |
| Cluster 4 (compound tenses, 4–5) | +2–3 (replaces 2) |
| Cluster 5 (EP twins, 7) | +7 |
| Cluster 6 (derivatives) | +0 (1:1 replacement) |
| Cluster 7 (relatives, 4) | +3 (replaces 1) |
| Cluster 8 (passive, 2) | +1 (replaces 1) |
| Cluster 9 (reported speech, 2) | +1 (replaces 1) |
| Cluster 10 (personal infinitive, 3) | +2 (replaces 1) |
| Cluster 11 (BP/EP, 3–5 + EP twins) | +5–8 |
| Cluster 12 (conjunctions, 4–5) | +1–2 (replaces 3) |
| Cluster 13 (discourse, 5–8) | +0–3 (replaces 5) |
| Side: A2.20 conjunctions split | +2 (no placeholder; net new) |

**Working total: 160–168 units.** Within the 150–170 target.

## What "complete" means per cluster

A cluster is complete when:
1. All new units exist at `docs/units/[slug].md` and pass `validate-units.py`.
2. Replaced placeholders are deleted (slug renames are real renames, not parallel files).
3. Sequence positions interleaved properly (no leftover 200–500.xx placeholder positions for that cluster's content).
4. Prereqs are filled in for the new units.
5. Migration log gets an entry noting the cluster, units added/removed, and any notable atomization or variant decisions.
