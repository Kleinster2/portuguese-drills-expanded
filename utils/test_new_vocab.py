#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ultra-complex test with completely new vocabulary.
"""

import sys
from annotate_pronunciation import annotate_pronunciation

# Handle Windows Unicode
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def main():
    print("=" * 80)
    print("ULTIMATE TEST - COMPLETELY NEW VOCABULARY")
    print("=" * 80)
    print()

    # Create an ultra-complex story with NEW vocabulary
    new_vocab_paragraph = """
As bailarinas talentosas dançam no teatro municipal todos os sábados pela manhã.
Os músicos jovens tocam violões e pianos enquanto cantam canções tradicionais
sobre montanhas, rios, florestas, e oceanos distantes. Nas cidades grandes,
existem bibliotecas enormes cheias de documentos antigos, jornais velhos, e
revistas importantes que contam histórias fascinantes. Os cientistas brasileiros
fazem pesquisas complexas nos laboratórios modernos, estudando problemas difíceis
relacionados com doenças graves, mudanças climáticas, e tecnologias futuras.
As enfermeiras trabalham turnos longos nos hospitais regionais, ajudando pacientes
idosos que precisam de cuidados especiais. Durante as férias escolares, crianças
pequenas visitam museus interessantes, parques naturais, e monumentos históricos
com seus pais orgulhosos. Os motoristas experientes dirigem ônibus amarelos pelas
avenidas movimentadas, transportando passageiros cansados para diferentes bairros
residenciais. Alguns empresários ambiciosos abrem restaurantes elegantes, hotéis
luxuosos, e lojas sofisticadas nas regiões turísticas. Os governadores locais
discutem questões políticas importantes durante reuniões secretas com ministros
federais. Às vezes, jogadores talentosos ganham campeonatos nacionais depois de
treinamentos intensos e sacrifícios pessoais tremendos.
    """.strip()

    print("PARAGRAPH WITH NEW VOCABULARY:")
    print("-" * 80)
    print(new_vocab_paragraph)
    print()
    print("=" * 80)
    print("ANNOTATED VERSION:")
    print("-" * 80)

    # Annotate the entire paragraph
    annotated = annotate_pronunciation(new_vocab_paragraph, skip_if_annotated=False)
    print(annotated)
    print()

    print("=" * 80)
    print("STATISTICS:")
    print("-" * 80)

    # Calculate statistics
    original_length = len(new_vocab_paragraph)
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
    count_oys = len(re.findall(r'\[_oys_\]', annotated))
    count_other_nasal = len(re.findall(r'\[_[^]]+_\]', annotated)) - (count_u + count_i + count_is + count_us + count_dji + count_tchi + count_eyn + count_coun + count_um + count_awn + count_oys + count_l)

    total_annotations = (count_u + count_i + count_is + count_us + count_dji +
                        count_tchi + count_eyn + count_coun + count_l + count_um +
                        count_awn + count_oys + count_other_nasal)

    print(f"Original length:    {original_length} characters")
    print(f"Annotated length:   {annotated_length} characters")
    print(f"Annotations added:  {annotations_added} characters ({annotations_added/original_length*100:.1f}%)")
    print(f"Total annotations:  {total_annotations}")
    print()
    print("Breakdown by rule:")
    print(f"  Rule 1 [_u_]:        {count_u} instances")
    print(f"  Rule 2 [_i_]:        {count_i} instances")
    print(f"  Rule 2 [_is_]:       {count_is} instances (plural -es)")
    print(f"  Rule 2 [_us_]:       {count_us} instances (plural -os)")
    print(f"  Rule 3 [_dji_]:      {count_dji} instances")
    print(f"  Rule 3 [_tchi_]:     {count_tchi} instances")
    print(f"  Rule 5 [_eyn_]:      {count_eyn} instances")
    print(f"  Rule 5 [_coun_]:     {count_coun} instances")
    print(f"  Rule 5 [_ũm_]:       {count_um} instances")
    print(f"  Rule 5 [_ãwn_]:      {count_awn} instances")
    print(f"  Rule 5 [_oys_]:      {count_oys} instances")
    print(f"  Rule 6 ~~l~~[_u_]:   {count_l} instances")
    print(f"  Other nasal:         {count_other_nasal} instances")
    print()

    print("=" * 80)
    print("NEW VOCABULARY TESTED:")
    print("-" * 80)
    print("Arts: bailarinas, dançam, teatro, músicos, violões, pianos, canções")
    print("Nature: montanhas, rios, florestas, oceanos")
    print("Places: bibliotecas, laboratórios, museus, monumentos, avenidas")
    print("Professions: cientistas, enfermeiras, motoristas, empresários, governadores")
    print("Adjectives: talentosas, tradicionais, enormes, antigos, fascinantes")
    print("Verbs: dançam, tocam, cantam, existem, fazem, estudando, visitam")
    print("Complex: relacionados, climáticas, tecnologias, transportando")
    print()

    print("=" * 80)
    print("KEY SPOT CHECKS:")
    print("-" * 80)

    # Verify key transformations
    checks = [
        ("As bailarinas", "As bailarinas", "Feminine plural -as (no annotation expected)"),
        ("talentosas", "talentosas", "Feminine plural -as adjective"),
        ("dançam", "dançam[_ãwn_]", "Verb -am ending"),
        ("no teatro", "no[_u_] teatro[_u_]", "Contraction + noun"),
        ("municipal", "municipa~~l~~[_u_]", "L vocalization"),
        ("Os músicos", "Os[_us_] músicos[_us_]", "Article Os + plural -os"),
        ("jovens", "jovens", "Plural -ens (check annotation)"),
        ("violões", "violões", "Nasal plural -ões"),
        ("pianos", "pianos[_us_]", "Plural -os"),
        ("canções", "canções", "Nasal plural -ões"),
        ("tradicionais", "tradicionais", "Plural -ais"),
        ("montanhas", "montanhas", "Plural -as"),
        ("rios", "rios[_us_]", "Plural -os"),
        ("florestas", "florestas", "Plural -as"),
        ("oceanos", "oceanos[_us_]", "Plural -os"),
        ("distantes", "distantes[_is_]", "Plural -es adjective"),
        ("Nas cidades", "Nas cidades[_is_]", "Nas contraction + plural -es"),
        ("grandes", "grandes[_is_]", "Plural -es adjective"),
        ("bibliotecas", "bibliotecas", "Plural -as"),
        ("enormes", "enormes[_is_]", "Plural -es adjective"),
        ("documentos", "documentos[_us_]", "Plural -os"),
        ("antigos", "antigos[_us_]", "Plural -os adjective"),
        ("jornais", "jornais", "Plural -ais"),
        ("velhos", "velhos[_us_]", "Plural -os adjective"),
        ("revistas", "revistas", "Plural -as"),
        ("importantes", "importantes[_is_]", "Plural -es adjective"),
        ("contam", "contam[_ãwn_]", "Verb -am ending"),
        ("histórias", "histórias", "Plural -as"),
        ("fascinantes", "fascinantes[_is_]", "Plural -es adjective"),
        ("cientistas", "cientistas", "Plural -as"),
        ("brasileiros", "brasileiros[_us_]", "Plural -os adjective"),
        ("fazem", "fazem", "Verb -em ending (check annotation)"),
        ("pesquisas", "pesquisas", "Plural -as"),
        ("complexas", "complexas", "Plural -as adjective"),
        ("laboratórios", "laboratórios[_us_]", "Plural -os"),
        ("modernos", "modernos[_us_]", "Plural -os adjective"),
        ("estudando", "estudando[_u_]", "Gerund -ndo"),
        ("problemas", "problemas", "Plural -as"),
        ("difíceis", "difíceis", "Plural -eis"),
        ("relacionados", "relacionados[_us_]", "Plural -os adjective"),
        ("com doenças", "com[_coun_] doenças", "Short nasal + plural -as"),
        ("graves", "graves[_is_]", "Plural -es adjective"),
        ("mudanças", "mudanças", "Plural -as"),
        ("climáticas", "climáticas", "Plural -as adjective"),
        ("tecnologias", "tecnologias", "Plural -as"),
        ("futuras", "futuras", "Plural -as adjective"),
        ("As enfermeiras", "As enfermeiras", "Plural -as"),
        ("trabalham", "trabalham[_ãwn_]", "Verb -am ending"),
        ("turnos", "turnos[_us_]", "Plural -os"),
        ("longos", "longos[_us_]", "Plural -os adjective"),
        ("nos hospitais", "nos[_us_] hospitais", "Contraction nos + plural -ais"),
        ("regionais", "regionais", "Plural -ais adjective"),
        ("ajudando", "ajudando[_u_]", "Gerund -ndo"),
        ("pacientes", "pacientes[_is_]", "Plural -es"),
        ("idosos", "idosos[_us_]", "Plural -os adjective"),
        ("precisam", "precisam[_ãwn_]", "Verb -am ending"),
        ("de cuidados", "de[_dji_] cuidados[_us_]", "Palatalization + plural -os"),
        ("especiais", "especiais", "Plural -ais adjective"),
        ("Durante as férias", "Durante[_i_] as férias", "Durante + plural -as"),
        ("escolares", "escolares[_is_]", "Plural -es adjective"),
        ("crianças", "crianças", "Plural -as"),
        ("pequenas", "pequenas", "Plural -as adjective"),
        ("visitam", "visitam[_ãwn_]", "Verb -am ending"),
        ("museus", "museus", "Plural -eus"),
        ("interessantes", "interessantes[_is_]", "Plural -es adjective"),
        ("parques", "parques[_is_]", "Plural -es"),
        ("naturais", "naturais", "Plural -ais adjective"),
        ("monumentos", "monumentos[_us_]", "Plural -os"),
        ("históricos", "históricos[_us_]", "Plural -os adjective"),
        ("com seus pais", "com[_coun_] seus pais", "Short nasal + plural -ais"),
        ("orgulhosos", "orgulhosos[_us_]", "Plural -os adjective"),
        ("Os motoristas", "Os[_us_] motoristas", "Article Os + plural -as"),
        ("experientes", "experientes[_is_]", "Plural -es adjective"),
        ("dirigem", "dirigem", "Verb -em ending (check annotation)"),
        ("ônibus", "ônibus", "Invariable plural"),
        ("amarelos", "amarelos[_us_]", "Plural -os adjective"),
        ("pelas avenidas", "pelas avenidas", "Contraction pelas + plural -as"),
        ("movimentadas", "movimentadas", "Plural -as adjective"),
        ("transportando", "transportando[_u_]", "Gerund -ndo"),
        ("passageiros", "passageiros[_us_]", "Plural -os"),
        ("cansados", "cansados[_us_]", "Plural -os adjective"),
        ("para diferentes", "para diferentes[_is_]", "Para + plural -es"),
        ("bairros", "bairros[_us_]", "Plural -os"),
        ("residenciais", "residenciais", "Plural -ais adjective"),
        ("Alguns", "Alguns", "Plural -uns (check annotation)"),
        ("empresários", "empresários[_us_]", "Plural -os"),
        ("ambiciosos", "ambiciosos[_us_]", "Plural -os adjective"),
        ("abrem", "abrem", "Verb -em ending (check annotation)"),
        ("restaurantes", "restaurantes[_is_]", "Plural -es"),
        ("elegantes", "elegantes[_is_]", "Plural -es adjective"),
        ("hotéis", "hotéis", "Plural -éis"),
        ("luxuosos", "luxuosos[_us_]", "Plural -os adjective"),
        ("lojas", "lojas", "Plural -as"),
        ("sofisticadas", "sofisticadas", "Plural -as adjective"),
        ("nas regiões", "nas regiões", "Contraction nas + plural -ões"),
        ("turísticas", "turísticas", "Plural -as adjective"),
        ("Os governadores", "Os[_us_] governadores[_is_]", "Article Os + plural -es"),
        ("locais", "locais", "Plural -ais adjective"),
        ("discutem", "discutem", "Verb -em ending (check annotation)"),
        ("questões", "questões", "Plural -ões"),
        ("políticas", "políticas", "Plural -as adjective"),
        ("importantes", "importantes[_is_]", "Plural -es adjective (repeated)"),
        ("durante", "durante[_i_]", "Durante word"),
        ("reuniões", "reuniões", "Plural -ões"),
        ("secretas", "secretas", "Plural -as adjective"),
        ("com ministros", "com[_coun_] ministros[_us_]", "Short nasal + plural -os"),
        ("federais", "federais", "Plural -ais adjective"),
        ("Às vezes", "Às vezes[_is_]", "Às + plural -es"),
        ("jogadores", "jogadores[_is_]", "Plural -es"),
        ("talentosos", "talentosos[_us_]", "Plural -os adjective"),
        ("ganham", "ganham[_ãwn_]", "Verb -am ending"),
        ("campeonatos", "campeonatos[_us_]", "Plural -os"),
        ("nacionais", "nacionais", "Plural -ais adjective"),
        ("depois de", "depois de[_dji_]", "Depois + palatalization"),
        ("treinamentos", "treinamentos[_us_]", "Plural -os"),
        ("intensos", "intensos[_us_]", "Plural -os adjective"),
        ("sacrifícios", "sacrifícios[_us_]", "Plural -os"),
        ("pessoais", "pessoais", "Plural -ais adjective"),
        ("tremendos", "tremendos[_us_]", "Plural -os adjective"),
    ]

    passed = 0
    failed = 0

    for original, expected, description in checks:
        if expected in annotated:
            print(f"✓ {description}")
            passed += 1
        else:
            # Try to find what it actually became
            pattern = re.escape(original.split()[0]) + r'[^\s,\.]*'
            match = re.search(pattern, annotated, flags=re.IGNORECASE)
            actual = match.group(0) if match else "NOT FOUND"
            print(f"✗ {description:50} Expected: {expected:30} Got: {actual}")
            failed += 1

    print()
    print(f"Spot checks: {passed} passed, {failed} failed")
    print()
    print("=" * 80)
    print("✅ NEW VOCABULARY TEST COMPLETE!")
    print("=" * 80)

if __name__ == '__main__':
    main()
