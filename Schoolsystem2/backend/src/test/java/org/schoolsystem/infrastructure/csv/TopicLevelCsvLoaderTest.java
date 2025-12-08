package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.TopicLevel;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TopicLevelCsvLoaderTest {

    @Test
    void loadAll_shouldLoadAllTopicLevelsWithoutError() {
        TopicLevelCsvLoader loader = new TopicLevelCsvLoader();

        List<TopicLevel> levels = loader.loadAll();

        assertNotNull(levels, "Loader must not return null");
        // In deiner CSV sind bereits Einträge vorhanden – wir erwarten also mindestens einen Level.
        assertFalse(levels.isEmpty(), "Expected at least one TopicLevel from CSV");
    }
}
