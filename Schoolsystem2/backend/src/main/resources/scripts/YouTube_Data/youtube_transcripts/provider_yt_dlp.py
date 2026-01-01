from __future__ import annotations

from typing import Iterable, Optional, Tuple
import re
import urllib.request

from .common import (
    ErrorType,
    TranscriptResult,
    TranscriptSegment,
    TranscriptStatus,
    normalize_language_code,
)


PROVIDER_NAME = "yt-dlp"


def _safe_import():
    try:
        import yt_dlp  # type: ignore
    except Exception as exc:  # pragma: no cover - import guard
        return None, exc
    return yt_dlp, None


def _is_blocking_error(message: str) -> bool:
    lowered = message.lower()
    return any(token in lowered for token in ["429", "too many requests", "403", "captcha"])


def _fetch_url_text(url: str) -> str:
    with urllib.request.urlopen(url) as response:
        return response.read().decode("utf-8", errors="replace")


def _strip_markup(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


def _parse_subtitle_text(content: str) -> list[TranscriptSegment]:
    segments: list[TranscriptSegment] = []
    for line in content.splitlines():
        raw = line.strip()
        if not raw:
            continue
        if raw.startswith("WEBVTT"):
            continue
        if "-->" in raw:
            continue
        if raw.isdigit():
            continue
        cleaned = _strip_markup(raw).strip()
        if cleaned:
            segments.append(TranscriptSegment(text=cleaned))
    return segments


def _pick_caption(
    captions: dict,
    languages: Iterable[str],
    ext_priority: Tuple[str, ...] = ("vtt", "srt"),
) -> Optional[Tuple[str, str]]:
    for lang in languages:
        items = captions.get(lang)
        if not items:
            continue
        for ext in ext_priority:
            for item in items:
                if item.get("ext") == ext and item.get("url"):
                    return lang, item["url"]
        for item in items:
            if item.get("url"):
                return lang, item["url"]
    return None


def fetch_transcript(video_id: str, languages: Iterable[str]) -> TranscriptResult:
    yt_dlp, import_error = _safe_import()
    if import_error:
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.ERROR,
            error_type=ErrorType.TOOL_ERROR,
            error_message=f"import_error: {import_error}",
        )

    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        "skip_download": True,
        "quiet": True,
        "no_warnings": True,
        "writesubtitles": False,
        "writeautomaticsub": False,
    }
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
        subtitles = info.get("subtitles") or {}
        automatic = info.get("automatic_captions") or {}

        pick = _pick_caption(subtitles, languages)
        if pick:
            lang, sub_url = pick
            content = _fetch_url_text(sub_url)
            segments = _parse_subtitle_text(content)
            if segments:
                return TranscriptResult(
                    video_id=video_id,
                    language_code=normalize_language_code(lang),
                    is_generated=False,
                    is_translatable=None,
                    segments=segments,
                    provider=PROVIDER_NAME,
                    status=TranscriptStatus.OK,
                )

        pick = _pick_caption(automatic, languages)
        if pick:
            lang, sub_url = pick
            content = _fetch_url_text(sub_url)
            segments = _parse_subtitle_text(content)
            if segments:
                return TranscriptResult(
                    video_id=video_id,
                    language_code=normalize_language_code(lang),
                    is_generated=True,
                    is_translatable=None,
                    segments=segments,
                    provider=PROVIDER_NAME,
                    status=TranscriptStatus.OK,
                )

        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.MISSING,
            error_type=ErrorType.NO_TRANSCRIPT,
            error_message="no_subtitles",
        )
    except Exception as exc:
        message = str(exc)
        if _is_blocking_error(message):
            return TranscriptResult(
                video_id=video_id,
                language_code=None,
                is_generated=None,
                is_translatable=None,
                segments=[],
                provider=PROVIDER_NAME,
                status=TranscriptStatus.RATE_LIMITED,
                error_type=ErrorType.BLOCKING,
                error_message=message,
            )
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.ERROR,
            error_type=ErrorType.TOOL_ERROR,
            error_message=message,
        )
