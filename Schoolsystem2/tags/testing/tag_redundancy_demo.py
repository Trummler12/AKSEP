from __future__ import annotations

from pathlib import Path
from typing import List, Tuple
import csv
import numpy as np
from sentence_transformers import SentenceTransformer

# User-configurable output settings
TOP_SIMILAR_PAIRS = 40
REDUNDANCY_THRESHOLD = 0.78
TOP_TAGS_PER_TOPIC = 5
TOPICS_PER_RANK_OUTPUT = 30
SORT_BY_RANK = 2
TOP_TAG_SUMMARY = 20
EXCLUDED_TOP_PAIRS = [
    ("climate", "climate change"),
    ("water", "air"),
]

USE_TOPIC_NAMES = True
USE_TOPIC_DESCRIPTIONS = False

OVERRIDE_WITH_SAMPLE = True
SAMPLE_TAGS = [
    "geographic",
    "artistic",
    "linguistic",
    "martial", "strategic",
    "monetary",
    "technical",
    "mechanical",
    "digital",
    "experimental",
    "philosophical", "psychological", "social", "cultural", "political", "religious", "ethical",
    "animalistic",
    "historical",
    "biological", "chemical", "physical", "environmental", "numerical", "astronomical",
    "healthy", "medical", "surgical", "logistical",
    "athletic", "coordinative",
]
TAG_PREFIX = ""
TAG_SUFFIX = " field of study"
USE_TAG_AFFIXES = True

TAGS_CSV_PATH = Path(__file__).resolve().parent / "data" / "t_tag_PLANNING.txt"
TOPICS_CSV_PATH = Path(__file__).resolve().parent / "data" / "t_topic_PLANNING.csv"


def top_pairs(sim: np.ndarray, labels: List[str], k: int = 10) -> List[Tuple[float, str, str]]:
    """Return top-k most similar distinct pairs (i<j)."""
    excluded = {
        frozenset((a.casefold(), b.casefold())) for a, b in EXCLUDED_TOP_PAIRS
    }
    n = sim.shape[0]
    pairs: List[Tuple[float, str, str]] = []
    for i in range(n):
        for j in range(i + 1, n):
            pair_key = frozenset((labels[i].casefold(), labels[j].casefold()))
            if pair_key in excluded:
                continue
            pairs.append((float(sim[i, j]), labels[i], labels[j]))
    pairs.sort(key=lambda t: t[0], reverse=True)
    return pairs[:k]


def top_topic_tag_sets(
    sim: np.ndarray,
    topic_labels: List[str],
    top_n: int,
) -> List[Tuple[float, str, List[int], List[float]]]:
    """Return topics with their top-N tag indices/scores (sorted elsewhere)."""
    if top_n < 1 or sim.size == 0:
        return []

    limit = min(top_n, sim.shape[1])
    results: List[Tuple[float, str, List[int], List[float]]] = []
    for topic_idx, topic_name in enumerate(topic_labels):
        scores = sim[topic_idx]
        order = np.argsort(scores)[::-1]
        top_indices = order[:limit].tolist()
        top_scores = [float(scores[i]) for i in top_indices]
        nth_score = top_scores[-1]
        results.append((nth_score, topic_name, top_indices, top_scores))

    return results


def expand_group(
    seed_indices: List[int],
    candidate_indices: List[int],
    sim: np.ndarray,
    threshold: float,
) -> set[int]:
    group = set(seed_indices)
    if threshold < 0:
        return group

    changed = True
    while changed:
        changed = False
        for src in list(group):
            for cand in candidate_indices:
                if cand in group:
                    continue
                if float(sim[src, cand]) >= threshold:
                    group.add(cand)
                    changed = True
    return group


def build_primary_group(
    seed_idx: int,
    candidate_indices: List[int],
    sim: np.ndarray,
) -> set[int]:
    if len(candidate_indices) < 2:
        return {seed_idx}

    best_score = -1.0
    best_idx = -1
    for cand in candidate_indices:
        if cand == seed_idx:
            continue
        score = float(sim[seed_idx, cand])
        if score > best_score:
            best_score = score
            best_idx = cand

    if best_idx < 0:
        return {seed_idx}

    return expand_group([seed_idx, best_idx], candidate_indices, sim, best_score)


