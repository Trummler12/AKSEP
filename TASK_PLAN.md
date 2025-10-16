## Scope (verbatim)
Dieses Repository war ursprünglich angedacht, SÄMTLICHE Projekte zu beinhalten, die mit unserer politischen Partei DIE AKSEP in Verbindung stehen;
Mittlerweile bin ich jedoch davon überzeugt, dass es bei Projekten, bei welchen ich NICHT alleiniger Developer bin, jedem Projekt sein eigenes, dediziertes Repository zu geben.
Im Falle dieses AKSEP-Repos haben wir auf der einen Seite die Webseite (AKSEP\projects\AKSEP) und auf der einen Seite ein Projekt für eine Applikation zum Managen von Unterrichtsressourcen (AKSEP\projects\schoolsystem_DB); Zwar hat das zweite Projekt sehr wohl seinen Ursprung in Ideen, die anlässlich unserer politischen Bestrebungen zustande kamen, jedoch hat dieses Projekt NICHTS mit unserer Partei-Webseite zu tun.
Daher ist unser Ziel, der schoolsystem_DB sein eigenes Repository zu geben und das, was wir aktuell für die Webseite haben, näher zum Root zu holen.

Wichtig jedoch zu berücksichtigen ist, dass unser Webseiten-Projekt eine recht chaotische Historie hat mit mehreren verworfenen Ansätzen, die jedoch als Referenz-Material (selektiv) beibehalten bleiben sollen:
- AKSEP\projects\AKSEP-ALT: Ein erster Versuch, eine Online-Datenbank-basierte Daten-Einbindung aufzustellen; Dies ist jedoch daran gescheitert, dass .json keine mehrzeiligen Strings akzeptiert, was eine Wartung in einem unzumutbarem Masse erschwert; Als Referenz-Material Behaltenswert ist hier im Grunde lediglich die AKSEP\projects\AKSEP-ALT\src\data\team\members.json; Den Cookie-Banner können wir eh einfach neu machen und der Rest ist entweder generisch noch vom ersten Setup oder eine Strukturbeschreibung (AKSEP\projects\AKSEP-ALT\firebase.json(.txt)), die in Form einer handfeste Dateistruktur bereits eine deutlich bessere Alternative vorliegen hat als Referenz-Material;
- AKSEP\projects\AKSEP\v_too_complicated war ein Versuch, mit komplizierten Frameworks wie nuxt3 und co. ein dynamisches System aufzubauen, welches auf Basis von (von der Idee her) 'nutzerfreundlich' editierbaren .mdc-Dateien dynamisch die Seiteninhalte der Webseite generieren soll; Grundsätzlich behaltenswert ist dabei die Webseiten-Struktur, wie wir sie über AKSEP\projects\AKSEP\v_too_complicated\content geplant hatten, aber auch "Dies und jenes soll die Webseite können"-Beschreibungen wie sie etwa in Form der AKSEP\projects\AKSEP\v_too_complicated\docs\UseCase.md vorliegt; Im Zuge meiner Vibe-Coding-Versuche hat sich jedoch neben all dem, was als Referenzmaterial tatsächlich taugt, im Zuge all der ergebnislosen Bugfix-Versuche auch sehr viel Ballast angesammelt. Ballast und brauchbare Referenz-Materialien sind hier tatsächlich dermassen miteinander vermischt und derart umfangreich - versuchen, diese voneinander zu trennen, wäre vermutlich VIEL zu arbeitsintensiv; Daher lassen wir die Inhalte von AKSEP\projects\AKSEP-ALT (=> reference/v1_json_not_good) und AKSEP\projects\AKSEP\v_too_complicated (=> reference/v2_too_complicated) vorerst mal grundsätzlich unberührt.
- AKSEP\projects\AKSEP\v_simple ist die Version, mit welcher wir weiterarbeiten wollen; Deren Inhalt soll daher künftig so nah am Root des Repos sein wie es für ein Webseiten-Projekt-Repo üblich ist; Im Root soll ein Directory "reference" angelegt werden, worin unsere Referenzen abgelegt werden sollen.
- In AKSEP\projects\schoolsystem_DB befindet sich das angesprochene Projekt für eine Applikation zum Managen von Unterrichtsressourcen; Dessen Inhalt soll übergangsweise im Root in einem Directory "Schoolsystem" abgelegt werden, damit *ich* dessen Inhalt anschliessend ins neue Repo "Schoolsystem" verschieben kann.

