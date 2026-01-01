#!/usr/bin/env python3
import csv
import re
import sys
from pathlib import Path


DEFAULT_DISCIPLINES_NAME = "Disciplines_final.csv"
DEFAULT_ACHIEVEMENTS_NAME = "Achievements.csv"
DEFAULT_OUTPUT_NAME = "t_topic_PLANNING.csv"
DEFAULT_LANG = "en"
DEFAULT_VERSION = "1"
ACHIEVEMENT_TYPE_ID = "3"
ACHIEVEMENT_LAYER = "1"


SPEC_WORDS = {
    "biology",
    "chemistry",
    "genetics",
    "mechanics",
    "physics",
    "research",
    "science",
    "studies",
    "theory",
}

SUFFIX_WORD_MAP = {
    "archaeology": "a",
    "anthropology": "a",
    "astronomy": "an",
    "astrophysics": "ap",
    "behavior": "b",
    "science": "c",
    "chemistry": "c",
    "classification": "c",
    "control": "c",
    "culture": "c",
    "design": "d",
    "development": "dv",
    "economics": "e",
    "economy": "e",
    "education": "e",
    "engineering": "e",
    "environment": "ev",
    "geography": "g",
    "history": "h",
    "operation": "o",
    "philosophy": "p",
    "policy": "p",
    "programming": "p",
    "religion": "r",
    "service": "sv",
    "sociology": "s",
    "studies": "s",
    "technology": "t",
    "law": "w",
    "psychology": "y",
}

X_OF = {
    "sociology"
}

def extract_chars(word: str, positions: list[int], scope: int | None = None) -> str:
    if scope is not None:
        spare_part = word[scope:]
        word = word[:scope]
    else:
        spare_part = ""
    extracted = "".join(word[pos - 1 if pos > 0 else len(word) + pos] for pos in positions if abs(pos) <= len(word))
    return extracted + spare_part

def peel_word(word: str, phrase_length: int) -> str:
    if word.endswith("craft") and len(word) > 7:
        # AAx*Axxxx
        return extract_chars(word, [1, 2, -5])
    if word.startswith("pharmaceutical"):
        # AxxxxxAxxxxxxx-
        return extract_chars(word, [1, 7], 14)
    if word.startswith(("environmental")):
        # AxAxxxxxxxxxx-
        return extract_chars(word, [1, 3], 13)
    if word.startswith(("computational")):
        # AxxAxxxxxxxxx-
        return extract_chars(word, [1, 4], 13)
    if word.startswith(("sociological")):
        # AxxxxAxxxxxx-
        return extract_chars(word, [1, 6], 12)
    if word.startswith("conservation"):
        # AxxxxxAxxxxx-
        return extract_chars(word, [1, 7], 12)
    if word.startswith(("mathematics")) and (phrase_length > 1 or len(word) > 11):
        # AxxxxAxxxxx-
        return extract_chars(word, [1, 6], 11)
    if word.startswith(("information")) and (phrase_length > 1 or len(word) > 11):
        # AxAxxxxxxxx-
        return extract_chars(word, [1, 3], 11)
    if word.startswith("philosophy") and (phrase_length > 1 or len(word) > 10):
        # AxxxxAxxxx-
        return extract_chars(word, [1, 6], 10)
    if word.startswith("arithmetic"):
        # AAxAxxxxxx-
        return extract_chars(word, [1, 2, 4], 10)
    if word.startswith("concurrent"):
        # AxxAxxxxxx-
        return extract_chars(word, [1, 4], 10)
    if word.startswith("sociology") and (phrase_length > 1 or len(word) > 9):
        # Axxxxxxxx-
        return extract_chars(word, [1], 9)
    if word.startswith("counselor"):
        # AxxxAxxxx-
        return extract_chars(word, [1, 5], 9)
    if word.startswith("geomorpho"):
        # AxxAxxxxx-
        return extract_chars(word, [1, 4], 9)
    if word.startswith(("cognitive", "crystallo", "corrosion", "interior", "religious")):
        # AxAxxxxxx-
        return extract_chars(word, [1, 3], 9)
    if word.startswith("pharmaco"):
        # AxxxxxAx-
        return extract_chars(word, [1, 7], 8)
    if word.startswith("agricult"):
        # AxxxAxxx-
        return extract_chars(word, [1, 5], 8)
    if word.startswith(("economic")) and (phrase_length > 1 or len(word) > 8):
        # AxxAxxxx-
        return extract_chars(word, [1, 4], 8)
    if word.startswith(("consumer", "computer")):
        # AxxAxxxx-
        return extract_chars(word, [1, 4], 8)
    if word.startswith(("politic")):
        # AxxxAxx-
        return extract_chars(word, [1, 5], 7)
    if word.startswith(("classic", "control", "polymer", "process")):
        # AxxAxxx-
        return extract_chars(word, [1, 4], 7)
    if word.startswith(("magneto", "archaeo")):
        # AxAxxxx-
        return extract_chars(word, [1, 3], 7)
    if word.startswith(("electro", "climato")):
        # AAxxxxx-
        return extract_chars(word, [1, 2], 7)
    if word.startswith(("palaeo", "anthro")):
        # Axxxxx-
        return extract_chars(word, [1], 6)
    if word.startswith(("paleo-", "psycho", "thermo", "cardio", "chrono", "social", "covert", "crypto", "marine")):
        # AxAxxx-
        return extract_chars(word, [1, 3], 6)
    if word.startswith(("pharma", "immuno")):
        # AAxxxx-
        return extract_chars(word, [1, 2], 6)
    if word.startswith(("neuro", "photo", "space")) and (phrase_length > 1 or len(word) > 5):
        # AxxAx-
        return extract_chars(word, [1, 4], 5)
    if word.startswith(("econo", "sindh")):
        # AxxAx-
        return extract_chars(word, [1, 4], 5)
    if word.startswith(("histo", "socio", "phylo", "helio", "cosmo", "meteo", "herme", "limno", "solar", "polic", "crypt", "power", "organ", "mecha")):
        # AxAxx-
        return extract_chars(word, [1, 3], 5)
    if word.startswith(("paleo", "micro", "hydro", "inter")):
        # Axxxx-
        return extract_chars(word, [1], 5)
    if word.startswith(("astro", "ethno")):
        # AAxxx-
        return extract_chars(word, [1, 2], 5)
    if word.startswith(("phon", "comm")):
        # AxxA-
        return extract_chars(word, [1, 4], 4)
    if word.startswith(("peda", "topo", "kine", "tele", "mens", "nano")):
        # AxAx-
        return extract_chars(word, [1, 3], 4)
    if word.startswith(("aero", "agro", "arch", "pyro", "typo")):
        # AAxx-
        return extract_chars(word, [1, 2], 4)
    if word.startswith(("para", "meta")):
        # Axxx-
        return extract_chars(word, [1], 4)
    if word.startswith("zoo"):
        # Axx-
        return extract_chars(word, [1], 3)
    if word.startswith(("gra", "sto", "spe", "pre")):
        # AAx-
        return extract_chars(word, [1, 2], 3)
    if word.startswith(("geo", "bio", "phy", "met", "car", "mus", "the", "man", "int", "pre")) and phrase_length > 1:
        # Axx-
        return extract_chars(word, [1], 3)
    if word.startswith(("geo", "bio", "phy", "met", "car", "mus", "the", "man", "int")):
        # AxA-
        return extract_chars(word, [1, 3], 3)
    return word

