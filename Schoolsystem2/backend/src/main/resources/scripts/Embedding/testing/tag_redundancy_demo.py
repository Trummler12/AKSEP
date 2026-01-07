from __future__ import annotations

from pathlib import Path
from typing import List, Tuple
import csv
import numpy as np
from sentence_transformers import SentenceTransformer


def cosine_sim_matrix(x: np.ndarray) -> np.ndarray:
    """Cosine similarity matrix for row vectors in x."""
    # Normalize rows
    norms = np.linalg.norm(x, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    x_norm = x / norms
    return x_norm @ x_norm.T


def top_pairs(sim: np.ndarray, labels: List[str], k: int = 10) -> List[Tuple[float, str, str]]:
    """Return top-k most similar distinct pairs (i<j)."""
    n = sim.shape[0]
    pairs: List[Tuple[float, str, str]] = []
    for i in range(n):
        for j in range(i + 1, n):
            pairs.append((float(sim[i, j]), labels[i], labels[j]))
    pairs.sort(key=lambda t: t[0], reverse=True)
    return pairs[:k]


def redundancy_groups(sim: np.ndarray, labels: List[str], threshold: float) -> List[List[str]]:
    """
    Simple graph-based clustering:
    connect i<->j if sim >= threshold, return connected components.
    """
    n = sim.shape[0]
    visited = [False] * n
    groups: List[List[str]] = []

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
            groups.append(sorted([labels[i] for i in component], key=str.lower))

    # Sort groups by size desc, then name
    groups.sort(key=lambda g: (-len(g), g[0].lower()))
    return groups


def load_tags_from_csv(csv_path: Path) -> List[str]:
    tags: List[str] = []
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            name = (row.get("name") or "").strip()
            if not name:
                continue
            synonyms_raw = (row.get("synonyms") or "").strip()
            if synonyms_raw:
                synonyms = [part.strip() for part in synonyms_raw.split(",") if part.strip()]
                if synonyms:
                    tags.append(f"{name} ({', '.join(synonyms)})")
                    continue
            tags.append(name)
    return tags


def main() -> None:
    # Beispiel-Tags (absichtlich mit möglichen Redundanzen)
    csv_path = Path(__file__).resolve() / "data" / "t_tag_PLANNING.csv"
    tags = load_tags_from_csv(csv_path)

    model_name = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
    model = SentenceTransformer(model_name)

    # Embeddings (normalize_embeddings=True -> cosine = dot product)
    emb = model.encode(tags, normalize_embeddings=True)

    sim = emb @ emb.T  # because normalized

    print("\nTop ähnlichste Paare:")
    for score, a, b in top_pairs(sim, tags, k=12):
        print(f"{score:0.3f}  {a}  <->  {b}")

    # Schwelle: je nach Geschmack
    # 0.80 = sehr ähnlich, 0.70 = eher großzügig (mehr False Positives)
    threshold = 0.78
    groups = redundancy_groups(sim, tags, threshold=threshold)

    print(f"\nRedundanz-Gruppen (cosine >= {threshold}):")
    if not groups:
        print("(keine Gruppen gefunden)")
    else:
        for g in groups:
            print("- " + ", ".join(g))

    # Optional: vollständige Matrix ausgeben (für kleine n)
    # print("\nSimilarity Matrix:\n", np.round(sim, 3))


if __name__ == "__main__":
    main()
