# Migration Plan: Eleventy to Angular

This document describes how the AKSEP web project migrates from the current Eleventy setup in `src_alt` to a new Angular application. It supplements `Verzeichnisbaum.txt`, which sketches the target directory tree.

## Overall Strategy

1. **Angular project creation**
   - In `projects/AKSEP`, run `npx @angular/cli@latest new angular-app --routing --style=scss --strict`.
   - The project is generated under `projects/AKSEP/angular-app`. All subsequent steps operate inside this directory.
2. **Asset migration**
   - Copy files from `src_alt/assets` to `angular-app/src/assets`.
   - Keep `src_alt` unchanged to preserve the Eleventy snapshot until migration completes.
3. **Feature modules and routing**
   - Use Angular routing with lazy loading. Each major page becomes a feature module:
     - `start`
     - `begriffe`
     - `programm`
     - `kontakt`
     - `mitglied-werden`
     - `presse`
   - The programme module renders all detail levels (kurz/mittel/lang und einfache Sprache) based on URL parameters and YAML data instead of separate sub‑modules.
   - The router maps the former Eleventy URLs to these modules.
4. **i18n and dark mode**
   - Install and configure `@ngx-translate/core` for internationalisation.
   - Store language files under `angular-app/src/assets/i18n/<lang>.json`.
   - Global styles in `styles.scss` enable dark mode by default.
5. **Cookie notice**
   - Implement a reusable cookie‑notice component in `shared/components/` and invoke it from the root layout.
6. **Backend and dynamic content**
   - Markdown content from `src_alt` is gradually converted to YAML. Angular services load these files or fetch them via API once a backend exists.
7. **Eleventy removal**
   - After Angular covers all pages and dynamic behaviour, Eleventy tooling may be removed. If a static preview is still required, retain Eleventy as a separate optional command.

## YAML Data Model

Three variable scopes govern YAML files:

1. **Project‑wide globals** – reusable across the entire site (party name, navigation). Maintain them in `angular-app/src/assets/data/globals.yaml`.
2. **File‑level globals** – identifiers constant across languages within a content file. Typical keys: `layout`, `ag_id`, `thema_id`, `kapitel_id` (all integers).
3. **Language‑specific fields** – text and tags that vary by language. Use a `languages` object where each key is a language code.

Higher-level YAML files can provide defaults (e.g. `Programm/Programm.yaml` sets `layout: "layout.njk"`). Child files inherit these values via Eleventy's data cascade or by merging parent objects in Angular's data service.

### Examples

#### `Programm/AG-Beispiel.yaml` (kurz)
```yaml
# layout inherited from Programm.yaml
ag_id: 1
languages:
  de:
    ag: "AG Beispiel"
    contents: |
      # {{ ag }}

      Deutsche Wahlprogramm-Fassung (in einfacher Sprache)
    simple: |
      # {{ ag }}

      Deutsche Wahlprogramm-Fassung (in einfacher Sprache)
    tags: []
  en:
    ag: "AG Example"
    contents: |
      # {{ ag }}

      English manifesto version (plain language)
    simple: |
      # {{ ag }}

      English manifesto version (plain language)
    tags: []
```

#### `Programm/AG-Beispiel/thema-a.yaml` (mittel)
```yaml
# layout and ag_id inherited from AG-Beispiel.yaml
thema_id: 2
languages:
  de:
    # ag inherited from AG-Beispiel.yaml
    thema: "Thema A"
    contents: |
      # {{ thema }}

      Zusammengefasste Deutsche Fassung (in einfacher Sprache)
    simple: |
      # {{ thema }}

      Zusammengefasste Deutsche Fassung (in einfacher Sprache)
    tags: []
  en:
    # ag inherited from AG-Beispiel.yaml
    thema: "Topic A"
    contents: |
      # {{ thema }}

      Condensed English version (plain language)
    simple: |
      # {{ thema }}

      Condensed English version (plain language)
    tags: []
```

#### `Programm/AG-Beispiel/thema-a/kapitel-1.yaml` (lang)
```yaml
# layout, ag_id and thema_id inherited from thema-a.yaml
kapitel_id: 1
languages:
  de:
    # ag and thema inherited from thema-a.yaml
    kapitel: "Kapitel 1"
    contents: |
      # {{ kapitel }}

      Ausführliche Deutsche Fassung (in einfacher Sprache)
    simple: |
      # {{ kapitel }}

      Ausführliche Deutsche Fassung (in einfacher Sprache)
    tags: []
  en:
    # ag and thema inherited from thema-a.yaml
    kapitel: "Chapter 1"
    contents: |
      # {{ kapitel }}

      Comprehensive English version (plain language)
    simple: |
      # {{ kapitel }}

      Comprehensive English version (plain language)
    tags: []
```

#### Startseite (`Start/index`)
```yaml
layout: "layout.njk"
languages:
  de:
    title: "Willkommen bei AKSEP"
    contents: |
      Einstiegstext und Aufruf zum Mitmachen …
  en:
    title: "Welcome to AKSEP"
    contents: |
      Intro text and call to action …
```

#### Mitglied werden (`Mitglied-werden/index`)
```yaml
layout: "layout.njk"
page: mitglied-werden
languages:
  de:
    title: "Mitglied werden"
    contents: |
      Informationen zum Beitritt und Formularlinks …
  en:
    title: "Become a member"
    contents: |
      Information on joining and form links …
```

#### Presse (`Presse/index`)
```yaml
layout: "layout.njk"
page: presse
languages:
  de:
    title: "Presse"
    contents: |
      Ansprechpartner, Logos und aktuelle Mitteilungen …
  en:
    title: "Press"
    contents: |
      Contacts, logos and current releases …
```

## Next Steps

1. Review and refine `Verzeichnisbaum.txt`.
2. Execute the Angular CLI command from the top-level `projects/AKSEP` directory.
3. Gradually migrate content from `src_alt` into Angular components and YAML data files using the structures above.
4. Remove Eleventy tooling once the Angular app can serve all pages with dynamic content and live preview.
