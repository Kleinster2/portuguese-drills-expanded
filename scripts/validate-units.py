#!/usr/bin/env python3
"""
validate-units.py - Phase 4 full validator for docs/units/*.md.

Hard-fail rules (rules 1-10) per docs/architecture/curriculum-canonical.md.
Soft warnings (rules 11-13 + Phase 4 additions) surface to stderr; --strict
promotes them to errors.

Usage:
  python scripts/validate-units.py [--units-dir docs/units] [--concepts docs/concepts.md] [--strict]

Exit codes:
  0 = clean
  1 = hard-fail violations found (or warnings present with --strict)
"""

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent

REQUIRED_FIELDS = {
    "id", "title", "cefr_level", "sequence_position", "topic",
    "variant", "status", "concepts", "prereqs", "ms_legacy", "cefr_legacy",
}
OPTIONAL_FIELDS = {"section"}

CEFR_LEVELS = {"A1", "A2", "B1", "B2"}
TOPICS = {"verbs", "vocabulary", "tenses", "grammar", "pronunciation", "conversation"}
VARIANTS = {"bp", "ep", "shared"}
STATUSES = {"draft", "published", "archived"}

REQUIRED_BODY_SECTIONS = ["Outcomes", "Vocabulary", "Grammar", "Drills & artifacts", "Traps"]

SLUG_RE = re.compile(r"^(a1|a2|b1|b2)-[a-z0-9-]+$")
SLUG_MAX_LEN = 40
CEFR_LEGACY_RE = re.compile(r"^(A1|A2|B1|B2)\.\d+$")
VARIANT_SUFFIX_RE = re.compile(r"-(bp|ep)$")
SECTION_HEADER_RE = re.compile(r"^##\s+(.+?)\s*$", re.MULTILINE)

# Phase 4 thresholds
SOFT_PREREQ_COUNT_LIMIT = 10
SOFT_CONCEPT_COUNT_LIMIT = 5


def load_concepts(concepts_path: Path) -> set[str]:
    """Extract concept slugs from docs/concepts.md between BEGIN/END markers."""
    text = concepts_path.read_text(encoding="utf-8")
    start = text.find("<!-- BEGIN CONCEPT LIST -->")
    end = text.find("<!-- END CONCEPT LIST -->")
    if start < 0 or end < 0:
        raise SystemExit(f"concepts.md missing BEGIN/END markers")
    body = text[start:end]
    return set(re.findall(r"`([a-z0-9-]+)`", body))


def parse_unit(path: Path) -> tuple[dict, str, list[str]]:
    """Parse a unit file. Returns (frontmatter_dict, body_text, errors_list).
    body_text is the full body after frontmatter (empty string if parse failed)."""
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}, "", [f"{path.name}: missing YAML frontmatter (no leading '---')"]
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}, "", [f"{path.name}: unterminated YAML frontmatter (no closing '---')"]
    fm_text = text[4:end]
    body_text = text[end + 5:]  # after "\n---\n"
    try:
        fm = yaml.safe_load(fm_text)
    except yaml.YAMLError as exc:
        return {}, "", [f"{path.name}: YAML parse error: {exc}"]
    if not isinstance(fm, dict):
        return {}, "", [f"{path.name}: frontmatter must be a YAML mapping"]
    return fm, body_text, errors


