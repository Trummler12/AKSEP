package org.schoolsystem.infrastructure.csv;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * CSV-Reader für Ressourcen im Classpath (src/main/resources).
 *
 * - Ignoriert leere Zeilen und Zeilen, die mit '#' beginnen
 * - Erste nicht-leere, nicht-kommentierte Zeile wird als Header interpretiert
 * - Liefert Liste von Zeilen als Map<Spaltenname, Wert>
 */
public final class CsvFileReader {

    public List<Map<String, String>> readWithHeader(String resourcePath) {
        InputStream in = Thread.currentThread()
                .getContextClassLoader()
                .getResourceAsStream(resourcePath);

        if (in == null) {
            throw new IllegalArgumentException("Resource not found on classpath: " + resourcePath);
        }

        try (BufferedReader reader =
                     new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {

            String[] headers = null;
            List<Map<String, String>> rows = new ArrayList<>();

            String line;
            while ((line = reader.readLine()) != null) {
                // BOM entfernen, falls vorhanden
                line = line.replace("\uFEFF", "").trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }

                if (headers == null) {
                    // Header-Zeile
                    headers = CsvLineParser.parse(line);
                    for (int i = 0; i < headers.length; i++) {
                        headers[i] = headers[i].trim();
                    }
                } else {
                    String[] values = CsvLineParser.parse(line);
                    Map<String, String> row = new LinkedHashMap<>();

                    for (int i = 0; i < headers.length; i++) {
                        String header = headers[i];
                        String value = i < values.length ? values[i] : "";
                        row.put(header, value);
                    }

                    rows.add(row);
                }
            }

            if (headers == null) {
                throw new IllegalStateException("No header row found in resource: " + resourcePath);
            }

            return rows;
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read resource: " + resourcePath, e);
        }
    }
}
