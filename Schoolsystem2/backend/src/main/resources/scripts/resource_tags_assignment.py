"""
Generate `ct_resource_tags_PLANNING.csv.txt` by asking OpenAI models to map resources to tags.

Workflow:
- Load resources from t_source.csv where sa_resource == 1.
- Load tag catalog from t_tag.csv (tagID, name, synonyms).
- For each resource, ask multiple OpenAI models for 4-7 relevant tagIDs (prefer niche tags).
- Merge ranked results with weights, then write up to the first 5 tags as rows: resourceID,tagID,weight (weights 5..1).

Supports dry-run (no API calls), resume (skip already written resourceIDs),
per-model rate limits, retries, prompt shrinking on token overrun, and debug logging.
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import re
import sys
import textwrap
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Sequence, Set, Tuple
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

# Default OpenAI models (fast + cost-effective)
DEFAULT_MODEL_A = "gpt-4.1-mini"   # primary
DEFAULT_MODEL_B = "gpt-4o-mini"    # secondary
DEFAULT_MODEL_C = ""               # tertiary disabled by default
DEFAULT_OUTPUT = "../csv/ct_resource_tags_PLANNING.csv.txt"
MIN_TAGS = 4
MAX_TAGS = 7
MAX_WEIGHTS = 5  # we only emit the first 5 tags (weights 5..1)
SAMPLE_SIZE_A = 1  # number of calls per resource to primary
SAMPLE_SIZE_B = 3  # number of calls per resource to secondary
SAMPLE_SIZE_C = 0  # tertiary disabled by default
WEIGHT_A = 5       # rank weight for primary list
WEIGHT_B = 1       # rank weight for secondary list
WEIGHT_C = 1       # unused when tertiary disabled


@dataclass
class Tag:
    tag_id: int
    name: str
    synonyms: Sequence[str]


@dataclass
class Resource:
    source_id: int
    title: str
    description: str


class RateLimitError(RuntimeError):
    def __init__(self, message: str, retry_after: Optional[float] = None) -> None:
        super().__init__(message)
        self.retry_after = retry_after


class MaxTokensError(RuntimeError):
    pass


class RateLimiter:
    """Simple per-minute rate limiter."""

    def __init__(self, max_requests_per_minute: int) -> None:
        self.max_requests = max_requests_per_minute
        self.window_start = time.time()
        self.count = 0

    def wait_for_slot(self) -> None:
        if self.max_requests <= 0:
            return
        now = time.time()
        elapsed = now - self.window_start
        if elapsed >= 60:
            self.window_start = now
            self.count = 0
        if self.count >= self.max_requests:
            sleep_for = 60 - elapsed
            if sleep_for > 0:
                time.sleep(sleep_for)
            self.window_start = time.time()
            self.count = 0
        self.count += 1

    def wait_next_window(self, retry_after: Optional[float] = None) -> None:
        """Wait until the next minute window or a provided retry_after hint."""
        if retry_after and retry_after > 0:
            time.sleep(retry_after)
        else:
            now = time.time()
            elapsed = now - self.window_start
            sleep_for = max(0.0, 60 - elapsed)
            time.sleep(sleep_for)
        self.window_start = time.time()
        self.count = 0


def load_env_file(env_path: Path) -> Dict[str, str]:
    if not env_path.exists():
        return {}
    values: Dict[str, str] = {}
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        values[key.strip()] = val.strip()
    return values


def resolve_config(args: argparse.Namespace, script_dir: Path) -> Dict[str, str]:
    env = os.environ.copy()
    search_paths = [
        script_dir / ".env",
        script_dir.parent / ".env",
        script_dir.parent.parent / ".env",
        script_dir.parent.parent.parent / ".env",
    ]
    for path in search_paths:
        env.update(load_env_file(path))
    config: Dict[str, str] = {}
    config["api_key"] = args.api_key or env.get("OPENAI_API_KEY", "")
    config["model"] = args.model or env.get("OPENAI_MODEL", DEFAULT_MODEL_A)
    return config


def load_tags(csv_path: Path) -> Dict[int, Tag]:
    tags: Dict[int, Tag] = {}
    with csv_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                tag_id = int(row["tagID"])
            except (KeyError, ValueError):
                continue
            name = (row.get("name") or "").strip()
            synonyms_raw = (row.get("synonyms") or "").strip().strip('"')
            synonyms = [s.strip() for s in synonyms_raw.split("|") if s.strip()] if synonyms_raw else []
            tags[tag_id] = Tag(tag_id=tag_id, name=name, synonyms=synonyms)
    return tags


def load_resources(csv_path: Path) -> List[Resource]:
    resources: List[Resource] = []
    with csv_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get("sa_resource") != "1":
                continue
            try:
                source_id = int(row["sourceID"])
            except (KeyError, ValueError):
                continue
            title = (row.get("source_title") or "").strip()
            description = (row.get("description") or "").strip()
            resources.append(Resource(source_id=source_id, title=title, description=description))
    return resources


def load_existing(output_path: Path) -> Set[int]:
    if not output_path.exists():
        return set()
    seen: Set[int] = set()
    with output_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                seen.add(int(row["resourceID"]))
            except (KeyError, ValueError):
                continue
    return seen


def ensure_header(output_path: Path) -> None:
    if output_path.exists():
        return
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("resourceID,tagID,weight\n", encoding="utf-8")


def build_prompt(resource: Resource, tags: Dict[int, Tag], desc_limit: int, include_synonyms: bool) -> str:
    tag_lines = []
    for tag in tags.values():
        if include_synonyms and tag.synonyms:
            syn = f" (synonyms: {', '.join(tag.synonyms)})"
        else:
            syn = ""
        tag_lines.append(f"- {tag.tag_id}: {tag.name}{syn}")
    tag_catalog = "\n".join(tag_lines)

    desc = (resource.description or "").strip()
    if desc_limit and len(desc) > desc_limit:
        desc = desc[:desc_limit] + "..."

    return textwrap.dedent(
        f"""
        You are mapping a video resource to tags.
        - Choose between {MIN_TAGS} and {MAX_TAGS} tagIDs from the provided catalog.
        - Order tags by relevance (most relevant first).
        - Only return tagIDs from the catalog; never invent new IDs.
        - Prefer niche/specific tags when applicable; avoid overly generic matches unless clearly relevant.
        - Respond with a plain JSON array of integers, e.g. [12,4,7,1].

        Tag catalog:
        {tag_catalog}

        Resource:
        Title: {resource.title or "[no title]"}
        Description (truncated): {desc or "[no description]"}
        """
    ).strip()


def parse_tag_ids(raw_text: str) -> List[int]:
    array_match = re.search(r"\[[^\]]*\]", raw_text)
    if not array_match:
        raise ValueError("No array found in model response")
    try:
        data = json.loads(array_match.group(0))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Failed to parse JSON array: {exc}") from exc
    if not isinstance(data, list):
        raise ValueError("Parsed response is not a list")
    tag_ids: List[int] = []
    for item in data:
        try:
            tag_ids.append(int(item))
        except (TypeError, ValueError):
            continue
    return tag_ids


def call_openai(api_key: str, model: str, prompt: str, debug: bool = False) -> List[int]:
    url = "https://api.openai.com/v1/chat/completions"
    body = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are a precise tag selector. Return only JSON arrays of tagIDs."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "max_tokens": 256,
    }
    data = json.dumps(body).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    }
    req = Request(url, data=data, headers=headers)
    try:
        with urlopen(req, timeout=30) as resp:
            payload = resp.read().decode("utf-8")
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        if exc.code == 429:
            retry_after = None
            try:
                parsed_detail = json.loads(detail)
                retry_after = parsed_detail.get("error", {}).get("retry_after")
            except Exception:
                pass
            raise RateLimitError(f"OpenAI rate limit: {detail}", retry_after=retry_after) from exc
        raise RuntimeError(f"OpenAI HTTP error {exc.code}: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(f"OpenAI network error: {exc}") from exc
    parsed = json.loads(payload)
    if debug:
        print(f"[debug] model={model} payload={payload}", file=sys.stderr)
    choices = parsed.get("choices") or []
    for choice in choices:
        msg = choice.get("message", {}).get("content")
        if isinstance(msg, str):
            return parse_tag_ids(msg)
    finish_reason = choices[0].get("finish_reason") if choices else None
    usage = parsed.get("usage")
    msg = f"No valid text candidates in OpenAI response (finish_reason={finish_reason}, usage={usage})"
    if finish_reason == "length":
        raise MaxTokensError(msg)
    raise RuntimeError(msg)


def heuristic_tags(resource: Resource, tags: Dict[int, Tag]) -> List[int]:
    text = f"{resource.title} {resource.description}".lower()
    matches: List[int] = []
    for tag in tags.values():
        if tag.name.lower() in text:
            matches.append(tag.tag_id)
    if not matches:
        matches = [t.tag_id for t in list(tags.values())[:MAX_TAGS]]
    return matches[:MAX_TAGS]


def sanitize_ids(tag_ids: Iterable[int], valid_ids: Set[int]) -> List[int]:
    seen: Set[int] = set()
    cleaned: List[int] = []
    for tid in tag_ids:
        if tid in seen or tid not in valid_ids:
            continue
        seen.add(tid)
        cleaned.append(tid)
        if len(cleaned) >= MAX_TAGS:
            break
    return cleaned


def fetch_model_lists(
    model: Optional[str],
    repeats: int,
    prompt: str,
    api_key: str,
    valid_ids: Set[int],
    limiter: Optional[RateLimiter],
    retry_delay: float,
    debug: bool,
) -> List[List[int]]:
    results: List[List[int]] = []
    if not model or repeats <= 0:
        return results
    for _ in range(repeats):
        while True:
            if limiter:
                limiter.wait_for_slot()
            try:
                raw = call_openai(api_key, model, prompt, debug=debug)
                cleaned = sanitize_ids(raw, valid_ids)
                if debug:
                    print(f"[debug] model={model} raw_ids={raw} cleaned={cleaned}", file=sys.stderr)
                results.append(cleaned)
                break
            except RateLimitError as exc:
                wait_seconds = exc.retry_after if exc.retry_after and exc.retry_after > 0 else retry_delay
                print(f"[rate-limit] model={model} waiting {wait_seconds:.1f}s", file=sys.stderr)
                if limiter:
                    limiter.wait_next_window(retry_after=wait_seconds)
                else:
                    time.sleep(wait_seconds)
                continue
    return results


def merge_ranked(weighted_lists: List[Tuple[int, Sequence[int]]]) -> List[int]:
    pos_maps = []
    lengths = []
    weights = []
    all_ids: Set[int] = set()
    for weight, seq in weighted_lists:
        pos = {tid: idx for idx, tid in enumerate(seq)}
        pos_maps.append(pos)
        lengths.append(len(seq))
        weights.append(weight)
        all_ids.update(seq)
    combined_ids = list(all_ids)

    def score(tid: int) -> int:
        total = 0
        for pos, length, weight in zip(pos_maps, lengths, weights):
            total += (pos.get(tid, length)) * weight
        return total

    combined_ids.sort(key=score)
    return combined_ids


def assign_weights(tag_ids: Sequence[int]) -> List[int]:
    weights = []
    for idx, _ in enumerate(tag_ids[:MAX_WEIGHTS]):
        weight = MAX_WEIGHTS - idx
        if weight <= 0:
            break
        weights.append(weight)
    return weights


def write_rows(output_path: Path, resource_id: int, tag_ids: Sequence[int]) -> None:
    weights = assign_weights(tag_ids)
    with output_path.open("a", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, lineterminator="\n")
        for tag_id, weight in zip(tag_ids[: len(weights)], weights):
            writer.writerow([resource_id, tag_id, weight])


def process_resources(
    resources: List[Resource],
    tags: Dict[int, Tag],
    output_path: Path,
    api_key: str,
    model_a: str,
    model_b: Optional[str],
    model_c: Optional[str],
    *,
    dry_run: bool,
    resume: bool,
    limit: Optional[int],
    max_attempts: int,
    retry_delay: float,
    rate_limiter_a: Optional[RateLimiter],
    rate_limiter_b: Optional[RateLimiter],
    rate_limiter_c: Optional[RateLimiter],
    start_row: int,
    max_rate_limit_retries: int,
    repeats_a: int,
    repeats_b: int,
    repeats_c: int,
    debug: bool,
) -> None:
    ensure_header(output_path)
    valid_ids = set(tags.keys())
    already = load_existing(output_path) if resume else set()
    processed = 0

    for idx, resource in enumerate(resources, start=1):
        if idx < start_row:
            continue
        if resume and resource.source_id in already:
            continue
        if limit is not None and processed >= limit:
            break

        attempt = 0
        rate_limit_hits = 0
        desc_limit = 2000
        include_synonyms = True
        while True:
            attempt += 1
            print(f"[resource {resource.source_id}] requesting tags... (attempt {attempt})", file=sys.stderr)
            try:
                if dry_run:
                    results_a = [heuristic_tags(resource, tags)]
                    results_b: List[List[int]] = []
                    results_c: List[List[int]] = []
                else:
                    prompt = build_prompt(resource, tags, desc_limit=desc_limit, include_synonyms=include_synonyms)
                    results_a = fetch_model_lists(
                        model_a,
                        repeats=repeats_a,
                        prompt=prompt,
                        api_key=api_key,
                        valid_ids=valid_ids,
                        limiter=rate_limiter_a,
                        retry_delay=retry_delay,
                        debug=debug,
                    )
                    results_b = fetch_model_lists(
                        model_b,
                        repeats=repeats_b,
                        prompt=prompt,
                        api_key=api_key,
                        valid_ids=valid_ids,
                        limiter=rate_limiter_b,
                        retry_delay=retry_delay,
                        debug=debug,
                    )
                    results_c = fetch_model_lists(
                        model_c,
                        repeats=repeats_c,
                        prompt=prompt,
                        api_key=api_key,
                        valid_ids=valid_ids,
                        limiter=rate_limiter_c,
                        retry_delay=retry_delay,
                        debug=debug,
                    )

                weighted_lists: List[Tuple[int, Sequence[int]]] = []
                for lst in results_a:
                    if lst:
                        weighted_lists.append((WEIGHT_A, lst))
                for lst in results_b:
                    if lst:
                        weighted_lists.append((WEIGHT_B, lst))
                for lst in results_c:
                    if lst:
                        weighted_lists.append((WEIGHT_C, lst))

                if not weighted_lists:
                    raise RuntimeError("No valid tags returned")

                merged = merge_ranked(weighted_lists)

                write_rows(output_path, resource.source_id, merged)
                processed += 1
                break
            except RateLimitError as exc:
                attempt -= 1
                rate_limit_hits += 1
                if rate_limit_hits > max_rate_limit_retries:
                    raise RuntimeError(
                        f"Resource {resource.source_id} hit rate limits {rate_limit_hits} times; last error: {exc}"
                    ) from exc
                wait_seconds = exc.retry_after if exc.retry_after and exc.retry_after > 0 else retry_delay
                print(
                    f"[resource {resource.source_id}] rate limit hit ({exc}); waiting {wait_seconds:.1f}s for next window",
                    file=sys.stderr,
                )
                if rate_limiter_a:
                    rate_limiter_a.wait_next_window(retry_after=wait_seconds)
                if rate_limiter_b:
                    rate_limiter_b.wait_next_window(retry_after=wait_seconds)
                if rate_limiter_c:
                    rate_limiter_c.wait_next_window(retry_after=wait_seconds)
                if not rate_limiter_a and not rate_limiter_b and not rate_limiter_c:
                    time.sleep(wait_seconds)
                continue
            except MaxTokensError:
                desc_limit = max(300, int(desc_limit * 0.6))
                include_synonyms = False
                print(
                    f"[resource {resource.source_id}] MAX_TOKENS, shrinking prompt (desc_limit={desc_limit}, synonyms disabled); retrying after {retry_delay}s",
                    file=sys.stderr,
                )
                if attempt >= max_attempts:
                    raise
                time.sleep(retry_delay)
                continue
            except Exception as exc:  # noqa: BLE001
                if attempt >= max_attempts:
                    raise RuntimeError(
                        f"Resource {resource.source_id} failed after {attempt} attempts: {exc}"
                    ) from exc
                print(
                    f"[resource {resource.source_id}] attempt {attempt} failed ({exc}); retrying after {retry_delay}s",
                    file=sys.stderr,
                )
                time.sleep(retry_delay)

    print(f"Done. Processed {processed} resources; output -> {output_path}", file=sys.stderr)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Assign tags to resources via OpenAI models and write ct_resource_tags_PLANNING.csv.txt"
    )
    parser.add_argument(
        "--output",
        default=DEFAULT_OUTPUT,
        help="Output CSV path relative to scripts directory (default: ../csv/ct_resource_tags_PLANNING.csv.txt)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limit number of resources processed (useful for quota-saving test runs).",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Skip resources already present in output (based on resourceID).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Do not call OpenAI; use heuristic tag selection for quick tests.",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Verbose debug logging (model payloads and cleaned IDs).",
    )
    parser.add_argument(
        "--api-key",
        default=None,
        help="OpenAI API key (overrides OPENAI_API_KEY env/.env).",
    )
    parser.add_argument(
        "--model",
        default=None,
        help=f"Primary model name (default: {DEFAULT_MODEL_A} or OPENAI_MODEL env).",
    )
    parser.add_argument(
        "--secondary-model",
        default=DEFAULT_MODEL_B,
        help="Secondary model to query in parallel (empty to disable).",
    )
    parser.add_argument(
        "--tertiary-model",
        default=DEFAULT_MODEL_C,
        help="Tertiary model to query in parallel (empty to disable).",
    )
    parser.add_argument(
        "--max-attempts",
        type=int,
        default=5,
        help="Maximum attempts per resource before giving up (default: 5).",
    )
    parser.add_argument(
        "--retry-delay",
        type=float,
        default=5.0,
        help="Seconds to wait between retries for the same resource (default: 5s).",
    )
    parser.add_argument(
        "--requests-per-minute",
        type=int,
        default=30,
        help="Maximum requests per minute for primary model; 0 disables rate limiting (default: 30).",
    )
    parser.add_argument(
        "--secondary-requests-per-minute",
        type=int,
        default=30,
        help="Max requests per minute for the secondary model (default: 30).",
    )
    parser.add_argument(
        "--tertiary-requests-per-minute",
        type=int,
        default=30,
        help="Max requests per minute for the tertiary model (default: 30).",
    )
    parser.add_argument(
        "--repeats-a",
        type=int,
        default=SAMPLE_SIZE_A,
        help=f"Number of calls per resource to primary model (default: {SAMPLE_SIZE_A}).",
    )
    parser.add_argument(
        "--repeats-b",
        type=int,
        default=SAMPLE_SIZE_B,
        help=f"Number of calls per resource to secondary model (default: {SAMPLE_SIZE_B}).",
    )
    parser.add_argument(
        "--repeats-c",
        type=int,
        default=SAMPLE_SIZE_C,
        help=f"Number of calls per resource to tertiary model (default: {SAMPLE_SIZE_C}).",
    )
    parser.add_argument(
        "--start-row",
        type=int,
        default=1,
        help="1-based row number in t_source.csv to start processing (after filtering sa_resource==1).",
    )
    parser.add_argument(
        "--max-rate-limit-retries",
        type=int,
        default=6,
        help="Maximum times to retry after rate-limit errors before failing (default: 6).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    script_dir = Path(__file__).resolve().parent
    csv_dir = script_dir.parent / "csv"
    config = resolve_config(args, script_dir)

    if not args.dry_run and not config["api_key"]:
        print("OPENAI_API_KEY is required for live runs. Set env or .env in backend/.", file=sys.stderr)
        return 1

    tags = load_tags(csv_dir / "t_tag.csv")
    resources = load_resources(csv_dir / "t_source.csv")
    output_path = (script_dir / args.output).resolve()
    rate_limiter_a = None if args.dry_run else RateLimiter(args.requests_per_minute)
    rate_limiter_b = None if (args.dry_run or not args.secondary_model) else RateLimiter(
        args.secondary_requests_per_minute
    )
    rate_limiter_c = None if (args.dry_run or not args.tertiary_model) else RateLimiter(
        args.tertiary_requests_per_minute
    )

    try:
        process_resources(
            resources=resources,
            tags=tags,
            output_path=output_path,
            api_key=config["api_key"],
            model_a=config["model"],
            model_b=args.secondary_model or None,
            model_c=args.tertiary_model or None,
            dry_run=args.dry_run,
            resume=args.resume,
            limit=args.limit,
            max_attempts=max(1, args.max_attempts),
            retry_delay=max(0.0, args.retry_delay),
            rate_limiter_a=rate_limiter_a,
            rate_limiter_b=rate_limiter_b,
            rate_limiter_c=rate_limiter_c,
            start_row=max(1, args.start_row),
            max_rate_limit_retries=max(1, args.max_rate_limit_retries),
            repeats_a=max(0, args.repeats_a),
            repeats_b=max(0, args.repeats_b),
            repeats_c=max(0, args.repeats_c),
            debug=args.debug,
        )
    except Exception as exc:  # noqa: BLE001
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
