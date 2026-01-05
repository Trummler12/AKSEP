# Embedding model evaluation (local, long transcripts)

## Hardware limits (this laptop)
- CPU: Intel Core Ultra 7 165U (12 cores / 14 threads)
- RAM: 32 GB (reported total physical memory ~31.5 GB)
- GPU: Intel Graphics (integrated; ~2 GB reported adapter memory, shared)
- OS: Windows
- Notes: No discrete GPU detected. Expect CPU-first inference; prefer quantized weights.

## Data and task constraints
- Input per video: title + description + transcript (+ comments fallback)
- Transcript size: 300 KB typical, up to ~1 MB worst case
- 1 MB text ~= 200k-250k tokens (rough); this far exceeds common model limits (512-8192)
- Implication: chunking is mandatory; aggregate embeddings per chunk (mean/weighted), then compare to keyword embeddings ("educational", "nonsense")
- Runtime: total latency scales with token count and number of chunks; 1 MB may require dozens of forward passes

## Candidate local embedding models (research notes)

### BAAI/bge-m3
- Manufacturer: BAAI (Beijing Academy of Artificial Intelligence), China
- License: MIT (model card)
- Max input size: up to 8192 tokens (model card)
- Highlights: multilingual (100+ languages), multi-function (dense + sparse + multi-vector)
- Local fit: strong long-document retrieval focus; still requires chunking for 1 MB inputs
- Notes: Long-doc training data (MLDR) mentioned in model card; good for long text retrieval
- Links: https://huggingface.co/BAAI/bge-m3

### jinaai/jina-embeddings-v2-base-en (and v2-base-de)
- Manufacturer: Jina AI, Germany
- License: Apache-2.0 (model card)
- Max input size: up to 8192 tokens (model card)
- Highlights: long-context embeddings; good retrieval performance
- Local fit: strong long-context option for CPU; still requires chunking for 1 MB
- Gated access (Hugging Face):
  - Model is gated; you must request access and accept terms on HF.
  - Download requires login (huggingface-cli login or HF token).
  - Once weights are downloaded, offline usage is possible from local cache.
- Links: https://huggingface.co/jinaai/jina-embeddings-v2-base-en

### nomic-ai/nomic-embed-text-v1.5
- Manufacturer: Nomic AI, USA
- License: not stated in model card (verify before deployment)
- Max input size: 8192 tokens (model card table)
- Embedding dims: 768 (default) with matryoshka down-projection options (512/256/128/64)
- Highlights: long-context embedder; supports smaller vector dims for speed/memory trade-offs
- Local fit: good long-context option; requires chunking for 1 MB inputs
- Links: https://huggingface.co/nomic-ai/nomic-embed-text-v1.5

### mixedbread-ai/mxbai-embed-large-v1
- Manufacturer: Mixedbread AI, Germany
- License: Apache-2.0 (model card)
- Max input size: 512 tokens (config.json max_position_embeddings)
- Highlights: strong quality on short/medium texts; popular in MTEB
- Local fit: CPU-friendly; heavy chunking required for long transcripts
- Links: https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1

### intfloat/e5-large-v2
- Manufacturer: intfloat (org), country not specified
- License: not stated in model card (verify)
- Max input size: 512 tokens; long texts truncated (model card)
- Highlights: strong baseline for retrieval; uses "query:" / "passage:" prefixes
- Local fit: CPU ok; heavy chunking for long transcripts
- Links: https://huggingface.co/intfloat/e5-large-v2

### thenlper/gte-large
- Manufacturer: thenlper (org), country not specified
- License: not stated in model card (verify)
- Max input size: 512 tokens; long texts truncated (model card)
- Highlights: strong MTEB results for short/medium texts
- Local fit: CPU ok; heavy chunking for long transcripts
- Links: https://huggingface.co/thenlper/gte-large

