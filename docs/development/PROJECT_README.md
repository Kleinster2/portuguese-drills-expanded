# Portuguese Learning Platform - Architecture

## Tech Stack

- **Frontend**: Vanilla JavaScript, Tailwind CSS (CDN)
- **Backend**: Cloudflare Pages Functions (Serverless)
- **AI**: Anthropic Claude Sonnet 4.5
- **Deployment**: Cloudflare Pages (no build step)
- **Testing**: Playwright

## UI Architecture

### Navigation
Sticky nav bar (`js/nav.js`) injected on all pages:
- Home | Diagnostic | Drills | Simplifier | Curriculum
- Responsive (icons only on mobile)

### Pages
| Page | Purpose |
|------|---------|
| `index.html` | Dashboard + Drills grid |
| `diagnostic-test.html` | Proficiency assessment |
| `simplifier.html` | Text simplification tool |
| `syllabus.html` | Pronunciation curriculum |

### Dashboard
Feature cards linking to each tool, followed by drills section with search/filters.

## Backend Architecture

### Serverless & Stateless Design

Runs on Cloudflare Workers - each request may hit a different instance:
- Sessions cannot be stored in memory reliably
- Client sends full message history with each request
- Server reconstructs session from history if not found

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Nav bar | `js/nav.js` | Sticky navigation on all pages |
| Drill configs | `config/prompts/*.json` | 48 JSON files defining drill behavior |
| Answer chips | `js/answerChips.js` | Clickable answer options |
| Chat API | `functions/api/chat.ts` | Serverless Claude API proxy |
| Build script | `scripts/build-prompts.js` | Syncs JSON → `promptData.generated.js` |

## Project Structure

```
├── index.html              # Dashboard + Drills
├── diagnostic-test.html    # Diagnostic test
├── simplifier.html         # Text simplifier
├── syllabus.html           # Pronunciation lessons
│
├── config/
│   ├── prompts/            # 48 drill JSON configs
│   ├── dictionary.json     # Portuguese-English dictionary
│   └── diagnostic-test-*.json
│
├── js/
│   ├── nav.js              # Navigation bar component
│   ├── answerChips.js      # Answer chip system
│   ├── chat.js             # Client-side chat logic
│   ├── conjugations.js     # Conjugation buttons
│   ├── diagnosticTest.js   # Test logic
│   └── filters.js          # Drill filtering
│
├── scripts/                # Build and dev scripts
├── utils/                  # Prompt manager, annotation tools
├── functions/api/          # Cloudflare serverless backend
├── tests/                  # Playwright UI tests
│
├── docs/
│   ├── drills/             # Drill creation guides
│   ├── pronunciation/      # Annotation system docs
│   ├── simplifier/         # Text simplifier docs
│   ├── development/        # Architecture, code map
│   └── archive/            # Old internal docs
│
└── lessons/                # Pronunciation lesson pages
```

## Development

### Quick Start

```bash
npm install
npx wrangler pages dev .        # Local dev with API
```

### Testing

```bash
npm test                           # All tests
npx playwright test tests/ui.spec.js  # UI tests
```

### Making Changes

**Edit a drill:**
1. Edit `config/prompts/[drill-id].json`
2. Run `npm run build`
3. Deploy: `npx wrangler pages deploy .`

**JSON format rules:**
- Use `\n` for newlines, NOT literal line breaks
- System prompts can be 5000+ chars

### Answer Chips

Single row:
```
[CHIPS: sou, estou, é, está, somos, estamos]
```

Two rows (por-vs-para style):
```
[CHIPS-ROW1: por, para]
[CHIPS-ROW2: reason, price, destination, deadline]
```

## Common Patterns

### Drill Types
- **Verb conjugation** - Uses conjugation button system
- **Agreement drills** - Uses answer chips
- **Preposition drills** - Uses chips (por-vs-para uses two-row)
- **Translation drills** - Open-ended (no chips)

### Dialect Modes
- **Brazilian (BP)**: Uses você, never tu; includes "a gente"
- **European (EP)**: Uses tu frequently

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| "Session not found" | Workers lose memory | Client sends full history (fixed) |
| JSON parse errors | Literal newlines | Use `\n` escape sequences |
| Wrong drill loads | Missing/broken JSON | Check build output |

## References

- [CODEMAP.md](CODEMAP.md) - Find code by feature with line numbers
- [DRILL_CONSISTENCY_ANALYSIS.md](DRILL_CONSISTENCY_ANALYSIS.md) - Drill patterns
- [CHANGELOG.md](../../CHANGELOG.md) - Version history
