"""CSV helpers for transcript ingestion."""

from __future__ import annotations

import csv
import os
import re
from typing import Dict, Iterable, Iterator, List, Sequence, Set

# Allow large transcript fields.
csv.field_size_limit(10 * 1024 * 1024)

TRANSCRIPT_HEADER = [
    "video_id",
    "duration",
    "language_code",
    "is_generated",
    "is_translatable",
    "status",
    "error",
    "transcript",
]

_ISO_DURATION_RE = re.compile(
    r"^P(?:T(?:(?P<hours>\d+)H)?(?:(?P<minutes>\d+)M)?(?:(?P<seconds>\d+)S)?)$"
)


def parse_iso8601_duration(value: str) -> int:
    """Parse ISO-8601 duration like PT1H2M3S into seconds."""
    match = _ISO_DURATION_RE.match(value or "")
    if not match:
        return 0
    hours = int(match.group("hours") or 0)
    minutes = int(match.group("minutes") or 0)
    seconds = int(match.group("seconds") or 0)
    return hours * 3600 + minutes * 60 + seconds


def parse_duration_arg(value: str) -> int:
    """Parse duration from CLI (seconds, H:MM:SS, M:SS, or suffix m/s/h)."""
    if value is None:
        return 0
    text = value.strip().lower()
    if not text:
        return 0
    if ":" in text:
        parts = [int(p) for p in text.split(":")]
        if len(parts) == 2:
            minutes, seconds = parts
            return minutes * 60 + seconds
        if len(parts) == 3:
            hours, minutes, seconds = parts
            return hours * 3600 + minutes * 60 + seconds
        return 0
    if text.endswith("h"):
        return int(text[:-1]) * 3600
    if text.endswith("m"):
        return int(text[:-1]) * 60
    if text.endswith("s"):
        return int(text[:-1])
    return int(text)


def format_duration(seconds: int) -> str:
    """Format seconds into H:MM:SS or M:SS."""
    if seconds <= 0:
        return ""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    if hours:
        return f"{hours}:{minutes:02d}:{secs:02d}"
    return f"{minutes}:{secs:02d}"


def read_csv_ids(file_path: str, field: str) -> Set[str]:
    if not os.path.exists(file_path):
        return set()
    ids: Set[str] = set()
    with open(file_path, "r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            value = (row.get(field) or "").strip()
            if value:
                ids.add(value)
    return ids


def iter_csv_rows(file_path: str) -> Iterator[Dict[str, str]]:
    with open(file_path, "r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            yield row


def append_transcript_rows(file_path: str, rows: Iterable[Sequence[str]]) -> None:
    needs_header = not os.path.exists(file_path) or os.path.getsize(file_path) == 0
    with open(file_path, "a", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        if needs_header:
            writer.writerow(TRANSCRIPT_HEADER)
        for row in rows:
            writer.writerow(row)


def _row_list_to_dict(row: Sequence[str]) -> Dict[str, str]:
    return {key: (row[idx] if idx < len(row) else "") for idx, key in enumerate(TRANSCRIPT_HEADER)}


def write_transcript_rows(
    file_path: str,
    rows_by_id: Dict[str, Dict[str, str]],
    order_index: Dict[str, int] | None = None,
) -> None:
    rows = list(rows_by_id.values())
    if order_index:
        rows.sort(key=lambda row: (order_index.get(row.get("video_id", ""), 9999), row.get("video_id", "")))
    else:
        rows.sort(key=lambda row: row.get("video_id", ""))
    with open(file_path, "w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=TRANSCRIPT_HEADER)
        writer.writeheader()
        writer.writerows(rows)


def upsert_transcript_rows(
    file_path: str,
    rows: Iterable[Sequence[str]],
    order_index: Dict[str, int] | None = None,
) -> None:
    rows_by_id: Dict[str, Dict[str, str]] = {}
    if os.path.exists(file_path) and os.path.getsize(file_path) > 0:
        with open(file_path, "r", encoding="utf-8", newline="") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                video_id = (row.get("video_id") or "").strip()
                if video_id:
                    rows_by_id[video_id] = {key: (row.get(key) or "") for key in TRANSCRIPT_HEADER}

    for row in rows:
        row_dict = _row_list_to_dict(row)
        video_id = row_dict.get("video_id", "").strip()
        if not video_id:
            continue
        rows_by_id[video_id] = row_dict

    write_transcript_rows(file_path, rows_by_id, order_index=order_index)
