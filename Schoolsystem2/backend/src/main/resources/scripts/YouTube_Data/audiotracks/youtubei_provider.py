from __future__ import annotations

import json
import subprocess
from pathlib import Path

from .provider_common import is_invalid_id_error, is_rate_limit_error
from .provider_types import ProviderResult


class YoutubeiProvider:
    name = "youtubei.js"

    def __init__(self, helper_path: Path, client: str, cookies_path: str) -> None:
        self.helper_path = helper_path
        self.client = client
        self.cookies_path = cookies_path

    def fetch(self, video_id: str) -> ProviderResult:
        cmd = [
            "node",
            str(self.helper_path),
            "--video-id",
            video_id,
            "--mode",
            "audio",
            "--client",
            self.client,
        ]
        if self.cookies_path:
            cmd.extend(["--cookies", self.cookies_path])
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            message = (result.stderr or result.stdout).strip() or "helper_failed"
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
                error_type="helper_error",
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
            payload = json.loads(raw)
        except json.JSONDecodeError as exc:
            return ProviderResult(
                ok=False,
                source=self.name,
                error_type="parse_error",
                error=f"json_parse_error:{exc}",
            )

        if isinstance(payload, list):
            payload = payload[0] if payload else {"ok": False, "error_type": "empty", "error": "empty_list"}

        if not payload.get("ok"):
            error_type = (payload.get("error_type") or "unknown").lower()
            error_message = payload.get("error") or "unknown_error"
            if error_type == "rate_limit" or is_rate_limit_error(error_message):
                return ProviderResult(
                    ok=False,
                    source=self.name,
                    error_type="rate_limit",
                    error=error_message,
                    rate_limited=True,
                )
            if error_type == "invalid" or is_invalid_id_error(error_message):
                return ProviderResult(
                    ok=False,
                    source=self.name,
                    error_type="invalid",
                    error=error_message,
                )
            return ProviderResult(
                ok=False,
                source=self.name,
                error_type=error_type or "error",
                error=error_message,
            )

        return ProviderResult(
            ok=True,
            source=self.name,
            audio_tracks=payload.get("audio_tracks") or {},
        )
