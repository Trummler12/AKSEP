from __future__ import annotations

import re
from typing import Callable, Iterable


VIDEO_ID_PATTERNS = [
    re.compile(r"youtu\.be/([^?&#/]+)"),
    re.compile(r"youtube\.com/watch\?v=([^?&#/]+)"),
    re.compile(r"youtube\.com/shorts/([^?&#/]+)"),
    re.compile(r"youtube\.com/embed/([^?&#/]+)"),
]


def normalize_handle(value: str) -> str:
    raw = (value or "").strip()
    if not raw:
        return ""
    if raw.startswith("http"):
        parts = [p for p in raw.split("/") if p]
        for part in parts:
            if part.startswith("@"):
                raw = part
                break
    raw = raw.strip()
    if raw.startswith("@"):
        raw = raw[1:]
    return raw.strip()


def normalize_identifier(value: str) -> str:
    return normalize_handle(value).lower()


def extract_video_id(url: str) -> str:
    for pattern in VIDEO_ID_PATTERNS:
        match = pattern.search(url or "")
        if match:
            return match.group(1)
    return ""


def parse_course_playlist_ids(lines: Iterable[str]) -> set[str]:
    ids: set[str] = set()
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "playlist?list=" not in line:
            continue
        playlist_id = line.split("list=", 1)[1].split("&", 1)[0].strip()
        if playlist_id:
            ids.add(playlist_id)
    return ids


def build_channel_ref_index(channel_source_rows: list[dict]) -> dict[str, int]:
    index: dict[str, int] = {}
    for i, row in enumerate(channel_source_rows):
        for key in ("channel_id", "custom_url", "title"):
            value = normalize_identifier(row.get(key, ""))
            if value and value not in index:
                index[value] = i
    return index


def _ordered_rows(
    rows: list[dict],
    key_fn: Callable[[dict], str],
    ref_index: dict[str, int],
    extra_sort: Callable[[dict], tuple] | None = None,
) -> tuple[list[dict], int, bool]:
    kept = []
    removed = 0
    for row in rows:
        key = key_fn(row)
        if key and key in ref_index:
            kept.append((ref_index[key], row))
        else:
            removed += 1

    def sort_key(item: tuple[int, dict]) -> tuple:
        order, row = item
        if extra_sort:
            return (order,) + extra_sort(row)
        return (order,)

    ordered = sorted(kept, key=sort_key)
    reordered_rows = [row for _, row in ordered]
    reordered = [row.get("video_id", "") or row.get("playlist_id", "") or row.get("channel_id", "") for row in rows if row] != [
        row.get("video_id", "") or row.get("playlist_id", "") or row.get("channel_id", "") for row in reordered_rows
    ]
    return reordered_rows, removed, reordered


def reorder_channels(channels_rows: list[dict], channel_ref_index: dict[str, int]) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        for key in ("channel_id", "custom_url", "title"):
            value = normalize_identifier(row.get(key, ""))
            if value and value in channel_ref_index:
                return value
        return ""

    return _ordered_rows(channels_rows, key_fn, channel_ref_index)


def reorder_channels_local(
    rows: list[dict], channel_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("channel_id", "")

    return _ordered_rows(rows, key_fn, channel_index, extra_sort=lambda r: (r.get("language_code", ""),))


def reorder_videos(
    rows: list[dict], channel_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("channel_id", "")

    return _ordered_rows(
        rows,
        key_fn,
        channel_index,
        extra_sort=lambda r: (r.get("published_at", ""), r.get("video_id", "")),
    )


def reorder_videos_local(
    rows: list[dict], video_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("video_id", "")

    return _ordered_rows(rows, key_fn, video_index, extra_sort=lambda r: (r.get("language_code", ""),))


def reorder_playlists(
    rows: list[dict], channel_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("channel_id", "")

    return _ordered_rows(
        rows,
        key_fn,
        channel_index,
        extra_sort=lambda r: (r.get("published_at", ""), r.get("playlist_id", "")),
    )


def reorder_playlists_local(
    rows: list[dict], playlist_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("playlist_id", "")

    return _ordered_rows(rows, key_fn, playlist_index, extra_sort=lambda r: (r.get("language_code", ""),))


def reorder_playlist_items(
    rows: list[dict], playlist_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("playlist_id", "")

    def extra_sort(row: dict) -> tuple:
        pos = row.get("position", "")
        try:
            pos_val = int(pos)
        except (TypeError, ValueError):
            pos_val = 0
        return (pos_val,)

    return _ordered_rows(rows, key_fn, playlist_index, extra_sort=extra_sort)


def reorder_audiotracks(
    rows: list[dict], video_index: dict[str, int]
) -> tuple[list[dict], int, bool]:
    def key_fn(row: dict) -> str:
        return row.get("video_id", "")

    return _ordered_rows(rows, key_fn, video_index)


def reorder_t_source(
    rows: list[dict], video_index: dict[str, int], keep_unmatched: bool = False
) -> tuple[list[dict], int, bool]:
    matched = []
    unmatched = []
    for row in rows:
        vid = extract_video_id(row.get("source_URL", ""))
        if vid and vid in video_index:
            matched.append((video_index[vid], row))
        else:
            unmatched.append(row)

    matched.sort(key=lambda item: item[0])
    ordered = [row for _, row in matched]
    if keep_unmatched:
        ordered.extend(unmatched)

    removed = 0 if keep_unmatched else len(unmatched)
    if not keep_unmatched:
        ordered = [row for _, row in matched]

    original_ids = [extract_video_id(row.get("source_URL", "")) for row in rows]
    ordered_ids = [extract_video_id(row.get("source_URL", "")) for row in ordered]
    reordered = original_ids != ordered_ids
    return ordered, removed, reordered


def reconcile_course_flags(playlists_rows: list[dict], course_ids: set[str]) -> int:
    changed = 0
    for row in playlists_rows:
        playlist_id = row.get("playlist_id", "")
        if not playlist_id:
            continue
        desired = "2" if playlist_id in course_ids else "1"
        if row.get("playlist_type_id", "") != desired:
            row["playlist_type_id"] = desired
            changed += 1
    return changed
