import argparse
import csv
import sys
import time
from datetime import date
from pathlib import Path


DEFAULT_HEADER = [
    "video_id",
    "languages_all",
    "languages_non_auto",
    "has_auto_dub",
    "source",
    "fetched_at",
    "status",
    "error",
]

BACKOFF_SCHEDULE = [3600, 10800, 21600, 43200]

RETRY_ERROR_CODES = {
    "offline": False,
    "this video requires payment to watch": False,
    "This live event will begin in a few moments.": False,
    "Video unavailable": False,
    "missing_primary_language": True,
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


def load_dotenv_upwards(start_dir: Path, filename: str = ".env", max_levels: int = 12) -> tuple[dict, Path | None]:
    current = start_dir
    for _ in range(max_levels + 1):
        candidate = current / filename
        if candidate.exists():
            return parse_dotenv_file(candidate), candidate
        if current.parent == current:
            break
        current = current.parent
    return {}, None


def resolve_cookie_path(raw_path: str, env_path: Path | None) -> str:
    if not raw_path:
        return ""
    path = Path(raw_path)
    if path.is_absolute():
        return str(path)
    if env_path is not None:
        return str((env_path.parent / path).resolve())
    return str(path.resolve())


def read_csv_rows(path: Path) -> list[dict]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def write_header_and_rows(path: Path, header: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        writer.writerows(rows)


def normalize_error_code(value: str) -> str:
    text = (value or "").strip().lower()
    if text.endswith("."):
        text = text[:-1]
    return text


def should_retry_row(row: dict, retry_error_codes: dict[str, bool]) -> bool:
    status = (row.get("status") or "").strip().lower()
    error = (row.get("error") or "").strip().lower()
    if status == "ok":
        return False
    if status == "invalid":
        return False
    if status == "missing" and error == "no_audio_tracks":
        return False
    if status in ("error", "unknown", "missing"):
        key = normalize_error_code(row.get("error") or "")
        if key in retry_error_codes:
            return retry_error_codes[key]
    return True


def resolve_channel_ids(channel_rows: list[dict], titles: list[str], ids: list[str]) -> set[str]:
    resolved = {cid for cid in ids if cid}
    if not titles:
        return resolved
    title_map: dict[str, list[str]] = {}
    for row in channel_rows:
        title = (row.get("title") or "").strip()
        channel_id = (row.get("channel_id") or "").strip()
        if not title or not channel_id:
            continue
        title_map.setdefault(title.lower(), []).append(channel_id)
    for title in titles:
        matches = title_map.get(title.lower(), [])
        if not matches:
            print(f"WARN: channel title not found in channels.csv: {title}", file=sys.stderr)
            continue
        resolved.update(matches)
    return resolved


def build_provider_manager(
    provider_names: list[str],
    script_dir: Path,
    cookies_path: str,
    client: str,
    yt_dlp_path: str | None,
):
    sys.path.insert(0, str(script_dir))
    from audiotracks.provider_manager import ProviderManager
    from audiotracks.yt_dlp_provider import YtDlpProvider
    from audiotracks.youtubei_provider import YoutubeiProvider
    from audiotracks.ytdl_core_provider import YtdlCoreProvider

    providers = []
    helper_path = script_dir / "youtubei_helper.js"
    ytdl_core_helper = script_dir / "Audiotracks" / "ytdl_core_helper.js"

    for raw in provider_names:
        name = raw.strip().lower()
        if not name:
            continue
        if name in ("yt-dlp", "ytdlp", "yt_dlp"):
            providers.append(YtDlpProvider(yt_dlp_path, cookies_path))
        elif name in ("youtubei.js", "youtubei", "innertube"):
            providers.append(YoutubeiProvider(helper_path, client, cookies_path))
        elif name in ("ytdl-core", "ytdl_core", "ytdl"):
            providers.append(YtdlCoreProvider(ytdl_core_helper, cookies_path))
        else:
            print(f"WARN: unknown provider '{raw}', skipping", file=sys.stderr)

    if not providers:
        raise SystemExit("No valid providers configured.")

    return ProviderManager(providers, BACKOFF_SCHEDULE)


def build_retry_error_codes(args: argparse.Namespace) -> dict[str, bool]:
    retry_map = {key: value for key, value in RETRY_ERROR_CODES.items()}
    for raw in getattr(args, "retry_error", []) or []:
        key = normalize_error_code(raw)
        if key:
            retry_map[key] = True
    for raw in getattr(args, "no_retry_error", []) or []:
        key = normalize_error_code(raw)
        if key:
            retry_map[key] = False
    return retry_map


def build_channel_default_languages(rows: list[dict]) -> dict[str, str]:
    defaults = {}
    for row in rows:
        channel_id = (row.get("channel_id") or "").strip()
        default_lang = (row.get("default_language") or "").strip()
        if channel_id and default_lang:
            defaults[channel_id] = default_lang
    return defaults


def build_video_channel_map(rows: list[dict]) -> dict[str, dict]:
    mapping = {}
    for row in rows:
        video_id = (row.get("video_id") or "").strip()
        if not video_id:
            continue
        mapping[video_id] = row
    return mapping


def parse_language_list(value: str) -> list[str]:
    return [part for part in (value or "").split("|") if part]


def pick_language_from_row(row: dict) -> str:
    languages = parse_language_list(row.get("languages_non_auto") or "")
    if not languages:
        languages = parse_language_list(row.get("languages_all") or "")
    return languages[0] if languages else ""


def resolve_fallback_language(
    video_row: dict,
    channel_default_languages: dict[str, str],
    channel_last_language: dict[str, str],
) -> tuple[str, str]:
    default_audio = (video_row.get("default_audio_language") or "").strip()
    if default_audio:
        return default_audio, "video_default_audio_language"
    default_language = (video_row.get("default_language") or "").strip()
    if default_language:
        return default_language, "video_default_language"
    channel_id = (video_row.get("channel_id") or "").strip()
    if channel_id:
        channel_default = channel_default_languages.get(channel_id, "")
        if channel_default:
            return channel_default, "channel_default_language"
        last_lang = channel_last_language.get(channel_id, "")
        if last_lang:
            return last_lang, "channel_last_success"
    return "", ""


def main() -> int:
    parser = argparse.ArgumentParser(description="Audio-track query")
    parser.add_argument("--limit-per-channel", type=int, default=0)
    parser.add_argument("--channel-id", action="append", default=[], help="Filter to channel_id (repeatable)")
    parser.add_argument("--channel-title", action="append", default=[], help="Filter to channel title (repeatable)")
    parser.add_argument("--output", default="", help="Override output path for audiotracks.csv")
    parser.add_argument("--client", default="WEB", help="InnerTube client name")
    parser.add_argument("--providers", default="youtubei.js,yt-dlp,ytdl-core", help="Comma-separated provider order")
    parser.add_argument("--yt-dlp-path", default="", help="Optional path to yt-dlp executable")
    parser.add_argument("--sleep", type=float, default=1.5, help="Sleep seconds between requests")
    parser.add_argument("--cookies", default="", help="Path to a cookies.txt file for age-restricted videos")
    parser.add_argument("--resume", action="store_true", default=True, help="Skip video_ids already in the output CSV")
    parser.add_argument(
        "--newest-first",
        action="store_true",
        help="Process newest videos first (best used with --limit-per-channel).",
    )
    parser.add_argument("--retry-error", action="append", default=[], help="Error code to force retry (repeatable)")
    parser.add_argument("--no-retry-error", action="append", default=[], help="Error code to skip retry (repeatable)")
    parser.add_argument("--debug", action="store_true", help="Print debug details for each error")
    parser.add_argument("--debug-limit", type=int, default=5, help="Max debug errors to print per run")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[1]
    youtube_csv_dir = resources_dir / "csv" / "youtube"
    env_vars, env_path = load_dotenv_upwards(resources_dir)
    videos_csv = youtube_csv_dir / "videos.csv"
    channels_csv = youtube_csv_dir / "channels.csv"
    output_path = Path(args.output) if args.output else (youtube_csv_dir / "audiotracks.csv")

    existing_rows = []
    if output_path.exists():
        existing_rows = read_csv_rows(output_path)

    retry_error_codes = build_retry_error_codes(args)
    kept_rows = [row for row in existing_rows if not should_retry_row(row, retry_error_codes)]
    processed_ids = {row.get("video_id", "") for row in kept_rows if row.get("video_id")}

    if args.resume:
        write_header_and_rows(output_path, DEFAULT_HEADER, kept_rows)

    video_rows = read_csv_rows(videos_csv)
    if not video_rows:
        print("No videos found in videos.csv.", file=sys.stderr)
        return 2

    channel_ids = list(args.channel_id)
    channel_titles = [title for arg in args.channel_title for title in arg.split(",") if title.strip()]
    channel_rows = read_csv_rows(channels_csv)
    channel_default_languages = build_channel_default_languages(channel_rows)
    resolved_channel_ids = resolve_channel_ids(channel_rows, channel_titles, channel_ids)
    if resolved_channel_ids:
        video_rows = [row for row in video_rows if row.get("channel_id") in resolved_channel_ids]

    if not video_rows:
        print("No videos matched the selected channels.", file=sys.stderr)
        return 2

    if processed_ids:
        video_rows = [row for row in video_rows if row.get("video_id") not in processed_ids]

    ordered_rows = list(reversed(video_rows)) if args.newest_first else list(video_rows)
    if args.limit_per_channel and args.limit_per_channel > 0:
        filtered = []
        counts: dict[str, int] = {}
        for row in ordered_rows:
            cid = row.get("channel_id") or ""
            if not cid:
                continue
            counts.setdefault(cid, 0)
            if counts[cid] >= args.limit_per_channel:
                continue
            counts[cid] += 1
            filtered.append(row)
        video_rows = filtered
    else:
        video_rows = ordered_rows

    cookie_path = args.cookies or env_vars.get("YT_DLP_COOKIES_PATH", "")
    cookie_path = resolve_cookie_path(cookie_path, env_path) if cookie_path else ""
    yt_dlp_path = args.yt_dlp_path or env_vars.get("YT_DLP_PATH", "")

    provider_names = [name.strip() for name in args.providers.split(",") if name.strip()]
    provider_manager = build_provider_manager(provider_names, script_dir, cookie_path, args.client, yt_dlp_path or None)

    existing_map = {row.get("video_id", ""): row for row in kept_rows if row.get("video_id")}
    channel_last_language: dict[str, str] = {}
    for row in read_csv_rows(videos_csv):
        vid = row.get("video_id", "")
        if not vid:
            continue
        existing = existing_map.get(vid)
        if not existing:
            continue
        lang = pick_language_from_row(existing)
        if not lang:
            continue
        channel_id = (row.get("channel_id") or "").strip()
        if channel_id:
            channel_last_language[channel_id] = lang

    fetched_at = date.today().isoformat()
    written = 0
    debug_errors = 0

    output_path.parent.mkdir(parents=True, exist_ok=True)
    file_mode = "a" if args.resume else "w"
    with output_path.open(file_mode, newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=DEFAULT_HEADER)
        if not args.resume:
            writer.writeheader()

        for idx, row in enumerate(video_rows, 1):
            video_id = row.get("video_id") or ""
            if not video_id:
                continue

            result = provider_manager.fetch(video_id)
            if not result.ok:
                error_type = (result.error_type or "error").lower()
                error_message = result.error or "unknown_error"

                if result.rate_limited:
                    if args.debug:
                        print(f"DEBUG rate-limit {video_id}: {error_message}", file=sys.stderr)
                    continue

                if error_type == "invalid":
                    writer.writerow(
                        {
                            "video_id": video_id,
                            "languages_all": "",
                            "languages_non_auto": "",
                            "has_auto_dub": "unknown",
                            "source": result.source,
                            "fetched_at": fetched_at,
                            "status": "invalid",
                            "error": error_message,
                        }
                    )
                    f.flush()
                    written += 1
                    continue

                if args.debug and debug_errors < args.debug_limit:
                    debug_errors += 1
                    print(f"DEBUG error[{debug_errors}] {video_id}: {error_message}", file=sys.stderr)

                writer.writerow(
                    {
                        "video_id": video_id,
                        "languages_all": "",
                        "languages_non_auto": "",
                        "has_auto_dub": "unknown",
                        "source": result.source,
                        "fetched_at": fetched_at,
                        "status": "error",
                        "error": error_message,
                    }
                )
                f.flush()
                written += 1
                continue

            audio = result.audio_tracks or {}
            languages_all = set(audio.get("languages_all") or [])
            languages_non_auto = set(audio.get("languages_non_auto") or [])
            has_auto_dub = audio.get("has_auto_dub") or "unknown"
            default_lang = (audio.get("default_audio_language") or "").strip()

            if not languages_all:
                if default_lang:
                    languages_all.add(default_lang)
                    languages_non_auto.add(default_lang)
                    if has_auto_dub == "unknown":
                        has_auto_dub = "false"
                else:
                    fallback_lang, fallback_source = resolve_fallback_language(
                        row,
                        channel_default_languages,
                        channel_last_language,
                    )
                    if fallback_lang:
                        languages_all.add(fallback_lang)
                        languages_non_auto.add(fallback_lang)
                        if has_auto_dub == "unknown":
                            has_auto_dub = "false"
                        fallback_note = f"fallback:{fallback_source}" if fallback_source else ""
                        writer.writerow(
                            {
                                "video_id": video_id,
                                "languages_all": "|".join(sorted(languages_all)),
                                "languages_non_auto": "|".join(sorted(languages_non_auto)),
                                "has_auto_dub": has_auto_dub,
                                "source": result.source,
                                "fetched_at": fetched_at,
                                "status": "ok",
                                "error": fallback_note,
                            }
                        )
                        f.flush()
                        written += 1
                        channel_id = (row.get("channel_id") or "").strip()
                        if channel_id:
                            channel_last_language[channel_id] = fallback_lang
                        continue
                    writer.writerow(
                        {
                            "video_id": video_id,
                            "languages_all": "",
                            "languages_non_auto": "",
                            "has_auto_dub": "unknown",
                            "source": result.source,
                            "fetched_at": fetched_at,
                            "status": "error",
                            "error": "missing_primary_language",
                        }
                    )
                    f.flush()
                    written += 1
                    continue

            if not languages_non_auto:
                languages_non_auto = set(languages_all)

            writer.writerow(
                {
                    "video_id": video_id,
                    "languages_all": "|".join(sorted(languages_all)),
                    "languages_non_auto": "|".join(sorted(languages_non_auto)),
                    "has_auto_dub": has_auto_dub,
                    "source": result.source,
                    "fetched_at": fetched_at,
                    "status": "ok",
                    "error": "",
                }
            )
            f.flush()
            written += 1
            channel_id = (row.get("channel_id") or "").strip()
            if channel_id:
                channel_last_language[channel_id] = sorted(languages_non_auto)[0]

            if args.sleep and args.sleep > 0:
                time.sleep(args.sleep)
            if idx % 25 == 0:
                print(f"Processed {idx}/{len(video_rows)} videos...")

    print(f"OK: audio tracks written to {output_path} ({written} rows)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
