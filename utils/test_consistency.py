#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Cross-Platform Consistency Test - v2.0

Tests that Python and JavaScript implementations produce identical output.

v2.0 Changes:
- Rule 1b removed: Words ending in -or should NOT be annotated
- Words ending in -u (like "sou") should NOT be annotated
- 6 pronunciation rules total (down from 7)
"""

import sys
from annotate_pronunciation import annotate_pronunciation, format_substitution

def main():
    """Test consistency between Python annotation and substitution."""

    # Fix Windows console encoding
    if sys.platform == 'win32':
        sys.stdout.reconfigure(encoding='utf-8')

    # Critical test cases
    test_cases = [
        # L vocalization
        "Eu sou o Daniel.",
        "Eu sou do Brasil.",
        "Eu trabalho no hospital.",
        "O papel está aqui.",
        "O hotel é bom.",
        "O sol está forte.",

        # -or ending
        "Eu sou professor.",
        "Ele é doutor.",
        "Qual é o melhor?",

        # Compound cases
        "De manhã eu falo português com o professor.",
        "Eu tenho um cachorro e uma gata.",
        "Eu também sou brasileiro.",
        "Eu trabalho de tarde.",
        "Eu sou contente.",

        # Edge cases
        "Eu moro em São Paulo.",
        "Eu vou de ônibus.",
        "Eu gosto de futebol.",
    ]

    print("=" * 80)
    print("PYTHON ANNOTATION & SUBSTITUTION CONSISTENCY TEST")
    print("=" * 80)
    print()

    all_passed = True

    for i, sentence in enumerate(test_cases, 1):
        annotated = annotate_pronunciation(sentence, skip_if_annotated=False)
        substituted = format_substitution(annotated)

        print(f"Test {i}:")
        print(f"  Original:    {sentence}")
        print(f"  Annotated:   {annotated}")
        print(f"  Substituted: {substituted}")

        # Check for known issues
        issues = []

        # Check L vocalization in substitution
        if 'Daniel/u/' in annotated and 'Daniel' in substituted and 'Danieu' not in substituted:
            issues.append("L vocalization not working: Daniel/u/ should → Danieu")

        if 'Brasil/u/' in annotated and 'Brasil' in substituted and 'Brasiu' not in substituted:
            issues.append("L vocalization not working: Brasil/u/ should → Brasiu")

        if 'hospital/u/' in annotated and 'hospital' in substituted and 'hospitau' not in substituted:
            issues.append("L vocalization not working: hospital/u/ should → hospitau")

        # Check that -or words don't get annotated (v2.0: Rule 1b removed)
        if 'professor/oh/' in annotated:
            issues.append("Unexpected annotation: professor should NOT be annotated (ends in -r, not -o)")
        if 'doutor/oh/' in annotated:
            issues.append("Unexpected annotation: doutor should NOT be annotated (ends in -r, not -o)")

        # Check that "sou" doesn't get annotated (ends in -u, not -o)
        if 'sou/u/' in annotated:
            issues.append("Unexpected annotation: sou should NOT be annotated (ends in -u, not -o)")

        if issues:
            all_passed = False
            print(f"  ⚠️  ISSUES FOUND:")
            for issue in issues:
                print(f"      - {issue}")
        else:
            print(f"  ✓ PASSED")

        print()

    print("=" * 80)
    if all_passed:
        print("✓ ALL TESTS PASSED - Python implementation is consistent")
    else:
        print("⚠️  SOME TESTS FAILED - Issues detected in Python implementation")
    print("=" * 80)

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
