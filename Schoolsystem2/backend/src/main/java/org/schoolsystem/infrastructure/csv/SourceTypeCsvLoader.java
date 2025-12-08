package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.SourceType;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Lädt SourceType-Lookup-Werte aus csv/t_source_type.csv.
 *
 * Entspricht t_source_type:
 *  - stypeID
 *  - stype_name
 *  - version (hier: immer 1)
 */
public final class SourceTypeCsvLoader {

    private final CsvFileReader reader;
    private final String resourcePath;

    public SourceTypeCsvLoader() {
        this(new CsvFileReader());
    }

    public SourceTypeCsvLoader(CsvFileReader reader) {
        this(reader, "csv/t_source_type.csv");
    }

    SourceTypeCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = reader;
        this.resourcePath = resourcePath;
    }

    public List<SourceType> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<SourceType> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            int id = Integer.parseInt(row.get("stypeID").trim());
            String name = row.get("stype_name").trim();
            int version = 1; // Lookup-Default

            result.add(SourceType.of(id, name, version));
        }

        return Collections.unmodifiableList(result);
    }
}
