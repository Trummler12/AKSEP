from __future__ import annotations

import argparse
import csv
import re
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

# Run-button arrays (additive to CLI arguments)
# Example:
# RUN_REMOVE = [1, "biology", "chemistry"]
RUN_REMOVE: List[object] = [
    "ethics (applied)", "gardening (advanced)", "exercise", "oceanography",
    "security studies", "economics", "games", "mechanics (hands on)"
]


def parse_tokens(values: Iterable[object]) -> List[object]:
    tokens: List[object] = []
    for value in values:
        if value is None:
            continue
        if isinstance(value, int):
            tokens.append(value)
            continue
        if isinstance(value, str):
            for part in value.split(","):
                part = part.strip()
                if part:
                    tokens.append(part)
            continue
        raise TypeError(f"Unsupported remove token type: {type(value).__name__}")
    return tokens


def split_cli_groups(values: Sequence[Sequence[str]]) -> List[str]:
    tokens: List[str] = []
    for group in values:
        for value in group:
            for part in value.split(","):
                part = part.strip()
                if part:
                    tokens.append(part)
    return tokens


def classify_targets(tokens: Iterable[object]) -> Tuple[set[int], set[str]]:
    ids: set[int] = set()
    names: set[str] = set()
    for token in tokens:
        if isinstance(token, int):
            ids.add(token)
            continue
        if isinstance(token, str):
            if re.fullmatch(r"[+-]?\d+", token):
                ids.add(int(token))
            else:
                names.add(token.casefold())
            continue
        raise TypeError(f"Unsupported remove token type: {type(token).__name__}")
    return ids, names


def normalize_fieldname(name: str) -> str:
    return name.lstrip("\ufeff").strip()


def load_rows(csv_path: Path) -> Tuple[List[dict], List[str]]:
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = list(reader)
        raw_fieldnames = reader.fieldnames or []
    fieldnames = [normalize_fieldname(name) for name in raw_fieldnames]
    if fieldnames != raw_fieldnames:
        cleaned_rows: List[dict] = []
        for row in rows:
            cleaned_row = {normalize_fieldname(k): v for k, v in row.items()}
            cleaned_rows.append(cleaned_row)
        rows = cleaned_rows
    return rows, fieldnames


def write_rows(csv_path: Path, rows: List[dict], fieldnames: List[str]) -> None:
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def reindex_rows(rows: List[dict]) -> None:
    for index, row in enumerate(rows, start=1):
        row["tagID"] = str(index)


def main() -> None:
    default_csv = Path(__file__).resolve().parent / "data" / "t_tag_PLANNING.txt"

    parser = argparse.ArgumentParser(
        description=(
            "Remove tags from t_tag_PLANNING.txt by ID or name and reindex tagID."
        )
    )
    parser.add_argument(
        "--csv",
        default=default_csv,
        type=Path,
        help="Path to tag CSV (default: Embedding/testing/data/t_tag_PLANNING.txt).",
    )
    parser.add_argument(
        "--remove",
        "-r",
        action="append",
        nargs="+",
        default=[],
        help=(
            "IDs or names to remove. Repeatable and comma-separated. "
            "Examples: -r 12 -r biology,chemistry"
        ),
    )

    args = parser.parse_args()

    cli_tokens = split_cli_groups(args.remove)
    run_tokens = parse_tokens(RUN_REMOVE)
    all_tokens: List[object] = []
    all_tokens.extend(run_tokens)
    all_tokens.extend(cli_tokens)

    if not all_tokens:
        print("No removals specified. Use --remove or edit the RUN_REMOVE arrays.")
        return

    ids_to_remove, names_to_remove = classify_targets(all_tokens)

    rows, fieldnames = load_rows(args.csv)
    if not fieldnames:
        raise ValueError("CSV header is missing.")
    if "tagID" not in fieldnames or "name" not in fieldnames:
        raise ValueError("CSV must contain 'tagID' and 'name' columns.")

    kept: List[dict] = []
    removed: List[dict] = []
    for row in rows:
        raw_id = (row.get("tagID") or "").strip()
        name = (row.get("name") or "").strip()
        match_id = raw_id.isdigit() and int(raw_id) in ids_to_remove
        match_name = name.casefold() in names_to_remove
        if match_id or match_name:
            removed.append(row)
        else:
            kept.append(row)

    reindex_rows(kept)
    write_rows(args.csv, kept, fieldnames)

    removed_names = [row.get("name", "") for row in removed]
    print(f"Removed {len(removed)} entries; kept {len(kept)}.")
    if removed_names:
        print("Removed tags:", ", ".join(removed_names))


if __name__ == "__main__":
    main()
