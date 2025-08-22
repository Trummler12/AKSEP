## 0) Zweck & Geltungsbereich

Dieses Dokument definiert **alle YAML/Front‑Matter‑Konventionen** für Inhalte unter `content/` sowie zugehörige *Content‑Pipeline*-Hooks/Validierungen. Es gilt für:

* **\_dir.yml** (vererbte Defaults pro Ordner/Section)
* **Front‑Matter** in `.mdc`‑Dateien (Seiten/Artikel/Programm‑Kapitel)
* **Globale Metadaten** in `content/_globals.yml` (optional)&#x20;

---

## 1) Dateitypen mit YAML und ihre Reihenfolge (Präzedenz)

**1.1 `content/_globals.yml` (optional, niedrigste Priorität)**
Site‑weite Defaults/Metadaten (z. B. `orgName`, globale `path`‑Vorgaben). Wird von *allen* tieferliegenden Ebenen überschrieben.&#x20;

**1.2 Section‑Ordner: `_dir.yml`**
Definiert vererbbare Defaults für alle direkten und indirekten Kinder innerhalb der Section:

* **Primärseiten** wie `start/`, `presse/`, `ueber-uns/` etc. (jeweils `_dir.yml` + `_index.mdc`)&#x20;
* **Glossar**: `begriffe/_dir.yml` und `begriffe/_terms/_dir.yml` (für alle Begriffe inkl. oder exkl. Landing Page)&#x20;
* **Programm**: `programm/_dir.yml` (für alle AGs), `programm/ag-*/_dir.yml` (für diese AG), `programm/ag-*/thema-*/_dir.yml` (für dieses Thema)&#x20;

**1.3 Front‑Matter in `.mdc`‑Dateien (höchste Priorität)**

* **Primärseite**: `content/<seite>/_index.mdc`
* **Glossar‑Eintrag**: `content/begriffe/_terms/<slug>.mdc` (ein Begriff pro Datei)&#x20;
* **Programm**:

  * **Kurz (AG)**: `programm/ag-*/_index.mdc`
  * **Mittel (Thema)**: `programm/ag-*/<thema>/_index.mdc`
  * **Lang (Kapitel)**: `programm/ag-*/<thema>/{01,02,…,Q,Z}.mdc` (je Datei **ein Kapitel**)&#x20;

**Vererbungs‑/Prioritätsregel:**
`Front‑Matter (.mdc)` ⟶ überschreibt ⟶ nächstliegendes `_dir.yml` ⟶ überschreibt ⟶ übergeordnetes `_dir.yml` ⟶ überschreibt ⟶ `content/_globals.yml`.

---

## 2) Gemeinsame Feldkonventionen (alle Typen)

| Feld               | Typ                 | Pflicht | Bedeutung / Regeln                                                                                                                                     |
| ------------------ | ------------------- | ------: | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `layout`           | String              |    nein | `default` (Standard) oder `program` (für `/programm/*`). Kann in Section‑`_dir.yml` gesetzt werden.                                                    |
| `path`             | Map                 |    nein | Lokalisierte Slugs je Sprache, z. B. `{ de: "programm", en: "program" }`. Fallback: wenn Sprache fehlt, nutze `de`. Vererbbar (AG ➜ Thema ➜ Kapitel).  |
| `edited`           | ISO‑8601‑Datum/Zeit |    nein | Zuletzt geändert. Wenn fehlt, wird per Hook aus `git log -1` gesetzt. **Format:** `YYYY‑MM‑DD` (oder vollständige ISO‑Zeit).                           |
| `draft`            | Boolean             |    nein | Wenn `true`, nicht veröffentlichen/anzeigen.                                                                                                           |
| `tags`             | String\[]           |    nein | Freie Schlagwörter (nicht für Sortierung).                                                                                                             |
| `hreflang_exclude` | Boolean             |    nein | Seite von hreflang ausschließen (Edge‑Fälle).                                                                                                          |
| `aliases`          | String\[]           |    nein | Zusätzliche Pfade/Weiterleitungen. Wird zum Teil automatisch aus `path` erzeugt.                                                                       |

**Hinweise**

* **Pfad‑Fallback:** Wenn `path.en` fehlt, wird der **deutsche Ordnername** verwendet (mit `/en/`‑Präfix). Alias‑Generierung kann zusätzliche „schöne“ EN‑URLs bereitstellen. (Siehe Modul `content-aliases.ts`.)&#x20;
* **`edited`‑Automatik:** Modul `content-edited-git.ts` trägt das Datum ein, falls im Front‑Matter nicht gesetzt.&#x20;

---

## 3) Spezifische Schemata pro Dateityp

### 3.1 Primärseiten (`content/<seite>/_dir.yml` & `_index.mdc`)

**\_dir.yml (optional):**

```yaml
layout: default
path: { en: "press" }   # Beispiel für /presse/
```

**\_index.mdc (Front‑Matter minimal):**

```md
---
edited: 2025-08-21
---
::variant{lang="de" simple=false}
# Presse
… Inhalt …
::
::variant{lang="en" simple=false}
# Press
… content …
::
```

