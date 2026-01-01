# USE_CASES.md — Fachliche Anwendungsfälle

Dieses Dokument beschreibt die fachlichen Anwendungsfälle der aktuellen Projektiteration.  
Ziel: klarer, minimaler Funktionsumfang, der mit den vorhandenen zeitlichen Ressourcen umsetzbar ist.

**Scope dieser Iteration:**
- Nur **lesende Funktionalität** (Browse & Suche von Topics und Ressourcen)
- Keine Login-Funktion, keine Personalisierung, kein Tracking von Interaktionen
- Ressourcen werden **Topics** zugewiesen, nicht TopicLevels
- Tags werden ausschließlich auf **Englisch** gepflegt (Synonyme möglich), keine Lokalisierung für Tags

---

## 0. Globale Rahmenbedingungen

- Frontend: HTML/CSS/JS (separates Modul)
- Backend: Java (CSV-basiertes Domain-Modell, keine echte DB)
- Sprachen:
  - UI ist grundsätzlich auf Mehrsprachigkeit vorbereitet.
  - Für diese Iteration ist **nur Englisch („en“) als UI-Sprache vorgesehen**.
  - Fallback-Regel: Wenn für eine gewünschte Sprache kein Text vorhanden ist, wird **„en“** verwendet.
- Themes:
  - Darkmode / Lightmode umschaltbar
  - Default: Darkmode, falls weder System- noch Browser-Preference bekannt ist

---

## UC-01: Root-Redirect auf `/start`

**Ziel:**  
Nutzende Personen, die die Root-URL aufrufen, sollen automatisch auf eine definierte Startseite geführt werden.

**Akteur:**  
Anonyme nutzende Person (kein Login).

**Vorbedingung:**
- Anwendung ist erreichbar unter `/`.

  - Hinweis, ob eine Ressource Teil einer Playlist/Kurs-Gruppe ist, inkl. Link zu einer Gruppenseite mit allen Ressourcen in der vorgegebenen Reihenfolge.

**Ablauf (Happy Path):**
1. Nutzende Person ruft `GET /` im Browser auf.
2. System leitet mit einem Redirect (z. B. HTTP 302) auf `GET /start` weiter.
3. Browser ruft `/start` auf und rendert die Startseite.

**Varianten / Fehlerfälle:**
- `/start` ist nicht implementiert oder liefert Fehler → Anzeige einer verständlichen Fehlermeldung (z. B. 500/404).

---

## UC-02: Theme-Umschaltung (Darkmode / Lightmode)

**Ziel:**  
Nutzende Personen können zwischen Darkmode und Lightmode wechseln.

**Akteur:**  
Anonyme nutzende Person.

**Vorbedingungen:**
- UI-Theme-Komponente ist vorhanden (z. B. Toggle-Schalter im Header/Settings).
- Browser unterstützt grundlegende CSS/JS.

**Regeln:**
- Default-Theme:
  - Falls System- oder Browser-Preference (prefers-color-scheme) erkennbar: diese verwenden.
  - Falls nicht erkennbar: **Darkmode** als Standard.
- User-Entscheidungen (Theme-Wahl) sollen für die Session (oder per LocalStorage) gespeichert werden.
- Besonderheit:
  - Ein Theme-Cookie (oder entsprechender Eintrag) wird nur für „nicht dark“ gespeichert.
  - Beim Wechsel **auf** Darkmode wird ein vorhandenes Theme-Cookie explizit entfernt.

**Ablauf (Happy Path):**
1. Startseite (`/start`) wird geladen.
2. System ermittelt das initiale Theme:
   - User-Setting (z. B. LocalStorage) → falls vorhanden.
   - sonst System-/Browser-Theme.
   - falls beides nicht ermittelt werden kann: Darkmode.
3. Nutzende Person klickt auf Theme-Toggle (z. B. „Light/Dark“ Schalter).
4. System wechselt das Theme (z. B. CSS-Klasse):
   - UI wird sofort angepasst.
   - Einstellung wird gespeichert, so dass sie beim nächsten Seitenaufruf wiederhergestellt wird.

**Fehlerfälle:**
- LocalStorage o. Ä. nicht verfügbar → Theme-Umschaltung wirkt trotzdem, Persistenz entfällt.

---

## UC-03: Sprache wählen (mit Fallback)

**Ziel:**  
Nutzende Person kann die UI-Sprache auswählen. Wenn ein Text in der gewünschten Sprache fehlt, wird Englisch angezeigt.

**Akteur:**  
Anonyme nutzende Person.

