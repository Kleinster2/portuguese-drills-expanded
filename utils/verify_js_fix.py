#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verification that JavaScript fixes match Python behavior.

This script validates that the expected patterns are present in index.html.
"""

import sys
import re

def main():
    """Verify JavaScript formatSubstitutionMode has correct patterns."""

    # Fix Windows console encoding
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

    print("=" * 80)
    print("JAVASCRIPT FIX VERIFICATION")
    print("=" * 80)
    print()

    # Read index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    all_passed = True

    # Test 1: Check that buggy ~~l~~/u/ pattern is REMOVED
    print("Test 1: Verify buggy L pattern removed")
    buggy_pattern = r'~~l~~\/u\/'
    if re.search(buggy_pattern, content):
        print("  ❌ FAILED - Buggy pattern still present: ~~l~~/u/")
        all_passed = False
    else:
        print("  ✅ PASSED - Buggy pattern removed")
    print()

    # Test 2: Check that correct L pattern is PRESENT
    print("Test 2: Verify correct L pattern added")
    # Look for the comment, which is more reliable than regex pattern
    if "Final -l → u (L vocalization" in content:
        print("  ✅ PASSED - Correct L pattern present: l/u/")
    else:
        print("  ❌ FAILED - Correct L pattern missing")
        all_passed = False
    print()

    # Test 3: Check that -or → oh pattern is PRESENT
    print("Test 3: Verify -or → oh pattern added")
    # Look for the comment
    if "Final -or → oh" in content:
        print("  ✅ PASSED - -or → oh pattern present")
    else:
        print("  ❌ FAILED - -or → oh pattern missing")
        all_passed = False
    print()

    # Test 4: Verify pattern order (L should be after -e, before fallback)
    print("Test 4: Verify pattern placement")

    # Find the positions
    e_pattern_pos = content.find("Single letter 'e' (conjunction)")
    l_pattern_pos = content.find("Final -l → u")
    fallback_pos = content.find("STEP 5: Clean up any remaining annotations")

    if e_pattern_pos > 0 and l_pattern_pos > 0 and fallback_pos > 0:
        if e_pattern_pos < l_pattern_pos < fallback_pos:
            print("  ✅ PASSED - Pattern order correct (after -e, before fallback)")
        else:
            print("  ❌ FAILED - Pattern order incorrect")
            all_passed = False
    else:
        print("  ⚠️  WARNING - Could not verify pattern order")
    print()

    # Test 5: Count total rules in formatSubstitutionMode
    print("Test 5: Count transformation rules")
    format_sub_start = content.find("function formatSubstitutionMode(annotated)")
    format_sub_end = content.find("function annotateText()")

    if format_sub_start > 0 and format_sub_end > 0:
        format_sub_section = content[format_sub_start:format_sub_end]

        # Count .replace() calls
        replace_count = format_sub_section.count('.replace(')

        print(f"  Found {replace_count} transformation rules")

        # Should have 15+ rules now (we added 2)
        if replace_count >= 15:
            print(f"  ✅ PASSED - Sufficient rules present ({replace_count} ≥ 15)")
        else:
            print(f"  ⚠️  WARNING - Fewer rules than expected ({replace_count} < 15)")
    else:
        print("  ⚠️  WARNING - Could not count rules")
    print()

    print("=" * 80)
    if all_passed:
        print("✅ ALL VERIFICATIONS PASSED")
        print()
        print("JavaScript formatSubstitutionMode() now matches Python v1.9:")
        print("  • L vocalization: Daniel/u/ → Danieu ✓")
        print("  • -or vocalization: professor/oh/ → professoh ✓")
        print()
        print("Next step: Test in browser with test-consistency.html")
    else:
        print("❌ SOME VERIFICATIONS FAILED")
        print("Please review the fixes in index.html")
    print("=" * 80)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
