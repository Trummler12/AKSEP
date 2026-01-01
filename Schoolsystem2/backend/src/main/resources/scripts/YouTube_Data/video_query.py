import argparse
import csv
import datetime as dt
import json
import os
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlencode, urlparse
from urllib.request import urlopen

from video_query_helpers import prep as prep_helpers


API_BASE = "https://www.googleapis.com/youtube/v3"

ANSI_RESET = "\033[0m"
ANSI_GREEN = "\033[32m"
ANSI_YELLOW = "\033[33m"
ANSI_RED = "\033[31m"
ANSI_ORANGE = "\033[38;5;208m"

CSV_HEADERS = {
    "channels.csv": "channel_id,title,description,custom_url,published_at,default_language,country,uploads_playlist_id,last_updated",
    "channels_local.csv": "channel_id,language_code,title,description",
    "videos.csv": "video_id,channel_id,channel_title,title,description,published_at,category_id,tags,duration,caption_available,default_language,default_audio_language,view_count,like_count,comment_count",
    "videos_local.csv": "video_id,language_code,title",
    "videos_transcripts.csv": "video_id,language_code,is_generated,is_translatable,transcript",
    "playlists.csv": "playlist_id,channel_id,channel_title,title,description,published_at,item_count,default_language,playlist_type_id",
    "playlists_local.csv": "playlist_id,language_code,title,description",
    "playlistItems.csv": "playlist_item_id,playlist_id,position,video_id,video_owner_channel_id,video_owner_channel_title",
    "comments.csv": "video_id,comment_id,text_original,like_count,published_at,updated_at",
    "videoCategories.csv": "category_id,title,assignable",
    "audiotracks.csv": "video_id,languages_all,languages_non_auto,has_auto_dub,source,fetched_at,status,error",
}


def parse_dotenv_file(path: Path) -> dict:
    out = {}
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        out[k.strip()] = v.strip().strip('"').strip("'")
    return out


def load_dotenv_upwards(start_dir: Path, filename: str = ".env", max_levels: int = 12) -> dict:
    current = start_dir
    for _ in range(max_levels + 1):
        candidate = current / filename
        if candidate.exists():
            return parse_dotenv_file(candidate)
        if current.parent == current:
            break
        current = current.parent
    return {}


def get_api_key() -> str:
    env_key = os.getenv("YOUTUBE_DATA_API_KEY")
    if env_key:
        return env_key
    env = load_dotenv_upwards(Path(__file__).resolve())
    return env.get("YOUTUBE_DATA_API_KEY", "")


def api_get(path: str, params: dict) -> dict:
    query = urlencode(params)
    url = f"{API_BASE}/{path}?{query}"
    with urlopen(url) as resp:
        return json.loads(resp.read().decode("utf-8"))


def normalize_handle(value: str) -> str:
    raw = (value or "").strip()
    if not raw:
        return ""
    if raw.startswith("http"):
        parsed = urlparse(raw)
        parts = [p for p in parsed.path.split("/") if p]
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