### sentence-transformers/all-MiniLM-L6-v2
- Manufacturer: Sentence-Transformers community (origin: SBERT/UKP Lab)
- License: Apache-2.0 (model card)
- Max input size: 512 tokens (config.json max_position_embeddings)
- Highlights: very small and fast; good baseline for CPU
- Local fit: excellent speed; not ideal for long-document semantics
- Links: https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2

### Salesforce/SFR-Embedding-Mistral
- Manufacturer: Salesforce AI Research, USA
- License: not stated in model card (verify)
- Max input size: 4096 tokens (README usage example)
- Highlights: strong retrieval performance; instruction-formatted queries
- Local fit: larger model than BERT-style encoders; verify CPU RAM/latency
- Links: https://huggingface.co/Salesforce/SFR-Embedding-Mistral

### nvidia/NV-Embed-v2
- Manufacturer: NVIDIA, USA
- License: CC-BY-NC-4.0 (non-commercial) (model card)
- Max input size: 32768 tokens (config.json max_position_embeddings)
- Highlights: very long context; instruction-based embeddings
- Local fit: _likely GPU-focused_; access restricted on HF; probably too heavy for this laptop
- Links: https://huggingface.co/nvidia/NV-Embed-v2

## Overview table (focus on local fit)
| Model | Org / Country | Max input | Notes | Fit for 1 MB inputs |
| --- | --- | --- | --- | --- |
| **BAAI/bge-m3** | BAAI / China | **8192 tokens** | **Long-doc focus; multilingual; dense+sparse** | **Best long-context candidate; still needs chunking** |
| **jina-embeddings-v2-base-en** | Jina AI / Germany | **8192 tokens** | **Long-doc embeddings; _HF gated access_** | **Strong long-context candidate; _gated access_** |
| **nomic-embed-text-v1.5** | Nomic AI / USA | **8192 tokens** | **Matryoshka dims; long context** | **Strong long-context candidate** |
| Salesforce/SFR-Embedding-Mistral | Salesforce / USA | 4096 tokens | Large model; instruction queries | _Possible, but heavier on CPU_ |
| nvidia/NV-Embed-v2 | NVIDIA / USA | **32768 tokens** | ~~Non-commercial license~~; _HF access restricted_ | ~~Not suitable for this laptop~~ |
| mixedbread-ai/mxbai-embed-large-v1 | Mixedbread AI / Germany | ~~512 tokens~~ | High quality on short text | ~~Heavy chunking required~~ |
| intfloat/e5-large-v2 | intfloat / (unknown) | ~~512 tokens~~ | Requires "query:" / "passage:" prefixes | ~~Heavy chunking required~~ |
| thenlper/gte-large | thenlper / (unknown) | ~~512 tokens~~ | Strong baseline, short context | ~~Heavy chunking required~~ |
| sentence-transformers/all-MiniLM-L6-v2 | SBERT community / (unknown) | ~~512 tokens~~ | Very fast CPU baseline | ~~Not suited for long-doc accuracy~~ |

## Evaluation focus (deep dive candidates)
1) BAAI/bge-m3
- Verify model size, quantized weight options (GGUF/ONNX), and practical CPU speed on 8k tokens.
- Confirm multilingual quality on DE/EN transcripts.

2) jinaai/jina-embeddings-v2-base-en (and v2-base-de)
- Confirm gating requirements and offline weight availability.
- Validate CPU memory footprint and throughput for 8k token chunks.

3) nomic-ai/nomic-embed-text-v1.5
- Confirm license; test smaller embedding dims (256/512) for speed vs. quality.
- Validate chunk pooling strategy for long transcripts.

4) Salesforce/SFR-Embedding-Mistral (optional)
- Evaluate if 4k context + chunking is enough and whether CPU latency is acceptable.

## Notes on RAM / speed expectations (rough)
- CPU RAM usage depends on model size and precision. Base models typically fit in 1-4 GB RAM; larger models can exceed 8 GB.
- Throughput is roughly linear with tokens. For 1 MB inputs, expect tens of chunks (30-50 at 8k tokens) and multi-minute processing on CPU.
- A hybrid strategy (keyword filtering + selective embedding) can reduce total compute.
