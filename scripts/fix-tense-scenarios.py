#!/usr/bin/env python3
"""
Fix scenarios that suggest wrong tense.
Scenarios should match the tense being tested.
"""

import json

# Mapping of confusing scenarios to better ones
SCENARIO_FIXES = {
    "Sharing your studies with a friend asking what you're learning.":
        "Telling a friend about the subjects you take at school.",
}

def fix_tense_scenarios(input_file: str, output_file: str):
    """Fix scenarios that don't match the tense being tested."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    fixed = 0

    for q in data['questions']:
        scenario = q.get('scenario', '')

        # Check if this scenario needs fixing
        if scenario in SCENARIO_FIXES:
            old_scenario = scenario
            q['scenario'] = SCENARIO_FIXES[scenario]
            fixed += 1
            print(f"  Fixed: {q.get('en')}")
            print(f"    Old: {old_scenario}")
            print(f"    New: {q['scenario']}")

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.7-fixed-tense-scenarios'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Scenarios fixed: {fixed}")
    print(f"  Now scenarios match the tense being tested")

if __name__ == '__main__':
    fix_tense_scenarios(
        'config/placement-test-questions-v10.6-fixed-article-chips.json',
        'config/placement-test-questions-v10.7-fixed-tense-scenarios.json'
    )
