# Code Map - Portuguese Drills

**Quick reference for locating code by feature or issue**

## 🔍 When You Need To Fix...

### Session Management Issues
- **`functions/api/chat.js:25-26`** - In-memory session storage (Map)
- **`functions/api/chat.js:256-276`** - Stateless fallback logic (reconstructs from clientMessages)
- **`index.html:1238-1250`** - Client sends message history for stateless mode
- **Key commits**: `cc32e38` (session fix), `a1bcc42` (JSON parsing fix)

### Answer Chips System
- **`js/answerChips.js:8-16`** - shouldShowAnswerChips() detection logic
- **`js/answerChips.js:19-55`** - extractAnswerChips() parsing (single-row and two-row)
- **`js/answerChips.js:58-63`** - removeChipsMarker() cleanup
- **`js/answerChips.js:80-102`** - addSingleRowChips() rendering
- **`js/answerChips.js:105-157`** - addTwoRowChips() with multi-select
- **`js/answerChips.js:160-190`** - selectTwoRowChip() selection logic
- **`js/answerChips.js:193-206`** - submitTwoRowAnswer() submission
- **`index.html:1330-1420`** - addMessageToChat() integrates chips

### Conjugation Buttons (Verb Drills)
- **`js/conjugations.js`** - Full conjugation button system
- **Note**: Separate from answer chips, used for verb conjugation drills

### Drill Configurations
- **`config/prompts/*.json`** - 47 individual drill configs
- **`config/prompts/ser-estar.json`** - Example with all 8 chips every time
- **`config/prompts/por-vs-para.json`** - Two-row multi-select example
- **`config/prompts/muito.json`** - Agreement drill example
- **`utils/promptManager.js`** - Generated file (DO NOT EDIT DIRECTLY)
- **`scripts/build-prompts.js`** - Syncs JSON → promptManager.js

### Chat API & AI Integration
- **`functions/api/chat.js:28-50`** - containsForbiddenWords() backend filter (café, frio, etc.)
- **`functions/api/chat.js:104-186`** - callClaude() function with retry logic + forbidden word auto-retry
- **`functions/api/chat.js:35-102`** - getDrillPrompt() adds randomization instructions
- **`functions/api/chat.js:188-254`** - onRequestPost() new session handler
- **`functions/api/chat.js:255-330`** - onRequestPost() existing session handler
- **`index.html:1199-1309`** - sendChatMessage() client-side API calls

### UI Components
- **`index.html:38-110`** - A1 Text Simplifier section
- **`index.html:666-811`** - Drill Selector Modal
- **`index.html:900-1197`** - openDrillChat() function
- **`index.html:1329-1420`** - addMessageToChat() message rendering

---

## 📁 File Reference

### Frontend Files

#### **`index.html`** (Main Application)
```
Line ranges by feature:
38-110      A1 Text Simplifier UI
115-660     Drill cards grid
666-811     Drill selector modal
815-898     Empty session handler
900-1197    openDrillChat() - starts new drill sessions
1199-1309   sendChatMessage() - handles all API communication
1329-1420   addMessageToChat() - renders messages with chips/buttons
1422-1550   formatAIMessage() - markdown-like formatting
1552-1750   Drill session management (badges, removal, etc.)
1752-1850   Learning paths feature
1852-1950   Copy link functionality
1952-2050   Utility functions
```

**Critical functions:**
- **`sendChatMessage()`** (1199) - Includes message history for stateless mode
- **`addMessageToChat()`** (1329) - Integrates chips and conjugation buttons
- **`openDrillChat()`** (900) - Creates new sessions with API

#### **`js/answerChips.js`** (Answer Chips System)
```
8-16        shouldShowAnswerChips() - Detects [CHIPS:] markers
19-55       extractAnswerChips() - Parses single/two-row formats
58-63       removeChipsMarker() - Cleans display text
66-77       addAnswerChips() - Main dispatcher
80-102      addSingleRowChips() - Standard chip rendering
105-157     addTwoRowChips() - Two-row with multi-select (por-vs-para)
160-190     selectTwoRowChip() - Handles row selection
193-206     submitTwoRowAnswer() - Combines and submits selections
209-213     sendAnswer() - Triggers sendChatMessage()
```

**Chip format detection:**
```javascript
// Single-row: /\[CHIPS:\s*([^\]]+)\]/i
// Two-row: /\[CHIPS-ROW1:\s*([^\]]+)\]/i + /\[CHIPS-ROW2:\s*([^\]]+)\]/i
```

#### **`js/conjugations.js`** (Conjugation Buttons)
- Full verb conjugation button system
- Used by: regular-ar, regular-er, regular-ir, irregular-verbs, etc.
- Separate from answer chips

#### **`js/utils.js`** (Shared Utilities)
- escapeHtml()
- shuffleArray()
- Other helper functions

