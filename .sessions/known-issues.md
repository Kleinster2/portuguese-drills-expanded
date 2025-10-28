# Known Issues & Workarounds

**Last updated**: 2025-01-XX

## 🟢 Resolved Issues

### 1. Session Not Found Errors - FIXED ✅
**Date resolved**: 2025-01-XX
**Commit**: `cc32e38`

**Problem**: Clicking answer chips resulted in 404 "Session not found" errors

**Root cause**:
- Cloudflare Workers use distributed architecture
- In-memory sessions (Map) don't persist between requests
- Different Worker instances handle different requests

**Solution**:
- Client now sends full message history with every request
- Server reconstructs session from `clientMessages` if not found in memory
- Stateless fallback mode (already existed in code, just needed client support)

**Files affected**:
- `index.html:1238-1250` - Added message history to API calls
- `functions/api/chat.js:256-276` - Stateless reconstruction logic

---

### 2. JSON Parsing Errors in Drill Configs - FIXED ✅
**Date resolved**: 2025-01-XX
**Commit**: `a1bcc42`

**Problem**: Three drills failed to load with JSON parse errors:
- ser-estar.json - "Bad control character in string literal"
- imperative.json - Expected ',' or '}' after property value
- subject-identification.json - Expected ',' or '}' after property value

**Root cause**:
- systemPrompt fields contained literal newline characters
- JSON requires `\n` escape sequences for newlines

**Solution**:
- Replaced all literal newlines with `\n` escape sequences
- Used proper JSON string format

**Prevention**:
- Always use `\n` for newlines in JSON strings
- Test with `npm run build` to catch parsing errors
- See `config/prompts/regular-ar.json` for correct format example

**Files affected**:
- `config/prompts/ser-estar.json`
- `config/prompts/imperative.json`
- `config/prompts/subject-identification.json`

---

### 3. Ser vs Estar Loading Wrong Drill - FIXED ✅
**Date resolved**: 2025-01-XX
**Commit**: `a1bcc42`

**Problem**: Clicking "Ser vs Estar" drill card loaded a different drill (Regular -ar verbs)

**Root cause**:
- ser-estar.json had JSON parsing error (see issue #2 above)
- When config fails to load, system may fall back to different drill

**Solution**:
- Fixed JSON parsing error in ser-estar.json
- Rebuilt with `npm run build`
- All 47 drills now load correctly

---

## 🟡 Current Issues

**None at this time** - All known issues have been resolved.

---

## 🔵 Limitations (Not Bugs)

### 1. Session Timeout
**Nature**: Cloudflare Workers may expire sessions after period of inactivity

**Impact**: User might need to start a new session if inactive for extended period

**Workaround**: Client's stateless mode automatically handles this - sessions reconstruct from message history

### 2. Message History Size
**Nature**: Very long conversations may hit token limits

**Impact**: Older messages may be truncated (currently keeps last 10 messages)

**Workaround**: Start new drill session for fresh context

**Location**: `functions/api/chat.js:109` - `limitedMessages = messages.slice(-10)`

### 3. AI Randomization Consistency
**Nature**: Claude may occasionally repeat similar questions despite randomization instructions

**Impact**: User might see familiar question patterns

**Workaround**: Instructions emphasize variety, but AI behavior can vary

---

## 🟣 Edge Cases to Monitor

### 1. Rapid Sequential Clicks on Chips
**Status**: Working, but worth monitoring

**Behavior**: Multiple rapid clicks might create race conditions

**Current handling**:
- Input disabled while processing
- Typing indicator shown
- Should prevent duplicate requests

**Monitor**: User feedback on any duplicate responses

### 2. Very Long Drill Sessions
**Status**: Untested at scale

**Potential issue**: Message history grows, could hit memory/token limits

**Current handling**: Keeps last 10 messages only

**Monitor**: Performance with 50+ messages in single session

### 3. Network Interruptions
**Status**: Basic error handling in place

**Current handling**:
- 90-second timeout
- Retry button for failed requests
- Error messages for user

**Monitor**: User experience during poor connectivity

---

## 📝 Reporting New Issues

When you discover a new issue, add it here with:

```markdown
### [Issue Number]. [Brief Title]
**Date discovered**: YYYY-MM-DD
**Status**: 🔴 Active | 🟡 In Progress | 🟢 Resolved

**Problem**: What's happening?

**Root cause**: Why is it happening?

**Workaround**: Temporary solution (if any)

**Solution**: Permanent fix (if found)

**Commits**: Hash of relevant commits

**Files affected**: List of files
```

---

## 🔍 Debugging Tips

### Check Session Status
```javascript
// In browser console:
console.log('Current session:', currentChatSession);
console.log('Active drills:', activeDrills);
console.log('Drill sessions:', drillSessions);
```

### Check API Responses
```javascript
// Watch network tab in DevTools
// Look for POST /api/chat
// Check request body includes 'messages' array
// Check response for errors
```

### Check Build Output
```bash
npm run build
# Look for:
# ✓ Loaded ser-estar.json (ser-estar)  ← Success
# ✗ Skipping bad.json: Error...        ← Problem
```

### Validate JSON
```bash
# Quick JSON validation
node -e "console.log(JSON.parse(require('fs').readFileSync('./config/prompts/ser-estar.json', 'utf8')).id)"
# Should output: ser-estar
# If error, JSON is malformed
```

---

## 📚 Related Documentation

- **CODEMAP.md** - Find exact line numbers for issues
- **PROJECT_README.md** - Architecture and common patterns
- **session-2025-01.md** - Recent work and changes
