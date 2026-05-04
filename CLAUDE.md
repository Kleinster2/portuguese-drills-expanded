# Portuguese Learning Platform

AI-powered Portuguese language learning. Brazilian Portuguese by default, European Portuguese available.

**[Live Site](https://portuguese-drills-expanded.pages.dev)** | **[Changelog](CHANGELOG.md)**

## Session Startup

On first message, run unconditionally — do not wait for a trigger:

1. **Active-roster pre-flight.** Invoke `/roster` (skill at `.claude/skills/roster/SKILL.md`). Establishes the working roster from `Students/*.md` + calendar + WhatsApp cross-ref. Catches WhatsApp-only students (Amanda) that the calendar misses.

Gmail is swept by a standing cloud routine ("Gmail student check", every 6h) — no session-start `/loop` needed. To inspect or modify cloud routines, run `RemoteTrigger action=list`.

For any question about one specific student, invoke `/student <name>`. Never answer student-status questions from the calendar alone.

## Related Repos

Part of a multi-repo ecosystem. Full map in `~/.claude/CLAUDE.md`.

- **Brazil vault** (`~/obsidian/brazil/`) — Brazilian culture, politics, institutions. Context for teaching materials and cultural references in drills.
- **Business vault** (`~/obsidian/business/`) — Tutoring business operations (invoicing, scheduling, revenue). Student profiles live HERE in `Students/`, not in business vault.
- **financial-charts** (`~/financial-charts/`) — Gil's market research system. Separate domain but same ecosystem.

---

## Core Integrations

This is a teaching platform, not just a code project. These integrations are central to how it operates:

- **Google Calendar (Gilberto Aulas)**: Scheduling, session tracking, student confirmations. Calendar ID: `fmn4i9pf5s3ile6hbl5d9rngeg@group.calendar.google.com`. Always check all calendars, not just primary.
- **WhatsApp**: Primary communication channel with students.
- **Student files** (`Students/`): One file per student — profile, session log, notes, communications.

When any student-related topic comes up, proactively check: student file, WhatsApp, and the Aulas calendar. Don't wait to be asked.

All student sessions are **90 minutes**. Calendar events with attendees must not contain internal notes in the description (attendees can see it).

## Features

### 1. Diagnostic Test
Assess your proficiency level in 10-15 minutes.
- 25 questions across A1-B2 levels
- Instant results with strengths/weaknesses
- Personalized drill recommendations
- Teacher tools: generate unique test links, view reports

### 2. AI Practice Drills
131 interactive exercises with Claude AI tutoring.
- Verb conjugation, grammar, prepositions, conversation
- Clickable answer chips for quick responses
- Detailed explanations and feedback
- Multi-drill sessions with random rotation
- A1 to B2+ difficulty levels

### 3. Text Simplifier
Read anything in Portuguese at your level.
- Paste text in any language → get simplified Portuguese
- Choose CEFR level (A1, A2, B1, B2)
- Hover/tap any word for English translation
- 3000+ word dictionary with Claude fallback

### 4. Pronunciation Lessons
Structured curriculum for Brazilian Portuguese sounds.
- 4 phases, 8+ units with audio
- 6 pronunciation rules with annotations
- 5-step progressive format per lesson
- Programmatic annotation system (Python + JS)

### 5. PWA Support
Installable app with offline mode.
- Add to home screen on any device
- Core features work offline
- Background updates

## UI Structure

**Navigation**: Sticky nav bar on all pages linking to Home, Diagnostic, Drills, Simplifier, Curriculum.

**Homepage Dashboard**: Feature cards linking to each tool, followed by drills section with search/filters.

**Pages**:
- `/` - Dashboard + Drills
- `/diagnostic-test.html` - Proficiency assessment
- `/simplifier.html` - Text simplification tool
- `/syllabus.html` - Pronunciation curriculum

## Quick Start

```bash
npx wrangler pages dev .                                    # Local dev
npx wrangler pages deploy . --project-name=portuguese-drills-expanded  # Deploy
```

Set `ANTHROPIC_API_KEY` in Cloudflare Pages environment variables.

## Pedagogy — The Governing Document

**[PEDAGOGY.md](PEDAGOGY.md)** defines the teaching methodology for the entire project. All content decisions — drills, worksheets, diagnostic questions, curriculum design, pronunciation lessons — must follow it.

**Read PEDAGOGY.md before creating or modifying any content.**

Key principles it establishes:
- **Variant separation**: BP and EP are completely separate tracks. Never mix.
- **Native Usage Filter**: Never teach a form that a native speaker wouldn't use in conversation — even if prescriptively correct.
- **Self-introduction first**: "eu" before all other subjects. Singular before plural.
- **Grammar in service of communication**: No abstract grammar drills. Every rule serves a communicative goal.
- **Centrality ranking**: Universal high-frequency vocabulary before situational vocabulary.
- **Imperfeito vs condicional**: BP and EP handle this differently — the pedagogy specifies exactly how for each variant.

The pedagogy also includes a **BP vs EP divergence table** for content generators and a **worksheet generation checklist**.

## CRITICAL: Editing Drill Prompts

**Drill prompts are BUNDLED.** The app loads from `utils/promptData.generated.js`, NOT directly from the JSON files.

After editing ANY file in `config/prompts/` or `config/dashboard.json`:

```bash
npm run build    # Regenerate bundle + inject drill cards into index.html
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

**What the build does:**
1. Reads `config/prompts/*.json` → writes `utils/promptData.generated.js` (the drill bundle).
2. Reads `config/dashboard.json` (dashboard sidecar: which drills appear, their topic/cefr/icon) and the bundle.
3. Validates every sidecar entry has a matching bundle drill. Fails the build on mismatch.
4. Regenerates the drill cards inside `index.html` between `<!-- BEGIN-GENERATED-DRILLS -->` and `<!-- END-GENERATED-DRILLS -->`. Drill `name`/`description` come from the bundle; `topic`/`cefr`/`icon` come from the sidecar.

Do not edit the sentinel block in `index.html` by hand — it's overwritten on every build. To add a new drill to the dashboard: create the JSON file, add an entry to `config/dashboard.json`, run `npm run build`.

**If you skip `npm run build`, your changes will NOT appear on the live site!**

The bundle is generated by `scripts/build-prompts.js` and combines all 131 drill JSON files into one JS module for faster loading.

## Curriculum Design Principles

These principles implement the methodology defined in [PEDAGOGY.md](PEDAGOGY.md).

**Units** = curriculum topics (what should be taught)
**Drills** = JSON files in `config/prompts/` that implement practice exercises

The relationship is many-to-many:
- A drill can cover multiple units
- A unit can have multiple drills
- A unit may not have a drill yet

### Atomic Focus
Each unit should target ONE specific concept. When in doubt, split rather than combine.

**Examples:**
- Saber vs Conhecer → one unit (single distinction)
- Aspectual shifts (saber, conhecer, poder, querer) → four separate units, not one combined
- Pôr derivatives → one unit (single pattern applied to many verbs)

**Rationale:**
- Focused practice builds stronger retention
- Learners can target specific weaknesses
- Progress tracking is more granular
- Units can be combined in multi-drill sessions when broader practice is needed

### CEFR Alignment
Curriculum follows CEFR levels (A1-B2). See:
- [A1 Curriculum](docs/drills/A1-curriculum-primer.md) - 27 units
- [A2 Curriculum](docs/drills/A2-curriculum-primer.md) - 31 units
- [B1 Curriculum](docs/drills/B1-curriculum-primer.md) - 24 units
- [B2 Curriculum](docs/drills/B2-curriculum-primer.md) - 23 units

## Documentation

### By Feature
| Feature | User Guide | Dev Docs |
|---------|------------|----------|
| Diagnostic Test | — | `config/diagnostic-test-*.json` |
| AI Drills | [Curriculum](docs/drills/) | [Drill Template](docs/drills/DRILL_TEMPLATE.md) |
| Text Simplifier | — | [Hover Translations](docs/simplifier/hover-translations.md) |
| Pronunciation | [Syllabus](SYLLABUS_PHASE_1.md) | [Annotation Workflow](docs/pronunciation/ANNOTATION_WORKFLOW.md) |

### Foundation
| Document | Description |
|----------|-------------|
| [Pedagogy](PEDAGOGY.md) | **Governing document** — teaching methodology, variant rules, native usage filter |
| [Drill Best Practices](docs/drills/DRILL_BEST_PRACTICES.md) | 10 codified practices for drill design |
| [Drill Template](docs/drills/DRILL_TEMPLATE.md) | Ready-to-copy template implementing all best practices |
| [Micro-Sequence Syllabus](docs/drills/syllabus-micro-sequence.md) | 90 units with per-unit vocabulary, grammar, outcomes |
| [Concept Taxonomy](docs/concepts.md) | Granular concept slugs for cross-referencing teaching content |
| [Known Trap Topics](docs/known-trap-topics.md) | Inventory of trap-prone topics with documented past failures |

## Concept Taxonomy

Two levels of classification across all teaching content:

- **Topic** (coarse) — 6 buckets in `config/dashboard.json`: verbs / vocabulary / tenses / grammar / pronunciation / conversation. Drives the dashboard filter pills.
- **Concept** (granular) — ~110 atomic concept slugs in `docs/concepts.md`. Each represents one skill the student can practice independently.

**Sources tagged with concepts:**
- `config/dashboard.json` — every drill has a single `concept` field (120 drills).
- `docs/content-manifest.json` — every worksheet, primer, and lesson page has a `concepts` array (21 worksheets + 1 primer; 3 archived).
- `docs/known-trap-topics.md` — topic-specific trap entries have a `Concept:` line.
- `config/diagnostic-test-unit-concepts.json` — 66/74 diagnostic test units tagged. One unit covers ~4–12 questions, transitively tagging ~300 of the 350 questions.
- `docs/syllabus-units.json` — 104/105 CEFR curriculum units tagged (the only untagged is the B2 "Capstone Synthesis" meta unit). Generated from the 4 primer markdown files in `docs/drills/` by `scripts/add-syllabus-concept-tags.py`.

**Querying:** `python scripts/topic-query.py <concept-slug>` lists matching drills + worksheets + primers + diagnostic units + CEFR curriculum units + trap-inventory entries. Also supports `--list`, `--orphans` (concepts referenced but undeclared), `--uncovered` (declared but no artifact tagged).

**Adding a new concept:** add the slug to `docs/concepts.md` first (between the BEGIN/END CONCEPT LIST markers), then start tagging artifacts. The query script validates against the canonical list.

**Adding a new artifact** (worksheet/primer/lesson page): append an entry to `docs/content-manifest.json` with path, variant, cefr, concepts. Use `--orphans` to confirm no undeclared concepts slipped in.

**Adding a new diagnostic unit:** add an entry to the `units` array in `config/diagnostic-test-unit-concepts.json` (run `scripts/add-diagnostic-concept-tags.py` to regenerate from the question source).

**Adding a new CEFR curriculum unit:** add it to the relevant `docs/drills/[LEVEL]-curriculum-primer.md`, then update the MAPPING in `scripts/add-syllabus-concept-tags.py` and re-run the script to refresh `docs/syllabus-units.json`.

### For Developers
| Document | Description |
|----------|-------------|
| [Project Architecture](docs/development/PROJECT_README.md) | Tech stack, serverless design |
| [Code Map](docs/development/CODEMAP.md) | Find code by feature with line numbers |
| [Pronunciation Rules](PRONUNCIATION_RULES.md) | The 6 rules and how they work |
| [Quick Reference](docs/pronunciation/QUICK_REFERENCE.md) | Fast lookup for patterns |

## Project Structure

```
├── PEDAGOGY.md             # ★ Governing doc — teaching methodology
├── index.html              # Dashboard + Drills
├── diagnostic-test.html    # Diagnostic test
├── simplifier.html         # Text simplifier
├── syllabus.html           # Pronunciation lessons
├── lessons/                # Individual lesson pages
│
├── config/
│   ├── prompts/            # 131 drill configs (JSON)
│   ├── diagnostic-test-*.json
│   └── dictionary.json     # 3000+ word dictionary
│
├── js/
│   ├── nav.js              # Navigation bar component
│   ├── chat.js             # Chat/drill interface
│   ├── answerChips.js      # Clickable answer buttons
│   └── ...                 # Other client modules
│
├── functions/api/          # Cloudflare serverless backend
├── utils/                  # Build tools, annotation engine
├── scripts/                # Dev scripts
│
├── tests/
│   └── ui.spec.js          # Playwright UI tests
│
└── docs/
    ├── drills/             # Drill creation guides
    ├── pronunciation/      # Annotation system docs
    ├── simplifier/         # Text simplifier docs
    ├── development/        # Architecture, code map
    └── archive/            # Old internal docs
```

## Tech Stack

- **Frontend**: HTML + Tailwind CSS (CDN, no build)
- **Backend**: Cloudflare Pages Functions
- **AI**: Anthropic Claude API
- **Deployment**: Cloudflare Pages
- **Testing**: Playwright

## Testing

```bash
npm test                           # All tests (Python + JS consistency)
npm run test:js                    # JavaScript tests only
npx playwright test tests/ui.spec.js  # UI tests (nav, dashboard, drills)
```

### UI Tests (Playwright)
- Navigation bar appears on all pages
- Nav links work correctly
- Dashboard feature cards visible and clickable
- Drills section has search and filters

## Editing Content

**Drills**:
1. Edit `config/prompts/[drill].json`
2. Run `npm run build` ← **REQUIRED! Rebuilds the bundle**
3. Deploy with `npx wrangler pages deploy . --project-name=portuguese-drills-expanded`

**Pronunciation**: Write clean Portuguese → run through annotation tool → get annotated output

## License

Builds on [Portuguese Drills](https://kleinster2.github.io/portuguese-drills/) by kleinster2.
