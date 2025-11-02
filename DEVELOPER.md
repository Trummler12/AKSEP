# Developer Guide — AKSEP Website (Vite)

## Setup
1. Install Node.js 18+.
2. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts
* `npm run dev` — Startet den Vite-Entwicklungsserver unter `http://localhost:5173`.
* `npm run build` — Erstellt den Produktionsbuild in `dist/`.
* `npm run preview` — (Optional) Vorschau des Builds.

## Arbeiten mit Git
* Feature-Branches verwenden (`feature/<kurzbeschreibung>`).
* Vor PRs sicherstellen, dass `npm run build` ohne Fehler durchläuft.
* Commits klein und thematisch halten.

## Projektstruktur
* `src/` enthält Komponenten, Styles und Assets.
* `src/components/` für wiederverwendbare Bausteine.
* `src/sections/` oder ähnliche Ordner beibehalten, falls vorhanden.
* `Values.txt` beherbergt zentrale Farben/Werte — bei Anpassungen dokumentieren.

## Qualitätssicherung
* Vor dem Commit Formatierung prüfen (`npm run lint`, falls hinzugefügt).
* Änderungen in der README dokumentieren, wenn neue Befehle/Abhängigkeiten hinzukommen.
