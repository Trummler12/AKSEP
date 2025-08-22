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
                                                                    |
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

- **Pfad‑Fallback:** Fehlt `path.(lang)`, verwende den **deutschen Ordnernamen** (mit `/(lang)/`‑Präfix für (lang) != `de`). Aliasse können schöne EN‑URLs ergänzen (siehe `content-aliases.ts`).
- **`edited` vs. `edited_git`:** `edited` ist redaktionell und bleibt manuell; `edited_git` wird vom Hook immer auf das letzte Commit‑Datum gesetzt (keine Überschreibung von `edited`). Beide Werte dürfen im UI angezeigt werden (z. B. Tooltip).
- **Tags‑Normalisierung:** Ein Build‑Hook erzeugt aus `tags.(lang)` eine normalisierte Liste `tags_index.(lang) = [{ label, weight }]`.

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
… content in simple Language …
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

(Die Liste der Beispiel‑Begriffe siehst du hier.)&#x20;

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
  en: "ag-government"    # optional
ag:
  de: AG Regierung
  en: AG Government
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
… content in simple Language …
::
```

(Siehe Beispiel‑AGs/Struktur.)&#x20;

---

### 3.4 Programm – **Themen‑Ebene** (Mittlere Fassung)

**programm/ag-XYZ/thema-ABC/\_dir.yml** Beispiel: Reservepool für Pflegefachkräfte:

```yaml
thema_id: 2
path:
  en: "reserve-pool-for-nurses"
thema:
  de: Reservepool für Pflegefachkräfte
  en: Reserve Pool for Nurses
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
… content in simple Language …
::
```

(Beispielthemen & Kapitellisten.)&#x20;

---

### 3.5 Programm – **Kapitel‑Datei** (Lange Fassung, pro Kapitel 1 Datei)

**programm/ag-XYZ/thema-ABC/01.mdc** (Beispiel: #1 Förderung einer pflanzenbasierten Ernährung):

```mdc
---
kapitel_id: 1           # Pflicht (Integer; Falls es ein 'Kapitel 0' gibt (z.B. "0. Einleitung" oder "0. Vorwort"), dann ist für das erste Kapitel die kapitel_id=0, sonst 1. Die kapitel_id zählt ansonsten unabhängig vom Kapitel-Index bzw. Dateinamen, wobei diese im Regelfall einzig bei Buchstaben-basierten Indizes abweicht.)
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
… content in simple Language …
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
* **Optional**: `path.<lang>`, `layout: programm`
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
layout: programm
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
