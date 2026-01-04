from __future__ import annotations

import csv
import sys
from pathlib import Path

from . import prep as prep_helpers
from .csv_io import read_csv_rows, write_csv_rows
from .normalize import normalize_identifier

ANSI_RESET = "\033[0m"
ANSI_YELLOW = "\033[33m"
ANSI_RED = "\033[31m"


def set_prep_colors(red: str, yellow: str, reset: str) -> None:
    global ANSI_RED, ANSI_YELLOW, ANSI_RESET
    ANSI_RED = red
    ANSI_YELLOW = yellow
    ANSI_RESET = reset


def log_prep(
    label: str,
    removed: int,
    reordered: bool,
    extra: str = "",
    color_enabled: bool = False,
) -> None:
    removed_label = f"removed={removed}"
    if color_enabled and removed > 0:
        removed_label = f"{ANSI_RED}{removed_label}{ANSI_RESET}"

    reordered_label = f"reordered={'yes' if reordered else 'no'}"
    if color_enabled and reordered:
        reordered_label = f"{ANSI_YELLOW}{reordered_label}{ANSI_RESET}"

    message = f"PREP {label}:\t{removed_label},\t{reordered_label}"
    if extra:
        extra_label = extra
        if extra.startswith("course_flags_updated="):
            try:
                _, raw_value = extra.split("=", 1)
                if color_enabled and int(raw_value or 0) > 0:
                    extra_label = f"{ANSI_YELLOW}{extra}{ANSI_RESET}"
            except ValueError:
                pass
        message = f"{message}, {extra_label}"
    print(message)


