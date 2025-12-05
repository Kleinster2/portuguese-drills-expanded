#!/usr/bin/env python3
"""
1. Remove spoiler hints that give away the answer
2. Add blank/nothing option where appropriate
"""

import json

def fix_hints_and_add_blanks(input_file: str, output_file: str):
    """Fix hints and add blank options."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    hints_removed = 0
    blanks_added = 0

    for q in data['questions']:
        # Skip if not production
        if not (q.get('template') and q.get('chips')):
            continue

        # REMOVE SPOILER HINTS
        hint = q.get('hint', '')
        if hint:
            # Check if hint gives away the answer
            correct = q.get('correct', '')

            # Spoiler patterns
            if (correct in hint.lower() or
                f"takes '{correct}'" in hint.lower() or
                f"uses {correct}" in hint.lower() or
                f"needs {correct}" in hint.lower()):
                # This hint is a spoiler - remove it
                del q['hint']
                hints_removed += 1

        # ADD BLANK OPTION where it makes sense
        template = q.get('template', '')
        en = q.get('en', '')
        chips = q.get('chips', [])
        correct = q.get('correct', '')

        # Cases where blank/nothing might be needed:
        add_blank = False

        # Articles: "I am a doctor" = "Eu sou médico" (no article in PT)
        if 'a ' in en.lower() or 'an ' in en.lower():
            if 'sou' in template or 'é' in template:
                add_blank = True

        # Prepositions: sometimes English needs one, Portuguese doesn't
        if any(prep in chips for prep in ['de', 'para', 'por', 'em', 'com', 'a']):
            # This is a preposition question - blank is valid
            add_blank = True

        # Add blank if not already present
        if add_blank and '(blank)' not in chips and '(nothing)' not in chips and '' not in chips:
            chips.append('(blank)')
            q['chips'] = chips
            blanks_added += 1

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.1-fixed-hints'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Spoiler hints removed: {hints_removed}")
    print(f"  Blank options added: {blanks_added}")

if __name__ == '__main__':
    fix_hints_and_add_blanks(
        'config/placement-test-questions-v10.0-production-only.json',
        'config/placement-test-questions-v10.1-fixed-hints.json'
    )
