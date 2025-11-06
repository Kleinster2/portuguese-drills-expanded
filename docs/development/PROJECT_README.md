# Portuguese Drills - Project Overview

**An AI-powered Portuguese language learning platform with 47 interactive drills**

## Tech Stack

- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Backend**: Cloudflare Pages Functions (Serverless)
- **AI**: Anthropic Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
- **Deployment**: Cloudflare Pages
- **Build**: Node.js scripts to sync JSON configs

## Architecture Overview

### Serverless & Stateless Design
This project runs on **Cloudflare Workers** (serverless), which means:
- Each request may hit a different Worker instance
- **Sessions cannot be stored in memory reliably** (they get lost between requests)
- Solution: **Stateless session management** - client sends full message history with each request
- Server reconstructs session from history if not found in memory

### Key Components

1. **Drill Configurations** (`config/prompts/*.json`)
   - 47 JSON files defining drill behavior
   - Each contains: id, name, description, systemPrompt
   - ⚠️ **Critical**: Must use `\n` escape sequences, NOT literal newlines (causes JSON parse errors)

2. **Answer Chips System** (`js/answerChips.js`)
   - Clickable answer options for drills
   - Single-row format: `[CHIPS: option1, option2, option3]`
   - Two-row format: `[CHIPS-ROW1: ...]` `[CHIPS-ROW2: ...]` (used by por-vs-para)
   - Markers are detected, parsed, and converted to buttons

3. **Session Management** (`functions/api/chat.js`)
   - In-memory Map for active sessions (ephemeral)
   - Stateless fallback: reconstructs from `clientMessages` if session not found
   - Client MUST send message history with every request

4. **Build System** (`scripts/build-prompts.js`)
   - Syncs JSON configs → `utils/promptManager.js`
   - Run `npm run build` after any config changes
   - Validates JSON and reports parsing errors

## Quick Start

### Development
```bash
npm install
npm run build    # Sync JSON configs to promptManager.js
npm run deploy   # Build + deploy to Cloudflare Pages
```

### Making Changes

**Adding/editing a drill:**
1. Edit `config/prompts/[drill-id].json`
2. Ensure proper JSON format (no literal newlines!)
3. Run `npm run build` to sync
4. Run `npm run deploy` to push live

**Adding answer chips to a drill:**
Add to systemPrompt in the drill's JSON config:
```
[CHIPS: correct_answer, wrong1, wrong2, wrong3]
```

**Two-row chips (like por-vs-para):**
```
[CHIPS-ROW1: option1, option2]
[CHIPS-ROW2: category1, category2, category3, category4]
```

## Common Patterns

### Drill Types
1. **Verb conjugation drills** - Use conjugation button system (not chips)
2. **Agreement drills** - Use answer chips (muito, adjectives, nouns)
3. **Preposition drills** - Use chips (por-vs-para uses two-row)
4. **Translation drills** - Open-ended (no chips)

### Subject Variety
- Brazilian Portuguese (BP) mode: Uses você, never tu
- European Portuguese (EP) mode: Uses tu frequently
- Both modes use: eu, você/tu, ele/ela, nós, eles/elas
- BP mode adds: a gente (informal "we", uses 3rd person singular)

## Project Structure

```
portuguese-drills-expanded/
├── index.html                    # Main UI and client-side logic
├── js/
│   ├── answerChips.js           # Answer chips system
│   ├── conjugations.js          # Conjugation buttons
│   └── utils.js                 # Shared utilities
├── functions/api/
│   └── chat.js                  # Serverless chat API
├── config/prompts/              # 47 drill configurations
│   ├── ser-estar.json
│   ├── por-vs-para.json
│   └── ...
├── utils/
│   └── promptManager.js         # Generated from JSON configs
└── scripts/
    └── build-prompts.js         # Build script

See [CODEMAP.md](CODEMAP.md) for detailed file locations and line numbers
See `.sessions/` for development notes and recent changes
```

## Important Conventions

### JSON Configuration Files
- **Always use `\n` for newlines**, not literal line breaks
- System prompts can be very long (5000+ chars is normal)
- Build script validates JSON and reports errors
- Example: See `config/prompts/regular-ar.json` for proper format

### Answer Chips Format
```javascript
// Single-row (most drills)
[CHIPS: sou, estou, é, está, somos, estamos, são, estão]

// Two-row with multi-select (por-vs-para)
[CHIPS-ROW1: por, para]
[CHIPS-ROW2: reason/cause, price/exchange, destination, deadline, ...]
```

### Session Management
- Client stores message history in `drillSessions` object
- Every API call includes `messages: messageHistory`
- Server uses this for stateless fallback
- See commit `cc32e38` for the fix that implemented this

## Deployment

### Cloudflare Pages
- Automatic deployments on git push (if connected)
- Manual: `npm run deploy`
- Each deployment gets a unique URL: `https://[hash].portuguese-drills-expanded.pages.dev`
- Environment variable required: `ANTHROPIC_API_KEY`

### Build Process
1. `npm run build` runs `scripts/build-prompts.js`
2. Reads all JSON files from `config/prompts/`
3. Generates `utils/promptManager.js` with embedded configs
4. Reports any JSON parsing errors

