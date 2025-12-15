# Portuguese Language Drills

An interactive Portuguese language learning platform with AI-powered drill sessions and integrated chat functionality. Practice multiple drills simultaneously with smart drill rotation and comprehensive error handling.

Designed to be dialect-neutral (PT-PT and PT-BR) with enhanced learning experiences powered by Claude AI.

- **Live Site**: Deployed on Cloudflare Pages
- **Tech Stack**: HTML + Tailwind CSS + Cloudflare Pages Functions + Anthropic Claude API
- **No Build Step**: Pure HTML with CDN-based styling

## 📚 Documentation

### Pedagogy & Design
- **[PEDAGOGY.md](PEDAGOGY.md)** - ⭐ **Core pedagogical principles and design methodology**
  - Self-introduction first ("eu" before all others)
  - Conjugation-pattern pedagogy (singular before plural)
  - The Self-Introduction Trinity (morar, falar, trabalhar)
  - Grammar in service of communication
  - **To use in Claude Code: Say "Read PEDAGOGY.md" at the start of your session**

- **[PRONUNCIATION_RULES.md](PRONUNCIATION_RULES.md)** - ⭐ **Complete Brazilian Portuguese pronunciation rules**
  - ALL obligatory pronunciation changes (o→u, e→i, palatalization, etc.)
  - Notation system (compact bracket notation: word[sound])
  - Distinction between pronunciation (obligatory) vs reduction (optional)
  - Critical reference for understanding the syllabus annotation system
  - **Essential for anyone working with syllabus content**

- **[SYLLABUS_PHASE_1.md](SYLLABUS_PHASE_1.md)** - ⭐ **Complete Phase 1 curriculum (8 units)**
  - Self-introduction focused ("eu" mastery)
  - 5-step progressive disclosure (orthography → full colloquial speech)
  - Comprehensive glossaries for all units
  - Pronunciation annotations using italic formatting

### Pronunciation System Documentation
- **[Annotation Workflow](docs/ANNOTATION_WORKFLOW.md)** - ⭐ **Authoring guide (read this first!)**
  - Two-file system: source (clean) → generated (annotated)
  - Write clean Portuguese, get annotations automatically
  - Zero annotation bugs, 100% consistency
  - Complete workflow and best practices

- **[Quick Reference Guide](docs/QUICK_REFERENCE.md)** - ⭐ **Fast lookup for rules, patterns, and scripts**
  - 6 obligatory pronunciation rules (one-page reference)
  - Visual formatting system (regular vs italic)
  - Common patterns cheat sheet
  - Script usage examples
  - Perfect for daily development work

- **[System Architecture](docs/SYSTEM_ARCHITECTURE.md)** - Complete technical documentation
  - Rule processing pipeline and algorithms
  - Pedagogical progression framework
  - Annotation tooling ecosystem
  - Extension points and maintenance guide

- **[Changelog](docs/CHANGELOG.md)** - Version history and feature log
  - v2.0: Programmatic annotation system
  - v1.1: Italic formatting, short/long nasal distinction, glossaries
  - Complete commit history with rationale
  - Migration notes and breaking changes

- **[Annotation Tool README](utils/README_ANNOTATOR.md)** - Script usage guide
  - Command-line usage examples
  - API reference
  - Rule application details
  - Testing instructions

### For Users
- **[A1 Curriculum Guide](docs/curriculum/A1-curriculum-primer.md)** - Detailed explanation of what each A1 drill teaches
- **[Shareable Links Guide](docs/features/SHAREABLE_LINKS.md)** - How to share and bookmark specific drills

### For Developers
- **[Project Architecture](docs/development/PROJECT_README.md)** - Tech stack, architecture, and development guide
- **[Code Map](docs/development/CODEMAP.md)** - Quick reference for finding code by feature (with line numbers)
- **[Consistency Analysis](docs/development/DRILL_CONSISTENCY_ANALYSIS.md)** - Analysis of drill patterns and improvement roadmap

## Key Features

### 📖 Interactive Pronunciation Lessons
- **Structured Curriculum**: Progressive units teaching Brazilian Portuguese pronunciation
- **5-Step Format**: Original → Annotated → Substituted → Without "eu" → Natural Flow
- **Character-Based Learning**: Follow Daniel's self-introduction through Unit 1
- **Audio Playback**: Speaker buttons for all Portuguese text
- **Visual Annotations**: Color-coded pronunciation guides (/u/, /dji/, etc.)
- **Programmatic System**: v2.0 annotation engine ensures 100% consistency
- **Pedagogical Focus**: Self-introduction first, grammar in service of communication

