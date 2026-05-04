# Phase 2 Migration Log

Run: 2026-05-04T01:04:25
Total units: 129

## Per-unit decisions

  - a1-ser-identity: M:1 merge — MS1 consolidates ['A1.1', 'A1.12', 'A1.13', 'A1.15'] into one productive unit (MS framing wins)
  - a1-sou-de-contracoes: M:1 merge — MS2 consolidates ['A1.18', 'A1.19'] into one productive unit (MS framing wins)
  - a1-moro-em: M:1 merge — MS3 consolidates ['A1.18', 'A1.19', 'A1.23'] into one productive unit (MS framing wins)
  - a1-trabalho-em: M:1 merge — MS5 consolidates ['A1.18', 'A1.19', 'A1.23'] into one productive unit (MS framing wins)
  - a1-falo-linguas: M:1 merge — MS6 consolidates ['A1.23', 'A2.20'] into one productive unit (MS framing wins)
  - a1-vou-de-transporte: M:1 merge — MS8 consolidates ['A1.24', 'A1.27'] into one productive unit (MS framing wins)
  - a1-vou-a-para: M:1 merge — MS9 consolidates ['A1.24', 'A1.27'] into one productive unit (MS framing wins)
  - a1-pro-drop: M:1 merge — MS11 consolidates ['A1.11', 'A1.22'] into one productive unit (MS framing wins)
  - a1-estou-irregular: M:1 merge — MS12 consolidates ['A1.12', 'A1.24'] into one productive unit (MS framing wins)
  - b2-coloquial-bp: M:1 merge — MS86 consolidates ['B1.20', 'B2.13', 'B2.19'] into one productive unit (MS framing wins)
  - b2-por-para-avancado: M:1 merge — MS89 consolidates ['B2.15', 'B1.23', 'B1.24', 'B2.18'] into one productive unit (MS framing wins)
  - a1-greetings: CEFR-only port from A1.2 (sparse body, Phase 3 enrichment needed)
  - a1-plurais: CEFR-only port from A1.14 (sparse body, Phase 3 enrichment needed)
  - a2-pret-vs-imp: CEFR-only port from A2.4 (sparse body, Phase 3 enrichment needed)
  - a2-pron-placement: CEFR-only port from A2.10 (sparse body, Phase 3 enrichment needed)
  - a2-saber-vs-conhecer: CEFR-only port from A2.14 (sparse body, Phase 3 enrichment needed)
  - a2-prep-mais: CEFR-only port from A2.15 (sparse body, Phase 3 enrichment needed)
  - a2-adv-mente: CEFR-only port from A2.17 (sparse body, Phase 3 enrichment needed)
  - a2-muito-pouco-tanto: CEFR-only port from A2.18 (sparse body, Phase 3 enrichment needed)
  - a2-tempo-conjuncoes: CEFR-only port from A2.21 (sparse body, Phase 3 enrichment needed)
  - b1-compound-tenses: CEFR-only port from B1.3 (sparse body, Phase 3 enrichment needed)
  - b1-aspect-saber: CEFR-only port from B1.4 (sparse body, Phase 3 enrichment needed)
  - b1-aspect-conhecer: CEFR-only port from B1.5 (sparse body, Phase 3 enrichment needed)
  - b1-aspect-poder: CEFR-only port from B1.6 (sparse body, Phase 3 enrichment needed)
  - b1-aspect-querer: CEFR-only port from B1.7 (sparse body, Phase 3 enrichment needed)
  - b1-subj-triggers: CEFR-only port from B1.11 (sparse body, Phase 3 enrichment needed)
  - b1-por-derivados: CEFR-only port from B1.12 (sparse body, Phase 3 enrichment needed)
  - b1-ter-derivados: CEFR-only port from B1.13 (sparse body, Phase 3 enrichment needed)
  - b1-vir-derivados: CEFR-only port from B1.14 (sparse body, Phase 3 enrichment needed)
  - b1-relativos: CEFR-only port from B1.15 (sparse body, Phase 3 enrichment needed)
  - b1-voz-passiva: CEFR-only port from B1.17 (sparse body, Phase 3 enrichment needed)
  - b1-discurso-indireto: CEFR-only port from B1.18 (sparse body, Phase 3 enrichment needed)
  - b1-opinioes: CEFR-only port from B1.21 (sparse body, Phase 3 enrichment needed)
  - b1-narracao: CEFR-only port from B1.22 (sparse body, Phase 3 enrichment needed)
  - b2-subj-broad: CEFR-only port from B2.2 (sparse body, Phase 3 enrichment needed)
  - b2-condicionais-sistema: CEFR-only port from B2.3 (sparse body, Phase 3 enrichment needed)
  - b2-infinitivo-pessoal: CEFR-only port from B2.4 (sparse body, Phase 3 enrichment needed)
  - b2-compound-tenses-all: CEFR-only port from B2.5 (sparse body, Phase 3 enrichment needed)
  - b2-participios-duplos: CEFR-only port from B2.7 (sparse body, Phase 3 enrichment needed)
  - b2-relativas-avancadas: CEFR-only port from B2.8 (sparse body, Phase 3 enrichment needed)
  - b2-concessivas: CEFR-only port from B2.9 (sparse body, Phase 3 enrichment needed)
  - b2-finalidade-resultado: CEFR-only port from B2.10 (sparse body, Phase 3 enrichment needed)
  - b2-conj-condicionais: CEFR-only port from B2.11 (sparse body, Phase 3 enrichment needed)
  - b2-bp-vs-ep-deep: CEFR-only port from B2.12 (sparse body, Phase 3 enrichment needed)
  - b2-falsos-cognatos: CEFR-only port from B2.14 (sparse body, Phase 3 enrichment needed)
  - b2-argumentacao: CEFR-only port from B2.16 (sparse body, Phase 3 enrichment needed)
  - b2-coesao: CEFR-only port from B2.17 (sparse body, Phase 3 enrichment needed)
  - b2-academico: CEFR-only port from B2.20 (sparse body, Phase 3 enrichment needed)
  - b2-business: CEFR-only port from B2.21 (sparse body, Phase 3 enrichment needed)
  - b2-midia: CEFR-only port from B2.22 (sparse body, Phase 3 enrichment needed)

