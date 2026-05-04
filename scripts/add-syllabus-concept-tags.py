"""Build docs/syllabus-units.json by parsing the 4 CEFR curriculum primers
in docs/drills/ and joining with a curated unit-name -> concept mapping.

Each primer has the structure:
  ## <section-name>
  ### <number>. <unit-name>
  - bullet 1
  - bullet 2

The script extracts (level, unit_number, name, section) from the markdown
and looks up concepts from MAPPING. Re-runnable; primers can change.
"""

import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
PRIMER_FILES = {
    "a1": REPO / "docs" / "drills" / "A1-curriculum-primer.md",
    "a2": REPO / "docs" / "drills" / "A2-curriculum-primer.md",
    "b1": REPO / "docs" / "drills" / "B1-curriculum-primer.md",
    "b2": REPO / "docs" / "drills" / "B2-curriculum-primer.md",
}
OUT = REPO / "docs" / "syllabus-units.json"

# (level, unit_name) -> [concept slugs from docs/concepts.md]
# Empty array = unit has no clean concept fit (rare; mostly meta units like
# "Capstone Synthesis" or quantifier groups without a single matching concept).
MAPPING = {
    # ----- A1 -----
    ("a1", "Self-Introduction"): ["self-introduction"],
    ("a1", "Greetings & Politeness"): ["greetings", "register-formal-informal"],
    ("a1", "Numbers & Counting"): ["numbers"],
    ("a1", "Days, Months & Dates"): ["days-of-week", "months", "dates"],
    ("a1", "Family"): ["family"],
    ("a1", "Food & Meals"): ["food-meals"],
    ("a1", "Colors"): ["colors"],
    ("a1", "Body Parts"): ["body-parts"],
    ("a1", "Clothing"): ["clothing"],
    ("a1", "House & Rooms"): ["house-rooms"],
    ("a1", "Personal Pronouns & Subject Omission"): ["personal-pronouns", "subject-identification"],
    ("a1", "Ser vs Estar"): ["ser-vs-estar"],
    ("a1", "Articles & Gender"): ["definite-articles", "articles-broad"],
    ("a1", "Noun Plurals"): ["noun-plurals"],
    ("a1", "Basic Adjective Agreement"): ["adjective-agreement"],
    ("a1", "Possessives"): ["possessives"],
    ("a1", "Demonstratives"): ["demonstratives"],
    ("a1", "Basic Prepositions"): ["common-prepositions"],
    ("a1", "Contractions"): ["preposition-article-contractions"],
    ("a1", "Question Words"): ["question-words"],
    ("a1", "Yes/No Questions & Answers"): ["interrogatives"],
    ("a1", "Subject Identification"): ["subject-identification"],
    ("a1", "Present Tense - Regular Verbs"): [
        "regular-ar-conjugation", "regular-er-conjugation", "regular-ir-conjugation", "present-tense",
    ],
    ("a1", "Present Tense - Essential Irregular Verbs"): ["irregular-verb-conjugation"],
    ("a1", "Immediate Future"): ["future-immediate"],
    ("a1", "Telling Time"): ["time-expressions"],
    ("a1", "Ir + Transportation"): ["ir-transportation"],

    # ----- A2 -----
    ("a2", "Preterite Tense - Regular Verbs"): ["preterite-regular"],
    ("a2", "Preterite Tense - Irregular Verbs"): ["preterite-irregular"],
    ("a2", "Imperfect Tense"): ["preterite-imperfect"],
    ("a2", "Preterite vs Imperfect"): ["preterite-vs-imperfect-aspect"],
    ("a2", "Reflexive Verbs"): ["reflexive-verbs"],
    ("a2", "Present Continuous"): ["present-continuous"],
    ("a2", "Imperative Mood"): ["imperative-mood"],
    ("a2", "Direct Object Pronouns"): ["object-pronouns"],
    ("a2", "Indirect Object Pronouns"): ["object-pronouns"],
    ("a2", "Pronoun Placement"): ["object-pronouns"],
    ("a2", "Comparatives"): ["adjective-comparison"],
    ("a2", "Superlatives"): ["adjective-comparison"],
    ("a2", "Por vs Para"): ["por-vs-para"],
    ("a2", "Saber vs Conhecer"): ["saber-vs-conhecer"],
    ("a2", "More Preposition Usage"): ["common-prepositions"],
    ("a2", "Frequency Adverbs"): ["adverbs-frequency"],
    ("a2", "Manner Adverbs"): ["adverbs-manner"],
    ("a2", "Muito, Pouco, Tanto, Demais"): ["muito"],
    ("a2", "Todo vs Tudo"): ["todo-vs-tudo"],
    ("a2", "Basic Conjunctions"): ["conjunctions"],
    ("a2", "Time Expressions"): ["time-expressions"],
    ("a2", "É que Questions"): ["e-que-questions"],
    ("a2", "Travel & Directions"): ["directions", "ir-transportation"],
    ("a2", "Health & Body"): ["health-medical", "body-parts"],
    ("a2", "Shopping & Money"): ["shopping"],
    ("a2", "Work & Professions"): ["work-professions"],
    ("a2", "Hobbies & Leisure"): ["hobbies"],
    ("a2", "Weather"): ["weather"],
    ("a2", "Emotions & Feelings"): ["emotions", "expressing-opinions"],
    ("a2", "Technology"): ["technology"],
    ("a2", "Advanced Demonstratives"): ["demonstratives"],

    # ----- B1 -----
    ("b1", "Future Tense (Synthetic)"): ["future-tense"],
    ("b1", "Conditional Tense"): ["conditional-formation", "conditional-usage"],
    ("b1", "Compound Tenses (ter + participle)"): ["compound-tenses"],
    ("b1", "Saber: Preterite vs Imperfect"): ["aspectual-shift-saber"],
    ("b1", "Conhecer: Preterite vs Imperfect"): ["aspectual-shift-conhecer"],
    ("b1", "Poder: Preterite vs Imperfect"): ["aspectual-shift-poder"],
    ("b1", "Querer: Preterite vs Imperfect"): ["aspectual-shift-querer"],
    ("b1", "Subjunctive Introduction"): ["subjunctive-broad"],
    ("b1", "Present Subjunctive"): ["subjunctive-present"],
    ("b1", "Imperfect Subjunctive"): ["subjunctive-imperfect"],
    ("b1", "Subjunctive Triggers Deep Dive"): ["subjunctive-triggers"],
    ("b1", "Pôr and Derivatives"): ["por-derivatives"],
    ("b1", "Ter and Derivatives"): ["ter-derivatives"],
    ("b1", "Vir and Derivatives"): ["vir-derivatives"],
    ("b1", "Relative Pronouns"): ["relative-pronouns"],
    ("b1", "Crase (à, às)"): ["crase"],
    ("b1", "Passive Voice"): ["passive-voice"],
    ("b1", "Reported Speech"): ["reported-speech"],
    ("b1", "Discourse Markers"): ["cohesion-coherence"],
    ("b1", "Colloquial vs Formal Register"): ["register-formal-informal", "colloquial-speech"],
    ("b1", "Expressing Opinions"): ["expressing-opinions"],
    ("b1", "Narration & Storytelling"): ["narration-storytelling"],
    ("b1", "Common Expressions"): ["common-expressions"],
    ("b1", "Phrasal Constructions"): ["preposition-collocations", "idioms-proverbs"],

    # ----- B2 -----
    ("b2", "Future Subjunctive"): ["subjunctive-future"],
    ("b2", "Subjunctive in All Contexts"): ["subjunctive-broad"],
    ("b2", "Conditional Sentences (Full System)"): ["conditional-sentences"],
    ("b2", "Personal Infinitive"): ["personal-infinitive"],
    ("b2", "All Compound Tenses"): ["compound-tenses"],
    ("b2", "Progressive Forms in All Tenses"): ["progressive-broad"],
    ("b2", "Double Participles"): ["double-participles"],
    ("b2", "Advanced Relative Clauses"): ["relative-pronouns"],
    ("b2", "Concessive Clauses"): ["concessive-clauses"],
    ("b2", "Purpose & Result Clauses"): ["purpose-result-clauses"],
    ("b2", "Conditional Conjunctions"): ["conditional-conjunctions"],
    ("b2", "BP vs EP Deep Dive"): ["bp-vs-ep-distinctions"],
    ("b2", "Formal vs Informal Register"): ["register-formal-informal"],
    ("b2", "False Cognates"): ["false-cognates"],
    ("b2", "Nuanced Preposition Usage"): ["preposition-collocations", "por-vs-para"],
    ("b2", "Argumentation"): ["argumentation"],
    ("b2", "Cohesion & Coherence"): ["cohesion-coherence"],
    ("b2", "Idiomatic Fluency"): ["idioms-proverbs"],
    ("b2", "Colloquial Speech Patterns"): ["colloquial-speech"],
    ("b2", "Academic Portuguese"): ["academic-portuguese"],
    ("b2", "Business Portuguese"): ["business-portuguese"],
    ("b2", "Media & Current Events"): ["media-current-events"],
    ("b2", "Capstone Synthesis"): [],  # meta unit — review/integration, no single concept
}

