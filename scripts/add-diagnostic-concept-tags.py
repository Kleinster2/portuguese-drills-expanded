"""One-shot: build config/diagnostic-test-unit-concepts.json by joining the
diagnostic test's unit list with a curated unit-name -> concept mapping.

Tags are at unit level (74 units cover 350 questions). Units with no clean
concept fit are left untagged; the query script will surface them.
"""

import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DIAGNOSTIC = REPO / "config" / "diagnostic-test-questions-v10.9-no-hints.json"
OUT = REPO / "config" / "diagnostic-test-unit-concepts.json"

# unit_name -> [concept slugs from docs/concepts.md], or [] if no clean fit
MAPPING = {
    # phase 1 (A1)
    "Identity Statements": ["self-introduction"],
    "Origin with Contractions": ["self-introduction", "preposition-article-contractions"],
    "Definite Articles": ["definite-articles"],
    "Indefinite Articles": ["articles-broad"],
    "Location Prepositions": ["common-prepositions"],
    "Location with Contractions": ["preposition-article-contractions"],
    "Verb Ser": ["ser-vs-estar"],
    "Verb Estar": ["ser-vs-estar"],
    "Verb Ter": ["irregular-verb-conjugation"],
    "Basic -AR Verbs": ["regular-ar-conjugation"],
    "Regular -ER Verbs": ["regular-er-conjugation"],
    "Regular -IR Verbs": ["regular-ir-conjugation"],
    "Present Tense Verb Forms": ["present-tense"],
    "Common Question Words": ["question-words"],
    "Negation with Não": [],  # no concept yet
    "Adjective Agreement": ["adjective-agreement"],
    "Gender Agreement": ["adjective-agreement"],
    "Possessive Adjectives": ["possessives"],
    "Demonstratives": ["demonstratives"],
    "Telling Time": ["time-expressions"],
    "Frequency Adverbs": ["adverbs-frequency"],
    "Muito/Muita Agreement": ["muito"],
    "Tudo vs Todo": ["todo-vs-tudo"],

    # phase 2 (A2)
    "Future with Ir + Infinitive": ["future-immediate"],
    "Future Tense": ["future-tense"],
    "Preterite Tense - Regular Verbs": ["preterite-regular"],
    "Preterite Tense - Irregular Verbs": ["preterite-irregular"],
    "Irregular Preterite - Poder/Pôr/Saber/Querer": ["preterite-irregular"],
    "Imperfect Tense": ["preterite-imperfect"],
    "Present Progressive (Gerund)": ["present-continuous"],
    "Commands/Imperative Mood": ["imperative-mood"],
    "Direct Object Pronouns": ["object-pronouns"],
    "Indirect Object Pronouns": ["object-pronouns"],
    "Pronoun Placement": ["object-pronouns"],
    "Comparatives": ["adjective-comparison"],
    "Superlatives": ["adjective-comparison"],
    "Comparisons of Equality": ["adjective-comparison"],
    "Contractions with Preposition A": ["preposition-article-contractions", "crase"],
    "Prepositions Por and Para": ["por-vs-para"],
    "Locations and Directions": ["directions"],
    "Saber vs Conhecer": ["saber-vs-conhecer"],
    "Verb Gostar de": ["preposition-collocations"],
    "Verb Precisar de": ["preposition-collocations"],
    "Verb Ficar": [],  # specific irregular verb, no dedicated concept
    "Existential Ter (BP)": [],  # ter usage idiom, no concept
    "Shopping and Money": ["shopping"],
    "Faz vs A (Time)": ["time-expressions"],
    "Ir vs Vir": [],  # verb pair, no concept

    # phase 3 (B1)
    "Conditional Tense": ["conditional-formation"],
    "Imperfect Subjunctive": ["subjunctive-imperfect"],
    "Imperfect Subjunctive + Conditional": ["subjunctive-imperfect", "conditional-usage"],
    "Present Subjunctive - Regular Verbs": ["subjunctive-present"],
    "Present Subjunctive - Irregular Verbs": ["subjunctive-present"],
    "Future Subjunctive": ["subjunctive-future"],
    "Crase": ["crase"],
    "Relative Pronouns": ["relative-pronouns"],
    "Achar vs Pensar": ["expressing-opinions"],  # both opinion verbs
    "Bom vs Bem": [],  # adjective vs adverb pair
    "Mau vs Mal": [],  # same
    "Mais vs Mas": [],  # homophone pair
    "Ainda vs Já": [],  # adverb pair
    "Algum vs Nenhum": [],  # indefinite pronoun pair
    "Pessoa vs Gente": [],  # noun pair
    "Verbs of Communication": [],  # verb category, not specific
    "Mesmo vs Próprio": [],  # distinction pair
    "Também vs Tampouco": [],  # adverb pair
    "Levar vs Trazer": [],  # verb pair
    "Deixar vs Sair": [],  # verb pair
    "Voltar vs Devolver": [],  # verb pair
    "Jogar vs Brincar vs Tocar": [],  # verb triple
    "Porque Variations": [],  # spelling variants
    "Cá Expressions (BP)": [],  # idiomatic
    "Colloquial Brazilian Portuguese": ["colloquial-speech"],

    # phase 4 (B2)
    "Advanced Por/Para & Idioms": ["por-vs-para"],
}


def main():
    with DIAGNOSTIC.open("r", encoding="utf-8") as f:
        data = json.load(f)

    # Build unit list with phase + question counts
    units = {}  # unit_id -> {name, phase, question_count}
    for q in data["questions"]:
        uid = q["unit"]
        if uid not in units:
            units[uid] = {
                "unit": uid,
                "name": q["unitName"],
                "phase": q.get("phase"),
                "question_count": 0,
                "concepts": [],
            }
        units[uid]["question_count"] += 1

    # Apply concept mapping
    untagged = []
    for u in units.values():
        name = u["name"]
        if name in MAPPING:
            u["concepts"] = MAPPING[name]
            if not MAPPING[name]:
                untagged.append(name)
        else:
            print(f"WARNING: no entry in MAPPING for unit name '{name}' (unit {u['unit']})")
            untagged.append(name)

    output = {
        "_doc": "Concept tags per diagnostic test unit. Read by scripts/topic-query.py to cross-reference diagnostic questions with the concept taxonomy in docs/concepts.md. Untagged units are left as `concepts: []` — these are intentionally not mapped (verb pairs, distinction pairs, idioms without a clean concept fit).",
        "source": "config/diagnostic-test-questions-v10.9-no-hints.json",
        "units": sorted(units.values(), key=lambda u: u["unit"]),
    }

    with OUT.open("w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    tagged = sum(1 for u in units.values() if u["concepts"])
    print(f"Wrote {OUT.relative_to(REPO)}")
    print(f"Total units: {len(units)} | Tagged: {tagged} | Untagged: {len(untagged)}")
    if untagged:
        print(f"Untagged unit names ({len(untagged)}):")
        for n in untagged:
            print(f"  {n}")


if __name__ == "__main__":
    main()
