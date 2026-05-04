"""One-shot migration: add `concept` field to every drill in config/dashboard.json.

Maps each drill slug to a canonical concept slug from docs/concepts.md.
Run once after concepts.md is authored; subsequent drill additions tag concepts
manually. Safe to re-run — idempotent.
"""

import json
import sys
from pathlib import Path

# drill_slug -> concept_slug (from docs/concepts.md canonical list)
MAPPING = {
    # verbs
    "regular-ar": "regular-ar-conjugation",
    "regular-er": "regular-er-conjugation",
    "regular-ir": "regular-ir-conjugation",
    "irregular-verbs": "irregular-verb-conjugation",
    "ser-estar": "ser-vs-estar",
    "saber-conhecer": "saber-vs-conhecer",
    "subject-identification": "subject-identification",
    "reflexive-verbs-bp": "reflexive-verbs",
    "reflexive-verbs-ep": "reflexive-verbs",

    # tenses
    "preterite-tense": "preterite-regular",
    "preterite-regular-ar": "preterite-regular",
    "preterite-regular-er-ir": "preterite-regular",
    "preterite-irregular-additional": "preterite-irregular",
    "preterite-irregular-common": "preterite-irregular",
    "preterite-irregular-essential": "preterite-irregular",
    "preterite-vs-imperfect": "preterite-vs-imperfect-aspect",
    "imperfect-tense-bp": "preterite-imperfect",
    "imperfect-tense-ep": "preterite-imperfect",
    "imperative-bp": "imperative-mood",
    "imperative-ep": "imperative-mood",
    "present-continuous-bp": "present-continuous",
    "present-continuous-ep": "present-continuous",
    "conditional-tense-bp": "conditional-formation",
    "conditional-tense-ep": "conditional-formation",
    "conditional-usage-bp": "conditional-usage",
    "conditional-usage-ep": "conditional-usage",
    "conditional-advanced-bp": "conditional-formation",
    "compound-tenses": "compound-tenses",
    "compound-tenses-advanced": "compound-tenses",
    "subjunctive-intro": "subjunctive-broad",
    "subjunctive-all-tenses": "subjunctive-broad",
    "subjunctive-triggers": "subjunctive-triggers",
    "present-subjunctive": "subjunctive-present",
    "imperfect-subjunctive": "subjunctive-imperfect",
    "future-subjunctive": "subjunctive-future",
    "progressive-all-tenses": "progressive-broad",
    "future-tense": "future-tense",
    "immediate-future": "future-immediate",

    # grammar — prepositions and contractions
    "common-prepositions": "common-prepositions",
    "contractions-articles": "preposition-article-contractions",
    "contractions-de": "preposition-article-contractions",
    "contractions-em": "preposition-article-contractions",
    "crase": "crase",
    "por-vs-para": "por-vs-para",
    "preposition-collocations": "preposition-collocations",

    # grammar — articles, agreement, plurals
    "articles": "articles-broad",
    "adjective-agreement": "adjective-agreement",
    "comparatives": "adjective-comparison",
    "superlatives": "adjective-comparison",
    "noun-plurals": "noun-plurals",

    # grammar — pronouns and demonstratives
    "personal-pronouns": "personal-pronouns",
    "demonstratives": "demonstratives",
    "demonstratives-basic": "demonstratives",
    "advanced-demonstratives": "demonstratives",
    "possessives": "possessives",
    "object-pronouns-bp": "object-pronouns",
    "object-pronouns-ep": "object-pronouns",
    "relative-pronouns": "relative-pronouns",

    # grammar — aspectual shifts
    "aspectual-shift-saber": "aspectual-shift-saber",
    "aspectual-shift-conhecer": "aspectual-shift-conhecer",
    "aspectual-shift-poder": "aspectual-shift-poder",
    "aspectual-shift-querer": "aspectual-shift-querer",

    # grammar — derivative verbs
    "ter-derivatives": "ter-derivatives",
    "vir-derivatives": "vir-derivatives",

    # grammar — adverbs
    "frequency-adverbs": "adverbs-frequency",
    "manner-adverbs": "adverbs-manner",
    "muito": "muito",
    "todo-tudo": "todo-vs-tudo",

    # grammar — numbers/dates/time
    "numbers": "numbers",
    "colors": "colors",
    "days-of-week": "days-of-week",
    "time-expressions": "time-expressions",

    # grammar — questions
    "question-words": "question-words",
    "interrogatives": "interrogatives",
    "e-que-questions": "e-que-questions",

    # grammar — connectives and clauses
    "conjunctions": "conjunctions",
    "conditional-sentences": "conditional-sentences",
    "conditional-conjunctions": "conditional-conjunctions",
    "concessive-clauses": "concessive-clauses",
    "purpose-result-clauses": "purpose-result-clauses",
    "reported-speech": "reported-speech",
    "cohesion-coherence": "cohesion-coherence",

    # grammar — advanced
    "passive-voice": "passive-voice",
    "personal-infinitive": "personal-infinitive",
    "double-participles": "double-participles",

    # grammar — domain
    "ir-transportation": "ir-transportation",

    # vocabulary (mostly 1:1)
    "body-parts": "body-parts",
    "clothing": "clothing",
    "common-expressions": "common-expressions",
    "dates": "dates",
    "directions": "directions",
    "emotions": "emotions",
    "false-cognates": "false-cognates",
    "family": "family",
    "food-meals": "food-meals",
    "greetings": "greetings",
    "health-medical": "health-medical",
    "hobbies": "hobbies",
    "house-rooms": "house-rooms",
    "idioms-proverbs": "idioms-proverbs",
    "months": "months",
    "shopping": "shopping",
    "technology": "technology",
    "telling-time": "time-expressions",
    "weather": "weather",
    "work-professions": "work-professions",

    # pronunciation
    "phonetics-br": "phonetics-broad",
    "syllable-stress": "syllable-stress",

    # conversation
    "academic-portuguese": "academic-portuguese",
    "argumentation": "argumentation",
    "bp-vs-ep": "bp-vs-ep-distinctions",
    "business-portuguese": "business-portuguese",
    "colloquial-speech": "colloquial-speech",
    "conversational-answers": "conversational-answers",
    "expressing-opinions": "expressing-opinions",
    "media-current-events": "media-current-events",
    "narration-storytelling": "narration-storytelling",
    "portuguese-for-spanish": "portuguese-for-spanish",
    "register-formal-informal": "register-formal-informal",
    "self-introduction": "self-introduction",
}