**Vorbedingungen:**
- UI bietet eine Sprach-Auswahl (z. B. Dropdown oder Button).
- Domain-Modell kennt `LanguageCode` und `LocalizedText`.

**Regeln:**
- In dieser Iteration ist effektiv nur **„en“** als Auswahl relevant, die Mechanik soll aber so gestaltet sein, dass sich später weitere Sprachen ergänzen lassen.
- Fallback-Regel für `LocalizedText`:
  - `get(selectedLanguage)` → falls vorhanden, anzeigen.
  - sonst `get(en)` → falls vorhanden, anzeigen.
  - sonst: klarer Platzhalter (z. B. `"[no data available]"`).

**Ablauf (Happy Path):**
1. Nutzende Person öffnet eine Seite (z. B. `/topics`).
2. UI startet mit Sprache „en“.
3. (Später) Nutzende Person könnte eine andere Sprache auswählen.
4. UI lädt die Texte in der gewählten Sprache bzw. zeigt englische Texte als Fallback.

---

## UC-04: Navigation zu Topics-Übersicht `/topics`

**Ziel:**  
Nutzende Person kann eine gefilterte, sortierbare Liste aller Topics anzeigen.

**Akteur:**  
Anonyme nutzende Person.

**Vorbedingungen:**
- Topic-Katalog (Topics, TopicTypes, ggf. Levels, Tags) ist im Backend geladen.

**Filter-/Sortierparameter:**
- `max_layer` (int, min 0, max 7, default 2)
  - Liste zeigt nur Topics mit `layer <= max_layer`.
- `show_courses` (bool, default `true`)
  - Kurse (Course-Topics) werden nur angezeigt, wenn `true`.
- `show_achievements` (bool, default `false`)
  - Achievements werden nur angezeigt, wenn `true`.
- `sort_by` (Enum)
  - Mögliche Werte (für diese Iteration minimal): `name`, `layer`
  - Optional erweiterbar: `resource_count`, etc.
- `indent_per_layer` (int, min 0, max 8, default 0)
  - Darstellung: jedes Topic wird um `layer * indent_per_layer` Leerzeichen eingerückt.
  - Die Einrückung kann im Frontend als CSS-Margin umgesetzt werden (ggf. Umbenennung in `indent_px_per_layer`).

**Ablauf (Happy Path):**
1. Nutzende Person navigiert zu `/topics`.
2. System lädt alle Topics aus dem Backend (inkl. Typ & Layer).
3. System wendet Default-Filter an:
   - `max_layer = 2`
   - `show_courses = true`
   - `show_achievements = false`
4. System sortiert nach Default-Kriterium (z. B. `name`).
5. Liste wird angezeigt.
6. Nutzende Person ändert Filter (z. B. `max_layer` hochsetzen, Achievements einblenden).
7. System berechnet gefilterte & sortierte Liste neu und zeigt diese an.

**Fehlerfälle:**
- Keine Topics gefunden (z. B. extrem restriktive Filter) → Anzeige einer „Keine Ergebnisse“-Meldung.

---

## UC-05: Topic-Detailseite `/topics/[TopicID]`

**Ziel:**  
Für ein spezifisches Topic sollen alle relevanten Informationen und alle dazugehörigen Ressourcen angezeigt werden.

**Akteur:**  
Anonyme nutzende Person.

**Vorbedingungen:**
- Topic mit gegebener `TopicID` existiert.
- Ressourcen sind den Topics im Backend zugeordnet (aktuell direkt auf Topic-Ebene, nicht TopicLevel).

**Daten auf der Seite:**
- Topic-Stammdaten:
  - Name (`LocalizedText` mit Fallback-Regel).
  - Beschreibung (`LocalizedText`, optional).
  - TopicType (z. B. General Subject, Specialization).
  - Layer.
  - Liste von URLs (z. B. Wikipedia, andere Seiten; aus `List<WebUrl>`).
- Liste der zugewiesenen Ressourcen:
  - Titel, Beschreibung, Typ (`ResourceType`).
  - Link zur Ressource (für Web-Ressourcen: URL; für Files: Download/Verweis).
  - Optional: Anzeige der verfügbaren Sprachversionen (z. B. „English available“).

**Ablauf (Happy Path):**
1. Nutzende Person klickt in `/topics` auf ein Topic oder ruft direkt `/topics/[TopicID]` auf.
2. System lädt das Topic (nach `TopicID`) und alle referenzierten Ressourcen.
3. Stammdaten werden oben angezeigt.
4. Darunter wird eine Liste aller Ressourcen angezeigt, z. B. in Tabellenform oder als Cards.
5. Nutzende Person kann Ressource öffnen (z. B. Klick auf Titel → Öffnen der externen URL in neuem Tab).

