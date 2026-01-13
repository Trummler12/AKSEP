# Task Plan: [AKSEP] Tagging pipeline v1 (1/1)

## Mode & Score
Mode: plan-gate, Score: 7 (classifier: reasons touches >2 files, cross-file coupling, adds scripts/new files, estimated diff >50 LOC)

## Task Scope Paths
- Schoolsystem2/tags/**
- Schoolsystem2/tags/TASK_PLAN.md
- Schoolsystem2/tags/TASK_DOCS.md

## Scope (verbatim)
Sehr gut! Dann lass uns nun loslegen, eine erste Version umzusetzen!
Ziel dieser Phase:
- Eine erste sinnvolle Liste an Tags (=> Schoolsystem2\tags\testing\data\t_tag_PLANNING.txt)
- Eine erste sinnvolle sinnvolle Zuweisung von Tags => Topics (=> Schoolsystem2\tags\testing\data\ct_topic_tags_PLANNING.csv.txt)
- Erste Testläufe: Beispiel-Interessensbeschreibungen (gerne jeweils mehrere Interessensgebiete simultan abdeckend) => ... => Vorfilterung => Direkt-Abgleich von Kandidaten mit den Interessensbeschreibungen => Log-File mit den Ergebnissen => Evaluieren, Adjustieren, Ansätze bewerten, ggb. eine Version 2 planen um Schwachstellen zu addressieren

Scripte können nach Belieben in Schoolsystem2\tags\testing erstellt werden;
Gerne darfst du die bestehenden Inhalte umstrukturieren, um beispielsweise nach Version zu trennen (was auch immer der Übersichtlichkeit und Wartbarkeit zugute kommt)
**Scope-Hash**: `d24d84cc15c5187861b8dc2b5d947b3e9a7d20ff5d1c00b0e87aaf37f40d22e2`

## Discovery
- Problem Statement: Produce a v1 tagging pipeline with a tag list, topic-tag assignments, and test runs to evaluate prefilter quality for interest-text queries.
- Context & Constraints: Local CPU-only machine (i5-6500T, 8 GB RAM); disk budget <= 1 GB; one-off runtime up to ~12h; English-only tags; preference for recall in prefilter to avoid false negatives.
- Existing Signals:
  - `Schoolsystem2/tags/testing/data/t_topic_PLANNING.csv`: ~2200 topics with names and descriptions.
  - `Schoolsystem2/tags/testing/data/t_tag_PLANNING.txt`: target tag list (CSV-like header).
  - `Schoolsystem2/tags/testing/tag_redundancy_demo.py`: embedding-based redundancy helper.
  - `Schoolsystem2/tags/Tag_Strategy.md`: updated strategy, mitigation notes, and baseline.
  - Baseline note: user confirmed existing files under Schoolsystem2/tags/ are baseline and may remain during planning.
- Unknowns & Questions:
  - U1: Should tag list start at medium tier only (50-100), or include broad + medium now? Status: answered (medium-only for v1)
  - U2: Target embedding model for this v1 run (MiniLM vs mpnet)? Status: answered (use mpnet for tags/topics/queries to keep a shared embedding space; hybrid model mixing breaks similarity comparability)
  - U3: Expected log format and evaluation criteria? Status: answered (readable text log)
- Options:
  - A) Medium-only tag list + direct tag assignment (simple baseline).
  - B) Broad + medium with coarse-to-fine gating for higher recall.
  - C) Medium-only but with topic-tag assignment via descriptions (more context).
- Evidence links (if any): see `TASK_DOCS.md#discovery-20260112`
Status: READY

## Planning
- Decision: Implement a v1 tagging pipeline using a medium-tier tag list (50-100) only, with scripts to generate assignments and readable evaluation logs. Use `paraphrase-multilingual-mpnet-base-v2` for tags, topics, and interest-text embeddings to keep a single shared vector space; avoid hybrid mixing across steps.
- Impact on Scope/Steps/Checks/Risks: Will add/update data files and scripts under `Schoolsystem2/tags/testing/`; run local scripts; write logs for evaluation.
- Acceptance Criteria:
  - `t_tag_PLANNING.txt` contains 50-100 English tags (plus synonyms where useful).
  - `ct_topic_tags_PLANNING.csv.txt` contains topic-tag assignments with weights.
  - One or more test runs logged with interest-text queries and resulting top topics.
  - Short evaluation notes with adjustments or v2 plan.
  - Clear decision on whether hybrid embeddings (different models for tags/topics vs queries) is acceptable.
- Test Strategy:
  - Run local script(s) to generate assignments and logs.
  - Manual review of log outputs for sanity and recall.
- Risks & preliminary Rollback:
  - Risk: tags too coarse or too narrow; rollback by reverting data files and scripts.
- Links (if any): `TASK_DOCS.md#planning-20260112`
- Step Granularity: If steps are coarse, split into atomic edits
Status: READY

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 7)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed) — overridden by user-confirmed baseline files in Schoolsystem2/tags/

## Implementation Steps (paths & anchors)
0) Plan Sync: reload `TASK_PLAN.md`; scan Developer Interactions; apply Priority & Preemption Rules
1) Schoolsystem2/tags/testing/data/t_tag_PLANNING.txt: define v1 tag list (50-100), add synonyms where useful
2) Schoolsystem2/tags/testing/scripts/tag_assign_v1.py: generate topic-tag assignments with weights
3) Schoolsystem2/tags/testing/data/ct_topic_tags_PLANNING.csv.txt: output assignments from v1 script
4) Schoolsystem2/tags/testing/scripts/eval_queries_v1.py: run interest-text examples and log outputs
5) Schoolsystem2/tags/testing/logs/tag_eval_v1.txt: capture evaluation results and notes
6) Schoolsystem2/tags/Tag_Strategy.md: add v1 evaluation summary and v2 adjustments (if needed)
7) Final @codex Sweep: scan touched/new files plus Control Paths for @codex; update Developer Interactions until clear

## Developer Interactions
- [x] No actionable @codex directives found in scan.

## Checks & Pass Criteria
- Manual Verification:
  - [x] Run v1 tag assignment script to produce `ct_topic_tags_PLANNING.csv.txt`
  - [x] Run v1 eval script to produce `tag_eval_v1.txt`
  - [x] Review log for recall issues and record adjustments

## Risks / Rollback
- Risk: tag list or weighting leads to low recall in prefilter
- Rollback: revert new data files and scripts via git
