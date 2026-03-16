#!/usr/bin/env python3
"""
Generate Students/ files for former students found in Obsidian contacts.
Reads each #student-tagged Obsidian contact and creates a lightweight prospect file.
"""

import os
import re
import glob

OBSIDIAN_DIR = os.path.expanduser("~/obsidian/contacts/People")
STUDENTS_DIR = os.path.expanduser("~/cascadeprojects/portuguese-drills-expanded/Students")

# Students already in Students/ folder — skip these
EXISTING = {
    "Amanda Hynynen Pilnik",
    "Ana Nogueira",
    "Ben Posnick",
    "Christian Loubeau",
    "Danny Victorio",
    "Dexter Mayo",
    "Emily Taylor",
    "Gaby Sant'Anna",
    "Grant Mitchell",
    "Julian Massarani",
    "Marvin Michel",
    "Nicholas Kulish",
    "Rachel Doyle",
    "Nick Curran",
    "Rafael Rubio",
    "Teodora Pasca",
}

# Tier 1 contacts (warm — have personal context for re-engagement)
TIER1 = {
    "Amaya García", "Anna Caroline Straughan", "Benjamin Warrington",
    "Kate Macina", "Julia Servin", "Mona Hinamanu", "David Kirschberg",
    "Rachel Mariotti", "Lia Bonfilio", "Max Madero Dybner",
    "Suzanne Forrester", "Gail Ahye", "Katherine Parent",
    "Sophie Louise Simon", "Elise Hurley", "Julia Rothenberg",
    "Thomas J. Lax", "Stacey M. Hull", "Kayem Nzinga",
    "Gayle Forman", "Jim Medrano", "David Vanderhoff", "Peter Flint",
    "Elizabeth", "Nick", "Michael Johnson", "Tiziano Colibazzi",
    "Clare Schirrmeister", "Pamela Sabroso", "Larrissa", "Leslie Seale",
}