### 🎯 Multi-Drill Sessions
- **Start Empty Session**: Begin with no drills and add only what you want to practice
- **Add Multiple Drills**: Combine multiple drills in a single chat session
- **Random Drill Rotation**: Questions alternate randomly between active drills
- **Remove Drills Anytime**: Click X on any drill badge to remove it from the session
- **Dynamic Drill Display**: Chat header shows all active drills in real-time

### 💬 Integrated AI Chat
- **Powered by Claude**: Uses Anthropic's Claude Sonnet 4.5 model
- **Contextual Practice**: AI tutor maintains conversation context across drills
- **Session Persistence**: Sessions are preserved for each drill type
- **Split Button Interface**: Choose between ChatGPT version or integrated chat

### 🔧 Smart Error Handling
- **Mobile-Optimized**: 90-second timeout for slower mobile connections
- **Intelligent Retry**: One-click retry button when errors occur
- **Detailed Error Messages**: Specific messages for timeouts, network issues, and server errors
- **No Auto-Focus**: Input field doesn't auto-focus on mobile (prevents keyboard obstruction)

### 🎨 User Interface
- **Active Drills Badges**: Visual display of all active drills with remove buttons
- **Empty State Handling**: Clear instructions when no drills are active
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Header**: "No drills active" / Single drill name / Multiple drills separated by bullets

### 🎯 Diagnostic Test
- **Comprehensive Evaluation**: 25-question test covering A1 to B2 levels
- **Instant Results**: Detailed proficiency report identifying strengths and weaknesses
- **Structured Assessment**: Progressive difficulty testing across 5 sections
- **Drill Recommendations**: Get specific drill suggestions to address gaps
- **For Teachers**: Generate unique test links for students, view results dashboard at `/api/diagnostic-test/report`
- **Printable Handouts**: Print-friendly versions for paper-based testing (A1-A2 and advanced)

### 📝 Text Simplifier
- **Any Text → Portuguese**: Paste text in any language, get simplified Portuguese
- **CEFR Level Selection**: Choose A1, A2, B1, or B2 complexity
- **Hover Translations**: Every word/phrase shows English translation on hover (3000+ word dictionary with Claude API fallback for unknown words)
- **Level-Appropriate Grammar**: A1 uses present/simple past only; higher levels add more tenses
- **Mobile Friendly**: Tap words on mobile to see translations

### 📚 Extensive Drill Library
- **48 Drills Available**: Covering A1 to B2+ levels
- **Filterable by Topic**: Verbs, Grammar, Tenses, Pronunciation, Conversation
- **Search Functionality**: Find specific drills by keyword
- **Learning Paths**: Structured progression from A1 to B2

### 📱 Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile or desktop
- **Offline Fallback**: Graceful offline page when connection is lost
- **Fast Loading**: Service worker caches static assets

## Recent Updates

### Latest Enhancements (January 2025)

**Pronunciation Lessons v2.0 - NEW:**
- ✅ **Unit 1 Restructured** - "Meet Daniel" hero section shows complete introduction first
- ✅ **Simplified Rule System** - Reduced from 7 to 6 rules (removed Rule 1b: -or → /oh/)
- ✅ **Cleaner Lesson Format** - Three-step format only used where pronunciation actually changes
- ✅ **Programmatic Annotations** - Python & JavaScript v2.0 engines ensure cross-platform consistency
- ✅ **Audio Integration** - Speaker buttons for all Portuguese text including full introduction
- ✅ **Pedagogical Alignment** - Self-introduction first, grammar in service of communication

### Latest Enhancements (December 2024)

**Diagnostic Test - NEW:**
- ✅ **Comprehensive 25-question evaluation** - Tests A1 through B2 proficiency
- ✅ **Structured in 5 sections** - A1 Basics, A1-A2 Foundation, A2 Intermediate, B1 Advanced, B2 Proficient
- ✅ **Instant detailed report** - Performance breakdown by level with strengths and weaknesses
- ✅ **Personalized recommendations** - Specific drill suggestions based on your results
- ✅ **10-15 minute completion time** - Quick but thorough assessment

