"""Query the project's concept taxonomy.

Usage:
    python scripts/topic-query.py <concept-slug>      # show everything for one concept
    python scripts/topic-query.py --list              # list all canonical concepts
    python scripts/topic-query.py --orphans           # concepts in dashboard.json not in concepts.md
    python scripts/topic-query.py --uncovered         # concepts in concepts.md with no drills

Sources:
    docs/concepts.md            -- canonical concept list
    config/dashboard.json       -- drill -> concept mapping
    docs/known-trap-topics.md   -- trap inventory entries with `Concept:` markers
"""

import json
import re
import sys
from pathlib import Path


REPO = Path(__file__).resolve().parent.parent
CONCEPTS_MD = REPO / "docs" / "concepts.md"
DASHBOARD_JSON = REPO / "config" / "dashboard.json"
TRAPS_MD = REPO / "docs" / "known-trap-topics.md"


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


def query_concept(slug):
    canonical = parse_canonical_concepts()
    if slug not in canonical:
        print(f"WARNING: '{slug}' is not in docs/concepts.md.")
        print(f"Canonical list has {len(canonical)} concepts. Try --list to see them.")
        print()

    drills = [d for d in load_drills() if d.get("concept") == slug]
    traps = [(h, c) for (h, c) in parse_trap_entries() if c == slug]

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
    """Concepts referenced in dashboard.json but not declared in concepts.md."""
    canonical = parse_canonical_concepts()
    drills = load_drills()
    used = {d.get("concept") for d in drills if d.get("concept")}
    orphans = sorted(used - canonical)
    if orphans:
        print(f"Concepts in dashboard.json without an entry in concepts.md ({len(orphans)}):")
        for slug in orphans:
            print(f"  {slug}")
    else:
        print("No orphans. Every drill concept is declared in docs/concepts.md.")


def find_uncovered():
    """Concepts declared in concepts.md but not used by any drill."""
    canonical = parse_canonical_concepts()
    drills = load_drills()
    used = {d.get("concept") for d in drills if d.get("concept")}
    uncovered = sorted(canonical - used)
    if uncovered:
        print(f"Concepts in concepts.md with no drill ({len(uncovered)}):")
        for slug in uncovered:
            print(f"  {slug}")
        print()
        print("These may be intentional (covered by worksheets/primers/trap notes only)")
        print("or may indicate a gap to fill.")
    else:
        print("Every concept in concepts.md has at least one drill.")


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
