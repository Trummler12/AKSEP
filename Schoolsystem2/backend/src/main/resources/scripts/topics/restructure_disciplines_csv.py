#!/usr/bin/env python3
import csv
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

DEFAULT_INPUT_NAME = "Disciplines_parsed.csv"
DEFAULT_OUTPUT_NAME = "Disciplines_restructured.csv"
DEFAULT_TOPIC_TYPE = "S"
DEFAULT_REQ_TYPE = "0"
GROUP_LAYER = 0
LAYER_OFFSET = 0
WIKI_PREFIX = "https://en.wikipedia.org/wiki"

GROUP_KEYS = {
    "humanities",
    "social-science",
    "natural-science",
    "formal-science",
}

GENERAL_KEYS = {
    "social-science.sociology",
    "social-science.economics",
    "social-science.political-science",
    "formal-science.mathematics.statistics",
    "natural-science.physics.astronomy",
    "natural-science.physics.technology",
}

TECHNICAL_KEYS = {
    "natural-science.physics.technology.robotics",
    "natural-science.physics.technology.robotics-2",
    "natural-science.physics.technology.automotive-engineering",
    "natural-science.physics.technology.biomedical-engineering",
    "natural-science.physics.technology.electronic-engineering",
    "natural-science.physics.technology.telecommunications-engineering",
}

PRACTICAL_KEYS = {
    "humanities.performing-arts.dance",
}

LANG_LIT_PREFIX = "humanities.languages-and-literature"
LANG_LIT_LINGUISTICS_TERMS = {
    "linguistics",
    "language",
    "grammar",
    "syntax",
    "phonetics",
    "phonology",
    "morphology",
    "semantics",
    "pragmatics",
    "lexic",
    "etymology",
    "philology",
    "orthography",
    "discourse",
    "sociolinguistics",
    "psycholinguistics",
    "neurolinguistics",
    "computational-linguistics",
    "applied-linguistics",
    "language-acquisition",
    "writing-system",
}
LANG_LIT_LITERATURE_TERMS = {
    "literature",
    "literary",
    "writing",
    "poetry",
    "prose",
    "fiction",
    "novel",
    "drama",
    "playwright",
    "comics",
    "rhetoric",
    "narrative",
    "reading",
}

ASTRONOMY_TERMS = {
    "astro",
    "astronomy",
    "astrophysics",
    "cosmo",
    "planet",
    "stellar",
    "galaxy",
    "interstellar",
    "space",
    "solar",
    "celestial",
    "orbital",
}

APPLIED_SCIENCE_PREFIX_MAP = {
    "applied-science.agriculture": "natural-science.biology.agriculture",
    "applied-science.architecture-and-design": "humanities.visual-arts.architecture-and-design",
    "applied-science.education": "social-science.education",
    "applied-science.engineering-and-technology": "natural-science.physics.technology",
    "applied-science.environmental-studies-and-forestry": "natural-science.earth-science.environmental-studies-and-forestry",
    "applied-science.family-and-consumer-science": "social-science.family-and-consumer-science",
    "applied-science.human-physical-performance-and-recreation": "natural-science.biology.human-physical-performance-and-recreation",
    "applied-science.journalism-media-studies-and-communication": "social-science.communication.journalism-media-studies-and-communication",
    "applied-science.library-and-museum-studies": "formal-science.information-science.library-and-museum-studies",
    "applied-science.medicine-and-health": "natural-science.biology.medicine-and-health",
    "applied-science.military-sciences": "social-science.political-science.military-sciences",
    "applied-science.public-administration": "social-science.political-science.public-administration",
    "applied-science.public-policy": "social-science.political-science.public-policy",
    "applied-science.social-work": "social-science.social-work",
    "applied-science.transportation": "natural-science.physics.technology.transportation",
    "applied-science.communication": "social-science.communication",
    "applied-science.technology": "natural-science.physics.technology",
}

REPLACE_REF = {
    "key:humanities.philosophy.logic": "Logic",
    "key:humanities.performing-arts.music": "Music",
    "key:formal-science.information-science.library-and-museum-studies.information-science": "Information science",
    "key:formal-science.computer-science.computing-in-social-sciences-arts-humanities-and-professions.information-science": "Information science",
    "key:natural-science.physics.technology.computer-science": "Computer science",
    "key:natural-science.biology.medicine-and-health.psychology": "Psychology",
}

REPLACE_NAME = {
    "Interdisciplinary studies": "Cultural studies",
    "Cultural studies": "key:social-science.cultural-studies",
    "Life science": "Biology",
    "Physical Science": "Physics",
    "Engineering and technology": "Technology",
    "Journalism, media studies and communication": "Communication",
}

