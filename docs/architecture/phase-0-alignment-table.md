# Phase 0 Alignment Table — Canonical Migration Input

Status: **Locked.** This is the stable, citeable input for `scripts/migrate-to-units.py`.

## Format

Machine-readable YAML in a fenced block below. The migration script parses the YAML to determine what unit files to create. Each entry corresponds to one file at `docs/units/[id].md`.

## Schema (per entry)

| Field | Type | Source |
|---|---|---|
| `id` | slug | per Phase 1 naming convention |
| `title` | string | from MS header or CEFR cell title |
| `cefr_level` | enum | from CEFR primer; for MS-only, derived from neighbors (higher level wins on ambiguity, logged) |
| `sequence_position` | float | MS units: MS-number as float (e.g., MS17 → 17.0). CEFR-only: 200.x for A1, 300.x for A2, 400.x for B1, 500.x for B2 |
| `topic` | enum | dashboard.json six-value enum |
| `variant` | enum | `shared` default; `bp` only on explicit BP-only content (MS86) |
| `concepts` | array | CEFR-derived: from syllabus-units.json. MS-derived: inferred from topic |
| `cefr_legacy` | array | CEFR cells consumed (per Phase 0 N:M alignment) |
| `ms_legacy` | int or null | MS unit number, null for CEFR-only |
| `source` | string | `ms` or `cefr-only` (for log/audit) |

## Units

