package org.schoolsystem.infrastructure.csv;

import java.util.ArrayList;
import java.util.List;

/**
 * Minimaler CSV-Zeilenparser.
 * Unterstützt:
 *  - Kommas als Trenner
 *  - doppelte Anführungszeichen als Text-Delimiter
 *  - "" innerhalb eines Strings als escaptes "
 *
 * Beispiel:
 *  1,"Hello, World","He said ""Hi"""
 * wird zu:
 *  ["1", "Hello, World", "He said \"Hi\""]
 */
final class CsvLineParser {

    private CsvLineParser() {
        // utility class
    }

    static String[] parse(String line) {
        List<String> result = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    // Escaptes Doppel-Quote ("")
                    current.append('"');
                    i++; // nächstes Zeichen überspringen
                } else {
                    // Quote toggelt den Status
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                // Feld abgeschlossen
                result.add(current.toString());
                current.setLength(0);
            } else {
                current.append(c);
            }
        }

        // letztes Feld
        result.add(current.toString());

        return result.toArray(new String[0]);
    }
}
