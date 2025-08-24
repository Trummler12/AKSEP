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

| Feld               | Typ                      | Pflicht | Bedeutung / Regeln |
|--------------------|--------------------------|-------:|--------------------|
| `layout`           | String                   |    nein | `default` (Standard) oder `programm` (für `/programm/*`). In Section‑`_dir.yml` oder pro Seite. |
| `path.(lang)`      | Map\<string,string>      |    nein | Lokalisierte Slugs, z. B. `{ de:"programm", en:"program" }`. Fallback: fehlt Sprache → nimm `de`; fehlt `path` ganz → nimm **Ordnernamen** als `de`. Vererbbar (AG ➜ Thema ➜ Kapitel). |
| `edited`           | ISO‑8601‑Datum/Zeit      |    nein | **Manuelles** Redaktionsdatum (`YYYY‑MM‑DD` oder ISO‑Zeit). Wird **nicht** automatisch überschrieben. |
| `edited_git`       | ISO‑8601‑Datum/Zeit      |    nein | **Automatisch**: letztes Git‑Commit‑Datum für die Datei (vom Hook gesetzt). Anzeige gemeinsam mit `edited`. |
| `draft`            | Boolean                  |    nein | Wenn `true`, nicht veröffentlichen. Default `false`. |
| `tags.(lang)`      | Array\<string \| number> |    nein | Schlagwörter für Suche (sprachspezifisch). **Gewichtung erlaubt**: jedes **String‑Tag** kann **optional** von einem **Integer** *direkt danach* begleitet werden (Gewicht ≥1). Beispiel: `["Bildung", 3, "Schule"]` ⇒ Bildung=3, Schule=1. **Nicht‑String nach Nicht‑String** wird ignoriert. Parser normalisiert zu `{ label, weight }`. |
| `hreflang_exclude` | Boolean                  |    nein | Seite von hreflang ausschließen (Edge‑Fälle). |
| `aliases`          | String[]                 |    nein | Zusätzliche Pfade/Weiterleitungen; werden z. T. aus `path` generiert. |

**Hinweise**

- **Pfad‑Fallback:** i18n‑Strategie ist `prefix_except_default`. Fehlt `path.<lang>`, verwende den **deutschen Ordnernamen** und stelle den Sprachpräfix voran (z. B. `/en/...`). Aliasse können „schöne“ EN‑URLs ergänzen (`content-aliases.ts`).
- **`edited` vs. `edited_git`:** `edited` ist redaktionell und bleibt manuell; `edited_git` wird vom Hook immer auf das letzte Commit‑Datum gesetzt (keine Überschreibung von `edited`). Beide Werte dürfen im UI angezeigt werden (z. B. Tooltip).
- **Tags‑Validierung:** Der Linter warnt, wenn `tags.(lang)` fehlt. Ungültige Sequenzen (Nicht‑String nach Nicht‑String) werden beim Normalisieren ignoriert.

---

## 3) Spezifische Schemata pro Dateityp

### 3.1 Primärseiten (`content/<seite>/_dir.yml` & `_index.mdc`)

**\_dir.yml (optional):**

```yaml
layout: default
path:
  en: "press"     # Beispiel für /presse/ - nicht angegebene Sprachen nehmen path.de als Default, welcher wiederum per Default dem Ordnernamen entnommen wird
```

**\_index.mdc (Front‑Matter minimal):**

```mdc
---
edited: 2025-08-21
edited_git: null      # automatic
title:
  de: Presse
  en: Press
tags:
  de: ["Medien", "Nachrichten", "News"]
  en: ["media", "news"]
---
::variant{lang="de" simple=false}
# {{ title.de }}
… Inhalt …
::
::variant{lang="de" simple=true}
# {{ title.de }}
… Inhalt in einfacher Sprache …
::
::variant{lang="en" simple=false}
# {{ title.en }}
… content …
::
::variant{lang="en" simple=true}
# {{ title.en }}
… content in simple language …
::
```

(Alle Primärseiten folgen dem selben Muster.)&#x20;

---

### 3.2 Glossar

**begriffe/\_dir.yml** (Section‑Defaults, z. B. Pfadlokalisierung):

