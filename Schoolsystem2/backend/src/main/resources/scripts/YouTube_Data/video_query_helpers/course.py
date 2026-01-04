from __future__ import annotations


def parse_course_blocks(path) -> dict[str, list[str]]:
    if not path.exists():
        return {}
    lines = path.read_text(encoding="utf-8").splitlines()
    blocks: dict[str, list[str]] = {}
    current_key = ""
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "playlist?list=" in line:
            if not current_key:
                continue
            playlist_id = ""
            if "list=" in line:
                playlist_id = line.split("list=", 1)[1].split("&", 1)[0].strip()
            if playlist_id:
                blocks.setdefault(current_key, []).append(playlist_id)
        else:
            current_key = line
            blocks.setdefault(current_key, [])
    return blocks


def matches_course_header(header: str, title: str, handle: str) -> bool:
    normalized = (header or "").strip().lower()
    if not normalized:
        return False
    if title and normalized == title.strip().lower():
        return True
    if handle:
        return normalized == handle.strip().lower()
    return False
