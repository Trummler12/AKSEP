from __future__ import annotations

import random
import time
from typing import List, Tuple

import numpy as np
from sentence_transformers import SentenceTransformer

# User-configurable settings
MAX_SECONDS = 300
RANDOM_STARTS = 200
SEED = 42
TOP_RESULTS = 3
TWO_OPT_PASSES = 3
SCORE_MODE = "product"  # "sum" or "product"

BASE_TAG_ORDER = [
    "Music",
    "Performing arts",
    "Visual arts",
    "Literature",
    "Linguistics",
    "History",
    "Geography",
    "Culture",
    "Religion",
    "Philosophy",
    "Ethics",
    "Law",
    "Politics",
    "Economics",
    "Sociology",
    "Psychology",
    "Communication",
    "Information science",
    "Scientific thinking",
    "Logic",
    "Statistics",
    "Mathematics",
    "Computer science",
    "Technology",
    "Physics",
    "Astronomy",
    "Earth science",
    "Chemistry",
    "Biology",
]

MODEL_NAME = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
EPS = 1e-9


def normalize_names(names: List[str]) -> List[str]:
    return [name.strip().lower() for name in names if name.strip()]


def cosine_sim_matrix(x: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(x, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    x_norm = x / norms
    return x_norm @ x_norm.T


def normalize_similarity_rows(sim: np.ndarray) -> np.ndarray:
    sim_no_diag = sim.copy()
    np.fill_diagonal(sim_no_diag, -np.inf)
    row_max = np.max(sim_no_diag, axis=1)
    row_max[row_max <= 0] = 1.0
    return sim / row_max[:, None]


def score_path(order: List[int], sim: np.ndarray, mode: str) -> float:
    if mode == "product":
        score = 1.0
        for i in range(len(order) - 1):
            score *= float(sim[order[i], order[i + 1]])
        return score
    return sum(float(sim[order[i], order[i + 1]]) for i in range(len(order) - 1))


def greedy_path(start: int, sim: np.ndarray) -> List[int]:
    n = sim.shape[0]
    remaining = set(range(n))
    remaining.remove(start)
    path = [start]
    current = start
    while remaining:
        next_idx = max(remaining, key=lambda j: sim[current, j])
        remaining.remove(next_idx)
        path.append(next_idx)
        current = next_idx
    return path


def two_opt(order: List[int], sim: np.ndarray, deadline: float, max_passes: int) -> List[int]:
    n = len(order)
    improved = True
    passes = 0
    while improved and passes < max_passes:
        if time.time() >= deadline:
            break
        improved = False
        for i in range(n - 1):
            if time.time() >= deadline:
                return order
            a = order[i - 1] if i > 0 else None
            b = order[i]
            for k in range(i + 1, n):
                if time.time() >= deadline:
                    return order
                c = order[k]
                d = order[k + 1] if k + 1 < n else None
                old = 0.0
                new = 0.0
                if a is not None:
                    old += float(sim[a, b])
                    new += float(sim[a, c])
                if d is not None:
                    old += float(sim[c, d])
                    new += float(sim[b, d])
                if new > old + EPS:
                    order[i : k + 1] = reversed(order[i : k + 1])
                    improved = True
        passes += 1
    return order


def best_orders(
    sim: np.ndarray,
    max_seconds: int,
    random_starts: int,
    seed: int,
    top_results: int,
    score_mode: str,
) -> List[Tuple[float, List[int]]]:
    n = sim.shape[0]
    rng = random.Random(seed)
    best = list(range(n))
    best_score = score_path(best, sim, score_mode)
    seen: set[Tuple[int, ...]] = {tuple(best)}
    top: List[Tuple[float, List[int]]] = [(best_score, best)]

    start_time = time.time()
    deadline = start_time + max_seconds

    for start in range(n):
        if time.time() >= deadline:
            break
        candidate = greedy_path(start, sim)
        candidate = two_opt(candidate, sim, deadline, TWO_OPT_PASSES)
        cand_score = score_path(candidate, sim, score_mode)
        cand_key = tuple(candidate)
        if cand_key not in seen:
            seen.add(cand_key)
            top.append((cand_score, candidate))
        if cand_score > best_score:
            best = candidate
            best_score = cand_score

    while time.time() < deadline and random_starts > 0:
        random_starts -= 1
        if time.time() >= deadline:
            break
        candidate = list(range(n))
        rng.shuffle(candidate)
        candidate = two_opt(candidate, sim, deadline, TWO_OPT_PASSES)
        cand_score = score_path(candidate, sim, score_mode)
        cand_key = tuple(candidate)
        if cand_key not in seen:
            seen.add(cand_key)
            top.append((cand_score, candidate))
        if cand_score > best_score:
            best = candidate
            best_score = cand_score

    top.sort(key=lambda item: (-item[0], item[1]))
    return top[:max(top_results, 1)]


def main() -> None:
    original_names = [name.strip() for name in BASE_TAG_ORDER if name.strip()]
    names = normalize_names(BASE_TAG_ORDER)
    if len(names) < 2:
        print("Need at least 2 tags in BASE_TAG_ORDER.")
        return

    model = SentenceTransformer(MODEL_NAME)
    emb = model.encode(names, normalize_embeddings=True)
    sim = cosine_sim_matrix(emb)
    sim = normalize_similarity_rows(sim)

    base_order = list(range(len(names)))
    base_score = score_path(base_order, sim, SCORE_MODE)

    best = best_orders(sim, MAX_SECONDS, RANDOM_STARTS, SEED, TOP_RESULTS, SCORE_MODE)

    print(f"Base score: {base_score:0.4f}")
    for rank, (score, order) in enumerate(best, start=1):
        print(f"Result {rank} (score {score:0.4f}):")
        for idx in order:
            print(f'    "{original_names[idx]}",')


if __name__ == "__main__":
    main()
