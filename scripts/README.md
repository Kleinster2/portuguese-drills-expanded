# Build Scripts

## build-prompts.js

**Purpose**: Syncs JSON prompt files into `utils/promptManager.js`

### Why This Is Needed

Cloudflare Workers can't read files at runtime, so all drill prompts must be embedded directly into the JavaScript code. This script automates that process.

### How It Works

1. Reads all `.json` files from `config/prompts/`
2. Parses each JSON file
3. Finds the `promptConfigs` object in `utils/promptManager.js`
4. Replaces the embedded prompts with fresh data from JSON files
5. Writes the updated `promptManager.js`

### Usage

```bash
# Run manually
npm run build

# Or run directly
node scripts/build-prompts.js
```

### When to Run

**Always run before deploying:**
```bash
npm run deploy  # Automatically runs build first
```

**After editing any prompt file:**
```bash
# 1. Edit config/prompts/por-vs-para.json
# 2. Run build script
npm run build
# 3. Deploy
npm run deploy
```

### Architecture

```
config/prompts/*.json  (Source of truth - edit these)
         ↓
  build-prompts.js     (Build script)
         ↓
utils/promptManager.js (Auto-generated - DO NOT edit embedded prompts manually)
         ↓
   Cloudflare Deploy
```

### Important Notes

- **DO NOT** manually edit the embedded prompts in `promptManager.js`
- **ALWAYS** edit the JSON files in `config/prompts/`
- **ALWAYS** run `npm run build` after editing prompts
- The `deploy` script automatically runs `build` first
- Invalid JSON files are skipped with a warning

### Troubleshooting

**"Could not find promptConfigs"**: The structure of `promptManager.js` changed. Update the script.

**"Invalid JSON"**: Fix the JSON syntax error in the prompt file:
```bash
# Find which file is invalid
npm run build

# Fix the JSON
node -e "JSON.parse(require('fs').readFileSync('config/prompts/FILENAME.json', 'utf8'))"
```

**"File size too large"**: This is normal. `promptManager.js` is ~380KB because it contains all 45 drill prompts embedded as strings.