#### **`css/styles.css`**
- Custom Tailwind styles
- Chip button styles
- Responsive design rules

---

### Backend Files

#### **`functions/api/chat.js`** (Serverless Chat API)
```
4-18        CORS configuration
21-23       OPTIONS handler
25-26       ⚠️ In-memory session storage (ephemeral!)
28-30       generateSessionId()
32-50       containsForbiddenWords() - Backend filter for café/frio/etc
52-102      getDrillPrompt() - Adds randomization + chip instructions
104-186     callClaude() - API calls with retry logic (3 attempts)
            ├─ Includes forbidden word auto-retry (up to 3 times)
            └─ Adds explicit reminder message when regenerating
188-254     onRequestPost() - NEW session handler
255-330     onRequestPost() - EXISTING session handler
            ├─ 256-276: Stateless fallback (reconstructs from clientMessages)
            └─ 278-283: 404 error if no session found
332-360     Error handling with user-friendly messages
```

**Critical patterns:**
```javascript
// Line 256-276: Stateless fallback
if (!session && clientMessages && Array.isArray(clientMessages)) {
  // Reconstruct session from client's message history
}

// Line 279: The error user saw
return new Response(JSON.stringify({ error: 'Session not found' }), {
  status: 404,
  headers: { ...headers, 'Content-Type': 'application/json' }
});
```

#### **`utils/promptManager.js`** (Generated - DO NOT EDIT)
- Auto-generated by `scripts/build-prompts.js`
- Contains all 47 drill configurations embedded
- File size: ~446 KB
- Regenerate with `npm run build`

---

### Configuration Files

#### **`config/prompts/*.json`** (47 Drill Configs)

**Standard structure:**
```json
{
  "id": "drill-name",
  "name": "Display Name",
  "description": "Brief description",
  "systemPrompt": "Very long prompt with \\n escapes (NOT literal newlines!)"
}
```

**Important examples:**

**`ser-estar.json`** - All 8 chips every time
```
Shows: sou, estou, é, está, somos, estamos, são, estão
Plus "both" for ambiguous cases
Fixed in commits: a1bcc42 (JSON), d98f683 (chips), c40076a, 3af26fc
```

**`por-vs-para.json`** - Two-row multi-select
```
ROW1: por, para
ROW2: All 14 categories every time
User must select one from each row before submitting
```

**`reflexive-verbs.json`** - Two-row with 3-type question system
```
ROW1: me, te, se, nos, none
ROW2: reflexive, reciprocal, non-reflexive
Three types: Reflexive (50%), Reciprocal (25%), Non-Reflexive (25%)
Examples: "Eu me lavo" vs "Eu lavo o carro"
```

**`muito.json`** - Agreement drill
```
Created in previous session
60% noun agreement, 30% invariable with adjectives, 15% with verbs
```

**`regular-ar.json`, `regular-er.json`, `regular-ir.json`**
```
Use conjugation buttons, NOT answer chips
Present and preterite tenses
```

**⚠️ Common mistake:**
```json
// ❌ WRONG - Literal newlines cause JSON parse errors
"systemPrompt": "Line 1
Line 2"

// ✅ CORRECT - Use \n escape sequences
"systemPrompt": "Line 1\nLine 2"
```

---

### Build & Deployment Files

#### **`scripts/build-prompts.js`** (Build Script)
```
Reads all config/prompts/*.json files
Validates JSON syntax
Generates utils/promptManager.js
Reports errors (shows position and line)
```

**Running:**
```bash
npm run build    # Syncs JSON to promptManager.js
```

**Output:**
```
Found 47 prompt files
✓ Loaded ser-estar.json (ser-estar)
✗ Skipping bad-file.json: Expected ',' or '}' after property value...
✅ Successfully updated promptManager.js with 47 prompts
📦 File size: 446.5 KB
```

#### **`package.json`** (Scripts)
```json
{
  "scripts": {
    "build": "node scripts/build-prompts.js",
    "deploy": "npm run build && wrangler pages deploy . --project-name=portuguese-drills-expanded"
  }
}
```

#### **`wrangler.toml`** (Cloudflare Config)
- Project name
- Environment variables (ANTHROPIC_API_KEY)
- Pages configuration

---

## 🎯 Common Tasks

### Adding a New Drill

1. **Create config file**: `config/prompts/new-drill.json`
2. **Format check**: Use `\n` not literal newlines
3. **Add to index.html**: Create drill card (around line 200-600)
4. **Build**: `npm run build`
5. **Deploy**: `npm run deploy`

**Template:**
```json
{
  "id": "new-drill",
  "name": "New Drill",
  "description": "Brief description",
  "systemPrompt": "Your prompt here\n\nWith proper escapes"
}
```

### Adding Answer Chips to Existing Drill

