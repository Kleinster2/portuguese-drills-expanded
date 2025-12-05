#!/usr/bin/env python3
"""
Remove all hints from placement test questions.
Students should figure out the answers without hints.
"""

import json

def remove_all_hints(input_file: str, output_file: str):
    """Remove all hints from questions."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} questions")

    removed = 0

    for q in data['questions']:
        if 'hint' in q:
            hint = q['hint']
            del q['hint']
            removed += 1
            print(f"  Removed hint from: {q.get('en', 'N/A')}")
            print(f"    Was: {hint}")

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.9-no-hints'

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Total hints removed: {removed}")

if __name__ == '__main__':
    remove_all_hints(
        'config/placement-test-questions-v10.8-removed-basic-scenarios.json',
        'config/placement-test-questions-v10.9-no-hints.json'
    )
