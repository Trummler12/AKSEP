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
# Keep defaults conservative for trial credits and rate limits:
# - primary enabled
# - secondary/tertiary disabled unless explicitly set
DEFAULT_MODEL_A = "gpt-4.1-nano"  # primary
DEFAULT_MODEL_B = "gpt-4.1-nano"  # secondary disabled by default
DEFAULT_MODEL_C = "gpt-4.1-nano"  # tertiary disabled by default
DEFAULT_OUTPUT = "../csv/ct_resource_tags_PLANNING.csv.txt"
MIN_TAGS = 4
MAX_TAGS = 7
MAX_WEIGHTS = 5  # we only emit the first 5 tags (weights 5..1)
DEFAULT_CONTINUE_AFTER_LAST_SOURCE_ID = True
DEFAULT_CUSTOM_STARTING_SOURCE_ID: Optional[int] = None
SAMPLE_SIZE_A = 1  # number of calls per resource to primary
SAMPLE_SIZE_B = 1  # number of calls per resource to secondary
SAMPLE_SIZE_C = 1  # tertiary disabled by default
WEIGHT_A = 3       # rank weight for primary list
WEIGHT_B = 3       # rank weight for secondary list
WEIGHT_C = 3       # unused when tertiary disabled
# Some newer models (e.g. gpt-5-*) may spend completion tokens on internal reasoning;
# keep this high enough to still get a short JSON array in the visible output.
DEFAULT_MAX_OUTPUT_TOKENS = 768

# Per-model parameter compatibility cache.
# Some models reject specific parameters (e.g. gpt-5-nano may reject max_tokens).
# We learn from HTTP 400 errors and retry without unsupported parameters.
_MODEL_UNSUPPORTED_PARAMS: Dict[str, Set[str]] = {}
_MODEL_TOKENS_PARAM: Dict[str, Optional[str]] = {}  # model -> param name to use for output tokens, or None

TAG_INPUT = "t_tag.csv"

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


class QuotaError(RuntimeError):
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
    """
    Resolve API configuration with clear precedence:
      1) CLI args
      2) OS environment
      3) .env files (searched upwards)
    """
    env_from_files: Dict[str, str] = {}
    search_paths = [
        script_dir / ".env",
        script_dir.parent / ".env",
        script_dir.parent.parent / ".env",
        script_dir.parent.parent.parent / ".env",
        script_dir.parent.parent.parent.parent / ".env",  # backend/.env
    ]
    last_key_file: Optional[Path] = None
    last_model_file: Optional[Path] = None
    for path in search_paths:
        loaded = load_env_file(path)
        if "OPENAI_API_KEY" in loaded:
            last_key_file = path
        if "OPENAI_MODEL" in loaded:
            last_model_file = path
        env_from_files.update(loaded)

    env = env_from_files.copy()
    env.update(os.environ)  # OS env overrides .env files

    config: Dict[str, str] = {}
    config["api_key"] = args.api_key or env.get("OPENAI_API_KEY", "")
    config["model"] = args.model or env.get("OPENAI_MODEL", DEFAULT_MODEL_A)
    if args.debug:
        if args.api_key:
            key_src = "--api-key"
        elif "OPENAI_API_KEY" in os.environ:
            key_src = "OS env OPENAI_API_KEY"
        elif last_key_file:
            key_src = f".env ({last_key_file.as_posix()})"
        else:
            key_src = "missing"

        if args.model:
            model_src = "--model"
        elif "OPENAI_MODEL" in os.environ:
            model_src = "OS env OPENAI_MODEL"
        elif last_model_file:
            model_src = f".env ({last_model_file.as_posix()})"
        else:
            model_src = "default"

        print(f"[debug] api_key_source={key_src}", file=sys.stderr)
        print(f"[debug] model_source={model_src} model={config['model']}", file=sys.stderr)
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


def find_last_resource_id(output_path: Path) -> Optional[int]:
    if not output_path.exists():
        return None
    last_id: Optional[int] = None
    with output_path.open(encoding="utf-8") as f:
        for line in reversed(f.read().splitlines()):
            line = line.strip()
            if not line or line.startswith("resourceID"):
                continue
            parts = line.split(",")
            if parts:
                try:
                    last_id = int(parts[0])
                    break
                except ValueError:
                    continue
    return last_id


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


def _parse_retry_after_seconds(headers: object) -> Optional[float]:
    # urllib returns email.message.Message for headers; access via get().
    try:
        raw = headers.get("Retry-After")  # type: ignore[attr-defined]
    except Exception:
        raw = None
    if not raw:
        return None
    try:
        return _normalize_retry_after_seconds(str(raw).strip())
    except ValueError:
        return None