**Reflexive Verbs Drill - Major Upgrade:**
- ✅ **Non-Reflexive Questions Added** - Learn when verbs ARE and AREN'T reflexive
- ✅ **3-Type Question System** - Reflexive (50%), Reciprocal (25%), Non-Reflexive (25%)
- ✅ **Enhanced Chip System** - Now includes "none" option for non-reflexive verbs
- ✅ **Comparative Learning** - "Eu me lavo" vs "Eu lavo o carro" side-by-side

**Ser vs Estar Drill - Deep Analysis & Fixes:**
- ✅ **Backend Forbidden Words Filter** - Automatically regenerates questions with problematic words (café, frio)
- ✅ **Mode-Specific Chips** - BP uses 11 conjugations, EP includes tu forms (13 total)
- ✅ **8 Ambiguous Adjectives** - Split bom/bonito/chato into separate entries
- ✅ **Conjugation Table Format** - Added clear formatting guidelines
- ✅ **Subject Omission Notes** - Proper handling of weather/time expressions
- ✅ **"Both" Always Visible** - Pedagogical improvement for learning edge cases

**Por vs Para Drill:**
- ✅ **Fixed Drill Loading** - Now properly loads correct prompt configuration

**Technical Improvements:**
- ✅ **Wrangler Updated** - Latest version 4.45.3
- ✅ **Prompt Optimization** - Removed redundant instructions and fixed inconsistencies
- ✅ **5-Layer Defense System** - Multiple safeguards against forbidden word generation

### New Drills Added
- ✅ **Portuguese for Spanish Speakers** - Leverage Spanish knowledge with false friends, vocabulary gaps, and grammar differences
- ✅ **Self-Introduction Drill** - Build first Portuguese sentences for beginners
- ✅ **Conversational Answers Drill** - Master answering yes/no questions by repeating verbs
- ✅ **Colloquial Speech Drill** - Learn real spoken Brazilian Portuguese (você→cê, estar→tá)
- ✅ **Brazilian Portuguese Phonetics Tutor** - Master written-to-spoken transformations
- ✅ **Syllable Stress Drill** - Perfect Portuguese pronunciation patterns

### Chat System Improvements
- ✅ Multi-drill session support with random alternation
- ✅ Start empty session functionality
- ✅ Add/remove drills dynamically during session
- ✅ Retry functionality for failed requests
- ✅ Mobile-optimized timeout and error handling
- ✅ Removed auto-focus to prevent keyboard popup on mobile

### UI/UX Enhancements
- ✅ Dynamic chat header showing all active drills
- ✅ Active drills badge section with remove buttons
- ✅ Empty state messaging and guidance
- ✅ Updated site branding to "Portuguese Language Drills"
- ✅ Simplified subtitle focusing on core functionality
- ✅ **Shareable Links** - Each drill has a "Copy Link" button for direct URL sharing

## Usage

### Starting a Session

**Option 1: Start Empty**
1. Click "Start Empty Session" button
2. Click "+ Add Drill" in the chat header
3. Select drills you want to practice
4. Begin practicing with custom drill combination

**Option 2: Start from Drill Card**
1. Click "🚀 Try Integrated" on any drill card
2. Chat opens with that drill active
3. Optionally add more drills with "+ Add Drill"
4. Practice single drill or multiple drills together

**Option 3: Use Shareable Link**
1. Use a direct drill URL like `?drill=regular-ar`
2. The chat automatically opens for that drill
3. The drill card is highlighted and scrolled into view
4. Perfect for bookmarks, sharing with others, or external links

### Sharing Drills
- **Copy Link**: Click "🔗 Copy Link" button on any drill card
- **Share with Others**: Send the copied URL to students or study partners
- **Bookmark Favorites**: Save specific drill URLs for quick access
- See [SHAREABLE_LINKS.md](SHAREABLE_LINKS.md) for complete list of drill URLs

### Managing Drills
- **Add Drill**: Click "+ Add Drill" button → Select from available drills
- **Remove Drill**: Click X on any drill badge
- **New Session**: Click "New Session" to start fresh
- **View Active Drills**: Check the header or badge section

