## Zweck dieses Dokuments

Diese Datei beschreibt die Struktur, Konventionen und Regeln für das Partei-Webseiten-Projekt **AKSEP**, insbesondere zur Verwaltung des Programms in drei Detaillierungsgraden (kurz, mittel, lang), zur Erstellung von Begriffsseiten und zur Pfadbenennung. Sie dient als Referenz für Agenten, Redakteur:innen und Tools zur konsistenten Weiterentwicklung des Webauftritts.

---

## Geltungsbereich

Wir befinden uns im Wurzelverzeichnis:
```
AKSEP/projects/AKSEP
```

---

## Dynamischer Webansatz

- Ziel ist, die Webseite grundsätzlich dynamisch zu gestalten; eine rein statische Umsetzung gilt als No-Go.
- Unklarheiten, etwa zur Nutzung von Eleventy mit YAML, werden zu einem späteren Zeitpunkt geklärt.

## Strukturübersicht

### 1. Hauptseiten

```plaintext
AKSEP/index.html               → (deutsche) Startseite
AKSEP/*/index.html             → Einfache Kern-Seiten
AKSEP/Programm/index.html      → Übersichtsseite zum Parteiprogramm
AKSEP/Begriffe/<begriff>/index.html
                                  → Begriffserklärungen
```

(Temporäre) Übersicht der aktuellen Ordnerstruktur:
AKSEP\projects\AKSEP\local-Tree.txt
WICHTIG: Diese Datei wird durch einen PowerShell-Befehl erzeugt; sie kann zwar zur temporären Dokumentation von Änderungen an der Dateistruktur verwendet werden, wird aber regelmäßig mit dem Status quo überschrieben.

Zusätzlich fasst `Planung.md` die bisherigen technischen Diskussionen zusammen und dient bei Fragen zur Webseiten-Struktur oder weiterführenden Planungen als Referenz.

---

### 2. Parteiprogrammstruktur

#### `kurz` (Wahlprogramm-Ebene, 1 Tiefe)

```plaintext
AKSEP/Programm/kurz/<AG>/index.html
```

* Pro Arbeitsgruppe (AG) eine Seite.
* Enthält stark komprimierte Zusammenfassung des Programms dieser AG.

#### `mittel` (Themenebene, 2 Tiefen)

```plaintext
AKSEP/Programm/mittel/<AG>/<Thema>/index.html
```

* Pro AG → mehrere Themen
* Eine HTML-Datei pro Thema.
* Enthält mittlere Programmlänge (thematisch gruppiert).
* HTML-Inhalt: Titel + Position des Themas innerhalb der AG.
* AGs ohne wirklichen Inhalt werden ignoriert

#### `lang` (Kapitelebene, 3 Tiefen)

```plaintext
AKSEP/Programm/lang/<AG>/<Thema>/<Kapitel>/index.html
```

* Tiefste Detailstufe
* Enthält vollständigen Text je Kapitel (inkl. Überschriftenstruktur, Fließtext, Tabellen).
* HTML-Inhalt:

  * Titel des Themas
  * Titel des Kapitels
  * Angabe des Themas (Nr. x) und Kapitels (Nr. y)

* AGs ohne wirklichen Inhalt werden ignoriert
---

## Namenskonventionen für Ordner

Alle `<AG>`, `<Thema>` und `<Kapitel>`-Pfadsegmente folgen **diesen Regeln**:

1. **Maximal 3–4 Wörter**

* Kurze, prägnante Zusammenfassung des vollständigen Titels mit Fokus auf Schlagwörtern
* „AG-“ zält NICHT als Wort
* Langformen → in `<h1>` und `<h2>` der `index.html`

2. **Nur Kleinbuchstaben, Bindestriche**

* `mein-thema-beispiel`
* **Keine Umlaute, Sonderzeichen oder Satzzeichen**
* Leerzeichen werden durch Bindestriche ersetzt

3. **Keine Strukturzeichen aus der Gliederung**

* Überschriftennummerierungen wie „1.“, „A.“, „#3“ werden entfernt

---

## Inhaltsformat in den Platzhalterdateien

### Beispiel: lang

```plaintext
AKSEP/Programm/lang/AG-Gesundheit/Reservepool-fuer-Pflegefachkraefte/Kernidee/index.html
```

```html
<h1>Reservepool für Pflegefachkräfte</h1>
<h2>Kernidee und Funktionsweise</h2>
<p>Thema 2, Kapitel 1</p>
```

### Beispiel: mittel

```plaintext
AKSEP/Programm/mittel/AG-Tierrechte/Umsetzungsstrategie/index.html
```

```html
<h1>Umsetzungsstrategie für Tierschutzmaßnahmen</h1>
<p>Thema 3</p>
```

### Beispiel: kurz

```plaintext
AKSEP/Programm/kurz/AG-Europa-und-Migration/index.html
```

```html
<h1>AG Europa und Migration</h1>
```

---

## Weitere Hinweise

* Die Datei `Programm-google-docs.html` enthält den aktuellen Inhalt des Programms, wie er gegenwärtig als 170-seitiges Google-Docs-Dokument vorliegt. Aus ihr werden die Namen und Reihenfolgen der AG-Themen und Kapitel extrahiert.
  * In der Vorbereitungsphase (Erstellung der Ordnerstruktur) reicht das Inhaltsverzeichnis vollends aus zur Orientierung.
* Die `AGENTS.md` wird nicht gelöscht, sondern fortlaufend gepflegt.
* Die `Begriffe`-Seiten bleiben ein paralleles Konzept zur Programmsicht, mit gleicher Pfadstruktur: `<begriff>/index.html` inkl. `<h1>`-Titel. Die Begriffe benötigen jedoch keine Indexierung, da diese stets alphabetisch sortiert sein sollen.
