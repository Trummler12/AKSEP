from __future__ import annotations

RATE_LIMIT_TOKENS = (
    "rate limit",
    "too many requests",
    "http error 429",
    "status code 429",
    "temporarily blocked",
    "unusual traffic",
    "slow down",
)

INVALID_ID_TOKENS = (
    "invalid video id",
    "invalid url",
    "unsupported url",
    "not a valid url",
)


def is_rate_limit_error(message: str) -> bool:
    msg = (message or "").lower()
    return any(token in msg for token in RATE_LIMIT_TOKENS)


def is_invalid_id_error(message: str) -> bool:
    msg = (message or "").lower()
    return any(token in msg for token in INVALID_ID_TOKENS)


def normalize_languages(values: list[str] | None) -> list[str]:
    if not values:
        return []
    seen = set()
    out: list[str] = []
    for value in values:
        lang = (value or "").strip()
        if not lang or lang in seen:
            continue
        seen.add(lang)
        out.append(lang)
    return out


def audio_tracks_payload(
    languages_all: list[str],
    languages_non_auto: list[str],
    has_auto_dub: str,
    default_audio_language: str,
    source: str,
) -> dict:
    return {
        "languages_all": normalize_languages(languages_all),
        "languages_non_auto": normalize_languages(languages_non_auto),
        "has_auto_dub": has_auto_dub,
        "default_audio_language": (default_audio_language or "").strip(),
        "source": source,
    }

