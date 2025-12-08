package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.ResourceType;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Lädt ResourceType-Lookup-Werte aus csv/t_resource_type.csv.
 *
 * Entspricht t_resource_type:
 *  - rstypeID
 *  - rstype_name
 *  - version (hier: immer 1)
 */
public final class ResourceTypeCsvLoader {

    private final CsvFileReader reader;
    private final String resourcePath;

    public ResourceTypeCsvLoader() {
        this(new CsvFileReader());
    }

    public ResourceTypeCsvLoader(CsvFileReader reader) {
        this(reader, "csv/t_resource_type.csv");
    }

    ResourceTypeCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = reader;
        this.resourcePath = resourcePath;
    }

    public List<ResourceType> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<ResourceType> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            int id = Integer.parseInt(row.get("rstypeID").trim());
            String name = row.get("rstype_name").trim();
            int version = 1;

            result.add(ResourceType.of(id, name, version));
        }

        return Collections.unmodifiableList(result);
    }
}