REPARENT_PREFIX = {
    "humanities.performing-arts.music": "humanities.music",
    "humanities.divinity": "humanities.religious-studies.divinity",
    "humanities.theology": "humanities.religious-studies.theology",
    "humanities.religion": "humanities.religious-studies.religion",
    "social-science.interdisciplinary-studies": "social-science.cultural-studies",
    "social-science.futurology": "humanities.history.futurology",
    "social-science.business": "social-science.economics.business",
    "social-science.anthropology": "social-science.sociology.anthropology",
    "social-science.linguistics": "humanities.linguistics",
    "social-science.social-work": "social-science.sociology.social-work",
    "social-science.communication.journalism-media-studies-and-communication": "social-science.communication",
    "social-science.cultural-studies.asian-studies": "social-science.sociology.area-studies.asian-studies",
    "humanities.visual-arts.culinary-arts.culinary-arts": "humanities.visual-arts.culinary-arts",
    "social-science.political-science.public-administration.public-administration": "social-science.political-science.public-administration",
}

REMOVE_KEYS = {
    "applied-science",
    "humanities.philosophy.logic",
    "humanities.performing-arts.music",
    "natural-science.physical-science",
    "natural-science.life-science",
    "applied-science.library-and-museum-studies.information-science",
    "formal-science.computer-science.computing-in-social-sciences-arts-humanities-and-professions.information-science",
    "applied-science.engineering-and-technology.computer-science",
    "applied-science.medicine-and-health.psychology",
}

REMOVE_KEYS_POST = {
    "social-science.cultural-studies.cultural-studies",
    "natural-science.physics.astronomy.astronomy",
    "natural-science.physics.astronomy.astrophysics-2",
    "social-science.communication.journalism-media-studies-and-communication",
    "humanities.visual-arts.culinary-arts.culinary-arts",
    "social-science.political-science.public-administration.public-administration",
}

FOUNDATION_ATTACHED_TO = {
    "humanities.performing-arts": "",
    "humanities.music": "",
    "humanities.visual-arts": "",
    "humanities.history": "",
    "humanities.linguistics": "",
    "humanities.literature": "",
    "humanities.law": "",
    "humanities.philosophy": "",
    "humanities.philosophy.ethics": "",
    "social-science.cultural-studies": "",
    "social-science.communication": "",
    "humanities.religious-studies": "",
    "humanities.religious-studies.divinity": "Religious studies|0",
    "humanities.religious-studies.theology": "Religious studies|0",
    "humanities.religious-studies.religion": "Religious studies|0",
    "social-science.psychology": "",
    "social-science.sociology": "Psychology|0",
    "social-science.sociology.anthropology": "Sociology|0",
    "social-science.economics": "Mathematics|0;Scientific thinking|1",
    "social-science.political-science": "History|0;Communication|0;Law|0;Psychology|0;Economics|0",
    "social-science.geography": "",
    "humanities.history.futurology": "History|0",
    "natural-science.earth-science": "",
    "formal-science.logic": "",
    "formal-science.scientific-thinking": "",
    "formal-science.information-science": "",
    "formal-science.mathematics": "",
    "formal-science.mathematics.statistics": "Mathematics|0;Scientific thinking|0",
    "natural-science.physics": "",
    "natural-science.chemistry": "",
    "natural-science.biology": "",
    "natural-science.physics.astronomy": "Physics|0",
    "formal-science.computer-science": "",
    "natural-science.physics.technology": "Physics|0;Mathematics|0;Computer science|0",
    "social-science.economics.business": "Economics|0",
    "natural-science.physical-science": "Physics|0;Chemistry|0",
    "natural-science.life-science": "Biology|0",
    "natural-science.biology.agriculture": "Biology|0",
    "humanities.visual-arts.architecture-and-design": "Visual arts|0",
    "social-science.education": "Psychology|0",
    "natural-science.earth-science.environmental-studies-and-forestry": "Earth science|0",
    "social-science.family-and-consumer-science": "Sociology|0",
    "natural-science.biology.human-physical-performance-and-recreation": "Biology|0",
    "formal-science.information-science.library-and-museum-studies": "Information science|0",
    "natural-science.biology.medicine-and-health": "Biology|0",
    "social-science.political-science.military-sciences": "Political science|0",
    "social-science.political-science.public-administration": "Political science|0",
    "social-science.political-science.public-policy": "Political science|0",
    "social-science.sociology.social-work": "Sociology|0",
    "natural-science.physics.technology.transportation": "Technology|0",
}

