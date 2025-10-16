# Schoolsystem Database Setup

Dieses Verzeichnis enthält ein kleines Flask-Projekt, das eine `schoolsystem`-Datenbank nutzt
und per GPT die besten Themen zu einer Nutzerbeschreibung ermittelt.
Die Funktion `get_tag_weights()` wählt dabei zunächst relevante Tags per GPT aus
und ordnet ihnen anschließend Gewichte zu.

## Dateien

- `schema.sql` – erzeugt das Datenbankschema (Tabellen, Typen, Keys).
- `data_template.sql` – lädt CSV-Daten aus `SchoolsystemCSV/` in die Tabellen.
- `import.bat` – Windows-Batch-Skript für Uniform Server.
- `import.sh` – Bash-Skript für Unix-artige Umgebungen (WSL, macOS, Linux).
- `SchoolsystemCSV/` – enthält alle .csv-Dateien für den Import.

## Voraussetzungen

- **Uniform Server Zero XV** mit aktivierter `local_infile`-Funktion.
- **MySQL-Client** (`mysql.exe`).
- Optional für `import.sh`: Git Bash, WSL oder vergleichbare Unix-Shell.

## Nutzung

1. Terminal oder PowerShell öffnen und in dieses Verzeichnis wechseln:
```bash
cd M162-SQL/Schoolsystem
```
2. Beispieldaten importieren:
   - **Windows**: `./import.bat`
   - **Unix / WSL / Git Bash**: `./import.sh` (ggf. zuvor `chmod +x import.sh`)
3. Abhängigkeiten installieren:
```bash
pip install -r requirements.txt
```
4. OpenAI-Schlüssel hinterlegen:
   Lege den Key entweder in `backend/openai_key.txt` ab oder setze die
   Umgebungsvariable `OPENAI_API_KEY` manuell. Nach einer Änderung den
   Backend-Server neu starten.
5. Backend starten:
```bash
python backend/app.py
```

ALLES ZUSAMMEN:
1. SERVER STARTEN
```bash
cd M162-SQL/Schoolsystem
pip install -r requirements.txt
# API-Key in backend/openai_key.txt ablegen oder per
# $Env:OPENAI_API_KEY setzen
python backend/app.py
```

6. [http://localhost:5000/](http://localhost:5000/) im Browser aufrufen.

Meine Beschreibung: Ich bin Tierrechtsaktivist und möchte die menschliche Zivilisation vor ihrer Selbstzerstörung retten, indem ich mich politisch engagiere und dabei das Bildungssystem reformiere, mich für Tierrechte stark mache und Aufklärungsarbeit leiste zu verschiedensten Themen

💡**mysql.exe wird standardmäßig unter folgendem Pfad erwartet:**
```
C:\UniServerZ\UniServerZ\core\mysql\bin\mysql.exe
```
Falls dieser Pfad auf deinem System nicht existiert, öffne die Datei `import.bat` in einem Texteditor und passe die Zeile `set MYSQL=…` an deinen Pfad zu `mysql.exe` an.