def validate_unit(path: Path, fm: dict, concepts: set[str]) -> list[str]:
    """Per-file hard-fail checks (rules 1-5 + 10)."""
    errors: list[str] = []
    name = path.name
    stem = path.stem

    # Rule 2: required fields
    missing = REQUIRED_FIELDS - fm.keys()
    if missing:
        errors.append(f"{name}: missing required fields: {sorted(missing)}")
        return errors  # Bail early

    unknown = fm.keys() - REQUIRED_FIELDS - OPTIONAL_FIELDS
    if unknown:
        errors.append(f"{name}: unknown frontmatter fields: {sorted(unknown)}")

    uid = fm["id"]

    # Rule 1: file <-> id
    if uid != stem:
        errors.append(f"{name}: id '{uid}' does not match filename stem '{stem}'")

    # Rule 4: slug format
    if not isinstance(uid, str) or not SLUG_RE.match(uid):
        errors.append(f"{name}: id '{uid}' fails slug regex ^(a1|a2|b1|b2)-[a-z0-9-]+$")
    elif len(uid) > SLUG_MAX_LEN:
        errors.append(f"{name}: id '{uid}' exceeds {SLUG_MAX_LEN} char limit ({len(uid)} chars)")

    # Rule 3: enums
    if fm["cefr_level"] not in CEFR_LEVELS:
        errors.append(f"{name}: cefr_level '{fm['cefr_level']}' not in {sorted(CEFR_LEVELS)}")
    if fm["topic"] not in TOPICS:
        errors.append(f"{name}: topic '{fm['topic']}' not in {sorted(TOPICS)}")
    variant = fm["variant"]
    if variant not in VARIANTS:
        errors.append(f"{name}: variant '{variant}' not in {sorted(VARIANTS)}")
    if fm["status"] not in STATUSES:
        errors.append(f"{name}: status '{fm['status']}' not in {sorted(STATUSES)}")

    # Rule 4 cont.: variant suffix discipline
    if isinstance(uid, str):
        suffix_match = VARIANT_SUFFIX_RE.search(uid)
        if variant == "shared" and suffix_match:
            errors.append(f"{name}: shared-variant unit must not have -bp/-ep suffix in slug")
        if variant in ("bp", "ep") and (not suffix_match or suffix_match.group(1) != variant):
            errors.append(f"{name}: variant={variant} requires slug to end with -{variant}")

    # Rule 5: concepts
    if not isinstance(fm["concepts"], list):
        errors.append(f"{name}: concepts must be a list")
    else:
        for c in fm["concepts"]:
            if c not in concepts:
                errors.append(f"{name}: concept '{c}' not declared in docs/concepts.md")

    # Rule 10: legacy field shape
    ms_leg = fm["ms_legacy"]
    if ms_leg is not None and not (isinstance(ms_leg, int) and 1 <= ms_leg <= 90):
        errors.append(f"{name}: ms_legacy must be null or int 1..90, got {ms_leg!r}")
    cefr_leg = fm["cefr_legacy"]
    if not isinstance(cefr_leg, list):
        errors.append(f"{name}: cefr_legacy must be a list")
    else:
        for ref in cefr_leg:
            if not isinstance(ref, str) or not CEFR_LEGACY_RE.match(ref):
                errors.append(f"{name}: cefr_legacy entry '{ref}' fails ^(A1|A2|B1|B2)\\.\\d+$")

    # Sequence position must be a number
    sp = fm["sequence_position"]
    if not isinstance(sp, (int, float)):
        errors.append(f"{name}: sequence_position must be numeric, got {type(sp).__name__}")

    # Prereqs must be a list
    if not isinstance(fm["prereqs"], list):
        errors.append(f"{name}: prereqs must be a list")

    return errors


def check_prereq_refs(units: dict[str, dict]) -> list[str]:
    """Rule 6 + 7."""
    errors = []
    all_ids = set(units)
    for uid, fm in units.items():
        prereqs = fm.get("prereqs", [])
        if not isinstance(prereqs, list):
            continue
        for p in prereqs:
            if p not in all_ids:
                errors.append(f"{uid}: dangling prereq ref '{p}'")
                continue
            if fm["variant"] in ("bp", "ep"):
                pre_variant = units[p]["variant"]
                if pre_variant in ("bp", "ep") and pre_variant != fm["variant"]:
                    errors.append(
                        f"{uid} (variant={fm['variant']}): cross-variant prereq '{p}' "
                        f"(variant={pre_variant})"
                    )
    return errors


def check_no_cycles(units: dict[str, dict]) -> list[str]:
    """Rule 9."""
    errors = []
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {uid: WHITE for uid in units}

    def dfs(uid: str, path: list[str]) -> None:
        if color[uid] == GRAY:
            cycle_start = path.index(uid)
            errors.append(f"prereq cycle: {' -> '.join(path[cycle_start:] + [uid])}")
            return
        if color[uid] == BLACK:
            return
        color[uid] = GRAY
        for p in units[uid].get("prereqs", []):
            if p in units:
                dfs(p, path + [uid])
        color[uid] = BLACK

    for uid in units:
        if color[uid] == WHITE:
            dfs(uid, [])
    return errors


