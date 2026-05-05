# Documentation

Organized by feature.

```
docs/
├── drills/          # AI practice drills
├── pronunciation/   # Pronunciation lessons system
├── simplifier/      # Text simplifier
├── diagnostic-test/ # Diagnostic test (empty - see config/)
├── development/     # Architecture, code map
└── archive/         # Old internal docs
```

## Drills

| Document | Description |
|----------|-------------|
| [Curriculum Schema](architecture/curriculum-canonical.md) | Canonical source: `docs/units/*.md` (164 units). Frontmatter spec + slug rules. |
| [Generated CEFR Primers](drills/) | Per-level per-variant primers: `[A1\|A2\|B1\|B2]-curriculum-primer-[bp\|ep].md` (8 files) |
| [Generated MS Sequence](drills/) | Per-variant: `syllabus-micro-sequence-[bp\|ep].md` (2 files) |
| [Drill Template](drills/DRILL_TEMPLATE.md) | Template for creating new drills |
| [Best Practices](drills/DRILL_BEST_PRACTICES.md) | Guidelines for quality prompts |
| [Shareable Links](drills/SHAREABLE_LINKS.md) | How to share drill URLs |

## Pronunciation

| Document | Description |
|----------|-------------|
| [Pronunciation Rules](../PRONUNCIATION_RULES.md) | Canonical 6-rule BP reference |
| [Anchor units](units/) | `a1-pron-*` (6 rule anchors), `b1-pron-syllable-stress`, `b2-pron-phonetics-broad` |
| [Notation Style](pronunciation/NOTATION_STYLE_GUIDE.md) | Formatting conventions |
| [Substitution Mode](pronunciation/SUBSTITUTION_MODE.md) | Phonetic spelling system |
| [Changelog](pronunciation/CHANGELOG.md) | Version history |
| [Workflow docs (archived)](archive/pronunciation/) | Annotation Workflow / System Architecture / Quick Reference — archived Phase 7 (2026-05-04) when their primary input (`SYLLABUS_PHASE_1.md`) was archived |

## Simplifier

| Document | Description |
|----------|-------------|
| [Hover Translations](simplifier/hover-translations.md) | Dictionary and translation system |

## Development

| Document | Description |
|----------|-------------|
| [Project Architecture](development/PROJECT_README.md) | Tech stack, serverless design |
| [Code Map](development/CODEMAP.md) | Find code by feature with line numbers |
| [Drill Consistency](development/DRILL_CONSISTENCY_ANALYSIS.md) | Patterns and improvement roadmap |

## Other

| Document | Description |
|----------|-------------|
| [PWA](PWA.md) | Progressive Web App setup |

## Links

- [CLAUDE.md](../CLAUDE.md) - Main project documentation
- [CHANGELOG](../CHANGELOG.md) - Project version history
