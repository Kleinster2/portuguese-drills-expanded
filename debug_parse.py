#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
import sys
from pathlib import Path

# Set UTF-8 encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

curriculum_path = Path(r"C:\Users\klein\cascadeprojects\portuguese-drills-expanded\docs\curriculum\syllabus-micro-sequence.md")
content = curriculum_path.read_text(encoding='utf-8')

print(f"Total file length: {len(content)} chars")
print(f"Line ending check: {repr(content[:500])[:100]}")

# Check what separates units
unit_14_pos = content.find("### Unit 14:")
unit_15_pos = content.find("### Unit 15:")
unit_16_pos = content.find("### Unit 16:")

print(f"\nUnit 14 starts at position: {unit_14_pos}")
print(f"Unit 15 starts at position: {unit_15_pos}")
print(f"Unit 16 starts at position: {unit_16_pos}")

print(f"\nBetween Unit 14 and 15: {unit_15_pos - unit_14_pos} chars")
print(f"Between Unit 15 and 16: {unit_16_pos - unit_15_pos} chars")

# Show what's between them
if unit_14_pos > 0 and unit_15_pos > 0:
    between = content[unit_14_pos:unit_15_pos]
    print(f"\nContent between Unit 14 and 15 (last 200 chars):")
    print(repr(between[-200:]))

# Test the regex
pattern = r'(### Unit \d+:.*?)(?=\n### Unit \d+:|$)'
units = re.findall(pattern, content, re.DOTALL)
print(f"\nRegex found {len(units)} units")

# Check unit 15 specifically
for unit_text in units:
    if unit_text.startswith("### Unit 15:"):
        print(f"\nUnit 15 length: {len(unit_text)} chars")
        print(f"First 200 chars: {unit_text[:200]}")
        print(f"Last 200 chars: {unit_text[-200:]}")
        break

# Check unit 44 specifically
for unit_text in units:
    if unit_text.startswith("### Unit 44:"):
        print(f"\nUnit 44 length: {len(unit_text)} chars")
        print(f"First 200 chars: {unit_text[:200]}")
        break