**Edit the drill's JSON config**, add to systemPrompt:
```
**ANSWER CHIPS:**
After each question, add:
[CHIPS: correct, wrong1, wrong2, wrong3]

Example:
"She is tall."
Ela é ______.
[CHIPS: alta, alto, altas, altos]
```

Then:
```bash
npm run build
npm run deploy
```

### Fixing Session Errors

**Check:**
1. Is `index.html:1238-1250` sending `messages: messageHistory`?
2. Is `functions/api/chat.js:256-276` handling stateless fallback?
3. Are error messages coming from line 279 (session not found)?

**Debug:**
```javascript
// In browser console:
console.log('Session:', currentChatSession);
console.log('Messages:', drillSessions[currentDrillId].messages);
```

### Fixing JSON Parse Errors

**Build output shows:**
```
✗ Skipping ser-estar.json: Bad control character at position 2343
```

**Problem:** Literal newlines in JSON string

**Solution:**
1. Read the file
2. Find the systemPrompt field
3. Replace literal newlines with `\n`
4. Save and rebuild

**Reference:** See commit `a1bcc42` for example fix

---

## 🐛 Known Issues & Line Numbers

### 1. Session Not Found (404) - FIXED
**Location**: `functions/api/chat.js:279`
**Fix**: `index.html:1238-1250` now sends message history
**Commit**: `cc32e38`

### 2. JSON Parsing Errors - FIXED
**Location**: Three files had literal newlines
**Fix**: Replaced with `\n` escape sequences
**Commit**: `a1bcc42`

### 3. Wrong Drill Loading - FIXED
**Cause**: Broken JSON prevented drill from loading
**Effect**: Fallback to different drill
**Fix**: Fixed JSON, rebuilt with `npm run build`

---

## 🔄 Data Flow

### New Session Creation
```
User clicks drill card
  → openDrillChat() (index.html:900)
    → POST /api/chat {isNewSession: true, drillId}
      → onRequestPost() (chat.js:188)
        → generateSessionId() (chat.js:28)
        → getDrillPrompt() (chat.js:35)
        → callClaude() (chat.js:104)
          → Anthropic API
        ← Welcome message
      ← {sessionId, response}
    ← Display message with chips
```

### Message Exchange
```
User clicks chip or types answer
  → sendAnswer() or sendChatMessage() (index.html:1199)
    → Collects message history (1239)
    → POST /api/chat {sessionId, drillId, message, messages}
      → onRequestPost() (chat.js:255)
        → Checks sessions.get(sessionId) (256)
        → Stateless fallback if not found (258-276)
        → callClaude() (313)
          → Anthropic API
        ← AI response
      ← {sessionId, response}
    ← Display with chips/buttons
```

### Build Process
```
npm run build
  → scripts/build-prompts.js
    → Reads config/prompts/*.json
    → Validates JSON (try/catch parse)
    → Generates utils/promptManager.js
      → Embeds all 47 configs
      → Creates Map structure
    ← Reports success/errors
```

---

## 📊 Statistics

- **Total drills**: 47
- **Total lines of code**: ~2,000+ (index.html alone)
- **JSON config files**: 47
- **JavaScript modules**: 4 (utils, answerChips, conjugations, dependencies)
- **Serverless functions**: 1 (chat.js)
- **Build output size**: 446 KB (promptManager.js)

---

## 🔗 Related Files

When working on a feature, you typically need to touch:

### Answer Chips Feature
- `config/prompts/[drill].json` - Add [CHIPS:] to systemPrompt
- `js/answerChips.js` - Chip rendering logic
- `index.html` - Integration in addMessageToChat()
- `functions/api/chat.js` - Instructions in getDrillPrompt()

### Session Management
- `functions/api/chat.js` - Server-side session handling
- `index.html` - Client-side session storage in drillSessions
- Both files must coordinate for stateless fallback

### New Drill
- `config/prompts/new-drill.json` - Configuration
- `index.html` - Drill card UI (around line 200-600)
- `scripts/build-prompts.js` - Auto-detects and includes

---

## 💡 Quick Reference

**Find a specific drill's config:**
```bash
ls config/prompts/ser-estar.json
```

**Check what's in promptManager:**
```bash
# Shows all loaded drills
grep "Loaded.*json" utils/promptManager.js
```

**Search for a function:**
```bash
grep -n "function sendChatMessage" index.html
# Output: 1199:async function sendChatMessage(retryMessage = null) {
```

**Find where chips are used:**
```bash
grep -n "CHIPS:" config/prompts/*.json
```

---

## 📚 Further Reading

- **[PROJECT_README.md](PROJECT_README.md)** - High-level architecture and concepts
- **[Consistency Analysis](DRILL_CONSISTENCY_ANALYSIS.md)** - Drill improvement roadmap
- **`.sessions/`** - Recent changes and development notes
- **Git log** - `git log --oneline` for recent commits
- **Anthropic Docs** - https://docs.anthropic.com/claude/reference/messages_post
