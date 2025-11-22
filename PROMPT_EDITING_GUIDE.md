# Guide: Editing Prompt Files

## The Problem

The prompt JSON files in `config/prompts/` contain very long `systemPrompt` values that appear as a single long line in your editor. This is because JSON requires string values to be on a single line, with newlines escaped as `\n`.

Example:
```json
{
  "systemPrompt": "Line 1\nLine 2\nLine 3..."
}
```

This makes them difficult to read and edit.

## Quick Solutions

### Solution 1: Enable Word Wrap (Recommended)

**In VS Code:**
- **Quick toggle**: Press `Alt+Z`
- **Permanent setting**: 
  1. Go to File → Preferences → Settings
  2. Search for "word wrap"
  3. Set to "on"

This will make long lines wrap visually in your editor.

### Solution 2: Use the Format Script

I've created a utility script to help you extract, view, and edit prompts in a readable format.

#### View a Prompt

```bash
node scripts/format-prompt.js view config/prompts/self-introduction.json
```

This displays the prompt in a readable, unescaped format in your terminal.

#### Extract and Edit a Prompt

```bash
# 1. Extract the prompt to a text file
node scripts/format-prompt.js extract config/prompts/self-introduction.json

# 2. Edit the file scripts/temp-prompt.txt in your editor

# 3. Update the JSON file with your changes
node scripts/format-prompt.js update config/prompts/self-introduction.json scripts/temp-prompt.txt
```

### Solution 3: Use a JSON Formatter Extension

Install a VS Code extension like:
- **"JSON Tools"** - Provides better JSON viewing/editing
- **"Better Comments"** - Helps highlight sections in long strings

## Alternative Format (Not Recommended)

You could convert the JSON files to use array format for multi-line strings:

```json
{
  "systemPrompt": [
    "Line 1",
    "Line 2",
    "Line 3"
  ]
}
```

However, this would require changing your application code to join the array, which adds complexity.

## Recommendations

1. **Use `Alt+Z` to enable word wrap** - This is the simplest solution
2. **Use the format script** when making major edits to prompts
3. Keep the JSON format as-is, since it works with your application

## Tips for Working with Long Strings

- Enable line numbers in VS Code to see where you are in the file
- Use Ctrl+F to search within the long string
- Consider breaking very long prompts into sections with clear markers like headers