### Handling Errors
- If an error occurs, a red error box will appear
- Click "Retry Message" to resend your last message
- Check error message for specific issue (timeout, network, server)

## Development

### Local Development
```bash
# No build step required - just open index.html
open index.html

# For API functionality, use Wrangler
npx wrangler pages dev .
```

### Pronunciation Annotations

**IMPORTANT:** Always use the automated annotator tool - never add annotations manually!

```bash
# Test a sentence
python -c "from utils.annotate_pronunciation import annotate_pronunciation; print(annotate_pronunciation('Eu sou brasileiro.'))"

# Output: Eu sou brasileiro/u/.
```

**Why use the annotator:**
- Ensures consistency across all lessons
- Automatically applies all 6 pronunciation rules
- Prevents human error and missed annotations
- Maintains accuracy as rules evolve

**Where to find rules:**
- `PRONUNCIATION_RULES.md` - Complete rule reference
- `utils/README_ANNOTATOR.md` - Tool documentation
- `utils/annotate_pronunciation.py` - Python implementation

**When creating/editing lessons:**
1. Write Portuguese text without annotations
2. Run through annotator tool
3. Copy annotated output to HTML
4. **Add title attributes to all annotations** - Explain which rule applies
5. **Add substitution mode after every annotated sentence** - Show phonetic spelling
6. Never add `/u/`, `/dji/`, etc. by hand!

**Adding rule explanations:**
Every pronunciation annotation should include a `title` attribute explaining which rule applies:

```html
<!-- Good: Word-specific annotation with explanation -->
<span class="pronunciation" title="'americano' → /u/ (final -o)">/u/</span>

<!-- Bad: Annotation without explanation -->
<span class="pronunciation">/u/</span>
```

Common title formats (always include the specific word):
- `title="'americano' → /u/ (final -o)"` - Final unstressed -o
- `title="'e' → /i/ (final -e)"` - Final unstressed -e
- `title="'de' → /dji/ (always)"` - Palatalization of "de"
- `title="'com' → /oun/ (final -om)"` - Nasal -om
- `title="'Daniel' → /u/ (syllable-final -l)"` - L vocalization

**Format pattern:** `'<word>' → /<sound>/ (<transformation>)`

This word-specific format is essential when multiple transformations occur in the same sentence. Example: "Eu sou o/u/ Daniel/u/." has two different transformations - hovering clarifies which word undergoes which change.

This creates a self-guided learning experience where students can hover over any annotation to understand why the pronunciation changes.

**Adding substitution mode:**
Every annotated sentence must be followed by its substitution mode version (phonetic spelling):

```html
<!-- Annotated version -->
<div>Eu sou americano<span class="pronunciation" title="Rule 1: Final -o → /u/">/u/</span>.</div>

<!-- Substitution mode (REQUIRED) -->
<div class="font-mono text-blue-600">Eu sou americanu.</div>
```

Examples of annotation → substitution pairs:
- `americano/u/ → americanu` (Final -o)
- `Daniel/u/ → Danieu` (Syllable-final -l)
- `de/dji/ Miami → dji Miami` (Final de)
- `e/i/ sou → i sou` (Final -e)
- `com/coun/ a Sofia → coun a Sofia` (Final -om)