NAME_OVERRIDE = {
    "social-science.cultural-studies": "Cultural studies",
    "social-science.communication": "Communication",
    "humanities.linguistics": "Linguistics",
    "humanities.literature": "Literature",
    "natural-science.physics": "Physics",
    "natural-science.chemistry": "Chemistry",
    "natural-science.biology": "Biology",
    "natural-science.physics.astronomy": "Astronomy",
    "natural-science.physics.technology": "Technology",
}

ORDER_RULES = [
    {"type": "after", "subtree": "humanities.performing-arts", "after": "humanities.music"},
    {"type": "end_of_section", "section": "humanities.history", "subtree": "humanities.history.futurology"},
    {"type": "after_exact", "subtree": "social-science.communication", "after": "social-science"},
    {"type": "after", "subtree": "social-science.sociology", "after": "social-science.psychology"},
    {"type": "after", "subtree": "social-science.economics", "after": "social-science.psychology"},
    {"type": "after", "subtree": "humanities.literature", "after": "humanities.linguistics"},
    {"type": "after_exact", "subtree": "formal-science.information-science", "after": "formal-science"},
    {"type": "end_of_section", "section": "natural-science", "subtree": "natural-science.physics"},
    {"type": "end_of_section", "section": "natural-science", "subtree": "natural-science.chemistry"},
    {"type": "end_of_section", "section": "natural-science", "subtree": "natural-science.biology"},
    {"type": "end_of_section", "section": "natural-science", "subtree": "natural-science.earth-science"},
    {"type": "end_of_section", "section": "natural-science", "subtree": "natural-science.physics.astronomy"},
]

ADDED_ROWS = [
    {
        "key": "humanities.music",
        "name": "Music",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Music",
    },
    {
        "key": "humanities.literature",
        "name": "Literature",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Literature",
    },
    {
        "key": "formal-science.scientific-thinking",
        "name": "Scientific thinking",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Scientific_method",
    },
    {
        "key": "formal-science.information-science",
        "name": "Information science",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Information_science",
    },
    {
        "key": "social-science.communication",
        "name": "Communication",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Communication",
    },
    {
        "key": "natural-science.earth-science",
        "name": "Earth science",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Earth_science",
    },
    {
        "key": "natural-science.physics",
        "name": "Physics",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Physics",
    },
    {
        "key": "natural-science.chemistry",
        "name": "Chemistry",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Chemistry",
    },
    {
        "key": "natural-science.biology",
        "name": "Biology",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Biology",
    },
    {
        "key": "natural-science.physics.astronomy",
        "name": "Astronomy",
        "description": "",
        "attached to": "Physics|0",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Astronomy",
    },
    {
        "key": "natural-science.physics.technology",
        "name": "Technology",
        "description": "",
        "attached to": "",
        "layer": "",
        "type": DEFAULT_TOPIC_TYPE,
        "url": f"{WIKI_PREFIX}/Technology",
    },
]

URL_OVERRIDES = {
    "humanities.history.futurology": f"{WIKI_PREFIX}/Futurology",
}


def parse_attached_to(value: str):
    if not value:
        return []
    parts = [p.strip() for p in value.split(";") if p.strip()]
    refs = []
    for part in parts:
        if "|" in part:
            ref, req = part.split("|", 1)
        else:
            ref, req = part, DEFAULT_REQ_TYPE
        refs.append((ref.strip(), req.strip()))
    return refs


def format_attached_to(refs):
    if not refs:
        return ""
    parts = [f"{ref}|{req}" for ref, req in refs]
    return ";".join(parts)


def replace_refs(value: str):
    refs = parse_attached_to(value)
    updated = []
    for ref, req in refs:
        if ref in REPLACE_REF:
            ref = REPLACE_REF[ref]
        elif ref in REPLACE_NAME:
            ref = REPLACE_NAME[ref]
        updated.append((ref, req))
    return format_attached_to(updated)


def replace_attached_to_name(value: str, old: str, new: str) -> str:
    refs = parse_attached_to(value)
    updated = []
    for ref, req in refs:
        if ref == old:
            ref = new
        updated.append((ref, req))
    return format_attached_to(updated)


def remap_key(key: str) -> str:
    key = remap_astronomy_priority(key)
    key = remap_applied_science(key)
    key = remap_languages_and_literature(key)
    key = remap_physical_science(key)
    key = remap_life_science(key)
    key = remap_physics_astronomy(key)
    if not REPARENT_PREFIX:
        return key

    max_passes = len(REPARENT_PREFIX) + 1
    for _ in range(max_passes):
        updated = False
        for old_prefix, new_prefix in REPARENT_PREFIX.items():
            if key == old_prefix:
                key = new_prefix
                updated = True
                break
            if key.startswith(old_prefix + "."):
                key = new_prefix + key[len(old_prefix) :]
                updated = True
                break
        if not updated:
            break
    return key


