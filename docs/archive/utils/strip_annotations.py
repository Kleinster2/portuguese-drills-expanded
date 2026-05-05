#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Strip pronunciation annotations from SYLLABUS_PHASE_1.md to create clean source.

Removes:
  - Bracket annotations: [_u_], [_dji_], [_tchi_], [_eyn_], etc.
  - Strikethrough markers: ~~l~~ → l

Preserves:
  - Italic transformations: _Sô_, _Tô_, _djônibus_, _viajá_ (manual edits)
  - All markdown structure
  - All prose text

Output: SYLLABUS_PHASE_1.source.md (clean Portuguese for authoring)
"""

import re
import sys

# Handle Windows Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def strip_annotations(text: str) -> str:
    """Remove pronunciation annotations while preserving manual transformations."""

    # 1. Remove bracket annotations: [_u_], [_dji_], etc.
    # Pattern: [_any text_]
    text = re.sub(r'\[_[^]]+_\]', '', text)

    # 2. Remove strikethrough markers: ~~text~~ → text
    # Pattern: ~~captured~~ → captured
    text = re.sub(r'~~([^~]+)~~', r'\1', text)

    return text

def main():
    """Strip annotations from SYLLABUS_PHASE_1.md to create source file."""

    input_file = '../SYLLABUS_PHASE_1.md'
    output_file = '../SYLLABUS_PHASE_1.source.md'

    # Read input
    print(f'📖 Reading {input_file}...')
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strip annotations
    print('🧹 Stripping annotations...')
    clean_content = strip_annotations(content)

    # Write output
    print(f'💾 Writing {output_file}...')
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(clean_content)

    # Statistics
    original_length = len(content)
    clean_length = len(clean_content)
    removed = original_length - clean_length
    percent = (removed / original_length) * 100

    print(f'\n✅ Success!')
    print(f'   Original: {original_length:,} characters')
    print(f'   Clean:    {clean_length:,} characters')
    print(f'   Removed:  {removed:,} characters ({percent:.1f}% annotations)')
    print(f'\n📝 Clean source file created: {output_file}')
    print(f'   Authors can now edit clean Portuguese without annotation syntax!')

if __name__ == '__main__':
    main()
