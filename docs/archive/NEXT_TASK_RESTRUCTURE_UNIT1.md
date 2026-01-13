# Next Task: Restructure Unit 1 - Meet Daniel First

## Task Overview

Restructure Unit 1 to show Daniel's complete introduction FIRST, then break down into individual patterns.

## Current Structure

```
Unit 1: Identity
├── Pattern 1.1 - Names
├── Pattern 1.2 - Professions
├── Pattern 1.3 - Nationalities
├── Pattern 1.4 - Cities
├── Pattern 1.5 - Countries
├── Pattern 1.6 - Characteristics
└── Meet Daniel Section (currently at bottom)
    ├── Step 1: With "eu" (explicit)
    ├── Step 2: Without "eu" (implicit)
    └── Step 3: Concatenated (natural flow)
```

## Proposed New Structure

```
Unit 1: Identity
├── Meet Daniel Section (MOVE TO TOP)
│   ├── Full Introduction (ADD speaker button)
│   ├── Step 1: With "eu" (explicit)
│   ├── Step 2: Without "eu" (implicit)
│   └── Step 3: Concatenated (natural flow)
├── "Now let's learn each pattern..." (transition)
├── Pattern 1.1 - Names
├── Pattern 1.2 - Professions
├── Pattern 1.3 - Nationalities
├── Pattern 1.4 - Cities
├── Pattern 1.5 - Countries
└── Pattern 1.6 - Characteristics
```

## Key File

**`lessons/unit-1.html`**

### Current "Meet Daniel" Location
- Starts at line ~418
- Contains 3-step progression
- Currently at END of lesson

### Current Patterns Location
- Start after intro section
- Lines ~120-415

## Implementation Steps

1. **Read current "Meet Daniel" section** (lines 418+)
2. **Add intro box at top** with:
   - Full introduction text (all 5 sentences)
   - Large speaker button
   - Translation
3. **Move 3-step progression** below intro box
4. **Add transition text**: "Now let's learn each pattern..."
5. **Keep all Pattern 1.1-1.6 sections** as-is below
6. **Test speaker button** works for full intro
7. **Verify flow** makes pedagogical sense

## Daniel's Full Introduction

```
Eu sou o Daniel.
Eu sou americano.
Eu sou de Miami.
Eu sou analista.
Eu sou casado com a Sofia.
```

**Translation:**
"I am Daniel. I am American. I am from Miami. I am an analyst. I am married to Sofia."

## Design Considerations

### Speaker Button
- Should read all 5 sentences as one audio clip
- Use `.three-step-speaker` or similar class
- Make it prominent (larger than pattern speakers)

### Visual Design
- Consider hero section style (prominent, engaging)
- Maybe light background color to distinguish from patterns
- Clear heading: "Meet Daniel"

### Pedagogical Flow
1. **Inspire** - "This is what you'll learn"
2. **Show progression** - 3 steps (explicit → implicit → natural)
3. **Teach** - Individual patterns
4. **Practice** - (could add practice section at end)

## Notes from v2.0 Work

- Three-step format only used where pronunciation changes occur
- Feminine examples (no changes) shown as vocabulary lists
- Pattern 1.2 (professions) has no pronunciation changes
- All v2.0 cleanup is complete and deployed

## Current Version

- Python: v2.0
- JavaScript: v2.0
- Lessons: v2.0 (cleaned up)
- Documentation: Complete

## Next Session Starting Point

Fresh session should:
1. Read this handoff document
2. Read current Unit 1 structure
3. Implement restructuring
4. Test and deploy

---

**Session Ended:** 2025-01-10
**Next Task:** Move "Meet Daniel" to top of Unit 1
**Status:** Ready to implement
