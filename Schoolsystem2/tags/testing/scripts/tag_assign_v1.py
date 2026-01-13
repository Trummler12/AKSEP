from __future__ import annotations

import csv
import os
from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer

ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = ROOT / "testing" / "data"
TAGS_PATH = DATA_DIR / "t_tag_PLANNING.txt"
TOPICS_PATH = DATA_DIR / "t_topic_PLANNING.csv"
OUT_PATH = DATA_DIR / "ct_topic_tags_PLANNING.csv.txt"

MODEL_NAME = os.getenv(
    "TAG_MODEL_NAME", "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
)
TOP_K = int(os.getenv("TAG_TOP_K", "5"))
MIN_SIM = float(os.getenv("TAG_MIN_SIM", "0.2"))
WEIGHT_TEMP = float(os.getenv("TAG_WEIGHT_TEMP", "0.08"))


@dataclass(frozen=True)
class Tag:
    tag_id: int
    name: str
    synonyms: List[str]


@dataclass(frozen=True)
class Topic:
    topic_id: str
    name: str
    description: str


def load_tags(path: Path) -> List[Tag]:
    tags: List[Tag] = []
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            tag_id_raw = (row.get("tagID") or "").strip()
            name = (row.get("name") or "").strip()
            synonyms_raw = (row.get("synonyms") or "").strip()
            if not tag_id_raw or not name:
                continue
            try:
                tag_id = int(tag_id_raw)
            except ValueError:
                continue
            synonyms = [part.strip() for part in synonyms_raw.split(",") if part.strip()]
            tags.append(Tag(tag_id=tag_id, name=name, synonyms=synonyms))
    return tags


def load_topics(path: Path) -> List[Topic]:
    topics: List[Topic] = []
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            topic_id = (row.get("topicID") or "").strip()
            name = (row.get("name") or "").strip()
            description = (row.get("description") or "").strip()
            if not topic_id or not name:
                continue
            topics.append(Topic(topic_id=topic_id, name=name, description=description))
    return topics


def build_tag_variants(tags: List[Tag]) -> Tuple[List[str], List[List[int]]]:
    variant_texts: List[str] = []
    tag_variant_indices: List[List[int]] = []
    for tag in tags:
        variants = [tag.name] + tag.synonyms
        indices: List[int] = []
        for variant in variants:
            variant_texts.append(f"Tag: {variant}.")
            indices.append(len(variant_texts) - 1)
        tag_variant_indices.append(indices)
    return variant_texts, tag_variant_indices


def topic_text(topic: Topic) -> str:
    if topic.description:
        return f"{topic.name}. {topic.description}"
    return topic.name


def softmax(scores: np.ndarray, temperature: float) -> np.ndarray:
    if scores.size == 0:
        return scores
    scaled = scores / max(temperature, 1e-6)
    scaled = scaled - np.max(scaled)
    exp_scores = np.exp(scaled)
    return exp_scores / np.sum(exp_scores)


def main() -> None:
    tags = load_tags(TAGS_PATH)
    topics = load_topics(TOPICS_PATH)
    if not tags:
        raise SystemExit("No tags found.")
    if not topics:
        raise SystemExit("No topics found.")

    model = SentenceTransformer(MODEL_NAME)
    tag_inputs, tag_variant_indices = build_tag_variants(tags)
    topic_inputs = [topic_text(topic) for topic in topics]

    tag_variant_emb = model.encode(
        tag_inputs, normalize_embeddings=True, show_progress_bar=True
    )
    topic_emb = model.encode(
        topic_inputs, normalize_embeddings=True, show_progress_bar=True
    )
    sim = topic_emb @ tag_variant_emb.T

    tag_scores = np.empty((len(topics), len(tags)), dtype=float)
    for tag_idx, indices in enumerate(tag_variant_indices):
        tag_scores[:, tag_idx] = np.median(sim[:, indices], axis=1)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with OUT_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.writer(handle)
        writer.writerow(["topicID", "tagID", "tagName", "similarity", "weight", "rank"])

        total_rows = 0
        per_topic_counts: List[int] = []
        for topic_idx, topic in enumerate(topics):
            scores = tag_scores[topic_idx]
            order = np.argsort(scores)[::-1]
            top_indices = order[: max(TOP_K, 1)].tolist()
            filtered = [i for i in top_indices if float(scores[i]) >= MIN_SIM]
            if not filtered:
                filtered = [top_indices[0]]

            kept_scores = np.array([float(scores[i]) for i in filtered], dtype=float)
            weights = softmax(kept_scores, WEIGHT_TEMP)

            for rank, (idx, weight) in enumerate(zip(filtered, weights), start=1):
                writer.writerow(
                    [
                        topic.topic_id,
                        tags[idx].tag_id,
                        tags[idx].name,
                        f"{kept_scores[rank-1]:0.6f}",
                        f"{float(weight):0.6f}",
                        rank,
                    ]
                )
                total_rows += 1
            per_topic_counts.append(len(filtered))

    avg_tags = float(np.mean(per_topic_counts)) if per_topic_counts else 0.0
    print(f"Model: {MODEL_NAME}")
    print(f"Topics: {len(topics)}; Tags: {len(tags)}")
    print(f"Rows written: {total_rows}; Avg tags per topic: {avg_tags:0.2f}")
    print(f"Output: {OUT_PATH}")


if __name__ == "__main__":
    main()