```yaml
units:
  # ============================================================
  # MS-derived units (90 entries, MS sequence positions)
  # ============================================================

  - id: a1-ser-identity
    title: "Identity Statements (Eu sou)"
    cefr_level: A1
    sequence_position: 1.0
    topic: verbs
    variant: shared
    concepts: [self-introduction, ser-vs-estar, definite-articles, adjective-agreement]
    cefr_legacy: [A1.1, A1.12, A1.13, A1.15]
    ms_legacy: 1
    source: ms

  - id: a1-sou-de-contracoes
    title: "Origin with Contractions (Eu sou de)"
    cefr_level: A1
    sequence_position: 2.0
    topic: grammar
    variant: shared
    concepts: [common-prepositions, preposition-article-contractions]
    cefr_legacy: [A1.18, A1.19]
    ms_legacy: 2
    source: ms

  - id: a1-moro-em
    title: "Location/Residence (Eu moro em)"
    cefr_level: A1
    sequence_position: 3.0
    topic: verbs
    variant: shared
    concepts: [regular-ar-conjugation, common-prepositions, preposition-article-contractions]
    cefr_legacy: [A1.18, A1.19, A1.23]
    ms_legacy: 3
    source: ms

  - id: a1-moro-rua-avenida
    title: "Street Address (Eu moro na rua/avenida)"
    cefr_level: A1
    sequence_position: 4.0
    topic: conversation
    variant: shared
    concepts: [common-prepositions, preposition-article-contractions]
    cefr_legacy: []
    ms_legacy: 4
    source: ms

  - id: a1-trabalho-em
    title: "Workplace (Eu trabalho em/no/na)"
    cefr_level: A1
    sequence_position: 5.0
    topic: verbs
    variant: shared
    concepts: [regular-ar-conjugation, common-prepositions, preposition-article-contractions, work-professions]
    cefr_legacy: [A1.18, A1.19, A1.23]
    ms_legacy: 5
    source: ms

  - id: a1-falo-linguas
    title: "Languages (Eu falo) + Conjunction e"
    cefr_level: A1
    sequence_position: 6.0
    topic: verbs
    variant: shared
    concepts: [regular-ar-conjugation, conjunctions]
    cefr_legacy: [A1.23, A2.20]
    ms_legacy: 6
    source: ms

  - id: a1-ando-transportes
    title: "Transportation (Eu ando de/a pé)"
    cefr_level: A1
    sequence_position: 7.0
    topic: verbs
    variant: shared
    concepts: [regular-ar-conjugation, ir-transportation]
    cefr_legacy: [A1.27]
    ms_legacy: 7
    source: ms

  - id: a1-vou-de-transporte
    title: "Going by Transport (Eu vou de)"
    cefr_level: A1
    sequence_position: 8.0
    topic: verbs
    variant: shared
    concepts: [irregular-verb-conjugation, ir-transportation]
    cefr_legacy: [A1.24, A1.27]
    ms_legacy: 8
    source: ms

  - id: a1-vou-a-para
    title: "Going to Places (Eu vou a/para)"
    cefr_level: A1
    sequence_position: 9.0
    topic: verbs
    variant: shared
    concepts: [irregular-verb-conjugation, common-prepositions]
    cefr_legacy: [A1.24, A1.27]
    ms_legacy: 9
    source: ms

  - id: a1-um-pouco-de
    title: "Multiple Languages with Varying Proficiency (e um pouco de)"
    cefr_level: A1
    sequence_position: 10.0
    topic: conversation
    variant: shared
    concepts: [common-expressions]
    cefr_legacy: []
    ms_legacy: 10
    source: ms

  - id: a1-pro-drop
    title: "Dropping the Pronoun Eu (Pro-drop)"
    cefr_level: A1
    sequence_position: 11.0
    topic: grammar
    variant: shared
    concepts: [personal-pronouns, subject-identification]
    cefr_legacy: [A1.11, A1.22]
    ms_legacy: 11
    source: ms

  - id: a1-estou-irregular
    title: "Temporary States and Current Location (estou - irregular)"
    cefr_level: A1
    sequence_position: 12.0
    topic: verbs
    variant: shared
    concepts: [ser-vs-estar, irregular-verb-conjugation]
    cefr_legacy: [A1.12, A1.24]
    ms_legacy: 12
    source: ms

  - id: a1-na-casa-de
    title: "Location at Someone's House (na casa de)"
    cefr_level: A1
    sequence_position: 13.0
    topic: grammar
    variant: shared
    concepts: [preposition-article-contractions]
    cefr_legacy: []
    ms_legacy: 13
    source: ms

  - id: a1-poss-meu
    title: "Possessive Adjectives: Meu/Minha (My)"
    cefr_level: A1
    sequence_position: 14.0
    topic: grammar
    variant: shared
    concepts: [possessives]
    cefr_legacy: [A1.16]
    ms_legacy: 14
    source: ms

  - id: a1-num-0-20
    title: "Numbers 0-20 (Cardinal Numbers - Foundation)"
    cefr_level: A1
    sequence_position: 15.0
    topic: vocabulary
    variant: shared
    concepts: [numbers]
    cefr_legacy: [A1.3]
    ms_legacy: 15
    source: ms

  - id: a1-num-21-100
    title: "Numbers 21-100 (Extending the System)"
    cefr_level: A1
    sequence_position: 16.0
    topic: vocabulary
    variant: shared
    concepts: [numbers]
    cefr_legacy: [A1.3]
    ms_legacy: 16
    source: ms

  - id: a1-ter-idade
    title: "Age Expression (Tenho X anos)"
    cefr_level: A1
    sequence_position: 17.0
    topic: verbs
    variant: shared
    concepts: [irregular-verb-conjugation]
    cefr_legacy: [A1.24]
    ms_legacy: 17
    source: ms

  - id: a1-negacao
    title: "Negation (Não + verb)"
    cefr_level: A1
    sequence_position: 18.0
    topic: grammar
    variant: shared
    concepts: [interrogatives]
    cefr_legacy: [A1.21]
    ms_legacy: 18
    source: ms

  - id: a1-ter-posse
    title: "Possession (Tenho - Pets and Vehicles)"
    cefr_level: A1
    sequence_position: 19.0
    topic: verbs
    variant: shared
    concepts: [irregular-verb-conjugation]
    cefr_legacy: [A1.24]
    ms_legacy: 19
    source: ms

  - id: a1-gosto-de
    title: "Likes and Preferences (Gosto de)"
    cefr_level: A1
    sequence_position: 20.0
    topic: verbs
    variant: shared
    concepts: [preposition-collocations, regular-ar-conjugation]
    cefr_legacy: []
    ms_legacy: 20
    source: ms

  - id: a1-gosto-infinitivo
    title: "Liking Activities (Gosto de + Infinitive)"
    cefr_level: A1
    sequence_position: 21.0
    topic: verbs
    variant: shared
    concepts: [preposition-collocations]
    cefr_legacy: []
    ms_legacy: 21
    source: ms

  - id: a1-verbos-er
    title: "-ER Verbs (como, bebo, corro)"
    cefr_level: A1
    sequence_position: 22.0
    topic: verbs
    variant: shared
    concepts: [regular-er-conjugation]
    cefr_legacy: [A1.23]
    ms_legacy: 22
    source: ms

  - id: a1-pron-voce-bp
    title: "Você (You) - Questions and Answers"
    cefr_level: A1
    sequence_position: 23.0
    topic: grammar
    variant: bp
    concepts: [personal-pronouns]
    cefr_legacy: [A1.11]
    ms_legacy: 23
    source: ms
    phase_3_split_pending: true

  - id: a1-pron-ele-ela
    title: "Ele/Ela (He/She) - Talking About Others"
    cefr_level: A1
    sequence_position: 24.0
    topic: grammar
    variant: shared
    concepts: [personal-pronouns]
    cefr_legacy: [A1.11]
    ms_legacy: 24
    source: ms

  - id: a1-pron-nos
    title: "Nós (We) - First Person Plural"
    cefr_level: A1
    sequence_position: 25.0
    topic: grammar
    variant: shared
    concepts: [personal-pronouns]
    cefr_legacy: [A1.11]
    ms_legacy: 25
    source: ms

  - id: a1-pron-voces
    title: "Vocês (You Plural) - Talking to Groups"
    cefr_level: A1
    sequence_position: 26.0
    topic: grammar
    variant: shared
    concepts: [personal-pronouns]
    cefr_legacy: [A1.11]
    ms_legacy: 26
    source: ms

  - id: a1-pron-eles-elas
    title: "Eles/Elas (They) - Talking About Groups"
    cefr_level: A1
    sequence_position: 27.0
    topic: grammar
    variant: shared
    concepts: [personal-pronouns]
    cefr_legacy: [A1.11]
    ms_legacy: 27
    source: ms

  - id: a1-verbos-ir
    title: "-IR Verbs (abro, parto, assisto)"
    cefr_level: A1
    sequence_position: 28.0
    topic: verbs
    variant: shared
    concepts: [regular-ir-conjugation]
    cefr_legacy: [A1.23]
    ms_legacy: 28
    source: ms

  - id: a1-vou-infinitivo
    title: "Future with Vou + Infinitive (Going to...)"
    cefr_level: A1
    sequence_position: 29.0
    topic: tenses
    variant: shared
    concepts: [future-immediate]
    cefr_legacy: [A1.25]
    ms_legacy: 29
    source: ms

  - id: a2-estar-gerundio-bp
    title: "Progressive Tenses - Estar + Gerund (Estou Fazendo)"
    cefr_level: A2
    sequence_position: 30.0
    topic: tenses
    variant: bp
    concepts: [present-continuous]
    cefr_legacy: [A2.6]
    ms_legacy: 30
    source: ms
    phase_3_split_pending: true

  - id: a1-poss-meus
    title: "Plural Possessives: Meus/Minhas (My - Plural)"
    cefr_level: A1
    sequence_position: 31.0
    topic: grammar
    variant: shared
    concepts: [possessives]
    cefr_legacy: [A1.16]
    ms_legacy: 31
    source: ms

  - id: a1-poss-seu-dele
    title: "Your/His/Her Possessives: Seu/Sua + Dele/Dela Construction"
    cefr_level: A1
    sequence_position: 32.0
    topic: grammar
    variant: shared
    concepts: [possessives, pronoun-contractions]
    cefr_legacy: [A1.16]
    ms_legacy: 32
    source: ms

  - id: a1-poss-nosso
    title: "Our Possessives: Nosso/Nossa/Nossos/Nossas"
    cefr_level: A1
    sequence_position: 33.0
    topic: grammar
    variant: shared
    concepts: [possessives]
    cefr_legacy: [A1.16]
    ms_legacy: 33
    source: ms

  - id: a2-pret-regular-ar
    title: "Past Tense - Regular -AR Verbs (Preterite)"
    cefr_level: A2
    sequence_position: 34.0
    topic: tenses
    variant: shared
    concepts: [preterite-regular]
    cefr_legacy: [A2.1]
    ms_legacy: 34
    source: ms

  - id: a2-pret-regular-er-ir
    title: "Past Tense - Regular -ER/-IR Verbs (Preterite)"
    cefr_level: A2
    sequence_position: 35.0
    topic: tenses
    variant: shared
    concepts: [preterite-regular]
    cefr_legacy: [A2.1]
    ms_legacy: 35
    source: ms

  - id: a2-pret-essenciais
    title: "Past Tense - Essential Irregular Verbs (ser, ir, ter, estar)"
    cefr_level: A2
    sequence_position: 36.0
    topic: tenses
    variant: shared
    concepts: [preterite-irregular]
    cefr_legacy: [A2.2]
    ms_legacy: 36
    source: ms

  - id: a2-pret-fazer-ver-dar
    title: "Past Tense - Common Irregular Verbs (fazer, ver, dar)"
    cefr_level: A2
    sequence_position: 37.0
    topic: tenses
    variant: shared
    concepts: [preterite-irregular]
    cefr_legacy: [A2.2]
    ms_legacy: 37
    source: ms

  - id: a1-question-words
    title: "Question Words (Interrogatives)"
    cefr_level: A1
    sequence_position: 38.0
    topic: grammar
    variant: shared
    concepts: [question-words]
    cefr_legacy: [A1.20]
    ms_legacy: 38
    source: ms

  - id: a2-reflexivos-bp
    title: "Reflexive Verbs (me chamo, me levanto, me sinto)"
    cefr_level: A2
    sequence_position: 39.0
    topic: verbs
    variant: bp
    concepts: [reflexive-verbs]
    cefr_legacy: [A2.5]
    ms_legacy: 39
    source: ms
    phase_3_split_pending: true

  - id: a2-dop-bp
    title: "Direct Object Pronouns (me, te, o/a, nos, os/as)"
    cefr_level: A2
    sequence_position: 40.0
    topic: grammar
    variant: bp
    concepts: [object-pronouns]
    cefr_legacy: [A2.8]
    ms_legacy: 40
    source: ms
    phase_3_split_pending: true

  - id: a2-pret-poder-querer-saber
    title: "Past Tense - More Common Irregular Verbs (poder, querer, saber)"
    cefr_level: A2
    sequence_position: 41.0
    topic: tenses
    variant: shared
    concepts: [preterite-irregular]
    cefr_legacy: [A2.2]
    ms_legacy: 41
    source: ms

  - id: a2-por-vs-para
    title: "Para vs Por (Two meanings of for)"
    cefr_level: A2
    sequence_position: 42.0
    topic: grammar
    variant: shared
    concepts: [por-vs-para]
    cefr_legacy: [A2.13]
    ms_legacy: 42
    source: ms

  - id: a2-pret-trazer-dizer-vir-por
    title: "Past Tense - Additional Irregular Verbs (trazer, dizer, vir, pôr)"
    cefr_level: A2
    sequence_position: 43.0
    topic: tenses
    variant: shared
    concepts: [preterite-irregular]
    cefr_legacy: [A2.2]
    ms_legacy: 43
    source: ms

  - id: a2-iop-bp
    title: "Indirect Object Pronouns (lhe, lhes) + Review of me/te/nos"
    cefr_level: A2
    sequence_position: 44.0
    topic: grammar
    variant: bp
    concepts: [object-pronouns]
    cefr_legacy: [A2.9]
    ms_legacy: 44
    source: ms
    phase_3_split_pending: true

  - id: a2-imp-regular
    title: "Imperfect Tense - Regular Verbs (Ongoing/Habitual Past)"
    cefr_level: A2
    sequence_position: 45.0
    topic: tenses
    variant: shared
    concepts: [preterite-imperfect]
    cefr_legacy: [A2.3]
    ms_legacy: 45
    source: ms

  - id: a2-imp-irregular
    title: "Imperfect Tense - Irregular Verbs (ser, ter, vir)"
    cefr_level: A2
    sequence_position: 46.0
    topic: tenses
    variant: shared
    concepts: [preterite-imperfect]
    cefr_legacy: [A2.3]
    ms_legacy: 46
    source: ms

  - id: a2-comparativos
    title: "Comparatives (mais...que, menos...que, tão...quanto)"
    cefr_level: A2
    sequence_position: 47.0
    topic: grammar
    variant: shared
    concepts: [adjective-comparison]
    cefr_legacy: [A2.11]
    ms_legacy: 47
    source: ms

  - id: a2-superlativos
    title: "Superlatives (O mais..., O menos...)"
    cefr_level: A2
    sequence_position: 48.0
    topic: grammar
    variant: shared
    concepts: [adjective-comparison]
    cefr_legacy: [A2.12]
    ms_legacy: 48
    source: ms

  - id: a1-horas
    title: "Telling Time (Que horas são?)"
    cefr_level: A1
    sequence_position: 49.0
    topic: conversation
    variant: shared
    concepts: [time-expressions]
    cefr_legacy: [A1.26]
    ms_legacy: 49
    source: ms

  - id: a1-dias-semana
    title: "Days of the Week (Dias da Semana)"
    cefr_level: A1
    sequence_position: 50.0
    topic: vocabulary
    variant: shared
    concepts: [days-of-week]
    cefr_legacy: [A1.4]
    ms_legacy: 50
    source: ms

  - id: a1-meses
    title: "Months of the Year (Meses do Ano)"
    cefr_level: A1
    sequence_position: 51.0
    topic: vocabulary
    variant: shared
    concepts: [months]
    cefr_legacy: [A1.4]
    ms_legacy: 51
    source: ms

  - id: a1-datas
    title: "Dates (Calendar Dates - Dia, Mês, Ano)"
    cefr_level: A1
    sequence_position: 52.0
    topic: vocabulary
    variant: shared
    concepts: [dates]
    cefr_legacy: [A1.4]
    ms_legacy: 52
    source: ms

  - id: a1-num-ordinais
    title: "Ordinal Numbers (Primeiro, Segundo, Terceiro...)"
    cefr_level: A1
    sequence_position: 53.0
    topic: vocabulary
    variant: shared
    concepts: [numbers]
    cefr_legacy: [A1.3]
    ms_legacy: 53
    source: ms

  - id: a2-tempo-clima
    title: "Weather Expressions (Tempo e Clima)"
    cefr_level: A2
    sequence_position: 54.0
    topic: vocabulary
    variant: shared
    concepts: [weather]
    cefr_legacy: [A2.28]
    ms_legacy: 54
    source: ms

  - id: a1-cores
    title: "Colors (Cores Básicas)"
    cefr_level: A1
    sequence_position: 55.0
    topic: vocabulary
    variant: shared
    concepts: [colors]
    cefr_legacy: [A1.7]
    ms_legacy: 55
    source: ms

  - id: a1-roupas
    title: "Clothing Basics (Roupas Básicas)"
    cefr_level: A1
    sequence_position: 56.0
    topic: vocabulary
    variant: shared
    concepts: [clothing]
    cefr_legacy: [A1.9]
    ms_legacy: 56
    source: ms

  - id: a1-corpo
    title: "Body Parts (Partes do Corpo)"
    cefr_level: A1
    sequence_position: 57.0
    topic: vocabulary
    variant: shared
    concepts: [body-parts]
    cefr_legacy: [A1.8]
    ms_legacy: 57
    source: ms

  - id: a1-familia
    title: "Family Members Expanded (Família - Detalhada)"
    cefr_level: A1
    sequence_position: 58.0
    topic: vocabulary
    variant: shared
    concepts: [family]
    cefr_legacy: [A1.5]
    ms_legacy: 58
    source: ms

  - id: a2-emocoes
    title: "Emotions and Feelings (Emoções e Sentimentos)"
    cefr_level: A2
    sequence_position: 59.0
    topic: vocabulary
    variant: shared
    concepts: [emotions, expressing-opinions]
    cefr_legacy: [A2.29]
    ms_legacy: 59
    source: ms

  - id: a2-localizacoes-direcoes
    title: "Locations and Directions (Localizações e Direções)"
    cefr_level: A2
    sequence_position: 60.0
    topic: vocabulary
    variant: shared
    concepts: [directions]
    cefr_legacy: [A2.23]
    ms_legacy: 60
    source: ms

  - id: a1-casa-comodos
    title: "House and Rooms (Casa e Cômodos)"
    cefr_level: A1
    sequence_position: 61.0
    topic: vocabulary
    variant: shared
    concepts: [house-rooms]
    cefr_legacy: [A1.10]
    ms_legacy: 61
    source: ms

  - id: a2-atividades-diarias
    title: "Daily Activities Verbs (Verbos de Atividades Diárias)"
    cefr_level: A2
    sequence_position: 62.0
    topic: vocabulary
    variant: shared
    concepts: [common-expressions]
    cefr_legacy: []
    ms_legacy: 62
    source: ms

  - id: a2-adv-frequencia
    title: "Frequency Adverbs (Advérbios de Frequência)"
    cefr_level: A2
    sequence_position: 63.0
    topic: grammar
    variant: shared
    concepts: [adverbs-frequency]
    cefr_legacy: [A2.16]
    ms_legacy: 63
    source: ms

  - id: a2-comida-refeicoes
    title: "Food and Meals Expanded (Comida e Refeições)"
    cefr_level: A2
    sequence_position: 64.0
    topic: vocabulary
    variant: shared
    concepts: [food-meals]
    cefr_legacy: [A1.6]
    ms_legacy: 64
    source: ms

  - id: a2-transporte-viagem
    title: "Transportation and Travel (Transporte e Viagem)"
    cefr_level: A2
    sequence_position: 65.0
    topic: vocabulary
    variant: shared
    concepts: [directions, ir-transportation]
    cefr_legacy: [A2.23]
    ms_legacy: 65
    source: ms

  - id: a2-hobbies
    title: "Hobbies and Leisure Activities (Hobbies e Atividades de Lazer)"
    cefr_level: A2
    sequence_position: 66.0
    topic: vocabulary
    variant: shared
    concepts: [hobbies]
    cefr_legacy: [A2.27]
    ms_legacy: 66
    source: ms

  - id: a2-tecnologia
    title: "Technology and Communication (Tecnologia e Comunicação)"
    cefr_level: A2
    sequence_position: 67.0
    topic: vocabulary
    variant: shared
    concepts: [technology]
    cefr_legacy: [A2.30]
    ms_legacy: 67
    source: ms

  - id: a2-compras
    title: "Shopping and Money (Compras e Dinheiro)"
    cefr_level: A2
    sequence_position: 68.0
    topic: vocabulary
    variant: shared
    concepts: [shopping]
    cefr_legacy: [A2.25]
    ms_legacy: 68
    source: ms

  - id: a2-profissoes
    title: "Professions and Work (Profissões e Trabalho)"
    cefr_level: A2
    sequence_position: 69.0
    topic: vocabulary
    variant: shared
    concepts: [work-professions]
    cefr_legacy: [A2.26]
    ms_legacy: 69
    source: ms

  - id: a2-saude
    title: "Health and Medical Basics (Saúde e Médico)"
    cefr_level: A2
    sequence_position: 70.0
    topic: vocabulary
    variant: shared
    concepts: [health-medical, body-parts]
    cefr_legacy: [A2.24]
    ms_legacy: 70
    source: ms

  - id: a2-imperativo-bp
    title: "Commands/Imperative Mood (Imperativo)"
    cefr_level: A2
    sequence_position: 71.0
    topic: tenses
    variant: bp
    concepts: [imperative-mood]
    cefr_legacy: [A2.7]
    ms_legacy: 71
    source: ms
    phase_3_split_pending: true

  - id: a1-demonstrativos
    title: "Demonstratives - This/That (Demonstrativos)"
    cefr_level: A1
    sequence_position: 72.0
    topic: grammar
    variant: shared
    concepts: [demonstratives]
    cefr_legacy: [A1.17]
    ms_legacy: 72
    source: ms

  - id: a1-moveis
    title: "Furniture and Household Items (Móveis e Objetos da Casa)"
    cefr_level: A1
    sequence_position: 73.0
    topic: vocabulary
    variant: shared
    concepts: [house-rooms]
    cefr_legacy: [A1.10]
    ms_legacy: 73
    source: ms

  - id: a2-natureza-animais
    title: "Nature and Animals (Natureza e Animais)"
    cefr_level: A2
    sequence_position: 74.0
    topic: vocabulary
    variant: shared
    concepts: [common-expressions]
    cefr_legacy: []
    ms_legacy: 74
    source: ms

  - id: a2-escola
    title: "School and Education (Escola e Educação)"
    cefr_level: A2
    sequence_position: 75.0
    topic: vocabulary
    variant: shared
    concepts: [common-expressions]
    cefr_legacy: []
    ms_legacy: 75
    source: ms

  - id: b1-fut-sintetico
    title: "Future Tense (Farei, Fará)"
    cefr_level: B1
    sequence_position: 76.0
    topic: tenses
    variant: shared
    concepts: [future-tense]
    cefr_legacy: [B1.1]
    ms_legacy: 76
    source: ms

  - id: b1-condicional-bp
    title: "Conditional Tense (Faria, Gostaria)"
    cefr_level: B1
    sequence_position: 77.0
    topic: tenses
    variant: bp
    concepts: [conditional-formation, conditional-usage]
    cefr_legacy: [B1.2]
    ms_legacy: 77
    source: ms
    phase_3_split_pending: true

  - id: a2-e-que
    title: "É que - Emphatic Questions"
    cefr_level: A2
    sequence_position: 78.0
    topic: grammar
    variant: shared
    concepts: [e-que-questions]
    cefr_legacy: [A2.22]
    ms_legacy: 78
    source: ms

  - id: b1-crase
    title: "Crase (à, às)"
    cefr_level: B1
    sequence_position: 79.0
    topic: grammar
    variant: shared
    concepts: [crase]
    cefr_legacy: [B1.16]
    ms_legacy: 79
    source: ms

  - id: a2-todo-tudo
    title: "Todo vs Tudo"
    cefr_level: A2
    sequence_position: 80.0
    topic: grammar
    variant: shared
    concepts: [todo-vs-tudo]
    cefr_legacy: [A2.19]
    ms_legacy: 80
    source: ms

  - id: b1-subj-introducao
    title: "Introduction to Subjunctive Mood"
    cefr_level: B1
    sequence_position: 81.0
    topic: tenses
    variant: shared
    concepts: [subjunctive-broad]
    cefr_legacy: [B1.8]
    ms_legacy: 81
    source: ms

  - id: b1-subj-pres-regular
    title: "Present Subjunctive - Regular Verbs"
    cefr_level: B1
    sequence_position: 82.0
    topic: tenses
    variant: shared
    concepts: [subjunctive-present]
    cefr_legacy: [B1.9]
    ms_legacy: 82
    source: ms

  - id: b1-subj-pres-irregular
    title: "Present Subjunctive - Irregular Verbs"
    cefr_level: B1
    sequence_position: 83.0
    topic: tenses
    variant: shared
    concepts: [subjunctive-present]
    cefr_legacy: [B1.9]
    ms_legacy: 83
    source: ms

  - id: b1-subj-imperfeito
    title: "Imperfect Subjunctive"
    cefr_level: B1
    sequence_position: 84.0
    topic: tenses
    variant: shared
    concepts: [subjunctive-imperfect]
    cefr_legacy: [B1.10]
    ms_legacy: 84
    source: ms

  - id: b2-subj-futuro
    title: "Future Subjunctive"
    cefr_level: B2
    sequence_position: 85.0
    topic: tenses
    variant: shared
    concepts: [subjunctive-future]
    cefr_legacy: [B2.1]
    ms_legacy: 85
    source: ms

  - id: b2-coloquial-bp
    title: "Colloquial Brazilian Portuguese Consolidated"
    cefr_level: B2
    sequence_position: 86.0
    topic: conversation
    variant: bp
    concepts: [colloquial-speech, register-formal-informal]
    cefr_legacy: [B1.20, B2.13, B2.19]
    ms_legacy: 86
    source: ms

  - id: a2-dem-avancados
    title: "Advanced Demonstratives - Discourse and Temporal Uses"
    cefr_level: A2
    sequence_position: 87.0
    topic: grammar
    variant: shared
    concepts: [demonstratives]
    cefr_legacy: [A2.31]
    ms_legacy: 87
    source: ms

  - id: b1-discourse-markers
    title: "Conversational Strategies and Discourse Markers"
    cefr_level: B1
    sequence_position: 88.0
    topic: conversation
    variant: shared
    concepts: [cohesion-coherence]
    cefr_legacy: [B1.19]
    ms_legacy: 88
    source: ms

  - id: b2-por-para-avancado
    title: "Advanced Por/Para and Idiomatic Expressions"
    cefr_level: B2
    sequence_position: 89.0
    topic: grammar
    variant: shared
    concepts: [por-vs-para, preposition-collocations, idioms-proverbs]
    cefr_legacy: [B2.15, B1.23, B1.24, B2.18]
    ms_legacy: 89
    source: ms

  - id: b2-sintese
    title: "Synthesis and Communication - Integration of All Skills"
    cefr_level: B2
    sequence_position: 90.0
    topic: conversation
    variant: shared
    concepts: [argumentation, cohesion-coherence]
    cefr_legacy: [B2.23]
    ms_legacy: 90
    source: ms

  # ============================================================
  # CEFR-only units (39 entries — no MS coverage)
  # Sequence positions in 200/300/400/500 ranges (out of MS sequence)
  # Body sections will be sparse with TODO markers (Phase 3 enriches)
  # ============================================================

  # --- A1 CEFR-only (2) ---

  - id: a1-greetings
    title: "Greetings & Politeness"
    cefr_level: A1
    sequence_position: 200.02
    topic: conversation
    variant: shared
    concepts: [greetings, register-formal-informal]
    cefr_legacy: [A1.2]
    ms_legacy: null
    source: cefr-only

  - id: a1-plurais
    title: "Noun Plurals"
    cefr_level: A1
    sequence_position: 200.14
    topic: grammar
    variant: shared
    concepts: [noun-plurals]
    cefr_legacy: [A1.14]
    ms_legacy: null
    source: cefr-only

  # --- A2 CEFR-only (7) ---

  - id: a2-pret-vs-imp
    title: "Preterite vs Imperfect"
    cefr_level: A2
    sequence_position: 300.04
    topic: tenses
    variant: shared
    concepts: [preterite-vs-imperfect-aspect]
    cefr_legacy: [A2.4]
    ms_legacy: null
    source: cefr-only

  - id: a2-pron-placement
    title: "Pronoun Placement"
    cefr_level: A2
    sequence_position: 300.10
    topic: grammar
    variant: shared
    concepts: [object-pronouns]
    cefr_legacy: [A2.10]
    ms_legacy: null
    source: cefr-only

  - id: a2-saber-vs-conhecer
    title: "Saber vs Conhecer"
    cefr_level: A2
    sequence_position: 300.14
    topic: verbs
    variant: shared
    concepts: [saber-vs-conhecer]
    cefr_legacy: [A2.14]
    ms_legacy: null
    source: cefr-only

  - id: a2-prep-mais
    title: "More Preposition Usage"
    cefr_level: A2
    sequence_position: 300.15
    topic: grammar
    variant: shared
    concepts: [common-prepositions]
    cefr_legacy: [A2.15]
    ms_legacy: null
    source: cefr-only

  - id: a2-adv-mente
    title: "Manner Adverbs"
    cefr_level: A2
    sequence_position: 300.17
    topic: grammar
    variant: shared
    concepts: [adverbs-manner]
    cefr_legacy: [A2.17]
    ms_legacy: null
    source: cefr-only

  - id: a2-muito-pouco-tanto
    title: "Muito, Pouco, Tanto, Demais"
    cefr_level: A2
    sequence_position: 300.18
    topic: grammar
    variant: shared
    concepts: [muito]
    cefr_legacy: [A2.18]
    ms_legacy: null
    source: cefr-only

  - id: a2-tempo-conjuncoes
    title: "Time Expressions (Connectors)"
    cefr_level: A2
    sequence_position: 300.21
    topic: grammar
    variant: shared
    concepts: [time-expressions]
    cefr_legacy: [A2.21]
    ms_legacy: null
    source: cefr-only

  # --- B1 CEFR-only (14) ---

  - id: b1-compound-tenses
    title: "Compound Tenses (ter + participle)"
    cefr_level: B1
    sequence_position: 400.03
    topic: tenses
    variant: shared
    concepts: [compound-tenses]
    cefr_legacy: [B1.3]
    ms_legacy: null
    source: cefr-only

  - id: b1-aspect-saber
    title: "Saber: Preterite vs Imperfect"
    cefr_level: B1
    sequence_position: 400.04
    topic: verbs
    variant: shared
    concepts: [aspectual-shift-saber]
    cefr_legacy: [B1.4]
    ms_legacy: null
    source: cefr-only

  - id: b1-aspect-conhecer
    title: "Conhecer: Preterite vs Imperfect"
    cefr_level: B1
    sequence_position: 400.05
    topic: verbs
    variant: shared
    concepts: [aspectual-shift-conhecer]
    cefr_legacy: [B1.5]
    ms_legacy: null
    source: cefr-only

  - id: b1-aspect-poder
    title: "Poder: Preterite vs Imperfect"
    cefr_level: B1
    sequence_position: 400.06
    topic: verbs
    variant: shared
    concepts: [aspectual-shift-poder]
    cefr_legacy: [B1.6]
    ms_legacy: null
    source: cefr-only

  - id: b1-aspect-querer
    title: "Querer: Preterite vs Imperfect"
    cefr_level: B1
    sequence_position: 400.07
    topic: verbs
    variant: shared
    concepts: [aspectual-shift-querer]
    cefr_legacy: [B1.7]
    ms_legacy: null
    source: cefr-only

  - id: b1-subj-triggers
    title: "Subjunctive Triggers Deep Dive"
    cefr_level: B1
    sequence_position: 400.11
    topic: tenses
    variant: shared
    concepts: [subjunctive-triggers]
    cefr_legacy: [B1.11]
    ms_legacy: null
    source: cefr-only

  - id: b1-por-derivados
    title: "Pôr and Derivatives"
    cefr_level: B1
    sequence_position: 400.12
    topic: verbs
    variant: shared
    concepts: [por-derivatives]
    cefr_legacy: [B1.12]
    ms_legacy: null
    source: cefr-only

  - id: b1-ter-derivados
    title: "Ter and Derivatives"
    cefr_level: B1
    sequence_position: 400.13
    topic: verbs
    variant: shared
    concepts: [ter-derivatives]
    cefr_legacy: [B1.13]
    ms_legacy: null
    source: cefr-only

  - id: b1-vir-derivados
    title: "Vir and Derivatives"
    cefr_level: B1
    sequence_position: 400.14
    topic: verbs
    variant: shared
    concepts: [vir-derivatives]
    cefr_legacy: [B1.14]
    ms_legacy: null
    source: cefr-only

  - id: b1-relativos
    title: "Relative Pronouns"
    cefr_level: B1
    sequence_position: 400.15
    topic: grammar
    variant: shared
    concepts: [relative-pronouns]
    cefr_legacy: [B1.15]
    ms_legacy: null
    source: cefr-only

  - id: b1-voz-passiva
    title: "Passive Voice"
    cefr_level: B1
    sequence_position: 400.17
    topic: grammar
    variant: shared
    concepts: [passive-voice]
    cefr_legacy: [B1.17]
    ms_legacy: null
    source: cefr-only

  - id: b1-discurso-indireto
    title: "Reported Speech"
    cefr_level: B1
    sequence_position: 400.18
    topic: grammar
    variant: shared
    concepts: [reported-speech]
    cefr_legacy: [B1.18]
    ms_legacy: null
    source: cefr-only

  - id: b1-opinioes
    title: "Expressing Opinions"
    cefr_level: B1
    sequence_position: 400.21
    topic: conversation
    variant: shared
    concepts: [expressing-opinions]
    cefr_legacy: [B1.21]
    ms_legacy: null
    source: cefr-only

  - id: b1-narracao
    title: "Narration & Storytelling"
    cefr_level: B1
    sequence_position: 400.22
    topic: conversation
    variant: shared
    concepts: [narration-storytelling]
    cefr_legacy: [B1.22]
    ms_legacy: null
    source: cefr-only

  # --- B2 CEFR-only (16) ---

  - id: b2-subj-broad
    title: "Subjunctive in All Contexts"
    cefr_level: B2
    sequence_position: 500.02
    topic: tenses
    variant: shared
    concepts: [subjunctive-broad]
    cefr_legacy: [B2.2]
    ms_legacy: null
    source: cefr-only

  - id: b2-condicionais-sistema
    title: "Conditional Sentences (Full System)"
    cefr_level: B2
    sequence_position: 500.03
    topic: grammar
    variant: shared
    concepts: [conditional-sentences]
    cefr_legacy: [B2.3]
    ms_legacy: null
    source: cefr-only

  - id: b2-infinitivo-pessoal
    title: "Personal Infinitive"
    cefr_level: B2
    sequence_position: 500.04
    topic: grammar
    variant: shared
    concepts: [personal-infinitive]
    cefr_legacy: [B2.4]
    ms_legacy: null
    source: cefr-only

  - id: b2-compound-tenses-all
    title: "All Compound Tenses"
    cefr_level: B2
    sequence_position: 500.05
    topic: tenses
    variant: shared
    concepts: [compound-tenses]
    cefr_legacy: [B2.5]
    ms_legacy: null
    source: cefr-only

  - id: b2-participios-duplos
    title: "Double Participles"
    cefr_level: B2
    sequence_position: 500.07
    topic: verbs
    variant: shared
    concepts: [double-participles]
    cefr_legacy: [B2.7]
    ms_legacy: null
    source: cefr-only

  - id: b2-relativas-avancadas
    title: "Advanced Relative Clauses"
    cefr_level: B2
    sequence_position: 500.08
    topic: grammar
    variant: shared
    concepts: [relative-pronouns]
    cefr_legacy: [B2.8]
    ms_legacy: null
    source: cefr-only

  - id: b2-concessivas
    title: "Concessive Clauses"
    cefr_level: B2
    sequence_position: 500.09
    topic: grammar
    variant: shared
    concepts: [concessive-clauses]
    cefr_legacy: [B2.9]
    ms_legacy: null
    source: cefr-only

  - id: b2-finalidade-resultado
    title: "Purpose & Result Clauses"
    cefr_level: B2
    sequence_position: 500.10
    topic: grammar
    variant: shared
    concepts: [purpose-result-clauses]
    cefr_legacy: [B2.10]
    ms_legacy: null
    source: cefr-only

  - id: b2-conj-condicionais
    title: "Conditional Conjunctions"
    cefr_level: B2
    sequence_position: 500.11
    topic: grammar
    variant: shared
    concepts: [conditional-conjunctions]
    cefr_legacy: [B2.11]
    ms_legacy: null
    source: cefr-only

  - id: b2-bp-vs-ep-deep
    title: "BP vs EP Deep Dive"
    cefr_level: B2
    sequence_position: 500.12
    topic: conversation
    variant: shared
    concepts: [bp-vs-ep-distinctions]
    cefr_legacy: [B2.12]
    ms_legacy: null
    source: cefr-only

  - id: b2-falsos-cognatos
    title: "False Cognates"
    cefr_level: B2
    sequence_position: 500.14
    topic: vocabulary
    variant: shared
    concepts: [false-cognates]
    cefr_legacy: [B2.14]
    ms_legacy: null
    source: cefr-only

  - id: b2-argumentacao
    title: "Argumentation"
    cefr_level: B2
    sequence_position: 500.16
    topic: conversation
    variant: shared
    concepts: [argumentation]
    cefr_legacy: [B2.16]
    ms_legacy: null
    source: cefr-only

  - id: b2-coesao
    title: "Cohesion & Coherence"
    cefr_level: B2
    sequence_position: 500.17
    topic: conversation
    variant: shared
    concepts: [cohesion-coherence]
    cefr_legacy: [B2.17]
    ms_legacy: null
    source: cefr-only

  - id: b2-academico
    title: "Academic Portuguese"
    cefr_level: B2
    sequence_position: 500.20
    topic: conversation
    variant: shared
    concepts: [academic-portuguese]
    cefr_legacy: [B2.20]
    ms_legacy: null
    source: cefr-only

  - id: b2-business
    title: "Business Portuguese"
    cefr_level: B2
    sequence_position: 500.21
    topic: conversation
    variant: shared
    concepts: [business-portuguese]
    cefr_legacy: [B2.21]
    ms_legacy: null
    source: cefr-only

  - id: b2-midia
    title: "Media & Current Events"
    cefr_level: B2
    sequence_position: 500.22
    topic: conversation
    variant: shared
    concepts: [media-current-events]
    cefr_legacy: [B2.22]
    ms_legacy: null
    source: cefr-only
```