def _normalize_retry_after_seconds(value: object) -> Optional[float]:
    """
    OpenAI's error payloads sometimes return retry_after in milliseconds (seen in practice),
    while HTTP Retry-After headers are seconds. Normalize to seconds.
    """
    try:
        seconds = float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return None
    if seconds <= 0:
        return None
    # Heuristic: values that look like milliseconds (e.g. 55728) -> 55.728s.
    if seconds > 300 and seconds < 300_000:
        return seconds / 1000.0
    return seconds


def _normalize_param_name(raw: str) -> str:
    name = raw.strip()
    lowered = name.lower()
    if lowered in {"maxtokens", "max_tokens"}:
        return "max_tokens"
    if lowered in {"maxcompletiontokens", "max_completion_tokens"}:
        return "max_completion_tokens"
    return name


def _extract_unsupported_param_from_error_message(message: str) -> Optional[str]:
    """
    Best-effort parse for OpenAI's 'unknown/unsupported parameter' errors.
    Common variants include:
      - "Unrecognized request argument supplied: max_tokens"
      - "Unknown parameter: 'max_tokens'"
      - "Parameter MaxTokens is not supported"
    """
    patterns = [
        r"Unrecognized request argument supplied:\s*([a-zA-Z0-9_]+)",
        r"Unknown parameter:\s*'([a-zA-Z0-9_]+)'",
        r"Unknown parameter:\s*\"([a-zA-Z0-9_]+)\"",
        r"Parameter\s+([a-zA-Z0-9_]+)\s+is not supported",
    ]
    for pat in patterns:
        m = re.search(pat, message, flags=re.IGNORECASE)
        if m:
            return _normalize_param_name(m.group(1))
    return None


def _get_tokens_param_candidates(model: str) -> List[Optional[str]]:
    """
    Prefer the newer chat-completions parameter name first.
    If the model doesn't support any output-token parameter, we'll omit it.
    """
    if model in _MODEL_TOKENS_PARAM:
        chosen = _MODEL_TOKENS_PARAM[model]
        return [chosen]
    return ["max_completion_tokens", "max_tokens", None]


def _mark_unsupported_param(model: str, param: str) -> None:
    _MODEL_UNSUPPORTED_PARAMS.setdefault(model, set()).add(param)


def _is_param_unsupported(model: str, param: str) -> bool:
    return param in _MODEL_UNSUPPORTED_PARAMS.get(model, set())


