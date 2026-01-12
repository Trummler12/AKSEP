from __future__ import annotations

import argparse
import csv
import re
from datetime import datetime
from pathlib import Path
from typing import Iterable, List, Sequence, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer

# Run-button arrays (additive to CLI arguments)
# Example:
# TAGS_TO_REMOVE = ["biology", "chemistry"]
# TAGS_TO_ADD = ["new tag"]
TAGS_TO_REMOVE: List[object] = [
    "hard discipline", "soft discipline", "pure discipline", "applied discipline", "atomistic discipline", "holistic discipline", "australia"
]
TAGS_TO_ADD: List[object] = [
    "earth", "water", "fire", "air",
    "artistic", "humanities", "economic", "business", "computer science", "education", "engineering", "law", "ethical", "life", "medical", "health", "physical", "psychological", "social",
]

BASE_TAG_ORDER = [
    "Music",
    "Performing arts",
    "Visual arts",
    "Literature",
    "Linguistics",
    "History",
    "Geography",
    "Culture",
    "Religion",
    "Philosophy",
    "Ethics",
    "Law",
    "Politics",
    "Economics",
    "Sociology",
    "Psychology",
    "Communication",
    "Information science",
    "Scientific thinking",
    "Logic",
    "Statistics",
    "Mathematics",
    "Computer science",
    "Technology",
    "Physics",
    "Astronomy",
    "Earth science",
    "Chemistry",
    "Biology",
]

TAG_CSV_PATH = Path(__file__).resolve().parent / "data" / "t_tag_PLANNING.txt"

MODEL_NAME = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
EXACT_MATCH_CUTOFF = 0.98
EPS = 1e-6
LOG_PATH = Path(__file__).resolve().parent / "data" / "tag_change_log.txt"


def parse_name_tokens(values: Iterable[object]) -> List[str]:
    tokens: List[str] = []
    for value in values:
        if value is None:
            continue
        if isinstance(value, int):
            tokens.append(str(value))
            continue
        if isinstance(value, str):
            for part in value.split(","):
                part = part.strip()
                if part:
                    tokens.append(part)
            continue
        raise TypeError(f"Unsupported add token type: {type(value).__name__}")
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


def parse_remove_names(values: Iterable[object]) -> List[str]:
    tokens = parse_name_tokens(values)
    for token in tokens:
        if re.fullmatch(r"[+-]?\d+", token):
            raise ValueError(
                "TAGS_TO_REMOVE must contain names only (no numeric IDs)."
            )
    return tokens


def normalize_fieldname(name: str) -> str:
    return name.lstrip("\ufeff").strip()


def normalize_name(name: str) -> str:
    return name.strip().lower()


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


def normalize_rows(rows: List[dict]) -> None:
    for row in rows:
        name = normalize_name(row.get("name") or "")
        row["name"] = name


def write_rows(csv_path: Path, rows: List[dict], fieldnames: List[str]) -> None:
    with csv_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def reindex_rows(rows: List[dict]) -> None:
    for index, row in enumerate(rows, start=1):
        row["tagID"] = str(index)


def add_tags(rows: List[dict], fieldnames: List[str], tags_to_add: Iterable[str]) -> List[str]:
    added: List[str] = []
    existing = {normalize_name(row.get("name") or ""): row for row in rows}
    for tag in tags_to_add:
        name = normalize_name(tag)
        if not name or name in existing:
            continue
        new_row = {field: "" for field in fieldnames}
        new_row["name"] = name
        if "tagID" in new_row:
            new_row["tagID"] = ""
        rows.append(new_row)
        existing[name] = new_row
        added.append(name)
    return added


def append_change_log(
    log_path: Path,
    removed_names: List[str],
    added_names: List[str],
) -> None:
    if not removed_names and not added_names:
        return
    timestamp = datetime.now().isoformat(timespec="seconds")
    with log_path.open("a", encoding="utf-8") as handle:
        handle.write(f"[{timestamp}]\n")
        for name in removed_names:
            handle.write(f"- {name}\n")
        for name in added_names:
            handle.write(f"+ {name}\n")


def compute_adjusted_similarity(tag_emb: np.ndarray, base_emb: np.ndarray) -> np.ndarray:
    base_sim = tag_emb @ base_emb.T
    adjustments = np.ones(base_sim.shape[1], dtype=base_sim.dtype)
    for idx in range(base_sim.shape[1]):
        scores = base_sim[:, idx]
        below_cutoff = scores[scores < EXACT_MATCH_CUTOFF]
        if below_cutoff.size:
            best = float(below_cutoff.max())
            if best > EPS:
                adjustments[idx] = best
    return base_sim / adjustments


