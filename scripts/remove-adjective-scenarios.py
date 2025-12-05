#!/usr/bin/env python3
"""
Remove scenarios from basic adjective agreement questions.
These are simple grammar drills - no scenario needed.
"""

import json

def remove_adjective_scenarios(input_file: str, output_file: str):
    """Remove scenarios from adjective agreement questions."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    removed = 0

    for q in data['questions']:
        unit_name = q.get('unitName', '').lower()
        en = q.get('en', '').lower()
        scenario = q.get('scenario', '')

        # Remove scenarios from adjective agreement questions
        if 'adjective' in unit_name or 'agreement' in unit_name:
            if 'scenario' in q:
                del q['scenario']
                removed += 1
                continue

        # Remove scenarios about physical characteristics
        physical_traits = ['tall', 'short', 'big', 'small', 'thin', 'fat', 'beautiful', 'ugly', 'young', 'old']

        if any(trait in en for trait in physical_traits):
            if 'scenario' in q and any(word in scenario.lower() for word in ['describing', 'artist', 'physical', 'characteristics', 'appearance']):
                del q['scenario']
                removed += 1

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.4-no-adjective-scenarios'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Adjective scenarios removed: {removed}")
    print(f"  These are simple grammar drills - no scenario needed")

    # Count remaining scenarios
    with_scenario = sum(1 for q in data['questions'] if 'scenario' in q and q.get('scenario'))
    total_prod = sum(1 for q in data['questions'] if q.get('template') and q.get('chips'))
    print(f"\n  Scenarios remaining: {with_scenario}/{total_prod} ({(with_scenario/total_prod)*100:.1f}%)")

if __name__ == '__main__':
    remove_adjective_scenarios(
        'config/placement-test-questions-v10.3-clear-contractions.json',
        'config/placement-test-questions-v10.4-no-adjective-scenarios.json'
    )
