#!/usr/bin/env python3
"""
Generate a granular breakdown of all placement test questions by topic.
"""

import json
from collections import defaultdict

def generate_breakdown(input_file: str, output_file: str):
    """Generate detailed test breakdown."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data['questions']
    print(f"Found {len(questions)} questions")

    # Group by phase, then by unitName
    phases = defaultdict(lambda: defaultdict(list))

    for q in questions:
        phase = q.get('phase', 0)
        unit = q.get('unitName', 'Unknown')
        phases[phase][unit].append(q)

    phase_names = {
        1: 'Foundation (A1)',
        2: 'Intermediate (A2)',
        3: 'Advanced (B1)',
        4: 'Proficient (B2)'
    }

    # Generate markdown
    output = []
    output.append("# Portuguese Placement Test - Detailed Breakdown")
    output.append(f"\n**Total Questions:** {len(questions)}")
    output.append(f"**Total Topics:** {len(set(q.get('unitName', 'Unknown') for q in questions))}")
    output.append("\n---\n")

    for phase_num in sorted(phases.keys()):
        phase_name = phase_names.get(phase_num, f"Phase {phase_num}")
        units = phases[phase_num]
        total_q = sum(len(qs) for qs in units.values())

        output.append(f"\n## {phase_name}")
        output.append(f"**Questions:** {total_q}")
        output.append(f"**Topics:** {len(units)}\n")

        for unit_name in sorted(units.keys()):
            unit_questions = units[unit_name]
            output.append(f"\n### {unit_name} ({len(unit_questions)} question{'s' if len(unit_questions) > 1 else ''})")
            output.append("")

            for i, q in enumerate(unit_questions, 1):
                q_type = q.get('type', 'unknown')

                # Handle multiStep questions differently
                if q_type == 'multiStep':
                    steps = q.get('steps', [])
                    scenario = q.get('scenario', '')

                    output.append(f"{i}. **Multi-Step Question** ({len(steps)} steps)")
                    if scenario:
                        output.append(f"   - Scenario: {scenario}")
                    for step_num, step in enumerate(steps, 1):
                        step_en = step.get('en', 'N/A')
                        step_template = step.get('template', 'N/A')
                        step_correct = step.get('correct', 'N/A')
                        output.append(f"   - Step {step_num}: {step_en}")
                        output.append(f"     - Template: `{step_template}`")
                        output.append(f"     - Answer: `{step_correct}`")
                    output.append("")
                else:
                    # Regular question
                    en = q.get('en', 'N/A')
                    template = q.get('template', 'N/A')
                    correct = q.get('correct', 'N/A')
                    scenario = q.get('scenario', '')

                    output.append(f"{i}. **{en}**")
                    output.append(f"   - Template: `{template}`")
                    output.append(f"   - Answer: `{correct}`")
                    if scenario:
                        output.append(f"   - Scenario: {scenario}")
                    output.append("")

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))

    print(f"\nComplete!")
    print(f"  Generated detailed breakdown with {len(questions)} questions")

if __name__ == '__main__':
    generate_breakdown(
        'config/placement-test-questions-v10.9-no-hints.json',
        'docs/placement-test-breakdown.md'
    )
