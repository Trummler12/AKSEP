# Schoolsystem2 — Backend

Dieses Projekt ist das Java-Backend für das Schoolsystem2-Projekt.  
Es ist domänenorientiert aufgebaut und arbeitet derzeit mit CSV-basierten Datenquellen.  
Die Architektur ist langfristig auf Erweiterbarkeit (lokale Dateien, DB, REST-API) ausgelegt.

---

## Inhaltsverzeichnis

0. [Anforderungen (Requirements)](#0-anforderungen-requirements)
1. [Projektstruktur (Kurzüberblick)](#1-projektstruktur-kurzüberblick)
2. [Projekt einrichten (ab Clone)](#2-projekt-einrichten-ab-clone)
3. [Tests ausführen](#3-tests-ausführen)
4. [Aktueller Status](#4-aktueller-status)
5. [Nützliche Befehle (Backend)](#5-nützliche-befehle-backend)
6. [Weitere Dokumentation](#6-weitere-dokumentation)

---

## 0. Anforderungen (Requirements)

### 0.1. Software

#### Java Development Kit (JDK)

- Empfohlen: **JDK 17 oder 21 (LTS)**  
- Funktioniert auch mit JDK 25, da wir über Gradle-Toolchains bauen.
- Prüfung:
  ```bash
  java -version
  javac -version
  ```

#### Gradle

* Empfohlen: **Gradle 9.x**, z. B. **9.2.1**
* Prüfen:
  ```bash
  gradle -v
  ```

#### Optional: Gradle Wrapper (empfohlen)

Falls `gradlew` im Projekt vorhanden ist, kann Gradle ohne lokale Installation verwendet werden:

* Windows:
  ```bash
  .\gradlew.bat test
  ```
* macOS/Linux:
  ```bash
  ./gradlew test
  ```

#### IDE

Empfohlen:
* IntelliJ IDEA (Community reicht)
* VS Code + Java Extension Pack
* Eclipse

---

### 0.2. Java-Dependencies (aus `backend/build.gradle`)

Das Backend benötigt aktuell nur **JUnit 5** als Testframework.

Minimaler funktionierender `build.gradle`:
```groovy
plugins {
    id 'java'
}

group = 'org.schoolsystem'
version = '0.0.1-SNAPSHOT'

repositories {
    mavenCentral()
}

java {
    // Wir bauen mit Java 17, unabhängig davon, welches JDK installiert ist
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

dependencies {
    // JUnit 5 API & Engine
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'

    // Notwendig für Gradle 8+/9+, damit JUnit platform richtig startet
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
}

test {
    useJUnitPlatform()
}
```

> **Wichtig:** Bei jeder Änderung an den Dependencies muss sowohl die README als auch das Buildskript angepasst werden.

---

## 1. Projektstruktur (Kurzüberblick)

* `backend/`
  * `build.gradle` — Gradle-Buildskript
  * `src/main/java` — Produktivcode
  * `src/test/java` — Testcode (JUnit)
* `frontend/`
  * HTML/CSS/JS (separates Modul, derzeit unabhängig vom Backend)

Die Backend-Pakete folgen dieser Struktur:
* `org.schoolsystem.domain.value`
  Value Types (LanguageCode, TopicId, LevelNumber, TagWeight, WebUrl)
* `org.schoolsystem.domain.model`
  Domänenmodelle (Tag, Topic, Resource, usw.)
* `org.schoolsystem.domain.services`
  Fachlogik
* `org.schoolsystem.domain.ports`
  Schnittstellen (z. B. Repository-Interfaces)
* `org.schoolsystem.application`
  Use-Cases
* `org.schoolsystem.infrastructure`
  CSV-Adapter, Mapper, Persistence-Schicht
* `org.schoolsystem.interface.rest`
  optionale spätere REST-API

---

## 2. Projekt einrichten (ab Clone)

1. Repository klonen:
   ```bash
   git clone <URL>
   cd Schoolsystem2/backend
   ```

2. Java prüfen:
   ```bash
   java -version
   javac -version
   ```

3. Gradle oder Wrapper verwenden:

Variante A: Globale Gradle-Installation
```bash
gradle test
```

Variante B: Wrapper benutzen (empfohlen)

Windows:
```bash
.\gradlew.bat test
```
Linux/macOS:
```bash
./gradlew test
```

---

## 3. Tests ausführen

### 3.1. Über Gradle

```bash
gradle test
# oder (wenn Wrapper vorhanden):
./gradlew test
```

Tests liegen unter:
`backend/src/test/java/**`

Aktuell relevante Testklassen:
* `LanguageCodeTest`
* `LevelNumberTest`
* `TagWeightTest`
* `TopicIdTest`
* `WebUrlTest`

### 3.2. Über IDE

* Projekt als Gradle-Projekt importieren
* Im Testordner Rechtsklick → „Run Tests“

---

## 4. Aktueller Status

* Die **Value-Objekte** sind vollständig:
  * `LanguageCode`
  * `LevelNumber`
  * `TagWeight`
  * `TopicId`
  * `WebUrl`

* Domain-Modelle sind geplant, aber teilweise noch nicht implementiert:
  * `LocalizedText`
  * `Tag`
  * `Topic`
  * `Resource`
  * ...

* Es gibt noch **keine ausführbare Backend-Anwendung** (keine `main()`).
  Fokus liegt aktuell auf:
  * Domain-Modellierung
  * CSV-Einleselogik
  * Testabdeckung der Value Objects

---

## 5. Nützliche Befehle (Backend)

```bash
gradle build
gradle test
gradle clean
```

Später (wenn wir Applikationscode ergänzen):
```bash
gradle run
```

---

## 6. Weitere Dokumentation

* `DEVELOPER.md` — detaillierte Architekturbeschreibung (Model, Services, Ports)
* `PLANUNG.md` — fachliche Planung: Topic-System, Tags, Requirements, CSV-Spezifikationen
