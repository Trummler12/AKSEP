# YAML Front Matter Reference

This document captures the agreed-upon YAML variables and Eleventy settings for the program pages under `AKSEP/projects/AKSEP/src/de/Programm`.

## General Notes
- Directory names `<AG>`, `<Thema>`, and `<Kapitel>` provide the slugs; explicit `ag_slug` or `thema_slug` variables are not stored.
- `ag`, `thema`, and `kapitel` contain the full titles exactly as written in `Programm-google-docs.html`.
- `ag_id`, `thema_id`, and `kapitel_id` are numeric indices used for navigation and ordering.
- `permalink: false` prevents Eleventy from generating standalone pages for these chapter source files.
- A synchronisation script will later propagate title changes from the `kurz` level to all `mittel` and `lang` files.

## Detailed level: `lang`
Files live at  
`AKSEP/projects/AKSEP/src/de/Programm/lang/<AG>/<Thema>/<Kapitel>.md`.

Each chapter carries the following front matter:

```yaml
---
layout: null            # no individual layout; content is assembled into the theme page
ag: "<AG>"              # e.g. "AG Klimaschutz"
ag_id: <id>             # used for navigation across AGs
thema: "<Thema>"        # e.g. "Wissenschaftlich fundierte Re-Evaluation offizieller Ernährungsempfehlungen"
thema_id: <id>          # used for navigation across themes
kapitel: "<Kapitel-Titel>" # e.g. "Grenzen als Instrument der systematischen Erfassung und Sicherheit"
kapitel_id: <id>        # chronological order within the theme
permalink: false
tags:
  - "<Thema>"           # collects all chapters of the same theme
---
## {{ kapitel }}
Content …
```

To render a complete theme page, create  
`AKSEP/projects/AKSEP/src/de/Programm/lang/<AG>/<Thema>/index.md`:

```markdown
---
layout: <layout-file>
ag: "<AG>"
ag_id: <id>
thema: "<Thema>"
thema_id: <id>
templateEngineOverride: njk,md
tags:
  - "<Thema>"
---

# {{ thema }}

{% for kapitel in collections[thema] | sort(attribute='data.kapitel_id') %}
## {{ kapitel.data.kapitel }}
{{ kapitel.templateContent | safe }}
{% endfor %}
```

This `index.md` aggregates all chapter files tagged with `<Thema>` and sorted by `kapitel_id`.

## Medium level: `mittel`
Files live at  
`AKSEP/projects/AKSEP/src/de/Programm/mittel/<AG>/<Thema>.md`.

Front matter:

```yaml
---
layout: <layout-file>
ag: "<AG>"              # full AG title
ag_id: <id>             # AG navigation ID
thema: "<Thema>"        # full theme title
thema_id: <id>          # theme navigation ID
tags:
  - "<Thema>"
---
# {{ thema }}
Content …
```

Each file corresponds to exactly one theme; no additional aggregation is required.

## Short level: `kurz`
Files live at  
`AKSEP/projects/AKSEP/src/de/Programm/kurz/<AG>.md`.

Front matter:

```yaml
---
layout: <layout-file>
ag: "<AG>"              # full AG title
ag_id: <id>             # navigation ID between AGs
tags:
  - "<Thema>"           # optional tag referencing a key theme of this AG
---
# {{ ag }}
Content …
```

The `kurz` layer provides one summary page per AG.

## Synchronisation
When an AG or theme title changes, update the relevant `kurz` file. A dedicated script will cascade the revised titles and IDs to all `mittel` and `lang` files so that metadata stays consistent across all levels.

