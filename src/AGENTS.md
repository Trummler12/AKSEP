# AGENTS.md — AKSEP Website (Vite Version)

**Scope:** Gilt für alle Dateien unterhalb von `src/` (Teil der Vite-Webseite). Root-Regeln aus `AGENTS.md` gelten weiterhin.

---

## 1) Allgemeine Erwartungen
* Code-Kommentare und Commits in Englisch; UI-Texte dürfen Deutsch sein.
* Bewahre die bestehende Komponentenstruktur (`components/`, `content/`, `styles/`).
* Assets unter `src/assets/` organisieren.

## 2) Entwicklung & Build
* Paketmanager: `npm`.
* Basisbefehle:
  ```bash
  npm install
  npm run dev
  npm run build
  ```

## 3) Stil & Codequalität
* TypeScript mit 2 Leerzeichen einrücken.
* Komponenten möglichst als funktionale React-Komponenten halten.
* Nutze Werte aus `Values.txt` für Farben/Spacing, statt Hard-Coding.

## 4) Inhalte & Assets
* Redaktionelle Texte in klar getrennten Dateien (z.B. unter `src/content/`).
* Bilder vor dem Commit optimieren.

## 5) Dokumentation
* Architekturänderungen in `README.md` bzw. `DEVELOPER.md` festhalten.