Nun hört sich das ja im Grunde nach einer Aufgabe an, die ich auch einfach manuell hätte selbst machen können, ABER: v.a. im momentanen Root, aber auch sonst gefühlt im ganzen Repo verteilt, befinden sich Files mit Informationen, die teilweise beide Projekte (Website + Schoolsystem) simultan referenzieren/beschreiben (prominentestes Beispiel: die AGENTS.md im Root), Informationen enthalten zu einer Version des Website-Projekts, das nicht mehr aktuell ist (wie im Beispiel der README.md und DEVELOPER.md im Root - bzw. die README.md nicht direkt, sondern in diesem Falle die package.json, deren "scripts"-Befehle entweder schon seit einiger Zeit veraltet oder spätestens nach unserem geplanten Umbau nicht mehr aktuell sein werden) oder sich schlichtweg nicht (mehr) dort befinden, wo sie eigentlich hingehören;
Bevor wir daher damit beginnen, die Projekte dort hin zu schieben, wo sie hingehören, müssen wir zusehen, dass wir alles drum herum aufräumen; Die AGENTS.md im Root beispielsweise soll mit je einer Kopie sowohl in der aktuellen AKSEP\projects\AKSEP\v_simple der Webseite als auch in der AKSEP\projects\schoolsystem_DB einen Platz finden, jedoch jeweils bereinigt von Infos über das jeweils andere Projekt, während die ursprüngliche AKSEP\README.md anschliessend gelöscht wird; Ähnlich sieht's auch aus bei der DEVELOPER.md; Die Values.txt kann unverändert ins Root beider Projekte übernommen werden; Im Falle der package.json haben wir keine wirkliche Verwendung mehr haben für deren Inhalt, daher kann diese gänzlich entfernt werden, auch die .gitignore und .prittierignore im Root dürften redundant sein und entfernt werden können; Bei den Einstellungen (wie .vscode oder .github) müsstest du selbst schauen, ob und falls ja wo eine Übernahme dieser sinnvoll sein könnte; Es kann zwar sein, dass es dort vielleicht gar keine Fälle gibt, die eine entsprechende Korrektur verdienen, aber grundsätzlich gilt es ebenso auch bei den naheliegendsten Ordnerinhalten zu prüfen, ob es dort Dateien gibt, deren Inhalte woanders hingehören oder veraltet sind, um entsprechende Aufräum-Massnahmen zu unternehmen (Tiefer als bis in die jeweils ersten Child-Items der Projekt-Versions-Ordner brauchst du vermutlich nicht zu überprüfen).
Sobald AKSEP\projects\AKSEP-ALT, AKSEP\projects\AKSEP\v_too_complicated, AKSEP\projects\AKSEP\v_simple und AKSEP\projects\schoolsystem_DB also soweit saubere monolithische Objekte vorliegen, kannst du dich dran machen, deren Inhalte an die oben beschriebenen Positionen zu verschieben.

## Discovery
Status: READY

