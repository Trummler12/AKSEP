These instructions apply globally unless a nested `AGENTS.md` overrides them.

## Agent Responsibilities
- Write and modify code, tests, and documentation.
- **Before each task**, ensure `main` matches the remote. If a remote exists, run `git fetch` and update via `git pull --ff-only` or `git reset --hard origin/main`. Note fetch errors in the summary.
- You may add new documentation pages and edit any file in /docs. Some subfolders are auto-synced; coordinate changes if edits might conflict.
- New tests are allowed. Mention them informally in the PR description.
- For significant restructures, suggest architecture changes rather than applying them directly. Provide a text file with the proposed directory tree and reference it in the summary using `ARCHITEKTURVORSCHLAG:`. Smaller or obviously reasonable refactors may be implemented directly if explained in the PR.

## Project Structure
- M319b-PythonZeugs: Several smaller Python projects; no dedicated branches.
- docs: Website repo; you may edit any file and add new pages. **Do not modify `docs/projects`;** this folder is overwritten by `npm run deploy` - same also goes for: `docs\changelog\index.html` (generated from the other files in its directory). Some subfolders are auto-synced; coordinate changes if there may be conflicts.
- M122-AutoZeugs: PowerShell automation scripts and helper snippets.
- m293-HTMLZeugs/m293-vm-starter: Eleventy-based HTML/CSS/JS starter; see README.md.
- m347-project-Trummler12: External module repo; agent may read/adopt code here.
- M162-SQLZeugs/Schoolsystem: Competence-level school DB project.
- zProjektZeugs/ListPuzzle: ListPuzzle project; built/tested via npm.
- QR Code Generator: `m293-HTMLZeugs/m293-vm-starter/src/.KI-Tests/QR-Code/index.html`.
- toTxt Converter: `m293-HTMLZeugs/m293-vm-starter/src/.KI-Tests/toTxt/index.html`.

## Coding Conventions
- Indentation: 2 spaces (no tabs).
- File naming: kebab-case for files, PascalCase for classes/components.
- Prefer `async/await` over raw promises.
- JSDoc comments on all exported functions.
- Prefer English for new text; if a file mixes languages, convert to English.

## 0. Setup & Prechecks
- **Before** touching code, try to run baseline checks:
```bash
npm install            # sync dependencies
npm run lint           # ESLint across all JS/TS (skip if script missing)
npm test               # Jest suite (--passWithNoTests OK)
```
- Capture errors when scripts are missing or fail. Attempt to debug before continuing.
- Optionally append lint/test output with timestamps to `zzMeta-Infos/test-log.txt` for troubleshooting.

## 1. Feature → Test → Debug Loop
For **each** change:
1. Implement exactly one feature or bugfix.
2. Immediately run lint and tests (skip missing scripts).
3. Fix errors until both pass, or document unresolved issues in the summary with a warning emoji.
4. Only after passing may the next feature begin.

## 2. Final Verification
After all features are done:
1. Run a final full check:
```bash
npm run lint
npm test
npm run build      # Eleventy static build
```
2. Debug until lint, test, and build all succeed (unless scripts are absent).
3. Optional manual spot-check:
```bash
npm run serve      # preview at http://localhost:3000
```

## 3. Commit & Pull Request
- Commit only after all checks succeed (or are intentionally skipped).
- Prefix branch names and commit titles with `<project-abbr>: ` when helpful (e.g. `LP: add levels`).
- PR titles may follow `[<Project Abbreviation>]: <short description>`. Break up umlauts (ä => ae) and avoid special characters.
- Keep the first commit line short; add bullet-style details below.

## 4. Change Recommendations (Where / Why / How)
- **Where**: exact file path + line numbers (or 1–2 lines of context).
- **Why**: single-sentence rationale.
- **How**: supply a diff. For snippets under 10 lines, embed inline.
- Use relative paths so deployed projects resolve correctly.

## 5. Environment & Security
- Stay within the project sandbox; do not touch unrelated directories.
- Allowed external URLs:
  - `registry.npmjs.org` for npm installs.
  - `pypi.org` for Python packages.
- Never prompt for or expose API keys or credentials.

## 6. Communication Style
- Keep where/why notes short.
- Respect nested `AGENTS.md` files.
- Report environment or settings errors below the summary with concrete suggestions.

## 7. Citations
- Use `F:<path>†L<start>(-L<end>)?` for file references.
- Use chunk IDs for terminal or test output references.
