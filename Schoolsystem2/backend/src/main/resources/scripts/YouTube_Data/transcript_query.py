from __future__ import annotations

import argparse
import csv
import logging
import time
from pathlib import Path
from typing import Dict, Iterable, List, Optional

from youtube_transcripts.common import (
    ErrorType,
    TranscriptResult,
    TranscriptStatus,
    language_priority,
)
from youtube_transcripts.provider_youtube_transcript_api import fetch_transcript as fetch_yta
from youtube_transcripts.provider_yt_dlp import fetch_transcript as fetch_ytdlp


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT = ROOT / "csv" / "youtube" / "videos.csv"
DEFAULT_OUTPUT = ROOT / "csv" / "youtube" / "videos_transcripts.csv"

CSV_HEADER = [
    "video_id",
    "duration",
    "language_code",
    "is_generated",
    "is_translatable",
    "transcript",
    "status",
    "error",
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fetch YouTube transcripts into CSV.")
    parser.add_argument("--input", type=Path, default=DEFAULT_INPUT)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--enable-wait", action="store_true")
    parser.add_argument("--wait-seconds", type=str, default="3600,10800,21600,43200")
    return parser.parse_args()


def parse_iso8601_duration(duration: str) -> str:
    if not duration:
        return ""
    if not duration.startswith("PT"):
        return duration
    hours = minutes = seconds = 0
    num = ""
    for char in duration[2:]:
        if char.isdigit():
            num += char
            continue
        if char == "H":
            hours = int(num or 0)
        elif char == "M":
            minutes = int(num or 0)
        elif char == "S":
            seconds = int(num or 0)
        num = ""
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


def ensure_csv(path: Path) -> None:
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(CSV_HEADER)


def read_existing_ok(path: Path) -> set[str]:
    if not path.exists():
        return set()
    seen: set[str] = set()
    with path.open("r", newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row.get("status") == TranscriptStatus.OK.value:
                vid = row.get("video_id")
                if vid:
                    seen.add(vid)
    return seen


def write_result(path: Path, result: TranscriptResult, duration: str) -> None:
    ensure_csv(path)
    transcript_text = result.joined_text()
    with path.open("a", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                result.video_id,
                duration,
                result.language_code or "",
                "" if result.is_generated is None else str(result.is_generated).lower(),
                "" if result.is_translatable is None else str(result.is_translatable).lower(),
                transcript_text,
                result.status.value,
                result.error_message or "",
            ]
        )


def iter_videos(path: Path) -> Iterable[Dict[str, str]]:
    with path.open("r", newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            if row.get("video_id"):
                yield row


def provider_stages() -> List[List]:
    return [
        [fetch_yta, fetch_ytdlp],
        [fetch_ytdlp],
    ]


def run_for_video(
    video_id: str,
    languages: List[str],
    enable_wait: bool,
    wait_schedule: List[int],
) -> Optional[TranscriptResult]:
    stages = provider_stages()
    for stage_index, stage in enumerate(stages, start=1):
        has_no_transcript = False
        for provider in stage:
            result = provider(video_id, languages)
            if result.status == TranscriptStatus.OK:
                return result
            if result.status == TranscriptStatus.INVALID:
                return result
            if result.status == TranscriptStatus.MISSING:
                has_no_transcript = True
                continue
            if result.status == TranscriptStatus.RATE_LIMITED:
                break
        if has_no_transcript:
            return TranscriptResult(
                video_id=video_id,
                language_code=None,
                is_generated=None,
                is_translatable=None,
                segments=[],
                provider="multi",
                status=TranscriptStatus.MISSING,
                error_type=ErrorType.NO_TRANSCRIPT,
                error_message="no_transcript",
            )
        if enable_wait and stage_index == len(stages):
            for wait_seconds in wait_schedule:
                time.sleep(wait_seconds)
                retry_result = run_for_video(video_id, languages, False, [])
                if retry_result:
                    return retry_result
        return TranscriptResult(
            video_id=video_id,
            language_code=None,
            is_generated=None,
            is_translatable=None,
            segments=[],
            provider="multi",
            status=TranscriptStatus.ERROR,
            error_type=ErrorType.TOOL_ERROR,
            error_message="stage_exhausted",
        )
    return None


def parse_wait_schedule(raw: str) -> List[int]:
    values: List[int] = []
    for part in raw.split(","):
        part = part.strip()
        if not part:
            continue
        try:
            values.append(int(part))
        except ValueError:
            continue
    return values


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    ensure_csv(args.output)
    seen = read_existing_ok(args.output)
    wait_schedule = parse_wait_schedule(args.wait_seconds)

    processed = 0
    for row in iter_videos(args.input):
        if processed >= args.limit:
            break
        video_id = row["video_id"]
        if video_id in seen:
            continue
        languages = language_priority(
            row.get("default_audio_language"),
            row.get("default_language"),
            "en",
        )
        duration = parse_iso8601_duration(row.get("duration", ""))
        result = run_for_video(video_id, languages, args.enable_wait, wait_schedule)
        if result is None:
            continue
        if result.status == TranscriptStatus.RATE_LIMITED:
            logging.warning("Rate limited for %s; skipping write", video_id)
            continue
        write_result(args.output, result, duration)
        processed += 1
        logging.info("Processed %s with status %s", video_id, result.status.value)


if __name__ == "__main__":
    main()
