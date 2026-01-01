from __future__ import annotations

from typing import Iterable, Optional

from .common import (
    ErrorType,
    TranscriptResult,
    TranscriptSegment,
    TranscriptStatus,
    normalize_language_code,
    segments_from_raw,
)


PROVIDER_NAME = "youtube-transcript-api"


def _safe_import():
    try:
        from youtube_transcript_api import YouTubeTranscriptApi  # type: ignore
        from youtube_transcript_api import (  # type: ignore
            CouldNotRetrieveTranscript,
            NoTranscriptFound,
            RequestBlocked,
            TranscriptsDisabled,
            TooManyRequests,
            VideoUnavailable,
        )
    except Exception as exc:  # pragma: no cover - import guard
        return None, exc

    return (
        {
            "YouTubeTranscriptApi": YouTubeTranscriptApi,
            "CouldNotRetrieveTranscript": CouldNotRetrieveTranscript,
            "NoTranscriptFound": NoTranscriptFound,
            "RequestBlocked": RequestBlocked,
            "TranscriptsDisabled": TranscriptsDisabled,
            "TooManyRequests": TooManyRequests,
            "VideoUnavailable": VideoUnavailable,
        },
        None,
    )


def _fetched_to_segments(fetched) -> list[TranscriptSegment]:
    if hasattr(fetched, "to_raw_data"):
        raw = fetched.to_raw_data()
        return segments_from_raw(raw)
    if isinstance(fetched, list):
        return segments_from_raw(fetched)
    return []


def _build_result(video_id: str, transcript, segments: list[TranscriptSegment]) -> TranscriptResult:
    return TranscriptResult(
        video_id=video_id,
        language_code=normalize_language_code(getattr(transcript, "language_code", None)),
        is_generated=getattr(transcript, "is_generated", None),
        is_translatable=getattr(transcript, "is_translatable", None),
        segments=segments,
        provider=PROVIDER_NAME,
        status=TranscriptStatus.OK,
    )


def fetch_transcript(video_id: str, languages: Iterable[str]) -> TranscriptResult:
    imports, import_error = _safe_import()
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

    YouTubeTranscriptApi = imports["YouTubeTranscriptApi"]
    CouldNotRetrieveTranscript = imports["CouldNotRetrieveTranscript"]
    NoTranscriptFound = imports["NoTranscriptFound"]
    RequestBlocked = imports["RequestBlocked"]
    TranscriptsDisabled = imports["TranscriptsDisabled"]
    TooManyRequests = imports["TooManyRequests"]
    VideoUnavailable = imports["VideoUnavailable"]

    try:
        transcript_list = YouTubeTranscriptApi().list(video_id)
        for lang in languages:
            try:
                transcript = transcript_list.find_manually_created_transcript([lang])
                fetched = transcript.fetch()
                segments = _fetched_to_segments(fetched)
                if segments:
                    return _build_result(video_id, transcript, segments)
            except Exception:
                continue
        for lang in languages:
            try:
                transcript = transcript_list.find_generated_transcript([lang])
                fetched = transcript.fetch()
                segments = _fetched_to_segments(fetched)
                if segments:
                    return _build_result(video_id, transcript, segments)
            except Exception:
                continue
        for lang in languages:
            try:
                transcript = transcript_list.find_transcript([lang])
                fetched = transcript.fetch()
                segments = _fetched_to_segments(fetched)
                if segments:
                    return _build_result(video_id, transcript, segments)
            except Exception:
                continue
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.MISSING,
            error_type=ErrorType.NO_TRANSCRIPT,
            error_message="no_transcript",
        )
    except (TranscriptsDisabled, NoTranscriptFound):
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.MISSING,
            error_type=ErrorType.NO_TRANSCRIPT,
            error_message="transcripts_disabled_or_not_found",
        )
    except (TooManyRequests, RequestBlocked):
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.RATE_LIMITED,
            error_type=ErrorType.BLOCKING,
            error_message="rate_limited_or_blocked",
        )
    except VideoUnavailable:
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.INVALID,
            error_type=ErrorType.INVALID,
            error_message="video_unavailable",
        )
    except CouldNotRetrieveTranscript as exc:
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.ERROR,
            error_type=ErrorType.TOOL_ERROR,
            error_message=f"could_not_retrieve: {exc}",
        )
    except Exception as exc:
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider=PROVIDER_NAME,
            status=TranscriptStatus.ERROR,
            error_type=ErrorType.TOOL_ERROR,
            error_message=f"unhandled_error: {exc}",
        )
