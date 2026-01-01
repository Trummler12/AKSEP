# Task Plan: [AKSEP] Review resource-related data flow

## Mode & Score
Mode: plan-gate, Score: 4 (classifier: reasons touches >2 files, cross-file coupling, estimated diff >50 LOC)

## Task Scope Paths
- AKSEP/Schoolsystem2/docs/Data_Flow/Data_Flow.md
- AKSEP/TASK_PLAN.md
- AKSEP/TASK_DOCS.md

## Scope (verbatim)
Alles klar, es sieht sehr danach aus, leider, dass die Beschaffung der Videotranskripte eine Baustelle ist, die wir so schnell nicht gel?st bekommen.
Bedeutet also: alles ab dem, was wir momentan haben, bis zu unserer AKSEP\Schoolsystem2\backend\src\main\resources\csv\youtube\t_source_PLANNING.csv, M?ssen wir bis auf weiteres liegen lassen, bis wir ENDLICH einen Weg gefunden haben, um Transkripte von Videos zuverl?ssig und ziehen beziehungsweise als Fallback generieren zu lassen.
Aber gl?cklicherweise haben wir in unserem `\csv\t_source.csv` bereits ausreichend Datens?tze von fr?her noch vorliegen, mit denen wir schon sehr gut weiterarbeiten k?nnen f?r die *n?chsten* Schritte, die wir geplant haben.
Nun zum Eingemachten:
Ich hab' in unserer AKSEP\Schoolsystem2\docs\Data_Flow\Data_Flow.md unter #resource-related eine detaillierte "##### Compact Data Flow Description" verfasst und alles (planerisch) erg?nzt, was mir noch in den Sinn gekommen ist, bis wir fertige Source.csv-Datens?tze haben. Zwar werden wir dies alles erst sp?ter umsetzen k?nnen, sobald wir Zugriff haben auf Ad-Hoc-Transcript-Schnittstellen, aber dennoch w?rde ich dich bitten, durch das soweit Geplante mal dr?ber zu schauen und zu evaluieren, ob von der Abfolge her soweit alles sinnvoll ist, frei von unn?tiger Redundanz und unn?tigen Aufrufen, und ob das soweit von der Abfolge her funktionieren kann, wenn wir das dann alles fertig auf die Beine stellen w?rden, irgendwann in noch nicht ganz absehbarer Zukunft. Analysiere, evaluiere und erg?nze, falls n?tig, etc. Und wenn du den Ablauf soweit absegeln kannst, dann w?rde ich dich bitten, dies alles, was neu dazugekommen ist, auch in der `##### More Detailed Data Flow Description` zu erg?nzen.
Ach, und bitte wundere dich nicht ?ber all jenes, was w?hrend deiner "Abwesenheit" manuell erg?nzt wurde. Ich habe noch ein paar Dinge vorbereitet f?r die n?chste Phase, nach welcher wir mit einem anderen Ast in unserer Applikation weitermachen werden.
**Scope-Hash**: `a90f8bf5c6a3f777017409ee4d6090b77f064611b61f345b58b32a45e8749cda`

## Discovery
- Problem Statement: Review and refine resource-related data flow descriptions in Data_Flow.md, then propagate approved changes into the detailed section.
- Context & Constraints: Transcript acquisition is deferred; use existing t_source.csv data for planning.
- Existing Signals:
  - `AKSEP/Schoolsystem2/docs/Data_Flow/Data_Flow.md` has new "Compact Data Flow Description" content under #resource-related.
- Unknowns & Questions (U1…Un) — Status: answered | deferred
  - U1: Any redundant or unnecessary steps in the new compact flow? Status: answered (remove duplicate secondary-script block; clarify course marker file).
  - U2: What exact additions should be mirrored into the "More Detailed" section? Status: answered (audio tracks + postponed transcripts/comments + video_to_source note).
Status: READY

## Planning
- Decision: Normalize compact flow and mirror it into the detailed flow; remove redundant blocks and keep transcript steps explicitly postponed.
- Acceptance Criteria:
  - Compact flow references `_YouTube_Courses.txt` and shows audio tracks plus postponed transcript steps.
  - Detailed flow includes audio tracks and a single postponed transcript/comments section.
- Test Strategy: Doc-only review for logical ordering and redundancy.
- Risks & Rollback: Over-pruning could omit a needed step; revert if a dependency was lost.
Status: READY

## Pre-Approval Checklist
- [ ] Discovery: Status = READY
- [ ] Planning: Status = READY
- [ ] Steps are atomic (per file + anchor/range); Final @codex Sweep present
- [ ] Developer Interactions section exists
- [ ] Checks & Pass Criteria present & consistent
- [ ] Mode & Score filled (plan-gate, score = 4)
- [ ] git status clean (only TASK_PLAN.md/TASK_DOCS.md changed)

## Implementation Steps (paths & anchors)
0) [x] Plan Sync: reload `TASK_PLAN.md`; scan Developer Interactions and apply the Priority & Preemption Rules.
1) [x] Review the new "Compact Data Flow Description" under #resource-related in `AKSEP/Schoolsystem2/docs/Data_Flow/Data_Flow.md` for ordering, redundancy, and feasibility.
2) [x] Propose and apply edits to improve flow clarity and remove redundant steps (if any).
3) [x] Mirror approved changes into "More Detailed Data Flow Description" in the same file.
4) [x] Update `AKSEP/TASK_DOCS.md` with changes and rationale.
5) [x] Final **@codex Sweep**.

## Developer Interactions
- [x] AKSEP/AGENTS.md:42 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:116 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:130 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:155 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:211 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:223 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:225 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:229 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:231 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:236 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:324 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:327 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:331 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:481 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:483 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:484 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:487 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:494 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:496 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:498 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:502 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:504 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:507 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:509 - @codex mention in policy text; no action required.
- [x] AKSEP/AGENTS.md:510 - @codex mention in policy text; no action required.
- [x] AKSEP/TASK_PLAN.md:44 - @codex mention in checklist text; no action required.
- [x] AKSEP/TASK_PLAN.md:57 - @codex mention in steps text; no action required.
- [x] AKSEP/Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:76 - @codex mention in other task plan; no action required.
- [x] AKSEP/Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:92 - @codex mention in other task plan; no action required.
- [x] AKSEP/Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:95 - @codex mention in other task plan; no action required.
- [x] AKSEP/Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:96 - @codex mention in other task plan; no action required.
- [x] AKSEP/Schoolsystem2/backend/src/main/resources/csv/topics/TASK_PLAN.md:97 - @codex mention in other task plan; no action required.
- [x] AKSEP/Schoolsystem2/backend/src/main/resources/csv/topics/TASK_DOCS.md:7 - @codex mention in other task docs; no action required.

## Checks & Pass Criteria
- Manual Verification:
  - [ ] Compact and detailed resource-related flows are consistent and logically ordered.

## Risks / Rollback
- Risk: Removing steps could omit a required data dependency.
- Rollback: git revert <sha>
