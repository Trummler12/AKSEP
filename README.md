# AKSEP Webseite

Dieses Repository enthält die Vite-basierte Umsetzung der AKSEP-Webseite.
Das ursprüngliche Figma-Design ist verfügbar unter
<https://www.figma.com/design/dsXQEY2UzZVied0ZT0QVGg/Politische-Partei-Startseite>.

## Entwicklung starten

0. Basis-Installationen

**Node**
Visit <https://nodejs.org/en/download/package-manager/> => Button "Windows Installer (.msi)" => (installieren mit Default Settings)
Starte VSCode neu und/oder öffne ein neues Terminal:
```bash
node -v     # v24.11.0
npm -v      # 11.6.1
```

1. Projekt starten

frontend:
```bash
cd frontend
npm install
npm run dev
```

neues Terminal öffnen

```bash
cd backend
.\gradlew run # Irgendwas funktioniert noch nicht... D:
```

Für einen Produktionsbuild:

```bash
npm run build
```

## Projektstruktur

- `src/` – React/TypeScript-Quellcode und Assets.
- `reference/` – Historische Web-Prototypen (`v1_json_not_good`, `v2_too_complicated`) und alte Root-Dokumente.

## Weitere Hinweise

- Entwicklungsrichtlinien und Setup-Tipps stehen in `DEVELOPER.md`.
- Farb- und Designwerte befinden sich in `Values.txt` (wird mit dem Schoolsystem geteilt).
