## Scope (verbatim)
Sehr schön!
Das ist nun 'ne wunderbare Basis für die nächsten Schritte!
Unsere nächste Aufgabe ist nun, sämtliche className-Inhalte, die wir erfasst haben, nach AKSEP\src\styles in saubere, wartbare css-Klassen zu übersetzen auf Basis dessen, wie deren Bestandteile in AKSEP\src\index.css definiert sind.
Gehe dabei ungefähr wie folgt vor (wobei auch hier wieder gilt: Mach dir ausgiebig Gedanken zum von mir geschilderten Plan, bessere ihn auf, etc.):
Für jedes File in AKSEP\src\styles-PLANUNG:
  Für jeden Eintrag in diesem File (Jeder Eintrag hat die Form "Element-Name | className-Inhalt | Beschreibung/Funktion"):
    1. Bilde die Summe aller Style-Definitionen (siehe AKSEP\src\index.css (von welcher wir am Ende weggkommen wollen)), welche sich hinter den className-Inhalt-Elementen dieses Eintrags verbergen (=> Im Folgenden als "Style-Summe" bezeichnet); Du kannst diese Summen gerne jeweils temporär in einem Zwischenablagen-File ablegen.
    2. Prüfe, ob diesem Element-Namen bereits eine Klasse in der gleichnamigen AKSEP\src\styles\**\*.css existiert;
      Falls ja: Stimmt der Inhalt der Klasse mit der von dir berechneten Style-Summe überein? Passe an, falls nötig.
      Falls nein: Erstelle an der entsprechenden Stelle eine neue Style-Klasse für dieses Element unter Verwendung der ermittelten Style-Summe.
    3. Suche in AKSEP\src (*txt-Files ausgeschlossen) nach dem hiesigen className-Inhalt; Wird dieser className momentan über mehrere Files hinweg verwendet, dann investigiere, ob manche oder alle gefundenen Elemente funktional tatsächlich identisch genug sind, dass es sinnvoll sein könnte, diese Style-Klasse zu konsolidieren;
      falls ja: Erstelle bei der betreffenden Styles-Klasse einen Kommentar "/* Zusammenführen sinnvoll /*", damit wir in der *nächsten* Phase schauen können, Klassen wie diese die eine oder andere Ebene höher/allgemeiner zu definieren.
      Falls nein und nach "falls ja": ersetze den alten className-Inhalt durch den neuen Element-Name, jedoch beschränkt auf das File, von welchem dieser AKSEP\src\styles-PLANUNG-Eintrag stammt.

Als Ergebnis sollten wir am Ende sämtliche alten className-Inhalte erfolgreich in entsprechende AKSEP\src\styles übersetzt und durch einfache, selbsterklärende Element-Namen ersetzt haben.

Jedoch, bevor du loslegst: Mir ist aufgefallen, dass du zwischen AKSEP\src\styles-PLANUNG\components\content-sections.txt und AKSEP\src\styles-PLANUNG\pages\homepage.txt einiges an Redundanz ins Spiel gebracht hast; Überlege dir bei den sich doppelten Einträgen, wie universell diese sein sollen; Was offensichtlich nur auf die Startseite beschränkt sein soll, darf gerne in AKSEP\src\styles-PLANUNG\pages\homepage.txt bleiben; Wo jedoch nix gegen spricht, dieses Element auch anderswo zu verwenden, so sei dies in AKSEP\src\styles-PLANUNG\components\content-sections.txt am besten aufgehoben. Sobald du diese Redundanz bereinigt hast, kannst du mit dem eigentlichen Auftrag loslegen (bzw. zuerst mit der Planung und im Anschluss mit der Umsetzung des Geplanten)
## Discovery
Status: READY

