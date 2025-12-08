package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.LocalizedText;
import org.schoolsystem.domain.model.TopicType;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Lädt TopicType-Lookup-Werte aus csv/t_topic_type.csv.
 *
 * Entspricht t_topic_type:
 *  - typeID
 *  - type_name        -> LocalizedText (en)
 *  - definition (opt) -> LocalizedText (en) oder null
 *  - version          -> hier: immer 1
 */
public final class TopicTypeCsvLoader {

    private static final LanguageCode EN = new LanguageCode("en");

    private final CsvFileReader reader;
    private final String resourcePath;

    public TopicTypeCsvLoader() {
        this(new CsvFileReader(), "csv/t_topic_type.csv");
    }

    TopicTypeCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = reader;
        this.resourcePath = resourcePath;
    }

    public List<TopicType> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<TopicType> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            int id = Integer.parseInt(row.get("typeID").trim());
            String nameRaw = row.get("type_name");
            String defRaw = row.get("definition");

            LocalizedText name = LocalizedText.of(EN, nameRaw == null ? "" : nameRaw);

            TopicType topicType;
            if (defRaw == null) {
                topicType = TopicType.of(id, name, 1);
            } else {
                String trimmed = defRaw.trim();
                if (trimmed.isEmpty() || trimmed.equalsIgnoreCase("NULL")) {
                    topicType = TopicType.of(id, name, 1);
                } else {
                    LocalizedText definition = LocalizedText.of(EN, trimmed);
                    topicType = TopicType.of(id, name, definition, 1);
                }
            }

            result.add(topicType);
        }

        return Collections.unmodifiableList(result);
    }
}
