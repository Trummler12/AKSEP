# DEVELOPER.md — Architektur & Onboarding

Willkommen im Projekt. Dieses Dokument erklärt kurz und präzise, **wie der Code aufgebaut ist**, **wo welche Verantwortung liegt** und **wie Daten vom CSV-File ins Frontend gelangen**. Zielgruppe sind neue Teammitglieder ohne Vorwissen zur gewählten Architektur.

## Inhaltsverzeichnis

- [Leitprinzipien (kurz)](#leitprinzipien-kurz)
- [Verzeichnis-Überblick](#verzeichnis-überblick)
- [Verantwortlichkeiten je Ordner (mit Mini-Beispielen)](#verantwortlichkeiten-je-ordner-mit-mini-beispielen)  
  - [`domain/model`](#domainmodel)  
  - [`domain/value`](#domainvalue)  
  - [`domain/services`](#domainservices)  
  - [`domain/ports`](#domainports)  
  - [`application`](#application)  
  - [`infrastructure/csv`](#infrastructurecsv)  
  - [`infrastructure/mapper`](#infrastructuremapper)  
  - [`infrastructure/persistence`](#infrastructurepersistence)  
  - [`interface/rest`](#interfacerest)  
- [Datenfluss (End-to-End)](#datenfluss-end-to-end)  
- [CSV-Lade- und Verknüpfungsreihenfolge (empfohlen)](#csv-lade--und-verknüpfungsreihenfolge-empfohlen)  
- [Design-Entscheidungen (kurz begründet)](#design-entscheidungen-kurz-begründet)  
- [Namens- & Stilkonventionen (Auszug)](#namens---stilkonventionen-auszug)  
- [Minimalbeispiele (Signaturen)](#minimalbeispiele-signaturen)  
- [Tests (empfohlen, minimal)](#tests-empfohlen-minimal)  
- [Häufige Fehler & Gegenmaßnahmen](#häufige-fehler--gegenmaßnahmen)  
- [Vorgehens-Checkliste (neue Funktion)](#vorgehens-checkliste-neue-funktion)  
- [Änderungsanträge (Template)](#änderungsanträge-template)  
- [Glossar (kurz)](#glossar-kurz)  
- [Quickstart für Neulinge](#quickstart-für-neulinge)  

---

## Leitprinzipien (kurz)

* **Domain-first**: Fachlogik (Kernmodelle + Regeln) steht im Mittelpunkt und bleibt unabhängig von Technik (CSV, DB, REST).
* **Ports & Adapter**: Domain definiert Schnittstellen (Ports), Infrastruktur liefert Implementierungen (Adapter).
* **Klare Schichten & Abhängigkeiten**: Interface → Application → Domain → (Ports) → Infrastructure. Keine Rückabhängigkeit.
* **State + Behavior gehören zusammen**: Domänenklassen enthalten Zustand **und** Verhalten (keine „anämischen“ Modelle).

---

## Verzeichnis-Überblick

Die wichtigsten Ordner (gekürzt) — Backend (Java) und Frontend sind getrennt.  
Siehe Projektskelett im Repo (backend/src/main/java/... mit `application`, `domain` usw.).

```text
backend/
  build.gradle
  src/main/java/org/schoolsystem/
    application/       # Use-Cases (Orchestrierung)
    domain/
      model/           # Entities, Aggregate Roots, Domänenklassen mit Verhalten
      ports/           # Interfaces (z. B. Repository, Loader)
      services/        # Fachliche Services über Aggregatsgrenzen
      value/           # Kleine Value Objects (z. B. TopicId, LanguageCode, TagWeight)
    infrastructure/
      csv/             # CSV-Lesen (Adapter)
      mapper/          # Zeile→Domain Mapping
      persistence/     # Platzhalter für spätere DB-Adapter
    interface/
      rest/            # Optional: REST-Controller + DTOs
  src/main/resources/  # CSVs, Mappings, evtl. Validierungsregeln

frontend/
  (Separates HTML/CSS/JS Modul)
```

---

## Verantwortlichkeiten je Ordner (mit Mini-Beispielen)

### `domain/model`

**Was:** Fachklassen (Entities/Aggregate Roots) **mit Zustand und Verhalten**.
**Warum:** Invarianten & Regeln gehören nah an die Daten.

**Beispiele (Signaturen, nicht bindend):**

* `Topic`

  * Felder: `TopicId id`, `TopicType type`, `int layer`, `LocalizedText name`, `List<TopicLevel> levels`, `List<TopicUrl> urls`, `List<TopicTagAssignment> tags`
  * Verhalten: `addLevel(LevelNumber n, LocalizedText d)`, `assignTag(Tag t, TagWeight w)`
* `Resource` (später evtl. als sealed-Hierarchie) → `UrlResource`, `FileResource`

  * Verhalten: `publishNewVersion(String versionNumber, String changelog)`

### `domain/value`

**Was:** Kleine, **immutable** Value Objects (Validierung im Konstruktor/factory).
**Beispiele (aktueller Stand):**

* `LanguageCode` — kapselt Sprachcodes (z. B. "de", "en") und die Menge der momentan unterstützten Sprachen.
* `LevelNumber` — kapselt Levels im Bereich **1..9** (inklusive).
* `TagWeight` — kapselt Tag-Gewichtungen im Bereich **1..5**.
* `TopicId` — kapselt das Topic-Benennungsschema (z. B. `AAA0`, `Aaa1`, `aaaa`) inkl. Hilfsmethoden zur Klassifikation (Subject/Course/Achievement, General/Optional).
* `WebUrl` — kapselt eine valide HTTP/HTTPS-URL.

All diese Typen stellen sicher, dass ungültige Werte gar nicht erst in die Domain gelangen. Die Range-Grenzen sind über Konstanten (`MIN`, `MAX`) definiert, nicht als Magic Numbers im Code.

### `domain/services`

**Was:** Fachlogik **über** Aggregate hinweg (Koordination/Regeln, die nicht natürlich nur zu einem Modell gehören).

**Beispiele:**

* `TopicService`: baut vollständige Topic-Aggregate aus Basisdaten + Levels + URLs + Tag-Zuordnungen.
* `MatchingService`: Interessen ↔ Tags/Topics Ranking.
* `ValidationService`: Regeln wie Layer-Logik, Eindeutigkeit, Lokalisierungs-Vollständigkeit.

### `domain/ports`

**Was:** **Schnittstellen** (keine Technik), die die Domain braucht.

**Beispiele:**

* `TopicRepository`, `TagRepository`, `ResourceRepository` (Read/Write-Methoden).
* `CsvReader`, `CsvSchema` (Datei/Zeilen-Zugriff & Felddefinitionen), falls CSV als Port abstrahiert wird.

### `application`

**Was:** **Use-Cases** für das Interface/Frontend. Orchestriert Domain-Repositories und -Services, **ohne** Fachlogik zu enthalten.

**Beispiele:**

* `LoadCatalogUseCase` (lädt alle Topics inkl. Levels, URLs, Tags).
* `ListResourcesForLevelUseCase`.

**Tipp:** Hier können **DTOs** definiert werden (oder in `interface/rest/dto`), inkl. Mapping Domain ↔ DTO.

### `infrastructure/csv`

**Was:** Konkrete Adapter, die die Ports implementieren. **Liest CSV**, baut Domain-Objekte.

**Strukturvorschlag:**

* `OpenCsvReader` (oder Apache Commons CSV)
* `schema/`: `TopicCsvSchema`, `TagCsvSchema`, … (Spalten, Pflichtfelder, Typen)
* `repository/`: `CsvTopicRepository` implementiert `TopicRepository`
* `mapper/` (eigenes Verzeichnis, siehe unten)

### `infrastructure/mapper`

**Was:** **Row-Mapper** (CSV-Zeile → Domain). Kapselt Parsing/Umwandlung.

**Beispiele:** `TopicRowMapper`, `TagRowMapper`, `TopicLevelRowMapper`, `TopicUrlRowMapper`.

### `infrastructure/persistence`

**Was:** Platzhalter für **später** (z. B. JPA/JOOQ). Hält DB-Adapter, ohne Domain anzufassen.

### `interface/rest`

**Was:** **Einfallstor** fürs Frontend (optional). Stellt JSON bereit.

**Beispiele:** `TopicController`, `ResourceController`, `dto/*` (einfache Transportobjekte).

---

## Datenfluss (End-to-End)

1. **Frontend** (HTML/JS) ruft HTTP-Endpunkt auf (optional).
2. **interface/rest**: Controller nimmt Request an, ruft entsprechenden Use-Case auf.
3. **application**: Use-Case orchestriert Domain-Services & -Repositories.
4. **domain**:

   * Services prüfen Regeln, Aggregation.
   * Repositories (Ports) liefern Domain-Objekte.
5. **infrastructure**: CSV-Adapter implementiert Repo-Port, liest Files, mappt Zeilen → Domain.

Abhängigkeiten gehen **nur nach unten** (Interface → Application → Domain → Ports → Infrastructure). Die Domain kennt keine Infrastruktur.

---

## CSV-Lade- und Verknüpfungsreihenfolge (empfohlen)

1. Basistabellen laden (in Maps, z. B. `id → Objekt`):

   * `t_topic_type`, `t_tag`, `t_resource_type`, `t_source_type`,
   * `t_source_author`, `t_author`, `t_resource`, `t_source`.

2. Detail-/Relationstabellen:

   * `t_topic`, anschließend `t_topic_level`, `t_topic_url`.
   * `ct_topic_tags`.
   * `t_version`, `t_lang_version`.
   * `ct_uses_source`, `ct_resource_to_level`.

3. **Linking** (in Service oder Repository-Implementierung):

   * IDs → Referenzen auf Domain-Objekte.
   * Invarianten prüfen, z. B.:

     * Level-Range **1..9** (über `LevelNumber`).
     * Tag-Gewichtung **1..5** (über `TagWeight`).
     * Konsistenz von Versionseinträgen und Lokalisierungen.

---

## Design-Entscheidungen (kurz begründet)

* **Konstruktoren & Methoden gehören in die Domänenklassen** (`domain/model`).
  So bleiben Invarianten zentral. Mapper und Repos dürfen `package-private` Hydrations-Konstruktoren verwenden.
* **Interfaces für Repositories/Reader** (`domain/ports`) ermöglichen Austausch (CSV heute, DB morgen).
* **Sealed Interfaces/Klassen** (Java 17+) können dort verwendet werden, wo Varianten klar begrenzt sind (z. B. `Resource`, `Source`).
* **Value Objects** (`domain/value`) erzwingen gültige Werte an einer Stelle (z. B. `TagWeight` 1..5, `LevelNumber` 1..9, gültige URLs über `WebUrl`).

---

## Namens- & Stilkonventionen (Auszug)

* **Eine Klasse/Interface pro Datei**, sprechende Namen, keine unnötigen Abkürzungen.
* **Immutable Value Objects** (final Felder, keine Setter).
* **Collections nicht roh herausgeben**: unmodifiable/deep copies (`List.copyOf`, `Map.copyOf`).
* **DTO != Domain**: DTOs sind flach und schnittstellenfreundlich; Domain ist reichhaltig und enthält Verhalten.
* **Sichtbarkeiten**: Nur Nötiges `public`. Interne Helfer `package-private`.

---

## Minimalbeispiele (Signaturen)

**Domain (Model):**

```java
// Topic (verkürzt)
public final class Topic {
  private final TopicId id;
  private final TopicType type;
  private final int layer;
  private final LocalizedText name;
  private final List<TopicLevel> levels;
  private final List<TopicUrl> urls;
  private final List<TopicTagAssignment> tags;

  private Topic(/* Parameter */) {
    // prüft Invarianten
  }

  public static Topic create(TopicId id, TopicType type, int layer, LocalizedText name) {
    // zentrale Erzeugung + Validierung
    return new Topic(/* ... */);
  }

  public Topic addLevel(LevelNumber level, LocalizedText description) {
    // neues Topic mit zusätzlichem Level (immutable Ansatz)
    // oder kontrollierte Mutation mit Invarianz-Check
    return /* ... */;
  }

  public Topic assignTag(Tag tag, TagWeight weight) {
    // Tag-Zuordnung mit Gewicht 1..5
    return /* ... */;
  }
}
```

**Domain (Ports):**

```java
public interface TopicRepository {
  Optional<Topic> findById(TopicId id);
  List<Topic> findAll();
}
```

**Infrastructure (CSV-Adapter):**

```java
public final class CsvTopicRepository implements TopicRepository {
  private final CsvReader reader;
  private final TopicRowMapper mapper;

  public CsvTopicRepository(CsvReader reader, TopicRowMapper mapper) {
    this.reader = reader;
    this.mapper = mapper;
  }

  @Override
  public List<Topic> findAll() {
    // CSV lesen → Zeilen mappen → Aggregation/Linking → Domain-Objekte zurückgeben
    return List.of();
  }
}
```

**Application (Use-Case):**

```java
public final class LoadCatalogUseCase {
  private final TopicRepository topics;

  public LoadCatalogUseCase(TopicRepository topics) {
    this.topics = topics;
  }

  public CatalogDTO load() {
    // orchestriert Repos/Services, mappt Domain zu DTO
    return new CatalogDTO(/* ... */);
  }
}
```

---

## Tests (empfohlen, minimal)

* **Unit-Tests** (`domain`):

  * VO-Validierungen (`LanguageCodeTest`, `LevelNumberTest`, `TagWeightTest`, `TopicIdTest`, `WebUrlTest`).
  * Business-Methoden in Entities/Services (`TopicServiceTest`, `ResourceServiceTest`).
* **Mapper-Tests** (`infrastructure/mapper`):

  * Zeile→Domain, inklusive Fehlerfällen (fehlende Spalten, falsche Typen).
* **Integrations-Tests** (`infrastructure/csv`):

  * `CsvTopicRepositoryIT` mit Beispiel-CSV.

---

## Häufige Fehler & Gegenmaßnahmen

* **Anämisches Modell** (nur Getter/Setter):
  → Verhalten in die Entity bringen; Invarianten im Konstruktor/factory prüfen.

* **Zirkuläre Abhängigkeiten** (Domain → Infrastructure):
  → Strikte Einhaltung des Schichtenmodells; Ports nur in Domain, Implementierung in Infrastructure.

* **CSV-Details in der Domain**:
  → Parsing in Mapper/CSV-Adapter lassen, Domain bleibt von Ein-/Ausgabe getrennt.

* **Leaky Collections**:
  → Unmodifiable Views zurückgeben (`List.copyOf`, `Set.copyOf`).

* **Magic Numbers**:
  → Konstante in Value Objects verwenden (z. B. `LevelNumber.MIN`, `LevelNumber.MAX`, `TagWeight.MIN`, `TagWeight.MAX`).

---

## Vorgehens-Checkliste (neue Funktion)

1. **Use-Case definieren** (`application/*`).

2. Prüfen, ob die Domain neue Fähigkeiten braucht:

   * Neue Methoden in Entities/Services ergänzen (`domain/model`, `domain/services`).
   * Neue Ports definieren (`domain/ports`).

3. **Adapter implementieren** (`infrastructure/*`).

4. **Interface/REST** anbinden (falls nötig).

5. **Tests** schreiben:

   * Unit-Tests auf Domain-Ebene.
   * Mapper-Tests.
   * Integrations-Tests für die betroffenen Repositories.

---

## Änderungsanträge (Template)

* **WHERE:** Pfad + Klassenname + Zeilenkontext
* **WHAT:** konkreter Code-Block / Signatur / Interface-Methode
* **WHY:** kurzer Nutzen/Regel (z. B. Invariante, Austauschbarkeit, Testbarkeit)

Beispiel:

* **WHERE:** `domain/model/Topic.java` um Methode `assignTag(...)`
* **WHAT:** Neue Validierung `require weight in 1..5` + Rückgabe neue Instanz (immutable).
* **WHY:** Verhindert ungültige Gewichte, erleichtert Tests und spätere Erweiterungen der Matching-Logik.

---

## Glossar (kurz)

* **Entity/Aggregate Root**: Domänenobjekt mit Identität/Beziehungen, das Konsistenzgrenzen definiert.
* **Value Object**: Kleiner, unveränderlicher Typ mit eigener Validierung (keine Identität).
* **Port**: Interface, das die Domain benötigt (z. B. Repository).
* **Adapter**: Technische Umsetzung eines Ports (z. B. CSV, DB).
* **DTO**: Transferobjekt für Schnittstellen (flach, kein Verhalten).

---

## Quickstart für Neulinge

1. README lesen (insbesondere Abschnitt „0. Anforderungen“).
2. Diese `DEVELOPER.md` durchgehen und `domain/value/*` öffnen, um ein Gefühl für Value Objects zu bekommen.
3. `domain/model/*` ansehen, um die wichtigsten Fachbegriffe (Topic, Tag, Resource, Source, etc.) kennenzulernen.
4. `domain/ports/*` prüfen, um zu verstehen, **was** die Domain von der Außenwelt erwartet.
5. `infrastructure/csv/*` ansehen, um zu sehen, **wie** CSV-Daten eingelesen und in Domain-Objekte überführt werden.
6. Einen bestehenden Unit-Test ausführen oder einen neuen für ein Value Object schreiben, um die Build-Pipeline zu verifizieren.

---

Wenn etwas unklar ist oder du eine konkrete Stelle verbessern willst, nutze bitte das **WHERE/WHAT/WHY**-Schema – so bleiben Diskussionen fokussiert und nachvollziehbar.
