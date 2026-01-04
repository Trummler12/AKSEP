from __future__ import annotations

from typing import Iterable

from .normalize import normalize_identifier


def find_start_index(rows: list[dict], identifiers: Iterable[str]) -> int:
    matches = []
    not_found = []
    not_unique = []
    for raw_ident in identifiers:
        ident = normalize_identifier(raw_ident)
        if not ident:
            continue
        matched_rows = []
        for row in rows:
            for key in ("sauthorID", "title", "custom_url", "channel_id"):
                value = normalize_identifier(row.get(key, ""))
                if value and value == ident:
                    matched_rows.append(row)
                    break
        if not matched_rows:
            not_found.append(raw_ident)
        elif len(matched_rows) > 1:
            not_unique.append((raw_ident, matched_rows))
        else:
            matches.append(matched_rows[0]["__index"])
    if not_found or not_unique:
        if not_found:
            print("not found:", not_found, file=__import__("sys").stderr)
        for ident, rows in not_unique:
            print(f"not unique: {ident}", file=__import__("sys").stderr)
            for row in rows:
                print(f"\t{row}", file=__import__("sys").stderr)
        raise SystemExit(4)
    return min(matches) if matches else 0


def parse_int(value: str | int | None) -> int:
    try:
        return int(value)  # type: ignore
    except (TypeError, ValueError):
        return 0


def chunked(values: list[str], size: int) -> list[list[str]]:
    return [values[i : i + size] for i in range(0, len(values), size)]
