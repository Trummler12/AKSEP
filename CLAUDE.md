# AKSEP Submodule — CLAUDE.md

> All base rules (Plan-Gate, Task Modes, Git Hygiene, Security, etc.) are inherited from the **parent repo's `CLAUDE.md`**. This file defines AKSEP-specific overrides and additions only.

---

## Project Map (AKSEP)

- **`src/`** — Vite + React/TS website (active). See `src/CLAUDE.md` for component conventions.
- **`Schoolsystem/`** — Python 3.11 database exercise docs. See `Schoolsystem/CLAUDE.md`.
- **`reference/v2_too_complicated/`** — Archived Nuxt 3 prototype; only touch when explicitly asked.
- **Root assets**: `README.md`, `Values.txt` (color palette), `docs/index.html`.
- **Generated / do not commit**: `.nuxt/`, `.output/`, `node_modules/`, `.vercel/`.

**Repo safety rail:** Do not modify parent repo files from within this submodule.

---

## Conventions (AKSEP-specific)

- **CSS/tokens**: reuse color variables from `Values.txt` when introducing new colors.
- **Content edits**: prefer Markdown/i18n files; see `src/CLAUDE.md` for component structure.
- **Language**: English for code & commits; German acceptable in content Markdown front-matter.

---

## Setup

```bash
# From parent repo root — installs deps and starts Nuxt preview:
npm run AKSEP

# Or from within src/:
npm install && npm run dev
```

**Legacy Eleventy** (`reference/v2_too_complicated/` when explicitly touched):
```bash
npm run build && npm run serve
```

---

## Task Scope Paths (examples)

When working in this submodule, typical scope paths are:
- `src/**` or `Schoolsystem/**` (whichever applies)
- `TASK_PLAN.md`, `TASK_DOCS.md`
