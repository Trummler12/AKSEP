# AGENTS.md — AKSEP Website (Nuxt 3 + @nuxt/content + @nuxtjs/i18n)

**Scope:** Gilt nur für dieses Teilprojekt (`AKSEP/projects/AKSEP`). Nächstgelegene `AGENTS.md` gewinnt; Root-Regeln gelten subsidiär (Plan-First etc.).

---

## 0) Wer macht was? (Rollen & Sprache)

**Inhaltsredaktion (Nicht-Programmierer) – Deutsch bevorzugt**
- Darf **nur** Inhalte pflegen in:
  - `content/**` (Markdown/MDC, Front-Matter, `_dir.yml`, `_globals.yml`)
  - `public/images/content/**` (Bilder für Inhalte)
  - `docs/UseCase.md`, `docs/TO-DO.md` (Textlisten, Status)
- Kein Zugriff auf: Build-/Konfig-Dateien, Nuxt/Vue Code.

**Entwickler – Englisch für Code & Kommentare**
- Pflegt Code in `src/**`, `server/**`, `modules/**`, `nuxt.config.ts`, `i18n.config.ts`, CI, Scripts.
- UI-Texte laufen über i18n/content (nicht hart im Code).

---

## 1) Projektkarte (wo finde ich was?)

- **Nuxt App Root**: `nuxt.config.ts`, `package.json`, `tsconfig.json`, `i18n.config.ts`.
- **Content (Git-CMS)**: `content/**` → Markdown/MDC + YAML, inkl. `_globals.yml`, `_dir.yml`, Seiten-Front-Matter.
- **Code**: if `srcDir` is configured → `src/**`; otherwise use root-level `components/**`, `pages/**`, `layouts/**`, `composables/**`, `stores/**`, `locales/**`.
- **Server**: `server/routes/**` (z.B. `sitemap.xml.ts`).
- **Öffentlich**: `public/**` (Uploads, Bilder, `admin/` für Decap).
- **Doku**: `docs/**` → Architektur, YAML-Konventionen, Trees.
- **Referenzbäume**: `docs/Verzeichnisbaum.txt` (kompakt), `docs/Verzeichnisbaum-DETAILLIERT.txt` (detail), `docs/local-tree.txt` (aktueller Stand).
- **CI/CD**: `.github/workflows/**` (ci.yml, deploy.yml).

> Siehe die Baum-Dateien in `docs/` für Pfadbeispiele zu `content/start`, `content/begriffe/_terms`, `public/admin/config.yml`, `public/uploads/` usw.

**Nicht manuell bearbeiten / committen:**
`.nuxt/`, `.output/`, `node_modules/`, generierte Artifacts; Uploads unter `public/uploads/**` gelten als Assets.

---

## 2) Autorieren von Inhalten (Redaktion)

- **Varianten & Sprache:** Verwende in `.mdc` die Blöcke  
  `::variant{lang=de|en, simple=true|false}` für DE/EN & Einfache Sprache.
- **Titel & Labels:** Gehören in die **Front-Matter** der Seite. Nicht zusätzlich in `_dir.yml` duplizieren.
- **i18n-Pfadregeln:** DE ohne Präfix, EN unter `/en/...`. Fehlt `path.en`, fällt EN auf den DE-Slug zurück.
- **Glossar:** Einträge in `content/begriffe/_terms/*.mdc`; Defaults in `content/begriffe/_terms/_dir.yml` (z.B. `autolink: true`).
- **Programmstruktur:**  
  - AG-Ebene: `content/programm/ag-*/_index.mdc` (+ `_dir.yml` mit `ag_id`)  
  - Themen-Ebene: `content/programm/ag-*/<thema>/_index.mdc` (+ `_dir.yml` mit `thema_id`)  
  - Kapitel: `.../<thema>/{01,02,…,Q,Z}.mdc` mit `kapitel_id` (H2-Überschriften im jeweiligen Variant-Block)
- **Tags (optional gewichtet):** `["tag", "begriff 3", "foo 2"]` → die Zahl ist das Gewicht.

**Bilder einbinden:** Lege redaktionelle Bilder unter `public/images/content/` ab und referenziere sie relativ (z.B. `/images/content/foo.png`).  
**Redirects/Aliasse:** Werden durch das Alias-Modul generiert – keine manuellen Redirect-Dateien anlegen.

---

## 3) TO-DO.md — leichte Konvention

Datei: `docs/TO-DO.md`
- **Format (eine Zeile pro Task):**  
  `- [P2][content] Glossar: 5 neue Begriffe einpflegen (Owner: Max) — status: todo`
