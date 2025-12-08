package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.ResourceTag;
import org.schoolsystem.domain.value.TagWeight;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * CSV-Loader für ct_resource_tags.csv.
 *
 * Erwartetes Schema:
 *   resourceID,tagID,weight
 */
public final class ResourceTagCsvLoader {

    private static final String DEFAULT_CSV_PATH = "csv/ct_resource_tags.csv";

    private final CsvFileReader reader;
    private final String resourcePath;

    public ResourceTagCsvLoader() {
        this(new CsvFileReader(), DEFAULT_CSV_PATH);
    }

    // paket-sichtbar für Tests
    ResourceTagCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = Objects.requireNonNull(reader, "reader must not be null");
        this.resourcePath = Objects.requireNonNull(resourcePath, "resourcePath must not be null");
    }

    public List<ResourceTag> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<ResourceTag> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            String resourceIdRaw = row.get("resourceID");
            String tagIdRaw = row.get("tagID");
            String weightRaw = row.get("weight");

            // Leere oder kaputte Zeilen hart ablehnen – das CSV soll sauber sein
            if (resourceIdRaw == null || tagIdRaw == null || weightRaw == null) {
                throw new IllegalArgumentException(
                        "Row in " + resourcePath + " is missing required fields: " + row
                );
            }

            int resourceId = parseInt(resourceIdRaw, "resourceID");
            int tagId = parseInt(tagIdRaw, "tagID");
            int weightValue = parseInt(weightRaw, "weight");

            TagWeight weight = TagWeight.of(weightValue);
            int version = 1; // CSV-Version ignorieren, wie bei den anderen Modellen

            ResourceTag rt = ResourceTag.of(resourceId, tagId, weight, version);
            result.add(rt);
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
}