```yaml
layout: default
path:
  en: "glossary"
```

**begriffe/_terms/_dir.yml** (Defaults für Einträge):  
```yaml
autolink: true   # erste Vorkommen automatisch verlinken (Tooltipp)
```

**begriffe/_terms/<slug>.mdc** (Front‑Matter minimal):

```mdc
---
edited: 2025-08-18
edited_git: null      # automatic
title:
  de: Demokratie
  en: Democracy
synonyms:
  de: ["Volksherrschaft"]
  en: ["popular rule", "self-government"]
tags:
  de: ["Staatsform", 3, "Regierungsform"]   # Gewichtung: "Staatsform" = 3
  en: ["form of government", 3, "type of government"]
highlighted: false    # auf Glossar-Landing unter "Wichtige Begriffe" zeigen?
---
::variant{lang="de" simple=false}
# {{ title.de }}
… Definition …
::
::variant{lang="de" simple=true}
# {{ title.de }}
… Definition in einfacher Sprache …
::
::variant{lang="en" simple=false}
# {{ title.en }}
… definition …
::
::variant{lang="en" simple=true}
# {{ title.en }}
… definition in simple language …
::
```

---

### 3.3 Programm – **AG‑Ebene** (Programm-Root & Kurzfassung)

**programm/\_dir.yml** (Section‑Defaults):

```yaml
layout: programm
path:
  en: program
```

**programm/ag-XYZ/_dir.yml** (Beispiel: AG Regierung):  
```yaml
ag_id: 1
path:
  en: "ag-government"
```

**programm/ag-XYZ/\_index.mdc**:

```mdc
---
edited: 2025-08-17
edited_git: null      # automatic
ag:
  de: AG Regierung
  en: AG Government
tags:
  de: ["Medien", "Nachrichten", "News"]
  en: ["media", "news"]
---
::variant{lang="de" simple=false}
# {{ ag.de }}
… Inhalt …
::
::variant{lang="de" simple=true}
# {{ ag.de }}
… Inhalt in einfacher Sprache …
::
::variant{lang="en" simple=false}
# {{ ag.en }}
… content …
::
::variant{lang="en" simple=true}
# {{ ag.en }}
… content in simple language …
::
```

---

### 3.4 Programm – **Themen‑Ebene** (Mittlere Fassung)

**programm/ag-XYZ/thema-ABC/\_dir.yml** Beispiel: Reservepool für Pflegefachkräfte:

```yaml
thema_id: 2
path:
  en: "reserve-pool-for-nurses"
highlighted: true       # Startseiten‑Teaser
```

**programm/ag-XYZ/thema-ABC/\_index.mdc**:

```mdc
---
edited: 2025-08-17
edited_git: null      # automatic
thema:
  de: Reservepool für Pflegefachkräfte
  en: Reserve Pool for Nurses
tags:
  de: ["Pflege", "Gesundheit"]
  en: ["nursing", "health"]
---
::variant{lang="de" simple=false}
# {{ thema.de }}
… Inhalt …
::
::variant{lang="de" simple=true}
# {{ thema.de }}
… Inhalt in einfacher Sprache …
::
::variant{lang="en" simple=false}
# {{ thema.en }}
… content …
::
::variant{lang="en" simple=true}
# {{ thema.en }}
… content in simple language …
::
```

(Beispielthemen & Kapitellisten.)&#x20;

---

### 3.5 Programm – **Kapitel‑Datei** (Lange Fassung, pro Kapitel 1 Datei)

