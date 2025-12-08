package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.TopicLevel;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.LevelNumber;
import org.schoolsystem.domain.value.TopicId;
import org.schoolsystem.domain.model.LocalizedText;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Lädt Topic-Level-Daten aus csv/t_topic_levels.csv.
 *
 * Entspricht t_topic_level:
 *  - topicID
 *  - level_number
 *  - lang
 *  - description
 *  - version (wird ignoriert; intern immer 1)
 */
public final class TopicLevelCsvLoader {

    private final CsvFileReader reader;
    private final String resourcePath;

    public TopicLevelCsvLoader() {
        this(new CsvFileReader(), "csv/t_topic_levels.csv");
    }

    TopicLevelCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = reader;
        this.resourcePath = resourcePath;
    }

    public List<TopicLevel> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<TopicLevel> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            String topicIdRaw = row.get("topicID");
            String levelRaw = row.get("level_number");
            String langRaw = row.get("lang");
            String descriptionRaw = row.get("description");

            if (topicIdRaw == null || levelRaw == null) {
                // defensiv: unvollständige Zeilen überspringen
                continue;
            }

            TopicId topicId = TopicId.of(topicIdRaw.trim());
            int levelValue = Integer.parseInt(levelRaw.trim());
            LevelNumber levelNumber = LevelNumber.of(levelValue);

            // Version aus CSV ignorieren, wir setzen immer 1
            int version = 1;

            TopicLevel topicLevel;
            if (descriptionRaw == null || descriptionRaw.trim().isEmpty()
                    || "NULL".equalsIgnoreCase(descriptionRaw.trim())) {
                // Variante ohne Beschreibung
                topicLevel = TopicLevel.of(topicId, levelNumber, version);
            } else {
                String langCode = (langRaw == null || langRaw.trim().isEmpty())
                        ? "en"
                        : langRaw.trim();
                LanguageCode languageCode = new LanguageCode(langCode);
                LocalizedText description = LocalizedText.of(languageCode, descriptionRaw.trim());
                topicLevel = TopicLevel.of(topicId, levelNumber, description, version);
            }

            result.add(topicLevel);
        }

        return Collections.unmodifiableList(result);
    }
}
