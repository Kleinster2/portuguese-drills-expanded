#!/usr/bin/env python3
"""
Restructure Portuguese curriculum file - FIXED VERSION
"""

import re

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_units_as_dict(content):
    """Extract all units as a dictionary."""
    units = {}
    lines = content.split('\n')
    
    # Find all unit start lines
    unit_starts = []
    for i, line in enumerate(lines):
        match = re.match(r'^### Unit (\d+):', line)
        if match:
            unit_num = int(match.group(1))
            unit_starts.append((unit_num, i))
    
    # Extract each unit
    for idx, (unit_num, start_line) in enumerate(unit_starts):
        # Find end line
        if idx + 1 < len(unit_starts):
            end_line = unit_starts[idx + 1][1]
        else:
            end_line = len(lines)
        
        unit_content = '\n'.join(lines[start_line:end_line])
        units[unit_num] = unit_content
    
    # Extract header (before first unit)
    if unit_starts:
        header = '\n'.join(lines[:unit_starts[0][1]])
    else:
        header = ''
    
    return header, units

def build_new_sequence():
    """Build the new sequence mapping."""
    mapping = {}
    
    # Units 1-14: unchanged
    for i in range(1, 15):
        mapping[i] = i
    
    # Units 15-17: Numbers (old 44-46)
    mapping[15] = 44
    mapping[16] = 45
    mapping[17] = 46
    
    # Units 18-29: old 15-26 (shifted by +3)
    for new_num in range(18, 30):
        old_num = new_num - 3
        mapping[new_num] = old_num
    
    # Unit 30: Progressive (old 75)
    mapping[30] = 75
    
    # Units 31-37: old 27-33 (shifted by +4)
    for new_num in range(31, 38):
        old_num = new_num - 4
        mapping[new_num] = old_num
    
    # Unit 38: old 34 (Question Words)
    mapping[38] = 34
    
    # Units 39-46: old 35-42 (shifted by +4)
    for new_num in range(39, 47):
        old_num = new_num - 4
        mapping[new_num] = old_num
    
    # Unit 47: old 43
    mapping[47] = 43
    
    # Units 48-63: old 47-62 (shifted by +1)
    for new_num in range(48, 64):
        old_num = new_num - 1
        mapping[new_num] = old_num
    
    # Units 64-72: old 64-73 (unchanged)
    for new_num in range(64, 73):
        mapping[new_num] = new_num
    
    # Units 73-75: old 76-78 (shifted by +3)
    mapping[73] = 76
    mapping[74] = 77
    mapping[75] = 78
    
    return mapping

def renumber_unit_header(unit_content, new_num):
    """Renumber the unit header."""
    return re.sub(r'^### Unit \d+:', f'### Unit {new_num}:', unit_content, count=1, flags=re.MULTILINE)

def update_cross_references(content, reverse_mapping):
    """Update all cross-references to units."""
    def replace_reference(match):
        old_unit = int(match.group(1))
        if old_unit in reverse_mapping:
            new_unit = reverse_mapping[old_unit]
            return f'Unit {new_unit}'
        return match.group(0)
    
    content = re.sub(r'Unit (\d+)(?!:)', replace_reference, content)
    return content

def main():
    input_file = r"C:\Users\klein\cascadeprojects\portuguese-drills-expanded\docs\curriculum\syllabus-micro-sequence.md"
    
    print("Reading file...")
    content = read_file(input_file)
    
    print("Extracting units...")
    header, units = extract_units_as_dict(content)
    print(f"Found {len(units)} units")
    
    print("\nVerifying duplicates...")
    if 63 in units:
        print("  Unit 63 (Question Words) - WILL BE DELETED")
    if 74 in units:
        print("  Unit 74 (Por vs Para) - WILL BE DELETED")
    
    print("\nBuilding new sequence...")
    mapping = build_new_sequence()
    
    # Create reverse mapping for cross-references
    reverse_mapping = {v: k for k, v in mapping.items()}
    
    print(f"New sequence has {len(mapping)} units")
    
    print("\nKey changes:")
    print(f"  Numbers 0-20: Old Unit 44 -> New Unit 15")
    print(f"  Numbers 21-100: Old Unit 45 -> New Unit 16")
    print(f"  Age: Old Unit 46 -> New Unit 17")
    print(f"  Progressive: Old Unit 75 -> New Unit 30")
    print(f"  Deleted: Old Units 63, 74")
    
    print("\nRebuilding file...")
    new_units = []
    for new_num in sorted(mapping.keys()):
        old_num = mapping[new_num]
        if old_num not in units:
            print(f"  ERROR: Old unit {old_num} not found!")
            continue
        
        unit_content = units[old_num]
        unit_content = renumber_unit_header(unit_content, new_num)
        new_units.append(unit_content)
    
    # Combine
    new_content = header + '\n'.join(new_units)
    
    print("Updating cross-references...")
    new_content = update_cross_references(new_content, reverse_mapping)
    
    print(f"Writing to {input_file}...")
    write_file(input_file, new_content)
    
    print("\n=== COMPLETE ===")
    print(f"Total units: 78 -> {len(mapping)}")
    
    return True

if __name__ == "__main__":
    main()
