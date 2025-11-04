#!/usr/bin/env python3
"""
Restructure Portuguese curriculum file:
1. Delete Units 63 and 74 (duplicates)
2. Move Units 44-46 (Numbers) to positions 15-17
3. Move Unit 75 (Progressive) to position 30
4. Renumber all units sequentially
5. Update cross-references
"""

import re
from pathlib import Path

def read_file(filepath):
    """Read file content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def get_unit_boundaries(content):
    """Get line numbers for all unit boundaries."""
    boundaries = {}
    lines = content.split('\n')

    for i, line in enumerate(lines):
        match = re.match(r'^### Unit (\d+):', line)
        if match:
            unit_num = int(match.group(1))
            boundaries[unit_num] = i

    return boundaries

def extract_units_as_dict(content):
    """Extract all units as a dictionary."""
    units = {}
    boundaries = get_unit_boundaries(content)
    lines = content.split('\n')

    unit_nums = sorted(boundaries.keys())

    for i, unit_num in enumerate(unit_nums):
        start_line = boundaries[unit_num]

        # Find end line (start of next unit or end of file)
        if i + 1 < len(unit_nums):
            end_line = boundaries[unit_nums[i + 1]]
        else:
            end_line = len(lines)

        unit_content = '\n'.join(lines[start_line:end_line])
        units[unit_num] = unit_content

    return units

def build_new_sequence(units):
    """Build the new sequence according to the mapping."""
    # Mapping: new_position -> old_unit_number
    mapping = {}

    # NEW 1-14: OLD 1-14 (unchanged)
    for i in range(1, 15):
        mapping[i] = i

    # NEW 15-17: OLD 44-46 (Numbers moved here)
    mapping[15] = 44
    mapping[16] = 45
    mapping[17] = 46

    # NEW 18-29: OLD 15-26 (shifted down by 3)
    for i in range(18, 30):
        mapping[i] = i - 3  # 18->15, 19->16, ..., 29->26

    # NEW 30: OLD 75 (Progressive Tenses moved here)
    mapping[30] = 75

    # NEW 31-37: OLD 27-33 (shifted down by 4)
    for i in range(31, 38):
        mapping[i] = i - 4  # 31->27, 32->28, ..., 37->33

    # NEW 38: OLD 34 (Question Words, shifted down by 4)
    mapping[38] = 34

    # NEW 39-46: OLD 35-42 (shifted down by 4)
    for i in range(39, 47):
        mapping[i] = i - 4  # 39->35, 40->36, ..., 46->42

    # NEW 47: OLD 43 (shifted down by 4)
    mapping[47] = 43

    # NEW 48-63: OLD 47-62 (shifted up by 1, since 44-46 removed)
    for i in range(48, 64):
        mapping[i] = i - 1  # 48->47, 49->48, ..., 63->62

    # SKIP OLD 63 - DELETED

    # NEW 64-72: OLD 64-73 (shifted down)
    for i in range(64, 73):
        mapping[i] = i  # 64->64, 65->65, ..., 72->72

    # SKIP OLD 74 - DELETED
    # OLD 75 moved to position 30 (already handled)

    # NEW 73-75: OLD 76-78 (shifted down)
    mapping[73] = 76
    mapping[74] = 77
    mapping[75] = 78

    return mapping

def renumber_unit_header(unit_content, new_num):
    """Renumber the unit header."""
    return re.sub(r'^### Unit \d+:', f'### Unit {new_num}:', unit_content, count=1, flags=re.MULTILINE)

def update_cross_references(content, mapping):
    """Update all cross-references to units."""
    # Create reverse mapping (old -> new)
    reverse_mapping = {v: k for k, v in mapping.items()}

    # Find all references to "Unit XX" in the content
    def replace_reference(match):
        old_unit = int(match.group(1))
        if old_unit in reverse_mapping:
            new_unit = reverse_mapping[old_unit]
            return f'Unit {new_unit}'
        elif old_unit == 63 or old_unit == 74:
            # These units were deleted - keep reference as-is
            return match.group(0)
        else:
            return match.group(0)

    # Replace "Unit XX" references
    content = re.sub(r'Unit (\d+)', replace_reference, content)

    return content

def restructure_curriculum(input_file):
    """Main restructuring function."""
    print(f"Reading {input_file}...")
    content = read_file(input_file)

    # Extract header (everything before Unit 1)
    lines = content.split('\n')
    boundaries = get_unit_boundaries(content)
    header_end = boundaries[1]
    header = '\n'.join(lines[:header_end])

    print("Extracting units...")
    units = extract_units_as_dict(content)

    print(f"Total units found: {len(units)}")

    # Verify duplicates exist
    if 63 not in units:
        print("WARNING: Unit 63 not found!")
    else:
        print("Found Unit 63 (Question Words - to be deleted)")

    if 74 not in units:
        print("WARNING: Unit 74 not found!")
    else:
        print("Found Unit 74 (Por vs Para - to be deleted)")

    # Build new sequence
    print("Building new sequence...")
    mapping = build_new_sequence(units)

    # Create new content
    new_units = []
    for new_num in sorted(mapping.keys()):
        old_num = mapping[new_num]
        if old_num not in units:
            print(f"ERROR: Old unit {old_num} not found in extracted units!")
            continue

        unit_content = units[old_num]
        # Renumber the header
        unit_content = renumber_unit_header(unit_content, new_num)
        new_units.append(unit_content)

    # Combine header and new units
    new_content = header + '\n' + '\n'.join(new_units)

    # Update cross-references
    print("Updating cross-references...")
    new_content = update_cross_references(new_content, mapping)

    # Write output
    output_file = input_file
    print(f"Writing to {output_file}...")
    write_file(output_file, new_content)

    print("\nRestructuring complete!")
    print(f"Total units before: 78")
    print(f"Total units after: {len(mapping)}")
    print(f"Units deleted: 63 (Question Words duplicate), 74 (Por vs Para duplicate)")
    print(f"Numbers (44-46) moved to positions 15-17")
    print(f"Progressive (75) moved to position 30")

    return mapping

if __name__ == "__main__":
    input_file = r"C:\Users\klein\cascadeprojects\portuguese-drills-expanded\docs\curriculum\syllabus-micro-sequence.md"
    mapping = restructure_curriculum(input_file)

    print("\n=== KEY MOVES ===")
    print("Numbers (0-20): Old Unit 44 -> New Unit 15")
    print("Numbers (21-100): Old Unit 45 -> New Unit 16")
    print("Age: Old Unit 46 -> New Unit 17")
    print("Progressive Tenses: Old Unit 75 -> New Unit 30")
