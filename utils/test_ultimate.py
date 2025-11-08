#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ultimate stress test - Maximum complexity paragraph.
"""

import sys
from annotate_pronunciation import annotate_pronunciation

# Handle Windows Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    print("=" * 80)
    print("ULTIMATE COMPLEXITY TEST - MAXIMUM CHALLENGE")
    print("=" * 80)
    print()

    # Create an ultra-complex paragraph with EVERYTHING
    ultimate_paragraph = """
Os professores brasileiros e portugueses trabalham juntos no hospital central
de Lisboa. Eles falam português, espanhol, e inglês com todos os pacientes
que vêm de diferentes países. Alguns professores também são médicos muito bons,
altos e inteligentes, e usam o Facebook, WhatsApp, e iPad para comunicar com
os colegas americanos. Quando alguém está doente, eles vão de ônibus ou de metrô
para o trabalho, mas normalmente preferem carro. Tem bem cem professores no
hospital, e também tem muitos estudantes jovens que querem ser médicos. Eles
estudam português com livros difíceis e fazem exercícios todas as semanas.
Os nomes dos professores mais famosos são José, Francisco, e Miguel. Vocês
conhecem eles? Nós somos colegas deles desde sempre.
    """.strip()

    print("PARAGRAPH TO ANNOTATE:")
    print("-" * 80)
    print(ultimate_paragraph)
    print()
    print("=" * 80)
    print("ANNOTATED VERSION:")
    print("-" * 80)

    # Annotate the entire paragraph
    annotated = annotate_pronunciation(ultimate_paragraph, skip_if_annotated=False)
    print(annotated)
    print()

    print("=" * 80)
    print("STATISTICS:")
    print("-" * 80)

    # Calculate statistics
    original_length = len(ultimate_paragraph)
    annotated_length = len(annotated)
    annotations_added = annotated_length - original_length

    # Count different annotation types
    import re
    count_u = len(re.findall(r'\[_u_\]', annotated))
    count_i = len(re.findall(r'\[_i_\]', annotated))
    count_is = len(re.findall(r'\[_is_\]', annotated))
    count_us = len(re.findall(r'\[_us_\]', annotated))
    count_dji = len(re.findall(r'\[_dji_\]', annotated))
    count_tchi = len(re.findall(r'\[_tchi_\]', annotated))
    count_eyn = len(re.findall(r'\[_eyn_\]', annotated))
    count_coun = len(re.findall(r'\[_coun_\]', annotated))
    count_l = len(re.findall(r'~~l~~\[_u_\]', annotated))
    count_um = len(re.findall(r'\[_ũm_\]', annotated))
    count_awn = len(re.findall(r'\[_ãwn_\]', annotated))

    total_annotations = (count_u + count_i + count_is + count_us + count_dji +
                        count_tchi + count_eyn + count_coun + count_l + count_um + count_awn)

    print(f"Original length:    {original_length} characters")
    print(f"Annotated length:   {annotated_length} characters")
    print(f"Annotations added:  {annotations_added} characters ({annotations_added/original_length*100:.1f}%)")
    print(f"Total annotations:  {total_annotations}")
    print()
    print("Breakdown by rule:")
    print(f"  Rule 1 [_u_]:        {count_u} instances")
    print(f"  Rule 2 [_i_]:        {count_i} instances")
    print(f"  Rule 2 [_is_]:       {count_is} instances (PLURAL FIX!)")
    print(f"  Rule 2 [_us_]:       {count_us} instances (plural -os)")
    print(f"  Rule 3 [_dji_]:      {count_dji} instances")
    print(f"  Rule 3 [_tchi_]:     {count_tchi} instances")
    print(f"  Rule 5 [_eyn_]:      {count_eyn} instances")
    print(f"  Rule 5 [_coun_]:     {count_coun} instances")
    print(f"  Rule 5 [_ũm_]:       {count_um} instances")
    print(f"  Rule 5 [_ãwn_]:      {count_awn} instances")
    print(f"  Rule 6 ~~l~~[_u_]:   {count_l} instances")
    print()

    print("=" * 80)
    print("KEY CHALLENGES IN THIS PARAGRAPH:")
    print("-" * 80)
    print("✓ Multiple plural -es words: professores, portugueses, diferentes, pacientes")
    print("✓ Multiple L vocalizations: hospital, central, espanhol, português")
    print("✓ All nasal patterns: também, alguém, com, bem, cem, tem")
    print("✓ Borrowed words: Facebook, WhatsApp, iPad")
    print("✓ Stressed words: José, vocês, português")
    print("✓ Verb conjugations: trabalham, falam, vêm, usam, estudam, fazem")
    print("✓ Proper nouns: Lisboa, José, Francisco, Miguel")
    print("✓ Contractions: no, do, dos, para o")
    print("✓ Adjectives: brasileiros, portugueses, bons, altos, inteligentes, difíceis")
    print("✓ Complex word order and sentence structure")
    print()

    print("=" * 80)
    print("SPOT CHECKS:")
    print("-" * 80)

    # Verify key transformations
    checks = [
        ("professores", "professores[_is_]", "Plural -es"),
        ("portugueses", "portugueses[_is_]", "Plural -es"),
        ("hospital", "hospita~~l~~[_u_]", "L vocalization"),
        ("central", "centra~~l~~[_u_]", "L vocalization"),
        ("espanhol", "espanho~~l~~[_u_]", "L vocalization"),
        ("português", "português", "Stressed word (no annotation)"),
        ("também", "também[_eyn_]", "Long nasal word"),
        ("bem", "bem[_beyn_]", "Short nasal word"),
        ("com", "com[_coun_]", "Short nasal word"),
        ("Facebook", "Facebook[_i_]", "Borrowed word epenthesis"),
        ("WhatsApp", "WhatsApp", "Borrowed word (check if in dict)"),
        ("iPad", "iPad[_ji_]", "Epenthesis + palatalization"),
        ("José", "José", "Stressed proper noun"),
        ("vocês", "vocês", "Stressed word"),
        ("trabalham", "trabalham[_ãwn_]", "Verb -am ending"),
        ("diferentes", "diferentes[_is_]", "Plural -es adjective"),
        ("inteligentes", "inteligentes[_is_]", "Plural -es adjective"),
    ]

    for original, expected, description in checks:
        if expected in annotated:
            print(f"✓ {description:30} {original:15} → {expected}")
        else:
            # Try to find what it actually became
            import re
            pattern = re.escape(original) + r'[^\s,\.]*'
            match = re.search(pattern, annotated)
            actual = match.group(0) if match else "NOT FOUND"
            print(f"✗ {description:30} {original:15} → {actual} (expected: {expected})")

    print()
    print("=" * 80)
    print("✅ ULTIMATE TEST COMPLETE!")
    print("=" * 80)

if __name__ == '__main__':
    main()