UNIT_HEADING_RE = re.compile(r"^###\s+(\d+)\.\s+(.+?)\s*$")
SECTION_HEADING_RE = re.compile(r"^##\s+(?!Overview|Summary)(.+?)\s*$")


def parse_primer(level, path):
    """Yield (unit_number, name, section) for each unit heading in the primer."""
    current_section = None
    for line in path.read_text(encoding="utf-8").splitlines():
        sm = SECTION_HEADING_RE.match(line)
        if sm:
            current_section = sm.group(1)
            continue
        um = UNIT_HEADING_RE.match(line)
        if um:
            unit_num = int(um.group(1))
            name = um.group(2).strip()
            yield unit_num, name, current_section


def main():
    units = []
    untagged = []
    unmapped_keys = set(MAPPING.keys())

    for level, path in PRIMER_FILES.items():
        for unit_num, name, section in parse_primer(level, path):
            key = (level, name)
            if key in MAPPING:
                concepts = MAPPING[key]
                unmapped_keys.discard(key)
            else:
                concepts = []
                print(f"WARNING: no mapping for ({level}, {name!r})")

            units.append({
                "level": level,
                "unit": unit_num,
                "name": name,
                "section": section,
                "concepts": concepts,
            })
            if not concepts:
                untagged.append((level, name))

    if unmapped_keys:
        print(f"WARNING: {len(unmapped_keys)} mapping entries don't match any unit in the primers:")
        for level, name in sorted(unmapped_keys):
            print(f"  ({level}, {name!r})")

    output = {
        "_doc": "Curriculum unit -> concept mapping for the 4 CEFR primers in docs/drills/. Generated by scripts/add-syllabus-concept-tags.py — re-run after editing primers.",
        "sources": [str(p.relative_to(REPO)).replace("\\", "/") for p in PRIMER_FILES.values()],
        "units": units,
    }

    with OUT.open("w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    tagged = sum(1 for u in units if u["concepts"])
    print(f"Wrote {OUT.relative_to(REPO)}")
    print(f"Total units: {len(units)} | Tagged: {tagged} | Untagged: {len(untagged)}")
    if untagged:
        print(f"Untagged units:")
        for level, name in untagged:
            print(f"  ({level}) {name}")


if __name__ == "__main__":
    main()