def check_position_variant_rule(units: dict[str, dict]) -> list[str]:
    """Rule 8."""
    errors = []
    bucket: dict[tuple[str, float], list[tuple[str, str]]] = defaultdict(list)
    for uid, fm in units.items():
        key = (fm["cefr_level"], float(fm["sequence_position"]))
        bucket[key].append((uid, fm["variant"]))

    valid_sets = [{"shared"}, {"bp"}, {"ep"}, {"bp", "ep"}]
    for (level, pos), entries in bucket.items():
        if len(entries) == 1:
            continue
        variants = {v for _, v in entries}
        seen = defaultdict(list)
        for uid, v in entries:
            seen[v].append(uid)
        dup_violations = [(v, ids) for v, ids in seen.items() if len(ids) > 1]
        if dup_violations:
            for v, ids in dup_violations:
                errors.append(
                    f"position collision at ({level}, {pos}) variant={v}: {sorted(ids)}"
                )
            continue
        if variants not in valid_sets:
            ids = sorted(uid for uid, _ in entries)
            errors.append(
                f"position ({level}, {pos}) has invalid variant set {sorted(variants)} "
                f"(allowed: shared|bp|ep|bp+ep). units: {ids}"
            )
    return errors


# ---------- Soft warnings (Phase 4) ----------

def parse_body_sections(body: str) -> dict[str, str]:
    """Extract H2 sections from body. Returns {section_name: section_text}."""
    sections: dict[str, str] = {}
    matches = list(SECTION_HEADER_RE.finditer(body))
    for i, m in enumerate(matches):
        name = m.group(1)
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        sections[name] = body[start:end].strip()
    return sections


def section_is_empty(section_text: str) -> bool:
    """A section is empty if its content is blank, only whitespace, or only an HTML comment placeholder."""
    if not section_text.strip():
        return True
    stripped = re.sub(r"<!--.*?-->", "", section_text, flags=re.DOTALL).strip()
    return not stripped


def section_has_todo_marker(section_text: str) -> bool:
    """True if the section's raw text contains an HTML comment whose first word is 'TODO'."""
    return bool(re.search(r"<!--\s*TODO\b.*?-->", section_text, re.DOTALL))


# Sections where empty + TODO marker is acceptable (known placeholder convention).
# Substantive sections (Outcomes / Vocabulary / Grammar) always warn on emptiness.
TODO_TOLERANT_SECTIONS = {"Drills & artifacts", "Traps"}