## Recent Updates (December 2024)

### Placement Test - NEW Feature
- ✅ **Comprehensive 25-question evaluation**: Tests proficiency from A1 to B2
- ✅ **5-section structure**: A1 Basics, A1-A2 Foundation, A2 Intermediate, B1 Advanced, B2 Proficient
- ✅ **Instant detailed report**: Performance breakdown by level, strengths/weaknesses analysis
- ✅ **Personalized recommendations**: Suggests specific drills based on results
- ✅ **Config file**: `config/prompts/placement-test.json`
- ✅ **UI integration**: Prominent amber section on homepage

### Documentation Reorganization
- ✅ **New `docs/` directory structure**: Organized by audience (curriculum, development, features)
- ✅ **Comprehensive docs/README.md**: Index with "I want to..." quick start guide
- ✅ **Updated cross-references**: All internal links updated to new paths
- ✅ **Clean root directory**: Only main README.md visible at project root

### Reflexive Verbs Drill - Major Upgrade
- ✅ **Three-type question system**: Reflexive (50%), Reciprocal (25%), Non-Reflexive (25%)
- ✅ **Enhanced chip system**: Added "none" option and "non-reflexive" category
- ✅ **Comparative learning**: Students learn when verbs ARE and AREN'T reflexive
- ✅ **Example**: "Eu me lavo" (reflexive) vs "Eu lavo o carro" (non-reflexive)

### Ser vs Estar Drill - Deep Analysis & Fixes
- ✅ **Backend forbidden words filter**: Auto-regenerates questions with café/frio (up to 3 retries)
- ✅ **Mode-specific chips**: BP uses 11 conjugations, EP includes tu forms (13 total)
- ✅ **8 ambiguous adjectives**: Split bom/bonito/chato into separate entries
- ✅ **Conjugation table format**: Clear formatting guidelines
- ✅ **"Both" always visible**: Pedagogical improvement for learning edge cases

### Technical Improvements
- ✅ **Wrangler updated**: Version 4.45.3
- ✅ **Por-vs-para drill fix**: Now loads correct configuration
- ✅ **5-layer defense system**: Multiple safeguards against forbidden word generation
- ✅ **Backend response filtering**: Server-side validation with auto-retry logic

## Known Issues & Solutions

### 1. "Session not found" errors
**Problem**: Cloudflare Workers lose in-memory sessions
**Solution**: Client now sends full message history (fixed in commit `cc32e38`)

### 2. JSON parsing errors in drill configs
**Problem**: Literal newlines in systemPrompt field
**Solution**: Use `\n` escape sequences (fixed ser-estar, imperative, subject-identification in commit `a1bcc42`)

### 3. Wrong drill loading
**Problem**: Missing or broken JSON config
**Solution**: Check build output for errors, validate JSON format

### 4. Forbidden words appearing in ser-estar drill (SOLVED)
**Problem**: Despite prompt warnings, café/frio kept appearing (canonical training data)
**Solution**: Backend filter in `functions/api/chat.js` with containsForbiddenWords() function

## Testing

### Local Testing
```bash
# Run Cloudflare Pages locally (requires wrangler)
wrangler pages dev . --binding ANTHROPIC_API_KEY=your_key_here
```

### Production Testing
- Each deployment gets a unique URL
- Test before updating main domain
- Check browser console for errors

## AI Prompt Engineering

### Randomization
All drills include instructions to:
- Never repeat the same question twice in a row
- Vary subjects, tenses, vocabulary
- Start with mid-difficulty questions
- Rotate through all available content

### Answer Chips
- DO use for: agreements, prepositions, articles, demonstratives
- DON'T use for: verb conjugations (have their own system)
- Include correct answer + 2-4 plausible distractors

### Feedback Quality
- Explain the rule (why this answer is correct)
- Show full conjugation tables for verbs
- Provide usage notes and examples
- Encourage and motivate students

## References

- **[CODEMAP.md](CODEMAP.md)** - Detailed file locations with line numbers
- **[Consistency Analysis](DRILL_CONSISTENCY_ANALYSIS.md)** - Analysis of drill patterns
- **`.sessions/`** - Development notes and recent changes
- **Anthropic API Docs**: https://docs.anthropic.com/claude/reference/messages_post
- **Cloudflare Pages**: https://developers.cloudflare.com/pages/

## Contributing

When making changes:
1. Read [CODEMAP.md](CODEMAP.md) to find relevant code
2. Update drill configs in `config/prompts/`
3. Run `npm run build` to sync
4. Test locally if possible
5. Deploy with `npm run deploy`
6. Update documentation if adding new patterns

## Git Workflow

```bash
git add .
git commit -m "Description of changes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

## Questions?

Check these resources in order:
1. **[CODEMAP.md](CODEMAP.md)** - Find specific code locations
2. **`.sessions/known-issues.md`** - Common problems
3. **[PROJECT_README.md](PROJECT_README.md)** (this file) - Architecture overview
4. **Git history** - See what changed recently
