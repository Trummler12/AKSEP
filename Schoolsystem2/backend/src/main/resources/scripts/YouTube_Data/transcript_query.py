"""Batch transcript ingestion using TranscriptHQ."""

from __future__ import annotations

import argparse
import csv
import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

from youtube_transcripts import csv_utils, transcripthq_client

SCRIPT_ROOT = Path(__file__).resolve()
RESOURCES_ROOT = SCRIPT_ROOT.parents[2]
BACKEND_ROOT = SCRIPT_ROOT.parents[5]

# User-adjustable defaults (non-CLI overrides).
DEFAULT_MAX_TOTAL_BATCH_SIZE = 0
DEFAULT_BATCH_SIZE = 100
DEFAULT_MIN_DURATION = "6m"
DEFAULT_POLL_INTERVAL = 2.0
DEFAULT_POLL_TIMEOUT = 1800 # 1 = 1s, 3600 = 1h
DEFAULT_SKIP_METADATA = True
DEFAULT_NATIVE_CAPTIONS_ONLY = True
DEFAULT_WHITELIST_VIDEOS_IN_PLAYLISTS = False
DEFAULT_POLLING_MODE = "video_results"


def prune_transcripthq_errors(path: str) -> int:
    file_path = Path(path)
    if not file_path.exists() or file_path.stat().st_size == 0:
        return 0
    with file_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        header = next(reader, [])
        if not header:
            return 0
        rows = list(reader)
    try:
        error_idx = header.index("error")
    except ValueError:
        return 0
    kept_rows = []
    removed = 0
    for row in rows:
        error_value = row[error_idx] if error_idx < len(row) else ""
        if error_value == "transcripthq_error":
            removed += 1
            continue
        kept_rows.append(row)
    if removed:
        with file_path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.writer(handle)
            writer.writerow(header)
            writer.writerows(kept_rows)
    return removed


def load_env_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def find_env_file(start: Path) -> Optional[Path]:
    for parent in [start, *start.parents]:
        candidate = parent / ".env"
        if candidate.exists():
            return candidate
    return None


def parse_video_ids(values: Sequence[str]) -> List[str]:
    ids: List[str] = []
    for raw in values:
        if not raw:
            continue
        for part in raw.split(","):
            cleaned = part.strip()
            if cleaned:
                ids.append(cleaned)
    return ids


