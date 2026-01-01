# Task Plan: [AKSEP] Disciplines to Topics planning (1/1)

## Mode & Score
Mode: plan-gate, Score: 6 (classifier: reasons touches >2 files, cross-file coupling, no tests, diff >50 LOC)

## Task Scope Paths
- Schoolsystem2/backend/src/main/resources/csv/topics/**
- Schoolsystem2/backend/src/main/resources/scripts/topics/**
- Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md
- Schoolsystem2/backend/src/main/resources/csv/topics/TASK_DOCS.md

## Scope (verbatim)
Ich habe mir nochmals etwas Gedanken gemacht ?ber den Dataflow und dies nun in unserer Schoolsystem2/docs/Data_Flow/Data_Flow.md#provisional-data-flow-description (ab Zeile 950) fertig dokumentiert f?r unseren topic-bezogenen Flow; Und ich muss an dieser Stelle sagen: Die Branches of Science an dieser Stelle versuchen zu wollen, zu integrieren, bereichert unsere Datensets wahrscheinlich nicht mehr allzu viel, allzu sehr. Wir haben bereits ?ber 2500 akademische Disziplinen erfasst, die wir nun sauber in Topics ?bersetzen k?nnen. Und angesichts dessen, wie viel Redundanz offenbar besteht zwischen den Branches of Science und den akademischen Disziplinen (auf Basis der ersten 170 Pr?fungen), so werden wahrscheinlich kaum mehr als 100 weitere Topics dazukommen k?nnen. Zudem wird es wahrscheinlich auch noch sehr umst?ndlich sein, ein System zu entwickeln, um die tats?chlich nicht redundanten Branches irgendwie automatisiert integrieren zu k?nnen, wof?r sich der Aufwand einfach hinten und vorne nicht lohnt, wenn man bedenkt, wie kompliziert das potenziell sein wird. Also w?rde ich daher behaupten, dass sich dieser Aufwand Stand jetzt hinten und vorne nicht lohnt. Deswegen k?nnen wir das auf irgendwann in ferner Zukunft verschieben und uns nun darum k?mmern, das, was wir nun in den Disciplines.csv haben, in unsere t_topic_PLANNING.csv zu ?bersetzen und dabei in eine ?hnliche Form zu bringen, wie wir es, wie ich es damals f?r die Branches of Science getan habe (siehe AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\t_topic_PLANNING_LEGACY.csv f?r das damalige Ergebnis). Und ja, damit werden wir die Branches of Science, die bislang als Vorlage gedient hatten f?r die Topics, vollst?ndig durch die akademischen Disziplinen ersetzen. Mein Auftrag an dich ist nun, schau dir an, wie die Branches of Science auf Basis der Spreadsheet-Formeln in Topic-Datens?tze ?bersetzt worden waren und erarbeite darauf basierend ein Skript, welches nach ?hnlicher Logik funktioniert. Namentlich soll das Skript, ?hnlich wie auch damals im Spreadsheet umgesetzt (siehe AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\Spreadsheet_Formulas.md), wie folgt vorgehen:
1. alle Disciplines-Datens?tze einlesen
2. Da die Disciplines-Eintr?ge innerhalb ihrer Geschwister offenbar alle bereits von Haus aus alphabetisch sortiert sind, braucht das Script hier einzig nach Layer aufsteigend sortieren
3. Ignoriere alle Eintr?ge mit layer=0
4a. topicID = (siehe AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\Spreadsheet_Formulas.md#t_topica-topicid)
4b. lang = en; name = Disciplines.name; typeID = SIEHE_UNTEN*, layer = Disciplines.layer; description = Disciplines.description; version=1; url = Disciplines.url
*An dieser Stelle ist mir aufgefallen, dass wir in unserer AKSEP\Schoolsystem2\backend\src\main\resources\scripts\topics\restructure_disciplines_csv.py (mit AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\Disciplines_restructured.csv als Output) die Bestimmung des Typs etwas ausbauen m?ssen; Momentan unterscheiden wir lediglich zwischen "S" (Subject), "T" (Technical Subject) und "P" (Practical Subject), wof?r wir zum einen grunds?tzlich noch zu wenig Rechnung tragen, zum anderen brauchen wir noch einen Indikator f?r "General" (Grundlagen-Topic); Hierf?r hab' ich folgenden Vorschlag: Per Default gelte (f?r Disciplines_restructured): `type=concat(layer==0?"":"S";layer==1?"0":"")`; Und alles, was davon abweicht, soll manuell ?berschrieben werden; So brauchen wir ein Array aller (keys von) Disciplines, die Grundlagenf?cher sein sollen, *obwohl* diese NICHT auf Layer 1 anzusiedeln sind (Was der Fall sein soll f?r: Sociology, Economics, Political science, Statistics, Astronomy und Technology); In diesem Falle m?sste `layer==1?"0":""` erweitert werden zu `(layer==1||key in general)?"0":""` oder so in der Art; Ebenfalls explizit jeweils ?ber ein Array erfasst werden m?ssen: T) "Technical Subjects": Disciplines, die auch auf theoretischer Ebene grunds?tzlich nicht sinnvollerweise ohne nicht-triviales Equipment auskommen k?nnen (`natural-science.physics.technology.robotics,Robotics` beispielsweise, sowie auch viele andere (aber nicht zwangsweise ALLE!) Technology-Disciplines); P) "Practical Subjects": Disciplines, die auch auf theoretischer Ebene grunds?tzlich nicht sinnvollerweise ohne Mitwirken anderer Personen und/oder der Bereitstellung Aktivit?ts-spezifischer ?rtlichkeiten (z.B. einer B?hne) auskommen k?nnen (`humanities.music,Music` erf?llt diese Bedingungen NOCH NICHT, da man Musik gunds?tzlich auch ohne Mitwirken anderer Personen und ohne bereitgestellte ?rtlichkeiten ohne die Theorie dahinter lernen und ohne signifikante Abstriche sogar auch praktizieren kann; `humanities.performing-arts.dance,Dance` dagegen ist schon viel eher darauf angewiesen, mit anderen Menschen interagieren (alleine schon f?r subjektives Feedback) und die Theorie mit praktischen Einheiten erg?nzen zu k?nnen - Zwar kann man auch hier noch anbringen, dass f?r den Aufbau eines theoretischen Verst?ndnisses zum Tanzen weder Interaktionen mit anderen Menschen noch bereitgestellte ?rtlichkeiten *zwangsweise* vonn?ten sein *m?ssen*, aber f?r unsere Bewertung seien die Praktischen Komponenten hier schon ausreichend signifikant, um `humanities.performing-arts.dance,Dance` als "P" ("Practical Subject") deklarieren zu k?nnen).
"Technical Subject" (T) soll ?brigens stets Priorit?t haben ?ber "Practical Subject" (P), da jedes "Technical Subjects" implizit *auch* praktisch ist ("Practical Subjects" ist implizit ein Superset von "Technical Subjects")
Ach ja, fast vergessen: Sobald ^dies soweit steht, erfolgt die Zuweisung von Disciplines.type => topic.typeID wie folgt (anhand unserer AKSEP\Schoolsystem2\backend\src\main\resources\csv\t_topic_type.csv): _0 => 0 (General Subject), S => 1 (Specialization), T => 2 (Technical Subject), [Aus Achievements.csv] => 3 (Achievement), P => 6 (Practical Subject)
Auftrag an dich:
0. Mach dir ausgiebig Gedanken dar?ber, wie wir am besten vorgehen sollten (=>TASK_PLAN.md)
1. Erg?nze unsere AKSEP\Schoolsystem2\backend\src\main\resources\scripts\topics\restructure_disciplines_csv.py mit entsprechenden Arrays* & Funktionalit?ten, um den type einer Disziplin  sinnvoll (manuell einen Default ?berschreibend) definieren zu k?nnen
1b. *Du brauchst in dieser Phase noch nicht ALLE Disciplines durchgehen, um diese entsprechend in "Technical" bzw. "Practical" einzukategorisieren; Vorerst reicht uns diesbez?glich eine ?berschaubare "Proof-of-Concept"-Sammlung naheliegender Zuweisungen; Vervollst?ndigen k?nnen wir diese beiden Arrays sp?ter noch.
2. Erstelle ein Script, welches die Datens?tze (wie oben geschildert) aus unserer Disciplines.csv einliest und in unsere AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\t_topic_PLANNING.csv ?berf?hrt (Orientiere dich betreffend der Generierung der topicID gerne an der Spreadsheet-Formel in AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\Spreadsheet_Formulas.md#t_topica-topicid, jedoch mit erw?hnten Anpassungen)
3. Erweitere das ?berf?hrungs-Script um einen zweiten Part, in welchem die Datens?tze aus unserer AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\Achievements.csv eingelesen und am Fusse unserer AKSEP\Schoolsystem2\backend\src\main\resources\csv\topics\t_topic_PLANNING.csv hinzugef?gt werden
Und nat?rlich gilt es, nach jedem Schritt das Umgesetzte auf Herz und Nieren zu testen und zu validieren - nicht dass fehlerhafte Ergebnisse an den jeweils n?chsten Schritt weitervererbt werden
**Scope-Hash**: `295e4fe3ba79f07e922f5c6945bc10aa61b40f151e14ddf07b536b7422abfec5`

## Discovery
- Problem Statement: Stop Branches integration work and generate `t_topic_PLANNING.csv` from `Disciplines.csv` + `Achievements.csv` using the existing spreadsheet logic (topicID rules), while expanding discipline type defaults and overrides.
- Context & Constraints: Work limited to `Schoolsystem2/backend/src/main/resources/csv/topics/**` and `.../scripts/topics/**`; plan-gate write scope applies; `Disciplines.csv` already contains enriched names/descriptions/attached_to/layer/type.
- Existing Signals: `Spreadsheet_Formulas.md` documents topicID logic; `t_topic_PLANNING_LEGACY.csv` shows legacy structure; `Disciplines.csv` is current source; `Achievements.csv` contains achievements to append.
- Pre-existing Changes: Many files under scope are already modified/added by the user; proceed without cleaning per prompt override (see TASK_DOCS.md).
- Unknowns & Questions:
  - U1: Proof-of-concept lists for `general`, `technical`, `practical` overrides (size and examples) ? Status: deferred (POC list will be short).
  - U2: Whether to update any doc outside scope (e.g., Data_Flow) ? Status: deferred (no doc edits planned).
- Options:
  - A) Minimal topic builder script (Disciplines only), manual post-process (simple but manual).
  - B) Full builder script (Disciplines + Achievements, type mapping), reproducible CSV output (chosen).
- Evidence links (if any): see TASK_DOCS.md#discovery-20251225
Status: READY

## Planning
- Decision: Extend `restructure_disciplines_csv.py` with explicit override arrays for general/technical/practical types, then add a new topic builder script that reads `Disciplines.csv`, filters layer>0, sorts by layer, generates topicIDs per spreadsheet formula, maps type to typeID, and appends achievements at the end.
- Enrichment Sync Decision: Add a non-destructive enrichment sync script to align `Disciplines_enrichment.csv` with `Disciplines_restructured.csv` order while preserving all existing enrichment rows. New rows are added with empty payloads and status markers; missing keys are not deleted.
- Type Rules:
  - Default for Disciplines output: `S` for layer>0, empty for layer==0.
  - Add general marker ("0") when `layer==1` or key in `GENERAL_KEYS`.
  - Override to `T` if key in `TECHNICAL_KEYS` (takes priority over P).
  - Override to `P` if key in `PRACTICAL_KEYS` and not in technical.
- Topic Mapping Rules:
  - Skip layer 0 rows.
  - Sort by `layer` ascending only (preserve intra-layer order).
  - `topicID` per Spreadsheet_Formulas; `typeID` mapping: `0 -> 0`, `S -> 1`, `T -> 2`, `P -> 6`; achievements appended with `typeID=3`.
- Acceptance Criteria:
  - `Disciplines_restructured.csv` reflects updated `type` logic and overrides.
  - `t_topic_PLANNING.csv` generated deterministically from Disciplines + Achievements with correct column order and typeID mapping.
  - Output excludes layer 0 disciplines.
- Enrichment Sync Rules:
  - Add `status` and `suggested key` columns to `Disciplines_enrichment.csv`.
  - Statuses: `valid` (key exists), `missing` (new row added, empty payload), `orphan` (key no longer in restructured), `suggested` (orphan with a suggested key).
  - Orphans are appended after all current restructured keys; no automatic deletion or key changes.
  - Enrichment script skips `orphan` rows to avoid misfire warnings; `missing` rows are treated as present but empty.
- Test Strategy:
  - Run `restructure_disciplines_csv.py` and `enrich_disciplines_csv.py`; spot-check a few `type` values.
  - Run new topic builder; verify row counts, layer ordering, and sample topicIDs.
- Risks & preliminary Rollback: Type overrides may be incomplete; rollback via git revert on scripts/CSV outputs.
- Links (if any): TASK_DOCS.md#planning-20251225
Status: READY

## Pre-Approval Checklist
- [x] Discovery: Status = READY
- [x] Planning: Status = READY
- [x] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [x] Developer Interactions section exists
- [x] Checks & Pass Criteria present & consistent
- [x] Mode & Score filled (plan-gate, score = 6)
- [x] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed within scope) — prompt override for pre-existing user changes

## Implementation Steps (paths & anchors)
0) Plan Sync: reload TASK_PLAN.md; scan Developer Interactions.
1) Schoolsystem2/backend/src/main/resources/scripts/topics/restructure_disciplines_csv.py: add override arrays for general/technical/practical keys and apply new type derivation (technical wins over practical).
2) Schoolsystem2/backend/src/main/resources/csv/topics/Disciplines_restructured.csv: regenerate via build script and verify type updates in sample rows.
3) Schoolsystem2/backend/src/main/resources/scripts/topics/sync_disciplines_enrichment.py (new): reconcile `Disciplines_enrichment.csv` against `Disciplines_restructured.csv`, set statuses, and align ordering.
4) Schoolsystem2/backend/src/main/resources/csv/topics/Disciplines_enrichment.csv: regenerate with new columns and aligned ordering; review orphan/suggested entries.
5) Schoolsystem2/backend/src/main/resources/scripts/topics/enrich_disciplines_csv.py: skip `orphan` rows; keep `missing` rows as empty; regenerate Disciplines.csv and confirm no layer errors or misfire warnings.
6) Schoolsystem2/backend/src/main/resources/scripts/topics/build_topic_planning_csv.py (new): implement Disciplines+Achievements to t_topic_PLANNING.csv pipeline and topicID generation.
7) Schoolsystem2/backend/src/main/resources/csv/topics/t_topic_PLANNING.csv: generate output and spot-check columns and ordering.
8) Schoolsystem2/backend/src/main/resources/csv/topics/TASK_DOCS.md: summarize changes and checks.
9) Final @codex Sweep: scan all touched/new files plus Control Paths for @codex and resolve.

## Developer Interactions
- [x] AGENTS.md:42 - @codex mentions are policy text; no action required.
- [x] TASK_PLAN.md:65 - @codex mentions are policy text; no action required.
- [x] Schoolsystem2/backend/src/main/resources/csv/topics/TASK_DOCS.md:7 - @codex mention in changelog; no action required.

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Run restructure_disciplines_csv.py and confirm updated type markers.
  - [ ] Run enrich_disciplines_csv.py and confirm Disciplines.csv has no layer errors.
  - [ ] Run build_topic_planning_csv.py and confirm t_topic_PLANNING.csv excludes layer 0 and sorts by layer.
  - [ ] Spot-check at least 5 topicIDs vs spreadsheet formula.

## Risks / Rollback
- Risk: Type overrides incomplete or misclassified.
- Rollback: git revert <sha>