def replace_slice(text: str, start_pos: int, length: int, replacement: str) -> str:
    start = max(start_pos - 1, 0)
    end = start + max(length, 0)
    return text[:start] + replacement + text[end:]

def normalize_text(value: str) -> str:
    cleaned = re.sub(r"\([^)]*\)|\*|'", "", value.lower())
    cleaned = cleaned.replace("&", " & ").replace("/", " / ")
    cleaned = re.sub(r"[- ]+", " ", cleaned)
    return cleaned.strip()


def split_phrases(value: str) -> list[str]:
    return [p.strip() for p in re.split(r"\s*(?:/|&)\s*", value) if p.strip()]


def select_primary_phrase(value: str) -> str:
    phrases = split_phrases(value)
    if not phrases:
        return ""
    phrase = phrases[0]
    if "," in phrase:
        left, right = phrase.split(",", 1)
        left = left.strip()
        right = right.strip()
        if len(re.findall(r"[a-z0-9]+", left)) >= 2 and len(re.findall(r"[a-z0-9]+", right)) >= 2:
            return left
    return phrase.replace(",", " ")


def peel_phrase(words: list[str]) -> list[str]:
    if len(words) < 2:
        return words
    candidate = words[:]
    for idx, word in enumerate(candidate):
        if idx >= 1 and word in SPEC_WORDS:
            candidate[idx] = word[:1]
    total = sum(len(word) for word in candidate)
    if total < 3:
        return words
    return candidate


