# Developer Guide — Schoolsystem Resource Manager

## Lokales Setup
1. Stelle sicher, dass Python 3.11 installiert ist.
2. Lege ein Virtualenv an und installiere Abhängigkeiten:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
3. Falls MySQL/PostgreSQL benötigt wird, lies `schema.sql` und richte die Datenbank lokal ein.

## Projektstruktur (Kurzüberblick)
* `backend/` – API / Datenbank-Skripte.
* `public/` – Statische Assets oder Frontend-Prototypen.
* `tests/` – Automatisierte Tests (Python).
* `SchoolsystemCSV/`, `YouTubeToCSV/` – Import-/Exporthilfen.
* `Values.txt` – Farb- und Designreferenzen (geteilt mit Webauftritt).

## Wichtige Skripte
* `import.sh` / `import.bat` – CSV-Import-Helfer.
* Weitere Python-Skripte sind in den jeweiligen Unterordnern dokumentiert. Bitte README-Dateien aktualisieren, falls neue Skripte hinzukommen.

## Tests & Qualität
* Verwende `pytest` für Python-Tests, sofern eingerichtet:
  ```bash
  pytest
  ```
* Dokumentiere manuelle Testschritte, falls automatisierte Tests fehlen.
* Halte Branches sauber (`feature/<beschreibung>`), Commits klein und thematisch.

## Deployment-Hinweise
* Produktivzugänge/Secrets nie ins Repo legen.
* Änderungen am DB-Schema in `schema.sql` pflegen und migrieren.
