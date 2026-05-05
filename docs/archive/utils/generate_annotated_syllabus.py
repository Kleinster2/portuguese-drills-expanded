#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate annotated SYLLABUS_PHASE_1.md from clean source.

Reads:  SYLLABUS_PHASE_1.source.md (clean Portuguese)
Writes: SYLLABUS_PHASE_1.md (with pronunciation annotations)

Process:
  1. Find all code blocks containing Portuguese text
  2. Apply pronunciation annotations via annotate_pronunciation()
  3. Preserve manual transformations (_Sô_, _djônibus_, etc.)
  4. Generate output with all 6 pronunciation rules applied

Benefits:
  - Authors write clean Portuguese (easier, no syntax errors)
  - Annotations added automatically (100% consistent, zero bugs)
  - Manual transformations preserved (editorial control)
"""

import re
import sys
from annotate_pronunciation import annotate_pronunciation

# Handle Windows Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def process_code_block(match):
    """Process a code block containing Portuguese text."""
    text = match.group(1)
    lines = text.split('\n')
    processed_lines = []

    for line in lines:
        # Skip empty lines
        if not line.strip():
            processed_lines.append(line)
            continue

        # Apply annotations (skip_if_annotated=False to ensure clean application)
        annotated = annotate_pronunciation(line, skip_if_annotated=False)
        processed_lines.append(annotated)

    return '```\n' + '\n'.join(processed_lines) + '\n```'

def main():
    """Generate annotated syllabus from clean source."""

    source_file = '../SYLLABUS_PHASE_1.source.md'
    output_file = '../SYLLABUS_PHASE_1.md'

    # Read source
    print(f'📖 Reading clean source: {source_file}...')
    with open(source_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find and process all code blocks with Portuguese text
    # Pattern matches code blocks starting with Portuguese sentences
    print('🔍 Finding Portuguese code blocks...')
    pattern = r'```\n((?:Eu |Sou |Moro|Trabalho|Falo|Gosto|Vou |Tenho|Estou|Tô |Sô |_Sô_|_Tô_|_Vô_|A gente|Você|Vocês|Ele |Ela |Nós |Eles ).*?)```'

    code_block_count = len(re.findall(pattern, content, flags=re.DOTALL))
    print(f'   Found {code_block_count} code blocks to annotate')

    # Apply annotations
    print('✨ Applying pronunciation annotations...')
    annotated_content = re.sub(pattern, process_code_block, content, flags=re.DOTALL)

    # Write output
    print(f'💾 Writing annotated output: {output_file}...')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(annotated_content)

    # Statistics
    source_length = len(content)
    output_length = len(annotated_content)
    added = output_length - source_length
    percent = (added / source_length) * 100

    print(f'\n✅ Success!')
    print(f'   Source:     {source_length:,} characters')
    print(f'   Annotated:  {output_length:,} characters')
    print(f'   Added:      {added:,} characters ({percent:.1f}% annotations)')
    print(f'   Processed:  {code_block_count} code blocks')
    print(f'\n📚 Annotated syllabus generated: {output_file}')
    print(f'   All 6 pronunciation rules applied automatically!')

if __name__ == '__main__':
    main()