def compute_topic_id(name: str, type_id: int, existing_ids: list[str]) -> str:
    clean = normalize_text(name)
    phrase = select_primary_phrase(clean)
    words = re.findall(r"[a-z0-9]+", phrase)
    if len(words) > 3 or (len(words) >=2 and words[0] in X_OF and words[1] == "of" and not (words[2] in SUFFIX_WORD_MAP or words[2] in SPEC_WORDS)):
        words = [w for w in words if w not in {"of", "for", "in", "and", "the"}]
    if not words:
        words = ["unk"]

    is_spec = (len(words) >= 2 and len(peel_word(words[0], len(words))) > 1) and (words[1] in SPEC_WORDS or (words[1] in SUFFIX_WORD_MAP and len(SUFFIX_WORD_MAP[words[1]]) < 2))

    normalized = []
    for idx, word in enumerate(words):
        if idx >= 1 and word in SUFFIX_WORD_MAP:
            word = SUFFIX_WORD_MAP[word]
        normalized.append(word)
    normalized = peel_phrase(normalized) if len(words) > 2 or len(peel_word(words[0], len(words))) > 1 else words
    peeled = [peel_word(w, len(normalized)) for w in normalized]
    if not peeled:
        peeled = ["unk"]

    n = len(peeled)
    first = peeled[0]
    second = peeled[1] if n >= 2 else ""
    third = peeled[2] if n >= 3 else ""

    if n == 1:
        char3 = first[:3]
    elif n == 2:
        if is_spec:
            char3 = first[:2] + second[:1]
        else:
            char3 = first[:1] + second[:2]
    else:
        char3 = first[:1] + second[:1] + third[:1]

    char_id = char3.upper()
    prev_count = sum(1 for existing in existing_ids if existing.startswith(char_id))
    has_zero = any(existing == f"{char_id}0" for existing in existing_ids)

    if len(char_id) < 3:
        print(phrase + " => " + str(words) + " => " + str(normalized) + " => " + str(peeled))

    if type_id == 0:
        suffix = prev_count if has_zero else 0
    else:
        suffix = prev_count + 1

    return f"{char_id}{suffix}"


def map_type_id(value: str) -> int:
    if "0" in value:
        return 0
    if "T" in value:
        return 2
    if "P" in value:
        return 6
    if "S" in value or not value:
        return 1
    return 7


def read_disciplines(path: Path):
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for idx, row in enumerate(reader):
            layer_raw = (row.get("layer") or "").strip()
            if not layer_raw.isdigit():
                continue
            layer = int(layer_raw)
            if layer <= 0:
                continue
            rows.append(
                {
                    "index": idx,
                    "name": (row.get("name") or "").strip(),
                    "type": (row.get("type") or "").strip(),
                    "layer": layer,
                    "description": (row.get("description") or "").strip(),
                    "url": (row.get("url") or "").strip(),
                }
            )
        return rows


def read_achievements(path: Path):
    with path.open(encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for row in reader:
            skill_id = (row.get("SkillID") or "").strip()
            if not skill_id:
                continue
            rows.append(
                {
                    "topicID": skill_id,
                    "name": (row.get("ACHIEVEMENTS:") or "").strip(),
                    "description": (row.get("Description (Achievements serve as a Certificate for NON-HIERARCHICAL Skills and range from Levels 1 to 6)") or "").strip(),
                }
            )
        return rows


def main() -> int:
    disciplines_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    achievements_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
    output_path = Path(sys.argv[3]) if len(sys.argv) > 3 else None

    base_dir = Path(__file__).resolve().parents[2] / "csv" / "topics"
    if disciplines_path is None:
        disciplines_path = base_dir / DEFAULT_DISCIPLINES_NAME
    if achievements_path is None:
        achievements_path = base_dir / DEFAULT_ACHIEVEMENTS_NAME
    if output_path is None:
        output_path = base_dir / DEFAULT_OUTPUT_NAME

    disciplines = read_disciplines(disciplines_path)
    disciplines.sort(key=lambda row: (row["layer"], row["index"]))

    topic_ids: list[str] = []
    output_rows = []
    for row in disciplines:
        type_id = map_type_id(row["type"])
        topic_id = compute_topic_id(row["name"], type_id, topic_ids)
        topic_ids.append(topic_id)
        output_rows.append(
            {
                "topicID": topic_id,
                "lang": DEFAULT_LANG,
                "name": row["name"],
                "typeID": str(type_id),
                "layer": str(row["layer"]),
                "description": row["description"],
                "version": DEFAULT_VERSION,
                "url": row["url"],
            }
        )

    general_rows = [row for row in output_rows if row["typeID"] == "0"]
    non_general_rows = [row for row in output_rows if row["typeID"] != "0"]
    output_rows = general_rows + non_general_rows

    achievements = read_achievements(achievements_path)
    for row in achievements:
        output_rows.append(
            {
                "topicID": row["topicID"],
                "lang": DEFAULT_LANG,
                "name": row["name"],
                "typeID": ACHIEVEMENT_TYPE_ID,
                "layer": ACHIEVEMENT_LAYER,
                "description": row["description"],
                "version": DEFAULT_VERSION,
                "url": "",
            }
        )

    header = ["topicID", "lang", "name", "typeID", "layer", "description", "version", "url"]
    with output_path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=header, lineterminator="\n")
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"Wrote {len(output_rows)} rows to {output_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