def parse_obsidian_contact(filepath):
    """Parse an Obsidian contact file and extract key fields."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    data = {"raw": content, "filepath": filepath}

    # Check if tagged as student
    if "student" not in content.lower().split("tags:")[1].split("\n")[0] if "tags:" in content else "":
        return None

    # Extract filename as name
    basename = os.path.basename(filepath).replace(".md", "")
    data["name"] = basename

    # Extract frontmatter fields
    fm_match = re.search(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if fm_match:
        fm = fm_match.group(1)
        for field in ["aliases", "met", "via", "location"]:
            m = re.search(rf"^{field}:[ \t]*(.+)", fm, re.MULTILINE)
            if m:
                val = m.group(1).strip()
                if val and val not in ("[]", "''", '""'):
                    data[field] = val

    # Extract tags
    tags_match = re.search(r"tags:\s*\[(.*?)\]", content)
    if tags_match:
        data["tags"] = [t.strip() for t in tags_match.group(1).split(",")]

    # Extract description (first non-empty line between heading and first ## section)
    lines = content.split("\n")
    after_heading = False
    for line in lines:
        if line.startswith("# ") and not line.startswith("## "):
            after_heading = True
            continue
        if after_heading and line.startswith("## "):
            break  # Stop at first section
        stripped = line.strip()
        if after_heading and stripped and not line.startswith("---") and not line.startswith("**Teaching file") and not line.startswith("|") and not stripped.startswith("- **"):
            data["description"] = stripped
            break

    # Extract contact info from table
    emails = []
    phones = []
    other_info = []
    in_contact_table = False
    for line in lines:
        if "## Contact info" in line:
            in_contact_table = True
            continue
        if in_contact_table and line.startswith("## "):
            break
        if in_contact_table and "|" in line:
            parts = [p.strip() for p in line.split("|") if p.strip()]
            if len(parts) >= 2 and parts[0] not in ("Type", "---", "------"):
                field_type = parts[0].lower()
                value = parts[1]
                if "email" in field_type:
                    emails.append(value)
                elif "mobile" in field_type or "phone" in field_type:
                    phones.append(value)
                elif "linkedin" in field_type:
                    data["linkedin"] = value
                elif "birthday" in field_type:
                    data["birthday"] = value
                elif "address" in field_type:
                    data["address"] = value
                elif "@" in value and "." in value:
                    # "Other" field containing an email address
                    emails.append(value)
                elif re.search(r'[\d\-\(\)\+]{7,}', value):
                    # "Other" field containing a phone number
                    phones.append(value)
                elif "linkedin.com" in value.lower():
                    data["linkedin"] = value
                elif value and "---" not in value:
                    other_info.append((parts[0], value))

    data["emails"] = emails
    data["phones"] = phones
    data["other_info"] = other_info

    # Extract context section (works at, connection, etc.)
    in_context = False
    for line in lines:
        if line.startswith("## Context"):
            in_context = True
            continue
        if in_context and line.startswith("## "):
            break
        if in_context:
            works_match = re.search(r'\*\*Works at:\*\*\s*(.+)', line)
            if works_match and works_match.group(1).strip():
                data["works_at"] = works_match.group(1).strip()
            conn_match = re.search(r'\*\*Connection:\*\*\s*(.+)', line)
            if conn_match and conn_match.group(1).strip():
                data["connection"] = conn_match.group(1).strip()

    # Extract notes section
    in_notes = False
    notes_lines = []
    for line in lines:
        if line.startswith("## Notes"):
            in_notes = True
            continue
        if in_notes and line.startswith("## "):
            break
        if in_notes and line.strip() and not line.startswith("---"):
            notes_lines.append(line.strip())
    if notes_lines:
        data["notes"] = "\n".join(notes_lines)

    return data


def determine_tier(data):
    """Determine prospect tier based on available context."""
    name = data["name"]

    # Check against Tier 1 list
    if name in TIER1:
        return 1

    # Also check if they have rich notes or personal context
    notes = data.get("notes", "").lower()
    desc = data.get("description", "").lower()
    combined = notes + " " + desc

    brazil_keywords = ["brazil", "brasil", "sp", "são paulo", "sao paulo", "rio",
                       "namorad", "wife", "husband", "partner", "casad",
                       "floripa", "guaruj", "starred"]
    for kw in brazil_keywords:
        if kw in combined:
            return 1

    # No email = Tier 3
    if not data["emails"]:
        return 3

    return 2


def make_filename(name):
    """Create a safe filename from a name."""
    # Remove special chars but keep spaces and hyphens
    safe = re.sub(r'[^\w\s\-\.]', '', name)
    safe = re.sub(r'\s+', '-', safe.strip())
    return safe + ".md"


def generate_student_file(data, tier):
    """Generate the content for a Students/ file."""
    name = data["name"]
    tags = "#student #former"
    if tier == 1:
        tags += " #tier1"
    elif tier == 2:
        tags += " #tier2"
    else:
        tags += " #tier3"

    # Check for special tags
    obsidian_tags = data.get("tags", [])
    if "idlewild" in obsidian_tags:
        tags += " #idlewild"
    if "portugal" in obsidian_tags:
        tags += " #portugal"

    lines = [tags, "", f"# {name}", ""]

    # Contact info
    if data["emails"]:
        for email in data["emails"]:
            lines.append(f"**Email:** {email}")
    if data["phones"]:
        for phone in data["phones"]:
            lines.append(f"**Phone:** {phone}")
    if data.get("linkedin"):
        lines.append(f"**LinkedIn:** {data['linkedin']}")
    if data.get("works_at"):
        lines.append(f"**Works at:** {data['works_at']}")
    if data.get("location"):
        lines.append(f"**Location:** {data['location']}")
    if data.get("via"):
        lines.append(f"**Referral:** {data['via']}")
    if data.get("met") and data["met"].strip():
        lines.append(f"**Met:** {data['met']}")

    lines.append(f"**Status:** Former student (Tier {tier})")
    lines.append("")

    # Description
    desc = data.get("description", "")
    if desc:
        lines.append("---")
        lines.append("")
        lines.append(f"{desc}")
        lines.append("")

    # Notes
    notes = data.get("notes", "")
    if notes:
        lines.append("---")
        lines.append("")
        lines.append("## Notes")
        lines.append("")
        lines.append(notes)
        lines.append("")

    # Other contact info
    if data.get("other_info") or data.get("birthday") or data.get("address"):
        lines.append("---")
        lines.append("")
        lines.append("## Additional Info")
        lines.append("")
        if data.get("birthday"):
            lines.append(f"- Birthday: {data['birthday']}")
        if data.get("address"):
            lines.append(f"- Address: {data['address']}")
        for field_type, value in data.get("other_info", []):
            lines.append(f"- {field_type}: {value}")
        lines.append("")

    return "\n".join(lines)


def main():
    # Find all student-tagged files
    all_files = glob.glob(os.path.join(OBSIDIAN_DIR, "*.md"))

    created = 0
    skipped_existing = 0
    skipped_nonstudent = 0
    tier_counts = {1: 0, 2: 0, 3: 0}

    for filepath in sorted(all_files):
        data = parse_obsidian_contact(filepath)
        if data is None:
            skipped_nonstudent += 1
            continue

        name = data["name"]
        if name in EXISTING:
            skipped_existing += 1
            continue

        tier = determine_tier(data)
        tier_counts[tier] += 1

        filename = make_filename(name)
        outpath = os.path.join(STUDENTS_DIR, filename)

        # Don't overwrite existing files
        if os.path.exists(outpath):
            print(f"  SKIP (exists): {filename}")
            continue

        content = generate_student_file(data, tier)
        with open(outpath, "w", encoding="utf-8") as f:
            f.write(content)
        created += 1
        print(f"  Tier {tier}: {filename}")

    print(f"\n--- Summary ---")
    print(f"Created: {created}")
    print(f"Skipped (already in Students/): {skipped_existing}")
    print(f"Skipped (not student-tagged): {skipped_nonstudent}")
    print(f"Tier 1 (warm): {tier_counts[1]}")
    print(f"Tier 2 (viable): {tier_counts[2]}")
    print(f"Tier 3 (cold): {tier_counts[3]}")


if __name__ == "__main__":
    main()
