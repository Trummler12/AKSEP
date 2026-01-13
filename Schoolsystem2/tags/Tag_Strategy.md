# Tag Strategy

## Scope
- Build a tag vocabulary for ~2000 academic disciplines.
- Tag count: hard cap 200; preferred 50-100.
- Language: English only.
- Later use-case (out of scope here): user free-text interests -> tag weights -> topic matching.

## Constraints (hardware)
- CPU: Intel i5-6500T (4C/4T), RAM: 8 GB, GPU: Intel HD 530.
- Disk budget: <= 1 GB for the whole workflow.
- Runtime: up to ~12h for one-off runs; much lower for repeated runs.

## Inputs
- `testing/data/t_topic_PLANNING.csv`: topics with columns: topicID, lang, name, typeID, layer, description, version, url.
- `testing/data/t_tag_PLANNING.txt`: planned tag list with header `tagID,name,synonyms` (currently empty).

## Summary of GPT-5.2 answer (cleaned)
Key ideas from the prior response:
- Treat this as semantic routing into a fixed taxonomy.
- Create richer texts for topics and tags (name, synonyms, scope, example phrases).
- Use multiple anchors per discipline and average to a centroid.
- Assign tags by cosine similarity plus thresholds for "unknown" or ambiguous cases.
- Allow multi-label with top-k or soft weights.
- Improve with a small gold set and lightweight classifiers.
- Evaluate with proper metrics and a review loop; consider a coarse-to-fine hierarchy.

## Evaluation vs constraints
Strengths:
- The centroid + multi-label approach fits the later scoring use-case.
- Thresholding and a review bucket reduce bad assignments.
- A small gold set can improve quality without heavy models.

Constraints and adjustments:
- With 8 GB RAM and no discrete GPU, prefer smaller embedding models and short texts.
- Cache embeddings to disk to avoid recomputation on repeated runs.
- Avoid building large multi-anchor profiles for every topic unless needed.
- Use English-only models unless the data is multilingual.

## Strategy options (to implement later)
### A) Taxonomy-first (seed tags from standards)
Use an established field taxonomy to define the base tag list, then prune and merge.
Pros: stable, interpretable, and consistent; easier to explain.
Cons: may be too coarse or too academic; gaps for modern/interdisciplinary topics.
Notes: OECD Fields of Science and Technology (FOS) is explicitly a field classification. ACM CCS can enrich computing areas. ISCED is about education program classification and may be less aligned to disciplines.

### B) Embedding-first (cluster and label)
Embed topic names/descriptions, cluster them, then label clusters into tags.
Pros: data-driven; adapts to the actual topic set.
Cons: labels are subjective; clusters can be noisy; manual cleanup required.

### C) Hybrid (taxonomy seed + embedding expansion)
Start with taxonomy seeds (A), then expand/merge based on embedding similarity and redundancy checks.
Pros: balanced structure plus data-driven coverage.
Cons: still requires manual curation to hit the 50-200 tag target.

### D) Multi-resolution tag sets
Create three tag lists from a shared hierarchy:
- Broad (12-20 tags): coarse routing.
- Medium (50-100 tags): default target.
- Fine (150-200 tags): optional, for detailed matching.
This supports experimentation without redoing the whole pipeline.

## Embedding model options (CPU-friendly)
- `all-MiniLM-L6-v2`: 384-dim English model; lightweight and fast.
- `paraphrase-multilingual-mpnet-base-v2`: 768-dim multilingual model; heavier but supports non-English text.
Given English-only tags and modest data size, start with `all-MiniLM-L6-v2` and only move to the multilingual model if topic text quality suffers.

## Recommended path (proposal for later implementation)
1) Build a draft tag list via Strategy C (hybrid):
   - Seed from FOS and add computing detail from ACM CCS where needed.
   - Keep tags in plain English and normalize naming (singular nouns).
2) Generate embeddings for tags and topics (name + short description only).
3) Run redundancy checks to merge or drop near-duplicate tags.
4) Create three tag tiers (broad/medium/fine) mapped to the same hierarchy.
5) Sample 50-100 topic-tag pairs for a small gold set to tune thresholds.

## Granularity risk (false negatives) and your concern
Your concern: finer tags may bias the tag scores toward surface keywords
(e.g., "biochemistry" -> "chemistry" dominates "biology"), causing false
negatives in the prefilter when tags get too specific.

Assessment: the risk is real, but it is mostly a calibration issue rather than
an inherent reason to avoid finer tags. It shows up when:
- The tag text is too short or too literal (single tokens).
- Scoring is unnormalized and single-word overlap dominates.
- The tag set is imbalanced (many narrow tags under one area, few under another).

