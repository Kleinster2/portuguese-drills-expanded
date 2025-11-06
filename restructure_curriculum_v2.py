#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Curriculum Restructure Script V2
Cleaner approach: explicitly define where each old unit goes
"""

import re
import sys
from pathlib import Path

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def parse_units(content):
    """Parse curriculum into individual units."""
    pattern = r'(### Unit \d+:.*?)(?=\n### Unit \d+:|$)'
    units = re.findall(pattern, content, re.DOTALL)

    header_match = re.search(r'^(.*?)(?=### Unit 1:)', content, re.DOTALL)
    header = header_match.group(1) if header_match else ""

    parsed_units = []
    for unit_text in units:
        match = re.match(r'### Unit (\d+):', unit_text)
        if match:
            unit_num = int(match.group(1))
            parsed_units.append((unit_num, unit_text))

    return header, parsed_units

def build_new_sequence_map():
    """
    Build explicit mapping of new position → old unit number.
    This is clearer than trying to calculate shifts.
    """
    mapping = {}

    # Units 1-14: Stay same
    for i in range(1, 15):
        mapping[i] = i

    # Positions 15-17: Numbers (from old 44-46)
    mapping[15] = 44
    mapping[16] = 45
    mapping[17] = 46

    # Positions 18-29: Old units 15-26 (shifted down by 3)
    for new_pos in range(18, 30):
        old_num = new_pos - 3  # 18→15, 19→16, ..., 29→26
        mapping[new_pos] = old_num

    # Position 30: Progressive Tenses (from old 75)
    mapping[30] = 75

    # Positions 31-37: Old units 27-33 (possessives + past tense start)
    for new_pos in range(31, 38):
        old_num = new_pos - 4  # 31→27, 32→28, ..., 37→33
        mapping[new_pos] = old_num

    # Position 38: Question Words (from old 34)
    mapping[38] = 34

    # Positions 39-46: Old units 35-42
    for new_pos in range(39, 47):
        old_num = new_pos - 4  # 39→35, 40→36, ..., 46→42
        mapping[new_pos] = old_num

    # Position 47: Old unit 43
    mapping[47] = 43

    # Positions 48-60: Old units 47-59 (skip 44-46 which moved)
    for new_pos in range(48, 61):
        old_num = new_pos - 1  # 48→47, 49→48, ..., 60→59
        mapping[new_pos] = old_num

    # Positions 61-62: Old units 60-62
    mapping[61] = 60
    mapping[62] = 61
    mapping[63] = 62

    # SKIP old 63 (deleted)

    # Positions 64-72: Old units 64-73 (skip 63 which was deleted, skip 74 which will be deleted)
    new_pos = 64
    for old_num in range(64, 74):
        mapping[new_pos] = old_num
        new_pos += 1

    # SKIP old 74 (deleted)
    # SKIP old 75 (moved to position 30)

    # Positions 73-75: Old units 76-78
    mapping[73] = 76
    mapping[74] = 77
    mapping[75] = 78

    return mapping

def restructure_units(header, units):
    """Restructure using explicit mapping."""
    unit_dict = {num: content for num, content in units}

    # Get the mapping
    mapping = build_new_sequence_map()

    # Build new sequence in order
    new_sequence = []
    for new_pos in sorted(mapping.keys()):
        old_num = mapping[new_pos]
        if old_num in unit_dict:
            new_sequence.append(unit_dict[old_num])
        else:
            print(f"WARNING: Old unit {old_num} not found!")

    # Build old→new reverse mapping for cross-references
    old_to_new = {old_num: new_pos for new_pos, old_num in mapping.items()}

    return new_sequence, old_to_new

def renumber_unit_content(unit_content, new_number):
    """Update unit number in the content header."""
    updated = re.sub(
        r'### Unit \d+:',
        f'### Unit {new_number}:',
        unit_content,
        count=1
    )
    return updated

def update_cross_references(content, old_to_new_map):
    """Update all cross-references to unit numbers throughout the document."""
    def replace_unit_ref(match):
        prefix = match.group(1)
        num = int(match.group(2))
        if num in old_to_new_map:
            return f"{prefix}{old_to_new_map[num]}"
        return match.group(0)

    # Replace "Unit XX" references
    content = re.sub(r'(Unit )(\d+)', replace_unit_ref, content)

    return content

def main():
    curriculum_path = Path(r"C:\Users\klein\cascadeprojects\portuguese-drills-expanded\docs\curriculum\syllabus-micro-sequence.md")

    print("🔍 Reading curriculum file...")
    content = curriculum_path.read_text(encoding='utf-8')

    print("📋 Parsing units...")
    header, units = parse_units(content)
    print(f"   Found {len(units)} units")

    print("\n🔧 Restructuring units...")
    print("   ❌ Deleting Unit 63 (Question Words duplicate)")
    print("   ❌ Deleting Unit 74 (Por vs Para duplicate)")
    print("   ⬆️  Moving Units 44-46 (Numbers) → 15-17")
    print("   ⬆️  Moving Unit 75 (Progressive Tenses) → 30")
    print("   📊 Other units cascade naturally")

    new_sequence, old_to_new = restructure_units(header, units)

    print(f"\n✅ New sequence has {len(new_sequence)} units (down from 78)")

    print("\n🗺️  Key mappings:")
    for old_num in [15, 16, 17, 34, 44, 45, 46, 63, 74, 75]:
        if old_num in old_to_new:
            print(f"   Unit {old_num} → Unit {old_to_new[old_num]}")
        else:
            print(f"   Unit {old_num} → DELETED")

    print("\n📝 Renumbering all units...")
    rebuilt_content = header

    for new_num, unit_content in enumerate(new_sequence, start=1):
        renumbered_unit = renumber_unit_content(unit_content, new_num)
        rebuilt_content += renumbered_unit

    print("🔗 Updating cross-references throughout document...")
    rebuilt_content = update_cross_references(rebuilt_content, old_to_new)

    # Backup original
    backup_path = curriculum_path.with_suffix('.md.backup2')
    print(f"\n💾 Creating backup: {backup_path.name}")
    curriculum_path.rename(backup_path)

    # Write new version
    print(f"💾 Writing restructured curriculum...")
    curriculum_path.write_text(rebuilt_content, encoding='utf-8')

    print("\n" + "="*60)
    print("✅ RESTRUCTURE COMPLETE!")
    print("="*60)
    print(f"   Original: 78 units")
    print(f"   Final: {len(new_sequence)} units")
    print(f"\n   Key changes:")
    print(f"   • Numbers moved early (15-17) - HIGH FREQUENCY ✓")
    print(f"   • Progressive after Future (30) - COMMON IN BP ✓")
    print(f"   • Duplicates removed (63, 74) - CLEAN ✓")
    print(f"\n   Backup: {backup_path.name}")

if __name__ == "__main__":
    main()
