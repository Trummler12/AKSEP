from __future__ import annotations

from dataclasses import dataclass


@dataclass
class ProviderResult:
    ok: bool
    source: str
    audio_tracks: dict | None = None
    error_type: str = ""
    error: str = ""
    rate_limited: bool = False

