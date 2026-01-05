# Task Plan: [AKSEP] Embedding model evaluation (1/1)

## Mode & Score
Mode: plan-gate, Score: 3 (classifier: reasons touches >2 files, estimated diff >50 LOC)

## Task Scope Paths
- AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/**
- AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/Embedding.md
- AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_PLAN.md
- AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_DOCS.md

## Scope (verbatim)
Alles klar, dann ist unser System diesbezüglich soweit auf einem sauberen Basis-Zustand;
Nun, ich habe folgenden Use-Case:
Wir haben in AKSEP\Schoolsystem2\backend\src\main\resources\csv\youtube\videos_transcripts.csv Transcripte von YouTube-Videos;
Ich möchte zu jedem Video die Embedding-Distanz ermitteln zwischen (Titel + Beschreibung + Transcript + (als Fallback) Kommentare) und "educational"; Hiermit will ich bestimmen, wie hoch der geschätzte pädagogische Mehrwert des Videos ist; Ebenso will ich auf diese Weise auch die Distanz zu "nonesense" ermitteln, um poisoned/korrumpierte Transcripts zu identifizieren.
Nun möchte ich gerne herausfinden, welche lokalen KI-Modelle hierfür infrage kommen könnten - abhängig von den Hardware-Kapazitäten dieses Laptops hier und in Anbetracht dessen, dass manche Transcripts bis zu 300KB gross sein können (zu rechnen sind im Extremfall Grössen von bis zu 1MB).
Die Umsetzung hiervon ist an dieser Stelle NICHT von Belang, sondern lediglich die theoretische Planung, die Evaluation der hierfür geeignetsten lokale Modelle, etc.
Mein Auftrag an dich ist nun:
0. Als Teil eines grösseren Projectes bitte ich dich, im Zuge dieser Konversation ein Plan-Gate in AKSEP\Schoolsystem2\docs\Data_Flow\Object_Processing drin zu eröffnen (bitte ausdrücklich NICHT ausserhalb hiervon, da wir im Projekt noch weitere KI-Agenten, deren Aufgabenbereiche wir NICHT durcheinanderbringen möchten)
1. Nutze AKSEP\Schoolsystem2\docs\Data_Flow\Object_Processing\Embedding.md zur Dokumentation aller für uns relevanten Informationen, die du in Erfahrung bringen kannst (du erhältst alle Schreib- und Webzugriffs-Berechtigungen die du hierfür benötigst; Hinweis: AKSEP\Schoolsystem2\docs\Data_Flow\Object_Processing\Abstract.md ist reserviert für einen ähnlichen Use-Case, mit welchem wir jedoch später erst uns auseinandersetzen wollen)
1a. Notiere ganz oben unsere Hardware-Limitierungen (Informationen zu diesem Gerät, die für die Wahl des geeignetsten lokalen KI-Modells von Relevanz sein dürften)
1b. Starte eine ausgiebige Recherche zu lokalen KI-Modellen, welche für den angesprochenen Use-Case (Ermittlung der Embedding-Distanz eines bis zu 1MB langen Inputs und einem Schlagwort) infrage kommen könnten und notiere so viele potentiell relevante Informationen wie möglich. Wichtige Informationen können sein: Hersteller (ALLE Ebenen), Herstellungsland, Speicherbedarf, RAM-Verbrauch, maximale Input-Grösse, Dauer bis zur Antwort (ggb. in Abhängigkeit zu Input-Grösse und/oder anderen Grössen), Accuracy, etc. - Verfasse zu jedem Modell eine kurze Bewertung
1c. Sobald wir eine Sammlung vorliegen haben der wichtigsten Informationen zu infrage kommenden lokalen Embedding-Modellen kannst du eine Übersichts-Tabelle anfertigen zu den wichtigsten Werten zu jedem Modell, wo wir Ausschluss-Faktoren ~durchgestrichen~, potentielle Ausschluss-Faktoren _kursiv_ und wo ein Modell SEHR gut abschneidet **fett** markieren können. Plane hierzu *unter* der Tabelle einen Evaluations-Abschnitt, wo wir die vielversprechendsten Kandidaten NOCH ausgiebiger unter die Lupe nehmen
**Scope-Hash**: `5203db8a8fa7e45a018c6feccf4d7eadc337888647222314e828456fdac0f505`

## Discovery
*(Use only what applies; omit bullets that are not relevant.)*
- Problem Statement: Identify local embedding models suitable for long inputs (up to ~1MB) and document selection criteria in Embedding.md.
- Context & Constraints: Windows laptop; inputs can be 300KB-1MB; offline/local preference; output is documentation only; user allows web research but network is restricted in this environment.
- Existing Signals: Embedding.md exists but is empty; transcripts live at AKSEP/Schoolsystem2/backend/src/main/resources/csv/youtube/videos_transcripts.csv.
- Existing Signals: @codex scan completed; no scoped @codex instructions found in AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing (scan logged, minor rg glob error for *.code-workspace).
- Unknowns & Questions (U1...Un) -- Status: deferred
  - U1: Required latency per video (seconds/minutes) and acceptable throughput?
  - U2: Must the model handle multilingual transcripts or only DE/EN?
  - U3: Are embeddings compared on full-text (needs chunking) or allowed to aggregate chunk vectors?
  - U4: Is GPU acceleration required/available beyond Intel integrated graphics?
- Options (A/B/...):
  - A) Long-context embedding model with chunking + pooled embedding (best fit for 1MB inputs).
  - B) Standard embedding model + aggressive chunking + keyword pooling (lower compute, lower recall).
- Evidence links (if any): see `TASK_DOCS.md#discovery-<YYYYMMDD>`
Status: READY

## Planning
*(Use only what applies; omit bullets that are not relevant.)*
- Decision: Build a documented shortlist of local embedding models, focusing on long-context and efficient CPU options, then summarize in Embedding.md with a comparison table and evaluation section.
- Impact on Scope/Steps/Checks/Risks: No code changes; only documentation in Embedding.md plus TASK_DOCS.md; manual verification only.
- Acceptance Criteria (verifiable):
  - Embedding.md starts with hardware limits for this laptop.
  - Embedding.md includes a researched list of candidate embedding models with short evaluations.
  - Embedding.md includes a comparison table with required formatting cues and an evaluation section under the table.
- Test Strategy: Manual verification of Embedding.md content and structure.
- Risks & preliminary Rollback: Research data may be outdated or incomplete; rollback via git revert.
- Links (if any): `TASK_DOCS.md#planning-<YYYYMMDD>`
- Step Granularity: Steps are per-file and anchored to Embedding.md sections.
Status: READY

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 3)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
> Notes:
> - No research/plan meta-tasks here -- Discovery/Planning above must be complete before approval.
> - If Discovery/Planning changed understanding, synchronize and (re)split these steps into small atomic edits (per file + anchor/range) before requesting approval.

**Priority & Preemption Rules (global order)**
- Global order: Priority @codex (tagged URGENT|IMPORTANT|NOTFALL|SEV1 or safety/secret/security) > finish current atomic step > regular @codex > start next step.
- Immediate preemption (may interrupt the current step) only if:
  1) the @codex item has a priority tag (see above), or
  2) it directly impacts the current step paths/anchors, or
  3) it concerns safety/secrets/security.
  When interrupting, switch at a safe boundary (e.g., after the current edit/test/run completes) to avoid corrupting state.
- Regular @codex: after finishing the current step, but before starting the next, process the queue in Developer Interactions (FIFO; bump items that touch the next step's files).
- If a non-priority item arrives mid-step and does not impact the current step, enqueue it; you will handle it after finishing the step and before the next step.
- The Final @codex Sweep is a safety net after all steps.

0) Plan Sync: reload TASK_PLAN.md; scan Developer Interactions and apply the Priority & Preemption Rules (process the regular queue now before Step 1).
1) AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/Embedding.md: top-of-file => document hardware limits and constraints for model sizing.
2) AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/Embedding.md: research section => list candidate embedding models with evaluations.
3) AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/Embedding.md: comparison table + evaluation section => summarize candidates and highlight exclusions.
4) AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/TASK_DOCS.md: task summary => note prompt override and checks.
N) Final @codex Sweep: scan all touched/new files plus Control Paths for @codex comments; append items to Developer Interactions; resolve until none remain.

## Developer Interactions
- [ ]

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Open `AKSEP/Schoolsystem2/docs/Data_Flow/Object_Processing/Embedding.md` and confirm hardware limits + model list + table + evaluation section are present

## Risks / Rollback
- Risk: Research data outdated; hardware limits missing key constraint
- Rollback: git revert <sha>