## Coverage stats

- 90 MS-derived units (one per MS unit, no atomization changes from source)
- 39 CEFR-only units (cells with zero MS coverage)
- **Total: 129 unit files to be created in Phase 2**

## CEFR cell coverage

Every CEFR primer cell appears in exactly one of:

1. The `cefr_legacy` array of one or more MS-derived units (consumed/touched)
2. Its own CEFR-only unit (no MS coverage)

A2.20 (Basic Conjunctions) is partially covered by MS6 (which only teaches "e"); the remaining conjunctions (ou, mas, porque, quando, se, como) stay orphaned for Phase 3 to redistribute. Logged in migration log.

## Variant assignments

Phase 2 sets `variant: bp` (with `-bp` slug suffix per the variant-suffix rule) on every unit whose source content materially diverges between BP and EP per the PEDAGOGY rule:

| id | source | reason for split |
|---|---|---|
| `b2-coloquial-bp` | MS86 | explicit "Colloquial Brazilian Portuguese" in source title |
| `a1-pron-voce-bp` | MS23 | você vs tu pronoun choice |
| `a2-estar-gerundio-bp` | MS30 | gerund vs `estar a +` infinitive |
| `a2-reflexivos-bp` | MS39 | clitic placement |
| `a2-dop-bp` | MS40 | clitic placement |
| `a2-iop-bp` | MS44 | clitic placement |
| `a2-imperativo-bp` | MS71 | você-form vs tu-form imperatives |
| `b1-condicional-bp` | MS77 | EP often substitutes imperfeito de cortesia |