def split_tag_groups(
    top_indices: List[int],
    tag_sim: np.ndarray,
) -> Tuple[List[int], List[int], List[int]]:
    if not top_indices:
        return [], [], []

    high_seed = top_indices[0]
    low_seed = top_indices[-1]

    high_group = build_primary_group(high_seed, top_indices, tag_sim)
    low_group = build_primary_group(low_seed, top_indices, tag_sim)

    overlap = high_group & low_group
    if overlap:
        if len(high_group) >= len(low_group):
            high_group -= overlap
        else:
            low_group -= overlap

    mid_group = [idx for idx in top_indices if idx not in high_group and idx not in low_group]
    high_ordered = [idx for idx in top_indices if idx in high_group]
    low_ordered = [idx for idx in top_indices if idx in low_group]
    return high_ordered, mid_group, low_ordered


def format_tag_group(
    indices: List[int],
    tag_labels: List[str],
    score_by_index: dict[int, float],
) -> str:
    if not indices:
        return ""
    return ",\t".join(
        f"({score_by_index[idx]:0.3f}) {tag_labels[idx]}" for idx in indices    
    )


def summarize_tag_assignments(
    top_sets: List[Tuple[float, str, List[int], List[float]]],
    tag_labels: List[str],
    top_n: int,
    top_m: int,
) -> None:
    if not top_sets:
        return

    limit = min(top_n, len(tag_labels))
    place1_counts = [0] * len(tag_labels)
    weighted_counts = [0.0] * len(tag_labels)
    for _, _, top_indices, _ in top_sets:
        for rank, tag_idx in enumerate(top_indices[:limit], start=1):
            if rank == 1:
                place1_counts[tag_idx] += 1
            weighted_counts[tag_idx] += 1.0 / rank

    place1 = [(count, tag_labels[idx]) for idx, count in enumerate(place1_counts)]
    weighted = [(count, tag_labels[idx]) for idx, count in enumerate(weighted_counts)]

    place1_sorted = sorted(place1, key=lambda item: (-item[0], item[1]))
    place1_least = sorted(place1, key=lambda item: (item[0], item[1]))
    weighted_sorted = sorted(weighted, key=lambda item: (-item[0], item[1]))
    weighted_least = sorted(weighted, key=lambda item: (item[0], item[1]))

    print("\nTag-Zuordnungen (Place-1 haeufigste):")
    for count, tag in place1_sorted[:top_m]:
        print(f"{count:3d}  {tag}")
    print("\nTag-Zuordnungen (Place-1 seltenste):")
    for count, tag in place1_least[:top_m]:
        print(f"{count:3d}  {tag}")

    print("\nTag-Zuordnungen (gewichtete Top-N, haeufigste):")
    for count, tag in weighted_sorted[:top_m]:
        print(f"{count:6.2f}  {tag}")
    print("\nTag-Zuordnungen (gewichtete Top-N, seltenste):")
    for count, tag in weighted_least[:top_m]:
        print(f"{count:6.2f}  {tag}")


def redundancy_groups(sim: np.ndarray, labels: List[str], threshold: float) -> List[List[str]]:
    """
    Simple graph-based clustering:
    connect i<->j if sim >= threshold, return connected components.
    """
    n = sim.shape[0]
    visited = [False] * n
    groups: List[List[str]] = []
    seen_groups = set()

    adjacency = [[] for _ in range(n)]
    for i in range(n):
        for j in range(i + 1, n):
            if sim[i, j] >= threshold:
                adjacency[i].append(j)
                adjacency[j].append(i)

    for start in range(n):
        if visited[start]:
            continue
        # BFS/DFS
        stack = [start]
        visited[start] = True
        component = [start]
        while stack:
            v = stack.pop()
            for nb in adjacency[v]:
                if not visited[nb]:
                    visited[nb] = True
                    stack.append(nb)
                    component.append(nb)

        # Only output non-trivial groups (size>1)
        if len(component) > 1:
            group = sorted({labels[i] for i in component}, key=str.lower)
            if len(group) > 1:
                key = tuple(item.lower() for item in group)
                if key not in seen_groups:
                    seen_groups.add(key)
                    groups.append(group)

    # Sort groups by size desc, then name
    groups.sort(key=lambda g: (-len(g), g[0].lower()))
    return groups


def load_tags_from_csv(csv_path: Path) -> List[str]:
    tags: List[str] = []
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            name = (row.get("name") or "").strip().lower()
            if not name:
                continue
            tags.append(name)
    return tags


def load_topics_from_csv(csv_path: Path) -> List[str]:
    topics: List[str] = []
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            name = (row.get("name") or "").strip().lower()
            description = (row.get("description") or "").strip().lower()
            if name:
                topics.append(name if USE_TOPIC_NAMES and not USE_TOPIC_DESCRIPTIONS
                              else description if USE_TOPIC_DESCRIPTIONS and not USE_TOPIC_NAMES
                              else f"{name}, {description}")
    return topics