**Fehlerfälle:**
- Topic existiert nicht → 404-Fehlerseite oder „Topic nicht gefunden“.

---

## UC-06: Interessenssuche `/interesting`

**Ziel:**  
Nutzende Person kann ihre Interessen in Freitext beschreiben und eine Liste von Topics erhalten, die am besten dazu passen.

**Akteur:**  
Anonyme nutzende Person.

**Vorbedingungen:**
- Tag-Katalog ist im Backend vorhanden:
  - Tags mit englischen Bezeichnungen und Synonymen.
- Topics sind mit Tags und Tag-Gewichten verknüpft (TopicTag-Zuordnungen).
- Externe oder interne KI-Schnittstelle steht (konzeptionell) zur Verfügung, um Freitext → gewichtete Tags abzubilden.

**Eingaben:**
- Freitext-Feld `interestsText`.
- Button „Find interesting topics“.

**Technischer Ablauf (konzeptionell):**
1. Nutzende Person gibt Interessen in Freitext ein (z. B. „I like astronomy and physics experiments“).
2. Klick auf „Find interesting topics“.
3. Frontend/Backend bereitet Anfrage an die KI-Schnittstelle vor:
   - `interestsText`
   - Liste aller Tags mit ihren englischen Namen und Synonymen.
4. KI-Schnittstelle bestimmt relevante Tags:
   - Nicht relevante Tags werden verworfen.
   - Relevante Tags erhalten eine Gewichtung `it.weight` im Bereich 1..5.
   - Optionale Nebenbedingung: jede Gewichtungsstufe > 1 wird höchstens so oft genutzt wie die nächst-niedrigere.
5. KI-Schnittstelle liefert ein JSON zurück, z. B.:

```json
{
  "1": 5,
  "7": 3,
  "12": 2
}
```

Dabei ist der Schlüssel die `tagId` und der Wert die Gewichtung im Bereich 1..5.

6. Backend berechnet pro Topic einen Score:
   * Für jedes Topic werden alle verknüpften TopicTags betrachtet mit `tt.weight` (1..5).
   * Wenn ein Tag sowohl in `TopicTags` als auch in `InteressenTags` vorkommt:
     * Teilscore = `tt.weight * it.weight`.
   * Topic-Gesamt-Score = Summe aller Teilscores über seine Tags.

7. Backend sortiert alle Topics nach Score absteigend.

8. Frontend zeigt eine Tabelle/Liste der Top-Topics an (z. B. die besten N Treffer), inkl.:
   * Name (mit Link zur Topic-Detailseite, falls vorhanden), Kurzbeschreibung, Score,
   * optional: einfache Erklärung, welche Tags zum Score beigetragen haben (z. B. kleine Tabelle der gematchten Tags mit Topic-Gewicht und Interessen-Gewicht).

**Fehlerfälle / Fallbacks:**
* KI-Schnittstelle nicht erreichbar oder Fehler:
  * Anzeige einer Fehlermeldung und evtl. einfacher Fallback (z. B. keine Vorschläge).
* Keine Tags gematcht → Anzeige „Keine passenden Topics gefunden“.

---

## UC-07: Navigation zu `/interesting` und zurück

**Ziel:**
Einfache Navigation zwischen Startseite, Topics und Interessenssuche.

**Akteur:**
Anonyme nutzende Person.

**Vorbedingungen:**
* Navigationsleiste oder Menü vorhanden.

**Ablauf:**
1. Nutzende Person kann von jeder Seite über die Navigation:
   * zu `/start`,
   * zu `/topics`,
   * zu `/interesting`
     wechseln.
2. Aktive Route wird in der Navigation hervorgehoben.

---

## UC-08: Öffnen von Ressourcen

**Ziel:**
Nutzende Person kann Ressourcen aus der Topic-Detailansicht heraus öffnen.

**Akteur:**
Anonyme nutzende Person.

**Vorbedingungen:**
* Topic-Detailseite ist geladen, Ressourcenliste wird angezeigt.
* Für Web-Ressourcen ist eine gültige URL vorhanden.

**Ablauf:**
1. Nutzende Person klickt auf eine Ressource in der Liste (z. B. auf den Titel).
2. System:
   * Bei Web-Ressource: öffnet die URL in neuem Tab/Fenster.
   * Bei File-Ressource (falls in späterer Iteration umgesetzt): triggert Download oder öffnet einen Viewer.

**Fehlerfälle:**
* URL ist ungültig → Anzeige einer Fehlermeldung („Ressource aktuell nicht verfügbar“).