## Variant-split candidates flagged for Phase 3 EP-twin authoring
These units are migrated as variant=bp with -bp slug suffix, body-top TODO marker. Phase 3 creates the -ep sibling with EP-specific content.
  - a1-pron-voce-bp (from MS23): você vs tu pronoun choice
  - a2-estar-gerundio-bp (from MS30): gerund vs estar a + infinitive
  - a2-reflexivos-bp (from MS39): clitic placement BP/EP differs
  - a2-dop-bp (from MS40): clitic placement BP/EP differs
  - a2-iop-bp (from MS44): clitic placement BP/EP differs
  - a2-imperativo-bp (from MS71): você-form vs tu-form imperatives
  - b1-condicional-bp (from MS77): EP often substitutes imperfeito de cortesia

## CEFR-level ambiguity decisions
MS units that span multiple CEFR cells across different levels:
  - b2-coloquial-bp (from MS86): spans B1.20 + B2.13 + B2.19; assigned cefr_level=B2 (higher level wins)
  - a2-estar-gerundio (from MS30): MS positions at 30, but CEFR places A2.6; cefr_level=A2 (CEFR wins)
  - a1-question-words (from MS38): MS positions at 38, but CEFR places A1.20; cefr_level=A1 (CEFR wins)
  - a1-horas (from MS49): MS positions at 49, but CEFR places A1.26; cefr_level=A1 (CEFR wins)
  - a1-demonstrativos (from MS72): MS positions at 72, but CEFR places A1.17; cefr_level=A1 (CEFR wins)
  - a2-e-que (from MS78): MS positions at 78, but CEFR places A2.22; cefr_level=A2 (CEFR wins)
  - a2-todo-tudo (from MS80): MS positions at 80, but CEFR places A2.19; cefr_level=A2 (CEFR wins)
  - b2-subj-futuro (from MS85): MS positions at 85, but CEFR places B2.1; cefr_level=B2 (CEFR wins)
  - a2-dem-avancados (from MS87): MS positions at 87, but CEFR places A2.31; cefr_level=A2 (CEFR wins)

## Partial CEFR coverage notes
  - A2.20 (Basic Conjunctions) is partially covered by MS6 (which only teaches "e"). Remaining conjunctions (ou, mas, porque, quando, se, como) stay orphaned for Phase 3 to redistribute.

## Summary stats
  - Files written: 129
  - MS-derived: 90
  - CEFR-only: 39
  - By CEFR level: {'A1': 47, 'A2': 40, 'B1': 22, 'B2': 20}
  - By variant: {'shared': 121, 'bp': 8}
