#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re
from pathlib import Path

def parse_units(content):
    """Parse curriculum into individual units."""
    # Split on unit headers
    pattern = r'(### Unit \d+:.*?)(?=\n### Unit \d+:|$)'
    units = re.findall(pattern, content, re.DOTALL)

    # Parse header section (before first unit)
    header_match = re.search(r'^(.*?)(?=### Unit 1:)', content, re.DOTALL)
    header = header_match.group(1) if header_match else ""

    # Extract unit numbers and content
    parsed_units = []
    for unit_text in units:
        match = re.match(r'### Unit (\d+):', unit_text)
        if match:
            unit_num = int(match.group(1))
            parsed_units.append((unit_num, unit_text))

    return header, parsed_units

curriculum_path = Path(r"C:\Users\klein\cascadeprojects\portuguese-drills-expanded\docs\curriculum\syllabus-micro-sequence.md")
content = curriculum_path.read_text(encoding='utf-8')

print("Parsing...")
header, units = parse_units(content)

print(f"Header length: {len(header)} chars")
print(f"Found {len(units)} units")
print("\nFirst 10 units:")
for i, (num, content) in enumerate(units[:10]):
    title_match = re.search(r'### Unit \d+: (.+)', content)
    title = title_match.group(1) if title_match else "???"
    print(f"  {i+1}. Unit {num}: {title}")

print("\nUnits around 44-46:")
for num, content in units:
    if 43 <= num <= 47:
        title_match = re.search(r'### Unit \d+: (.+)', content)
        title = title_match.group(1) if title_match else "???"
        print(f"  Unit {num}: {title}")

print("\nUnit 75:")
for num, content in units:
    if num == 75:
        title_match = re.search(r'### Unit \d+: (.+)', content)
        title = title_match.group(1) if title_match else "???"
        print(f"  Unit {num}: {title}")
        print(f"  Content length: {len(content)} chars")
        break
