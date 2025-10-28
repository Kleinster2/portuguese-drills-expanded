# Recent Changes

**Quick reference for what changed recently**

---

## 2025-01-XX - Documentation & Session Fix

### Major Changes

1. **Comprehensive Documentation Created**
   - PROJECT_README.md - Architecture and overview
   - CODEMAP.md - Detailed file locations with line numbers
   - .sessions/ - Working notes directory
   - Purpose: Help AI assistants understand project faster

2. **Fixed Session Not Found Error**
   - Commit: `cc32e38`
   - Problem: 404 errors when clicking answer chips
   - Solution: Client now sends message history for stateless fallback
   - Files: `index.html` (sendChatMessage)

3. **Fixed JSON Parsing Errors**
   - Commit: `a1bcc42`
   - Fixed: ser-estar.json, imperative.json, subject-identification.json
   - Problem: Literal newlines instead of `\n` escape sequences
   - Result: All 47 drills now load correctly

4. **Ser-Estar Answer Chips**
   - Commits: `d98f683`, `c40076a`, `3af26fc`
   - Shows all 8 conjugation forms as chips: sou, estou, é, está, somos, estamos, são, estão
   - Plus "both" for ambiguous cases
   - Files: `config/prompts/ser-estar.json`

---

## Earlier January 2025

### Answer Chips System
- Created comprehensive chip system (single-row and two-row)
- Two-row multi-select for por-vs-para drill
- Shows all 14 categories every time
- Files: `js/answerChips.js`, multiple drill configs

### Por vs Para Drill Enhancement
- Changed categories to descriptive format
- Removed labels ("Preposition:", "Usage category:")
- Always show all 14 categories
- Multi-select requirement (one from each row)
- Scrambled buttons for variety
- File: `config/prompts/por-vs-para.json`

### Muito Agreement Drill
- New drill: muito/muita/muitos/muitas
- 60% noun agreement, 30% adjectives, 15% verbs
- File: `config/prompts/muito.json`

### Printable Worksheets
- Created 3 worksheet files:
  - por-vs-para-exercises.txt
  - regular-verbs-exercises.txt
  - irregular-verbs-exercises.txt

### Text Simplifier
- Fixed placeholder text to English
- Changed from Portuguese to "Paste or type text in any language here..."

---

## File Change Summary

### Recently Modified Files
```
index.html                          - Session fix, UI updates
js/answerChips.js                   - Chip system implementation
config/prompts/ser-estar.json       - JSON fix + chips
config/prompts/por-vs-para.json     - Two-row chips
config/prompts/muito.json           - New drill
config/prompts/imperative.json      - JSON fix
config/prompts/subject-identification.json - JSON fix
functions/api/chat.js               - Stateless fallback logic
utils/promptManager.js              - Auto-generated from configs
```

### New Files Created
```
PROJECT_README.md                   - Project overview
CODEMAP.md                          - File location guide
.sessions/README.md                 - Directory explanation
.sessions/session-2025-01.md       - Current session notes
.sessions/known-issues.md          - Issue tracker
.sessions/future-improvements.md   - Ideas list
.sessions/recent-changes.md        - This file
por-vs-para-exercises.txt          - Printable worksheet
regular-verbs-exercises.txt        - Printable worksheet
irregular-verbs-exercises.txt      - Printable worksheet
```

---

## Commits Log (Recent)

```
cc32e38 - Fix session not found error when clicking answer chips
3af26fc - Show all 8 ser/estar conjugations as chips every time
c40076a - Ensure somos/estamos included in ser-estar chips
d98f683 - Add answer chips to ser-estar drill
a1bcc42 - Fix JSON parsing errors in ser-estar, imperative, and subject-identification prompts
[Earlier commits from previous sessions...]
```

---

## Build Changes

### promptManager.js
- Size: 446.5 KB (from ~425 KB)
- Now includes all 47 drills (previously 44)
- Validated JSON parsing for all configs

### Deployment
- Latest: https://1095a2fd.portuguese-drills-expanded.pages.dev
- All drills working correctly
- Session management stable

---

## Breaking Changes

**None** - All changes are backwards compatible

---

## Migration Notes

**None required** - No database changes, no API changes

Users will automatically get:
- Fixed session management
- New answer chips on ser-estar
- All 47 drills loading correctly

---

## Performance Impact

- Slightly larger promptManager.js (+21 KB)
- More robust session handling (reconstructs from history)
- No noticeable performance degradation

---

## Known Regressions

**None** - All fixes improve functionality without breaking existing features

---

## Testing Completed

✅ All 47 drills load correctly
✅ Answer chips work across all devices
✅ Session persistence with stateless fallback
✅ JSON validation passes for all configs
✅ Build process completes successfully

---

## Next Session Preview

Potential work items:
- Add chips to more drills (irregular-verbs, reflexive-verbs)
- Create more printable worksheets
- Consider progress tracking feature
- Monitor session performance in production

See `future-improvements.md` for full backlog

---

## Update Instructions

When starting a new session, add a new section at the top:

```markdown
## YYYY-MM-DD - [Brief Description]

### Major Changes
1. [Change 1]
   - Commit: `hash`
   - Details...

### Files Modified
- file1.js - What changed
- file2.json - What changed
```

Keep recent 5-10 sessions, move older entries to bottom or archive.
