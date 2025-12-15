import argparse
import csv
import json
import logging
import os
import re
import time
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Tuple
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

from googleapiclient.discovery import build
from youtube_transcript_api import NoTranscriptFound, TranscriptsDisabled, YouTubeTranscriptApi


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

DEFAULT_OPENAI_MODEL = "gpt-4.1-mini"
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

RESERVED_SOURCE_ID_START_BY_AUTHOR_ID: Dict[int, int] = {
    # sauthorID -> reserved start sourceID (range size defined below)
    42: 42000,
    31: 31000,
    50: 50135,
    1: 10000,
    2: 20000,
    12: 12013,
    13: 13013,
    314: 314159,
    5300: 53000,
    60137: 60137,
    60365: 525600,
    1618: 161803,
    2718: 271828,
    1234: 123456,
    40076: 40076,
    33: 33333,
}
RESERVED_SOURCE_ID_RANGE_SIZE = 1000  # 42000..42999, 31000..31999, etc.
OVERFLOW_SOURCE_ID_START = 1000000


def extract_video_id(url: str) -> Optional[str]:
    parsed_url = urlparse(url)
    if "youtu.be" in parsed_url.netloc:
        video_id = parsed_url.path.lstrip("/")
        return video_id or None
    if "youtube.com" in parsed_url.netloc:
        query_params = parse_qs(parsed_url.query)
        video_ids = query_params.get("v")
        if video_ids:
            return video_ids[0]
    return None


def canonical_video_url(video_id: str) -> str:
    return f"https://youtu.be/{video_id}"


def parse_import_line(line: str) -> Tuple[Optional[str], bool]:
    raw = (line or "").strip()
    if not raw:
        return None, False
    if raw.startswith("#"):
        return None, False

    done = re.search(r"//\s*DONE\b", raw, flags=re.IGNORECASE) is not None

    # Strip trailing comment that starts with whitespace + //
    m = re.search(r"\s//", raw)
    if m:
        raw = raw[: m.start()].strip()

    if not raw:
        return None, done
    if raw.startswith("//"):
        return None, done
    return raw, done


def mark_import_line_done(line: str) -> str:
    if re.search(r"//\s*DONE\b", line, flags=re.IGNORECASE):
        return line
    if line.endswith("\n"):
        return line.rstrip("\n") + " // DONE\n"
    return line + " // DONE"


def load_dotenv_upwards(start_dir: Path, filename: str = ".env", max_levels: int = 10) -> Dict[str, str]:
    env: Dict[str, str] = {}
    current = start_dir
    for _ in range(max_levels + 1):
        candidate = current / filename
        if candidate.exists() and candidate.is_file():
            env.update(parse_dotenv_file(candidate))
        if current.parent == current:
            break
        current = current.parent
    return env


def parse_dotenv_file(path: Path) -> Dict[str, str]:
    out: Dict[str, str] = {}
    try:
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            k, v = line.split("=", 1)
            k = k.strip()
            v = v.strip().strip('"').strip("'")
            if k:
                out[k] = v
    except Exception:
        return {}
    return out


def build_config(script_dir: Path) -> Dict[str, str]:
    loaded = load_dotenv_upwards(script_dir)
    loaded.update(os.environ)  # OS env overrides .env
    return loaded


def get_video_details(youtube, video_id: str) -> Tuple[str, str, str, str, str, str]:
    request = youtube.videos().list(part="snippet", id=video_id)
    response = request.execute()
    if not response.get("items"):
        return "", "", "", "", "", "en"

    snippet = response["items"][0].get("snippet", {}) or {}
    title = snippet.get("title", "") or ""
    description = snippet.get("description", "") or ""
    published_at = snippet.get("publishedAt", "") or ""
    channel_title = snippet.get("channelTitle", "") or ""
    channel_id = snippet.get("channelId", "") or ""
    default_language = snippet.get("defaultAudioLanguage", snippet.get("defaultLanguage", "en")) or "en"
    return title, description, published_at, channel_title, channel_id, default_language


def normalize_languages(preferred: Optional[Sequence[str]]) -> List[str]:
    langs: List[str] = []
    if preferred:
        for l in preferred:
            if not l:
                continue
            short = str(l).strip()
            if not short:
                continue
            short = short.split("-", 1)[0].lower()
            if short and short not in langs:
                langs.append(short)
    for l in ["en", "de"]:
        if l not in langs:
            langs.append(l)
    return langs


