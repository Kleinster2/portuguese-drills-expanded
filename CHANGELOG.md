# Changelog

All notable changes to Portuguese Language Drills.

## January 2025

### Pronunciation Lessons v2.0
- **Unit 1 Restructured** - "Meet Daniel" hero section shows complete introduction first
- **Simplified Rule System** - Reduced from 7 to 6 rules (removed Rule 1b: -or → /oh/)
- **Cleaner Lesson Format** - Three-step format only used where pronunciation actually changes
- **Programmatic Annotations** - Python & JavaScript v2.0 engines ensure cross-platform consistency
- **Audio Integration** - Speaker buttons for all Portuguese text
- **Pedagogical Alignment** - Self-introduction first, grammar in service of communication

See [docs/CHANGELOG.md](docs/CHANGELOG.md) for detailed pronunciation system changes.

## December 2024

### Diagnostic Test
- 25-question comprehensive evaluation (A1-B2)
- 5 structured sections with progressive difficulty
- Instant detailed proficiency report
- Personalized drill recommendations
- Teacher tools: unique test links, results dashboard at `/api/diagnostic-test/report`
- Printable handouts for paper-based testing

### Reflexive Verbs Drill - Major Upgrade
- Non-reflexive questions added (learn when verbs ARE and AREN'T reflexive)
- 3-type question system: Reflexive (50%), Reciprocal (25%), Non-Reflexive (25%)
- Enhanced chip system with "none" option
- Comparative learning: "Eu me lavo" vs "Eu lavo o carro"

### Ser vs Estar Drill - Deep Analysis & Fixes
- Backend forbidden words filter (auto-regenerates problematic questions)
- Mode-specific chips (BP: 11 conjugations, EP: 13 with tu forms)
- 8 ambiguous adjectives split into separate entries
- Proper handling of weather/time expressions
- "Both" option always visible

### New Drills
- Portuguese for Spanish Speakers
- Self-Introduction Drill
- Conversational Answers Drill
- Colloquial Speech Drill
- Brazilian Portuguese Phonetics Tutor
- Syllable Stress Drill

### Technical
- Por vs Para drill loading fixed
- Wrangler updated to 4.45.3
- Prompt optimization and 5-layer defense system

## Earlier Changes

### Chat System
- Multi-drill session support with random alternation
- Start empty session functionality
- Add/remove drills dynamically
- Retry functionality for failed requests
- Mobile-optimized timeout (90s) and error handling

### UI/UX
- Dynamic chat header showing active drills
- Active drills badges with remove buttons
- Shareable drill links with "Copy Link" button
- PWA support with offline fallback