def main():
    repo_root = Path(__file__).resolve().parent.parent
    dashboard_path = repo_root / "config" / "dashboard.json"

    with dashboard_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    drill_ids = {d["id"] for d in data["drills"]}
    mapped_ids = set(MAPPING.keys())

    missing_in_mapping = drill_ids - mapped_ids
    extra_in_mapping = mapped_ids - drill_ids

    if missing_in_mapping:
        print(f"ERROR: {len(missing_in_mapping)} drill(s) in dashboard.json without a concept mapping:", file=sys.stderr)
        for slug in sorted(missing_in_mapping):
            print(f"  {slug}", file=sys.stderr)
        sys.exit(1)

    if extra_in_mapping:
        print(f"WARNING: {len(extra_in_mapping)} concept mapping(s) reference drills not in dashboard.json:")
        for slug in sorted(extra_in_mapping):
            print(f"  {slug}")

    updated = 0
    for entry in data["drills"]:
        new_concept = MAPPING[entry["id"]]
        if entry.get("concept") == new_concept:
            continue
        entry["concept"] = new_concept
        updated += 1

    if updated == 0:
        print("All drills already have correct concept tags. No changes.")
        return

    with dashboard_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Updated {updated} drill(s) with concept tags.")
    print(f"Total drills: {len(data['drills'])}, mapped: {len(MAPPING)}")


if __name__ == "__main__":
    main()
