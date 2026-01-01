from __future__ import annotations

from dataclasses import dataclass
from enum import Enum
from typing import Iterable, List, Optional
import re


class ErrorType(str, Enum):
    BLOCKING = "blocking"
    NO_TRANSCRIPT = "no_transcript"
    INVALID = "invalid"
    TOOL_ERROR = "tool_error"
    PARSE_ERROR = "parse_error"
    EMPTY = "empty"


class TranscriptStatus(str, Enum):
    OK = "ok"
    MISSING = "missing"
    INVALID = "invalid"
    ERROR = "error"
    RATE_LIMITED = "rate_limited"


@dataclass
class TranscriptSegment:
    text: str
    start: Optional[float] = None
    duration: Optional[float] = None


@dataclass
class TranscriptResult:
    video_id: str
    language_code: Optional[str]
    is_generated: Optional[bool]
    is_translatable: Optional[bool]
    segments: List[TranscriptSegment]
    provider: str
    status: TranscriptStatus
    error_type: Optional[ErrorType] = None
    error_message: Optional[str] = None

    def joined_text(self) -> str:
        if not self.segments:
            return ""
        return normalize_text(" ".join(seg.text for seg in self.segments))


def normalize_text(text: str) -> str:
    cleaned = re.sub(r"\s+", " ", text).strip()
    return cleaned


def normalize_language_code(code: Optional[str]) -> Optional[str]:
    if not code:
        return None
    return code.strip().lower()


def language_priority(
    default_audio_language: Optional[str],
    default_language: Optional[str],
    fallback: str = "en",
) -> List[str]:
    candidates = [
        normalize_language_code(default_audio_language),
        normalize_language_code(default_language),
        normalize_language_code(fallback),
    ]
    return [c for c in candidates if c]


def segments_from_raw(raw: Iterable[dict]) -> List[TranscriptSegment]:
    segments: List[TranscriptSegment] = []
    for item in raw:
        text = str(item.get("text", "")).strip()
        if not text:
            continue
        segments.append(
            TranscriptSegment(
                text=text,
                start=item.get("start"),
                duration=item.get("duration"),
            )
        )
    return segments
