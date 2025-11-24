# DEVELOPER.md — Architektur & Onboarding

Willkommen im Projekt. Dieses Dokument erklärt kurz und präzise, **wie der Code aufgebaut ist**, **wo welche Verantwortung liegt** und **wie Daten vom CSV-File ins Frontend gelangen**. Zielgruppe sind neue Teammitglieder ohne Vorwissen zur gewählten Architektur.

## Inhaltsverzeichnis

[Leitprinzipien (kurz)](#leitprinzipien-kurz)
[Verzeichnis-Überblick](#verzeichnis-überblick)
[Verantwortlichkeiten je Ordner (mit Mini-Beispielen)](#verantwortlichkeiten-je-ordner-mit-mini-beispielen)
  [`domain/model`](#domainmodel)
  [`domain/value`](#domainvalue)
  [`domain/services`](#domainservices)
  [`domain/ports`](#domainports)
  [`application`](#application)
  [`infrastructure/csv`](#infrastructurecsv)
  [`infrastructure/mapper`](#infrastructuremapper)
  [`infrastructure/persistence`](#infrastructurepersistence)
  [`interface/rest`](#interfacerest)
[Datenfluss (End-to-End)](#datenfluss-end-to-end)
[CSV-Lade- und Verknüpfungsreihenfolge (empfohlen)](#csv-lade--und-verknüpfungsreihenfolge-empfohlen)
[Design-Entscheidungen (kurz begründet)](#design-entscheidungen-kurz-begründet)
[Namens- & Stilkonventionen (Auszug)](#namens---stilkonventionen-auszug)
[Minimalbeispiele (Signaturen)](#minimalbeispiele-signaturen)
[Tests (empfohlen, minimal)](#tests-empfohlen-minimal)
[Häufige Fehler & Gegenmaßnahmen](#häufige-fehler--gegenmaßnahmen)
[Vorgehens-Checkliste (neue Funktion)](#vorgehens-checkliste-neue-funktion)
[Änderungsanträge (Template)](#änderungsanträge-template)
[Glossar (kurz)](#glossar-kurz)
[Quickstart für Neulinge](#quickstart-für-neulinge)

---

## Leitprinzipien (kurz)

* **Domain-first**: Fachlogik (Kernmodelle + Regeln) steht im Mittelpunkt und bleibt unabhängig von Technik (CSV, DB, REST).
* **Ports & Adapter**: Domain definiert Schnittstellen (Ports), Infrastruktur liefert Implementierungen (Adapter).
* **Klare Schichten & Abhängigkeiten**: Interface → Application → Domain → (Ports) → Infrastructure. Keine Rückabhängigkeit.
* **State + Behavior** zusammen**: Domänenklassen enthalten Zustand **und** Verhalten (keine „anämischen“ Modelle).

---

## Verzeichnis-Überblick

Die wichtigsten Ordner (gekürzt) — Backend (Java) und Frontend sind getrennt.
Siehe Projektskelett im Repo (backend/src/main/java/... mit `application`, `domain` usw.).

```markdown
backend/
  build.gradle
  src/main/java/org/schoolsystem/
    application/       # Use-Cases (Orchestrierung)
    domain/
      model/           # Entities, Aggregate Roots, Value Objects mit Verhalten
      ports/           # Interfaces (z. B. Repository, Loader)
      services/        # Fachliche Services über Aggregatsgrenzen
      value/           # Kleine Value Objects (z. B. TopicId, LanguageCode)
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
  * Verhalten: `addLevel(LevelNumber n, LocalizedText d)`, `assignTag(Tag t, Weight w)`
* `Resource` (sealed) → `UrlResource`, `FileResource`

  * Verhalten: `publishNewVersion(VersionNumber v, String changelog)`

### `domain/value`

**Was:** Kleine, **immutable** Value Objects (Validierung im Konstruktor/factory).
**Beispiele:** `TopicId` (prüft ID-Pattern), `LanguageCode` (ISO-Check), `LevelNumber` (0..9), `Weight` (0..100), `Version`.

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
* `CsvReader`, `CsvSchema` (Datei/Zeilen-Zugriff & Felddefinitionen), falls ihr CSV als Port abstrahieren wollt.

### `application`

**Was:** **Use-Cases** für das Interface/Frontend. Orchestriert Domain-Repositories und -Services, **ohne** Fachlogik zu enthalten.
**Beispiele:**

* `LoadCatalogUseCase` (lädt alle Topics inkl. Levels, URLs, Tags).
* `ListResourcesForLevelUseCase`.

**Tipp:** Hier ggf. **DTOs** definieren (oder unter `interface/rest/dto`) und Mapping Domain ↔ DTO organisieren.

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
2. **interface/rest**: Controller nimmt Request an, ruft Use-Case auf.
3. **application**: Use-Case orchestriert Domain-Services & -Repositories.
4. **domain**:

   * Services prüfen Regeln, Aggregation.
   * Repositories (Ports) liefern Domain-Objekte.
5. **infrastructure**: CSV-Adapter implementiert Repo-Port, liest Files, mappt Zeilen → Domain.

Abhängigkeiten gehen **nur nach unten** (Interface → Application → Domain → Ports → Infrastructure). Domain kennt keine Infrastruktur.

---

## CSV-Lade- und Verknüpfungsreihenfolge (empfohlen)

1. Basistabellen laden in Maps:

   * `t_topic_type`, `t_tag`, `t_resource_type`, `t_source_type`, `t_source_author`, `t_author`, `t_resource`, `t_source`.
2. Detail-/Relationstabellen:

   * `t_topic`, anschließend `t_topic_level`, `t_topic_url`.
   * `ct_topic_tags`.
   * `t_version`, `t_lang_version`.
   * `ct_uses_source`, `ct_resource_to_level`.
3. **Linking** (in Service oder Repo-Impl): IDs → Referenzen; Invarianten prüfen (z. B. Level-Range, Weight 0..100).

---

## Design-Entscheidungen (kurz begründet)

* **Konstruktoren & Methoden gehören in die Domänenklassen** (`domain/model`).
  So bleiben Invarianten zentral. Mapper und Repos dürfen `package-private` Hydrations-Konstruktoren verwenden.
* **Interfaces für Repositories/Reader** (`domain/ports`) ermöglichen Austausch (CSV heute, DB morgen).
* **Sealed Interfaces/Klassen** (Java 17+) für klar begrenzte Varianten (z. B. `Resource`, `Source`).
* **Value Objects** (`domain/value`) erzwingen gültige Werte an einer Stelle.

---

## Namens- & Stilkonventionen (Auszug)

* **1 Klasse/Interface pro Datei**, sprechende Namen, keine Abkürzungs-Orgie.
* **Immutable** Value Objects (final Felder, keine Setter).
* **Collections nicht roh herausgeben**: unmodifiable/deep copies.
* **DTO != Domain**: DTOs sind flach und schnittstellenfreundlich; Domain ist reichhaltig.
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

  private Topic(...) { /* prüft Invarianten */ }

  public static Topic create(TopicId id, TopicType type, int layer, LocalizedText name) { ... }

  public Topic addLevel(LevelNumber level, LocalizedText description) { ... }
  public Topic addUrl(String url) { ... }
  public Topic assignTag(Tag tag, Weight weight) { ... }
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
  // ...

  @Override public List<Topic> findAll() { /* read CSVs → map → link → return */ }
}
```

**Application (Use-Case):**

```java
public final class LoadCatalogUseCase {
  private final TopicRepository topics;
  public CatalogDTO load() { /* orchestriert Repos/Services, mappt zu DTO */ }
}
```

---

## Tests (empfohlen, minimal)

* **Unit** (`domain`): `TopicServiceTest`, `ResourceServiceTest`, VO-Validierungen.
* **Mapper-Tests** (`infrastructure/mapper`): Zeile→Domain, Fehlerfälle.
* **Integration** (`infrastructure/csv`): `CsvTopicRepositoryIT` mit Beispiel-CSV.

---

## Häufige Fehler & Gegenmaßnahmen

* **Anämisches Modell** (nur Getter/Setter):
  → Verhalten in die Entity; Invarianten im Konstruktor/factory prüfen.
* **Zirkuläre Abhängigkeiten** (Domain sieht Infrastruktur):
  → Strikte Einhaltung des Schichtenmodells, Ports nur in Domain.
* **CSV-Details in Domain**:
  → Parsing in Mapper/CSV-Adapter lassen, Domain bleibt sauber.
* **Leaky Collections**:
  → Unmodifiable Views zurückgeben (`List.copyOf`).

---

## Vorgehens-Checkliste (neue Funktion)

1. **Use-Case definieren** (`application/*`).
2. **Braucht die Domain neue Fähigkeiten?**

   * Neue Methoden in Entities/Services ergänzen (`domain/model`, `domain/services`).
   * Neue Ports definieren (`domain/ports`).
3. **Adapter implementieren** (`infrastructure/*`).
4. **Interface/REST** anbinden (falls nötig).
5. **Tests** schreiben (Unit → Mapper → Integration).

---

## Änderungsanträge (Template)

* **WHERE:** Pfad + Klassenname + Zeilenkontext
* **WHAT:** konkreter Code-Block / Signatur / Interface-Methode
* **WHY:** kurzer Nutzen/Regel (z. B. Invariante, Austauschbarkeit, Testbarkeit)

Beispiel:

* **WHERE:** `domain/model/Topic.java` um Methode `assignTag(...)`
* **WHAT:** Neue Validierung `require weight in 0..100` + Rückgabe neue Instanz (immutable).
* **WHY:** Verhindert ungültige Gewichte, erleichtert Tests.

---

## Glossar (kurz)

* **Entity/Aggregate Root**: Domänenobjekt mit Identität/Beziehungen, das Konsistenzgrenzen definiert.
* **Value Object**: Kleiner, unveränderlicher Typ mit eigener Validierung (keine Identität).
* **Port**: Interface, das die Domain braucht (z. B. Repository).
* **Adapter**: Technische Umsetzung eines Ports (z. B. CSV/DB).
* **DTO**: Transferobjekt für Schnittstellen (flach, kein Verhalten).

---

## Quickstart für Neulinge

1. Lies **dieses Dokument** und öffne `domain/model/*`, um die Kernbegriffe kennenzulernen.
2. Schau in `domain/ports/*`, um zu verstehen, **was** die Domain benötigt.
3. Folge dem Pfad in `infrastructure/csv/*`, um zu sehen, **wie** CSVs gelesen und gemappt werden.
4. Öffne `application/*`, um zu sehen, wie Use-Cases orchestriert sind.
5. Starte mit einem kleinen Unit-Test (VO oder einfache Entity-Methode), um das Setup zu prüfen.

---

Wenn etwas unklar ist oder du eine konkrete Stelle verbessern willst, nutze bitte das **WHERE/WHAT/WHY**-Schema oben – so bleiben Diskussionen fokussiert und nachvollziehbar. ✔️
