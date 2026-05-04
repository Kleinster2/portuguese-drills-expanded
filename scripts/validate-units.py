#!/usr/bin/env python3
"""
validate-units.py — Phase 2 minimal validator for docs/units/*.md.

Hard-fail rules per docs/architecture/curriculum-canonical.md:
  1. File <-> id consistency
  2. Required frontmatter fields present
  3. Enum values valid
  4. Slug format (regex + length cap, variant-suffix discipline)
  5. Concept refs exist in docs/concepts.md
  6. Prereq refs exist as unit files
  7. Cross-variant prereq prohibition (bp != ep)
  8. Sequence-position variant-set rule per (cefr_level, sequence_position)
  9. No prereq cycles
 10. Legacy field shape (ms_legacy null|1..90, cefr_legacy [str matching /^(A1|A2|B1|B2)\\.\\d+$/])

Phase 4 will add soft warnings (empty published bodies, B2 -> A1 prereqs, concept count > 5).

Usage: python scripts/validate-units.py [--units-dir docs/units] [--concepts docs/concepts.md]
Exit codes: 0 = clean, 1 = hard-fail violations found.
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

SLUG_RE = re.compile(r"^(a1|a2|b1|b2)-[a-z0-9-]+$")
SLUG_MAX_LEN = 40
CEFR_LEGACY_RE = re.compile(r"^(A1|A2|B1|B2)\.\d+$")
VARIANT_SUFFIX_RE = re.compile(r"-(bp|ep)$")


def load_concepts(concepts_path: Path) -> set[str]:
    """Extract concept slugs from docs/concepts.md between BEGIN/END markers."""
    text = concepts_path.read_text(encoding="utf-8")
    start = text.find("<!-- BEGIN CONCEPT LIST -->")
    end = text.find("<!-- END CONCEPT LIST -->")
    if start < 0 or end < 0:
        raise SystemExit(f"concepts.md missing BEGIN/END markers")
    body = text[start:end]
    # Concept slugs are backtick-wrapped. Most live on their own bullet line
    # (- `slug` — desc), but the vocabulary section bundles many per line as
    # comma-separated backticks. Grab every backtick-wrapped slug.
    return set(re.findall(r"`([a-z0-9-]+)`", body))


def parse_unit(path: Path) -> tuple[dict, list[str]]:
    """Parse a unit file. Returns (frontmatter_dict, errors_list).
    If errors are present, the dict may be partially populated or empty."""
    errors: list[str] = []
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return {}, [f"{path.name}: missing YAML frontmatter (no leading '---')"]
    end = text.find("\n---\n", 4)
    if end < 0:
        return {}, [f"{path.name}: unterminated YAML frontmatter (no closing '---')"]
    fm_text = text[4:end]
    try:
        fm = yaml.safe_load(fm_text)
    except yaml.YAMLError as exc:
        return {}, [f"{path.name}: YAML parse error: {exc}"]
    if not isinstance(fm, dict):
        return {}, [f"{path.name}: frontmatter must be a YAML mapping"]
    return fm, errors


def validate_unit(path: Path, fm: dict, concepts: set[str]) -> list[str]:
    """Per-file checks (rules 1-5 + 10). Cross-file checks happen in main."""
    errors: list[str] = []
    name = path.name
    stem = path.stem

    # Rule 2: required fields
    missing = REQUIRED_FIELDS - fm.keys()
    if missing:
        errors.append(f"{name}: missing required fields: {sorted(missing)}")
        # Bail early — most other checks need these fields
        return errors

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
            # Rule 7: cross-variant prohibition
            if fm["variant"] in ("bp", "ep"):
                pre_variant = units[p]["variant"]
                if pre_variant in ("bp", "ep") and pre_variant != fm["variant"]:
                    errors.append(
                        f"{uid} (variant={fm['variant']}): cross-variant prereq '{p}' "
                        f"(variant={pre_variant})"
                    )
    return errors


def check_no_cycles(units: dict[str, dict]) -> list[str]:
    """Rule 9: prereq DAG, no cycles."""
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
    """Rule 8: per (cefr_level, sequence_position), the variant set must be one of
    {shared}, {bp}, {ep}, or {bp, ep}."""
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
        # Duplicate within same variant is always a violation
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--units-dir", type=Path, default=REPO_ROOT / "docs" / "units")
    parser.add_argument("--concepts", type=Path, default=REPO_ROOT / "docs" / "concepts.md")
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

    for path in unit_paths:
        fm, parse_errs = parse_unit(path)
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

    all_errors.extend(check_prereq_refs(units))
    all_errors.extend(check_no_cycles(units))
    all_errors.extend(check_position_variant_rule(units))

    print(f"Validated {len(unit_paths)} unit files ({len(units)} parsed cleanly).")
    if all_errors:
        print(f"\nFAIL: {len(all_errors)} hard-fail violations:\n")
        for err in all_errors:
            print(f"  - {err}")
        return 1

    print("OK: all hard-fail rules pass.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