---

## UC-09: Fehler- und 404-Seiten (minimal)

**Ziel:**
Nutzende Person erhält verständliche Rückmeldungen bei nicht existierenden Seiten oder technischen Fehlern.

**Akteur:**
Anonyme nutzende Person.

**Use Cases:**
* 404: Pfad existiert nicht (z. B. `/topics/UNKNOWN`) → „Topic nicht gefunden“ / generische 404-Seite.
* 500: Interner Fehler (z. B. CSV-Parsing-Problem) → generische „Es ist ein Fehler aufgetreten“-Seite mit Hinweis, dass das Problem gemeldet werden soll.

---

## UC-10: Intelligente Auflösung bei ähnlichen Topic-IDs

**Ausgangssituation:**
* Topic-IDs haben unterschiedliche Formen:
  * Subjects/Spezialisierungen: `AAA0..AAA9`
  * Kurse: `Aaa0..Aaa9`
* Unterschiedliche Topics können sich in der Groß-/Kleinschreibung unterscheiden, z. B.:
  * Subject `ABC2`
  * Course `Abc2`
* Browser-Adresszeilen werden in der Praxis oft case-insensitive oder ungenau genutzt (`/topics/abc2` statt `/topics/ABC2`).

**Ziel:**
Intelligente Handhabung scheinbar nicht eindeutiger Topic-IDs in URLs, ohne die präzisen IDs zu „verletzen“.

**Akteur:**
Anonyme nutzende Person.

**Begriffe:**
* `topicID`: die tatsächliche Topic-ID (z. B. `ABC2`, `Abc2`).
* `_topicID`: `topicID.toLowerCase()` (z. B. `abc2`).

**Use Cases (Auflösung):**
* **Fall 0:** `_topicID` ist im gesamten Datenbestand eindeutig
  → case-insensitive Eingaben sind eindeutig auflösbar:
  * Eingabe `/topics/abc2` wird direkt auf das eine passende Topic gemappt.

* **Fall 1:** `_topicID` ist **nicht** eindeutig, z. B. existieren:
  * `ABC2` (Subject)
  * `Abc2` (Course)

  * **Fall 1a:** Eingabe `/topics/abc2` (alles klein)
    → System kann nicht eindeutig entscheiden.
    → Anzeige einer Auswahlseite mit:
    * den passenden Topics (`ABC2`, `Abc2`) inkl. Typ,
    * optional weiteren Topics mit ähnlichem ID-Stamm (gleiche ersten drei Zeichen, anderer Layer), falls dies sinnvoll erscheint.

  * **Fall 1b:** Eingabe `/topics/Abc2`
    → exakte ID vorhanden → direkt Topic `Abc2` (Course) anzeigen, keine Auswahlseite.

  * **Fall 1c:** Eingabe `/topics/ABC2`
    → exakte ID vorhanden → direkt Topic `ABC2` (Subject) anzeigen, keine Auswahlseite.

**Zusatz: Hinweise auf ähnliche Topics auf der Detailseite**

Auf jeder Topic-Detailseite können zusätzliche Links zu „sehr ähnlichen“ Topics angezeigt werden, um Orientierung zu bieten:
* Wenn `_topicID` nicht eindeutig ist:
  * Anzeige in der Art:
    `Topics with very similar IDs: [Abc2](/topics/Abc2)`
* Optional zusätzlich: weitere Topics mit ähnlichem ID-Stamm (z. B. gleiche ersten drei Zeichen, andere Endziffer).
Beispiel für `ABC2`:
```md
Topics with very similar IDs: [Abc2](/topics/Abc2)
Other topics with similar IDs: [ABC0](/topics/ABC0), [ABC1](/topics/ABC1), [ABC3](/topics/ABC3), [ABC4](/topics/ABC4), [ABC5](/topics/ABC5), [ABC6](/topics/ABC6), ...
```

---

## Nicht im Scope dieser Iteration

Die folgenden Themen sind **absichtlich NICHT Teil des jetzigen Umfangs**:
* Login / Authentifizierung / Benutzerkonten
* Tracking von Resource-Interaktionen (`ct_rinteraction` bleibt ungenutzt)
* Zuordnung von Ressourcen zu **TopicLevels** (statt Topics)
* Erstellung/Bearbeitung von Topics, Ressourcen oder Tags über die UI (nur Lesen)
* Komplexe Statistiken und Empfehlungen basierend auf Nutzungsverhalten

Diese Punkte können in späteren Iterationen geplant werden, sobald der aktuelle Kern stabil läuft.