def call_openai(
    api_key: str, model: str, prompt: str, *, max_output_tokens: int = DEFAULT_MAX_OUTPUT_TOKENS, debug: bool = False
) -> List[int]:
    url = "https://api.openai.com/v1/chat/completions"
    base_messages = [
        {"role": "system", "content": "You are a precise tag selector. Return only JSON arrays of tagIDs."},
        {"role": "user", "content": prompt},
    ]
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"}

    last_error_detail: Optional[str] = None
    candidates = _get_tokens_param_candidates(model)

    for tokens_param in candidates:
        compat_attempts = 0
        while compat_attempts < 3:
            compat_attempts += 1
            body: Dict[str, object] = {"model": model, "messages": base_messages}

            if not _is_param_unsupported(model, "temperature"):
                body["temperature"] = 0.2
            if not _is_param_unsupported(model, "reasoning"):
                # Reduce internal reasoning to preserve visible output tokens on reasoning-heavy models.
                body["reasoning"] = {"effort": "low"}
            if tokens_param and not _is_param_unsupported(model, tokens_param):
                body[tokens_param] = max_output_tokens

            if debug:
                print(
                    f"[debug] request model={model} tokens_param={tokens_param} attempt={compat_attempts}",
                    file=sys.stderr,
                )

            data = json.dumps(body).encode("utf-8")
            req = Request(url, data=data, headers=headers)

            try:
                with urlopen(req, timeout=30) as resp:
                    payload = resp.read().decode("utf-8")
            except HTTPError as exc:
                detail = exc.read().decode("utf-8", errors="ignore")
                last_error_detail = detail

                if exc.code == 429:
                    retry_after = _parse_retry_after_seconds(exc.headers)
                    try:
                        parsed_detail = json.loads(detail)
                        err = parsed_detail.get("error", {}) if isinstance(parsed_detail, dict) else {}
                        retry_after = _normalize_retry_after_seconds(err.get("retry_after")) or retry_after
                        err_type = err.get("type")
                        err_code = err.get("code")
                        err_msg = err.get("message")
                        if err_type == "insufficient_quota" or err_code == "insufficient_quota":
                            raise QuotaError(f"OpenAI insufficient_quota: {err_msg or detail}") from exc
                    except QuotaError:
                        raise
                    except Exception:
                        pass
                    raise RateLimitError(f"OpenAI 429: {detail}", retry_after=retry_after) from exc

                if exc.code == 400:
                    try:
                        parsed_detail = json.loads(detail)
                        err = parsed_detail.get("error", {}) if isinstance(parsed_detail, dict) else {}
                        err_msg = err.get("message") if isinstance(err, dict) else None
                        err_param = err.get("param") if isinstance(err, dict) else None
                        err_code = err.get("code") if isinstance(err, dict) else None
                    except Exception:
                        err_msg = None
                        err_param = None
                        err_code = None

                    msg = err_msg or detail
                    # Some models reject specific parameter VALUES (e.g. temperature != default).
                    # If OpenAI tells us the param, learn to omit it.
                    if isinstance(err_param, str) and re.search(
                        r"\bdoes not support\b|\bonly the default\b|\bunsupported\b",
                        msg,
                        flags=re.IGNORECASE,
                    ):
                        param_name = _normalize_param_name(err_param)
                        _mark_unsupported_param(model, param_name)
                        if debug:
                            print(
                                f"[debug] model={model} learned_unsupported_param={param_name} code={err_code}",
                                file=sys.stderr,
                            )
                        if tokens_param and param_name == tokens_param:
                            break  # try next tokens param candidate
                        continue  # retry without this param

                    unsupported = _extract_unsupported_param_from_error_message(msg)
                    if unsupported:
                        _mark_unsupported_param(model, unsupported)
                        if debug:
                            print(
                                f"[debug] model={model} learned_unsupported_param={unsupported}",
                                file=sys.stderr,
                            )
                        if tokens_param and unsupported == tokens_param:
                            break  # try next tokens param candidate
                        continue  # retry without the newly learned param

                raise RuntimeError(f"OpenAI HTTP error {exc.code}: {detail}") from exc
            except URLError as exc:
                raise RuntimeError(f"OpenAI network error: {exc}") from exc

            parsed = json.loads(payload)
            _MODEL_TOKENS_PARAM[model] = tokens_param
            if debug:
                print(f"[debug] model={model} payload={payload}", file=sys.stderr)
            choices = parsed.get("choices") or []
            for choice in choices:
                msg = choice.get("message", {}).get("content")
                if isinstance(msg, str) and msg.strip():
                    return parse_tag_ids(msg)
            finish_reason = choices[0].get("finish_reason") if choices else None
            usage = parsed.get("usage")
            message = f"No valid text candidates in OpenAI response (finish_reason={finish_reason}, usage={usage})"
            if finish_reason == "length":
                raise MaxTokensError(message)
            raise RuntimeError(message)

    raise RuntimeError(f"OpenAI request failed; last_error={last_error_detail}")


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
    max_output_tokens: int,
    max_rate_limit_retries: int,
    debug: bool,
) -> List[List[int]]:
    results: List[List[int]] = []
    if not model or repeats <= 0:
        return results
    for repeat_index in range(repeats):
        call_tokens = max_output_tokens
        call_attempts = 0
        rate_limit_hits = 0
        while True:
            if limiter:
                limiter.wait_for_slot()
            try:
                call_attempts += 1
                raw = call_openai(api_key, model, prompt, max_output_tokens=call_tokens, debug=debug)
                cleaned = sanitize_ids(raw, valid_ids)
                if debug:
                    print(f"[debug] model={model} raw_ids={raw} cleaned={cleaned}", file=sys.stderr)
                results.append(cleaned)
                break
            except RateLimitError as exc:
                rate_limit_hits += 1
                if rate_limit_hits > max(1, max_rate_limit_retries):
                    raise
                wait_seconds = exc.retry_after if exc.retry_after and exc.retry_after > 0 else retry_delay
                print(f"[rate-limit] model={model} waiting {wait_seconds:.1f}s", file=sys.stderr)
                if limiter:
                    limiter.wait_next_window(retry_after=wait_seconds)
                else:
                    time.sleep(wait_seconds)
                continue
            except MaxTokensError as exc:
                # Some models (notably reasoning-heavy ones) may return empty output with finish_reason=length.
                # Retry the *same* call with more output tokens; if it still fails, accept an empty list for this repeat.
                if call_attempts >= 3:
                    if debug:
                        print(
                            f"[debug] model={model} repeat={repeat_index + 1}/{repeats} max_tokens_exceeded; skipping repeat ({exc})",
                            file=sys.stderr,
                        )
                    results.append([])
                    break
                call_tokens = min(4096, int(call_tokens * 1.6))
                if debug:
                    print(
                        f"[debug] model={model} repeat={repeat_index + 1}/{repeats} MaxTokensError; retrying with max_output_tokens={call_tokens}",
                        file=sys.stderr,
                    )
                time.sleep(min(2.0, retry_delay))
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
    include_synonyms: bool,
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
        include_synonyms_local = include_synonyms
        max_output_tokens = DEFAULT_MAX_OUTPUT_TOKENS
        while True:
            attempt += 1
            print(f"[resource {resource.source_id}] requesting tags... (attempt {attempt})", file=sys.stderr)
            try:
                if dry_run:
                    results_a = [heuristic_tags(resource, tags)]
                    results_b: List[List[int]] = []
                    results_c: List[List[int]] = []
                else:
                    prompt = build_prompt(
                        resource, tags, desc_limit=desc_limit, include_synonyms=include_synonyms_local
                    )
                    results_a = fetch_model_lists(
                        model_a,
                        repeats=repeats_a,
                        prompt=prompt,
                        api_key=api_key,
                        valid_ids=valid_ids,
                        limiter=rate_limiter_a,
                        retry_delay=retry_delay,
                        max_output_tokens=max_output_tokens,
                        max_rate_limit_retries=max_rate_limit_retries,
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
                        max_output_tokens=max_output_tokens,
                        max_rate_limit_retries=max_rate_limit_retries,
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
                        max_output_tokens=max_output_tokens,
                        max_rate_limit_retries=max_rate_limit_retries,
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
            except QuotaError:
                raise
            except MaxTokensError:
                desc_limit = max(300, int(desc_limit * 0.6))
                include_synonyms_local = False
                max_output_tokens = min(4096, int(max_output_tokens * 1.6))
                print(
                    f"[resource {resource.source_id}] MAX_TOKENS, shrinking prompt (desc_limit={desc_limit}, synonyms disabled, max_output_tokens={max_output_tokens}); retrying after {retry_delay}s",
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
        "--include-synonyms",
        action="store_true",
        help="Include tag synonyms in the prompt (larger prompts => higher token usage/rate-limit risk).",
        default=True,
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
        default=30.0,
        help="Seconds to wait between retries for the same resource (default: 30s).",
    )
    parser.add_argument(
        "--requests-per-minute",
        type=int,
        default=6,
        help="Maximum requests per minute for primary model; 0 disables rate limiting (default: 6).",
    )
    parser.add_argument(
        "--secondary-requests-per-minute",
        type=int,
        default=6,
        help="Max requests per minute for the secondary model (default: 6).",
    )
    parser.add_argument(
        "--tertiary-requests-per-minute",
        type=int,
        default=6,
        help="Max requests per minute for the tertiary model (default: 6).",
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
        "--continue-after-last-source-id",
        action="store_true",
        help="If set, continue after the last resourceID written in the output CSV.",
        default=DEFAULT_CONTINUE_AFTER_LAST_SOURCE_ID,
    )
    parser.add_argument(
        "--custom-starting-source-id",
        type=int,
        default=DEFAULT_CUSTOM_STARTING_SOURCE_ID,
        help="Start at the given sourceID (after filtering sa_resource==1); ignored if continue-after-last is set.",
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

    tags = load_tags(csv_dir / TAG_INPUT)
    resources = load_resources(csv_dir / "t_source.csv")
    output_path = (script_dir / args.output).resolve()
    # Determine effective start row based on resume/override flags
    effective_start_row = max(1, args.start_row)
    if args.continue_after_last_source_id:
        last_id = find_last_resource_id(output_path)
        if last_id is None:
            print("No previous rows found in output; starting from row 1.", file=sys.stderr)
            effective_start_row = 1
        else:
            match_index = next((i for i, r in enumerate(resources, start=1) if r.source_id == last_id), None)
            if match_index is None:
                raise RuntimeError(f"Last resourceID {last_id} not found in t_source.csv (sa_resource==1 filter applied)")
            effective_start_row = match_index + 1
    elif args.custom_starting_source_id is not None:
        match_index = next(
            (i for i, r in enumerate(resources, start=1) if r.source_id == args.custom_starting_source_id), None
        )
        if match_index is None:
            raise RuntimeError(
                f"Custom starting sourceID {args.custom_starting_source_id} not found in t_source.csv (sa_resource==1 filter applied)"
            )
        effective_start_row = match_index
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
            start_row=effective_start_row,
            max_rate_limit_retries=max(1, args.max_rate_limit_retries),
            repeats_a=max(0, args.repeats_a),
            repeats_b=max(0, args.repeats_b),
            repeats_c=max(0, args.repeats_c),
            include_synonyms=bool(args.include_synonyms),
            debug=args.debug,
        )
    except Exception as exc:  # noqa: BLE001
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
