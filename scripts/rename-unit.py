#!/usr/bin/env python3
"""
rename-unit.py - Phase 4 deliverable.

Rename a unit slug across the corpus: file rename + frontmatter id update +
prereq sweep + wikilink sweep + sweeps of dashboard.json, content-manifest.json,
and Students/*.md.

Usage:
  python scripts/rename-unit.py [old-slug] [new-slug] [--dry-run]

Validator runs at the end (in non-dry-run mode) to catch any dangling refs.

Exit codes:
  0 = clean rename (or dry-run preview)
  1 = validation failed (slug format, target collision, source missing, etc.)
"""

import argparse
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
UNITS_DIR = REPO_ROOT / "docs" / "units"

DASHBOARD_PATH = REPO_ROOT / "config" / "dashboard.json"
MANIFEST_PATH = REPO_ROOT / "docs" / "content-manifest.json"
STUDENTS_DIR = REPO_ROOT / "Students"

SLUG_RE = re.compile(r"^(a1|a2|b1|b2)-[a-z0-9-]+$")
SLUG_MAX_LEN = 40


def fail(msg: str) -> int:
    print(f"FAIL: {msg}", file=sys.stderr)
    return 1


def find_word_occurrences(text: str, slug: str) -> int:
    """Count whole-word occurrences of slug (not substring matches)."""
    return len(re.findall(rf"\b{re.escape(slug)}\b", text))


def replace_word(text: str, old: str, new: str) -> tuple[str, int]:
    """Whole-word replacement. Returns (new_text, count_replaced)."""
    pattern = re.compile(rf"\b{re.escape(old)}\b")
    return pattern.subn(new, text)


def sweep_file(path: Path, old: str, new: str, dry_run: bool) -> int:
    """Sweep one file. Returns count of replacements made (or would-be-made)."""
    if not path.exists():
        return 0
    text = path.read_text(encoding="utf-8")
    count = find_word_occurrences(text, old)
    if count == 0:
        return 0
    new_text, _ = replace_word(text, old, new)
    if not dry_run:
        path.write_text(new_text, encoding="utf-8")
    return count


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("old_slug")
    parser.add_argument("new_slug")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview changes without writing")
    args = parser.parse_args()

    old = args.old_slug
    new = args.new_slug

    # Validate slug formats
    if not SLUG_RE.match(old):
        return fail(f"old-slug '{old}' fails slug regex ^(a1|a2|b1|b2)-[a-z0-9-]+$")
    if not SLUG_RE.match(new):
        return fail(f"new-slug '{new}' fails slug regex ^(a1|a2|b1|b2)-[a-z0-9-]+$")
    if len(new) > SLUG_MAX_LEN:
        return fail(f"new-slug '{new}' exceeds {SLUG_MAX_LEN} char limit ({len(new)} chars)")
    if old == new:
        return fail(f"old-slug and new-slug are identical: '{old}'")

    # Validate file existence
    old_path = UNITS_DIR / f"{old}.md"
    new_path = UNITS_DIR / f"{new}.md"
    if not old_path.exists():
        return fail(f"source file does not exist: {old_path}")
    if new_path.exists():
        return fail(f"target file already exists: {new_path}")

    mode = "DRY RUN" if args.dry_run else "APPLY"
    print(f"=== {mode}: rename {old} -> {new} ===\n")

    summary: list[tuple[str, str, int]] = []

    # 1. Rename the unit file itself + update frontmatter id
    text = old_path.read_text(encoding="utf-8")
    new_text, id_count = replace_word(text, old, new)
    if args.dry_run:
        print(f"  Would rename: {old_path.relative_to(REPO_ROOT)} -> {new_path.relative_to(REPO_ROOT)}")
        print(f"  Would update {id_count} occurrences of '{old}' inside that file.")
    else:
        new_path.write_text(new_text, encoding="utf-8")
        old_path.unlink()
        print(f"  Renamed file. Updated {id_count} occurrences inside.")
    summary.append((str(new_path.relative_to(REPO_ROOT)), "renamed + sweep", id_count))

    # 2. Sweep all OTHER unit files (prereqs arrays + body wikilinks)
    other_unit_total = 0
    other_unit_files = 0
    for path in sorted(UNITS_DIR.glob("*.md")):
        if path == old_path or path == new_path:
            continue
        count = sweep_file(path, old, new, args.dry_run)
        if count > 0:
            other_unit_total += count
            other_unit_files += 1
            print(f"  {path.relative_to(REPO_ROOT)}: {count} occurrence(s)")
    summary.append(("docs/units/* (other)", f"{other_unit_files} files", other_unit_total))

    # 3. Sweep config/dashboard.json
    count = sweep_file(DASHBOARD_PATH, old, new, args.dry_run)
    if count > 0:
        print(f"  {DASHBOARD_PATH.relative_to(REPO_ROOT)}: {count} occurrence(s)")
    summary.append((str(DASHBOARD_PATH.relative_to(REPO_ROOT)), "swept", count))

    # 4. Sweep docs/content-manifest.json
    count = sweep_file(MANIFEST_PATH, old, new, args.dry_run)
    if count > 0:
        print(f"  {MANIFEST_PATH.relative_to(REPO_ROOT)}: {count} occurrence(s)")
    summary.append((str(MANIFEST_PATH.relative_to(REPO_ROOT)), "swept", count))

    # 5. Sweep Students/*.md (forward-compat for unit-progress tables)
    student_total = 0
    student_files = 0
    if STUDENTS_DIR.exists():
        for path in sorted(STUDENTS_DIR.glob("*.md")):
            count = sweep_file(path, old, new, args.dry_run)
            if count > 0:
                student_total += count
                student_files += 1
                print(f"  {path.relative_to(REPO_ROOT)}: {count} occurrence(s)")
    summary.append(("Students/*.md", f"{student_files} files", student_total))

    # Summary
    print(f"\n=== Summary ===")
    for path, kind, count in summary:
        print(f"  {path}: {kind} ({count} occurrence(s))")

    if args.dry_run:
        print(f"\nDRY RUN — no changes written. Re-run without --dry-run to apply.")
        return 0

    # Run validator to catch dangling refs
    print(f"\n=== Running validator ===")
    result = subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts" / "validate-units.py")],
        cwd=REPO_ROOT,
    )
    if result.returncode != 0:
        print(f"\nFAIL: validator detected issues after rename. Investigate above.", file=sys.stderr)
        return 1

    print(f"\nOK: rename complete + validator clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
