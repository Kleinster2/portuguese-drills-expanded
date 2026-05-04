#!/usr/bin/env python3
"""
migrate-to-units.py — Phase 2 mechanical migration.

Reads:
  - docs/architecture/phase-0-alignment-table.md (YAML inside fenced block)
  - docs/drills/syllabus-micro-sequence.md      (MS source)
  - docs/drills/[A1-B2]-curriculum-primer.md    (CEFR sources)

Writes:
  - docs/units/[id].md (one per alignment-table entry)
  - docs/architecture/phase-2-migration-log.md (running log of decisions)

Idempotent: rerunning produces identical output.

Usage:
  python scripts/migrate-to-units.py [--level A1] [--dry-run]
"""

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
ALIGNMENT_PATH = REPO_ROOT / "docs" / "architecture" / "phase-0-alignment-table.md"
MS_PATH = REPO_ROOT / "docs" / "drills" / "syllabus-micro-sequence.md"
CEFR_PATHS = {
    "A1": REPO_ROOT / "docs" / "drills" / "A1-curriculum-primer.md",
    "A2": REPO_ROOT / "docs" / "drills" / "A2-curriculum-primer.md",
    "B1": REPO_ROOT / "docs" / "drills" / "B1-curriculum-primer.md",
    "B2": REPO_ROOT / "docs" / "drills" / "B2-curriculum-primer.md",
}
UNITS_DIR = REPO_ROOT / "docs" / "units"
LOG_PATH = REPO_ROOT / "docs" / "architecture" / "phase-2-migration-log.md"


# ---------- alignment table loader ----------