def _stringify_bool(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    return str(value)


def _extract_language(result: Dict[str, object]) -> str:
    return str(result.get("language") or result.get("language_code") or "")


def _extract_is_translatable(result: Dict[str, object]) -> str:
    if "is_translatable" in result:
        return _stringify_bool(result.get("is_translatable"))
    if "translatable" in result:
        return _stringify_bool(result.get("translatable"))
    # TranscriptHQ notes: all transcripts can be translated once present.
    return "true" if result.get("transcript") else ""


def _extract_is_generated(result: Dict[str, object]) -> str:
    native_value = result.get("is_native", result.get("isNative"))
    if native_value is False or str(native_value).lower() == "false":
        return "whisper"
    if "is_generated" in result:
        return _stringify_bool(result.get("is_generated"))
    if "isGenerated" in result:
        return _stringify_bool(result.get("isGenerated"))
    return ""


def map_video_result(
    video_id: str,
    duration_text: str,
    result: Optional[Dict[str, object]],
    fallback_error: str,
) -> List[str]:
    if result is None:
        return [video_id, duration_text, "", "", "", "error", fallback_error, ""]

    status_raw = str(result.get("status", "")).lower()
    transcript = str(result.get("transcript") or "")
    if transcript:
        transcript = " ".join(transcript.splitlines())
    error = str(result.get("error") or result.get("message") or "")
    language_code = _extract_language(result)
    is_translatable = _extract_is_translatable(result)
    is_generated = _extract_is_generated(result)
    native_flag = result.get("is_native", result.get("isNative"))

    if status_raw in {"done", "completed"} and transcript:
        status = "ok"
        error = ""
    elif status_raw in {"no_captions", "no_transcript", "missing", "not_found"}:
        status = "missing"
        error = error or status_raw or "no_transcript"
    elif status_raw in {"failed", "error"}:
        status = "error"
        lowered_error = error.lower()
        if "no native captions" in lowered_error or "native_only" in lowered_error:
            status = "missing"
    elif not transcript:
        status = "missing"
        error = error or "no_transcript"
    else:
        status = "error"
        error = error or "unknown_status"

    if status == "ok" and not is_generated:
        logging.warning(
            "TranscriptHQ response missing isGenerated/isNative info (video_id=%s, keys=%s)",
            video_id,
            ",".join(sorted(result.keys())),
        )

    if status != "ok":
        language_code = ""
        is_generated = ""
        is_translatable = ""
        transcript = ""

    return [
        video_id,
        duration_text,
        language_code,
        is_generated,
        is_translatable,
        status,
        error,
        transcript,
    ]


def send_batch(
    api_key: str,
    video_ids: List[str],
    duration_map: Dict[str, str],
    poll_interval: float,
    timeout_seconds: int,
    skip_metadata: bool,
    native_captions_only: bool,
    dump_response_path: str,
    polling_mode: str,
) -> Tuple[List[List[str]], float]:
    start = time.monotonic()
    rows: List[List[str]] = []
    try:
        options = {
            "skip_metadata": skip_metadata,
            "native_only": native_captions_only,
        }
        job = transcripthq_client.create_transcript_job(
            api_key, video_ids, options=options
        )
        poll_target = job.get("poll_url") or job.get("job_id") or ""
        if polling_mode == "video_results":
            result = transcripthq_client.wait_for_job_by_videos(
                api_key,
                str(poll_target),
                video_ids,
                poll_interval=poll_interval,
                timeout_seconds=timeout_seconds,
            )
        else:
            result = transcripthq_client.wait_for_job(
                api_key,
                str(poll_target),
                poll_interval=poll_interval,
                timeout_seconds=timeout_seconds,
            )
        if dump_response_path:
            Path(dump_response_path).write_text(
                json.dumps(result, indent=2, ensure_ascii=True), encoding="utf-8"
            )
    except transcripthq_client.TranscriptHQError as exc:
        logging.error("TranscriptHQ error: %s", exc)
        for video_id in video_ids:
            rows.append(
                map_video_result(
                    video_id,
                    duration_map.get(video_id, ""),
                    None,
                    "transcripthq_error",
                )
            )
        return rows, time.monotonic() - start

    response_map = transcripthq_client._extract_videos_map(result)
    status_counts: Dict[str, int] = {}
    for item in response_map.values():
        status = str(item.get("status") or "").lower()
        status_counts[status] = status_counts.get(status, 0) + 1
    missing_ids = [vid for vid in video_ids if vid not in response_map]
    logging.info(
        "Batch response: videos=%d statuses=%s missing=%d",
        len(response_map),
        ",".join(f"{key}:{count}" for key, count in sorted(status_counts.items())),
        len(missing_ids),
    )

    for video_id in video_ids:
        rows.append(
            map_video_result(
                video_id,
                duration_map.get(video_id, ""),
                response_map.get(video_id),
                "missing_response",
            )
        )
    return rows, time.monotonic() - start

def main() -> int:
    parser = argparse.ArgumentParser(description="Fetch YouTube transcripts via TranscriptHQ.")
    parser.add_argument(
        "--videos-csv",
        default=str(RESOURCES_ROOT / "csv/youtube/videos.csv"),
        help="Path to videos.csv",
    )
    parser.add_argument(
        "--playlist-items-csv",
        default=str(RESOURCES_ROOT / "csv/youtube/playlistItems.csv"),
        help="Path to playlistItems.csv",
    )
    parser.add_argument(
        "--transcripts-csv",
        default=str(RESOURCES_ROOT / "csv/youtube/videos_transcripts.csv"),
        help="Path to videos_transcripts.csv",
    )
    # @Codex HINWEIS: Nutzerdefinierbare Variablen (wie etwa die hiesigen Defaults) sollten bitte NICHT als Magic Variables vorliegen, sondern ganz oben im Script definiert sein
    # @developer ACK: Defaults moved to top-level constants for easy discovery.
    # @developer RESOLVED: Defaults are now centralized at the top of the file.
    parser.add_argument("--max-total-batch-size", type=int, default=DEFAULT_MAX_TOTAL_BATCH_SIZE)
    parser.add_argument("--batch-size", type=int, default=DEFAULT_BATCH_SIZE)
    parser.add_argument("--min-duration", default=DEFAULT_MIN_DURATION)
    parser.add_argument(
        "--native-captions-only",
        action=argparse.BooleanOptionalAction,
        default=DEFAULT_NATIVE_CAPTIONS_ONLY,
        help="Only return native captions (no Whisper fallback).",
    )
    parser.add_argument(
        "--whisper-min-duration",
        default="",
        help="Required when --no-native-captions-only is set (e.g. 30m).",
    )
    parser.add_argument(
        "--whitelist-videos-in-playlists",
        action=argparse.BooleanOptionalAction,
        default=DEFAULT_WHITELIST_VIDEOS_IN_PLAYLISTS,
        help="Include playlist videos regardless of duration.",
    )
    parser.add_argument("--video-ids", default="")
    parser.add_argument("--video-id", action="append", default=[])
    parser.add_argument("--poll-interval", type=float, default=DEFAULT_POLL_INTERVAL)
    parser.add_argument("--poll-timeout", type=int, default=DEFAULT_POLL_TIMEOUT)
    parser.add_argument(
        "--polling-mode",
        choices=["job_status", "video_results"],
        default=DEFAULT_POLLING_MODE,
        help="Polling strategy: job_status checks job status; video_results waits for per-video results.",
    )
    parser.add_argument(
        "--skip-metadata",
        action=argparse.BooleanOptionalAction,
        default=DEFAULT_SKIP_METADATA,
        help="Skip metadata prevalidation for faster job creation.",
    )
    parser.add_argument(
        "--dump-response",
        default="",
        help="Write the full TranscriptHQ response JSON to the given path.",
    )
    parser.add_argument("--log-level", default="INFO")

    args = parser.parse_args()

    logging.basicConfig(
        level=getattr(logging, args.log_level.upper(), logging.INFO),
        format="%(levelname)s %(message)s",
    )

    env_path = find_env_file(BACKEND_ROOT) or find_env_file(RESOURCES_ROOT)
    if env_path:
        load_env_file(env_path)
    api_key = os.environ.get("YT_TRANSCRIPTHQ_API_KEY", "").strip()
    if not api_key:
        logging.error("Missing YT_TRANSCRIPTHQ_API_KEY in environment or .env")
        return 1

    logging.info(
        "TranscriptHQ options: skip_metadata=%s native_only=%s polling_mode=%s",
        args.skip_metadata,
        args.native_captions_only,
        args.polling_mode,
    )

    min_duration_seconds = csv_utils.parse_duration_arg(args.min_duration)
    if not args.native_captions_only:
        if not args.whisper_min_duration:
            logging.error(
                "--whisper-min-duration is required when --no-native-captions-only is set"
            )
            return 1
        whisper_min_seconds = csv_utils.parse_duration_arg(args.whisper_min_duration)
        if whisper_min_seconds <= 0:
            logging.error("Invalid --whisper-min-duration: %s", args.whisper_min_duration)
            return 1
        min_duration_seconds = whisper_min_seconds
    max_total = args.max_total_batch_size or 0
    batch_size = max(1, args.batch_size)

    provided_ids = set(parse_video_ids([args.video_ids, *args.video_id]))
    found_provided: set[str] = set()

    removed_errors = prune_transcripthq_errors(args.transcripts_csv)
    if removed_errors:
        logging.info("Removed transcripthq_error rows: %d", removed_errors)

    existing_ids = csv_utils.read_csv_ids(args.transcripts_csv, "video_id")
    logging.info("Existing transcripts: %d", len(existing_ids))

    playlist_ids = set()
    playlist_rows_total = 0
    if args.whitelist_videos_in_playlists:
        for row in csv_utils.iter_csv_rows(args.playlist_items_csv):
            video_id = (row.get("video_id") or "").strip()
            if not video_id:
                continue
            playlist_rows_total += 1
            playlist_ids.add(video_id)
        logging.info(
            "Playlist whitelist loaded: rows=%d unique_video_ids=%d",
            playlist_rows_total,
            len(playlist_ids),
        )

    video_order_index: Dict[str, int] = {}
    video_total = 0
    duration_over_min = 0
    duration_under_min = 0
    whitelist_in_videos = 0
    whitelist_under_min = 0
    whitelist_added_only = 0
    forced_total = 0
    eligible_total = 0
    eligible_missing = 0

    for idx, row in enumerate(csv_utils.iter_csv_rows(args.videos_csv)):
        video_id = (row.get("video_id") or "").strip()
        if video_id and video_id not in video_order_index:
            video_order_index[video_id] = idx
        if not video_id:
            continue
        video_total += 1
        duration_seconds = csv_utils.parse_iso8601_duration(
            (row.get("duration") or "").strip()
        )
        duration_ok = duration_seconds > min_duration_seconds
        if duration_ok:
            duration_over_min += 1
        else:
            duration_under_min += 1

        whitelisted = video_id in playlist_ids
        forced = video_id in provided_ids
        if whitelisted:
            whitelist_in_videos += 1
            if not duration_ok:
                whitelist_under_min += 1
                if not forced:
                    whitelist_added_only += 1
        if forced:
            forced_total += 1

        if args.native_captions_only:
            eligible = duration_ok or whitelisted or forced
        else:
            eligible = duration_seconds >= min_duration_seconds
        if eligible:
            eligible_total += 1
            if video_id not in existing_ids:
                eligible_missing += 1

    if args.whitelist_videos_in_playlists:
        missing_from_videos = max(len(playlist_ids) - whitelist_in_videos, 0)
        logging.info(
            "Playlist whitelist in videos.csv: %d (missing=%d)",
            whitelist_in_videos,
            missing_from_videos,
        )
    logging.info(
        "Videos.csv stats: total=%d, over_min=%d, under_min=%d (min=%s)",
        video_total,
        duration_over_min,
        duration_under_min,
        args.min_duration,
    )
    if args.native_captions_only:
        logging.info(
            "Whitelist impact: whitelisted_under_min=%d, added_by_whitelist_only=%d, forced=%d",
            whitelist_under_min,
            whitelist_added_only,
            forced_total,
        )
        logging.info(
            "Eligible videos (native-only): total=%d, without_transcripts=%d",
            eligible_total,
            eligible_missing,
        )
    else:
        logging.info(
            "Eligible videos (whisper/min-duration): total=%d, without_transcripts=%d",
            eligible_total,
            eligible_missing,
        )

    batch: List[str] = []
    duration_map: Dict[str, str] = {}
    total_added = 0

    def iter_candidates() -> List[Tuple[str, int, str]]:
        candidates: List[Tuple[str, int, str]] = []
        for row in csv_utils.iter_csv_rows(args.videos_csv):
            video_id = (row.get("video_id") or "").strip()
            if not video_id:
                continue
            if video_id in existing_ids:
                continue
            if provided_ids and video_id not in provided_ids:
                continue

            iso_duration = (row.get("duration") or "").strip()
            duration_seconds = csv_utils.parse_iso8601_duration(iso_duration)
            duration_text = csv_utils.format_duration(duration_seconds)

            whitelisted = video_id in playlist_ids
            forced = video_id in provided_ids
            if forced:
                found_provided.add(video_id)

            if args.native_captions_only:
                if not (forced or whitelisted or duration_seconds > min_duration_seconds):
                    continue
            else:
                if duration_seconds < min_duration_seconds:
                    continue

            candidates.append((video_id, duration_seconds, duration_text))
        if not args.native_captions_only:
            candidates.sort(key=lambda item: item[1], reverse=True)
        return candidates

    for video_id, duration_seconds, duration_text in iter_candidates():
        if not args.native_captions_only and duration_seconds < min_duration_seconds:
            break

        batch.append(video_id)
        duration_map[video_id] = duration_text
        total_added += 1

        reached_total = max_total > 0 and total_added >= max_total
        if len(batch) >= batch_size or reached_total:
            logging.info("Submitting batch of %d videos", len(batch))
            rows, elapsed = send_batch(
                api_key,
                batch,
                duration_map,
                poll_interval=args.poll_interval,
                timeout_seconds=args.poll_timeout,
                skip_metadata=args.skip_metadata,
                native_captions_only=args.native_captions_only,
                dump_response_path=args.dump_response,
                polling_mode=args.polling_mode,
            )
            logging.info("Batch completed in %.2fs", elapsed)
            csv_utils.upsert_transcript_rows(
                args.transcripts_csv, rows, order_index=video_order_index
            )
            batch.clear()
            duration_map = {}

        if reached_total:
            logging.info("Reached MAX_TOTAL_BATCH_SIZE=%d", max_total)
            break

    if batch:
        logging.info("Submitting final batch of %d videos", len(batch))
        rows, elapsed = send_batch(
            api_key,
            batch,
            duration_map,
            poll_interval=args.poll_interval,
            timeout_seconds=args.poll_timeout,
            skip_metadata=args.skip_metadata,
            native_captions_only=args.native_captions_only,
            dump_response_path=args.dump_response,
            polling_mode=args.polling_mode,
        )
        logging.info("Batch completed in %.2fs", elapsed)
        csv_utils.upsert_transcript_rows(
            args.transcripts_csv, rows, order_index=video_order_index
        )

    if provided_ids:
        missing = sorted(provided_ids - found_provided)
        if missing:
            logging.warning("Provided video IDs not found in videos.csv: %s", ",".join(missing))

    return 0


if __name__ == "__main__":
    sys.exit(main())



