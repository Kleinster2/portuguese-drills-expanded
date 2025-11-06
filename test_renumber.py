#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import re

def renumber_unit_content(unit_content, new_number):
    """Update unit number in the content header."""
    updated = re.sub(
        r'### Unit \d+:',
        f'### Unit {new_number}:',
        unit_content,
        count=1
    )
    return updated

# Test with sample content
sample = """### Unit 44: Numbers 0-20 (Cardinal Numbers - Foundation)
**New vocabulary:**
- Numbers 0-20

This is unit 44 content.
It mentions Unit 44 in the text.
Also references Unit 43 and Unit 45.
"""

print("ORIGINAL:")
print(sample[:200])
print("\nAFTER RENUMBER TO 15:")
result = renumber_unit_content(sample, 15)
print(result[:200])

# Check if it actually changed
if "### Unit 15:" in result:
    print("\n✓ Renumbering WORKED")
else:
    print("\n✗ Renumbering FAILED")
    print(f"Still has: {sample.split('\\n')[0]}")