def load_alignment(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    # YAML lives inside ```yaml ... ``` block
    m = re.search(r"```yaml\n(.*?)\n```", text, re.DOTALL)
    if not m:
        raise SystemExit(f"No ```yaml block found in {path}")
    data = yaml.safe_load(m.group(1))
    return data["units"]


# ---------- MS source parser ----------

MS_UNIT_HEADER_RE = re.compile(r"^###\s+Unit\s+(\d+):\s+(.+?)$", re.MULTILINE)


def parse_ms_source(path: Path) -> dict[int, dict]:
    """Return {ms_unit_num: {title, raw_body}}."""
    text = path.read_text(encoding="utf-8")
    matches = list(MS_UNIT_HEADER_RE.finditer(text))
    units = {}
    for i, m in enumerate(matches):
        num = int(m.group(1))
        title = m.group(2).strip()
        body_start = m.end()
        body_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        raw = text[body_start:body_end].strip()
        # Trim trailing horizontal rule that separates units
        if raw.endswith("---"):
            raw = raw[:-3].rstrip()
        units[num] = {"title": title, "raw_body": raw}
    return units


SECTION_HEADER_RE = re.compile(r"^\*\*(.+?):\*\*\s*$", re.MULTILINE)


def extract_ms_section(raw_body: str, header_aliases: list[str]) -> str | None:
    """Return text under one of the listed bold-headed sections (e.g., 'New vocabulary').
    Returns the lines until the next bold-header section or end."""
    lines = raw_body.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^\*\*(.+?):\*\*\s*$", line)
        if m and m.group(1).strip() in header_aliases:
            # Collect lines until next bold header or end
            collected = []
            i += 1
            while i < len(lines):
                if re.match(r"^\*\*[^*]+:\*\*\s*$", lines[i]):
                    break
                collected.append(lines[i])
                i += 1
            return "\n".join(collected).strip()
        i += 1
    return None


# ---------- CEFR primer parser ----------

CEFR_CELL_RE = re.compile(r"^###\s+(\d+)\.\s+(.+?)$", re.MULTILINE)
CEFR_SECTION_RE = re.compile(r"^##\s+(.+?)$", re.MULTILINE)


def parse_cefr_primer(path: Path, level: str) -> dict[str, dict]:
    """Return {f'{level}.N': {title, section, body}}."""
    text = path.read_text(encoding="utf-8")
    # Build position -> section map
    section_marks = [(m.start(), m.group(1).strip()) for m in CEFR_SECTION_RE.finditer(text)]
    # Skip the top-level "## Overview" / "## Summary" — but keep them in section_marks; lookup just picks the most recent

    def section_at(pos: int) -> str | None:
        current = None
        for start, name in section_marks:
            if start < pos:
                current = name
            else:
                break
        return current

    cells = {}
    matches = list(CEFR_CELL_RE.finditer(text))
    for i, m in enumerate(matches):
        num = int(m.group(1))
        title = m.group(2).strip()
        body_start = m.end()
        body_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        # If there's a "##" between this cell and the next, end body there
        for sec_start, _ in section_marks:
            if body_start < sec_start < body_end:
                body_end = sec_start
                break
        body = text[body_start:body_end].strip()
        # Trim trailing "---" separator
        if body.endswith("---"):
            body = body[:-3].rstrip()
        key = f"{level}.{num}"
        cells[key] = {
            "title": title,
            "section": section_at(m.start()),
            "body": body,
        }
    return cells


# ---------- unit file renderer ----------

def render_unit(spec: dict, ms_units: dict[int, dict], cefr_cells: dict[str, dict]) -> tuple[str, list[str]]:
    """Render a single unit file. Returns (file_text, log_entries)."""
    log: list[str] = []
    fm = {
        "id": spec["id"],
        "title": spec["title"],
        "cefr_level": spec["cefr_level"],
        "sequence_position": spec["sequence_position"],
        "topic": spec["topic"],
        "variant": spec["variant"],
        "status": "published",
        "concepts": spec["concepts"],
        "prereqs": [],
        "ms_legacy": spec["ms_legacy"],
        "cefr_legacy": spec["cefr_legacy"],
    }

    # Body sections
    outcomes_md = ""
    vocabulary_md = ""
    grammar_md = ""
    drills_md = "<!-- TODO: link drills, worksheets, lessons in Phase 3 -->"
    traps_md = "<!-- TODO: enrich in Phase 3 -->"

    if spec["source"] == "ms" and spec["ms_legacy"] is not None:
        ms = ms_units.get(spec["ms_legacy"])
        if ms is None:
            log.append(f"  - {spec['id']}: WARNING — ms_legacy={spec['ms_legacy']} not found in MS source")
        else:
            voc = extract_ms_section(ms["raw_body"], ["New vocabulary", "First words/concepts taught"])
            gram = extract_ms_section(ms["raw_body"], ["Grammar introduced"])
            outc = extract_ms_section(ms["raw_body"], ["Student can now"])
            sentences = extract_ms_section(ms["raw_body"], ["Typical sentences", "Typical conversations"])
            if voc:
                vocabulary_md = voc
            else:
                vocabulary_md = "<!-- TODO: enrich in Phase 3 -->"
            if gram:
                grammar_md = gram
                if sentences:
                    grammar_md += "\n\n### Exemplar sentences\n\n" + sentences
            elif sentences:
                grammar_md = "### Exemplar sentences\n\n" + sentences
            else:
                grammar_md = "<!-- TODO: enrich in Phase 3 -->"
            if outc:
                outcomes_md = outc
            else:
                outcomes_md = "<!-- TODO: enrich in Phase 3 -->"
            # Log if multiple CEFR cells were merged into this MS unit
            if len(spec["cefr_legacy"]) > 1:
                log.append(
                    f"  - {spec['id']}: M:1 merge — MS{spec['ms_legacy']} consolidates "
                    f"{spec['cefr_legacy']} into one productive unit (MS framing wins)"
                )
    elif spec["source"] == "cefr-only":
        # Use CEFR cell body verbatim under Grammar; mark TODO elsewhere
        primary = spec["cefr_legacy"][0] if spec["cefr_legacy"] else None
        if primary and primary in cefr_cells:
            cell = cefr_cells[primary]
            grammar_md = cell["body"] if cell["body"] else "<!-- TODO: enrich in Phase 3 -->"
            outcomes_md = "<!-- TODO: enrich in Phase 3 (sparse CEFR-only unit) -->"
            vocabulary_md = "<!-- TODO: enrich in Phase 3 -->"
            log.append(
                f"  - {spec['id']}: CEFR-only port from {primary} (sparse body, Phase 3 enrichment needed)"
            )
        else:
            log.append(f"  - {spec['id']}: WARNING — cefr-only source but cefr_legacy is empty or unmatched")
            grammar_md = "<!-- TODO: enrich in Phase 3 -->"
            outcomes_md = "<!-- TODO: enrich in Phase 3 -->"
            vocabulary_md = "<!-- TODO: enrich in Phase 3 -->"

    # Build YAML frontmatter (preserve key order)
    fm_lines = ["---"]
    for key in ["id", "title", "cefr_level", "sequence_position", "topic", "variant",
                "status", "concepts", "prereqs", "ms_legacy", "cefr_legacy"]:
        v = fm[key]
        if isinstance(v, list):
            if not v:
                fm_lines.append(f"{key}: []")
            else:
                fm_lines.append(f"{key}: [{', '.join(str(x) for x in v)}]")
        elif v is None:
            fm_lines.append(f"{key}: null")
        elif isinstance(v, bool):
            fm_lines.append(f"{key}: {str(v).lower()}")
        elif isinstance(v, str):
            # Quote strings that contain special chars
            if any(c in v for c in [":", "#", "'", '"', "[", "]", "{", "}"]):
                escaped = v.replace('"', '\\"')
                fm_lines.append(f'{key}: "{escaped}"')
            else:
                fm_lines.append(f"{key}: {v}")
        else:
            fm_lines.append(f"{key}: {v}")
    fm_lines.append("---")

    # Variant-split candidates get a body-top TODO marker (Phase 3 will create the -ep twin)
    split_marker = ""
    if spec.get("phase_3_split_pending"):
        ep_slug = spec["id"].rsplit("-bp", 1)[0] + "-ep"
        split_marker = (
            f"<!-- TODO: Phase 3 — split into {spec['id']} / {ep_slug} pair.\n"
            f"     EP-divergent content (clitic placement, tu vs você, gerund vs estar a + infinitivo, etc.) "
            f"needs separate unit. -->\n\n"
        )

    body_lines = [
        "",
        split_marker.rstrip() if split_marker else "",
        "## Outcomes",
        "",
        outcomes_md,
        "",
        "## Vocabulary",
        "",
        vocabulary_md,
        "",
        "## Grammar",
        "",
        grammar_md,
        "",
        "## Drills & artifacts",
        "",
        drills_md,
        "",
        "## Traps",
        "",
        traps_md,
        "",
    ]
    return "\n".join(fm_lines + body_lines), log


# ---------- main ----------

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--level", choices=["A1", "A2", "B1", "B2"], default=None,
                        help="Restrict migration to one CEFR level (pilot mode)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Don't write files; just print what would be done")
    args = parser.parse_args()

    if not ALIGNMENT_PATH.exists():
        print(f"FAIL: alignment table not found at {ALIGNMENT_PATH}")
        return 1

    print(f"Loading alignment table from {ALIGNMENT_PATH.relative_to(REPO_ROOT)}")
    units_spec = load_alignment(ALIGNMENT_PATH)
    print(f"  {len(units_spec)} units in alignment table")

    print(f"Parsing MS source from {MS_PATH.relative_to(REPO_ROOT)}")
    ms_units = parse_ms_source(MS_PATH)
    print(f"  {len(ms_units)} MS units parsed")

    print("Parsing CEFR primers")
    cefr_cells: dict[str, dict] = {}
    for level, path in CEFR_PATHS.items():
        cells = parse_cefr_primer(path, level)
        print(f"  {level}: {len(cells)} cells")
        cefr_cells.update(cells)

    if args.level:
        units_spec = [s for s in units_spec if s["cefr_level"] == args.level]
        print(f"\nFiltering to level={args.level}: {len(units_spec)} units to migrate")

    UNITS_DIR.mkdir(parents=True, exist_ok=True)

    log_entries: list[str] = []
    log_entries.append(f"# Phase 2 Migration Log\n")
    log_entries.append(f"Run: {datetime.now().isoformat(timespec='seconds')}")
    if args.level:
        log_entries.append(f"Filter: --level={args.level}")
    log_entries.append(f"Total units: {len(units_spec)}\n")
    log_entries.append("## Per-unit decisions\n")

    written = 0
    for spec in units_spec:
        text, decisions = render_unit(spec, ms_units, cefr_cells)
        log_entries.extend(decisions)
        out_path = UNITS_DIR / f"{spec['id']}.md"
        if args.dry_run:
            print(f"  DRY: would write {out_path.relative_to(REPO_ROOT)} ({len(text)} bytes)")
        else:
            out_path.write_text(text, encoding="utf-8")
            written += 1

    # Variant split candidates (from alignment table phase_3_split_pending flag)
    log_entries.append("\n## Variant-split candidates flagged for Phase 3 EP-twin authoring")
    log_entries.append(
        "These units are migrated as variant=bp with -bp slug suffix, body-top TODO marker. "
        "Phase 3 creates the -ep sibling with EP-specific content."
    )
    split_candidates = [
        ("a1-pron-voce-bp", "MS23", "você vs tu pronoun choice"),
        ("a2-estar-gerundio-bp", "MS30", "gerund vs estar a + infinitive"),
        ("a2-reflexivos-bp", "MS39", "clitic placement BP/EP differs"),
        ("a2-dop-bp", "MS40", "clitic placement BP/EP differs"),
        ("a2-iop-bp", "MS44", "clitic placement BP/EP differs"),
        ("a2-imperativo-bp", "MS71", "você-form vs tu-form imperatives"),
        ("b1-condicional-bp", "MS77", "EP often substitutes imperfeito de cortesia"),
    ]
    for uid, src, reason in split_candidates:
        log_entries.append(f"  - {uid} (from {src}): {reason}")

    # Cefr_level ambiguity calls
    log_entries.append("\n## CEFR-level ambiguity decisions")
    log_entries.append("MS units that span multiple CEFR cells across different levels:")
    ambiguity_calls = [
        ("b2-coloquial-bp", "MS86", "spans B1.20 + B2.13 + B2.19; assigned cefr_level=B2 (higher level wins)"),
        ("a2-estar-gerundio", "MS30", "MS positions at 30, but CEFR places A2.6; cefr_level=A2 (CEFR wins)"),
        ("a1-question-words", "MS38", "MS positions at 38, but CEFR places A1.20; cefr_level=A1 (CEFR wins)"),
        ("a1-horas", "MS49", "MS positions at 49, but CEFR places A1.26; cefr_level=A1 (CEFR wins)"),
        ("a1-demonstrativos", "MS72", "MS positions at 72, but CEFR places A1.17; cefr_level=A1 (CEFR wins)"),
        ("a2-e-que", "MS78", "MS positions at 78, but CEFR places A2.22; cefr_level=A2 (CEFR wins)"),
        ("a2-todo-tudo", "MS80", "MS positions at 80, but CEFR places A2.19; cefr_level=A2 (CEFR wins)"),
        ("b2-subj-futuro", "MS85", "MS positions at 85, but CEFR places B2.1; cefr_level=B2 (CEFR wins)"),
        ("a2-dem-avancados", "MS87", "MS positions at 87, but CEFR places A2.31; cefr_level=A2 (CEFR wins)"),
    ]
    for uid, src, reason in ambiguity_calls:
        log_entries.append(f"  - {uid} (from {src}): {reason}")

    log_entries.append("\n## Partial CEFR coverage notes")
    log_entries.append(
        "  - A2.20 (Basic Conjunctions) is partially covered by MS6 (which only teaches \"e\"). "
        "Remaining conjunctions (ou, mas, porque, quando, se, como) stay orphaned for Phase 3 to redistribute."
    )

    log_entries.append("\n## Summary stats")
    if not args.dry_run:
        log_entries.append(f"  - Files written: {written}")
    log_entries.append(f"  - MS-derived: {sum(1 for s in units_spec if s['source'] == 'ms')}")
    log_entries.append(f"  - CEFR-only: {sum(1 for s in units_spec if s['source'] == 'cefr-only')}")
    by_level = {}
    by_variant = {}
    for s in units_spec:
        by_level.setdefault(s["cefr_level"], 0)
        by_level[s["cefr_level"]] += 1
        by_variant.setdefault(s["variant"], 0)
        by_variant[s["variant"]] += 1
    log_entries.append(f"  - By CEFR level: {by_level}")
    log_entries.append(f"  - By variant: {by_variant}")

    log_text = "\n".join(log_entries) + "\n"

    if args.dry_run:
        print("\n--- DRY RUN: log preview ---\n")
        print(log_text)
    else:
        # Append-aware: if log file exists, append a new run section; else create fresh.
        if LOG_PATH.exists() and not args.level:
            # Full re-run: overwrite
            LOG_PATH.write_text(log_text, encoding="utf-8")
        elif LOG_PATH.exists() and args.level:
            # Pilot run on top of an existing log: append
            with LOG_PATH.open("a", encoding="utf-8") as f:
                f.write("\n\n---\n\n")
                f.write(log_text)
        else:
            LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
            LOG_PATH.write_text(log_text, encoding="utf-8")
        print(f"\nWrote {written} unit files to {UNITS_DIR.relative_to(REPO_ROOT)}")
        print(f"Log appended to {LOG_PATH.relative_to(REPO_ROOT)}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