def read_csv_rows(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_local_rows(path: Path, header: list[str], rows_by_key: dict[tuple[str, str], dict]) -> None:
    rows = list(rows_by_key.values())
    rows.sort(key=lambda item: (item.get(header[0], ""), item.get(header[1], "")))
    write_csv_rows(path, header, rows)


def write_csv_rows(path: Path, header: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        writer.writerows(rows)


def ensure_csvs(data_dir: Path) -> None:
    data_dir.mkdir(parents=True, exist_ok=True)
    for name, header in CSV_HEADERS.items():
        path = data_dir / name
        if not path.exists():
            path.write_text(header + "\n", encoding="utf-8")


def read_channel_sources(path: Path) -> list[dict]:
    rows = []
    with path.open(encoding="utf-8") as f:
        raw_lines = f.read().splitlines()
    filtered = []
    for line in raw_lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        filtered.append(line)
    reader = csv.DictReader(filtered)
    for idx, row in enumerate(reader):
        row = {k: (v or "").strip() for k, v in row.items()}
        row["__index"] = idx
        rows.append(row)
    return rows



def parse_course_blocks(path: Path) -> dict[str, list[str]]:
    if not path.exists():
        return {}
    lines = path.read_text(encoding="utf-8").splitlines()
    blocks: dict[str, list[str]] = {}
    current_key = ""
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "playlist?list=" in line:
            if not current_key:
                continue
            playlist_id = ""
            if "list=" in line:
                playlist_id = line.split("list=", 1)[1].split("&", 1)[0].strip()
            if playlist_id:
                blocks.setdefault(current_key, []).append(playlist_id)
            continue
        header = line[:-1].strip() if line.endswith(":") else line
        current_key = header
        blocks.setdefault(current_key, [])
    return blocks

def matches_course_header(header: str, title: str, handle: str) -> bool:
    header_clean = header.strip()
    if not header_clean:
        return False
    header_norm = normalize_identifier(header_clean.rstrip(":"))
    title_norm = normalize_identifier(title)
    handle_norm = normalize_identifier(handle)
    if header_norm and (header_norm == title_norm or header_norm == handle_norm):
        return True
    header_lower = header_clean.lower()
    return (title_norm and title_norm in header_lower) or (handle_norm and handle_norm in header_lower) # type: ignore

def find_start_index(rows: list[dict], identifiers: list[str]) -> int:
    if not identifiers:
        return 0
    not_found = []
    not_unique = []
    matches = []

    for raw_ident in identifiers:
        ident = normalize_identifier(raw_ident)
        if not ident:
            continue
        matched_rows = []
        for row in rows:
            values = [
                row.get("sauthorID", ""),
                row.get("title", ""),
                row.get("custom_url", ""),
                row.get("channel_id", ""),
            ]
            normalized = [normalize_identifier(v) for v in values if v]
            if ident in normalized:
                matched_rows.append(row)
        if not matched_rows:
            not_found.append(raw_ident)
        elif len(matched_rows) > 1:
            not_unique.append((raw_ident, matched_rows))
        else:
            matches.append(matched_rows[0]["__index"])

    if not_found or not_unique:
        if not_found:
            print("not found:", not_found, file=sys.stderr)
        for ident, rows in not_unique:
            print(f"not unique: {ident}", file=sys.stderr)
            for row in rows:
                print(f"\t{row}", file=sys.stderr)
        raise SystemExit(4)

    return min(matches) if matches else 0


def parse_int(value: str | int | None) -> int:
    try:
        return int(value) # type: ignore
    except (TypeError, ValueError):
        return 0


def chunked(values: list[str], size: int) -> list[list[str]]:
    return [values[i : i + size] for i in range(0, len(values), size)]


def fetch_upload_video_ids(
    api_key: str,
    uploads_playlist_id: str,
    known_ids: set[str],
    max_pages: int,
    stop_on_known: bool,
) -> list[str]:
    collected = []
    page_token = None
    pages = 0
    while True:
        params = {
            "part": "snippet",
            "playlistId": uploads_playlist_id,
            "maxResults": 50,
            "key": api_key,
        }
        if page_token:
            params["pageToken"] = page_token
        data = api_get("playlistItems", params)
        items = data.get("items", [])
        batch = []
        for item in items:
            vid = item.get("snippet", {}).get("resourceId", {}).get("videoId", "")
            if vid:
                batch.append(vid)
        collected.extend(batch)

        if stop_on_known and batch and batch[-1] in known_ids:
            break
        page_token = data.get("nextPageToken")
        pages += 1
        if not page_token:
            break
        if max_pages and pages >= max_pages:
            break
    return collected


def ensure_playlist_type_csv(path: Path) -> None:
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "playlist_type_id,playlist_type\n"
        "1,playlist\n"
        "2,course\n",
        encoding="utf-8",
    )

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
) -> None:
    if not channel_source_rows:
        print("PREP: no channel source rows; skipping prep phase.")
        return

    channel_ref_index = prep_helpers.build_channel_ref_index(channel_source_rows)

    channels_rows = read_csv_rows(youtube_csv_dir / "channels.csv")
    channels_rows, removed, reordered = prep_helpers.reorder_channels(channels_rows, channel_ref_index)
    write_csv_rows(youtube_csv_dir / "channels.csv", CSV_HEADERS["channels.csv"].split(","), channels_rows)
    log_prep("channels.csv", removed, reordered, color_enabled=color_enabled)

    channel_index = {row.get("channel_id", ""): idx for idx, row in enumerate(channels_rows) if row.get("channel_id")}

    channels_local_rows = read_csv_rows(youtube_csv_dir / "channels_local.csv")
    channels_local_rows, removed, reordered = prep_helpers.reorder_channels_local(channels_local_rows, channel_index)
    write_csv_rows(
        youtube_csv_dir / "channels_local.csv",
        CSV_HEADERS["channels_local.csv"].split(","),
        channels_local_rows,
    )
    log_prep("channels_local.csv", removed, reordered, color_enabled=color_enabled)

    videos_rows = read_csv_rows(youtube_csv_dir / "videos.csv")
    videos_rows, removed, reordered = prep_helpers.reorder_videos(videos_rows, channel_index)
    write_csv_rows(youtube_csv_dir / "videos.csv", CSV_HEADERS["videos.csv"].split(","), videos_rows)
    log_prep("videos.csv", removed, reordered, color_enabled=color_enabled)

    video_index = {row.get("video_id", ""): idx for idx, row in enumerate(videos_rows) if row.get("video_id")}

    videos_local_rows = read_csv_rows(youtube_csv_dir / "videos_local.csv")
    videos_local_rows, removed, reordered = prep_helpers.reorder_videos_local(videos_local_rows, video_index)
    write_csv_rows(
        youtube_csv_dir / "videos_local.csv",
        CSV_HEADERS["videos_local.csv"].split(","),
        videos_local_rows,
    )
    log_prep("videos_local.csv", removed, reordered, color_enabled=color_enabled)

    playlists_rows = read_csv_rows(youtube_csv_dir / "playlists.csv")
    playlists_rows, removed, reordered = prep_helpers.reorder_playlists(playlists_rows, channel_index)

    course_ids = set()
    course_path = youtube_csv_dir / "_YouTube_Courses.txt"
    if course_path.exists():
        course_ids = prep_helpers.parse_course_playlist_ids(course_path.read_text(encoding="utf-8").splitlines())
    changed_flags = prep_helpers.reconcile_course_flags(playlists_rows, course_ids)
    write_csv_rows(youtube_csv_dir / "playlists.csv", CSV_HEADERS["playlists.csv"].split(","), playlists_rows)
    log_prep(
        "playlists.csv",
        removed,
        reordered,
        extra=f"course_flags_updated={changed_flags}",
        color_enabled=color_enabled,
    )

    playlist_index = {
        row.get("playlist_id", ""): idx for idx, row in enumerate(playlists_rows) if row.get("playlist_id")
    }

    playlists_local_rows = read_csv_rows(youtube_csv_dir / "playlists_local.csv")
    playlists_local_rows, removed, reordered = prep_helpers.reorder_playlists_local(playlists_local_rows, playlist_index)
    write_csv_rows(
        youtube_csv_dir / "playlists_local.csv",
        CSV_HEADERS["playlists_local.csv"].split(","),
        playlists_local_rows,
    )
    log_prep("playlists_local.csv", removed, reordered, color_enabled=color_enabled)

    playlist_items_rows = read_csv_rows(youtube_csv_dir / "playlistItems.csv")
    playlist_items_rows, removed, reordered = prep_helpers.reorder_playlist_items(playlist_items_rows, playlist_index)
    write_csv_rows(
        youtube_csv_dir / "playlistItems.csv",
        CSV_HEADERS["playlistItems.csv"].split(","),
        playlist_items_rows,
    )
    log_prep("playlistItems.csv", removed, reordered, color_enabled=color_enabled)

    audiotracks_rows = read_csv_rows(youtube_csv_dir / "audiotracks.csv")
    if audiotracks_rows:
        audiotracks_rows, removed, reordered = prep_helpers.reorder_audiotracks(audiotracks_rows, video_index)
        write_csv_rows(
            youtube_csv_dir / "audiotracks.csv",
            CSV_HEADERS["audiotracks.csv"].split(","),
            audiotracks_rows,
        )
        log_prep("audiotracks.csv", removed, reordered, color_enabled=color_enabled)

    t_source_old = youtube_csv_dir / "t_source_OLD.csv"
    if t_source_old.exists():
        t_source_rows = read_csv_rows(t_source_old)
        if t_source_rows:
            t_source_rows, removed, reordered = prep_helpers.reorder_t_source(
                t_source_rows, video_index, keep_unmatched=not prep_clean_source
            )
            write_csv_rows(t_source_old, list(t_source_rows[0].keys()), t_source_rows)
            log_prep("t_source_OLD.csv", removed, reordered, color_enabled=color_enabled)

        t_source_update = script_dir / "t_source_planning_update.py"
        if t_source_update.exists():
            subprocess.run(
                [
                    sys.executable,
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

def run_sanitizer(script_dir: Path, youtube_csv_dir: Path) -> None:
    sanitize_script = script_dir / "sanitize_youtube_csv.py"
    if not sanitize_script.exists():
        print("WARN: sanitize_youtube_csv.py not found; skipping sanitization.", file=sys.stderr)
        return
    try:
        subprocess.run(
            [sys.executable, str(sanitize_script), "--input", str(youtube_csv_dir / "videos.csv")],
            check=True,
        )
    except subprocess.CalledProcessError as exc:
        print(f"WARN: sanitizer failed (exit {exc.returncode}); continuing.", file=sys.stderr)


def record_change(changes: dict[str, int], key: str, amount: int = 1) -> None:
    if amount <= 0:
        return
    changes[key] = changes.get(key, 0) + amount


def has_changes(changes: dict[str, int]) -> bool:
    return any(value > 0 for value in changes.values())


def format_change_summary(changes: dict[str, int]) -> str:
    return format_change_summary_colored(changes, use_color=False)


def use_ansi_color(enabled: bool) -> bool:
    if not enabled:
        return False
    if os.getenv("NO_COLOR"):
        return False
    return sys.stdout.isatty()


def color_for_change_key(key: str) -> str:
    if key.endswith("_added"):
        return ANSI_GREEN
    if key.endswith("_removed"):
        return ANSI_RED
    if key.endswith("_missing"):
        return ANSI_ORANGE
    if key.endswith("_updated") or key.endswith("_changed") or key.endswith("_replaced"):
        return ANSI_YELLOW
    return ""


def format_change_summary_colored(changes: dict[str, int], use_color: bool) -> str:
    parts = []
    for key, value in changes.items():
        if not value:
            continue
        part = f"{key}={value}"
        color = color_for_change_key(key)
        if use_color and color:
            part = f"{color}{part}{ANSI_RESET}"
        parts.append(part)
    return ", ".join(parts)

def main() -> int:
    parser = argparse.ArgumentParser(description="Pull YouTube channel/video/playlist data into CSVs.")
    parser.add_argument("--mode", choices=["update", "discover", "new"], default="update")
    parser.add_argument("--start-from", action="append", default=[])
    parser.add_argument("--channel-limit", type=int, default=0)
    parser.add_argument("--video-page-limit", type=int, default=0)
    parser.add_argument("--playlist-page-limit", type=int, default=0)
    parser.add_argument("--skip-localizations", action="store_true")
    parser.add_argument("--include-comments", action="store_true")
    parser.add_argument("--comment-video-limit", type=int, default=0)
    parser.add_argument("--print-json", action="store_true")
    parser.add_argument("--data-root", default="")
    parser.add_argument("--prep-clean-source", action="store_true")
    parser.add_argument("--prep-only", action="store_true")
    parser.add_argument("--no-color", action="store_true")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[1]
    if args.data_root:
        candidate = Path(args.data_root)
        if not candidate.is_absolute():
            candidate = (Path.cwd() / candidate).resolve()
        else:
            candidate = candidate.resolve()
        if not candidate.exists() or not candidate.is_dir():
            print(f"ERROR: data-root does not exist: {candidate}", file=sys.stderr)
            return 2
        channel_marker = candidate / "_YouTube_Channels.csv"
        if not channel_marker.exists():
            print(
                "ERROR: data-root missing _YouTube_Channels.csv; refuse to create CSVs in an unintended location.",
                file=sys.stderr,
            )
            return 2
        youtube_csv_dir = candidate
    else:
        youtube_csv_dir = resources_dir / "csv" / "youtube"
    channel_source_csv = youtube_csv_dir / "_YouTube_Channels.csv"

    ensure_csvs(youtube_csv_dir)
    ensure_playlist_type_csv(youtube_csv_dir / "playlist_type.csv")

    color_enabled = use_ansi_color(not args.no_color)
    channel_source_rows = read_channel_sources(channel_source_csv)
    also_prep_clean_source_csv_prep_files = args.prep_clean_source
    run_prep_phase(
        youtube_csv_dir,
        channel_source_rows,
        script_dir,
        also_prep_clean_source_csv_prep_files,
        color_enabled,
    )
    if args.prep_only:
        print("OK: prep-only run complete.")
        return 0

    api_key = get_api_key()
    if not api_key:
        print("Missing YOUTUBE_DATA_API_KEY.", file=sys.stderr)
        return 2
    start_index = find_start_index(channel_source_rows, [s for arg in args.start_from for s in arg.split(",")])

    include_localizations = not args.skip_localizations

    existing_channels = read_csv_rows(youtube_csv_dir / "channels.csv")
    existing_channels_by_id = {row.get("channel_id", ""): row for row in existing_channels if row.get("channel_id")}
    existing_channels_by_handle = {
        normalize_identifier(row.get("custom_url", "")): row
        for row in existing_channels
        if row.get("custom_url")
    }

    existing_videos = read_csv_rows(youtube_csv_dir / "videos.csv")
    existing_videos_by_id = {row.get("video_id", ""): row for row in existing_videos if row.get("video_id")}
    existing_videos_by_channel: dict[str, list[dict]] = {}
    for row in existing_videos:
        cid = row.get("channel_id", "")
        if cid:
            existing_videos_by_channel.setdefault(cid, []).append(row)
    for rows in existing_videos_by_channel.values():
        rows.sort(key=lambda item: item.get("published_at", ""))

    existing_playlists = read_csv_rows(youtube_csv_dir / "playlists.csv")
    existing_playlists_by_id = {row.get("playlist_id", ""): row for row in existing_playlists if row.get("playlist_id")}

    existing_playlist_items = read_csv_rows(youtube_csv_dir / "playlistItems.csv")

    course_blocks = parse_course_blocks(youtube_csv_dir / "_YouTube_Courses.txt")

    channels_local_by_key = {
        (row.get("channel_id", ""), row.get("language_code", "")): row
        for row in read_csv_rows(youtube_csv_dir / "channels_local.csv")
        if row.get("channel_id") and row.get("language_code")
    }
    videos_local_by_key = {
        (row.get("video_id", ""), row.get("language_code", "")): row
        for row in read_csv_rows(youtube_csv_dir / "videos_local.csv")
        if row.get("video_id") and row.get("language_code")
    }
    playlists_local_by_key = {
        (row.get("playlist_id", ""), row.get("language_code", "")): row
        for row in read_csv_rows(youtube_csv_dir / "playlists_local.csv")
        if row.get("playlist_id") and row.get("language_code")
    }

    processed_channels = 0
    today = dt.date.today().isoformat()

    channel_order = {row.get("channel_id", ""): row["__index"] for row in channel_source_rows if row.get("channel_id")}

    def sort_channel_rows(rows: list[dict]) -> list[dict]:
        return sorted(rows, key=lambda item: channel_order.get(item.get("channel_id", ""), 9999))

    for row in channel_source_rows[start_index:]:
        if args.channel_limit and processed_channels >= args.channel_limit:
            break

        channel_id = row.get("channel_id", "")
        handle = normalize_handle(row.get("custom_url", ""))
        changes: dict[str, int] = {}

        if not channel_id and handle:
            data = api_get("channels", {"part": "snippet", "forHandle": handle, "key": api_key})
            items = data.get("items", [])
            if items:
                channel_id = items[0].get("id", "")

        if not channel_id:
            print(f"SKIP: could not resolve channel_id for {row}", file=sys.stderr)
            continue
        if channel_id and channel_id not in channel_order:
            channel_order[channel_id] = row["__index"]

        exists = channel_id in existing_channels_by_id or normalize_identifier(handle) in existing_channels_by_handle
        if args.mode in ("discover", "new") and exists:
            continue

        if not exists:
            existing_channels_by_id[channel_id] = {
                "channel_id": channel_id,
                "title": row.get("title", ""),
                "description": "",
                "custom_url": row.get("custom_url", ""),
                "published_at": "",
                "default_language": "",
                "country": "",
                "uploads_playlist_id": "",
                "last_updated": "",
            }
            if row.get("custom_url"):
                existing_channels_by_handle[normalize_identifier(row.get("custom_url", ""))] = existing_channels_by_id[
                    channel_id
                ]
            write_csv_rows(
                youtube_csv_dir / "channels.csv",
                CSV_HEADERS["channels.csv"].split(","),
                sort_channel_rows(list(existing_channels_by_id.values())),
            )
            record_change(changes, "channels_added", 1)

        uploads_id = existing_channels_by_id.get(channel_id, {}).get("uploads_playlist_id", "")
        channel_item = None
        if not uploads_id:
            channel_parts = "snippet,contentDetails"
            if include_localizations:
                channel_parts = f"{channel_parts},localizations"
            channels_resp = api_get(
                "channels",
                {"part": channel_parts, "id": channel_id, "key": api_key},
            )
            if args.print_json:
                print(json.dumps({"channels": channels_resp}, indent=2))
            items = channels_resp.get("items", [])
            if items:
                channel_item = items[0]

        if channel_item:
            snippet = channel_item.get("snippet", {})
            uploads_id = channel_item.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads", "")
            prior = existing_channels_by_id.get(channel_id, {}).copy()
            existing_channels_by_id[channel_id] = {
                "channel_id": channel_id,
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "custom_url": snippet.get("customUrl", ""),
                "published_at": snippet.get("publishedAt", ""),
                "default_language": snippet.get("defaultLanguage", ""),
                "country": snippet.get("country", ""),
                "uploads_playlist_id": uploads_id,
                "last_updated": existing_channels_by_id.get(channel_id, {}).get("last_updated", ""),
            }
            existing_channels_by_handle[normalize_identifier(snippet.get("customUrl", ""))] = existing_channels_by_id[
                channel_id
            ]
            if prior:
                changed = any(
                    existing_channels_by_id[channel_id].get(field, "") != prior.get(field, "")
                    for field in (
                        "title",
                        "description",
                        "custom_url",
                        "published_at",
                        "default_language",
                        "country",
                        "uploads_playlist_id",
                    )
                )
                if changed:
                    record_change(changes, "channels_updated", 1)
            if include_localizations:
                for lang, localized in channel_item.get("localizations", {}).items():
                    existing_local = channels_local_by_key.get((channel_id, lang), {})
                    channels_local_by_key[(channel_id, lang)] = {
                        "channel_id": channel_id,
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }
                    if (
                        existing_local.get("title") != localized.get("title", "")
                        or existing_local.get("description") != localized.get("description", "")
                    ):
                        record_change(changes, "channels_local_updated", 1)

        if not uploads_id:
            print(f"SKIP: no uploads playlist for channel {channel_id}", file=sys.stderr)
            continue

        channel_block = existing_videos_by_channel.get(channel_id, [])
        channel_block.sort(key=lambda item: item.get("published_at", ""))
        known_ids = {row.get("video_id", "") for row in channel_block if row.get("video_id")}
        stop_on_known = bool(known_ids)
        collected_ids = fetch_upload_video_ids(
            api_key,
            uploads_id,
            known_ids,
            args.video_page_limit,
            stop_on_known=stop_on_known,
        )
        if not collected_ids:
            print(f"WARNING: no uploads collected for {channel_id}", file=sys.stderr)
            continue

        fetched_ids = [vid for vid in collected_ids if vid]
        fetched_set = set(fetched_ids)

        video_rows = []
        for chunk in chunked(fetched_ids, 50):
            if not chunk:
                continue
            video_parts = "snippet,contentDetails,statistics"
            if include_localizations:
                video_parts = f"{video_parts},localizations"
            videos_resp = api_get(
                "videos",
                {"part": video_parts, "id": ",".join(chunk), "key": api_key},
            )
            if args.print_json:
                print(json.dumps({"videos": videos_resp}, indent=2))
            for item in videos_resp.get("items", []):
                snippet = item.get("snippet", {})
                stats = item.get("statistics", {})
                content = item.get("contentDetails", {})
                tags = snippet.get("tags", [])
                row_data = {
                    "video_id": item.get("id", ""),
                    "channel_id": snippet.get("channelId", ""),
                    "channel_title": snippet.get("channelTitle", ""),
                    "title": snippet.get("title", ""),
                    "description": snippet.get("description", ""),
                    "published_at": snippet.get("publishedAt", ""),
                    "category_id": snippet.get("categoryId", ""),
                    "tags": "|".join(tags),
                    "duration": content.get("duration", ""),
                    "caption_available": content.get("caption", ""),
                    "default_language": snippet.get("defaultLanguage", ""),
                    "default_audio_language": snippet.get("defaultAudioLanguage", ""),
                    "view_count": stats.get("viewCount", ""),
                    "like_count": stats.get("likeCount", ""),
                    "comment_count": stats.get("commentCount", ""),
                }
                video_rows.append(row_data)
                if include_localizations:
                    for key in list(videos_local_by_key.keys()):
                        if key[0] == row_data["video_id"]:
                            videos_local_by_key.pop(key, None)
                    for lang, localized in item.get("localizations", {}).items():
                        existing_local = videos_local_by_key.get((row_data["video_id"], lang), {})
                        videos_local_by_key[(row_data["video_id"], lang)] = {
                            "video_id": row_data["video_id"],
                            "language_code": lang,
                            "title": localized.get("title", ""),
                        }
                        if existing_local.get("title") != localized.get("title", ""):
                            record_change(changes, "videos_local_updated", 1)

        video_rows.sort(key=lambda item: item.get("published_at", ""))

        oldest_known = ""
        for vid in reversed(fetched_ids):
            if vid in known_ids:
                oldest_known = vid
                break

        start_index = 0
        if oldest_known:
            for idx, item in enumerate(channel_block):
                if item.get("video_id") == oldest_known:
                    start_index = idx
                    break

        old_segment = channel_block[start_index:]
        missing = [row.get("video_id", "") for row in old_segment if row.get("video_id") not in fetched_set]
        if missing:
            print(f"WARNING: missing existing videos in fetched batch for {channel_id}: {missing}", file=sys.stderr)
            record_change(changes, "videos_missing", len(missing))

        new_block = channel_block[:start_index] + video_rows
        existing_videos_by_channel[channel_id] = new_block
        channel_block = new_block
        existing_videos_by_id = {row.get("video_id", ""): row for rows in existing_videos_by_channel.values() for row in rows if row.get("video_id")}

        merged_videos = list(existing_videos_by_id.values())
        merged_videos.sort(
            key=lambda item: (
                channel_order.get(item.get("channel_id", ""), 9999),
                item.get("published_at", ""),
            )
        )
        write_csv_rows(youtube_csv_dir / "videos.csv", CSV_HEADERS["videos.csv"].split(","), merged_videos)
        old_ids = {row.get("video_id", "") for row in old_segment if row.get("video_id")}
        new_ids = {row.get("video_id", "") for row in video_rows if row.get("video_id")}
        record_change(changes, "videos_added", len(new_ids - old_ids))
        record_change(changes, "videos_removed", len(old_ids - new_ids))
        if new_ids != old_ids:
            record_change(changes, "videos_replaced", 1)

        playlists_items = []
        page_token = None
        pages = 0
        while True:
            playlist_parts = "snippet,contentDetails"
            if include_localizations:
                playlist_parts = f"{playlist_parts},localizations"
            params = {
                "part": playlist_parts,
                "channelId": channel_id,
                "maxResults": 50,
                "key": api_key,
            }
            if page_token:
                params["pageToken"] = page_token
            playlists_resp = api_get("playlists", params)
            if args.print_json:
                print(json.dumps({"playlists": playlists_resp}, indent=2))
            playlists_items.extend(playlists_resp.get("items", []))
            page_token = playlists_resp.get("nextPageToken")
            pages += 1
            if not page_token:
                break
            if args.playlist_page_limit and pages >= args.playlist_page_limit:
                break

        course_ids = []
        title_match = row.get("title", "")
        for header, ids in course_blocks.items():
            if matches_course_header(header, title_match, handle):
                course_ids.extend(ids)

        course_set = set(course_ids)
        playlist_ids_in_response = {item.get("id", "") for item in playlists_items if item.get("id")}
        missing_course_ids = [pid for pid in course_set if pid and pid not in playlist_ids_in_response]
        if missing_course_ids:
            print(
                f"WARNING: course playlists missing from channel list for {channel_id}: {missing_course_ids}",
                file=sys.stderr,
            )

        changed_playlist_ids = set()
        for item in playlists_items:
            snippet = item.get("snippet", {})
            row_data = {
                "playlist_id": item.get("id", ""),
                "channel_id": snippet.get("channelId", ""),
                "channel_title": snippet.get("channelTitle", ""),
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "published_at": snippet.get("publishedAt", ""),
                "item_count": item.get("contentDetails", {}).get("itemCount", ""),
                "default_language": snippet.get("defaultLanguage", ""),
                "playlist_type_id": "2" if item.get("id", "") in course_set else "1",
            }
            existing = existing_playlists_by_id.get(row_data["playlist_id"])
            local_changed = False
            if include_localizations and item.get("localizations"):
                for lang, localized in item.get("localizations", {}).items():
                    existing_local = playlists_local_by_key.get((row_data["playlist_id"], lang), {})
                    if (
                        existing_local.get("title") != localized.get("title", "")
                        or existing_local.get("description") != localized.get("description", "")
                    ):
                        local_changed = True
                for key in list(playlists_local_by_key.keys()):
                    if key[0] == row_data["playlist_id"]:
                        playlists_local_by_key.pop(key, None)
                for lang, localized in item.get("localizations", {}).items():
                    playlists_local_by_key[(row_data["playlist_id"], lang)] = {
                        "playlist_id": row_data["playlist_id"],
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }
                if local_changed:
                    record_change(changes, "playlists_local_updated", 1)
                    if (
                        existing_local.get("title") != localized.get("title", "")
                        or existing_local.get("description") != localized.get("description", "")
                    ):
                        record_change(changes, "channels_local_updated", 1)
            if not existing or any(existing.get(k, "") != row_data.get(k, "") for k in row_data.keys()) or local_changed:
                changed_playlist_ids.add(row_data["playlist_id"])
            existing_playlists_by_id[row_data["playlist_id"]] = row_data

        channel_playlist_ids = [
            pid for pid, row_data in existing_playlists_by_id.items() if row_data.get("channel_id") == channel_id
        ]
        removed_playlists = {pid for pid in channel_playlist_ids if pid not in playlist_ids_in_response}
        if removed_playlists:
            for pid in removed_playlists:
                existing_playlists_by_id.pop(pid, None)
                for key in list(playlists_local_by_key.keys()):
                    if key[0] == pid:
                        playlists_local_by_key.pop(key, None)
            existing_playlist_items = [
                row_data for row_data in existing_playlist_items if row_data.get("playlist_id") not in removed_playlists
            ]
            record_change(changes, "playlists_removed", len(removed_playlists))

        merged_playlists = list(existing_playlists_by_id.values())
        merged_playlists.sort(
            key=lambda item: (
                channel_order.get(item.get("channel_id", ""), 9999),
                item.get("published_at", ""),
            )
        )

        playlist_index = {
            row_data.get("playlist_id", ""): idx
            for idx, row_data in enumerate(merged_playlists)
            if row_data.get("playlist_id")
        }

        if changed_playlist_ids:
            record_change(changes, "playlists_changed", len(changed_playlist_ids))
            updated_playlist_items = [
                row_data
                for row_data in existing_playlist_items
                if row_data.get("playlist_id", "") not in changed_playlist_ids
            ]
            for playlist_id in changed_playlist_ids:
                page_token = None
                while True:
                    params = {
                        "part": "snippet",
                        "playlistId": playlist_id,
                        "maxResults": 50,
                        "key": api_key,
                    }
                    if page_token:
                        params["pageToken"] = page_token
                    items_resp = api_get("playlistItems", params)
                    if args.print_json:
                        print(json.dumps({"playlistItems": items_resp}, indent=2))
                    for item in items_resp.get("items", []):
                        snippet = item.get("snippet", {})
                        updated_playlist_items.append(
                            {
                                "playlist_item_id": item.get("id", ""),
                                "playlist_id": snippet.get("playlistId", ""),
                                "position": snippet.get("position", ""),
                                "video_id": snippet.get("resourceId", {}).get("videoId", ""),
                                "video_owner_channel_id": snippet.get("videoOwnerChannelId", ""),
                                "video_owner_channel_title": snippet.get("videoOwnerChannelTitle", ""),
                            }
                        )
                        record_change(changes, "playlist_items_added", 1)
                    page_token = items_resp.get("nextPageToken")
                    if not page_token:
                        break
            updated_playlist_items.sort(
                key=lambda item: (
                    playlist_index.get(item.get("playlist_id", ""), 9999),
                    parse_int(item.get("position", "")),
                )
            )
            existing_playlist_items = updated_playlist_items

        write_csv_rows(youtube_csv_dir / "playlists.csv", CSV_HEADERS["playlists.csv"].split(","), merged_playlists)
        write_csv_rows(
            youtube_csv_dir / "playlistItems.csv",
            CSV_HEADERS["playlistItems.csv"].split(","),
            existing_playlist_items,
        )

        if include_localizations:
            write_local_rows(
                youtube_csv_dir / "videos_local.csv",
                CSV_HEADERS["videos_local.csv"].split(","),
                videos_local_by_key,
            )
            write_local_rows(
                youtube_csv_dir / "playlists_local.csv",
                CSV_HEADERS["playlists_local.csv"].split(","),
                playlists_local_by_key,
            )

        if args.include_comments and args.comment_video_limit > 0:
            comment_rows = read_csv_rows(youtube_csv_dir / "comments.csv")
            channel_video_ids = [row.get("video_id", "") for row in channel_block if row.get("video_id")]
            for video_id in channel_video_ids[: args.comment_video_limit]:
                comments = api_get(
                    "commentThreads",
                    {
                        "part": "snippet",
                        "videoId": video_id,
                        "order": "relevance",
                        "maxResults": 100,
                        "key": api_key,
                    },
                )
                if args.print_json:
                    print(json.dumps({"commentThreads": comments}, indent=2))
                video_comment_rows = []
                for item in comments.get("items", []):
                    top = item.get("snippet", {}).get("topLevelComment", {})
                    snippet = top.get("snippet", {})
                    like_count = parse_int(snippet.get("likeCount", 0))
                    if like_count <= 9:
                        continue
                    video_comment_rows.append(
                        {
                            "video_id": video_id,
                            "comment_id": top.get("id", ""),
                            "text_original": snippet.get("textOriginal", ""),
                            "like_count": str(like_count),
                            "published_at": snippet.get("publishedAt", ""),
                            "updated_at": snippet.get("updatedAt", ""),
                        }
                    )
                video_comment_rows.sort(key=lambda row: parse_int(row["like_count"]), reverse=True)
                if video_comment_rows:
                    record_change(changes, "comments_added", len(video_comment_rows))
                comment_rows.extend(video_comment_rows)
            write_csv_rows(youtube_csv_dir / "comments.csv", CSV_HEADERS["comments.csv"].split(","), comment_rows)

        existing_channels_by_id[channel_id]["last_updated"] = today
        processed_channels += 1
        if has_changes(changes):
            summary = format_change_summary_colored(changes, use_color=color_enabled)
            print(f"UPDATED channel {channel_id}: {summary}")

    all_channel_ids = [row.get("channel_id", "") for row in existing_channels_by_id.values() if row.get("channel_id")]
    for chunk in chunked(all_channel_ids, 50):
        if not chunk:
            continue
        channel_parts = "snippet,contentDetails"
        if include_localizations:
            channel_parts = f"{channel_parts},localizations"
        channels_resp = api_get("channels", {"part": channel_parts, "id": ",".join(chunk), "key": api_key})
        if args.print_json:
            print(json.dumps({"channels": channels_resp}, indent=2))
        for item in channels_resp.get("items", []):
            snippet = item.get("snippet", {})
            uploads_id = item.get("contentDetails", {}).get("relatedPlaylists", {}).get("uploads", "")
            channel_id = item.get("id", "")
            existing_channels_by_id[channel_id] = {
                "channel_id": channel_id,
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "custom_url": snippet.get("customUrl", ""),
                "published_at": snippet.get("publishedAt", ""),
                "default_language": snippet.get("defaultLanguage", ""),
                "country": snippet.get("country", ""),
                "uploads_playlist_id": uploads_id,
                "last_updated": existing_channels_by_id.get(channel_id, {}).get("last_updated", ""),
            }
            if include_localizations:
                for lang, localized in item.get("localizations", {}).items():
                    channels_local_by_key[(channel_id, lang)] = {
                        "channel_id": channel_id,
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }
                    if (
                        existing_local.get("title") != localized.get("title", "")
                        or existing_local.get("description") != localized.get("description", "")
                    ):
                        record_change(changes, "channels_local_updated", 1)

    write_csv_rows(
        youtube_csv_dir / "channels.csv",
        CSV_HEADERS["channels.csv"].split(","),
        sort_channel_rows(list(existing_channels_by_id.values())),
    )
    if include_localizations:
        write_local_rows(
            youtube_csv_dir / "channels_local.csv",
            CSV_HEADERS["channels_local.csv"].split(","),
            channels_local_by_key,
        )

    run_sanitizer(script_dir, youtube_csv_dir)

    print("OK: CSVs written to", youtube_csv_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