* Aktuelles Root enthält allgemeine Dateien (`README.md`, `DEVELOPER.md`, `Values.txt`, `AGENTS.md`, leeres `.gitignore`, `.prettierignore`, `package.json`) sowie einen simplen `docs/index.html`-Platzhalter.
* Website-Projekt liegt unter `projects/AKSEP/v_simple` (Vite-App mit eigenem `package.json`, `.gitignore`, `vite.config.ts`, `src/**` etc.). Frühere Versuche liegen unter `projects/AKSEP/v_too_complicated` (mit eigenem AGENTS) und `projects/AKSEP-ALT`.
* Schoolsuite-Projekt liegt unter `projects/schoolsystem_DB` mit Backend-, Frontend- und Skriptordnern.
* Keine zusätzlichen `AGENTS.md` außer Root + `v_too_complicated`; künftige Projektordner brauchen eigene bereinigte `AGENTS.md` und `DEVELOPER.md` Kopien.
* `Values.txt` soll in beiden Projektwurzeln vorliegen; Root-`package.json`, `.gitignore`, `.prettierignore`, README/DEVELOPER sind veraltet und müssen entfernt/neu strukturiert werden.
* Geplante Zielstruktur: Website-Inhalt (aktuell `v_simple`) ins Repo-Root; Referenzen nach `reference/v1_json_not_good` (aus `AKSEP-ALT`) und `reference/v2_too_complicated`; Schoolsuite in neues Root-Verzeichnis `Schoolsystem/`.

## Planning
Status: READY

Zuerst Projekt-spezifische Hilfsdateien vorbereiten (AGENTS/DEVELOPER/Values) in den bestehenden Ordnern, dann Altdaten bereinigen. Danach Referenzordner erstellen und historische Versionen verschieben, Website-Dateien in Root heben und Schoolsystem in temporären Root-Unterordner verschieben. Abschließend Altlasten entfernen und neue Struktur prüfen.

## Implementation Steps
Status: READY

1) projects/AKSEP/v_simple: Ablage vorbereiten – bereinigte `AGENTS.md`, `DEVELOPER.md`, Kopie `Values.txt` hinzufügen/aktualisieren.
2) projects/schoolsystem_DB: Bereinigte `AGENTS.md`, `DEVELOPER.md`, `Values.txt`-Kopie ergänzen.
3) Repo-Root: Nicht mehr benötigte Dateien entfernen/anpassen (`README.md`, `DEVELOPER.md`, `package.json`, `.gitignore`, `.prettierignore`, ggf. dokumentieren was bleibt) und `docs/index.html` Entscheidung treffen.
4) Referenzordner erzeugen (`reference/` mit Unterordnern) und Inhalte aus `projects/AKSEP-ALT` & `projects/AKSEP/v_too_complicated` verschieben.
5) Website-Projekt (`projects/AKSEP/v_simple`) in Root verschieben (bestehende Root-Dateien ersetzen, Ordner auflösen).
6) Schoolsystem-Projekt nach Root/`Schoolsystem/` verschieben und Ursprungspfad bereinigen.
7) Finaler Sweep: Entfernte leere Verzeichnisse kontrollieren, Plan/Docs aktualisieren, `TASK_DOCS.md` schreiben, Git-Status prüfen.

## Developer Interactions

## Checks & Pass Criteria
Status: READY

* `npm run build` (falls verfügbar) oder `npm run lint` **nicht** gefordert – Fokus auf Struktur; stattdessen `npm run test` nicht vorhanden → `npm run build` entfällt.
* Strukturprüfung: `tree`-ähnliche Kontrolle (z.B. `find` gefiltert) um neue Layouts zu verifizieren.
* `git status --short` zum Abschluss sauber.

## Risks / Rollback
Status: READY

* Großes Verschieben/Umbenennen – Risiko von Pfadverlusten. Rollback via Git (nicht pushen bis geprüft) möglich.
* Potenzielle Konflikte mit Root-Dateien (z.B. bestehendes `Values.txt`). Sicherstellen, dass gewünschte Kopien vorhanden sind, bevor Original gelöscht/ersetzt wird.

## Mode & Score
Mode: plan-gate, Score: 5 (reasons: >2 files, diff size, config removals, repo restructure)