(Alle Primärseiten folgen dem selben Muster.)&#x20;

---

### 3.2 Glossar

**begriffe/\_dir.yml** (Section‑Defaults, z. B. Pfadlokalisierung):

````yaml
layout: default
path: { en: "glossary" }
``` :contentReference[oaicite:16]{index=16}

**begriffe/_terms/_dir.yml** (Defaults für Einträge):  
```yaml
autolink: true   # erste Vorkommen automatisch verlinken (Tooltipp)
````

**begriffe/\_terms/<slug>.mdc** (Front‑Matter minimal):

```md
---
edited: 2025-08-18
synonyms:
  de: ["Synonym A", "Synonym B"]
  en: ["Synonym A", "Synonym B"]
level: 101         # optional: Komplexitätsgrad für Filter
---
::variant{lang="de" simple=false}
# Demokratie
… Definition DE …
::
::variant{lang="en" simple=false}
# Democracy
… definition EN …
::
```

(Die Liste der Beispiel‑Begriffe siehst du hier.)&#x20;

---

### 3.3 Programm – **AG‑Ebene** (Kurzfassung)

**programm/\_dir.yml** (Section‑Defaults):

````yaml
layout: program
path: { de: "programm", en: "program" }
``` :contentReference[oaicite:18]{index=18}

**programm/ag-XYZ/_dir.yml**:  
```yaml
ag_id: 1
path: { en: "government" }   # optional
````

**programm/ag-XYZ/\_index.mdc**:

```md
---
edited: 2025-08-17
---
::variant{lang="de" simple=false}
# AG Regierung – Kurzfassung
… kurze Fassung DE …
::
::variant{lang="en" simple=false}
# Working Group Government – Summary
… short EN …
::
```

(Siehe Beispiel‑AGs/Struktur.)&#x20;

---

### 3.4 Programm – **Themen‑Ebene** (Mittlere Fassung)

**programm/ag-XYZ/thema-ABC/\_dir.yml**:

```yaml
thema_id: 7
highlighted: true       # Startseiten‑Teaser
edited: 2025-08-18
```

**programm/ag-XYZ/thema-ABC/\_index.mdc**:

```md
---
edited: 2025-08-18
---
::variant{lang="de" simple=false}
# Regierungsform – Überblick
… mittlere Fassung DE …
::
::variant{lang="en" simple=false}
# Form of Government – Overview
… medium EN …
::
```

(Beispielthemen & Kapitellisten.)&#x20;

---

### 3.5 Programm – **Kapitel‑Datei** (Lange Fassung, pro Kapitel 1 Datei)

**programm/ag-XYZ/thema-ABC/01.mdc**:

```md
---
kapitel_id: 1          # Pflicht (Integer oder String wie "Q"/"Z")
edited: 2025-08-19
---
::variant{lang="de" simple=false}
## a) Die Politie als mögliches Ideal
… langer Inhalt DE …
::
::variant{lang="en" simple=false}
## a) The Politie as a Possible Ideal
… long content EN …
::
```

* **Heading‑Level**: Thema‑Seite ist H1; Kapitel beginnen mit **H2**.
* **Deep‑Links**: Anker werden aus `kapitel_id` generiert (`#1`, `#Q` …).
  (Siehe Kapitellisten pro Thema.)&#x20;

---

### 3.6 Programm – **Changelog**

`content/programm/CHANGELOG.mdc` — rein redaktionell, frei strukturiert (Listen mit Datum/Autor/Betreff).&#x20;

---

## 4) Feldkatalog nach Ebene

### 4.1 Section‑`_dir.yml` (alle Sections & Primärseiten)

* **Erlaubt**: `layout`, `path`, `edited` (nur für Landing‑Seiten sinnvoll), `draft`, `tags`
* **Nicht verwenden**: `ag_id`, `thema_id`, `kapitel_id` (nur Programm)

### 4.2 Programm – AG‑`_dir.yml`

* **Pflicht**: `ag_id` (Integer)
* **Optional**: `path.<lang>`, `layout: program`
* **Vererbt**: auf alle Themen/Kapitel unterhalb der AG

### 4.3 Programm – Thema‑`_dir.yml`

* **Pflicht**: `thema_id` (Integer)
* **Optional**: `highlighted` (Boolean), `edited` (ISO‑Datum), `path.<lang>`
* **Vererbt**: auf alle Kapitel im Thema

### 4.4 Programm – Kapitel‑Front‑Matter

* **Pflicht**: `kapitel_id` (Integer **oder** `Q`/`Z`)
* **Optional**: `edited`, `tags`, `draft`
* **Titel/Überschriften**: **stehen im jeweiligen `::variant`‑Block**, nicht im Front‑Matter (dein Wunsch)

### 4.5 Glossar‑Eintrag (Front‑Matter)

* **Optional**: `edited`, `synonyms.{de|en}: string[]`, `level` (Number), `autolink` (Boolean; Default kommt aus `_dir.yml`)

