# Development Log

Project activity and changes made during each working session.

---

## 2026-02-04

### Student Knowledge Base
Created system to track individual students for tutoring.

**Files created:**
- `config/students.json` - Student profiles and session history

**Structure:**
```json
{
  "students": { "id": { name, level, variant, notes, ... } },
  "sessions": { "id": [ { date, topic, material, skills, notes } ] }
}
```

**First student added:** Marvin (B2, European Portuguese)

---

### Word Families Drills
Added two new drills based on textbook exercise Marvin completed.

**Files created:**
- `config/prompts/word-families-b1.json` - Regular derivation patterns
- `config/prompts/word-families-b2.json` - Advanced patterns with prefixes, irregular families

**Build:** Ran `npm run build` - bundle now has 73 drills.

---

### Logging System
Set up three-tier logging for the project.

**Files created/modified:**
- `CHANGELOG.md` - Updated with Feb 2025 changes
- `docs/tutor-journal.md` - Created for teaching observations
- `docs/dev-log.md` - Created for development activity (this file)

**Purpose:**
| Log | Tracks |
|-----|--------|
| `CHANGELOG.md` | Shipped features (public-facing) |
| `docs/tutor-journal.md` | Student sessions, curriculum decisions |
| `docs/dev-log.md` | All project work, files changed, technical decisions |

---

### Second Student Added
Added Christian (B1, Brazilian Portuguese) to the knowledge base.

---

### Printable Worksheet System
Created first printable worksheet for tutoring sessions.

**Files created:**
- `printables/preterite-worksheet-christian.html` - 70-exercise preterite tense worksheet

**Features:**
- Conjugation reference tables (regular + 12 irregular verbs)
- Part A: 20 regular -AR verbs
- Part B: 15 regular -ER/-IR verbs
- Part C: 20 irregular verbs
- Part D: 15 mixed practice
- Answer key on separate page
- Print-friendly CSS (~6-7 pages)

**Notes:**
- Christian knows the forms, needs practice choosing correct conjugations
- Future: create preterite-vs-imperfect contrast drill

---

## Template

```
## YYYY-MM-DD

### [Feature/Task Name]
Brief description.

**Files created:**
- `path/to/file.ext` - Description

**Files modified:**
- `path/to/file.ext` - What changed

**Decisions:**
- Why we did X instead of Y

**Notes:**
- Anything else relevant
```
