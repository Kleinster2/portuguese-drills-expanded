#!/usr/bin/env python3
"""
Add natural contextual prompts throughout:
- A1: Keep simple (already good)
- A2: Add moderate context
- B1/B2: Add full natural context
"""

import json
import re

def contextualize_a2(en, unit_name):
    """Add moderate context to A2 (daily life)."""
    en_lower = en.lower()

    # Daily routines
    if 'eat' in en_lower:
        if 'fruit' in en_lower:
            return "For breakfast, I usually eat fruit."
        elif 'lunch' in en_lower or 'dinner' in en_lower:
            return en
        else:
            return f"Every day, {en.lower()}"

    if 'drink' in en_lower:
        if 'coffee' in en_lower:
            return "In the morning, I drink coffee."
        elif 'water' in en_lower:
            return "When I exercise, I drink water."
        else:
            return f"Usually, {en.lower()}"

    if 'work' in en_lower and 'worked' in en_lower:
        return f"I was very tired because {en.lower()}"

    if 'study' in en_lower or 'studied' in en_lower:
        if 'going to' in en_lower:
            return f"Next year, {en.lower()}"
        else:
            return f"Every week, {en.lower()}"

    # Past tenses - add "yesterday" context
    if any(past in en_lower for past in ['visited', 'went', 'saw', 'did', 'ate', 'drank']):
        if 'yesterday' not in en_lower and 'last' not in en_lower:
            return f"Yesterday, {en.lower()}"

    # Immediate future
    if 'going to' in en_lower:
        if 'tomorrow' not in en_lower and 'next' not in en_lower:
            return f"Tomorrow, {en.lower()}"

    # Questions - add context
    if en.startswith('Where'):
        if 'live' in en_lower:
            return "I don't know this city well. Where do you live?"
        else:
            return f"Excuse me, {en.lower()}"

    # Possessives
    if any(poss in en_lower for poss in ['my ', 'your ', 'his ', 'her ']):
        if 'house' in en_lower:
            return f"Let me show you {en.lower()}"
        elif 'book' in en_lower or 'car' in en_lower:
            return f"This is {en.lower()}"

    # If no specific pattern, return as-is
    return en

def contextualize_b1_b2(en, unit_name, phase):
    """Add full natural context to B1/B2 (advanced)."""
    en_lower = en.lower()

    # IMPERFECT - "used to"
    if 'used to' in en_lower:
        if 'live' in en_lower:
            return "When I was younger, I used to live in the countryside."
        elif 'eat' in en_lower:
            return "As a child, I used to eat candy every day."
        elif 'be happy' in en_lower or 'be sad' in en_lower:
            return f"Things were different back then. {en}."
        elif 'have' in en_lower:
            return f"Life was easier before. {en}."
        elif 'come' in en_lower or 'go' in en_lower:
            return f"In the past, {en.lower()}"
        else:
            return f"Things have changed. {en}."

    # COMPARATIVES
    if ' than ' in en_lower or 'taller' in en_lower or 'shorter' in en_lower:
        if 'taller than' in en_lower:
            return "My brother plays basketball. He is taller than me."
        elif 'shorter than' in en_lower:
            return "I can't reach the shelf. I am shorter than you."
        elif 'more' in en_lower and 'than' in en_lower:
            return f"When we compare them, {en.lower()}"
        elif 'less' in en_lower and 'than' in en_lower:
            return f"Actually, {en.lower()}"
        elif 'as' in en_lower and 'as' in en_lower:
            return f"They're very similar. {en}."

    # SUPERLATIVES
    if 'tallest' in en_lower or 'shortest' in en_lower or 'best' in en_lower or 'worst' in en_lower:
        return f"In our group, {en.lower()}"

    # CONDITIONAL
    if 'would' in en_lower:
        if 'travel' in en_lower:
            return "If I had more money, I would travel more."
        elif 'buy' in en_lower:
            if 'house' in en_lower:
                return "That house is beautiful. I would buy it if I could."
            else:
                return f"I would love to, but I can't. {en}"
        elif 'help' in en_lower:
            return "I would help you, but I don't have time right now."
        elif 'study' in en_lower or 'work' in en_lower:
            return f"In an ideal world, {en.lower()}"

    # SUBJUNCTIVE - IF clauses
    if en.startswith('If '):
        if 'if i could' in en_lower:
            return "I would buy that house if I could."
        elif 'if i had' in en_lower:
            if 'money' in en_lower:
                return "If I had more money, I would quit my job."
            elif 'time' in en_lower:
                return "If I had more time, I would learn to play guitar."
            else:
                return f"{en}, I would have told you."
        elif 'if i were' in en_lower or 'if i was' in en_lower:
            if 'rich' in en_lower:
                return "If I were rich, I would travel the world."
            else:
                return f"{en}, I would do things differently."

    # SUBJUNCTIVE - WHEN clauses (future subjunctive)
    if 'when i' in en_lower:
        if 'arrive' in en_lower:
            return "When I arrive home, I will call you."
        elif 'finish' in en_lower:
            return "When I finish work, we can go out."

    # SUBJUNCTIVE - HOPE/WISH
    if 'hope' in en_lower:
        if 'arrives' in en_lower or 'arrive' in en_lower:
            return "He's always late. I hope he arrives on time."
        elif 'goes well' in en_lower:
            return "Good luck with your exam. I hope it goes well."
        else:
            return f"I'm worried, but {en.lower()}"

    # IMPERATIVE
    if en.endswith('!') or 'don\'t' in en_lower:
        if 'speak' in en_lower:
            if 'don\'t' in en_lower:
                return "The baby is sleeping. Don't speak so loudly, please."
            else:
                return "I can't hear you. Speak louder, please."
        elif 'come' in en_lower:
            return "The party is starting. Come here now!"
        elif 'go' in en_lower:
            return "It's late. Go home and rest."

    # SABER vs CONHECER
    if 'know' in en_lower:
        if 'how to' in en_lower:
            if 'swim' in en_lower:
                return "I learned when I was young. I know how to swim well."
            else:
                return f"It's easy. {en}."
        elif 'maria' in en_lower or 'joão' in en_lower or re.search(r'know [A-Z]', en):
            return f"Yes, {en.lower()}, we met at the party."

    # POR vs PARA
    if 'for' in en_lower:
        if 'study' in en_lower or 'work' in en_lower:
            return f"{en} - it's very important for my career."
        elif 'you' in en_lower:
            return f"I bought a gift. {en}."

    # DEMONSTRATIVES (advanced spatial)
    if 'that' in en_lower or 'this' in en_lower or 'those' in en_lower:
        if 'over there' in en_lower:
            return f"Do you see it? {en}."
        elif 'here' in en_lower:
            return f"Look right here. {en}."

    # If no specific pattern, return as-is
    return en