def main() -> None:
    # Beispiel-Tags (absichtlich mit moeglichen Redundanzen)
    tags_raw = load_tags_from_csv(TAGS_CSV_PATH) if not OVERRIDE_WITH_SAMPLE else SAMPLE_TAGS
    tags = [f"{TAG_PREFIX}{tag}{TAG_SUFFIX}" for tag in tags_raw] if USE_TAG_AFFIXES else tags_raw
    topics = load_topics_from_csv(TOPICS_CSV_PATH)

    model_name = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
    model = SentenceTransformer(model_name)

    # Embeddings (normalize_embeddings=True -> cosine = dot product)
    tag_emb = model.encode(tags, normalize_embeddings=True)
    if topics:
        topic_emb = model.encode(topics, normalize_embeddings=True)
        topic_tag_sim = topic_emb @ tag_emb.T
    else:
        topic_emb = np.empty((0, tag_emb.shape[1]), dtype=tag_emb.dtype)
        topic_tag_sim = np.empty((0, tag_emb.shape[0]), dtype=tag_emb.dtype)

    sim = tag_emb @ tag_emb.T  # because normalized

    print("\nTop aehnlichste Paare:")
    for score, a, b in top_pairs(sim, tags, k=TOP_SIMILAR_PAIRS):
        print(f"{score:0.3f}  {a}\t<-> {b}")

    groups = redundancy_groups(sim, tags, threshold=REDUNDANCY_THRESHOLD)

    print(f"\nRedundanz-Gruppen (cosine >= {REDUNDANCY_THRESHOLD}):")
    if not groups:
        print("(keine Gruppen gefunden)")
    else:
        for g in groups:
            print("- " + ", ".join(g))

    if not topics:
        print("\n(keine Topics gefunden)")
    else:
        top_sets = top_topic_tag_sets(
            sim=topic_tag_sim,
            topic_labels=topics,
            top_n=TOP_TAGS_PER_TOPIC,
        )
        if top_sets:
            print(
                "\nTopics mit hoechster Uebereinstimmung mit ihrem #"
                f"{TOP_TAGS_PER_TOPIC} passendsten Tag:"
            )
            top_sets_sorted = sorted(top_sets, key=lambda t: (-t[0], t[1].lower()))
            for nth_score, topic, top_indices, top_scores in top_sets_sorted[:TOPICS_PER_RANK_OUTPUT]:
                score_by_index = dict(zip(top_indices, top_scores))
                group_a, group_b, group_c = split_tag_groups(top_indices, sim)
                tags_str_a = format_tag_group(group_a, tags, score_by_index)
                tags_str_b = format_tag_group(group_b, tags, score_by_index)
                tags_str_c = format_tag_group(group_c, tags, score_by_index)
                print(f"{nth_score:0.3f}  {topic}:")
                if tags_str_a:
                    print(f"\t<-> {tags_str_a}")
                if tags_str_b:
                    print(f"\t<-> {tags_str_b}")
                if tags_str_c:
                    print(f"\t<-> {tags_str_c}")

            print(
                "\n\n\nTopics mit niedrigster Uebereinstimmung mit ihrem #"
                f"{TOP_TAGS_PER_TOPIC} passendsten Tag:"
            )
            top_sets_sorted = sorted(top_sets, key=lambda t: (t[0], t[1].lower()))
            for nth_score, topic, top_indices, top_scores in top_sets_sorted[:TOPICS_PER_RANK_OUTPUT]:
                score_by_index = dict(zip(top_indices, top_scores))
                group_a, group_b, group_c = split_tag_groups(top_indices, sim)
                tags_str_a = format_tag_group(group_a, tags, score_by_index)
                tags_str_b = format_tag_group(group_b, tags, score_by_index)
                tags_str_c = format_tag_group(group_c, tags, score_by_index)
                print(f"{nth_score:0.3f}  {topic}:")
                if tags_str_a:
                    print(f"\t<-> {tags_str_a}")
                if tags_str_b:
                    print(f"\t<-> {tags_str_b}")
                if tags_str_c:
                    print(f"\t<-> {tags_str_c}")

            summarize_tag_assignments(
                top_sets=top_sets,
                tag_labels=tags,
                top_n=TOP_TAGS_PER_TOPIC,
                top_m=TOP_TAG_SUMMARY,
            )

    # Optional: vollstaendige Matrix ausgeben (fuer kleine n)
    # print("\nSimilarity Matrix:\n", np.round(sim, 3))


if __name__ == "__main__":
    main()