* `src/styles-PLANUNG/components/content-sections.txt` und `src/styles-PLANUNG/pages/homepage.txt` enthalten nahezu identische Alias-Bloecke fuer Container, Spalten-Layouts und Karten; nur wenige Wrapper sind wirklich homepage-spezifisch, daher muessen wir die gemeinsamen Klassen nach `components/content-sections` umziehen und Duplikate dort entfernen.
* `src/styles/components/content-sections.css` bildet bislang nur einen kleinen Teil der benoetigten Utility-Klassen ab (einige Beschreibungen, Standard-Grids, Card-Hover) und enthaelt keine Styles fuer Container-Padding, Bullet-Listen, CTA-Stacks etc.; wir muessen fuer jeden Alias aus der Planung passende CSS-Regeln anlegen.
* `src/index.css` (Tailwind-Build) definiert die exakten CSS-Werte fuer die bisherigen Utility-Klassen, z.B. `--spacing: .25rem` sowie Selektoren wie `:where(.space-y-20 > :not(:last-child))` und `.bg-card`; fuer jede Alias-Klasse muessen wir daraus eine Style-Summe mit konkreten Werten (Rem, Grid-Definitionen, Variablen) ableiten.
* Komponenten wie `src/content/start.tsx`, Navigation/Footer usw. nutzen weiterhin die Roh-Tailwind-Strings; sobald die neuen Klassen vorliegen, muessen wir in allen betroffenen TSX-Dateien die `className`-Attribute ersetzen und optional Konsolidierungskandidaten markieren.
## Planning
Status: READY

* **Redundanzbereinigung:** Zuerst ueberfuehre ich alle allgemein gueltigen Alias aus `pages/homepage.txt` in `components/content-sections.txt` (bzw. entferne sie aus der Homepage-Datei), lasse nur eindeutig seitenbezogene Elemente uebrig und gleiche die Hierarchie/Indentation an.
* **Style-Summen bilden:** Fuer jede Alias-Zeile ermittle ich per `rg` im Tailwind-Build (`src/index.css`) die zugrunde liegenden Deklarationen und rechne Utility-Werte (z.B. `space-y-20`, `px-4`, `bg-card`) in konkrete CSS-Werte mit `rem` oder Farbvariablen aus. Gemeinsame Muster (Spacing, Flex/Grid, Farbe) fasse ich in Hilfsfunktionen/Kommentaren zusammen, damit sie in mehreren Komponenten konsistent bleiben.
* **CSS-Dateien erweitern:** Schreibe die Style-Summen in die passenden CSS-Module (`src/styles/components/*.css`, `src/styles/pages/*.css`) und orientiere mich an bereits vorhandenen Kommentarsektionen. Falls mehrere Alias denselben Block teilen koennen, dokumentiere das mit `/* Zusammenführen sinnvoll */` fuer spaetere Konsolidierung.
* **TSX-Umstellung:** Ersetze in den React-Komponenten (`src/components/**`, `src/content/**`) die bisherigen Tailwind-Strings durch die neuen Klassennamen. Vorher pruefe ich per `rg --fixed-strings` ob Klassen mehrfach in unterschiedlichen Dateien vorkommen; wenn die Funktion identisch ist, ergaenze ich den Hinweis-Kommentar an der CSS-Definition.
* **Nacharbeiten & Dokumentation:** Aktualisiere `TASK_DOCS.md` mit Mapping-Tabellen (Alias ↔ Style-Summe ↔ ersetzte Dateien), notiere offene Konsolidierungs-Kandidaten und verifiziere abschliessend, dass keine Roh-Tailwind-Klassen mehr in den bearbeiteten Bereichen verbleiben.
* **Task Scope Paths:** `src/styles-PLANUNG/**`, `src/styles/**`, `src/components/**`, `src/content/**`, `TASK_PLAN.md`, `TASK_DOCS.md`.
## Implementation Steps
1) `src/styles-PLANUNG/components/content-sections.txt` & `src/styles-PLANUNG/pages/homepage.txt` — Duplikate pruefen, allgemeine Alias nach `components` verlagern, Homepage-Datei auf seitenexklusive Eintraege reduzieren.
2) `src/styles/components/content-sections.css` — Style-Summen fuer Content-Layout (Stacks, Container, Bullet-Listen, Karten) implementieren und konsolidierungsrelevante Kommentare setzen.
3) `src/styles/pages/homepage.css` — Homepage-spezifische Wrapper (z.B. CTA-Sektionen) mit neuen Klassen versehen und gemeinsame Utilities entfernen.
4) `src/content/start.tsx` — Saemtliche Tailwind-Strings durch die neuen Content-/Homepage-Klassennamen ersetzen.
5) `src/styles/components/hero.css` — Hero-spezifische Gradients, Typografie und Feature-Grids gemäss Planung definieren.
6) `src/components/hero-section.tsx` — Hero-Komponente auf die neuen Klassen umstellen und Icon/Button-Styles anpassen.
7) `src/styles/components/navigation.css` — Innencontainer, Toolbar, Dropdown-/Overflow-/Mobile-Blöcke komplett definieren inkl. Zustandsklassen.
8) `src/components/navigation/Navigation.tsx` — Tailwind-Strings in der Hauptnavigation ersetzen und bei wiederverwendbaren Patterns Konsolidierungshinweise vermerken.
9) `src/components/navigation/NavigationItem.tsx` — Dropdown-/Item-Styles auf Alias-Klassen umbauen, cn()-Aufrufe bereinigen.
10) `src/components/navigation/OverflowNavigation.tsx` — Overflow-Komponente auf Alias-Klassen migrieren.
11) `src/styles/components/footer.css` — Footer-Container, Grids, Text- und Link-Varianten definieren.
12) `src/components/footer.tsx` — Footer-Komponente auf neue Klassennamen umstellen.
13) `src/styles/components/shared.css` — Card-, Separator- und Dropdown-Basisstyles ergänzen (Alias aus `components/shared.txt`).
14) `src/components/ui/card.tsx` — Card-Komponenten auf neue Klassen mappen.
15) `src/components/ui/dropdown-menu.tsx` — Dropdown-Komponenten auf neue Klassen mappen.
16) `src/components/ui/separator.tsx` — Separator auf Alias-Klasse umstellen.
17) `src/styles/pages/standard.css` — Placeholder-Layout und Utilities fuer Standardseiten ergänzen.
18) `src/content/page-placeholder.tsx` — Placeholder-Komponente auf neue Klassen migrieren.
19) `TASK_DOCS.md` — Style-Summen, Suchbefehle und Nacharbeiten dokumentieren.
20) Final @codex Sweep — alle berührten Dateien auf @codex-Hinweise prüfen.