**Important:** Only include words that actually undergo pronunciation changes. Do NOT annotate words that are already spelled with the target sound (e.g., "sou" is already spelled "ou", so it doesn't need annotation).

### Environment Variables
Set in Cloudflare Pages → Settings → Environment Variables:
- `ANTHROPIC_API_KEY` - Your Anthropic API key for Claude

### Project Structure
```
├── index.html                      # Main application file (drills)
├── simplifier.html                 # Text Simplifier tool
├── diagnostic-test.html            # Interactive diagnostic test
├── diagnostic-test-links.html      # Generate unique test URLs (for teachers)
├── diagnostic-test-handout.html    # Printable test (A1-A2)
├── diagnostic-test-handout-advanced.html  # Printable test (B1-B2)
├── syllabus.html                   # Pronunciation lessons syllabus
├── manifest.json                   # PWA manifest
├── service-worker.js               # PWA service worker for caching
├── offline.html                    # Offline fallback page
├── lessons/
│   └── unit-1.html                # Unit 1: Identity Statements (Eu sou)
├── config/
│   ├── prompts/                   # Source JSON files for prompts (edit here!)
│   ├── dictionary.json            # 3000+ word Portuguese-English dictionary
│   └── diagnostic-test-questions-v10.9-no-hints.json
├── utils/
│   ├── promptManager.js           # Loads prompts from generated data
│   ├── promptData.generated.js    # Auto-generated (run npm run build)
│   ├── annotate_pronunciation.py  # Python v2.0 annotation engine
│   └── README_ANNOTATOR.md        # Annotation tool documentation
├── js/
│   └── pronunciation-annotator.js # JavaScript v2.0 annotation engine
├── docs/
│   ├── CHANGELOG_v2.0.md          # v2.0 changes (Rule 1b removal)
│   ├── NEXT_TASK_RESTRUCTURE_UNIT1.md
│   ├── PYTHON_JAVASCRIPT_CONSISTENCY_REPORT.md
│   ├── SUBSTITUTION_MODE.md       # Pronunciation substitution reference
│   └── UNIT_1_SUBSTITUTION_REFERENCE.md
└── functions/
    └── api/
        └── chat.ts                # Cloudflare Pages Function for chat API
```

**Editing Prompts:** Edit the JSON files in `config/prompts/`, then run `npm run build` to regenerate `utils/promptData.generated.js`. The generated file is committed to git so Cloudflare Pages can deploy without a build step.

### API Endpoint
**POST** `/api/chat`

Request body:
```json
{
  "sessionId": "optional-session-id",
  "drillId": "drill-identifier",
  "message": "user message",
  "isNewSession": true
}
```

Response:
```json
{
  "sessionId": "session-identifier",
  "response": "AI response text"
}
```

### Testing

**Automated CI/CD Pipeline:**
- All tests run automatically on push and pull requests via GitHub Actions
- Tests must pass before merge is allowed
- View results in the "Actions" tab on GitHub

**Running Tests Locally:**

```bash
# Run all tests (Python + JavaScript)
npm test

# Run Python tests only
python utils/test_consistency.py

# Run JavaScript tests only (requires Playwright)
npm run test:js

# Install Playwright browsers (first time only)
npm run test:install
```

**What the Tests Validate:**
- ✅ Python annotation engine (v2.0) - 17 test cases
- ✅ JavaScript annotation engine (v2.0) - 17 test cases
- ✅ Cross-platform consistency (Python === JavaScript)
- ✅ All 6 pronunciation rules working correctly
- ✅ No Rule 1b regressions (words ending in -or should NOT be annotated)

**Test Files:**
- `utils/test_consistency.py` - Python test suite
- `test-consistency.html` - JavaScript test suite (browser-based)
- `utils/test-js.mjs` - Node.js test runner (headless Playwright)
- `.github/workflows/test-pronunciation.yml` - CI/CD configuration

**Before Submitting a Pull Request:**
1. Run `npm test` locally
2. Ensure all tests pass
3. Add tests for any new pronunciation rules
4. Update test expectations if changing annotation behavior

## Deployment

### Manual Deployment (Recommended)
```bash
# Deploy to production
npx wrangler pages deploy . --project-name=portuguese-drills-expanded

# The deployment URL will be shown in the output
# Changes are live immediately at https://portuguese-drills-expanded.pages.dev
```

### Automatic Deployment
Cloudflare Pages also auto-deploys when pushing to GitHub:
- **Production**: Deploys from `master` branch
- **Preview**: Automatic preview for all branches
- **Functions**: Cloudflare Workers handle API requests

**Note:** Manual deployment via Wrangler is faster and more reliable for immediate updates.

## Contributing

Contributions welcome! Please:
1. Open an issue for discussion on larger changes
2. Keep PRs focused on a single feature or fix
3. Test on both desktop and mobile devices
4. Update README for significant feature additions

## Dialects

Drills default to Brazilian Portuguese (BP). Many drills support European Portuguese (EP) - simply ask the AI tutor to switch: "Please switch to European Portuguese" or "Vamos praticar em EP".

## License

This project builds on the original Portuguese Drills by kleinster2.

## Credits

- **AI Model**: Anthropic Claude Sonnet 4.5
- **Hosting**: Cloudflare Pages
- **Styling**: Tailwind CSS
- **Base Project**: [Portuguese Drills](https://kleinster2.github.io/portuguese-drills/)