---

## 5) Validierungs‑ & Fallback‑Regeln (Build‑Zeit)

* **IDs vorhanden?**

  * Unter `/programm/ag-*`: `ag_id` muss gesetzt sein (AG‑Ebene).
  * Unter `/programm/ag-*/<thema>`: `thema_id` muss gesetzt sein (Themen‑Ebene).
  * In `*/{01,02,…,Q,Z}.mdc`: `kapitel_id` muss gesetzt sein (Kapitel).
    (Vorgesehenes Modul: `content-ensure.ts` für Injection/Fehlerhinweise.)&#x20;

* **Sprach‑Fallbacks**

  * **Pfad**: fehlt `path.<lang>`, verwende DE‑Slug (Ordnername). (Alias‑Modul ergänzt optionale EN‑Alternativen.)&#x20;
  * **Inhalt**: fehlt `::variant{lang="en" …}`, zeige DE‑Variante mit Hinweis (nur im Frontend).
  * **Leichte Sprache**: fehlt `simple=true`, verwende `simple=false`.

* **Kapitel‑Sortierung**

  * Reihenfolge ergibt sich aus `kapitel_id` (numerisch sortiert; Nicht‑Zahlen wie `Q`, `Z` werden **danach** alphabetisch eingefügt).
  * **Keine separate `order`** (explizit so festgelegt).

* **`edited`**

  * Wenn nicht im Front‑Matter gesetzt → `content-edited-git.ts` setzt `edited` auf das letzte Commit‑Datum.&#x20;

---

## 6) Naming‑Konventionen & Formate

* **Slugs** (`path.<lang>`, Ordnernamen):

  * nur Kleinbuchstaben, `a–z`, Ziffern, Bindestrich `-` (keine Umlaute, Leerzeichen vermeiden)
  * DE‑Ordner sind **kanonisch**; weitere Sprachen via `path.<lang>`
* **IDs**:

  * `ag_id`, `thema_id`: Integer (≥ 1)
  * `kapitel_id`: Integer **oder** Sondermarken `Q`, `Z`
* **Datum**: `edited` als `YYYY‑MM‑DD` (oder `YYYY‑MM‑DDTHH:mm:ssZ` für volle ISO‑Zeit)
* **Booleans**: `highlighted`, `draft`, `autolink` → `true`/`false`

---

## 7) Beispiele (Copy‑&‑Paste)

**7.1 AG‑`_dir.yml`**

```yaml
ag_id: 1
path: { en: "government" }
layout: program
```



**7.2 Thema‑`_dir.yml`**

```yaml
thema_id: 1
highlighted: true
edited: 2025-08-18
```



**7.3 Kapitel `01.mdc`**

```md
---
kapitel_id: 1
edited: 2025-08-19
---
::variant{lang="de" simple=false}
## a) Kritik an der (direkten) Demokratie
… DE …
::
::variant{lang="en" simple=false}
## a) Criticism of (Direct) Democracy
… EN …
::
```

(Die Kapitelstruktur ist z. B. bei „Regierungsform“/„Project Drawdown“ angedeutet.) &#x20;

**7.4 Glossar‑Eintrag `begriffe/_terms/toleranz.mdc`**

```md
---
edited: 2025-08-21
synonyms:
  de: ["Duldsamkeit"]
  en: ["forbearance", "tolerance (normative)"]
level: 101
---
::variant{lang="de" simple=false}
# Toleranz
… Definition …
::
::variant{lang="en" simple=false}
# Tolerance
… definition …
::
```

(Begriffe‑Liste siehe Verzeichnis.)&#x20;

---

## 8) Nicht‑Content‑YAML (nur der Vollständigkeit halber)

* **Decap CMS**: `public/admin/config.yml` – *kein* Teil der Content‑Konventionen, aber notwendig fürs Git‑CMS.&#x20;
* **Sitemap/Server**: YAML nicht nötig; Sitemap wird serverseitig aus Content generiert.&#x20;

---

## 9) Historie & Motivation

Die jetzt fixierten Felder folgen der (alten) JSON‑Modellierung: **Sprachvarianten + „einfache Sprache“ im selben Kapitel/Thema/AG**, inkl. `kapitel_id`‑basierter Reihenfolge und Topic‑Level‑Properties wie `highlighted`. Die YAML‑Felder bilden diese Struktur 1:1 als Front‑Matter/Directory‑Defaults ab. &#x20;

---

## 10) Linting & Checks (empfohlen)

* **`scripts/check-missing-variants.mjs`**: prüft pro `.mdc`, ob `de/en` vorhanden sind und ob `simple`‑Varianten fehlen (gibt Warnungen aus).&#x20;
* **`modules/content-ensure.ts`**: validiert `ag_id/thema_id/kapitel_id` abhängig vom Pfad.&#x20;
* **`modules/content-aliases.ts`**: erzeugt sprachspezifische Aliasse aus `path.<lang>` (EN‑Slugs), mit Fallback auf DE.&#x20;