- **Buckets (Beispiele):** `[content]`, `[feat]`, `[i18n]`, `[a11y]`, `[seo]`, `[design]`, `[infra]`
- **Priorität:** `P1` (hoch), `P2`, `P3`  
- **Status:** `todo | doing | review | done`
- **Optional:** Verweise `(#usecase-xyz)` auf Abschnitte in `docs/UseCase.md`.

Das ist absichtlich simpel und git-freundlich; spätere Migration in Issues/Projektboard bleibt offen.

---

## 4) Entwickler-Konventionen (Nuxt/Vue/Content)

- 2 Leerzeichen, TS `strict`, kein `any`; Komponenten **PascalCase**, Dateien **kebab-case**.
- Vue SFC: `<script setup lang="ts">`; Composables in `src/composables`.
- Asynchron: `async/await`; JSDoc auf exportierten Utilities.
- CSS: Tokens/Variablen; Farbpalette kann `AKSEP/Values.txt` referenzieren.
- **Content-Präzedenz:** Front-Matter → nächstes `_dir.yml` → Eltern `_dir.yml` → `content/_globals.yml`.

---

## 5) Arbeitsablauf (Plan-First → kleine Changes → PR)

**Plan-First (geerbt von Root):** Vor Codeänderungen `TASK_PLAN.md` mit konkreten Schritten & Checks erstellen, *einzeln committen*; erst nach Freigabe coden.

**Setup (Auto-PM per Lockfile):**
```bash
# Paketmanager wählen
if [ -f pnpm-lock.yaml ]; then PM=pnpm;
elif [ -f package-lock.json ]; then PM=npm;
elif [ -f yarn.lock ]; then PM=yarn;
else PM=npm; fi

# (optional) Corepack aktivieren
command -v corepack >/dev/null 2>&1 && corepack enable || :
[ -f .nvmrc ] && command -v nvm >/dev/null 2>&1 && nvm use || :

# Install (CI-freundlich)
if [ "$PM" = "pnpm" ]; then pnpm install --frozen-lockfile;
elif [ "$PM" = "yarn" ]; then yarn install --immutable;
elif [ -f package-lock.json ]; then npm ci;
else npm install; fi

# Skripte (wenn vorhanden)
$PM run lint || :
$PM test || :
[ -f tsconfig.json ] && ( $PM run -s typecheck || $PM exec tsc --noEmit || $PM run -s tsc --noEmit ) || :

# Nuxt
$PM run build   || :
$PM run preview || :
$PM run start   || :    # production start (see README)
$PM run dev     || :    # nur lokal
```

**Content-Hilfen (falls Scripts existieren):**
```bash
node scripts/check-missing-variants.mjs   || :
node scripts/generate-en-aliases.mjs      || :
node scripts/build-chapters-toc.mjs       || :
```

**Per-Change-Loop:** 1 Änderung → Lint/Tests/Typecheck → fixen → nächste Änderung.
**Finale Checks:** `$PM run lint/test/build` + ggf. `preview` (kein Merge bei Rot).

**PR-Checkliste (leicht):**
* [ ] Lockfile unverändert (oder begründen)
* [ ] Keine Live-Netzwerk-Calls in Build/Tests
* [ ] Nichts unter `.nuxt/**`, `.output/**`, `node_modules/**` geändert
* [ ] Änderungsumfang ≲ \~200 LOC (oder begründen)

---

## 6) Dateizugriffs-Matrix (Kurz)

| Bereich                                  | Redaktion | Dev |
| ---------------------------------------- | :-------: | :-: |
| `content/**`, `_globals.yml`, `_dir.yml` |     ✔️    |  ✔️ |
| `public/images/content/**`               |     ✔️    |  ✔️ |
| `docs/UseCase.md`, `docs/TO-DO.md`       |     ✔️    |  ✔️ |
| `nuxt.config.ts`, `i18n.config.ts`       |     ❌     |  ✔️ |
| `src/**`, `modules/**`, `server/**`      |     ❌     |  ✔️ |
| `.github/**`, `scripts/**`               |     ❌     |  ✔️ |

---

## 7) Sicherheit & Qualität

* Keine Secrets committen; neue Env-Variablen in `.env.example` dokumentieren.
* Tests sind **offline by default**; Network-Tests markieren und in CI standardmäßig skippen.
* Generierte Artifacts nie manuell bearbeiten – immer die Quelle anpassen.

---

## 8) Nützliche Wegweiser

* Projektübersicht & aktuelle Struktur: `docs/Verzeichnisbaum.txt`, `docs/Verzeichnisbaum-DETAILLIERT.txt`, `docs/local-tree.txt`
* YAML-Konventionen: `docs/yaml.md`
* Use-Cases (Inhalt/Priorisierung): `docs/UseCase.md`
* Farbwerte global: `AKSEP/Values.txt`
* Dev-Setup/Start: `README.md` (in diesem Ordner)
