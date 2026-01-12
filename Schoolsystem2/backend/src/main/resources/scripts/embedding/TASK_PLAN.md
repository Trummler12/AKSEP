# Task Plan: [AKSEP] Tag curation iteration

## Mode & Score
Mode: plan-gate, Score: 5 (classifier: touches >2 files, cross-file coupling, no tests cover area)

## Task Scope Paths
- Schoolsystem2/backend/src/main/resources/scripts/embedding/**
- Schoolsystem2/backend/src/main/resources/scripts/embedding/TASK_PLAN.md
- Schoolsystem2/backend/src/main/resources/scripts/embedding/TASK_DOCS.md

## Scope (verbatim)
Okay, sehr schön. Ich hab' mir unsere BASE_TAG_ORDER nochmals etwas angeschaut und bin nun sehr zufrieden mit der momentanen Reihenfolge. Mit dem momentanen Stand kann man definitiv weiterarbeiten.
Dann steht eigentlich schon alles Wichtige, um in dieser nächsten Phase unsere Sammlung an Tags systematisch zu verbessern.
Dann lautet mein Auftrag nun wie folgt:
0. Mach dich bitte kurz vertraut mit dem momentanen (wieder leicht von mir manuell angepassten) Stand der Scripte.
1. lass Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_redundancy_demo.py laufen
2a. Identifiziere auf Basis der Ergebnisse Redundanzen und anderweitig ungeeignete Tags, die wir abbauen können. Beispiele:
- Zusammengesetzter Tag, dessen Bedeutung nahezu identisch ist wie die Summe der Begriffe, aus welchen der Tag zusammengesetzt ist (Beispiel: "mechanical engineering" kann wunderbar vertreten werden durch eine Kombination von "mechanics" + "engineering" ("mechanical engineering" braucht es daher nicht als alleinstehender Tag), selbiges gilt auch für "art history" oder "ethics in research"; Wichtiges Beispiel für mögliche Ausnahmen: "climate change" => "climate" + "change" ("change" ergibt alleinestehend wenig Sinn als Tag, da VIEL zu mehrdeutig, weswegen eine Unterscheidung zwischen "climate" und "clmate change" weiter notwendig bleibt))
- Unnötig spezifische Tags wie "galaxies" oder "coins (collecting)" (das "(collecting)" können wir hier streichen)
- offensichtliche Redundanzen wie weather <-> meteorology (meteorology IST die Wissenschaft der Wetterdeutung und -Prognostizierung; "ewather" als Tag reicht völlig)
(Sicherlich gibt es anhand von Best Practices noch weitere sinnvolle Regeln, die wir hier definieren könnten;
Auch könnten wir uns überlegen, unsere `top_sets` zu nutzen, um nach der Ausgabe von `Topics mit niedrigster Uebereinstimmung mit ihrem #n passendsten Tag` die Top m Tags mit jeweils den meisten und den wenigsten Platz-1-Zuordnungen ausgeben zu lassen (mit initialem m = 20); Vielleicht selbiges gleich nochmals, aber bis runter zum #n passendsten Tag, wobei jede Zuordnung eine Gewichtung von 1/n erhält. Was meinst du? Falls du nach reiflicher Übrlegung auch findest, das könnte uns weitere nützliche Insights liefern, darfst du dies gerne gleich umsetzen)
=> Bestücke TAGS_TO_REMOVE dementsprechend
- 'Top aehnlichste Paare', bei denen eine Unterscheidung trotz ihrer Embedding-Ähnlichkeit explizit sinnvoll sei, können gerne der EXCLUDED_TOP_PAIRS ergänzt werden
2b. Identifiziere mithilfe der "Topics mit niedrigster Uebereinstimmung mit ihrem #n passendsten Tag" etwaige Lücken in unserer Sammlung an Tags, suche nach sinnvollen Schlagwörtern, die wir unserer Tag-Sammlung hinzufügen können (je allgemeiner verständlich, desto besser - ja halt den Kriterien entsprechend, was einen guten Tag ausmacht)
=> Bestücke TAGS_TO_ADD dementsprechend
3. Sobald in Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_update.py die beiden Arrays TAGS_TO_REMOVE und TAGS_TO_ADD mit entsprechenden Anpassungsanweisungen versehen sind, kannst du das Script anschliessend laufen lassen.
PS: Wenn du dich bei einem Kandidaten partout nicht entscheiden können solltest, dann darfst du diesen inkl. Gründe für & gegen dessen Removal/Addition gerne in einem temporären File `Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\data\tag_update_candidates.txt` (oder `*.md`) dokumentieren und vorerst mal sein lassen - dann kümmere ich mich GANZ am Ende auf Basis dieser 'Wackelkandidaten' um einen letzten manuellen Feinschliff.
4. Wiederhole Schritte 1 bis 3 bis auf Basis der Analysen (und auch wenn du 'ganz' am Ende einmal *manuell* durch alle Einträge unserer Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\data\t_tag_PLANNING.txt durchgehst, um etwaige unter dem Radar verbliebene verbesserungswürdige Tags ausfindig zu machen) kein wirklicher handfester Verbesserungsbedarf mehr identifiziert werden kann.
PS: Zur Transparenz sollten wir unsere Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\tag_update.py vermutlich noch erweitern damit, dass erfolgreiche Veränderungen an den Tag-Arrays gelogged werden (z.B. nach `Schoolsystem2\backend\src\main\resources\scripts\embedding\testing\data\tag_change_log.txt` mit einfachen Einträgen wie `- mechanical engineering` oder `+ war`)
**Scope-Hash**: `2D6481AA7D974B92100E03410CA974D6E0DA2CAAAFD5C43FD03D7BF42913F582`

## Discovery
- Problem Statement: Run redundancy analysis, identify tags to remove/add, update EXCLUDED_TOP_PAIRS, optionally extend output summaries, then apply tag_update and log changes.
- Context & Constraints: Scripts are in `Schoolsystem2/backend/src/main/resources/scripts/embedding/testing/`; `t_tag_PLANNING.txt` is the source CSV; tag_update should log changes to `data/tag_change_log.txt`.
- Existing Signals: `tag_redundancy_demo.py` outputs top pairs and topic/tag matches; `tag_update.py` handles add/remove and ordering, normalizes tag names to lowercase.
- Unknowns & Questions (U1): How many iterations are expected before stopping? (Given time, plan for one full pass + review.) Status: deferred.
- Unknowns & Questions (U2): Should tag_update logging append or overwrite? (Assume append with timestamp if not specified.) Status: deferred.
- Options:
  - A) Add top-assignments summaries for tags (place-1 counts + weighted counts). Pros: more insight; Cons: extra runtime/output.
  - B) Skip extra summaries unless requested after first pass. Pros: keeps output short; Cons: misses potential insights.
Status: READY

## Planning
- Decision: Implement minimal logging in `tag_update.py` (append), and add optional summaries in `tag_redundancy_demo.py` if time permits and output is manageable. Perform one full iteration and stop for review.
- Impact on Scope/Steps/Checks/Risks: Update redundancy demo + tag_update + data files; add candidates log if unsure; run scripts before and after changes.
- Acceptance Criteria:
  - EXCLUDED_TOP_PAIRS updated for known acceptable near-duplicates.
  - TAGS_TO_REMOVE/TAGS_TO_ADD updated based on analysis.
  - tag_update logs applied changes to `data/tag_change_log.txt`.
  - tag_update run updates `t_tag_PLANNING.txt` accordingly.
- Test Strategy: Run `tag_redundancy_demo.py`, update arrays, run `tag_update.py`, rerun `tag_redundancy_demo.py` to verify improvements.
- Risks & preliminary Rollback: Over-removal/addition; rollback by restoring CSV and arrays from VCS and consult candidates log.
- Step Granularity: Steps split per file with anchors and include rerun cycles.
Status: READY FOR APPROVAL

## Pre-Approval Checklist
- [x] Discovery: Status = READY
- [x] Planning: Status = READY
- [x] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [x] Developer Interactions section exists
- [x] Checks & Pass Criteria present & consistent
- [x] Mode & Score filled (plan-gate, score = 5)
- [x] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
0) **Plan Sync:** reload `Schoolsystem2/backend/src/main/resources/scripts/embedding/TASK_PLAN.md`; scan **Developer Interactions** and apply the **Priority & Preemption Rules**.
1) `Schoolssystem2/backend/src/main/resources/scripts/embedding/testing/tag_redundancy_demo.py`: add optional tag-assignment summary output (if adopting Option A).
2) `Schoolssystem2/backend/src/main/resources/scripts/embedding/testing/tag_redundancy_demo.py`: update EXCLUDED_TOP_PAIRS based on findings.
3) `Schoolssystem2/backend/src/main/resources/scripts/embedding/testing/tag_update.py`: update TAGS_TO_REMOVE and TAGS_TO_ADD lists; implement tag_change_log append.
4) `Schoolssystem2/backend/src/main/resources/scripts/embedding/testing/data/tag_update_candidates.txt`: add unresolved candidates with reasons (optional).
5) Run `tag_update.py` to apply changes to `t_tag_PLANNING.txt`.
6) Rerun `tag_redundancy_demo.py` to verify improvements; repeat Steps 2-5 only if still clear improvements remain.
7) Final **@codex Sweep**: scan touched/new files plus Control Paths for `@codex` comments; update **Developer Interactions** and resolve.

## Developer Interactions
- [ ]

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Run `tag_redundancy_demo.py` pre-change and capture baseline.
  - [ ] Run `tag_update.py` after list updates; CSV changes apply.
  - [ ] Rerun `tag_redundancy_demo.py` to confirm improved output.

## Risks / Rollback
- Risk: Removing tags that should remain or adding overly specific tags.
- Rollback: restore `t_tag_PLANNING.txt`, `tag_update.py` arrays, and `EXCLUDED_TOP_PAIRS` from VCS.
