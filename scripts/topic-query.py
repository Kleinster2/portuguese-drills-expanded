"""Query the project's concept taxonomy.

Usage:
    python scripts/topic-query.py <concept-slug>      # show everything for one concept
    python scripts/topic-query.py --list              # list all canonical concepts
    python scripts/topic-query.py --orphans           # concepts referenced by artifacts but missing from concepts.md
    python scripts/topic-query.py --uncovered         # concepts in concepts.md with no artifact tagged

Sources:
    docs/concepts.md            -- canonical concept list
    docs/units/*.md             -- canonical curriculum units (Phase 5 source-of-truth)
    config/dashboard.json       -- drill -> concept mapping
    docs/known-trap-topics.md   -- trap inventory entries with `Concept:` markers
    docs/content-manifest.json  -- worksheet/primer/lesson manifest
    config/diagnostic-test-unit-concepts.json -- diagnostic test units
"""

import json
import re
import sys
from pathlib import Path

import yaml


REPO = Path(__file__).resolve().parent.parent
CONCEPTS_MD = REPO / "docs" / "concepts.md"
DASHBOARD_JSON = REPO / "config" / "dashboard.json"
TRAPS_MD = REPO / "docs" / "known-trap-topics.md"
MANIFEST_JSON = REPO / "docs" / "content-manifest.json"
DIAGNOSTIC_UNITS_JSON = REPO / "config" / "diagnostic-test-unit-concepts.json"
UNITS_DIR = REPO / "docs" / "units"

TOPIC_TO_SECTION = {
    "verbs": "Verb System",
    "tenses": "Tenses",
    "grammar": "Grammar",
    "vocabulary": "Vocabulary",
    "pronunciation": "Pronunciation",
    "conversation": "Communication",
}


def parse_canonical_concepts():
    """Return set of concept slugs declared in docs/concepts.md.

    Reads only the section between <!-- BEGIN CONCEPT LIST --> and
    <!-- END CONCEPT LIST --> markers. Backticked words elsewhere in the
    file (prose, naming-convention counterexamples, frontmatter) are ignored.
    """
    text = CONCEPTS_MD.read_text(encoding="utf-8")
    m = re.search(
        r"<!--\s*BEGIN CONCEPT LIST\s*-->(.*?)<!--\s*END CONCEPT LIST\s*-->",
        text, re.DOTALL,
    )
    if not m:
        print("ERROR: docs/concepts.md is missing BEGIN/END CONCEPT LIST markers.", file=sys.stderr)
        sys.exit(2)
    return set(re.findall(r"`([a-z][a-z0-9-]+)`", m.group(1)))


def load_drills():
    """Return list of drill entries from dashboard.json (each has id, topic, cefr, concept)."""
    with DASHBOARD_JSON.open("r", encoding="utf-8") as f:
        return json.load(f)["drills"]


def parse_trap_entries():
    """Return list of (heading, concept_slug) from known-trap-topics.md."""
    text = TRAPS_MD.read_text(encoding="utf-8")
    entries = []
    current_heading = None
    for line in text.splitlines():
        if line.startswith("### "):
            current_heading = line[4:].strip()
        m = re.match(r"-\s+\*\*Concept:\*\*\s+`([a-z][a-z0-9-]+)`", line)
        if m and current_heading:
            entries.append((current_heading, m.group(1)))
    return entries


def load_manifest():
    """Return dict with worksheets, primers, lesson_pages keys (each a list)."""
    if not MANIFEST_JSON.exists():
        return {"worksheets": [], "primers": [], "lesson_pages": []}
    with MANIFEST_JSON.open("r", encoding="utf-8") as f:
        data = json.load(f)
    # Normalize: all entries have a `concepts` array (manifest schema), drills use single `concept`.
    return {
        "worksheets": data.get("worksheets", []),
        "primers": data.get("primers", []),
        "lesson_pages": data.get("lesson_pages", []),
    }


def load_diagnostic_units():
    """Return list of diagnostic test units with concept tags."""
    if not DIAGNOSTIC_UNITS_JSON.exists():
        return []
    with DIAGNOSTIC_UNITS_JSON.open("r", encoding="utf-8") as f:
        return json.load(f).get("units", [])