def remap_astronomy_priority(key: str) -> str:
    if key.startswith("natural-science.physics.astronomy."):
        return key
    if not key.startswith("natural-science."):
        return key
    rest = key.split(".", 2)[-1]
    rest_norm = rest.replace("-", " ").lower()
    if not any(term in rest_norm for term in ASTRONOMY_TERMS):
        return key
    if key.startswith("natural-science.physics."):
        tail = key[len("natural-science.physics.") :]
    elif key.startswith("natural-science.physical-science."):
        tail = key[len("natural-science.physical-science.") :]
    elif key.startswith("natural-science.chemistry."):
        tail = key[len("natural-science.chemistry.") :]
    elif key.startswith("natural-science.biology."):
        tail = key[len("natural-science.biology.") :]
    elif key.startswith("natural-science.earth-science."):
        tail = key[len("natural-science.earth-science.") :]
    else:
        return key
    if tail.startswith("astronomy."):
        tail = tail[len("astronomy.") :]
    return f"natural-science.physics.astronomy.{tail}"


def remap_applied_science(key: str) -> str:
    for old_prefix, new_prefix in APPLIED_SCIENCE_PREFIX_MAP.items():
        if key == old_prefix:
            return new_prefix
        if key.startswith(old_prefix + "."):
            return new_prefix + key[len(old_prefix) :]
    return key


def remap_languages_and_literature(key: str) -> str:
    if not (key == LANG_LIT_PREFIX or key.startswith(LANG_LIT_PREFIX + ".")):
        return key
    rest = key[len(LANG_LIT_PREFIX) :].lstrip(".")
    rest_norm = rest.replace("-", " ").lower()
    target_prefix = "humanities.literature"
    if any(term in rest_norm for term in LANG_LIT_LINGUISTICS_TERMS):
        target_prefix = "humanities.linguistics"
    elif any(term in rest_norm for term in LANG_LIT_LITERATURE_TERMS):
        target_prefix = "humanities.literature"

    if rest.startswith("linguistics."):
        rest = rest[len("linguistics.") :]
        target_prefix = "humanities.linguistics"
    elif rest == "linguistics":
        rest = ""
        target_prefix = "humanities.linguistics"
    elif rest.startswith("literature."):
        rest = rest[len("literature.") :]
        target_prefix = "humanities.literature"
    elif rest == "literature":
        rest = ""
        target_prefix = "humanities.literature"

    if not rest:
        return target_prefix
    return f"{target_prefix}.{rest}"


def remap_life_science(key: str) -> str:
    old_prefix = "natural-science.life-science"
    new_prefix = "natural-science.biology"
    if not (key == old_prefix or key.startswith(old_prefix + ".")):
        return key
    if key == new_prefix or key.startswith(new_prefix + "."):
        return key
    if key == old_prefix:
        return new_prefix
    rest = key[len(old_prefix) + 1 :]
    if rest == "biology":
        return new_prefix
    return f"{new_prefix}.{rest}"


def remap_physical_science(key: str) -> str:
    old_prefix = "natural-science.physical-science"
    if not (key == old_prefix or key.startswith(old_prefix + ".")):
        return key
    rest = key[len(old_prefix) + 1 :] if key.startswith(old_prefix + ".") else ""
    if not rest:
        return key
    immediate = rest.split(".", 1)[0]
    name = immediate.replace("-", " ")

    astronomy_terms = ASTRONOMY_TERMS
    earth_terms = [
        "geo",
        "earth",
        "soil",
        "environmental",
        "ocean",
        "marine",
        "paleo",
        "seismo",
        "climate",
        "atmospheric",
        "meteor",
        "planetary",
        "geodesy",
        "geophysics",
        "geochemistry",
        "physical-geography",
        "edaphology",
    ]
    chemistry_terms = [
        "chemistry",
        "chemical",
        "catalyst",
        "organic",
        "inorganic",
        "electrochem",
        "biochem",
        "pharmac",
        "medicinal",
        "cheminformatics",
    ]
    biology_terms = [
        "bio",
        "ecolog",
        "physiology",
        "immuno",
        "neuro",
        "genetic",
        "microbio",
    ]

    def has_any(terms):
        return any(t in name for t in terms)

    if "chemistry" in name or "chemical" in name:
        target = "natural-science.chemistry"
    elif "physics" in name:
        target = "natural-science.physics"
    elif has_any(astronomy_terms):
        target = "natural-science.physics.astronomy"
    elif has_any(earth_terms):
        target = "natural-science.earth-science"
    elif has_any(chemistry_terms):
        target = "natural-science.chemistry"
    elif has_any(biology_terms):
        target = "natural-science.biology"
    else:
        target = "natural-science.physics"

    if key == old_prefix + "." + immediate:
        if immediate in {"physics", "chemistry", "astronomy"} or target.endswith(immediate):
            return target
        return f"{target}.{immediate}"
    return target + key[len(old_prefix + "." + immediate) :]


