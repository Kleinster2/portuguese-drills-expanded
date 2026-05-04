# Phase 3 Side-Tasks Audit

Run: 2026-05-04 (Phase 3.5 cleanup batch).

## Validator state pre-cleanup

164 unit files, 0 hard-fails, 36 soft warnings:

- 18 substantive emptiness (Outcomes/Vocabulary missing on sparse CEFR-only units)
- 15 sequence positions in 200-500.xx placeholder range (overlap with above)
- 3 intentional design choices (16-prereq array on `b2-bp-ep-clitica-tempos`; B2-with-A1 prereqs on `b2-infinitivo-pessoal-formacao` and `b2-bp-ep-pronomes-tratamento`)

## Sequence-position normalization audit

Cross-referenced the 15 placeholder-range warnings against Phase 3 cluster history.

### 14 genuinely unenriched (expected backlog)

These CEFR-only placeholders have no Phase 3 cluster ownership; they remain sparse pending opportunistic enrichment:

| Unit | CEFR cell | Why no cluster touched it |
|---|---|---|
| `a1-greetings` | A1.2 | Not on any Phase 3 cluster scope |
| `a1-plurais` | A1.14 | Not on any Phase 3 cluster scope |
| `a2-adv-mente` | A2.17 | Not on any Phase 3 cluster scope |
| `a2-muito-pouco-tanto` | A2.18 | Not on any Phase 3 cluster scope |
| `a2-prep-mais` | A2.15 | Not on any Phase 3 cluster scope |
| `a2-pron-placement` | A2.10 | Not on any Phase 3 cluster scope |
| `a2-saber-vs-conhecer` | A2.14 | Not on any Phase 3 cluster scope |
| `a2-tempo-conjuncoes` | A2.21 | Not on any Phase 3 cluster scope |
| `b1-narracao` | B1.22 | Not on any Phase 3 cluster scope |
| `b1-opinioes` | B1.21 | Not on any Phase 3 cluster scope |
| `b2-falsos-cognatos` | B2.14 | Not on any Phase 3 cluster scope |
| `b2-participios-duplos` | B2.7 | Not on any Phase 3 cluster scope |
| `b2-relativas-avancadas` | B2.8 | Cluster 7 covered B1.15 relatives but not B2.8 advanced clauses |
| `b2-subj-broad` | B2.2 | "Subjunctive in All Contexts" is review-style; no Phase 3 cluster did review |

These remain in the corpus as pre-Phase-6 backlog. They're sparse but valid units; future opportunistic enrichment can address them.

### 1 missed Cluster 3 cleanup (acted in this batch)

| Unit | CEFR cell | Status |
|---|---|---|
| `b2-condicionais-sistema` | B2.3 | **DELETE** — Cluster 3 fully atomized B2.3 into `b1-cond-real-bp`/`-ep` + `b2-cond-irreal-bp`/`-ep` + `b2-cond-contra-bp`/`-ep`. The original placeholder was structurally replaced but never removed. |

Cluster 3 commit (Phase 3 Cluster 3) created the 3 type-specific conditional units + 2 form-prereq units, all carrying `cefr_legacy: [B2.3]`. The placeholder is now redundant noise.

Action taken: delete `b2-condicionais-sistema.md` in this Phase 3.5 commit. Not a reseat (so the stop condition for "unexpected reseats needed" doesn't strictly trigger), but a missed cleanup.

## Substantive-emptiness audit

The 18 substantive-emptiness warnings overlap with the 14 unenriched-placeholder warnings (same units). After Phase 3.5 cleanup of the 6 named side tasks, the empty-section warnings drop slightly (a1-ser-identity gains article content; pôr/vir present-tense intros and particípios introduction add new units) but most of the 14-unit unenriched-CEFR-only set remains unchanged.

Expected post-Phase 3.5 warning state:
- 14 substantive-emptiness warnings remain on the sparse CEFR-only set (unchanged)
- 14 → 13 placeholder-range warnings (b2-condicionais-sistema removed)
- 3 intentional design choices unchanged
- New units added in Phase 3.5 are fully populated (no new warnings)

## Phase 3.5 task readiness

| # | Task | Ready? |
|---|---|---|
| 1 | a1-por-presente-introducao | Yes — A1 zone, no prereq blockers |
| 2 | a1-vir-presente-introducao | Yes — A1 zone, no prereq blockers |
| 3 | b1-particípios-introducao | Yes — needs sequence position 46.85, then update b1-passiva-ser prereq |
| 4 | A2.20 conjunctions split | Yes — pedagogy-preferred (b) split |
| 5 | a1-ser-identity article enrichment | Yes — in-place edit |
| 6 | b1-subj-trigger-impessoal cross-link | Yes — single wikilink addition |

No blockers found. Proceeding with Phase 3.5 cleanup batch.