Mitigations that typically work better than ad-hoc score corrections:
- Use short tag definitions (1-2 lines) plus synonyms. This reduces keyword
  dominance in embeddings and helps "biology" anchor to biological context.
- Use multi-tag assignment for topics (top-k with a minimum similarity floor).
- Use a coarse-to-fine routing: compute scores against broad tags first, then
  only compare fine tags within the top coarse buckets.
- Normalize scores within each top-level area (hierarchical gating) rather than
  across all tags.

## About the proposed correction factors
Idea A: per-tag correction factor = (best similarity below 0.98), then divide
each tag score by that factor.
Risk: this inflates tags that are globally "blurry" (low max similarity) and
can increase false positives by overcompensating weak tags. It also depends
heavily on one extreme score, which is noisy.

Idea B: exponentiate by (tag total similarity sum / median sum).
Risk: this tends to amplify popular tags and compress niche ones, which is the
opposite of what you want for recall. It also makes the score distribution
hard to interpret.

Recommendation: treat these ideas as research probes, not defaults. If you want
normalization, prefer:
- z-score or min-max normalization per top-level bucket, or
- temperature-scaled softmax on top-k tags per topic (stable and interpretable).

## Pareto-friendly baseline (likely sufficient)
Given only ~2200 topics and CPU constraints, a simple baseline can already work:
1) Use medium tag tier (50-100).
2) Embed tag definitions + synonyms (not just names).
3) Assign top-k tags per topic (k=3..5) with a low similarity floor.
4) At query time, embed the interest text and compute top-k tags for the query.
5) Compute a tag overlap score (sum of products of weights).
This is cheap, interpretable, and often good enough for a 10-15% prefilter.

If recall is still too low, add coarse-to-fine routing rather than complex
score correction. Coarse-to-fine reduces false negatives without heavy models.

## Use-case alignment (prefilter quality)
Goal: minimize false negatives in the prefilter before the final embedding step.
Operational guidance:
- Favor recall: low thresholds, allow multi-label, and keep k slightly larger.
- Use a broad tier for initial gating and a medium tier for scoring.
- Keep tags balanced across major fields to avoid over-dominant clusters.

## V1 evaluation summary (2026-01-12)
Inputs:
- 85 tags (medium tier), simplified to avoid compound tags where possible
  (e.g., "industrial engineering" -> "industry" + "engineering").
- Model: paraphrase-multilingual-mpnet-base-v2.
- Queries: 8 multi-domain example descriptions.
- Redundancy check: `testing/tag_redundancy_demo.py`.
- Tag embeddings: primary name and synonyms embedded separately; per-tag score
  uses the median across variants (reduces synonym bias).
 - Synonyms are now minimal and used only for clear abbreviations or spelling
   variants (e.g., "ai" / "artificial intelligence", "theater" / "theatre").

Observed behavior:
- Prefilter candidate counts ranged from ~18 to ~131, which fits the 200-300
  target band while still leaving room for recall.
- Redundancy check flagged "medicine" vs "pharmacology" as high similarity; left
  both for now because they can still separate topics in practice.
- Some noisy candidates remain in mixed queries (expected for a recall-first
  prefilter); the final embedding step should clean these up.

Notes for v2:
- If recall drops for a particular domain, add 1-3 domain-specific tags rather
  than increasing overall tag granularity.
- Consider a lightweight broad tier only if candidate counts remain too high or
  if domain bleed-through becomes a major issue.

## Using `testing/tag_redundancy_demo.py`
Suggested settings:
- Set `OVERRIDE_WITH_SAMPLE = False` to use `t_tag_PLANNING.txt`.
- Adjust `REDUNDANCY_THRESHOLD` (e.g., 0.75-0.85) to find close tags.
- Review `TOP_SIMILAR_PAIRS` to spot near-duplicates.
- Use `TOP_TAGS_PER_TOPIC` to inspect top matches and detect missing tags.

## Open questions (for implementation phase)
- Confirm if all topic data is English only.
- Decide whether to add short tag definitions or synonyms (to improve embeddings).
- Decide which tier (broad/medium/fine) is the default for production.
- Decide whether to adopt coarse-to-fine routing as the primary recall safeguard.

## Sources
- https://en.wikipedia.org/wiki/Fields_of_Science_and_Technology (FOS classification overview).
- https://en.wikipedia.org/wiki/ACM_Computing_Classification_System (ACM CCS overview).
- https://en.wikipedia.org/wiki/International_Standard_Classification_of_Education (ISCED overview).
- https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2/raw/main/README.md (384-dim English model description).
- https://huggingface.co/sentence-transformers/paraphrase-multilingual-mpnet-base-v2/raw/main/README.md (768-dim multilingual model description).