def remap_physics_astronomy(key: str) -> str:
    prefix = "natural-science.physics."
    if not key.startswith(prefix):
        return key
    if key.startswith("natural-science.physics.astronomy."):
        return key
    rest = key[len(prefix) :]
    rest_norm = rest.replace("-", " ").lower()
    if not any(term in rest_norm for term in ASTRONOMY_TERMS):
        return key
    return f"natural-science.physics.astronomy.{rest}"


def dedupe_rows(rows):
    by_key = {}
    ordered = []
    for row in rows:
        key = row["key"]
        if key not in by_key:
            by_key[key] = row
            ordered.append(row)
            continue
        existing = by_key[key]
        for field in ("name", "description", "attached to", "type", "url"):
            if not existing.get(field) and row.get(field):
                existing[field] = row[field]
    return ordered


def remap_attached_to(value: str):
    refs = parse_attached_to(value)
    updated = []
    for ref, req in refs:
        if ref.startswith("key:"):
            key = ref[4:].strip()
            key = remap_key(key)
            ref = f"key:{key}"
        updated.append((ref, req))
    return format_attached_to(updated)


def url_token(url: str) -> str:
    if not url:
        return ""
    parsed = urlparse(url)
    path = parsed.path or ""
    if path.startswith("/wiki/"):
        path = path[len("/wiki/") :]
    token = unquote(path).split("/")[-1]
    token = token.replace("(", " ").replace(")", " ")
    token = token.replace("_", " ")
    token = re.sub(r"\s+", " ", token).strip()
    return token


def display_token(token: str) -> str:
    if not token:
        return ""
    token = re.sub(r"^(?i:Outline of (the )?)", "", token).strip()
    return token


URL_TOKEN_SYNONYMS = {
    "flavor taste": "taste",
    "flavour taste": "taste",
}


def normalize_token(token: str) -> str:
    token = display_token(token)
    token = re.sub(r"\s+", " ", token).strip().lower()
    if not token:
        return ""
    return URL_TOKEN_SYNONYMS.get(token, token)


def words_from_token(token: str) -> list[str]:
    token = display_token(token)
    return re.findall(r"[a-z0-9]+", token.lower())


def words_from_token_case(token: str) -> list[str]:
    token = display_token(token)
    return re.findall(r"[A-Za-z0-9]+", token)


def disambiguate_group_names(group):
    urls = [row.get("url", "") for row in group]
    tokens = [url_token(url) for url in urls]
    display_tokens = [display_token(t) for t in tokens]
    norm_tokens = [normalize_token(t) for t in display_tokens]

    name = group[0]["name"]
    name_norm = name.lower()
    display_norms = [t.lower() for t in display_tokens]
    if len({t for t in display_norms if t}) <= 1:
        return
    non_empty_tokens = [t for t in norm_tokens if t]

    base_indices = set()
    token_words = [words_from_token_case(t) for t in display_tokens]
    token_words_norm = [words_from_token(t) for t in display_tokens]
    normalized_words = []
    for norm in norm_tokens:
        normalized_words.append(re.findall(r"[a-z0-9]+", norm))
    non_empty_words = [w for w in normalized_words if w]
    common_prefix = []
    if non_empty_words:
        min_len = min(len(w) for w in non_empty_words)
        for i in range(min_len):
            word = non_empty_words[0][i]
            if all(words[i] == word for words in non_empty_words):
                common_prefix.append(word)
            else:
                break
    common_suffix = []
    if not common_prefix and non_empty_words:
        min_len = min(len(w) for w in non_empty_words)
        for i in range(1, min_len + 1):
            word = non_empty_words[0][-i]
            if all(words[-i] == word for words in non_empty_words):
                common_suffix.insert(0, word)
            else:
                break

    for idx, token in enumerate(tokens):
        token_norm = norm_tokens[idx]
        if not token_norm:
            continue
        if token_norm == name_norm:
            base_indices.add(idx)
            continue
        if non_empty_tokens and all(token_norm in other.lower() for other in non_empty_tokens if other):
            base_indices.add(idx)

    if len(base_indices) > 1:
        def base_rank(idx: int) -> tuple[int, int]:
            token_norm = display_norms[idx]
            name_match = 0 if token_norm == name_norm else 1
            return (name_match, len(token_norm))
        keep_idx = sorted(base_indices, key=base_rank)[0]
        base_indices = {keep_idx}

    used_names = set()
    for idx, row in enumerate(group):
        if idx in base_indices:
            used_names.add(row["name"])
            continue
        words = token_words[idx]
        words_norm = normalized_words[idx]
        if common_prefix and words_norm[: len(common_prefix)] == common_prefix:
            suffix_words = words[len(common_prefix) :]
        elif common_suffix and words_norm[-len(common_suffix) :] == common_suffix:
            prefix_words = words[: -len(common_suffix)]
            suffix_words = prefix_words if prefix_words else words
        else:
            suffix_words = words
        token = " ".join(suffix_words).strip()
        token = display_token(token) or row["key"].split(".")[-1]
        candidate = f"{row['name']} ({token})"
        if candidate in used_names:
            candidate = f"{candidate} [{idx + 1}]"
        row["name"] = candidate
        used_names.add(candidate)


