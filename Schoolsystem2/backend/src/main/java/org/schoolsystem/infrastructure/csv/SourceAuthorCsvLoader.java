package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.SourceAuthor;
import org.schoolsystem.domain.value.WebUrl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * CSV-Loader für t_source_author.csv.
 *
 * Erwartetes Header-Format:
 *   sauthorID, sauthor_name, sauthor_URL, sauthor_description, impressum_URL, version
 *
 * Die version-Spalte im CSV wird ignoriert; wir setzen intern immer version = 1.
 */
public final class SourceAuthorCsvLoader {

    private static final String DEFAULT_CSV_PATH = "csv/t_source_author.csv";

    private final CsvFileReader csvFileReader;
    private final String resourcePath;

    public SourceAuthorCsvLoader() {
        this(new CsvFileReader(), DEFAULT_CSV_PATH);
    }

    SourceAuthorCsvLoader(CsvFileReader csvFileReader, String resourcePath) {
        this.csvFileReader = csvFileReader;
        this.resourcePath = resourcePath;
    }

    public List<SourceAuthor> loadAll() throws IOException {
        List<Map<String, String>> rows = csvFileReader.readWithHeader(resourcePath);
        List<SourceAuthor> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            int id = parseInt(row.get("sauthorID"), "sauthorID");
            String name = trimToEmpty(row.get("sauthor_name"));
            if (name.isEmpty()) {
                throw new IllegalArgumentException(
                        "sauthor_name must not be empty for sauthorID=" + id
                );
            }

            String urlRaw = trimToNull(row.get("sauthor_URL"));
            String description = trimToNull(row.get("sauthor_description"));
            String impressumRaw = trimToNull(row.get("impressum_URL"));

            int version = 1; // CSV-Version ignorieren

            WebUrl authorUrl = urlRaw != null ? WebUrl.fromString(urlRaw) : null;
            WebUrl impressumUrl = impressumRaw != null ? WebUrl.fromString(impressumRaw) : null;

            SourceAuthor author = SourceAuthor.of(
                    id,
                    name,
                    authorUrl,
                    description,
                    impressumUrl,
                    version
            );
            result.add(author);
        }

        return Collections.unmodifiableList(result);
    }

    private static int parseInt(String raw, String fieldName) {
        if (raw == null) {
            throw new IllegalArgumentException("Field '" + fieldName + "' is missing");
        }
        try {
            return Integer.parseInt(raw.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(
                    "Field '" + fieldName + "' must be an integer, but was: '" + raw + "'", ex
            );
        }
    }

    private static String trimToNull(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        if (trimmed.isEmpty() || "NULL".equalsIgnoreCase(trimmed)) {
            return null;
        }
        return trimmed;
    }

    private static String trimToEmpty(String raw) {
        return raw == null ? "" : raw.trim();
    }
}
