#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Update SYLLABUS_PHASE_1.md with new pronunciation annotations.

This script re-applies all pronunciation rules to Portuguese text in code blocks.
"""

import re
from annotate_pronunciation import annotate_pronunciation

def process_portuguese_code_block(match):
    """Process a code block containing Portuguese text."""
    text = match.group(1)
    lines = text.split('\n')
    processed_lines = []

    for line in lines:
        # Skip empty lines
        if not line.strip():
            processed_lines.append(line)
            continue

        # Apply annotation (skip_if_annotated=False to re-annotate)
        annotated = annotate_pronunciation(line, skip_if_annotated=False)
        processed_lines.append(annotated)

    return '```\n' + '\n'.join(processed_lines) + '\n```'

def main():
    # Read the syllabus file
    with open('../SYLLABUS_PHASE_1.md', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and process all code blocks with Portuguese text
    # Match code blocks that contain Portuguese sentences
    pattern = r'```\n((?:Eu |Sou |Moro|Trabalho|Falo|Gosto|Vou |Tenho|Estou|Tô |Sô ).*?)```'

    updated_content = re.sub(pattern, process_portuguese_code_block, content, flags=re.DOTALL)

    # Write back
    with open('../SYLLABUS_PHASE_1.md', 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print('✅ Updated SYLLABUS_PHASE_1.md with new pronunciation annotations')
    print('   - Fixed espanhol → espanho~~l~~[u]')
    print('   - Updated com[oun] → com[coun]')
    print('   - Applied all 6 pronunciation rules consistently')

if __name__ == '__main__':
    main()