def check_soft_warnings(units: dict[str, dict], bodies: dict[str, str]) -> list[str]:
    """All soft warnings combined. Returns list of warning strings."""
    warnings = []

    # Rule 11: empty body section in published unit (TODO-marker-aware for Drills/Traps)
    # Rule 11 sub: missing required body headers
    for uid, fm in units.items():
        if fm.get("status") != "published":
            continue
        body = bodies.get(uid, "")
        sections = parse_body_sections(body)

        # Missing required headers (always warn — header itself absent is structural drift)
        missing_headers = [h for h in REQUIRED_BODY_SECTIONS if h not in sections]
        if missing_headers:
            warnings.append(
                f"{uid}: missing required body sections: {missing_headers}"
            )

        # Empty sections — TODO-marker-tolerant for Drills & artifacts + Traps only
        empty_sections = []
        for h in REQUIRED_BODY_SECTIONS:
            if h not in sections:
                continue
            if not section_is_empty(sections[h]):
                continue
            if h in TODO_TOLERANT_SECTIONS and section_has_todo_marker(sections[h]):
                continue  # Known placeholder convention; suppress warning
            empty_sections.append(h)
        if empty_sections:
            warnings.append(
                f"{uid}: published unit has empty body section(s): {empty_sections}"
            )

    # Rule 12: B2 unit with A1 prereq (level skipping)
    for uid, fm in units.items():
        if fm.get("cefr_level") != "B2":
            continue
        prereqs = fm.get("prereqs", [])
        a1_prereqs = [
            p for p in prereqs
            if p in units and units[p].get("cefr_level") == "A1"
        ]
        if a1_prereqs:
            warnings.append(
                f"{uid}: B2 unit with A1 prereq(s) {a1_prereqs} - "
                f"possible level-skipping (assume transitive coverage)"
            )

    # Rule 13: concept count > 5
    for uid, fm in units.items():
        concepts = fm.get("concepts", [])
        if isinstance(concepts, list) and len(concepts) > SOFT_CONCEPT_COUNT_LIMIT:
            warnings.append(
                f"{uid}: concept count {len(concepts)} > {SOFT_CONCEPT_COUNT_LIMIT} - "
                f"likely under-atomized"
            )

    # Phase 4: prereq count > 10
    for uid, fm in units.items():
        prereqs = fm.get("prereqs", [])
        if isinstance(prereqs, list) and len(prereqs) > SOFT_PREREQ_COUNT_LIMIT:
            warnings.append(
                f"{uid}: prereq count {len(prereqs)} > {SOFT_PREREQ_COUNT_LIMIT} - "
                f"atypical, surface for review"
            )

    # Phase 4: sequence position in placeholder range (>= 100)
    # Authored content should sit in MS-sequence interleave (1-90.x range).
    # Positions in 200-500.xx are reserved for unauthored placeholders.
    for uid, fm in units.items():
        sp = fm.get("sequence_position")
        if isinstance(sp, (int, float)) and sp >= 100:
            warnings.append(
                f"{uid}: sequence_position {sp} in placeholder range (>= 100) - "
                f"reseat to MS-sequence interleave"
            )

    return warnings


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--units-dir", type=Path, default=REPO_ROOT / "docs" / "units")
    parser.add_argument("--concepts", type=Path, default=REPO_ROOT / "docs" / "concepts.md")
    parser.add_argument("--strict", action="store_true",
                        help="Treat soft warnings as errors (exit 1)")
    args = parser.parse_args()

    if not args.units_dir.exists():
        print(f"FAIL: units dir does not exist: {args.units_dir}")
        return 1

    concepts = load_concepts(args.concepts)

    unit_paths = sorted(args.units_dir.glob("*.md"))
    if not unit_paths:
        print(f"FAIL: no unit files found in {args.units_dir}")
        return 1

    all_errors: list[str] = []
    units: dict[str, dict] = {}
    bodies: dict[str, str] = {}

    for path in unit_paths:
        fm, body, parse_errs = parse_unit(path)
        all_errors.extend(parse_errs)
        if not fm:
            continue
        per_file_errs = validate_unit(path, fm, concepts)
        all_errors.extend(per_file_errs)
        if "id" in fm and isinstance(fm["id"], str):
            if fm["id"] in units:
                all_errors.append(f"duplicate id '{fm['id']}' across files")
            else:
                units[fm["id"]] = fm
                bodies[fm["id"]] = body

    all_errors.extend(check_prereq_refs(units))
    all_errors.extend(check_no_cycles(units))
    all_errors.extend(check_position_variant_rule(units))

    warnings = check_soft_warnings(units, bodies)

    print(f"Validated {len(unit_paths)} unit files ({len(units)} parsed cleanly).")

    if all_errors:
        print(f"\nFAIL: {len(all_errors)} hard-fail violations:\n")
        for err in all_errors:
            print(f"  - {err}")
        # Print warnings to stderr too
        if warnings:
            print(f"\nAlso {len(warnings)} soft warnings (see stderr).", file=sys.stderr)
            for w in warnings:
                print(f"  WARN: {w}", file=sys.stderr)
        return 1

    if warnings:
        print(f"\nOK: all hard-fail rules pass. {len(warnings)} soft warnings:\n", file=sys.stderr)
        for w in warnings:
            print(f"  WARN: {w}", file=sys.stderr)
        if args.strict:
            print(f"\n--strict: treating warnings as errors. Exit 1.", file=sys.stderr)
            return 1
        return 0

    print("OK: all hard-fail rules pass. No soft warnings.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
