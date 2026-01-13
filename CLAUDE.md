# Portuguese Language Drills

Interactive Portuguese language learning platform with AI-powered drill sessions. Practice pronunciation, grammar, and conversation with Claude AI tutoring.

**[Live Site](https://portuguese-drills-expanded.pages.dev)** | **[Changelog](CHANGELOG.md)**

## Features

- **48 Drills** - A1 to B2+ covering verbs, grammar, pronunciation, and conversation
- **AI Tutoring** - Contextual practice powered by Claude
- **Multi-Drill Sessions** - Combine drills with random rotation
- **Pronunciation Lessons** - Structured curriculum with audio and annotations
- **Diagnostic Test** - 25-question proficiency evaluation with recommendations
- **Text Simplifier** - Convert any text to level-appropriate Portuguese with hover translations
- **PWA Support** - Installable with offline fallback

## Quick Start

```bash
# Local development with API
npx wrangler pages dev .

# Deploy
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

Set `ANTHROPIC_API_KEY` in Cloudflare Pages environment variables.

## Documentation

### For Users
| Document | Description |
|----------|-------------|
| [A1 Curriculum Guide](docs/curriculum/A1-curriculum-primer.md) | What each A1 drill teaches |
| [Shareable Links](docs/features/SHAREABLE_LINKS.md) | How to share and bookmark drills |

### For Developers
| Document | Description |
|----------|-------------|
| [Code Map](docs/development/CODEMAP.md) | Find code by feature (with line numbers) |
| [Project Architecture](docs/development/PROJECT_README.md) | Tech stack and development guide |
| [Drill Consistency](docs/development/DRILL_CONSISTENCY_ANALYSIS.md) | Drill patterns and improvement roadmap |

### Pedagogy & Pronunciation
| Document | Description |
|----------|-------------|
| [Pedagogy](PEDAGOGY.md) | Core teaching principles |
| [Pronunciation Rules](PRONUNCIATION_RULES.md) | Brazilian Portuguese pronunciation rules |
| [Syllabus Phase 1](SYLLABUS_PHASE_1.md) | Complete Phase 1 curriculum (8 units) |
| [Annotation Workflow](docs/ANNOTATION_WORKFLOW.md) | How to author pronunciation content |
| [Quick Reference](docs/QUICK_REFERENCE.md) | Fast lookup for rules and patterns |

## Project Structure

```
├── index.html              # Main application (drills)
├── simplifier.html         # Text Simplifier tool
├── diagnostic-test.html    # Interactive diagnostic test
├── syllabus.html           # Pronunciation lessons
├── lessons/                # Individual lesson pages
├── config/
│   ├── prompts/            # Drill prompt JSON files (edit here)
│   └── dictionary.json     # Portuguese-English dictionary
├── utils/
│   ├── promptManager.js    # Loads prompts from generated data
│   └── annotate_pronunciation.py  # Annotation engine
├── js/                     # JavaScript modules
├── docs/                   # Documentation
└── functions/api/          # Cloudflare Pages Functions
```

**Editing Prompts:** Edit JSON in `config/prompts/`, run `npm run build`, commit the generated file.

## Testing

```bash
npm test              # Run all tests
npm run test:js       # JavaScript tests only
npm run test:install  # Install Playwright (first time)
```

Tests validate Python/JavaScript annotation engines and all 6 pronunciation rules.

## Dialects

Drills default to Brazilian Portuguese. Ask the AI tutor to switch: "Please switch to European Portuguese" or "Vamos praticar em EP".

## Tech Stack

HTML + Tailwind CSS + Cloudflare Pages Functions + Anthropic Claude API (no build step)

## License

Builds on the original [Portuguese Drills](https://kleinster2.github.io/portuguese-drills/) by kleinster2.
