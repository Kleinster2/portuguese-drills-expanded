#!/usr/bin/env python3
"""
Remove overly specific/contrived scenarios from basic A1 grammar drills.
These are simple drills that don't need scenarios.
"""

import json

# Scenarios that are overly specific, contrived, or useless
SCENARIOS_TO_REMOVE = [
    "You're introducing yourself at a medical conference.",
    "You meet someone new at a café and they ask about you.",
    "You're referring to the particular one you mentioned earlier.",
    "You're talking about any one, not a specific one.",
    "You're telling a friend what you need to buy.",
    "You're making a shopping list for groceries.",
]

def remove_basic_grammar_scenarios(input_file: str, output_file: str):
    """Remove overly specific scenarios from basic grammar drills."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    removed = 0

    for q in data['questions']:
        scenario = q.get('scenario', '')

        # Remove scenarios that are overly specific or contrived
        if scenario in SCENARIOS_TO_REMOVE:
            en = q.get('en', '')
            unit = q.get('unitName', '')
            del q['scenario']
            removed += 1
            print(f"  Removed scenario from: {en}")
            print(f"    Unit: {unit}")
            print(f"    Was: {scenario}")

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.8-removed-basic-scenarios'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Scenarios removed: {removed}")
    print(f"  These are simple grammar drills - no scenario needed")

if __name__ == '__main__':
    remove_basic_grammar_scenarios(
        'config/placement-test-questions-v10.7-fixed-tense-scenarios.json',
        'config/placement-test-questions-v10.8-removed-basic-scenarios.json'
    )