def run_prep_phase(
    youtube_csv_dir: Path,
    channel_source_rows: list[dict],
    script_dir: Path,
    prep_clean_source: bool,
    color_enabled: bool,
    single_video_channel_ids: list[str] | None = None,
    csv_headers: dict[str, str] | None = None,
) -> None:
    if not channel_source_rows:
        print("PREP: no channel source rows; skipping prep phase.")
        return
    if csv_headers is None:
        raise ValueError("csv_headers is required for prep phase.")

    channel_ref_index = prep_helpers.build_channel_ref_index(channel_source_rows)
    next_index = max(channel_ref_index.values(), default=-1) + 1
    if single_video_channel_ids:
        for channel_id in single_video_channel_ids:
            key = normalize_identifier(channel_id)
            if key and key not in channel_ref_index:
                channel_ref_index[key] = next_index
                next_index += 1

    videos_seed_rows = read_csv_rows(youtube_csv_dir / "videos.csv")
    for row in videos_seed_rows:
        channel_id = row.get("channel_id", "")
        key = normalize_identifier(channel_id)
        if key and key not in channel_ref_index:
            channel_ref_index[key] = next_index
            next_index += 1

    channels_rows = read_csv_rows(youtube_csv_dir / "channels.csv")
    channels_rows, removed, reordered = prep_helpers.reorder_channels(channels_rows, channel_ref_index)
    write_csv_rows(youtube_csv_dir / "channels.csv", csv_headers["channels.csv"].split(","), channels_rows)
    log_prep("channels.csv", removed, reordered, color_enabled=color_enabled)

    channel_index = {row.get("channel_id", ""): idx for idx, row in enumerate(channels_rows) if row.get("channel_id")}

    channels_local_rows = read_csv_rows(youtube_csv_dir / "channels_local.csv")
    channels_local_rows, removed, reordered = prep_helpers.reorder_channels_local(channels_local_rows, channel_index)
    write_csv_rows(
        youtube_csv_dir / "channels_local.csv",
        csv_headers["channels_local.csv"].split(","),
        channels_local_rows,
    )
    log_prep("channels_local.csv", removed, reordered, color_enabled=color_enabled)

    videos_rows = read_csv_rows(youtube_csv_dir / "videos.csv")
    videos_rows, removed, reordered = prep_helpers.reorder_videos(videos_rows, channel_index)
    write_csv_rows(youtube_csv_dir / "videos.csv", csv_headers["videos.csv"].split(","), videos_rows)
    log_prep("videos.csv", removed, reordered, color_enabled=color_enabled)

    video_index = {row.get("video_id", ""): idx for idx, row in enumerate(videos_rows) if row.get("video_id")}

    videos_local_rows = read_csv_rows(youtube_csv_dir / "videos_local.csv")
    videos_local_rows, removed, reordered = prep_helpers.reorder_videos_local(videos_local_rows, video_index)
    write_csv_rows(
        youtube_csv_dir / "videos_local.csv",
        csv_headers["videos_local.csv"].split(","),
        videos_local_rows,
    )
    log_prep("videos_local.csv", removed, reordered, color_enabled=color_enabled)

    transcripts_rows = read_csv_rows(youtube_csv_dir / "videos_transcripts.csv")
    if transcripts_rows:
        transcripts_path = youtube_csv_dir / "videos_transcripts.csv"
        with transcripts_path.open(newline="", encoding="utf-8") as handle:
            reader = csv.reader(handle)
            file_header = next(reader, [])
        if not file_header:
            raise ValueError("videos_transcripts.csv is missing a header row.")
        if "video_id" not in file_header:
            raise ValueError("videos_transcripts.csv missing required header: video_id")
        default_header = csv_headers["videos_transcripts.csv"].split(",")
        if file_header != default_header:
            print(
                "WARNING: videos_transcripts.csv header differs from defaults. "
                "Update CSV_HEADERS if this is expected.",
                file=sys.stderr,
            )
        transcripts_rows, removed, reordered = prep_helpers.reorder_videos_transcripts(transcripts_rows, video_index)
        write_csv_rows(
            transcripts_path,
            file_header,
            transcripts_rows,
        )
        log_prep("videos_transcripts.csv", removed, reordered, color_enabled=color_enabled)

    playlists_rows = read_csv_rows(youtube_csv_dir / "playlists.csv")
    playlists_rows, removed, reordered = prep_helpers.reorder_playlists(playlists_rows, channel_index)

    course_ids = set()
    course_path = youtube_csv_dir / "_YouTube_Courses.txt"
    if course_path.exists():
        course_ids = prep_helpers.parse_course_playlist_ids(course_path.read_text(encoding="utf-8").splitlines())
    changed_flags = prep_helpers.reconcile_course_flags(playlists_rows, course_ids)
    write_csv_rows(youtube_csv_dir / "playlists.csv", csv_headers["playlists.csv"].split(","), playlists_rows)
    log_prep(
        "playlists.csv",
        removed,
        reordered,
        extra=f"course_flags_updated={changed_flags}",
        color_enabled=color_enabled,
    )

    playlist_index = {row.get("playlist_id", ""): idx for idx, row in enumerate(playlists_rows) if row.get("playlist_id")}

    playlists_local_rows = read_csv_rows(youtube_csv_dir / "playlists_local.csv")
    playlists_local_rows, removed, reordered = prep_helpers.reorder_playlists_local(playlists_local_rows, playlist_index)
    write_csv_rows(
        youtube_csv_dir / "playlists_local.csv",
        csv_headers["playlists_local.csv"].split(","),
        playlists_local_rows,
    )
    log_prep("playlists_local.csv", removed, reordered, color_enabled=color_enabled)

    playlist_items_rows = read_csv_rows(youtube_csv_dir / "playlistItems.csv")
    playlist_items_rows, removed, reordered = prep_helpers.reorder_playlist_items(playlist_items_rows, playlist_index)
    write_csv_rows(
        youtube_csv_dir / "playlistItems.csv",
        csv_headers["playlistItems.csv"].split(","),
        playlist_items_rows,
    )
    log_prep("playlistItems.csv", removed, reordered, color_enabled=color_enabled)

    audiotrack_rows = read_csv_rows(youtube_csv_dir / "audiotracks.csv")
    audiotrack_rows, removed, reordered = prep_helpers.reorder_audiotracks(audiotrack_rows, video_index)
    write_csv_rows(youtube_csv_dir / "audiotracks.csv", csv_headers["audiotracks.csv"].split(","), audiotrack_rows)
    log_prep("audiotracks.csv", removed, reordered, color_enabled=color_enabled)

    t_source_rows = read_csv_rows(youtube_csv_dir / "t_source_OLD.csv")
    if t_source_rows:
        t_source_rows, removed, reordered = prep_helpers.reorder_t_source(
            t_source_rows, video_index, keep_unmatched=not prep_clean_source
        )
        write_csv_rows(youtube_csv_dir / "t_source_OLD.csv", t_source_rows[0].keys(), t_source_rows)
        log_prep("t_source_OLD.csv", removed, reordered, color_enabled=color_enabled)

        t_source_update = script_dir / "t_source_planning_update.py"
        if t_source_update.exists():
            __import__("subprocess").run(
                [
                    __import__("sys").executable,
                    str(t_source_update),
                    "--source-old",
                    str(youtube_csv_dir / "t_source_OLD.csv"),
                    "--audiotracks",
                    str(youtube_csv_dir / "audiotracks.csv"),
                    "--output",
                    str(youtube_csv_dir / "t_source_PLANNING.csv"),
                ],
                check=False,
            )

    t_source_planning_rows = read_csv_rows(youtube_csv_dir / "t_source_PLANNING.csv")
    if t_source_planning_rows:
        t_source_planning_rows, removed, reordered = prep_helpers.reorder_t_source(
            t_source_planning_rows, video_index, keep_unmatched=not prep_clean_source
        )
        write_csv_rows(
            youtube_csv_dir / "t_source_PLANNING.csv",
            t_source_planning_rows[0].keys(),
            t_source_planning_rows,
        )
        log_prep("t_source_PLANNING.csv", removed, reordered, color_enabled=color_enabled)

    t_source_csv = youtube_csv_dir / "t_source.csv"
    if t_source_csv.exists():
        t_source_csv_rows = read_csv_rows(t_source_csv)
        if t_source_csv_rows:
            t_source_csv_rows, removed, reordered = prep_helpers.reorder_t_source(
                t_source_csv_rows, video_index, keep_unmatched=not prep_clean_source
            )
            write_csv_rows(t_source_csv, t_source_csv_rows[0].keys(), t_source_csv_rows)
            log_prep("t_source.csv", removed, reordered, color_enabled=color_enabled)