def order_group(
    tag_indices: List[int],
    base_idx: int,
    adjusted_sim: np.ndarray,
    tag_names: List[str],
) -> List[int]:
    if not tag_indices:
        return []

    prev_idx = base_idx - 1 if base_idx > 0 else None
    next_idx = base_idx + 1 if base_idx < adjusted_sim.shape[1] - 1 else None

    if prev_idx is None and next_idx is None:
        return sorted(tag_indices, key=lambda i: tag_names[i])

    prev_group: List[Tuple[int, float]] = []
    next_group: List[Tuple[int, float]] = []

    for tag_idx in tag_indices:
        current = float(adjusted_sim[tag_idx, base_idx])
        current = max(current, EPS)
        prev_score = float(adjusted_sim[tag_idx, prev_idx]) if prev_idx is not None else None
        next_score = float(adjusted_sim[tag_idx, next_idx]) if next_idx is not None else None

        if prev_idx is None:
            ratio = (next_score or 0.0) / current
            next_group.append((tag_idx, ratio))
        elif next_idx is None:
            ratio = (prev_score or 0.0) / current
            prev_group.append((tag_idx, ratio))
        else:
            if (prev_score or 0.0) >= (next_score or 0.0):
                ratio = (prev_score or 0.0) / current
                prev_group.append((tag_idx, ratio))
            else:
                ratio = (next_score or 0.0) / current
                next_group.append((tag_idx, ratio))

    prev_group.sort(key=lambda item: (-item[1], tag_names[item[0]]))
    next_group.sort(key=lambda item: (item[1], tag_names[item[0]]))

    return [idx for idx, _ in prev_group] + [idx for idx, _ in next_group]


def order_rows_by_base(
    rows: List[dict],
    base_order: List[str],
    model_name: str,
) -> List[dict]:
    if not rows:
        return rows

    base_names = [normalize_name(name) for name in base_order if normalize_name(name)]
    if not base_names:
        return rows

    tag_names = [normalize_name(row.get("name") or "") for row in rows]
    model = SentenceTransformer(model_name)

    tag_emb = model.encode(tag_names, normalize_embeddings=True)
    base_emb = model.encode(base_names, normalize_embeddings=True)

    adjusted_sim = compute_adjusted_similarity(tag_emb, base_emb)
    assignments = np.argmax(adjusted_sim, axis=1)

    groups: List[List[int]] = [[] for _ in range(len(base_names))]
    for tag_idx, base_idx in enumerate(assignments):
        groups[base_idx].append(tag_idx)

    ordered_indices: List[int] = []
    for base_idx, tag_indices in enumerate(groups):
        ordered_indices.extend(order_group(tag_indices, base_idx, adjusted_sim, tag_names))

    if len(ordered_indices) < len(rows):
        seen = set(ordered_indices)
        missing = [idx for idx in range(len(rows)) if idx not in seen]
        missing.sort(key=lambda i: tag_names[i])
        ordered_indices.extend(missing)

    return [rows[idx] for idx in ordered_indices]


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Update tags in t_tag_PLANNING.txt (remove, add, reorder) and reindex tagID."
        )
    )
    parser.add_argument(
        "--csv",
        default=TAG_CSV_PATH,
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
    ids_to_remove, cli_names = classify_targets(cli_tokens)
    run_names = parse_remove_names(TAGS_TO_REMOVE)
    names_to_remove = {name.casefold() for name in run_names} | cli_names
    names_to_add = parse_name_tokens(TAGS_TO_ADD)

    rows, fieldnames = load_rows(args.csv)
    if not fieldnames:
        raise ValueError("CSV header is missing.")
    if "tagID" not in fieldnames or "name" not in fieldnames:
        raise ValueError("CSV must contain 'tagID' and 'name' columns.")

    normalize_rows(rows)

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

    added = add_tags(kept, fieldnames, names_to_add)
    ordered = order_rows_by_base(kept, BASE_TAG_ORDER, MODEL_NAME)

    reindex_rows(ordered)
    write_rows(args.csv, ordered, fieldnames)

    removed_names = [row.get("name", "") for row in removed]
    print(f"Removed {len(removed)} entries; added {len(added)}; kept {len(ordered)}.")
    if removed_names:
        print("Removed tags:", ", ".join(removed_names))
    if added:
        print("Added tags:", ", ".join(added))

    append_change_log(LOG_PATH, removed_names, added)


if __name__ == "__main__":
    main()