def dedupe_by_name_and_reparent(rows):
    keys = {row["key"] for row in rows}
    index_by_key = {row["key"]: idx for idx, row in enumerate(rows)}
    child_counts = {key: 0 for key in keys}

    for row in rows:
        parts = row["key"].split(".")
        for i in range(1, len(parts)):
            prefix = ".".join(parts[:i])
            if prefix in child_counts:
                child_counts[prefix] += 1

    groups = {}
    for row in rows:
        groups.setdefault(row["name"], []).append(row)

    for group in list(groups.values()):
        disambiguate_group_names(group)

    groups = {}
    for row in rows:
        groups.setdefault(row["name"], []).append(row)

    remap_pairs = []
    for name, group in groups.items():
        if len(group) <= 1:
            continue
        group_sorted = sorted(
            group,
            key=lambda r: (
                -child_counts.get(r["key"], 0),
                -int(bool(r.get("url"))),
                len(r["key"]),
                index_by_key.get(r["key"], 0),
            ),
        )
        winner = group_sorted[0]
        for row in group_sorted:
            print(
                f"Duplicate name '{name}': key={row['key']} "
                f"children={child_counts.get(row['key'], 0)} "
                f"url={'yes' if row.get('url') else 'no'}"
            )
        for loser in group_sorted[1:]:
            remap_pairs.append((loser["key"], winner["key"]))

    if not remap_pairs:
        return rows

    def remap_key_local(key: str) -> str:
        for old_prefix, new_prefix in remap_pairs:
            if key == old_prefix or key.startswith(old_prefix + "."):
                return new_prefix + key[len(old_prefix) :]
        return key

    loser_keys = {old for old, _ in remap_pairs}
    updated_rows = []
    for row in rows:
        if row["key"] in loser_keys:
            continue
        new_key = remap_key_local(row["key"])
        if new_key != row["key"]:
            row = dict(row)
            row["key"] = new_key
        updated_rows.append(row)

    for row in updated_rows:
        refs = parse_attached_to(row.get("attached to", ""))
        updated_refs = []
        for ref, req in refs:
            if ref.startswith("key:"):
                ref_key = ref[4:].strip()
                new_ref_key = remap_key_local(ref_key)
                if new_ref_key != ref_key:
                    ref = f"key:{new_ref_key}"
            updated_refs.append((ref, req))
        row["attached to"] = format_attached_to(updated_refs)

    return dedupe_rows(updated_rows)


def derive_type(row):
    key = row["key"]
    if key in GROUP_KEYS:
        return ""

    if key in TECHNICAL_KEYS:
        return "T"
    if key in PRACTICAL_KEYS:
        return "P"

    existing = row.get("type", "")
    if existing in {"T", "P"}:
        return existing

    layer = row.get("layer")
    layer_value = None
    if isinstance(layer, int):
        layer_value = layer
    elif isinstance(layer, str) and layer.isdigit():
        layer_value = int(layer)

    if layer_value == GROUP_LAYER:
        return ""

    base = "S"
    if layer_value == 1 or key in GENERAL_KEYS:
        base += "0"
    return base