## Developer Interactions

## Checks & Pass Criteria
* `rg --fixed-strings "className="" src | rg 'bg-'` liefert in bearbeiteten Dateien keine Roh-Tailwind-Klassen mehr (Ausnahme: bewusst verbleibende dynamische cva-Varianten, im DOC vermerkt).
* Fuer jeden Alias aus den aktualisierten PLANUNG-Dateien existiert eine zugehoerige CSS-Regel unter `src/styles/**` mit den ermittelten Style-Summen.
* Alle umgestellten Komponenten rendern weiterhin identische Struktur (visuell per Code-Review) und importieren die richtigen CSS-Module.
* Konsolidierungskandidaten wurden in der CSS-Datei mit `/* Zusammenführen sinnvoll */` kommentiert, sofern mehrere Dateien denselben Alias nutzen.
* `git status --porcelain -- src/styles-PLANUNG src/styles src/components src/content TASK_PLAN.md TASK_DOCS.md` ist vor dem Commit sauber.

## Risks / Rollback
* **Fehlende Style-Paritaet:** Wenn eine Style-Summe falsch berechnet wird, koennen Abstaende/Farben im UI abweichen. *Mitigation:* Jeden Alias gegen die Werte in `src/index.css` und `themes.css` pruefen; `TASK_DOCS.md` haelt Berechnungen fest.
* **Uebersehene Mehrfachnutzung:** Klassen wie `space-y-2` tauchen in mehreren Komponenten auf; falls ein Alias zu eng zugeschnitten ist, droht Inkonsistenz. *Mitigation:* vor jedem Replace globale Suche nutzen und ggf. `/* Zusammenführen sinnvoll */` setzen.
* **Rollback:** Einzelne Dateien via `git restore --source=HEAD -- <path>` wiederherstellen; fuer umfangreiche Regressionen gesamten Commit reverten.

## Mode & Score
Mode: plan-gate, Score: 5 (reasons: >2 files, cross-file coupling, diff likely >50 LOC)
