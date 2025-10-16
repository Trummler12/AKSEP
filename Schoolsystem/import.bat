@echo off
REM import.bat – Initialisiert die Schoolsystem-Datenbank

REM Arbeitsverzeichnis auf Ordner des Skripts setzen
cd /d "%~dp0"

REM === Pfad zur mysql.exe definieren ===
REM Hinweis: Uniform Server Zero XV nutzt typischerweise diesen Pfad:
set MYSQL="C:\UniServerZ\UniServerZ\core\mysql\bin\mysql.exe"

REM === Schema (Tabellenstruktur) importieren ===
%MYSQL% --local-infile=1 -u root -p < schema.sql

REM === CSV-Daten in Tabellen einfügen ===
%MYSQL% --local-infile=1 -u root -p < data_template.sql

pause