def compute_layers(rows):
    key_to_row = {row["key"]: row for row in rows}
    name_to_keys = {}
    for row in rows:
        name_to_keys.setdefault(row["name"], []).append(row["key"])

    memo = {}
    visiting = set()

    def resolve_ref(ref: str):
        if ref.startswith("key:"):
            key = ref[4:].strip()
            if key in key_to_row:
                return key, None
            return None, "MISSING_PARENT"
        keys = name_to_keys.get(ref, [])
        if not keys:
            return None, "MISSING_PARENT"
        if len(keys) > 1:
            return None, "AMBIGUOUS_PARENT"
        return keys[0], None

    def is_error(value):
        return isinstance(value, str) and value.startswith("0 (")

    def dfs(key: str):
        if key in memo:
            return memo[key]
        if key in visiting:
            memo[key] = "0 (CYCLE)"
            return memo[key]
        visiting.add(key)
        row = key_to_row[key]
        refs = parse_attached_to(row.get("attached to", ""))
        req_refs = [ref for ref, req in refs if req == DEFAULT_REQ_TYPE]
        if not req_refs:
            memo[key] = 1
            visiting.remove(key)
            return memo[key]
        layers = []
        for ref in req_refs:
            parent_key, err = resolve_ref(ref)
            if err:
                memo[key] = f"0 ({err})"
                visiting.remove(key)
                return memo[key]
            parent_layer = dfs(parent_key)
            if is_error(parent_layer):
                memo[key] = parent_layer
                visiting.remove(key)
                return memo[key]
            layers.append(parent_layer)
        memo[key] = max(layers) + 1 if layers else 1
        visiting.remove(key)
        return memo[key]

    for row in rows:
        if row["key"] in GROUP_KEYS:
            row["layer"] = GROUP_LAYER
        else:
            layer = dfs(row["key"])
            if isinstance(layer, int):
                layer = layer + LAYER_OFFSET
            row["layer"] = layer
    return rows


def parent_key_of(key: str):
    if "." not in key:
        return None
    return key.rsplit(".", 1)[0]


def insert_added_rows(rows, added_rows):
    index_by_key = {row["key"]: idx for idx, row in enumerate(rows)}
    pending = []

    for added in added_rows:
        parent_key = parent_key_of(added["key"])
        insert_after = index_by_key.get(parent_key)
        if insert_after is None:
            pending.append(added)
            continue
        rows.insert(insert_after + 1, added)
        for key, idx in list(index_by_key.items()):
            if idx > insert_after:
                index_by_key[key] = idx + 1
        index_by_key[added["key"]] = insert_after + 1

    if pending:
        rows.extend(pending)

    return rows


def collect_subtree(rows, prefix):
    subtree = []
    rest = []
    for row in rows:
        if row["key"] == prefix or row["key"].startswith(prefix + "."):
            subtree.append(row)
        else:
            rest.append(row)
    if subtree:
        root = [row for row in subtree if row["key"] == prefix]
        others = [row for row in subtree if row["key"] != prefix]
        subtree = root + others
    return subtree, rest


def move_subtree_after(rows, subtree_prefix, after_prefix):
    subtree, rest = collect_subtree(rows, subtree_prefix)
    if not subtree:
        return rows
    insert_at = None
    for idx, row in enumerate(rest):
        if row["key"] == after_prefix or row["key"].startswith(after_prefix + "."):
            insert_at = idx
    if insert_at is None:
        return rows
    return rest[: insert_at + 1] + subtree + rest[insert_at + 1 :]


def move_subtree_after_exact(rows, subtree_prefix, after_key):
    subtree, rest = collect_subtree(rows, subtree_prefix)
    if not subtree:
        return rows
    insert_at = next((idx for idx, row in enumerate(rest) if row["key"] == after_key), None)
    if insert_at is None:
        return rows
    return rest[: insert_at + 1] + subtree + rest[insert_at + 1 :]


def move_subtree_to_end_of_section(rows, section_prefix, subtree_prefix):
    subtree, rest = collect_subtree(rows, subtree_prefix)
    if not subtree:
        return rows
    last_idx = None
    for idx, row in enumerate(rest):
        if row["key"] == section_prefix or row["key"].startswith(section_prefix + "."):
            last_idx = idx
    if last_idx is None:
        return rows
    return rest[: last_idx + 1] + subtree + rest[last_idx + 1 :]


def apply_order_rules(rows):
    for rule in ORDER_RULES:
        if rule["type"] == "after":
            rows = move_subtree_after(rows, rule["subtree"], rule["after"])
        elif rule["type"] == "after_exact":
            rows = move_subtree_after_exact(rows, rule["subtree"], rule["after"])
        elif rule["type"] == "end_of_section":
            rows = move_subtree_to_end_of_section(rows, rule["section"], rule["subtree"])
    return rows


def find_discontinuous_prefixes(rows):
    key_set = {row["key"] for row in rows}
    indices_by_prefix = {}
    for idx, row in enumerate(rows):
        key = row["key"]
        parts = key.split(".")
        for i in range(1, len(parts)):
            prefix = ".".join(parts[:i])
            indices_by_prefix.setdefault(prefix, []).append(idx)

    def is_discontinuous(indices):
        if not indices:
            return False
        indices = sorted(indices)
        for a, b in zip(indices, indices[1:]):
            if b != a + 1:
                return True
        return False

    return [p for p, indices in indices_by_prefix.items() if p in key_set and is_discontinuous(indices)]


