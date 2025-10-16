# AGENTS.md — Schoolsuite (Unterrichtsressourcen)

**Scope:** Gilt für alle Dateien unter `projects/schoolsystem_DB` (später `Schoolsystem/`).

---

## 1) Arbeitsweise
* Primäre Sprache in Code & Commits: Englisch. Dokumentation für Anwender darf Deutsch sein.
* Behalte vorhandene Struktur (`backend/`, `public/`, `tests/`, etc.). Module nur umbenennen, wenn zwingend nötig und Dokumentation aktualisiert wird.

## 2) Entwicklung & Umgebung
* Python 3.11 empfohlen. Abhängigkeiten in `requirements.txt` pflegen.
* Lokales Setup:
  ```bash
  python -m venv .venv
  source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
  pip install -r requirements.txt
  ```
* Falls Frontend-Buildschritte erforderlich sind, dokumentiere neue Befehle in `README.md`.

## 3) Daten & Sicherheit
* Keine echten Schüler-/Benutzerdaten einchecken.
* Sensible Konfigurationen in `.env` oder Beispieldateien ablegen und im README erläutern.

## 4) Qualitätssicherung
* Unit-Tests in `tests/` ablegen; für neue Module entsprechende Tests ergänzen.
* Vor PRs relevante Tests ausführen, z.B. `pytest` oder projektspezifische Skripte.

## 5) Dokumentation
* `README.md` und `DEVELOPER.md` halten Setup, Architektur und Import-/Exportskripte aktuell.
* `Values.txt` enthält gemeinsame Farbcodes/Werte; bei Änderungen Hinweis ergänzen.