The seven entries marked `phase_3_split_pending: true` will gain an EP twin in Phase 3 (slug suffix `-ep`, EP-specific content). The migration script prepends a TODO marker to those unit bodies. `b2-coloquial-bp` is BP-only by topic (BP slang specifically) and does not have a pending EP twin.

All other units default to `variant: shared`.

## Sequence position rationale

- MS-derived units carry their MS number as `sequence_position` (MS17 → 17.0). This preserves MS pedagogy ordering for the BP track.
- CEFR-only units are placed in level-specific 200/300/400/500 ranges, far from any MS position. This keeps the MS sequence intact until Phase 3 re-sequences them properly.
- Encoding: `[level-base].[CEFR cell number, zero-padded to 2 digits]` (e.g., A2.4 → 300.04, A1.14 → 200.14, B2.20 → 500.20). The 2-digit zero-pad is **required** — encoding cell N as a single digit would collide under YAML float parsing (300.4 == 300.40 != 300.04).

## Topic assignment rules

- Verb-introduction units (introduces a specific verb's conjugation) → `verbs`
- Tense systems (preterite, imperfect, future, conditional, subjunctive, immediate future) → `tenses`
- Non-verb grammar (articles, possessives, prepositions, contractions, pronouns, demonstratives, comparatives, adverbs) → `grammar`
- Vocabulary domains (numbers, family, food, colors, body, clothes, house, weather, etc.) → `vocabulary`
- Applied/communicative use (greetings, telling time, register, narration, argumentation) → `conversation`
- Pronunciation rules → `pronunciation` (none in Phase 2 per Phase 1 lock)
