#!/usr/bin/env bash
# Arbeitsverzeichnis auf Skript‐Ordner setzen
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# 1) Schema & Tabellen anlegen
mysql --local-infile=1 -u root -p < schema.sql

# 2) CSV-Daten importieren
mysql --local-infile=1 -u root -p < data_template.sql