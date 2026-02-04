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