**programm/ag-XYZ/thema-ABC/01.mdc** (Beispiel: #1 Förderung einer pflanzenbasierten Ernährung):

```mdc
---
kapitel_id: 1           # Pflicht (Integer). Falls es ein 'Kapitel 0' gibt (z. B. "0. Einleitung"), dann hat das erste Kapitel kapitel_id=0, sonst 1. Die kapitel_id zählt unabhängig von Kapitel-Index/Dateinamen (auch wenn Dateinamen Buchstaben wie 'Q'/'Z' verwenden).
edited: 2025-08-17
edited_git: null        # automatic
kapitel:
  de: Förderung einer pflanzenbasierten Ernährung
  en: Promoting Plant-Based Nutrition
tags:
  de: ["Ernährung", "Klimaschutz"]
  en: ["nutrition", "climate protection"]
---
::variant{lang="de" simple=false}
## {{ kapitel.de }}
… Inhalt …
::
::variant{lang="de" simple=true}
## {{ kapitel.de }}
… Inhalt in einfacher Sprache …
::
::variant{lang="en" simple=false}
## {{ kapitel.en }}
… content …
::
::variant{lang="en" simple=true}
## {{ kapitel.en }}
… content in simple language …
::
```

* **Heading‑Level**: Thema‑Seite ist H1; Kapitel beginnen mit **H2**.
* **Deep‑Links**: Anker werden aus `kapitel_id` generiert (z. B. `#1`, `#15`), auch wenn die Datei `Q.mdc`/`Z.mdc` heißt.
  (Siehe Kapitellisten pro Thema.)&#x20;

---

### 3.6 Programm – **Changelog**

`content/programm/CHANGELOG.mdc` — rein redaktionell, frei strukturiert (Listen mit Datum/Autor/Betreff).&#x20;

---

## 4) Feldkatalog nach Ebene

> Grundregel: `_dir.yml` trägt **vererbbare Defaults** (sparsam einsetzen), `.mdc` trägt **Seiten-/Dokument‑eigene** Metadaten.  
> `tags` gehören in der Regel **in die `.mdc`** (nicht in `_dir.yml`).

### 4.1 Primärseiten

#### 4.1.1 `_dir.yml` (optional)
- **Erlaubt (sparsam):**
  - `layout` (`default`)
  - `path.(lang)` (z. B. `{ en: "press" }`)
- **Nicht hier pflegen:** `edited`, `tags` (gehören in `_index.mdc`)

#### 4.1.2 `_index.mdc` (Front‑Matter)
- **Pflicht:**
  - `edited` (manuell), `edited_git` (automatisch),
  - `title.(lang)`
- **Empfohlen/typisch:**
  - `tags.(lang)` *(mit optionalen Gewichten, siehe §2)*

### 4.2 Glossar

#### 4.2.1 `begriffe/_dir.yml`
- **Erlaubt:** `layout: default`, `path.(lang)` (z. B. `{ en: "glossary" }`)
- **Optional:** globale Defaults (z. B. `autolink: true`), die unter `_terms/` vererbt werden

#### 4.2.2 `begriffe/_terms/<slug>.mdc`
- **Pflicht:**
  - `edited`, `edited_git`,
  - `title.(lang)`
- **Empfohlen/typisch:**  
  - `synonyms.(lang): string[]`,  
  - `tags.(lang)` *(Gewicht möglich)*,  
  - `highlighted: true|false` (Default: `false` für „Wichtige Begriffe“ auf der Landing)

### 4.3 Programm – **AG‑Ebene**

#### 4.3.1 `programm/_dir.yml` und `programm/ag-*/_dir.yml`
- **Pflicht auf AG‑Ebene:** `ag_id` (Integer)  
- **Erlaubt:**  
  - `layout: programm`,  
  - `path.(lang)` (z. B. `{ en: "ag-government" }`)  
- **Titel‑Felder:** *nicht* duplizieren; **Quelle der Wahrheit ist die zugehörige `_index.mdc`** (`ag.(lang)`).  
  - Optionaler Workflow: per Hook/Script **virtuell injizieren** oder kontrolliert spiegeln.

#### 4.3.2 `programm/ag-*/_index.mdc` (KURZ)
- **Pflicht:**
  - `edited`, `edited_git`,
  - `ag.(lang)`
- **Empfohlen/typisch:**
  - `tags.(lang)` *(Gewicht möglich)*

### 4.4 Programm – **Themen‑Ebene**

#### 4.4.1 `programm/ag-*/<thema>/_dir.yml`
- **Pflicht:** `thema_id` (Integer)  
- **Optional:** `path.(lang)`, `highlighted: true|false`  
- **Titel‑Felder:** *nicht* duplizieren; **Quelle** ist `_index.mdc` (`thema.(lang)`).

#### 4.4.2 `programm/ag-*/<thema>/_index.mdc` (MITTEL)
- **Pflicht:**
  - `edited`, `edited_git`,
  - `thema.(lang)`
- **Empfohlen/typisch:**
  - `tags.(lang)` *(Gewicht möglich)*

### 4.5 Programm – **Kapitel‑Ebene** (LANG)

#### 4.5.1 `programm/ag-*/<thema>/<kapitel>.mdc`
- **Pflicht:**
  - **Pflicht**: `kapitel_id` (Integer, fortlaufend; z. B. 11, 12, 13, 14, 15 – auch wenn Dateinamen Q/Z heißen)
  - `edited`, `edited_git`,
  - `kapitel.(lang)`
- **Empfohlen/typisch:**  
  - `tags.(lang)` *(Gewicht möglich)*  
- **Hinweise:**  
  - Überschriften stehen im jeweiligen `::variant`‑Block.  
  - Anker aus `kapitel_id` (z. B. `#1`, `#Q`).

---

## 5) Validierungs‑ & Fallback‑Regeln (Build‑Zeit)

* **IDs vorhanden?**

  * Unter `/programm/ag-*`: `ag_id` muss gesetzt sein (AG‑Ebene).
  * Unter `/programm/ag-*/<thema>`: `thema_id` muss gesetzt sein (Themen‑Ebene).
  * In `*/{01,02,…,Q,z}.mdc`: `kapitel_id` muss gesetzt sein (Kapitel).
    (Vorgesehenes Modul: `content-ensure.ts` für Injection/Fehlerhinweise.)&#x20;

* **Sprach‑Fallbacks**

  * **Pfad**: fehlt `path.<lang>`, verwende DE‑Slug (Ordnername). (Alias‑Modul ergänzt optionale EN‑Alternativen.)&#x20;
  * **Inhalt**: fehlt `::variant{lang="en" …}`, zeige DE‑Variante mit Hinweis (nur im Frontend).
  * **Leichte Sprache**: fehlt `simple=true`, verwende `simple=false`.

* **Kapitel‑Sortierung**

  * Reihenfolge ergibt sich aus `kapitel_id` (numerisch sortiert).
  * **Keine separate `order`** (explizit so festgelegt).

* **`edited_git`**
  - Wird immer aus Git gesetzt (letztes Commit der Datei).
* **`edited`**
  - Rein manuell; wird **nicht** automatisch überschrieben.

* **Tags**
  - Warnung, wenn `tags.(lang)` fehlt (empfohlen, aber nicht zwingend).
  - Bei Gewichtung: Ein **String‑Tag** darf optional von einem **Integer ≥1** direkt gefolgt werden. Ungültige Sequenzen (Nicht‑String nach Nicht‑String) werden ignoriert. Die Normalisierung erzeugt `tags_index.(lang) = [{label, weight}]`.

---

## 6) Naming‑Konventionen & Formate

* **Slugs** (`path.<lang>`, Ordnernamen):

  * nur Kleinbuchstaben, `a–z`, Ziffern, Bindestrich `-` (keine Umlaute, Leerzeichen vermeiden)
  * DE‑Ordner sind **kanonisch**; weitere Sprachen via `path.<lang>`
* **IDs**:

  * `ag_id`, `thema_id`: Integer (≥ 1)
  * `kapitel_id`: Integer (≥ 0,1)
* **Datum**: `edited` als `YYYY‑MM‑DD` (oder `YYYY‑MM‑DDTHH:mm:ssZ` für volle ISO‑Zeit)
* **Booleans**: `highlighted`, `draft`, `autolink` → `true`/`false`

---

## 7) Appendix A – Quick Templates
- Primärseite: siehe §3.1 (Beispiel `_index.mdc`)
- Glossar‑Eintrag: siehe §3.2 (Beispiel `<slug>.mdc`)
- Programm/AG (kurz): siehe §3.3
- Programm/Thema (mittel): siehe §3.4
- Programm/Kapitel (lang): siehe §3.5

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
