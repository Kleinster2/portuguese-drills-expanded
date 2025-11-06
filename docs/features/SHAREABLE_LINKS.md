# Shareable Links Feature

## Overview

Each drill now has a unique, shareable URL that opens the integrated chat directly for that specific drill. This allows you to:
- Share specific drills with students or study partners
- Bookmark your favorite drills for quick access
- Link to specific drills from external resources

## How to Use

### Getting a Shareable Link

1. **From Drill Cards**: Each drill card now has a "🔗 Copy Link" button
   - Click the button to copy the shareable URL to your clipboard
   - The button will briefly show "✓ Copied!" as confirmation
   - The URL format is: `https://your-site.com/?drill=drill-id`

### Using Shareable Links

When someone visits a shareable link (e.g., `?drill=regular-ar`):
1. The page automatically opens the integrated chat for that drill
2. The corresponding drill card is highlighted and scrolled into view
3. The chat is ready to start with the drill's AI tutor

## Example URLs

Here are some example shareable links for your drills:

### A1 Level Drills
- **Regular -AR Verbs**: `?drill=regular-ar`
- **Regular -ER Verbs**: `?drill=regular-er`
- **Regular -IR Verbs**: `?drill=regular-ir`
- **Irregular Verbs**: `?drill=irregular-verbs`
- **Ser vs Estar**: `?drill=ser-estar`
- **Immediate Future**: `?drill=immediate-future`
- **Ir + Transportation**: `?drill=ir-transportation`
- **Noun Plurals**: `?drill=noun-plurals`
- **Adjective Agreement**: `?drill=adjective-agreement`
- **Contractions (de/em)**: `?drill=contractions-articles`

### A2 Level Drills
- **Reflexive Verbs**: `?drill=reflexive-verbs`
- **Present Continuous**: `?drill=present-continuous`

### B1 Level Drills
- **Imperfect Tense**: `?drill=imperfect-tense`
- **Future Tense**: `?drill=future-tense`
- **Conditional Tense**: `?drill=conditional-tense`
- **Present Subjunctive**: `?drill=present-subjunctive`
- **Imperative**: `?drill=imperative`

### B2 Level Drills
- **Imperfect Subjunctive**: `?drill=imperfect-subjunctive`
- **Future Subjunctive**: `?drill=future-subjunctive`
- **Demonstratives**: `?drill=demonstratives`
- **Advanced Demonstratives**: `?drill=advanced-demonstratives`
- **Crase**: `?drill=crase`
- **Contractions (de)**: `?drill=contractions-de`
- **Contractions (em)**: `?drill=contractions-em`

### Specialized Drills
- **Self-Introduction**: `?drill=self-introduction`
- **Portuguese for Spanish Speakers**: `?drill=portuguese-for-spanish`
- **Syllable Stress**: `?drill=syllable-stress`
- **Brazilian Phonetics**: `?drill=phonetics-br`
- **Colloquial Speech**: `?drill=colloquial-speech`
- **Conversational Answers**: `?drill=conversational-answers`
- **A1 Text Simplifier**: `?drill=a1-simplifier`

## Technical Implementation

### Components Added

1. **URL Parameter Detection** (lines 631-647 in index.html)
   - Automatically detects `?drill=` parameter on page load
   - Opens the chat modal for the specified drill
   - Scrolls to and highlights the drill card

2. **Copy Link Function** (lines 1387-1412 in index.html)
   ```javascript
   async function copyDrillLink(drillId, buttonElement)
   ```
   - Generates shareable URL with drill parameter
   - Copies to clipboard using Navigator API
   - Provides visual feedback (button changes to "✓ Copied!")
   - Falls back to alert dialog if clipboard access fails

3. **Copy Link Buttons**
   - Added to all 30 drill cards
   - Gray button below the main action buttons
   - Uses drill ID from the card's structure

### URL Format

```
https://your-site.com/?drill=<drill-id>
```

Where `<drill-id>` matches the drill identifier from the config files (e.g., `regular-ar`, `ser-estar`, etc.)

## Benefits

1. **For Learners**:
   - Quick access to specific drills
   - Bookmark favorite exercises
   - Resume practice easily

2. **For Teachers**:
   - Assign specific drills to students
   - Share via messaging or learning platforms
   - Create structured lesson plans with direct links

3. **For Content Creators**:
   - Reference specific drills in blog posts
   - Link from YouTube video descriptions
   - Embed in course materials

## Browser Compatibility

The shareable links feature uses:
- `URLSearchParams` API (supported in all modern browsers)
- `navigator.clipboard.writeText()` (requires HTTPS in production)
- Fallback to `alert()` for clipboard failures

## Future Enhancements

Potential improvements:
- Share button with native Web Share API (mobile)
- QR code generation for drill links
- Social media preview metadata
- Analytics tracking for shared links
