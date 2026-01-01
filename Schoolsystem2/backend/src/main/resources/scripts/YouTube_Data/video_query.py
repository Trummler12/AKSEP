import argparse
import csv
import datetime as dt
import json
import os
import sys
from pathlib import Path
from urllib.parse import urlencode, urlparse
from urllib.request import urlopen


API_BASE = "https://www.googleapis.com/youtube/v3"

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
    args = parser.parse_args()

    api_key = get_api_key()
    if not api_key:
        print("Missing YOUTUBE_DATA_API_KEY.", file=sys.stderr)
        return 2

    script_dir = Path(__file__).resolve().parent
    resources_dir = script_dir.parents[1]
    youtube_csv_dir = resources_dir / "csv" / "youtube"
    channel_source_csv = youtube_csv_dir / "_YouTube_Channels.csv"

    ensure_csvs(youtube_csv_dir)
    ensure_playlist_type_csv(youtube_csv_dir / "playlist_type.csv")

    channel_source_rows = read_channel_sources(channel_source_csv)
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
    existing_videos_by_channel: dict[str, set[str]] = {}
    for row in existing_videos:
        cid = row.get("channel_id", "")
        vid = row.get("video_id", "")
        if cid and vid:
            existing_videos_by_channel.setdefault(cid, set()).add(vid)

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

    channel_order = {row.get("channel_id", ""): row["__index"] for row in channel_source_rows}

    for row in channel_source_rows[start_index:]:
        if args.channel_limit and processed_channels >= args.channel_limit:
            break

        channel_id = row.get("channel_id", "")
        handle = normalize_handle(row.get("custom_url", ""))

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

        channel_item = None
        if not exists or not existing_channels_by_id.get(channel_id, {}).get("uploads_playlist_id"):
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
            if include_localizations:
                for lang, localized in channel_item.get("localizations", {}).items():
                    channels_local_by_key[(channel_id, lang)] = {
                        "channel_id": channel_id,
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }
        else:
            uploads_id = existing_channels_by_id.get(channel_id, {}).get("uploads_playlist_id", "")

        if not uploads_id:
            print(f"SKIP: no uploads playlist for channel {channel_id}", file=sys.stderr)
            continue

        known_ids = existing_videos_by_channel.get(channel_id, set())
        stop_on_known = bool(known_ids)
        collected_ids = fetch_upload_video_ids(
            api_key,
            uploads_id,
            known_ids,
            args.video_page_limit,
            stop_on_known=stop_on_known,
        )

        new_video_ids = [vid for vid in collected_ids if vid and vid not in existing_videos_by_id]

        new_video_rows = []
        for chunk in chunked(new_video_ids, 50):
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
                new_video_rows.append(row_data)
                if include_localizations:
                    for lang, localized in item.get("localizations", {}).items():
                        videos_local_by_key[(row_data["video_id"], lang)] = {
                            "video_id": row_data["video_id"],
                            "language_code": lang,
                            "title": localized.get("title", ""),
                        }

        for row_data in new_video_rows:
            vid = row_data.get("video_id", "")
            if vid:
                existing_videos_by_id[vid] = row_data
                existing_videos_by_channel.setdefault(row_data.get("channel_id", ""), set()).add(vid)

        merged_videos = list(existing_videos_by_id.values())
        merged_videos.sort(
            key=lambda item: (
                channel_order.get(item.get("channel_id", ""), 9999),
                item.get("published_at", ""),
            )
        )
        write_csv_rows(youtube_csv_dir / "videos.csv", CSV_HEADERS["videos.csv"].split(","), merged_videos)

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
            if not existing or any(existing.get(k, "") != row_data.get(k, "") for k in row_data.keys()):
                changed_playlist_ids.add(row_data["playlist_id"])
            existing_playlists_by_id[row_data["playlist_id"]] = row_data
            if include_localizations:
                for lang, localized in item.get("localizations", {}).items():
                    playlists_local_by_key[(row_data["playlist_id"], lang)] = {
                        "playlist_id": row_data["playlist_id"],
                        "language_code": lang,
                        "title": localized.get("title", ""),
                        "description": localized.get("description", ""),
                    }

        merged_playlists = list(existing_playlists_by_id.values())
        merged_playlists.sort(
            key=lambda item: (
                channel_order.get(item.get("channel_id", ""), 9999),
                item.get("published_at", ""),
            )
        )
        write_csv_rows(youtube_csv_dir / "playlists.csv", CSV_HEADERS["playlists.csv"].split(","), merged_playlists)

        if changed_playlist_ids:
            updated_playlist_items = [
                row for row in existing_playlist_items if row.get("playlist_id", "") not in changed_playlist_ids
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
                    page_token = items_resp.get("nextPageToken")
                    if not page_token:
                        break
            updated_playlist_items.sort(
                key=lambda item: (item.get("playlist_id", ""), parse_int(item.get("position", "")))
            )
            existing_playlist_items = updated_playlist_items
            write_csv_rows(
                youtube_csv_dir / "playlistItems.csv",
                CSV_HEADERS["playlistItems.csv"].split(","),
                existing_playlist_items,
            )

        if args.include_comments and args.comment_video_limit > 0:
            comment_rows = read_csv_rows(youtube_csv_dir / "comments.csv")
            for video_id in list(existing_videos_by_channel.get(channel_id, set()))[: args.comment_video_limit]:
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
                comment_rows.extend(video_comment_rows)
            write_csv_rows(youtube_csv_dir / "comments.csv", CSV_HEADERS["comments.csv"].split(","), comment_rows)

        existing_channels_by_id[channel_id]["last_updated"] = today
        merged_channels = list(existing_channels_by_id.values())
        merged_channels.sort(key=lambda item: channel_order.get(item.get("channel_id", ""), 9999))
        write_csv_rows(youtube_csv_dir / "channels.csv", CSV_HEADERS["channels.csv"].split(","), merged_channels)
        if include_localizations:
            write_local_rows(
                youtube_csv_dir / "channels_local.csv",
                CSV_HEADERS["channels_local.csv"].split(","),
                channels_local_by_key,
            )
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
        processed_channels += 1

    if not processed_channels:
        merged_channels = list(existing_channels_by_id.values())
        merged_channels.sort(key=lambda item: channel_order.get(item.get("channel_id", ""), 9999))
        write_csv_rows(youtube_csv_dir / "channels.csv", CSV_HEADERS["channels.csv"].split(","), merged_channels)

    print("OK: CSVs written to", youtube_csv_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
