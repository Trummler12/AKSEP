from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

from .provider_common import audio_tracks_payload, is_invalid_id_error, is_rate_limit_error
from .provider_types import ProviderResult


class YtDlpProvider:
    name = "yt-dlp"

    def __init__(self, yt_dlp_path: str | None, cookies_path: str) -> None:
        self.command = yt_dlp_path or "yt-dlp"
        self.cookies_path = cookies_path
        self.available = shutil.which(self.command) is not None

    def fetch(self, video_id: str) -> ProviderResult:
        if not self.available:
            return ProviderResult(
                ok=False,
                source=self.name,
                error_type="provider_missing",
                error="yt-dlp not found on PATH",
            )

        url = f"https://www.youtube.com/watch?v={video_id}"
        cmd = [
            self.command,
            "-J",
            "--no-playlist",
            "--skip-download",
            url,
        ]
        if self.cookies_path:
            cmd.extend(["--cookies", self.cookies_path])

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            message = (result.stderr or result.stdout).strip() or "yt-dlp failed"
            if is_rate_limit_error(message):
                return ProviderResult(
                    ok=False,
                    source=self.name,
                    error_type="rate_limit",
                    error=message,
                    rate_limited=True,
                )
            if is_invalid_id_error(message):
                return ProviderResult(
                    ok=False,
                    source=self.name,
                    error_type="invalid",
                    error=message,
                )
            return ProviderResult(
                ok=False,
                source=self.name,
                error_type="error",
                error=message,
            )

        raw = (result.stdout or "").strip()
        if not raw:
            return ProviderResult(
                ok=False,
                source=self.name,
                error_type="empty",
                error="empty_response",
            )

        try:
            info = json.loads(raw)
        except json.JSONDecodeError as exc:
            return ProviderResult(
                ok=False,
                source=self.name,
                error_type="parse_error",
                error=f"json_parse_error:{exc}",
            )

        audio = self._parse_audio_tracks(info)
        return ProviderResult(ok=True, source=self.name, audio_tracks=audio)

    def _parse_audio_tracks(self, info: dict) -> dict:
        formats = info.get("formats") or []
        languages = set()
        for fmt in formats:
            acodec = fmt.get("acodec")
            if not acodec or acodec == "none":
                continue
            lang = fmt.get("language")
            if not lang and isinstance(fmt.get("audio_track"), dict):
                lang = fmt["audio_track"].get("language")
            if lang:
                languages.add(lang)

        default_language = info.get("language") or info.get("default_language") or ""
        return audio_tracks_payload(
            languages_all=list(languages),
            languages_non_auto=list(languages),
            has_auto_dub="unknown",
            default_audio_language=default_language,
            source=self.name,
        )
