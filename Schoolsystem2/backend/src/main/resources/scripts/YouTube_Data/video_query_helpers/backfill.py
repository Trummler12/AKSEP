from __future__ import annotations

from pathlib import Path

from .csv_io import load_channel_source_lines, read_csv_rows, render_csv_row
from .http_utils import api_get
from .normalize import normalize_handle, normalize_identifier


def resolve_channel_id(api_key: str, handle: str, username: str) -> tuple[str, str]:
    if handle:
        data = api_get("channels", {"part": "snippet", "forHandle": handle, "key": api_key})
        items = data.get("items", [])
        if items:
            return items[0].get("id", ""), "forHandle"
    if username:
        data = api_get("channels", {"part": "snippet", "forUsername": username, "key": api_key})
        items = data.get("items", [])
        if items:
            return items[0].get("id", ""), "forUsername"
    return "", ""


def backfill_channel_ids(channel_source_csv: Path, channels_csv: Path, api_key: str) -> dict[str, int]:
    counts = {
        "updated": 0,
        "from_channels": 0,
        "from_api": 0,
        "unresolved": 0,
        "skipped": 0,
    }
    if not channel_source_csv.exists():
        return counts

    lines, fields, row_items, had_trailing_newline = load_channel_source_lines(channel_source_csv)
    if not fields or "channel_id" not in fields:
        return counts

    existing_channels = read_csv_rows(channels_csv)
    handle_to_id = {
        normalize_identifier(row.get("custom_url", "")): row.get("channel_id", "")
        for row in existing_channels
        if row.get("custom_url") and row.get("channel_id")
    }

    changed_lines: dict[int, str] = {}
    for idx, row in row_items:
        current_id = (row.get("channel_id") or "").strip()
        custom_url = (row.get("custom_url") or "").strip()
        handle = normalize_handle(custom_url)
        handle_norm = normalize_identifier(handle)
        expected_id = handle_to_id.get(handle_norm, "")
        updated = False

        if expected_id and current_id != expected_id:
            row["channel_id"] = expected_id
            counts["from_channels"] += 1
            updated = True
        elif not current_id:
            if expected_id:
                row["channel_id"] = expected_id
                counts["from_channels"] += 1
                updated = True
            elif api_key:
                username_candidate = ""
                if custom_url and not custom_url.startswith("@"): 
                    username_candidate = normalize_handle(custom_url)
                resolved_id, _method = resolve_channel_id(api_key, handle, username_candidate)
                if resolved_id:
                    row["channel_id"] = resolved_id
                    counts["from_api"] += 1
                    updated = True
                else:
                    counts["unresolved"] += 1
            else:
                counts["unresolved"] += 1
        else:
            if not current_id.startswith("UC") and api_key:
                username_candidate = ""
                if custom_url and not custom_url.startswith("@"): 
                    username_candidate = normalize_handle(custom_url)
                resolved_id, _method = resolve_channel_id(api_key, handle, username_candidate)
                if resolved_id and resolved_id != current_id:
                    row["channel_id"] = resolved_id
                    counts["from_api"] += 1
                    updated = True
                else:
                    counts["skipped"] += 1
            else:
                counts["skipped"] += 1

        if updated:
            counts["updated"] += 1
            changed_lines[idx] = render_csv_row(fields, row)

    if changed_lines:
        for idx, new_line in changed_lines.items():
            lines[idx] = new_line
        content = "\n".join(lines)
        if had_trailing_newline:
            content = f"{content}\n"
        channel_source_csv.write_text(content, encoding="utf-8")

    return counts
