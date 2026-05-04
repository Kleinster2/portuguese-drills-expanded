#!/usr/bin/env python3
"""
generate-cefr-primer.py - Phase 4 generator.

Generate per-level, per-variant CEFR primer markdown files from docs/units/*.md.

Filtering:
  - cefr_level matches --level
  - variant in (--variant, "shared")
  - status == "published"

Grouping:
  - By `section` field (or default per-topic mapping when null)
  - Within section, ordered by sequence_position

Rendering: summary form per unit
  - ### [title]
  - First Outcomes bullet
  - First Grammar bullet
  - Wikilink to unit file

Section ordering within level: verbs -> tenses -> grammar -> vocabulary
                              -> conversation -> pronunciation
(plus any custom section overrides interleaved by sequence position)

Usage:
  python scripts/generate-cefr-primer.py --level A1 --variant bp
  python scripts/generate-cefr-primer.py --all
"""

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
UNITS_DIR = REPO_ROOT / "docs" / "units"
OUTPUT_DIR = REPO_ROOT / "docs" / "drills"

CEFR_LEVELS = ["A1", "A2", "B1", "B2"]
VARIANTS = ["bp", "ep"]

# Default section name per topic
TOPIC_TO_SECTION = {
    "verbs": "Verb System",
    "tenses": "Tenses",
    "grammar": "Grammar",
    "vocabulary": "Vocabulary",
    "pronunciation": "Pronunciation",
    "conversation": "Communication",
}

# Canonical section ordering when no custom sections exist
DEFAULT_SECTION_ORDER = [
    "Verb System",
    "Tenses",
    "Grammar",
    "Vocabulary",
    "Communication",
    "Pronunciation",
]

SECTION_HEADER_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)
BULLET_RE = re.compile(r"^[-*]\s+(.+?)$", re.MULTILINE)


def parse_unit(path: Path) -> tuple[dict, str]:
    """Return (frontmatter, body) or ({}, '') if parse fails."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}, ""
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}, ""
    fm_text = text[4:end]
    body = text[end + 5:]
    try:
        fm = yaml.safe_load(fm_text)
    except yaml.YAMLError:
        return {}, ""
    if not isinstance(fm, dict):
        return {}, ""
    return fm, body


def parse_body_sections(body: str) -> dict[str, str]:
    """Extract H2 sections from body."""
    sections: dict[str, str] = {}
    matches = list(SECTION_HEADER_RE.finditer(body))
    for i, m in enumerate(matches):
        name = m.group(1)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        sections[name] = body[start:end].strip()
    return sections


def first_bullet(section_text: str) -> str | None:
    """Return the first bulleted item (without leading '-' or '*'), or None."""
    if not section_text:
        return None
    m = BULLET_RE.search(section_text)
    if not m:
        return None
    bullet = m.group(1).strip()
    # Strip surrounding markdown emphasis
    bullet = re.sub(r"^\*\*(.+?)\*\*:?\s*", r"\1: ", bullet)
    return bullet if bullet else None


def render_unit_summary(uid: str, fm: dict, body: str) -> str:
    """Produce the summary block for one unit in the CEFR primer."""
    title = fm.get("title", uid)
    sections = parse_body_sections(body)

    out = [f"### {title}"]

    outcome_first = first_bullet(sections.get("Outcomes", ""))
    if outcome_first:
        out.append(f"- **Outcome:** {outcome_first}")

    grammar_first = first_bullet(sections.get("Grammar", ""))
    if grammar_first:
        # Truncate very long bullets
        if len(grammar_first) > 180:
            grammar_first = grammar_first[:177] + "..."
        out.append(f"- **Grammar:** {grammar_first}")

    out.append(f"- **Unit:** [[{uid}]]")
    return "\n".join(out)


def section_for_unit(fm: dict) -> str:
    """Resolve the unit's section: explicit `section` field overrides;
    otherwise default per topic."""
    explicit = fm.get("section")
    if explicit:
        return explicit
    topic = fm.get("topic")
    return TOPIC_TO_SECTION.get(topic, "Other")


def section_sort_key(section_name: str, units_in_section: list[tuple[str, dict, str]]) -> tuple[int, float]:
    """Sort key for sections. Default-named sections use the canonical order
    (DEFAULT_SECTION_ORDER index). Custom-named sections sort by the
    sequence_position of their first unit."""
    try:
        idx = DEFAULT_SECTION_ORDER.index(section_name)
        return (0, idx)
    except ValueError:
        # Custom section — sort by the sequence_position of its first unit
        first_pos = min(float(fm["sequence_position"]) for _, fm, _ in units_in_section)
        return (1, first_pos)


def generate_primer(level: str, variant: str, units: list[tuple[str, dict, str]]) -> str:
    """Render the full primer markdown for one (level, variant) pair."""
    # Filter
    target = [
        (uid, fm, body) for uid, fm, body in units
        if fm.get("cefr_level") == level
        and fm.get("variant") in (variant, "shared")
        and fm.get("status") == "published"
    ]

    # Group by section
    by_section: dict[str, list[tuple[str, dict, str]]] = defaultdict(list)
    for uid, fm, body in target:
        by_section[section_for_unit(fm)].append((uid, fm, body))

    # Within each section, sort by sequence_position
    for entries in by_section.values():
        entries.sort(key=lambda t: float(t[1]["sequence_position"]))

    # Section ordering
    section_names = sorted(
        by_section.keys(),
        key=lambda s: section_sort_key(s, by_section[s]),
    )

    # Render
    out: list[str] = []
    out.append(f"# Curriculum Primer — {level} ({variant.upper()})")
    out.append("")
    out.append(
        f"Generated from `docs/units/`. Filter: `cefr_level == {level}` AND "
        f"`variant in ({variant}, shared)` AND `status == published`."
    )
    out.append("")
    out.append(f"**Total units:** {len(target)}")
    out.append("")

    if not target:
        out.append("_No units match the filter._")
        return "\n".join(out)

    for section in section_names:
        out.append(f"## {section}")
        out.append("")
        for uid, fm, body in by_section[section]:
            out.append(render_unit_summary(uid, fm, body))
            out.append("")

    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--level", choices=CEFR_LEVELS)
    parser.add_argument("--variant", choices=VARIANTS)
    parser.add_argument("--all", action="store_true",
                        help="Generate all 8 primer files")
    args = parser.parse_args()

    if args.all:
        targets = [(level, variant) for level in CEFR_LEVELS for variant in VARIANTS]
    else:
        if not args.level or not args.variant:
            print("FAIL: must specify --level and --variant, or --all", file=sys.stderr)
            return 1
        targets = [(args.level, args.variant)]

    # Load all units once
    units: list[tuple[str, dict, str]] = []
    for path in sorted(UNITS_DIR.glob("*.md")):
        fm, body = parse_unit(path)
        if not fm:
            continue
        uid = fm.get("id")
        if not uid:
            continue
        units.append((uid, fm, body))

    print(f"Loaded {len(units)} units from {UNITS_DIR.relative_to(REPO_ROOT)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for level, variant in targets:
        primer = generate_primer(level, variant, units)
        out_path = OUTPUT_DIR / f"{level}-curriculum-primer-{variant}.md"
        out_path.write_text(primer, encoding="utf-8")
        # Count units (the line "**Total units:** N")
        m = re.search(r"\*\*Total units:\*\* (\d+)", primer)
        unit_count = m.group(1) if m else "?"
        print(f"  Wrote {out_path.relative_to(REPO_ROOT)} ({unit_count} units)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
