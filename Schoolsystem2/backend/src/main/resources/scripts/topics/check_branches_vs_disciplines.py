#!/usr/bin/env python3
import csv
import re
import sys
from pathlib import Path


DEFAULT_BRANCHES_NAME = "Branches.csv"
DEFAULT_DISCIPLINES_NAME = "Disciplines_final.csv"
DEFAULT_OUTPUT_NAME = "Branches_vs_Disciplines_review.csv"


def norm(value: str) -> str:
    return " ".join(value.strip().casefold().split())


def tokens(value: str) -> list[str]:
    return [
        token
        for token in re.split(r"[^a-z0-9]+", norm(value))
        if len(token) >= 3
    ]


def format_entry(name: str, description: str) -> str:
    desc = (description or "").strip() or "-"
    return f"{name} | {desc}"


def uniq_keep_order(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        key = item.casefold()
        if key in seen:
            continue
        seen.add(key)
        result.append(item)
    return result


def read_branches(path: Path) -> list[dict[str, str]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for row in reader:
            name = (row.get("Branch") or "").strip()
            if not name:
                continue
            rows.append({
                "name": name,
                "description": (row.get("Description") or "").strip(),
            })
        return rows


def read_disciplines(path: Path) -> list[dict[str, object]]:
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for row in reader:
            name = (row.get("name") or "").strip()
            if not name:
                continue
            rows.append({
                "name": name,
                "description": (row.get("description") or "").strip(),
                "norm": norm(name),
                "tokens": set(tokens(name)),
            })
        return rows


def main() -> int:
    branches_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    disciplines_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    output_path = Path(sys.argv[3]) if len(sys.argv) > 3 else None

    if branches_path is None:
        branches_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_BRANCHES_NAME
    if disciplines_path is None:
        disciplines_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_DISCIPLINES_NAME
    if output_path is None:
        output_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_OUTPUT_NAME

    branches = read_branches(branches_path)
    disciplines = read_disciplines(disciplines_path)

    fieldnames = [
        "Branch",
        "Description",
        "Synonyms|Description",
        "AutoMatches",
        "ContainsMatch",
        "StartsWithMatch",
        "TokenOverlapMatch",
    ]

    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, lineterminator="\n")
        writer.writeheader()

        for branch in branches:
            branch_name = branch["name"]
            branch_norm = norm(branch_name)
            branch_tokens = set(tokens(branch_name))

            auto_matches = [
                format_entry(item["name"], item["description"])
                for item in disciplines
                if item["norm"] == branch_norm
            ]

            contains_matches = [
                format_entry(item["name"], item["description"])
                for item in disciplines
                if branch_norm and branch_norm in item["norm"]
            ]

            startswith_matches = [
                format_entry(item["name"], item["description"])
                for item in disciplines
                if branch_norm and item["norm"].startswith(branch_norm)
            ]

            token_matches: list[str] = []
            if len(branch_tokens) >= 2:
                for item in disciplines:
                    if len(branch_tokens.intersection(item["tokens"])) >= 2:
                        token_matches.append(format_entry(item["name"], item["description"]))

            auto_matches = uniq_keep_order(auto_matches)
            contains_matches = uniq_keep_order(contains_matches)
            startswith_matches = uniq_keep_order(startswith_matches)
            token_matches = uniq_keep_order(token_matches)

            writer.writerow({
                "Branch": branch_name,
                "Description": branch["description"],
                "Synonyms|Description": "-",
                "AutoMatches": "; ".join(auto_matches) if auto_matches else "-",
                "ContainsMatch": "; ".join(contains_matches) if contains_matches else "-",
                "StartsWithMatch": "; ".join(startswith_matches) if startswith_matches else "-",
                "TokenOverlapMatch": "; ".join(token_matches) if token_matches else "-",
            })

    print(f"Wrote {len(branches)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
