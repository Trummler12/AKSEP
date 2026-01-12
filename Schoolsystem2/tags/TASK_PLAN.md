# Task Plan: [AKSEP] Tag strategy research (1/1)

## Mode & Score
Mode: plan-gate, Score: 4 (classifier: reasons touches >2 files, adds new file, no tests cover doc changes)

## Task Scope Paths
- Schoolsystem2/tags/**
- Schoolsystem2/tags/TASK_PLAN.md
- Schoolsystem2/tags/TASK_DOCS.md

## Scope (verbatim)
Wir arbeiten in C:\Users\tnu01\Desktop\ProgrammierZeugs\AKSEP\Schoolsystem2\tags.
Unsere Aufgabe: Wir haben in Schoolsystem2\tags\testing\data\t_topic_PLANNING.csv eine Sammlung an über 2000 akademischen Disziplinen und wollen in Schoolsystem2\tags\testing\data\t_tag_PLANNING.txt eine Sammlung an Tags definieren (allerhöchstens 200 an der Zahl, lieber 50 bis 100), welche möglichst sinnvoll den Disziplinen zugewiesen werden sollen.
Mit Blick auf einen Use-Case (welcher wiederum ausserhalb unseres Scopes liegt):
Später soll man im Frontend des Projekts per Freitext seine Interessen beschreiben können; Dieser Interessensbeschreibung soll dann per Embedding Tags zugewiesen werden mit jeweils einer Gewichtung, wie sehr dieser Tag tatsächlich passt. Aus der Übereinstimmung der Tags eines Topics und den Interessens-Tags (unter Aufsummierung des Produkts der Gewichte übereinstimmender Tags) ergibt sich dann für jedes Topic einen Tag-Übereinstimmungs-Score. Die Top 300 Topics mit dem jeweils höchsten Tag-Übereinstimmungs-Score werden dann nochmals spezifisch per Embedding mit der Interessens-Beschreibung abgeglichen, woraus sich dann ein finaler Übereinstimmungs-Score ergibt.

Ich hab' bereits GPT-5.2 gefragt "What might be a good way to assign Tags to Academic Disciplines via Embeddings?"; Seine Antwort (wobei ihm an diesem Punkt sehr viel wichtiger Kontext gefehlt hat) findest du in Schoolsystem2\tags\Tag_Strategy.md.

Mein Auftrag an dich:
0. Eröffne via Schoolsystem2\tags\TASK_PLAN.md ein Plan-Gate.
1. Analysiere & evaluiere die Antwort von GPT-5.2 unter Abgleich unserer hiesigen Hardware-Limitationen und untertütze dies mit ausgiebigen Web-Recherchen. 
2. Evaluiere die vielversprechendsten Strategien, die uns zur Verfügung stehen, um das mit den Tags und allem drum herum umzusetzen
=> Dokumentiere alles Wichtige in unserer Schoolsystem2\tags\Tag_Strategy.md (du darfst gerne auch erwägen, überholte Abschnitte zu aktualisieren oder gar zu entfernen). Nimm dir für die Planungs- und Recherche-Phase gerne so viel Zeit wie möglich.
3. Wir besprechen im Anschluss, für welche Umsetzungs-Strategie wir uns entscheiden wollen, worauf ich Dich dann mit der Umsetzung beauftragen werde

PS: In Schoolsystem2\tags\testing\tag_redundancy_demo.py findest du ein Test-Script für Embedding-Score-Analysen; Du darfst dieses Script bei Interesse gerne laufen lassen
**Scope-Hash**: `b665eb37faff9c668ddc2f3fac3856ad7c609fbb844314b7dbb82dd30dc06ee7`

## Discovery
- Problem Statement: Define a compact tag set (<=200, ideally 50-100) that can be assigned to ~2000 academic disciplines for embedding-based matching, grounded in local hardware limits and research-backed strategies.
- Context & Constraints: Planning-only phase; docs edits; web research required. Hardware limits: CPU i5-6500T (4C/4T), 8 GB RAM, Intel HD 530 GPU, disk budget <= 1 GB, one-off runtime up to ~12h.
- Existing Signals:
  - Schoolsystem2/tags/Tag_Strategy.md: contains GPT-5.2 answer; visible mojibake suggests encoding mismatch in current file content.
  - Schoolsystem2/tags/testing/data/t_tag_PLANNING.txt: only header present (tagID,name,synonyms); no tags yet.
  - Schoolsystem2/tags/testing/data/t_topic_PLANNING.csv: ~2000 topics; columns include topicID, lang, name, typeID, layer, description, version, url; top rows show broad disciplines (music, performing arts, etc.).
  - Schoolsystem2/tags/testing/tag_redundancy_demo.py: uses sentence-transformers/paraphrase-multilingual-mpnet-base-v2; default OVERRIDE_WITH_SAMPLE=True; can load tags/topics from CSV and analyze redundancy and topic-tag similarity.
  - Baseline note: user confirmed existing files under Schoolsystem2/tags/ are baseline and may remain during planning.
  - Research signals:
    - OECD Fields of Science and Technology (FOS) is a classification for scholarly/technical fields (OECD; revised FOS). Source: Wikipedia summary.
    - ACM Computing Classification System (CCS) is a subject classification system for computing, comparable to MSC, used by ACM journals. Source: Wikipedia summary.
    - ISCED is a UNESCO statistical framework for organizing education information. Source: Wikipedia summary.
    - Sentence-Transformers model cards: all-MiniLM-L6-v2 produces 384-dim embeddings (English), paraphrase-multilingual-mpnet-base-v2 produces 768-dim embeddings (multilingual).
  - Control-path @codex scan: only policy references found (AGENTS.md and TASK_PLAN.md); no actionable instructions.
- Unknowns & Questions:
  - U1: What are the concrete hardware limits (CPU/GPU model, RAM, storage, runtime constraints)? Status: answered
  - U2: Preferred language for tags (EN/DE/mixed) and desired granularity? Status: answered (English; consider 3 versions: broad, medium, fine)
  - U3: Any constraints on embedding model choice (local-only, license, GPU-required)? Status: deferred
  - U4: Is a controlled vocabulary allowed to be partly derived from existing taxonomies (e.g., OECD, UNESCO, ACM CCS)? Status: answered (allowed if improves quality)
- Options (to evaluate in Tag_Strategy.md):
  - A) Taxonomy-derived tag sets (FOS/ISCED/ACM CCS) mapped to topics, possibly pruned to 50-200 tags.
  - B) Embedding-first tag discovery: cluster topics, label clusters, then curate tags.
  - C) Hybrid: seed tags from taxonomy + expand with embedding-guided suggestions and manual pruning.
  - D) Multi-resolution tag sets (broad/medium/fine) built from a shared hierarchy.
- Evidence links (if any): see `TASK_DOCS.md#discovery-20260112`
Status: READY

## Planning
- Decision: Produce a comparative strategy update in Tag_Strategy.md, grounded in sources and constrained by hardware, with a recommended shortlist for the later implementation phase.
- Impact on Scope/Steps/Checks/Risks: Scope remains docs-only; steps updated to include web-source citations, evaluation of GPT-5.2 answer, and concrete strategy alternatives.
- Prompt override: Pre-approval git status is not clean due to pre-existing baseline files inside Schoolsystem2/tags/; proceeding per user confirmation and recording in TASK_DOCS.
- Acceptance Criteria:
  - Tag_Strategy.md summarizes GPT-5.2 guidance with corrections and context.
  - Tag_Strategy.md documents hardware constraints and their impact on model choices and runtime.
  - At least 3 strategies are evaluated (pros/cons, risks, expected effort).
  - Sources are cited for taxonomy references and model characteristics.
- Test Strategy: Manual verification only (documentation update).
- Risks & preliminary Rollback: Risk of overfitting to imperfect taxonomies or overly broad tags; rollback by reverting doc changes.
- Links (if any): `TASK_DOCS.md#planning-20260112`
- Step Granularity: If steps are coarse, split into atomic edits
Status: READY

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 4)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed) — overridden by user-confirmed baseline files in Schoolsystem2/tags/

## Implementation Steps (paths & anchors)
0) Plan Sync: reload `TASK_PLAN.md`; scan Developer Interactions; apply Priority & Preemption Rules
1) Schoolsystem2/tags/Tag_Strategy.md: summarize GPT-5.2 answer, note encoding issues, extract candidate ideas to evaluate
2) Web research: collect sources on taxonomy systems and embedding model characteristics under local hardware constraints
3) Schoolsystem2/tags/testing/data/t_topic_PLANNING.csv: sample distributions (breadth, layers, naming patterns)
4) Schoolsystem2/tags/testing/data/t_tag_PLANNING.txt: define candidate tag list structure (columns, format)
5) Schoolsystem2/tags/testing/tag_redundancy_demo.py: document how to use it for redundancy checks and thresholding
6) Schoolsystem2/tags/Tag_Strategy.md: update strategy options, constraints, and recommendations with citations and multi-resolution tag plan
7) Final @codex Sweep: scan touched/new files plus Control Paths for @codex; update Developer Interactions until clear

## Developer Interactions
- [x] AGENTS.md: policy references to @codex (lines 42, 116, 130, 155, 211, 223, 225, 229, 231, 236, 324, 327, 331, 481, 483, 484, 487, 494, 496, 498, 502, 504, 507, 509, 510) - no action required
- [x] Schoolsystem2/tags/TASK_PLAN.md: policy references to @codex (lines 43, 75, 89, 92) - no action required
- [x] TASK_PLAN.md: policy references to @codex (lines 43, 56) - no action required

## Checks & Pass Criteria
- Manual Verification: documentation updated with strategy evaluation and cited sources

## Risks / Rollback
- Risk: Strategy assumptions might be invalid without hardware constraints
- Rollback: revert updated docs via git
