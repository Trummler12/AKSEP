from __future__ import annotations

from urllib.parse import urlparse


def normalize_handle(value: str) -> str:
    raw = (value or "").strip()
    if not raw:
        return ""
    if raw.startswith("http"):
        parsed = urlparse(raw)
        parts = [part for part in parsed.path.split("/") if part]
        if parts and parts[0].startswith("@"):
            raw = parts[0]
        elif parts:
            raw = parts[-1]
    raw = raw.strip()
    if raw.startswith("@"):
        raw = raw[1:]
    return raw.strip()


def normalize_identifier(value: str) -> str:
    return normalize_handle(value).lower()


def extract_video_id_from_url(value: str) -> str:
    url = (value or "").strip()
    if not url:
        return ""
    if "youtu.be/" in url:
        return url.split("youtu.be/", 1)[1].split("?", 1)[0].split("&", 1)[0]
    if "watch?v=" in url:
        return url.split("watch?v=", 1)[1].split("&", 1)[0]
    if "/shorts/" in url:
        return url.split("/shorts/", 1)[1].split("?", 1)[0].split("&", 1)[0]
    if "/embed/" in url:
        return url.split("/embed/", 1)[1].split("?", 1)[0].split("&", 1)[0]
    return ""
