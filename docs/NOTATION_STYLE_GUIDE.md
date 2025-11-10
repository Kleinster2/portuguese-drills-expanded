# Notation Style Guide

This document defines the notation conventions used throughout the Portuguese Language Tutor curriculum.

## Overview

We use three different notation styles to convey different types of information:

1. **Parentheses `()`** - For explanations and clarifications
2. **Square brackets `[]`** - For placeholders and variables
3. **Forward slashes `//`** - For pronunciation annotations

---

## 1. Parentheses `()` - Explanations

Use parentheses for **explanations, labels, and clarifications**.

### Examples:

**Gender markers:**
```
americano (m) / americana (f)
brasileiro (m) / brasileira (f)
analista (m/f)                    ← Note: slash inside parentheses is OK
o (m) / a (f)
```

**Word type explanations:**
```
ser - to be (permanent/identity)   ← Note: slash separates related concepts
estar - to be (temporary/location)
```

**Gender labels:**
```
I am John. (masculine)
I am Sofia. (feminine)
```

**Descriptive labels:**
```
the (definite article)
same for (m/f)
```

**Step descriptions:**
```
Step 1: With "eu" (explicit)
Step 2: Without "eu" (implicit)
Step 3: Concatenated (natural flow)
```

### Rule:
✅ **Slashes CAN be used inside parentheses** to separate items in explanations: `(m/f)`, `(permanent/identity)`

---

## 2. Square Brackets `[]` - Placeholders

Use square brackets for **placeholders and variables** - things that should be filled in by the learner.

### Examples:

**Pattern placeholders:**
```
Eu sou [o/a] [name]
Eu sou [profession]
Eu sou [nationality]
Eu sou de [city]
Eu sou [do/da] [place]
Eu sou [characteristic]
```

**Variable options:**
```
Eu sou [o/a] [name]              ← [o/a] indicates choose "o" or "a"
Eu sou [do/da] [place]           ← [do/da] indicates choose "do" or "da"
```

### Rule:
✅ **Placeholders indicate user input** - things to be replaced with actual values

---

## 3. Forward Slashes `//` - Pronunciation

Use forward slashes **ONLY for pronunciation annotations** - how to actually pronounce the Portuguese.

### Examples:

**Pronunciation guides:**
```
sou /u/                          ← Final "o" sounds like "oo"
de /dji/                         ← "de" pronounced like "jee"
com /coun/                       ← Nasal "com" sound
```

**In context:**
```
Eu sou /u/ o /u/ Daniel.
Eu sou de /dji/ Miami.
casado /u/ com /coun/ a Sofia
```

### Rule:
✅ **Forward slashes are ONLY for pronunciation** - never for explanations or placeholders
❌ **Do NOT use** for gender markers like `/m/` or explanations like `/permanent/`

---

## Complete Examples

### Pattern Heading:
```
Pattern 1.1: Eu sou [o/a] [name]
             ↑       ↑     ↑
             text    placeholder options
```

### Vocabulary Entry:
```
americano (m) / americana (f)
          ↑                ↑
          gender explanation

American (masculine/feminine)
         ↑
         explanation in English
```

### Example Sentence:
```
Eu sou /u/ americano /u/.
       ↑              ↑
       pronunciation  pronunciation

I am American. (m/f)
               ↑
               gender explanation
```

### Complete Pattern Example:
```
Pattern 1.3: Eu sou [nationality]
                    ↑
                    placeholder

Example:
Eu sou americano /u/. / Eu sou americana.
       ↑         ↑
       text      pronunciation

Translation: I am American. (m/f)
                            ↑
                            explanation

Vocabulary:
americano (m) / americana (f) - American
          ↑                ↑
          gender markers
```

---

## Quick Reference

| Notation | Purpose | Examples |
|----------|---------|----------|
| `()` | Explanations, labels | `(m)`, `(f)`, `(m/f)`, `(permanent/identity)`, `(explicit)` |
| `[]` | Placeholders, variables | `[name]`, `[profession]`, `[o/a]`, `[do/da]` |
| `//` | Pronunciation only | `/u/`, `/dji/`, `/coun/`, `/i/` |

---

## Common Mistakes to Avoid

❌ **Wrong:** `americano /m/ / americana /f/` (slashes for gender)
✅ **Right:** `americano (m) / americana (f)`

❌ **Wrong:** `to be /permanent/identity/` (slashes for explanation)
✅ **Right:** `to be (permanent/identity)`

❌ **Wrong:** `Eu sou /name/` (slashes for placeholder)
✅ **Right:** `Eu sou [name]`

❌ **Wrong:** `Step 1: With "eu" [explicit]` (brackets for explanation)
✅ **Right:** `Step 1: With "eu" (explicit)`

---

## When to Use Each

### Use `()` when:
- Indicating gender: `(m)`, `(f)`, `(m/f)`
- Explaining word types: `(permanent/identity)`, `(temporary/location)`
- Adding clarifications: `(explicit)`, `(implicit)`, `(natural flow)`
- Labeling: `(masculine)`, `(feminine)`, `(definite article)`

### Use `[]` when:
- Showing a placeholder: `[name]`, `[profession]`, `[city]`
- Indicating choice options: `[o/a]`, `[do/da]`
- Representing variable input

### Use `//` when:
- Showing pronunciation: `/u/`, `/dji/`, `/coun/`
- Indicating how to pronounce Portuguese sounds
- **ONLY for pronunciation** - nothing else!

---

## Application in Code

The `cleanTextForSpeech()` function in speaker buttons removes pronunciation annotations but preserves explanations and placeholders:

```javascript
// Removes: /u/, /dji/, /coun/
// Keeps: (m), (f), [name], [profession]
```

This ensures that when text is spoken aloud, pronunciation guides are removed but the actual Portuguese words remain.

---

## Summary

**Remember the three-part system:**

1. **Parentheses** `()` = **Explanations** (what it means, labels)
2. **Square brackets** `[]` = **Placeholders** (fill this in)
3. **Forward slashes** `//` = **Pronunciation** (how to say it)

**Special note:** Slashes can appear INSIDE parentheses for separating items in explanations: `(m/f)`, `(permanent/identity)`

This notation system keeps content clear, consistent, and functional with the text-to-speech features.
