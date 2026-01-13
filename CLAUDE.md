# Portuguese Learning Platform

AI-powered Portuguese language learning. Brazilian Portuguese by default, European Portuguese available.

**[Live Site](https://portuguese-drills-expanded.pages.dev)** | **[Changelog](CHANGELOG.md)**

## Features

### 1. Diagnostic Test
Assess your proficiency level in 10-15 minutes.
- 25 questions across A1-B2 levels
- Instant results with strengths/weaknesses
- Personalized drill recommendations
- Teacher tools: generate unique test links, view reports

### 2. AI Practice Drills
48 interactive exercises with Claude AI tutoring.
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

## Quick Start

```bash
npx wrangler pages dev .                                    # Local dev
npx wrangler pages deploy . --project-name=portuguese-drills-expanded  # Deploy
```

Set `ANTHROPIC_API_KEY` in Cloudflare Pages environment variables.

## Documentation

### By Feature
| Feature | User Guide | Dev Docs |
|---------|------------|----------|
| Diagnostic Test | — | `config/diagnostic-test-*.json` |
| AI Drills | [A1 Curriculum](docs/drills/A1-curriculum-primer.md) | [Drill Template](docs/drills/DRILL_TEMPLATE.md) |
| Text Simplifier | — | [Hover Translations](docs/simplifier/hover-translations.md) |
| Pronunciation | [Syllabus](SYLLABUS_PHASE_1.md) | [Annotation Workflow](docs/pronunciation/ANNOTATION_WORKFLOW.md) |

### For Developers
| Document | Description |
|----------|-------------|
| [Project Architecture](docs/development/PROJECT_README.md) | Tech stack, serverless design |
| [Code Map](docs/development/CODEMAP.md) | Find code by feature with line numbers |
| [Pronunciation Rules](PRONUNCIATION_RULES.md) | The 6 rules and how they work |
| [Quick Reference](docs/pronunciation/QUICK_REFERENCE.md) | Fast lookup for patterns |

## Project Structure

```
├── index.html              # Drills interface
├── diagnostic-test.html    # Diagnostic test
├── simplifier.html         # Text simplifier
├── syllabus.html           # Pronunciation lessons index
├── lessons/                # Individual lesson pages
│
├── config/
│   ├── prompts/            # 48 drill configs (JSON)
│   ├── diagnostic-test-*.json
│   └── dictionary.json     # 3000+ word dictionary
│
├── js/                     # Client-side modules
├── functions/api/          # Cloudflare serverless backend
├── utils/                  # Build tools, annotation engine
├── scripts/                # Dev scripts
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

## Testing

```bash
npm test              # All tests
npm run test:js       # JavaScript only
```

## Editing Content

**Drills**: Edit `config/prompts/[drill].json` → `npm run build` → deploy

**Pronunciation**: Write clean Portuguese → run through annotation tool → get annotated output

## License

Builds on [Portuguese Drills](https://kleinster2.github.io/portuguese-drills/) by kleinster2.
