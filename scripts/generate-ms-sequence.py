#!/usr/bin/env python3
"""
generate-ms-sequence.py - Phase 4 generator.

Generate per-variant MS-sequence markdown file from docs/units/*.md.
Replaces the legacy single mixed-variant docs/drills/syllabus-micro-sequence.md
with two variant-pure files (per Phase 1 architectural decision: PEDAGOGY's
BP/EP separation rule was violated by the original mixed sequence).

Filtering:
  - variant in (--variant, "shared")
  - status == "published"

Ordering: global by sequence_position (ascending).

Rendering: full body form per unit
  - ## Unit N: [title] (using sequence_position as Unit number, formatted)
  - Frontmatter summary (cefr_level, variant, concepts, prereqs)
  - Full body content (Outcomes / Vocabulary / Grammar / Drills / Traps)

Usage:
  python scripts/generate-ms-sequence.py --variant bp
  python scripts/generate-ms-sequence.py --all
"""

import argparse
import re
import sys
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
UNITS_DIR = REPO_ROOT / "docs" / "units"
OUTPUT_DIR = REPO_ROOT / "docs" / "drills"

VARIANTS = ["bp", "ep"]

SECTION_HEADER_RE = re.compile(r"^##\s+", re.MULTILINE)


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


def demote_body_headers(body: str) -> str:
    """Demote H2 headers in body to H3 so they nest under the unit's H2.
    Leaves H3 and below untouched (### stays ###)."""
    return re.sub(r"^##(?!#)\s+", "### ", body, flags=re.MULTILINE)


def render_unit(uid: str, fm: dict, body: str, ms_index: int) -> str:
    """Render a unit in MS-sequence form."""
    title = fm.get("title", uid)
    pos = fm.get("sequence_position", "?")
    cefr = fm.get("cefr_level", "?")
    variant = fm.get("variant", "?")
    concepts = fm.get("concepts", [])
    prereqs = fm.get("prereqs", [])

    out = []
    out.append(f"## Unit {ms_index} — {title}")
    out.append("")
    out.append(f"*Slug: `{uid}` · Sequence position: {pos} · CEFR: {cefr} · Variant: {variant}*")
    out.append("")
    if concepts:
        out.append(f"**Concepts:** {', '.join(f'`{c}`' for c in concepts)}")
        out.append("")
    if prereqs:
        out.append(f"**Prereqs:** {', '.join(f'`{p}`' for p in prereqs)}")
        out.append("")

    # Demote body headers from ## to ### so the unit's H2 stays canonical
    out.append(demote_body_headers(body).strip())
    out.append("")
    out.append("---")
    out.append("")

    return "\n".join(out)


def generate_sequence(variant: str, units: list[tuple[str, dict, str]]) -> str:
    """Render the full MS sequence markdown for one variant."""
    target = [
        (uid, fm, body) for uid, fm, body in units
        if fm.get("variant") in (variant, "shared")
        and fm.get("status") == "published"
    ]

    target.sort(key=lambda t: float(t[1]["sequence_position"]))

    out = []
    out.append(f"# Portuguese Curriculum — MS Sequence ({variant.upper()})")
    out.append("")
    out.append(
        f"Generated from `docs/units/`. Filter: `variant in ({variant}, shared)` "
        f"AND `status == published`. Ordered by `sequence_position` ascending."
    )
    out.append("")
    out.append(f"**Total units:** {len(target)}")
    out.append("")
    out.append("---")
    out.append("")

    for i, (uid, fm, body) in enumerate(target, start=1):
        out.append(render_unit(uid, fm, body, i))

    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--variant", choices=VARIANTS)
    parser.add_argument("--all", action="store_true",
                        help="Generate both BP and EP MS sequence files")
    args = parser.parse_args()

    if args.all:
        targets = list(VARIANTS)
    else:
        if not args.variant:
            print("FAIL: must specify --variant or --all", file=sys.stderr)
            return 1
        targets = [args.variant]

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

    for variant in targets:
        seq = generate_sequence(variant, units)
        out_path = OUTPUT_DIR / f"syllabus-micro-sequence-{variant}.md"
        out_path.write_text(seq, encoding="utf-8")
        m = re.search(r"\*\*Total units:\*\* (\d+)", seq)
        unit_count = m.group(1) if m else "?"
        size_kb = out_path.stat().st_size / 1024
        print(f"  Wrote {out_path.relative_to(REPO_ROOT)} ({unit_count} units, {size_kb:.0f} KB)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