def get_video_transcript(video_id: str, preferred_languages: Optional[Sequence[str]] = None) -> str:
    langs = normalize_languages(preferred_languages)
    # youtube-transcript-api changed over time; support both:
    # - list_transcripts(...) + find_*_transcript(...)
    # - get_transcript(video_id, languages=[...])
    try:
        if hasattr(YouTubeTranscriptApi, "list_transcripts"):
            transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
            for lang in langs:
                try:
                    transcript = transcripts.find_manually_created_transcript([lang])
                    return " ".join([entry.get("text", "") for entry in transcript.fetch()]).strip()
                except Exception:
                    continue
            for lang in langs:
                try:
                    transcript = transcripts.find_generated_transcript([lang])
                    return " ".join([entry.get("text", "") for entry in transcript.fetch()]).strip()
                except Exception:
                    continue
            return ""

        if hasattr(YouTubeTranscriptApi, "get_transcript"):
            entries = YouTubeTranscriptApi.get_transcript(video_id, languages=list(langs))
            return " ".join([e.get("text", "") for e in entries]).strip()
    except (TranscriptsDisabled, NoTranscriptFound):
        return ""
    except Exception as e:
        logging.info("Transcript not available for video %s: %s", video_id, e)
        return ""

    return ""


def ensure_csv_with_header(path: Path, header: List[str]) -> None:
    if path.exists():
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open(mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)


def read_csv_header(path: Path, fallback: List[str]) -> List[str]:
    if not path.exists():
        return list(fallback)
    try:
        with path.open(mode="r", newline="", encoding="utf-8") as f:
            reader = csv.reader(f)
            header = next(reader, None)
            if header and all(isinstance(x, str) and x.strip() for x in header):
                return header
    except Exception:
        pass
    return list(fallback)