def regroup_subtree_at_root(rows, prefix):
    root_index = next((i for i, row in enumerate(rows) if row["key"] == prefix), None)
    if root_index is None:
        return rows
    subtree, rest = collect_subtree(rows, prefix)
    if not subtree:
        return rows
    return rest[:root_index] + subtree + rest[root_index:]


def regroup_discontinuous_prefixes(rows):
    max_passes = 5
    for _ in range(max_passes):
        prefixes = find_discontinuous_prefixes(rows)
        if not prefixes:
            break
        prefixes.sort(key=lambda p: len(p.split(".")))
        regrouped = set()
        for prefix in prefixes:
            if any(prefix.startswith(parent + ".") for parent in regrouped):
                continue
            rows = regroup_subtree_at_root(rows, prefix)
            regrouped.add(prefix)
    return rows


def reorder_top_level_groups(rows):
    order = ["humanities", "social-science", "formal-science", "natural-science"]
    remaining = rows[:]
    ordered = []
    for prefix in order:
        subtree, remaining = collect_subtree(remaining, prefix)
        ordered.extend(subtree)
    ordered.extend(remaining)
    return ordered


def main():
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    if input_path is None:
        input_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_INPUT_NAME
    if output_path is None:
        output_path = Path(__file__).resolve().parents[2] / "csv" / "topics" / DEFAULT_OUTPUT_NAME

    with input_path.open(encoding="utf-8") as f:
        reader = csv.DictReader(f)
        rows = []
        for row in reader:
            row = {
                "key": row.get("key", "").strip(),
                "name": row.get("name", "").strip(),
                "description": row.get("description", "").strip(),
                "attached to": row.get("attached to", "").strip(),
                "layer": row.get("layer", "").strip(),
                "type": row.get("type", "").strip(),
                "url": row.get("url", "").strip(),
            }
            rows.append(row)

    rows = [row for row in rows if row["key"] not in REMOVE_KEYS]

    for row in rows:
        row["key"] = remap_key(row["key"])
        row["attached to"] = remap_attached_to(row["attached to"])
        row["attached to"] = replace_refs(row["attached to"])
        if row["key"] in NAME_OVERRIDE:
            row["name"] = NAME_OVERRIDE[row["key"]]
        if not row["url"] and row["key"] in URL_OVERRIDES:
            row["url"] = URL_OVERRIDES[row["key"]]
        if "Languages and literature" in row["attached to"]:
            if row["key"].startswith("humanities.linguistics"):
                row["attached to"] = replace_attached_to_name(row["attached to"], "Languages and literature", "Linguistics")
            elif row["key"].startswith("humanities.literature"):
                row["attached to"] = replace_attached_to_name(row["attached to"], "Languages and literature", "Literature")
        if row["key"].startswith("natural-science.physics.astronomy."):
            if row["attached to"] in {"Physics|0", "Physical Science|0"}:
                row["attached to"] = "Astronomy|0"
        if row["key"].startswith("natural-science.earth-science."):
            if row["attached to"] in {"Physics|0", "Physical Science|0"}:
                row["attached to"] = "Earth science|0"
        if row["key"].startswith("natural-science.chemistry."):
            if row["attached to"] in {"Physics|0", "Physical Science|0"}:
                row["attached to"] = "Chemistry|0"

    rows = [row for row in rows if row["key"] not in REMOVE_KEYS_POST]
    rows = dedupe_rows(rows)
    rows = dedupe_by_name_and_reparent(rows)

    keys = {row["key"] for row in rows}
    pending_added = []
    for added in ADDED_ROWS:
        if added["key"] not in keys:
            pending_added.append(added)
            keys.add(added["key"])

    for row in rows:
        if row["key"] in FOUNDATION_ATTACHED_TO:
            row["attached to"] = FOUNDATION_ATTACHED_TO[row["key"]]

    rows = insert_added_rows(rows, pending_added)
    rows = apply_order_rules(rows)
    rows = regroup_discontinuous_prefixes(rows)
    rows = reorder_top_level_groups(rows)
    rows = compute_layers(rows)

    for row in rows:
        row["type"] = derive_type(row)

    header = ["key", "name", "description", "attached to", "layer", "type", "url"]
    with output_path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=header)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in header})

    print(f"Wrote {len(rows)} rows to {output_path}")


if __name__ == "__main__":
    raise SystemExit(main())
