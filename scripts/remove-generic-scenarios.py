#!/usr/bin/env python3
"""
Remove generic "Complete the sentence in Portuguese" scenarios.
These are unhelpful placeholders - better to have no scenario than a generic one.
"""

import json

def remove_generic_scenarios(input_file: str, output_file: str):
    """Remove generic placeholder scenarios."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    # List of generic/unhelpful scenarios to remove
    generic_scenarios = [
        'Complete the sentence in Portuguese.',
        "You're trying to understand a Portuguese sentence.",
        "You're practicing Portuguese with a language partner.",
        "You're writing a message to a Portuguese-speaking friend.",
        "You're preparing for a conversation in Portuguese.",
        "You're reading a message from a Portuguese speaker.",
        "You're listening to someone speak Portuguese."
    ]

    removed_count = 0
    for q in data['questions']:
        if q.get('scenario') in generic_scenarios:
            del q['scenario']
            removed_count += 1

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '9.4-cleaned'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Removed {removed_count} generic scenarios")

    # Count remaining scenarios
    with_scenario = sum(1 for q in data['questions'] if 'scenario' in q and q.get('scenario'))
    print(f"  Questions with real scenarios: {with_scenario}/{len(data['questions'])} ({(with_scenario/len(data['questions']))*100:.1f}%)")

if __name__ == '__main__':
    remove_generic_scenarios(
        'config/placement-test-questions-v9.3-cleaned.json',
        'config/placement-test-questions-v9.4-cleaned.json'
    )