def read_existing_sources(path: Path) -> Tuple[int, set, set, Dict[int, int]]:
    if not path.exists():
        return 0, set(), set(), {}
    max_id = 0
    urls: set = set()
    used_ids: set = set()
    max_by_author: Dict[int, int] = {}
    try:
        with path.open(mode="r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                sid: Optional[int] = None
                try:
                    sid = int(str(row.get("sourceID", "")).strip())
                    max_id = max(max_id, sid)
                    used_ids.add(sid)
                except Exception:
                    sid = None

                try:
                    aid = int(str(row.get("sauthorID", "")).strip())
                    if aid and sid is not None:
                        prev = max_by_author.get(aid)
                        if prev is None or sid > prev:
                            max_by_author[aid] = sid
                except Exception:
                    pass

                u = (row.get("source_URL") or "").strip()
                if u:
                    urls.add(u)
    except Exception:
        return 0, set(), set(), {}
    return max_id, urls, used_ids, max_by_author


def read_existing_authors(path: Path) -> Tuple[int, Dict[str, int]]:
    if not path.exists():
        return 0, {}
    max_id = 0
    by_name: Dict[str, int] = {}
    try:
        with path.open(mode="r", newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = (row.get("sauthor_name") or "").strip()
                try:
                    aid = int(str(row.get("sauthorID", "")).strip())
                except Exception:
                    continue
                max_id = max(max_id, aid)
                if name:
                    by_name[name] = aid
    except Exception:
        return 0, {}
    return max_id, by_name


def append_csv_row(path: Path, header: List[str], row: Dict[str, object]) -> None:
    ensure_csv_with_header(path, header)
    with path.open(mode="a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=header, extrasaction="ignore")
        writer.writerow(row)


def openai_chat(
    api_key: str,
    model: str,
    system: str,
    user: str,
    *,
    temperature: float = 0.2,
    timeout_s: int = 60,
    max_attempts: int = 3,
) -> str:
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "temperature": temperature,
    }

    data = json.dumps(payload).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    last_err: Optional[str] = None
    for attempt in range(1, max_attempts + 1):
        try:
            req = Request(OPENAI_API_URL, data=data, headers=headers, method="POST")
            with urlopen(req, timeout=timeout_s) as resp:
                body = resp.read().decode("utf-8", errors="replace")
                parsed = json.loads(body)
                content = (
                    parsed.get("choices", [{}])[0]
                    .get("message", {})
                    .get("content", "")
                )
                return (content or "").strip()
        except HTTPError as e:
            raw = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
            last_err = f"HTTP {e.code}: {raw[:500]}"
            if e.code == 429 and attempt < max_attempts:
                wait_s = min(20, attempt * 3)
                logging.warning("OpenAI 429; retrying in %ss (attempt %s/%s)", wait_s, attempt, max_attempts)
                time.sleep(wait_s)
                continue
            if e.code in (401, 403):
                raise RuntimeError(f"OpenAI auth error ({e.code}). Check OPENAI_API_KEY.") from e
        except URLError as e:
            last_err = f"Network error: {e}"
        except Exception as e:
            last_err = f"Unexpected error: {e}"

        if attempt < max_attempts:
            time.sleep(1.5 * attempt)

    raise RuntimeError(f"OpenAI request failed after {max_attempts} attempts. Last error: {last_err}")


def generate_abstract_two_step(
    *,
    api_key: str,
    model: str,
    title: str,
    description: str,
    transcript: str,
    max_input_chars: int = 12000,
) -> str:
    base = []
    if title:
        base.append(f"TITLE:\n{title}")
    if description:
        base.append(f"DESCRIPTION:\n{description}")
    if transcript:
        base.append(f"TRANSCRIPT:\n{transcript}")

    source_text = "\n\n".join(base).strip()
    if not source_text:
        return ""
    if len(source_text) > max_input_chars:
        source_text = source_text[:max_input_chars].rstrip()

    system = "You are a careful assistant that summarizes text without inventing facts."

    draft_prompt = (
        "Write a free-form summary of the content below.\n"
        "- Target: 6–8 sentences OR about 800–1200 characters.\n"
        "- Plain text only (no bullet points, no headings, no markdown, no quotes).\n"
        "- No new facts: only restate what is present.\n"
        "- If the provided content is insufficient to summarize, return an empty string.\n\n"
        f"CONTENT:\n{source_text}"
    )
    draft = openai_chat(api_key, model, system, draft_prompt, temperature=0.2, timeout_s=90, max_attempts=3)
    draft = (draft or "").strip()

    if not draft:
        return ""

    compress_prompt = (
        "Shorten the following summary to at most 500 characters.\n"
        "- Keep only the core statements.\n"
        "- Do not add new facts.\n"
        "- Plain text only (no bullet points, no headings).\n"
        "- Return ONLY the shortened text.\n\n"
        f"SUMMARY:\n{draft}"
    )
    shortened = openai_chat(api_key, model, system, compress_prompt, temperature=0.0, timeout_s=60, max_attempts=3)
    shortened = (shortened or "").strip()

    if len(shortened) > 500:
        shortened = shortened[:500].rstrip()

    return shortened


def allocate_source_id(
    sauthor_id: int,
    used_ids: set,
    next_reserved_by_author: Dict[int, int],
    reserved_starts: Dict[int, int],
    *,
    reserved_range_size: int,
    overflow_next: List[int],
) -> int:
    def claim_next(candidate: int) -> int:
        used_ids.add(candidate)
        return candidate

    def next_free_from(start: int) -> int:
        candidate = start
        while candidate in used_ids:
            candidate += 1
        return candidate

    if sauthor_id in reserved_starts:
        start = reserved_starts[sauthor_id]
        end = start + reserved_range_size - 1
        candidate = next_reserved_by_author.get(sauthor_id, start)
        while candidate in used_ids and candidate <= end:
            candidate += 1
        if candidate <= end:
            next_reserved_by_author[sauthor_id] = candidate + 1
            return claim_next(candidate)

    # overflow pool
    candidate = overflow_next[0]
    candidate = next_free_from(candidate)
    overflow_next[0] = candidate + 1
    return claim_next(candidate)


def main() -> int:
    parser = argparse.ArgumentParser(description="Import YouTube video metadata into CSV files.")
    parser.add_argument("--limit", type=int, default=0, help="Process at most N URLs (0 = no limit).")
    parser.add_argument("--dry-run", action="store_true", help="Do not call external APIs or write CSVs.")
    args = parser.parse_args()

    script_dir = Path(__file__).resolve().parent
    import_file = script_dir / "VideoURLs_IMPORT.txt"
    if not import_file.exists():
        logging.error("Missing input file: %s", import_file)
        return 2

    config = build_config(script_dir)
    youtube_key = (config.get("YOUTUBE_DATA_API_KEY") or "").strip()
    openai_key = (config.get("OPENAI_API_KEY") or "").strip()
    openai_model = (config.get("OPENAI_YOUTUBE_MODEL") or DEFAULT_OPENAI_MODEL).strip()

    if not youtube_key and not args.dry_run:
        logging.error("YOUTUBE_DATA_API_KEY is required. Set it in backend/.env.")
        return 2
    if not openai_key and not args.dry_run:
        logging.error("OPENAI_API_KEY is required. Set it in backend/.env.")
        return 2

    youtube = build("youtube", "v3", developerKey=youtube_key) if youtube_key else None

    csv_source = script_dir / "t_source.csv"
    csv_author = script_dir / "t_source_author.csv"

    source_header = read_csv_header(
        csv_source,
        ["sourceID", "source_typeID", "source_URL", "sauthorID", "source_title", "description", "created", "updated", "sa_resource"],
    )
    author_header = read_csv_header(
        csv_author,
        ["sauthorID", "sauthor_name", "sauthor_URL", "sauthor_description", "impressum_URL"],
    )

    max_source_id, existing_urls, used_ids, max_source_id_by_author = read_existing_sources(csv_source)
    max_author_id, authors_by_name = read_existing_authors(csv_author)

    next_author_id = max_author_id + 1 if max_author_id > 0 else 1

    overflow_next_id = OVERFLOW_SOURCE_ID_START
    try:
        max_overflow_used = max([i for i in used_ids if i >= OVERFLOW_SOURCE_ID_START], default=0)
        if max_overflow_used >= OVERFLOW_SOURCE_ID_START:
            overflow_next_id = max_overflow_used + 1
    except Exception:
        overflow_next_id = OVERFLOW_SOURCE_ID_START
    overflow_next = [overflow_next_id]

    next_reserved_by_author: Dict[int, int] = {}
    for aid, start in RESERVED_SOURCE_ID_START_BY_AUTHOR_ID.items():
        end = start + RESERVED_SOURCE_ID_RANGE_SIZE - 1
        current_max = max_source_id_by_author.get(aid, start - 1)
        candidate = max(start, current_max + 1)
        while candidate in used_ids and candidate <= end:
            candidate += 1
        next_reserved_by_author[aid] = candidate

    lines = import_file.read_text(encoding="utf-8").splitlines(keepends=True)
    processed = 0

    def persist_import_lines() -> None:
        tmp = import_file.with_suffix(import_file.suffix + ".tmp")
        tmp.write_text("".join(lines), encoding="utf-8")
        tmp.replace(import_file)

    for idx, line in enumerate(lines):
        url, done = parse_import_line(line)
        if not url or done:
            continue

        video_id = extract_video_id(url)
        if not video_id:
            logging.warning("Invalid YouTube URL: %s", url)
            continue

        video_url = canonical_video_url(video_id)

        if video_url in existing_urls:
            logging.info("Already imported; marking DONE: %s", video_url)
            lines[idx] = mark_import_line_done(line)
            persist_import_lines()
            processed += 1
            if args.limit and processed >= args.limit:
                break
            continue

        if args.dry_run:
            logging.info("[dry-run] Would process: %s", video_url)
            lines[idx] = mark_import_line_done(line)
            persist_import_lines()
            processed += 1
            if args.limit and processed >= args.limit:
                break
            continue

        try:
            title, description, published_at, channel_name, channel_id, video_language = get_video_details(youtube, video_id)
        except Exception as e:
            logging.error("Error fetching video details for %s: %s", video_url, e)
            continue

        if not title:
            logging.error("Could not retrieve details for video: %s", video_url)
            continue

        channel_url = f"https://www.youtube.com/channel/{channel_id}" if channel_id else ""

        transcript = get_video_transcript(video_id, preferred_languages=[video_language])

        try:
            abstract = generate_abstract_two_step(
                api_key=openai_key,
                model=openai_model,
                title=title,
                description=description,
                transcript=transcript,
            )
        except Exception as e:
            logging.error("Error generating abstract for %s: %s", video_url, e)
            abstract = ""

        if len(abstract) > 2000:
            logging.warning("Generated abstract too long for %s; setting abstract to empty", video_url)
            abstract = ""

        sauthor_id = authors_by_name.get(channel_name)
        if sauthor_id is None:
            sauthor_id = next_author_id
            next_author_id += 1
            author_row = {
                "sauthorID": sauthor_id,
                "sauthor_name": channel_name,
                "sauthor_URL": channel_url,
                "sauthor_description": "",
                "impressum_URL": "",
            }
            append_csv_row(csv_author, author_header, author_row)
            authors_by_name[channel_name] = sauthor_id
            logging.info("Appended new author row: %s (%s)", channel_name, sauthor_id)

        now_or_published = published_at or ""
        source_id = allocate_source_id(
            sauthor_id,
            used_ids,
            next_reserved_by_author,
            RESERVED_SOURCE_ID_START_BY_AUTHOR_ID,
            reserved_range_size=RESERVED_SOURCE_ID_RANGE_SIZE,
            overflow_next=overflow_next,
        )
        source_row = {
            "sourceID": source_id,
            "source_typeID": 1,
            "source_URL": video_url,
            "sauthorID": sauthor_id,
            "source_title": title,
            "description": abstract,
            "created": now_or_published,
            "updated": now_or_published,
            "sa_resource": 1,
        }
        append_csv_row(csv_source, source_header, source_row)
        existing_urls.add(video_url)
        logging.info("Appended source row for %s (sourceID=%s)", video_url, source_id)

        lines[idx] = mark_import_line_done(line)
        processed += 1

        # Persist progress after each success.
        persist_import_lines()

        if args.limit and processed >= args.limit:
            break

    if processed == 0:
        logging.info("No pending URLs found in %s.", import_file)
    else:
        logging.info("Processed %s URL(s).", processed)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
