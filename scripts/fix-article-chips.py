#!/usr/bin/env python3
"""
Fix article question chips to avoid grammatically correct alternatives.
Definite article questions should ONLY have definite articles in chips.
Indefinite article questions should ONLY have indefinite articles in chips.
"""

import json

def fix_article_chips(input_file: str, output_file: str):
    """Fix article question chips."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    fixed = 0

    for q in data['questions']:
        unit_name = q.get('unitName', '')

        # Fix Definite Article questions
        if unit_name == 'Definite Articles':
            chips = q.get('chips', [])
            # Remove indefinite articles (Um, Uma, Uns, Umas)
            # Keep only definite articles (O, A, Os, As)
            new_chips = [c for c in chips if c not in ['Um', 'Uma', 'Uns', 'Umas', 'um', 'uma', 'uns', 'umas']]

            if new_chips != chips:
                q['chips'] = new_chips
                fixed += 1
                print(f"  Fixed definite article question: {q.get('en')}")
                print(f"    Removed: {set(chips) - set(new_chips)}")

        # Fix Indefinite Article questions
        elif unit_name == 'Indefinite Articles':
            chips = q.get('chips', [])
            # Remove definite articles (o, a, os, as, O, A, Os, As)
            # Keep indefinite articles (um, uma, uns, umas) and (blank)
            new_chips = [c for c in chips if c not in ['o', 'a', 'os', 'as', 'O', 'A', 'Os', 'As']]

            if new_chips != chips:
                q['chips'] = new_chips
                fixed += 1
                print(f"  Fixed indefinite article question: {q.get('en')}")
                print(f"    Removed: {set(chips) - set(new_chips)}")

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.6-fixed-article-chips'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Article questions fixed: {fixed}")
    print(f"  Now definite/indefinite are separated in chips")

if __name__ == '__main__':
    fix_article_chips(
        'config/placement-test-questions-v10.5-clear-gender-markers.json',
        'config/placement-test-questions-v10.6-fixed-article-chips.json'
    )
