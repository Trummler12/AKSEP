# Planung der Neuauflage des Schoolsystem-Projekts

## Involvierte Lehr-Module

- Modul 320: Objektorientiert programmieren
- Modul 322: Benutzerschnittstellen entwerfen und implementieren

## Konversation mit ChatGPT

CustomGPT: [Java](https://chatgpt.com/g/g-3GmVMbWRV-java)

### Prompt 1

Please ultra think hard on this:
Wir haben in unserer Lehre in einem Modul zu projektorientiertem Programmieren die Aufgabe, ein Java-Projekt umzusetzen, zusammen mit einem Frontend-HTML basiert, welches auf einem anderen parallel laufenden Modul fließt. Und nun wollte ich dich folgende Fragen stellen. Was ist die nach Best Practices minimale Architektur eines solchen Projekts? Und was ist die sinnvollste modulare Aufteilung des Projektes in kleinere Files? Zum Beispiel, wie Filen sollten Klassen in einzelne Files unterteilt werden? Und wie gilt es diesbezüglich mit abstrakten Klassen und Interfaces umzugehen, die wir ebenfalls mit einbauen sollten? Dazu musst du wissen, das objektorientierte Backend, wenn man das so bezeichnen will, soll primär aus Java-Code bestehen, welches in meinem Falle CSV-Dateien interpretiert und in Form von Objekten speichert.
Folgende Klassen werde ich dafür benötigen (Ich geb' dir einfach die entsprechenden Abschnitte des bereits über ein anderes Modul vorbereiteten .sql-Scripts):
```
-- "t_" = "table", "ct_" = "combination table" (n:m-Beziehung); Würden wir für die Klassen-Namen weglassen
-- -----------------------------------------------------
-- Table `schoolsystem`.`t_tag`
-- Schlagwörter, die den Topics mit Gewichtung zugewiesen werden können; Für unser Projekt würden wir zudem planen, einen Tag aus List<Tag_Localization> bestehen zu lassen (wobei vorerst Deutsch und Englisch reichen), während jede Tag_Localization aus einer Liste an Synonymen (Strings) besteht; Kurz: Tag.tags = map<"lang": List<String>>)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_tag` (
  `tagID` INT NOT NULL,
  `tag` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`tagID`),
  UNIQUE INDEX `tagID_UNIQUE` (`tagID` ASC) VISIBLE,
  UNIQUE INDEX `tag_UNIQUE` (`tag` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_type`
-- 0: "General Subjekt", 1: "Specialization", 2: "Technical Subject" (requires Equipment not every School can provide), etc.
-- Zwar sind Synonyme nach aktueller Planung nur für Tags relevant, aber auch (ab!) hier würden wir bei Title/Name, Description & co. wo auch immer es sinnvoll ist mit Localizations arbeiten wollen (wovon es dann 2 Typen gibt: Eine mit Synonymen (speziell für Tags), und eine *ohne* Synonyme (für praktisch alle anderen Stellen), wo jede Localization ein einfaches Mapping von "lang": String/Text darstellt)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic_type` (
  `typeID` TINYINT NOT NULL,
  `type_name` VARCHAR(45) NULL,
  `definition` TEXT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`typeID`),
  UNIQUE INDEX `typeID_UNIQUE` (`typeID` ASC) VISIBLE,
  UNIQUE INDEX `type_name_UNIQUE` (`type_name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic` (
  `topicID` VARCHAR(10) NOT NULL,
-- Benennungs-Logik (wichtigste Topic_Types):
-- AAA0      = General Subject; obligatory until year 9, 
-- AAA1...9 = Specialization; optional (unless chosen after year 9)
-- Aaa0        = General Course
-- Aaa1...9  = Optional Course
-- aaaa        = Achievement
  `name` VARCHAR(100) NOT NULL,
  `typeID` TINYINT NOT NULL,
  `layer` TINYINT NOT NULL,
-- Grundlagenfächer, Achievements, die meisten Kurse & co. sind auf Layer 0; Die anderen Topics (z.B. Type Specialization) haben ein oder mehrere Topics als Voraussetzung (Biochemie z.B. hat Biologie & Chemie als Voraussetzungen); In diesem Falle ist layer = (höchstes layer unter allen Voraussetzungen)+1; layer(Biochemie)=1, layer(Astrobiologie)=2 (da Astronomie selbst Physik voraussetzt)
  `description` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`),
  INDEX `fk_type_idx` (`typeID` ASC) VISIBLE,
  UNIQUE INDEX `topicID_UNIQUE` (`topicID` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  CONSTRAINT `fk_t_type`
    FOREIGN KEY (`typeID`)
    REFERENCES `schoolsystem`.`t_topic_type` (`typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_url`
-- Link zu Wikipedia und/oder anderen Seiten, wo man mehr zum Thema (Topic) finden kann
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic_url` (
  `topicID` VARCHAR(10) NOT NULL,
  `urlNr` TINYINT NOT NULL,
  `url` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `urlNr`),
  INDEX `fk_tu_topic_idx` (`topicID` ASC) VISIBLE,
  CONSTRAINT `fk_tu_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_topic_level`
-- Levels können typischerweise von 0 bis 9 reichen, wobei es je nach Topic_type Abweichungen gibt: General Subjects beginnen bei Level 0 und enden typischerweise irgendwo um Level 2 bis 4; Topics mit layer>0 beginnen *frühestens* auf Level >= layer und *können* bis Level 9 reichen, müssen es jedoch nicht; Achievements reichen von Level 0 bis 6 und sind frei von Voraussetzungen; etc.)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_topic_level` (
  `topicID` VARCHAR(10) NOT NULL,
  `level_number` TINYINT NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `level_number`),
  CONSTRAINT `fk_l_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_topic_tags`
-- Hier werden den Topics passende Tags zugewiesen mit passender Gewichtung, damit man später seine Interessen beschreiben und (KI-unterstützt) die am besten mit den eigenen Interessen übereinstimmenden Topics finden kann
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_topic_tags` (
  `topicID` VARCHAR(10) NOT NULL,
  `tagID` INT NOT NULL,
  `weight` TINYINT NOT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`topicID`, `tagID`),
  INDEX `fk_tht_topic_idx` (`topicID` ASC) VISIBLE,
  INDEX `fk_tht_tag_idx` (`tagID` ASC) VISIBLE,
  CONSTRAINT `fk_tht_topic`
    FOREIGN KEY (`topicID`)
    REFERENCES `schoolsystem`.`t_topic` (`topicID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_tht_tag`
    FOREIGN KEY (`tagID`)
    REFERENCES `schoolsystem`.`t_tag` (`tagID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source_author`
-- Normalisierte Liste aller bekannter Autoren von Quellen (z.B. Veritasium bei YouTube-Videos)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_source_author` (
  `sauthorID` INT NOT NULL,
  `sauthor_name` VARCHAR(127) NULL,
  `sauthor_URL` TEXT NULL,
  `sauthor_description` TEXT NULL,
  `impressum_URL` TEXT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`sauthorID`),
  UNIQUE INDEX `sauthorID_UNIQUE` (`sauthorID` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source_type`
-- Web Page, YouTube-Video, Studie, etc.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_source_type` (
  `stypeID` INT NOT NULL,
  `stype_name` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`stypeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_source`
-- Die Quelle selbst; Hier gibt es vermutlich das (zweit-)grösste Potential für eine Abstrakte Klasse, da man je nach Source_type eine URL hat und/oder eine Datei
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_source` (
  `sourceID` INT NOT NULL,
  `source_typeID` INT NOT NULL,
  `source_URL` TEXT NULL,
  `sauthorID` INT NULL,
  `source_title` TEXT NULL,
  `description` TEXT NULL,
  `created` DATETIME NULL,
  `updated` DATETIME NULL,
  `sa_resource` TINYINT(1) DEFAULT 0,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`sourceID`),
  INDEX `fk_s_sauthor_idx` (`sauthorID` ASC) VISIBLE,
  INDEX `fk_s_stype_idx` (`source_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_s_sauthor`
    FOREIGN KEY (`sauthorID`)
    REFERENCES `schoolsystem`.`t_source_author` (`sauthorID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_s_stype`
    FOREIGN KEY (`source_typeID`)
    REFERENCES `schoolsystem`.`t_source_type` (`stypeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_author`
-- Gleiche Idee wie bei Source_author, jedoch für die fertigen Ressourcen, die man dann den verschiedenen Topic-Levels zuweisen kann
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_author` (
  `authorID` INT NOT NULL,
  `profile` TEXT NULL DEFAULT NULL,
  `settings` JSON NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`authorID`),
  UNIQUE INDEX `authorID_UNIQUE` (`authorID` ASC) VISIBLE,
  CONSTRAINT `fk_a_user`
    FOREIGN KEY (`authorID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_resource_type`
-- Auch hier dieselbe Logik wie bei den Source_types, jedoch deutlich vielfältiger
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_resource_type` (
  `rstypeID` INT NOT NULL,
  `rstype_name` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`rstypeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_resource`
-- Die fertige Ressource, die dann den verschiedenen Topic-Levels zugewiesen und konsumiert werden kann; Hier gibt es vermutlich das grösste Potential für eine Abstrakte Klasse, da man je nach Resource_type eine URL hat und/oder eine Datei
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_resource` (
  `resourceID` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `resource_type` INT NULL,
  `is_active` TINYINT(1) NULL DEFAULT '1',
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`resourceID`),
  UNIQUE INDEX `resourceID_UNIQUE` (`resourceID` ASC) VISIBLE,
  INDEX `fk_r_rstype_idx` (`resource_type` ASC) VISIBLE,
  CONSTRAINT `fk_r_rstype`
    FOREIGN KEY (`resource_type`)
    REFERENCES `schoolsystem`.`t_resource_type` (`rstypeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_uses_source`
-- Beschreibt, welche Ressource welche Quelle(n) verwendet/referenziert
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_uses_source` (
  `sourceID` INT NOT NULL,
  `resourceID` INT NOT NULL,
  `usage_date` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`sourceID`, `resourceID`),
  INDEX `fk_ru_resource_idx` (`resourceID` ASC) VISIBLE,
  CONSTRAINT `fk_ru_source`
    FOREIGN KEY (`sourceID`)
    REFERENCES `schoolsystem`.`t_source` (`sourceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ru_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_version`
-- Jede Ressource hat mind. 1 Version (Update (Korrektur, Ergänzung, etc.) => neue Version)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_version` (
  `versionID` INT NOT NULL AUTO_INCREMENT,
  `resourceID` INT NOT NULL,
  `version_number` VARCHAR(20) NOT NULL,
  `changelog` TEXT NULL DEFAULT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`versionID`),
  INDEX `fk_ver_resource_idx` (`resourceID` ASC) VISIBLE,
  UNIQUE INDEX `versionID_UNIQUE` (`versionID` ASC) VISIBLE,
  CONSTRAINT `fk_ver_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_lang_version`
-- Jede Version einer Ressource hat jeweils mind. 1 Sprach-Version (Deutsch, Englisch, etc.); Hier werden die tatsächlichen Inhalte einer Ressource gespeichert
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_lang_version` (
  `languageVersionID` INT NOT NULL AUTO_INCREMENT,
  `versionID` INT NOT NULL,
  `authorID` INT NOT NULL,
  `languageID` VARCHAR(3) NOT NULL,
  `publication_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `translator_info` VARCHAR(150) NULL DEFAULT NULL,
  `own_share` DECIMAL(5,2) NULL,
  `rest_belongs_to` INT NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`languageVersionID`),
  INDEX `fk_lv_version_idx` (`versionID` ASC) VISIBLE,
  INDEX `fk_lv_author_idx` (`authorID` ASC) VISIBLE,
  INDEX `fk_lngv_rs_to_idx` (`rest_belongs_to` ASC) VISIBLE,
  INDEX `fk_lngv_language_idx` (`languageID` ASC) VISIBLE,
  CONSTRAINT `fk_lngv_author`
    FOREIGN KEY (`authorID`)
    REFERENCES `schoolsystem`.`t_author` (`authorID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lngv_version`
    FOREIGN KEY (`versionID`)
    REFERENCES `schoolsystem`.`t_version` (`versionID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_lngv_rs_to`
    FOREIGN KEY (`rest_belongs_to`)
    REFERENCES `schoolsystem`.`t_author` (`authorID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lngv_language`
    FOREIGN KEY (`languageID`)
    REFERENCES `schoolsystem`.`t_language` (`languageID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_resource_to_level`
-- Hier werden Ressourcen den verschiedenen Topic-Levels zugewiesen (multiple Zuweisungen sind ausdrücklich erlaubt, wenn auch jede Ressource nur max. 1 Mal demselben Topic zugewiesen werden darf)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_resource_to_level` (
  `resourceID` INT NOT NULL,
  `topicID` VARCHAR(10) NOT NULL,
  `level` TINYINT NOT NULL,
  `sublevelID` VARCHAR(10) NOT NULL DEFAULT '0',
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`resourceID`, `topicID`, `level`, `sublevelID`),
  INDEX `fk_rtl_level_idx` (`topicID` ASC, `level` ASC) VISIBLE,
  CONSTRAINT `fk_rtl_level`
    FOREIGN KEY (`topicID` , `level`)
    REFERENCES `schoolsystem`.`t_topic_level` (`topicID` , `level_number`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_rtl_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `schoolsystem`.`t_inter_type`
-- (Ab hier erst relevant, Sobald wir eine Login-Funktionalität implementiert haben)
-- 0	seen
-- 1	viewed
-- 2	visited
-- 3	downloaded
-- 4	watched
-- 5	partly solved
-- 6	solved
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`t_inter_type` (
  `interaction_typeID` TINYINT NOT NULL,
  `interaction` VARCHAR(45) NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`interaction_typeID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `schoolsystem`.`ct_rinteraction`
-- Hier wird gespeichert, wann und wie ein User mit einer Ressource Interagiert hat (Automatische Speicherung nur bei Erhöhung des Typs ODER bei manueller Degradierung seitens des Users)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `schoolsystem`.`ct_rinteraction` (
  `userID` INT NOT NULL,
  `resourceID` INT NOT NULL,
  `interaction_typeID` TINYINT NOT NULL,
  `usage_date` DATETIME NULL,
  `version` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`, `resourceID`, `interaction_typeID`),
  INDEX `fk_int_resource_idx` (`resourceID` ASC) VISIBLE,
  INDEX `fk_int_inttype_idx` (`interaction_typeID` ASC) VISIBLE,
  CONSTRAINT `fk_int_user`
    FOREIGN KEY (`userID`)
    REFERENCES `schoolsystem`.`t_user` (`userID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_int_resource`
    FOREIGN KEY (`resourceID`)
    REFERENCES `schoolsystem`.`t_resource` (`resourceID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_int_inttype`
    FOREIGN KEY (`interaction_typeID`)
    REFERENCES `schoolsystem`.`t_inter_type` (`interaction_typeID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
```

WICHTIG: Programmatisch will ich noch nichts umsetzen, jetzt soll der Fokus alleinig auf der Planung einer sinnvollen Projekt-Architektur (und sinnvollen Klassen) liegen auf Basis der Informationen, die ich dir hier gegeben habe

### Antwort 1

Alles klar, Trummler — Fokus auf Architektur, kein Coding. Unten findest du eine schlanke, praxistaugliche Projektstruktur, die a) minimal bleibt und b) spätere Erweiterungen (DB statt CSV, Login etc.) sauber ermöglicht. Kernprinzip: **Domain-first** und Ports/Adapter (Hexagonal/Clean) so schlank wie möglich.

# Minimal-Architektur (empfohlen)

**Ziel:** CSV-Dateien einlesen → Domänenobjekte → per Service nutzbar; einfacher Übergabepunkt fürs HTML-Frontend (z. B. REST, später).

```
schoolsystem/
├─ backend/
│  ├─ build.gradle (oder pom.xml)
│  └─ src/
│     ├─ main/java/
│     │  └─ org/schoolsystem/
│     │     ├─ domain/                 <-- reine Fachlogik, keine Technik
│     │     │  ├─ model/
│     │     │  ├─ value/
│     │     │  ├─ services/
│     │     │  └─ ports/               <-- Interfaces (Repository, Parser)
│     │     ├─ application/            <-- Use-Cases (orchestriert Domain)
│     │     ├─ infrastructure/         <-- Adapter (CSV, optional DB)
│     │     │  ├─ csv/
│     │     │  ├─ mapper/              <-- CSV→Domain Mappings
│     │     │  └─ persistence/         <-- spätere DB-Adapter
│     │     └─ interface/
│     │        └─ rest/                <-- optional REST für Frontend
│     └─ main/resources/               <-- CSV-Dateien, Schemas, Mapping-Configs
└─ frontend/                           <-- separates Modul (HTML/CSS/JS)
   └─ (parallel umgesetzt)
```

Warum so?

* **domain** bleibt stabil (Kernmodelle, Regeln).
* **ports** geben nur *Fähigkeiten* (z. B. `TopicRepository`) vor.
* **infrastructure** implementiert Ports (z. B. CSV-Leser). Austauschbar ohne Domain anzufassen.
* **application** bündelt Use-Cases (z. B. „lade Topics mit Tags und Levels“).
* **interface** ist das Einfallstor fürs Frontend (REST ist naheliegend, aber optional).

---

# Sinnvolle modulare Aufteilung in Dateien

**Regel:** 1 Klasse/Interface = 1 Datei. Kleine Value Objects können als `record` (ab Java 16) in eigenen Dateien gepflegt werden. Keine verschachtelten *God Classes*. Sealed Hierarchien (ab Java 17) eignen sich für klar abgegrenzte Typbäume (z. B. `Resource`).

## Packages und Dateien (konkret)

```
org.schoolsystem.domain.value
  LanguageCode               // z. B. "de", "en" (record)
  Version                    // int > 0 (record + Validierung)
  Weight                     // 0..100 (record)
  TopicId                    // String mit Pattern (AAA0, Aaa1, aaaa...) (record)
  LevelNumber                // 0..9 (record), regelkonform zu type/layer prüfen

org.schoolsystem.domain.model
  Tag                        // id, version, localizations (mit Synonymen)
  TagLocalization            // Map<LanguageCode, List<String>> (Synonyme)
  TopicType                  // id, name, definition (lokalisierbar)
  Topic                      // topicId, name, type, layer, description, urls, levels, tags
  TopicUrl                   // url + version
  TopicLevel                 // levelNumber, description
  SourceType                 // id, name
  Source (sealed interface)  // gemeinsam: title?, urls?, author?, timestamps
    UrlSource
    FileSource               // für spätere Datei-Backends
  SourceAuthor               // name, URL, description, impressum, version
  ResourceType               // id, name
  Resource (sealed interface)
    UrlResource              // title, description, type, active, version
    FileResource             // optional später
  VersionedResource          // resourceID → List<VersionEntry> (siehe DB)
  VersionEntry               // versionID, versionNumber, changelog
  LanguageVersion            // pro Version: language, author, pubDate, etc.
  Author                     // authorID, profile, settings (JSON) – referenziert t_user
  ResourceToLevel            // resourceID, topicId, level, sublevelID
  InteractionType            // seen/viewed/... (Enum oder Value)
  ResourceInteraction        // userID, resourceID, interactionType, usageDate

org.schoolsystem.domain.ports
  // Repositories (Read/Write je nach Bedarf; für CSV meist Read-only)
  TagRepository
  TopicRepository
  SourceRepository
  ResourceRepository
  AuthorRepository
  // Parser/Loader
  CsvReader                  // Interface: read(path)→List<String[]> (oder Maps)
  CsvSchema                  // Interface: Spaltendeklaration + Validierung
  // Serviceschnittstellen (falls Austauschbarkeit wichtig)
  TopicLinker                // löst typeID, URLs, Levels, Tags zu Aggregaten auf

org.schoolsystem.domain.services
  TopicService               // Laden, Validieren, Layer-Regeln prüfen
  TagService                 // Synonyme/Localizations konsistent halten
  MatchingService            // (optional) Interessen→Topics Ranking (Gewichte)
  ResourceService            // Versionierung, Aktiv-Status, Zuweisungen prüfen
  ValidationService          // gemeinsame Validierungsregeln (Specification-Pattern)

org.schoolsystem.application
  // Orchestriert Use-Cases; ruft Domain-Services/Repos auf
  LoadCatalogUseCase         // lädt Topics incl. Levels, URLs, Tags
  GetTopicDetailsUseCase
  ListResourcesForLevelUseCase
  // DTOs (nur hier oder in interface/rest)
  dto/
    TopicDTO, ResourceDTO, TagDTO, ...

org.schoolsystem.infrastructure.csv
  // Konkrete Implementierungen der Ports für CSV
  OpenCsvReader              // CsvReader-Implementierung (oder Apache Commons CSV)
  schema/
    TagCsvSchema
    TopicCsvSchema
    TopicUrlCsvSchema
    TopicLevelCsvSchema
    // ... je Tabelle eine Schema-Klasse
  repository/
    CsvTagRepository
    CsvTopicRepository
    CsvSourceRepository
    CsvResourceRepository

org.schoolsystem.infrastructure.mapper
  TagRowMapper               // CSV-Zeile → Tag
  TopicRowMapper             // CSV-Zeile → Topic (ohne Aggregation)
  TopicLevelRowMapper
  TopicUrlRowMapper
  // Mapper trennen Parsing von Modellaufbau (bessere Testbarkeit)

org.schoolsystem.infrastructure.persistence
  // Platzhalter für spätere DB-Implementierungen (JPA/JOOQ/MyBatis)
  // z. B. JpaTopicRepository (später)

org.schoolsystem.interface.rest  (optional, minimal)
  TopicController
  ResourceController
  // Konvertiert Domain ⇄ DTO und stellt JSON fürs HTML-Frontend bereit
```

---

# Domänen-Abgrenzung (Aggregates) und Beziehungen

**Aggregate Roots** (sinnvoll in eurem Modell):

* `Topic` (enthält `TopicLevel`, `TopicUrl`, Zuweisungen zu `Tag` inkl. `Weight`)
* `Tag` (mit `TagLocalization` inkl. Synonyme)
* `Resource` (mit `VersionEntry` → `LanguageVersion`, Zuweisungen zu TopicLevel via `ResourceToLevel`)
* `Source` (mit `SourceType`, `SourceAuthor`)

**Kombinationstabellen** (`ct_*`) werden als Assoziations-Objekte modelliert, **nicht** als nackte Maps:

* `TopicTagAssignment { TopicId, TagId, Weight }` (entweder innerhalb `Topic` gehalten oder als eigenes Repository, je nach Ladepfad)
* `ResourceToLevel { resourceId, topicId, level, sublevelId }`
* `ResourceInteraction { userId, resourceId, interactionType, usageDate }`

**Lokalisierung**

* Zwei klare Typen:

  * `LocalizedText` → `Map<LanguageCode, String>` (ohne Synonyme)
  * `LocalizedSynonyms` → `Map<LanguageCode, List<String>>` (für Tags)
* Wo sinnvoll verwenden: `TopicType.name/definition` (LocalizedText), `Topic.description` (LocalizedText), `Tag.localizations` (LocalizedSynonyms).

---

# Interfaces vs. abstrakte Klassen (Best Practices)

* **Repositories, Parser, Validatoren:** **Interfaces** (leicht austauschbar: CSV heute, DB morgen).
* **Hierarchien mit klarer Variantenmenge:** **Sealed interface** + finale Implementierungen (z. B. `Resource` → `UrlResource`, `FileResource`; `Source` → `UrlSource`, `FileSource`). Das hält offen (Interface) und zugleich kontrolliert (sealed).
* **Abstrakte Klassen** nur, wenn gemeinsames **Zustand + Logik** mehrfach wiederverwendet wird (z. B. gemeinsame Audit-Felder und Validierung). Oft sind **Komposition + Hilfsklassen** sauberer als tiefe Vererbung.

---

# CSV-spezifische Planung

* **Schema-Klassen pro CSV-Tabelle** (Spaltennamen, Pflichtfelder, Typkonvertierung, semantische Checks).
* **Mappers** (Row → Domain) strikt getrennt vom **Repository**, das Laden/Joinen orchestriert.
* **Join-Strategie**:

  1. Lade Basistabellen (`t_topic`, `t_tag`, `t_topic_type`, …) in Maps (id→Objekt).
  2. Lade Relationstabellen (`ct_*`) und **resolviere** Beziehungen (IDs → Referenzen) in einem **TopicLinker** oder innerhalb der Repository-Implementierung.
  3. Achte auf Lade-Reihenfolge: `TopicType` vor `Topic`, `Topic` vor `TopicLevel`/`TopicUrl`, `Tag` vor `ct_topic_tags`, `Resource` vor `ct_uses_source` und `ct_resource_to_level`.
* **Validierung**:

  * `Topic.layer` ≥ `max(layer(voraussetzungen)) + 1` (wenn Voraussetzungen modelliert werden).
  * `Weight` 0..100.
  * Eindeutigkeit gemäß SQL-Constraints (z. B. `topicID`, `name`).
  * Konsistenz pro `version`-Feld (falls genutzt).

---

# Minimales Datenflussdiagramm

Frontend (HTML/JS) → (optional REST) → **application.UseCase** → **domain.services** → **domain.ports** (Repositories) → **infrastructure.csv** (liest CSV, mappt, verknüpft) → Domain-Objekte → zurück als DTOs.

---

# Konkrete Klassenskizzen (nur zur Planung, kein Code nötig)

* `Topic`

  * `TopicId id; LocalizedText name; TopicType type; int layer; LocalizedText description; List<TopicLevel> levels; List<TopicUrl> urls; List<TopicTagAssignment> tags; Version version;`
* `Tag`

  * `int id; LocalizedSynonyms localizations; Version version;`
* `Resource` (sealed)

  * `resourceId, title (LocalizedText optional), description (LocalizedText), ResourceType type, boolean active, Version version`
  * Untertypen: `UrlResource`, `FileResource`
* `VersionEntry`

  * `versionId, versionNumber (String), changelog, List<LanguageVersion>`
* `LanguageVersion`

  * `languageVersionId, versionId, authorId, LanguageCode language, Date publicationDate, translatorInfo, BigDecimal ownShare, Integer restBelongsTo`
* `Source` (sealed)

  * `sourceId, SourceType type, sourceUrl?, sourceTitle, description, created, updated, saResource flag, SourceAuthor author, Version version`

---

# Validierungs- und Regel-Checks (wo?)

* **Domain.services.ValidationService**:

  * `validateTopicLayer(topic)`
  * `validateUniqueConstraints(collections)`
  * `validateLocalizationCompleteness(entity, requiredLanguages)`
* **Row-Level** (CSV Schema):

  * Typen, Pflichtfelder, Ranges (TinyInt, NotNull etc.)
* **Aggregate-Level** (Services):

  * Semantik über mehrere Tabellen hinweg (z. B. Level-Start abhängig von `layer` und `type`).

---

# DTOs und Mapping (für das spätere Frontend)

* **DTOs** nur für Schnittstellenebene, nicht in `domain`.
* Trenne Domain-Model (reich) von DTO (flach, serialisierbar).
* Einfacher Mapper in `application` oder `interface.rest` (z. B. MapStruct später möglich, jetzt erstmal manuell).

---

# Tests (essentiell, aber minimal)

```
src/test/java/org/schoolsystem/
  domain/
    TopicServiceTest          // Layer-Regeln, Tag-Gewichte
    ResourceServiceTest
  infrastructure/csv/
    TagCsvSchemaTest
    TopicRowMapperTest
    CsvTopicRepositoryIT      // Integrations-Test mit Beispiel-CSV
```

---

# Versionierung / IDs / Typen (saubere Value Objects)

* `TopicId` als Value Object kapselt das **Benennungspattern** (AAA0/Aaa1/aaaa).
* `LanguageCode` kapselt ISO 639-1 (Strings von CSV kommen, VO prüft).
* `Version`, `Weight`, `LevelNumber` als VO erzwingen Range-Checks **zentral**.
* Diese VOs in **eigenen Dateien** halten (übersichtlich, wiederverwendbar).

---

# Warum diese Struktur „minimal, aber richtig“ ist

* Sie verhindert, dass CSV-Parsing-Details im Kernmodell „durchbluten“.
* Sie erlaubt ein späteres Ersetzen der CSV-Adapter durch JPA/JOOQ, ohne Domain/Use-Cases umzubauen.
* Sie bleibt klein genug, um im Ausbildungsumfeld realistisch umgesetzt zu werden.

Wenn du willst, passe ich das Package-Präfix an eure Organisation an und zeichne dir eine kleine UML-Skizze der wichtigsten Aggregates. Oder ich erstelle eine kurze „Checkliste“, welche CSV-Dateien in welcher Reihenfolge geladen werden sollten und welche Minimalfelder zwingend sind. ✔️

