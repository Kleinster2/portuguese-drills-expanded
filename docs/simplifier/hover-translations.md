# Hover Translation System

This document describes the dictionary-based hover translation system used across the Portuguese learning platform.

## Overview

Words and phrases in Portuguese text display English translations on hover. The system uses:
1. A JSON dictionary for lookups
2. CSS tooltips for display
3. JavaScript for processing text and matching

## Dictionary Structure

Location: `config/dictionary.json`

```json
{
  "phrases": {
    "a pé": "on foot",
    "de vez em quando": "from time to time"
  },
  "words": {
    "casa": "house; home",
    "comer": "to eat"
  }
}
```

### Rules for Dictionary Entries

1. **Phrases first**: Multi-word expressions go in `phrases` section
2. **Alphabetical order**: Keep entries sorted alphabetically
3. **Multiple meanings**: Separate with semicolon (`;`)
4. **Verb forms**: Include common conjugations as separate entries
5. **No fake words**: Only add real Portuguese words (e.g., "pé" is valid, "pe" without accent is not)

### Adding New Words

```json
"newword": "translation",
```

For verbs with conjugations:
```json
"comer": "to eat",
"comeu": "ate (comer)",
"comendo": "eating (comer)"
```

## CSS Styles

Add these styles for tooltip functionality:

```css
/* Hoverable words/phrases */
.word-tooltip,
.phrase-tooltip {
    position: relative;
    cursor: help;
}

.word-tooltip:hover,
.phrase-tooltip:hover {
    background-color: #dbeafe;
    border-radius: 2px;
}

/* Tooltip bubble */
.word-tooltip::after,
.phrase-tooltip::after {
    content: attr(data-translation);
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #1e293b;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-style: italic;
    white-space: nowrap;
    text-align: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
    z-index: 10;
    pointer-events: none;
}

/* Tooltip arrow */
.word-tooltip::before,
.phrase-tooltip::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: #1e293b;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s, visibility 0.2s;
    z-index: 10;
}

/* Show on hover */
.word-tooltip:hover::after,
.word-tooltip:hover::before,
.phrase-tooltip:hover::after,
.phrase-tooltip:hover::before {
    opacity: 1;
    visibility: visible;
}

/* Mobile tap support */
.word-tooltip.active::after,
.word-tooltip.active::before,
.phrase-tooltip.active::after,
.phrase-tooltip.active::before {
    opacity: 1;
    visibility: visible;
}
```

### Container Styling

The container holding translatable text needs padding for tooltips:

```css
#output-container {
    overflow-x: hidden;
    overflow-y: visible;
    padding-top: 1.5rem; /* Room for tooltips on first line */
}
```

## JavaScript Functions

### Loading the Dictionary

```javascript
let dictionary = { phrases: {}, words: {} };

async function loadDictionary() {
    try {
        const response = await fetch('/config/dictionary.json');
        dictionary = await response.json();
    } catch (error) {
        console.error('Failed to load dictionary:', error);
    }
}
```

### Word Lookup (Case-Insensitive)

```javascript
function lookupWord(word) {
    const lowerWord = word.toLowerCase();

    // Try exact match first
    if (dictionary.words[lowerWord]) {
        return dictionary.words[lowerWord];
    }

    // Try case-insensitive search
    for (const [key, value] of Object.entries(dictionary.words || {})) {
        if (key.toLowerCase() === lowerWord) {
            return value;
        }
    }

    return null;
}
```

### Adding Tooltips to Text

```javascript
function addTooltips(text) {
    let withTooltips = text;

    // Get phrases sorted by length (longest first to avoid partial matches)
    const phrases = Object.entries(dictionary.phrases || {})
        .sort((a, b) => b[0].length - a[0].length);

    // Process multi-word phrases FIRST
    // Use Unicode-aware boundaries (not \b which fails with accented chars)
    for (const [phrase, translation] of phrases) {
        const safeTranslation = translation.replace(/"/g, '&quot;');
        const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const phraseRegex = new RegExp(
            `(?<![A-Za-zÀ-ÿ])(${escapedPhrase})(?![A-Za-zÀ-ÿ])`,
            'gi'
        );
        withTooltips = withTooltips.replace(phraseRegex, function(match) {
            return `<span class="phrase-tooltip" data-translation="${safeTranslation}">${match}</span>`;
        });
    }

    // Process single words (skip words already inside spans)
    withTooltips = withTooltips.replace(
        /(<span[^>]*>.*?<\/span>)|([A-Za-zÀ-ÿ]+)/g,
        function(match, spanGroup, wordGroup) {
            if (spanGroup) return spanGroup; // Already wrapped

            const translation = lookupWord(wordGroup);
            if (translation) {
                const safeTranslation = translation.replace(/"/g, '&quot;');
                return `<span class="word-tooltip" data-translation="${safeTranslation}">${wordGroup}</span>`;
            }
            return wordGroup;
        }
    );

    return withTooltips;
}
```

### Mobile Tap Support

```javascript
document.addEventListener('click', (e) => {
    const tooltip = e.target.closest('.word-tooltip, .phrase-tooltip');

    // Remove active from all other tooltips
    document.querySelectorAll('.word-tooltip.active, .phrase-tooltip.active').forEach(el => {
        if (el !== tooltip) el.classList.remove('active');
    });

    // Toggle active on clicked tooltip
    if (tooltip) {
        tooltip.classList.toggle('active');
    }
});
```

## Audio Filtering

When using text-to-speech, filter out English text and emojis:

```javascript
// Detect English text
function isLikelyEnglish(text) {
    const englishPatterns = [
        /^I\s+(see|would|can|will|have|am|think|notice)/i,
        /^(If you|You've|You can|You may|Feel free|This is|That is|Here is)/i,
        /^(The text|Your text|This text|That text)/i,
        /\b(you'd like|you would|I'll help|I can help|paste it|already at)\b/i,
        /\b(simplif|translat|Portuguese|English|level|greeting)/i,
        /\b(here and|just paste|any text)\b/i
    ];
    return englishPatterns.some(pattern => pattern.test(text));
}

// Detect emojis
function containsEmoji(text) {
    const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
    return emojiPattern.test(text);
}

// Before speaking text:
if (isLikelyEnglish(text) || containsEmoji(text)) {
    console.log('Skipping:', text);
    return; // or skip to next sentence
}
```

## Important Notes

### Unicode Word Boundaries

JavaScript's `\b` word boundary doesn't work with accented characters. Use:
```javascript
// Instead of: /\b(word)\b/
// Use: /(?<![A-Za-zÀ-ÿ])(word)(?![A-Za-zÀ-ÿ])/
```

### Phrase Matching Order

Always process phrases **before** single words, and sort phrases by length (longest first) to avoid partial matches:
- "de vez em quando" should match before "de" or "vez"

### HTML Escaping

Always escape translations for use in HTML attributes:
```javascript
const safeTranslation = translation.replace(/"/g, '&quot;');
```

## Usage Example

```javascript
// 1. Load dictionary on page load
await loadDictionary();

// 2. Process text to add tooltips
const portugueseText = "Eu vou a pé para casa.";
const escapedText = escapeHtml(portugueseText);
const withTooltips = addTooltips(escapedText);

// 3. Insert into DOM
outputElement.innerHTML = withTooltips;
```

## Files Using This System

- `simplifier.html` - Text simplifier tool
- `config/dictionary.json` - Main dictionary file
