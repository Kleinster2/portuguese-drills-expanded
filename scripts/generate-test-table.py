#!/usr/bin/env python3
"""
Generate a table view of all placement test questions.
"""

import json

def generate_table(input_file: str, output_file: str):
    """Generate table of all questions."""
    print(f"Loading {input_file}...")

    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    questions = data['questions']
    print(f"Found {len(questions)} questions")

    phase_names = {
        1: 'A1',
        2: 'A2',
        3: 'B1',
        4: 'B2'
    }

    # Generate markdown table
    output = []
    output.append("# Portuguese Placement Test - Question Table")
    output.append(f"\n**Total Questions:** {len(questions)}\n")
    output.append("---\n")
    output.append("| # | Level | Topic | Question | Template | Answer |")
    output.append("|---|-------|-------|----------|----------|--------|")

    for i, q in enumerate(questions, 1):
        q_type = q.get('type', 'unknown')
        phase = phase_names.get(q.get('phase', 0), '?')
        topic = q.get('unitName', 'Unknown')

        if q_type == 'multiStep':
            # Multi-step question
            steps = q.get('steps', [])
            for step_num, step in enumerate(steps, 1):
                step_en = step.get('en', 'N/A')
                step_template = step.get('template', 'N/A')
                step_correct = step.get('correct', 'N/A')

                # Escape pipes in content
                step_en = step_en.replace('|', '\\|')
                step_template = step_template.replace('|', '\\|')
                step_correct = step_correct.replace('|', '\\|')

                output.append(f"| {i}.{step_num} | {phase} | {topic} | {step_en} | `{step_template}` | `{step_correct}` |")
        else:
            # Regular question
            en = q.get('en', 'N/A')
            template = q.get('template', 'N/A')
            correct = q.get('correct', 'N/A')

            # Escape pipes in content
            en = en.replace('|', '\\|')
            template = template.replace('|', '\\|')
            correct = correct.replace('|', '\\|')

            output.append(f"| {i} | {phase} | {topic} | {en} | `{template}` | `{correct}` |")

    # Save
    print(f"\nSaving to {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(output))

    print(f"\nComplete!")
    print(f"  Generated table with {len(questions)} questions")

if __name__ == '__main__':
    generate_table(
        'config/placement-test-questions-v10.9-no-hints.json',
        'docs/placement-test-table.md'
    )