def load_canonical_units():
    """Return list of curriculum unit dicts read from docs/units/*.md frontmatter.

    Replaces the legacy syllabus-units.json (deprecated in Phase 5). Each entry
    carries: id (slug), level (lowercase cefr_level), unit (sequence_position
    as float for sort key), name (title), section (explicit or default-from-topic),
    variant, concepts.
    """
    if not UNITS_DIR.exists():
        return []
    units = []
    for path in sorted(UNITS_DIR.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        if not text.startswith("---\n"):
            continue
        end = text.find("\n---\n", 4)
        if end < 0:
            continue
        try:
            fm = yaml.safe_load(text[4:end])
        except yaml.YAMLError:
            continue
        if not isinstance(fm, dict):
            continue
        cefr_level = fm.get("cefr_level", "")
        topic = fm.get("topic", "")
        units.append({
            "id": fm.get("id", path.stem),
            "level": cefr_level.lower() if cefr_level else "",
            "unit": float(fm.get("sequence_position", 0)),
            "name": fm.get("title", fm.get("id", path.stem)),
            "section": fm.get("section") or TOPIC_TO_SECTION.get(topic, "Other"),
            "variant": fm.get("variant", "shared"),
            "concepts": fm.get("concepts", []) or [],
        })
    return units


def query_concept(slug):
    canonical = parse_canonical_concepts()
    if slug not in canonical:
        print(f"WARNING: '{slug}' is not in docs/concepts.md.")
        print(f"Canonical list has {len(canonical)} concepts. Try --list to see them.")
        print()

    drills = [d for d in load_drills() if d.get("concept") == slug]
    traps = [(h, c) for (h, c) in parse_trap_entries() if c == slug]
    manifest = load_manifest()
    worksheets = [w for w in manifest["worksheets"] if slug in w.get("concepts", [])]
    primers = [p for p in manifest["primers"] if slug in p.get("concepts", [])]
    diag_units = [u for u in load_diagnostic_units() if slug in u.get("concepts", [])]
    canonical_units = [u for u in load_canonical_units() if slug in u.get("concepts", [])]

    print(f"=== Concept: {slug} ===")
    print()

    if drills:
        print(f"Drills ({len(drills)}):")
        for d in sorted(drills, key=lambda x: (x.get("cefr", ""), x["id"])):
            cefr = d.get("cefr", "?").upper()
            topic = d.get("topic", "?")
            print(f"  [{cefr}] {d['id']}  ({topic})")
    else:
        print("Drills: none")
    print()

    if worksheets:
        print(f"Worksheets ({len(worksheets)}):")
        for w in sorted(worksheets, key=lambda x: x["path"]):
            cefr = w.get("cefr", "?").upper()
            variant = w.get("variant", "?").upper()
            print(f"  [{variant} {cefr}] {w['path']}")
            print(f"           {w['title']}")
    else:
        print("Worksheets: none")
    print()

    if primers:
        print(f"Primers ({len(primers)}):")
        for p in sorted(primers, key=lambda x: x["path"]):
            cefr = p.get("cefr", "?").upper()
            variant = p.get("variant", "?").upper()
            print(f"  [{variant} {cefr}] {p['path']}")
            print(f"           {p['title']}")
    else:
        print("Primers: none")
    print()

    if diag_units:
        total_qs = sum(u.get("question_count", 0) for u in diag_units)
        print(f"Diagnostic test units ({len(diag_units)}, ~{total_qs} questions):")
        for u in sorted(diag_units, key=lambda x: x["unit"]):
            phase = u.get("phase", "?")
            qc = u.get("question_count", "?")
            print(f"  [phase {phase}] unit {u['unit']:>3}: {u['name']}  ({qc}q)")
    else:
        print("Diagnostic test units: none")
    print()

    if canonical_units:
        print(f"Curriculum units ({len(canonical_units)}):")
        for u in sorted(canonical_units, key=lambda x: (x["level"], x["unit"])):
            level = u["level"].upper()
            section = u.get("section", "?")
            variant = u.get("variant", "shared")
            print(f"  [{level} {u['unit']:>5} {variant:>6}] {u['id']}  ({section})")
    else:
        print("Curriculum units: none")
    print()

    if traps:
        print(f"Trap inventory entries ({len(traps)}):")
        for heading, _ in traps:
            print(f"  - {heading}")
    else:
        print("Trap inventory entries: none")


def list_concepts():
    canonical = sorted(parse_canonical_concepts())
    print(f"Canonical concepts ({len(canonical)}):")
    for slug in canonical:
        print(f"  {slug}")


def find_orphans():
    """Concepts referenced in any artifact source but not declared in concepts.md."""
    canonical = parse_canonical_concepts()
    drills = load_drills()
    manifest = load_manifest()
    diag_units = load_diagnostic_units()

    used = {d.get("concept") for d in drills if d.get("concept")}
    for w in manifest["worksheets"]:
        used.update(w.get("concepts", []))
    for p in manifest["primers"]:
        used.update(p.get("concepts", []))
    for u in diag_units:
        used.update(u.get("concepts", []))
    for u in load_canonical_units():
        used.update(u.get("concepts", []))

    used.discard(None)
    orphans = sorted(used - canonical)
    if orphans:
        print(f"Concepts referenced by artifacts without an entry in concepts.md ({len(orphans)}):")
        for slug in orphans:
            print(f"  {slug}")
    else:
        print("No orphans. Every concept used by drills, worksheets, primers, diagnostic units, or curriculum units is declared in docs/concepts.md.")


def find_uncovered():
    """Concepts declared in concepts.md but not used by any artifact (drills + manifest + diagnostic)."""
    canonical = parse_canonical_concepts()
    drills = load_drills()
    manifest = load_manifest()
    diag_units = load_diagnostic_units()

    used = {d.get("concept") for d in drills if d.get("concept")}
    for w in manifest["worksheets"]:
        used.update(w.get("concepts", []))
    for p in manifest["primers"]:
        used.update(p.get("concepts", []))
    for u in diag_units:
        used.update(u.get("concepts", []))
    for u in load_canonical_units():
        used.update(u.get("concepts", []))
    used.discard(None)

    uncovered = sorted(canonical - used)
    if uncovered:
        print(f"Concepts in concepts.md with no artifact tagged ({len(uncovered)}):")
        for slug in uncovered:
            print(f"  {slug}")
        print()
        print("These may be intentional (covered only in trap notes or pedagogy doctrine)")
        print("or may indicate a gap to fill.")
    else:
        print("Every concept in concepts.md is tagged on at least one artifact.")


def main():
    if len(sys.argv) < 2:
        print(__doc__, file=sys.stderr)
        sys.exit(1)

    arg = sys.argv[1]
    if arg == "--list":
        list_concepts()
    elif arg == "--orphans":
        find_orphans()
    elif arg == "--uncovered":
        find_uncovered()
    elif arg.startswith("-"):
        print(f"Unknown flag: {arg}", file=sys.stderr)
        print(__doc__, file=sys.stderr)
        sys.exit(1)
    else:
        query_concept(arg)


if __name__ == "__main__":
    main()