def add_comprehensive_context(input_file: str, output_file: str):
    """Add contextual prompts throughout."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    a1_kept = 0
    a2_enhanced = 0
    b1_b2_enhanced = 0

    for q in data['questions']:
        # Skip if not production
        if not (q.get('template') and q.get('chips')):
            continue

        phase = q.get('phase', 1)
        en = q.get('en', '')
        unit_name = q.get('unitName', '')

        original_en = en

        # A1: Keep simple (already appropriate for absolute beginners)
        if phase == 1:
            a1_kept += 1
            continue

        # A2: Add moderate context
        elif phase == 2:
            new_en = contextualize_a2(en, unit_name)
            if new_en != en:
                q['en'] = new_en
                a2_enhanced += 1
                # Remove scenario - context is in prompt now
                if 'scenario' in q:
                    del q['scenario']
            else:
                a2_enhanced += 0  # Count as not enhanced

        # B1/B2: Add full context
        elif phase >= 3:
            new_en = contextualize_b1_b2(en, unit_name, phase)
            if new_en != en:
                q['en'] = new_en
                b1_b2_enhanced += 1
                # Remove scenario - context is in prompt now
                if 'scenario' in q:
                    del q['scenario']

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.2-hybrid'
        data['metadata']['approach'] = 'Hybrid contextual: A1 simple, A2 moderate, B1/B2 full context'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  A1 kept simple: {a1_kept}")
    print(f"  A2 moderately enhanced: {a2_enhanced}")
    print(f"  B1/B2 fully contextualized: {b1_b2_enhanced}")

    # Count scenarios remaining
    with_scenario = sum(1 for q in data['questions'] if 'scenario' in q and q.get('scenario'))
    total_prod = sum(1 for q in data['questions'] if q.get('template') and q.get('chips'))
    print(f"\n  Scenarios remaining: {with_scenario}/{total_prod} ({(with_scenario/total_prod)*100:.1f}%)")
    print(f"  (Mostly A1, since context is now in prompts for A2/B1/B2)")

if __name__ == '__main__':
    add_comprehensive_context(
        'config/placement-test-questions-v10.1-fixed-hints.json',
        'config/placement-test-questions-v10.2-hybrid.json'
    )
