#!/usr/bin/env python3
"""
Create production-only comprehensive assessment.
Remove all comprehension questions (PT→EN recognition).
Keep only production questions (EN→PT with chips).
"""

import json

def create_production_only(input_file: str, output_file: str):
    """Filter to production questions only."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data['questions'])} total questions")

    # Filter to production only (has template + chips OR is multiStep)
    production_questions = [
        q for q in data['questions']
        if (q.get('template') and q.get('chips')) or q.get('type') == 'multiStep'
    ]

    print(f"\nFiltered to {len(production_questions)} production questions")

    # Count by phase
    by_phase = {}
    for q in production_questions:
        phase = q.get('phase', 0)
        by_phase[phase] = by_phase.get(phase, 0) + 1

    print("\nQuestions per phase:")
    for phase in sorted(by_phase.keys()):
        print(f"  Phase {phase}: {by_phase[phase]} questions")

    # Update data
    data['questions'] = production_questions

    # Update metadata
    if 'metadata' in data:
        data['metadata']['version'] = '10.0-production-only'
        data['metadata']['description'] = 'Production-only comprehensive assessment - tests actual Portuguese production ability'
        data['metadata']['totalQuestions'] = len(production_questions)
        data['metadata']['questionTypes'] = 'Production (EN→PT with chips) and Multi-step only'

    # Update phase question ranges
    if 'phases' in data:
        current_q = 0
        for phase_info in data['phases']:
            phase_num = phase_info['num']
            phase_count = by_phase.get(phase_num, 0)

            if phase_count > 0:
                phase_info['questionRange'] = [current_q + 1, current_q + phase_count]
                current_q += phase_count
            else:
                # Phase has no questions
                phase_info['questionRange'] = [0, 0]

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"\nComplete!")
    print(f"  Total questions: {len(production_questions)}")
    print(f"  All questions test production ability")

    # Count scenarios
    with_scenario = sum(1 for q in production_questions if 'scenario' in q and q.get('scenario'))
    print(f"  Questions with scenarios: {with_scenario}/{len(production_questions)} ({(with_scenario/len(production_questions))*100:.1f}%)")

if __name__ == '__main__':
    create_production_only(
        'config/placement-test-questions-v9.5-realistic.json',
        'config/placement-test-questions-v10.0-production-only.json'
    )
