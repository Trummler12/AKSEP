package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.model.TopicType;
import org.schoolsystem.domain.value.TopicId;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TopicCsvLoaderTest {

    @Test
    void loadsTopicsFromCsv() {
        // TopicTypes zuerst laden
        TopicTypeCsvLoader typeLoader = new TopicTypeCsvLoader();
        List<TopicType> types = typeLoader.loadAll();

        TopicCsvLoader loader = new TopicCsvLoader(types);

        List<Topic> topics = loader.loadAll();
        assertFalse(topics.isEmpty(), "No topics loaded");

        // Beispiel: TAX1 (General Subject)
        Topic tax1 = topics.stream()
                .filter(t -> t.id().equals(TopicId.of("TAX1")))
                .findFirst()
                .orElseThrow(() -> new AssertionError("TAX1 not found"));

        assertEquals("TAX1", tax1.id().value());
        assertNotNull(tax1.name());
        assertNotNull(tax1.type());
        assertTrue(tax1.layer() >= 0);

        // URLs sind optional; hier prüfen wir nur, dass die Liste nie null ist
        assertNotNull(tax1.urls());

        // Beispiel: SPO1 (General Subject)
        Topic spo1 = topics.stream()
                .filter(t -> t.id().equals(TopicId.of("SPO1")))
                .findFirst()
                .orElseThrow(() -> new AssertionError("SPO1 not found"));

        assertEquals("SPO1", spo1.id().value());
        assertNotNull(spo1.name());
        assertNotNull(spo1.type());
        assertTrue(spo1.layer() >= 0);

        // URLs sind optional; hier prüfen wir nur, dass die Liste nie null ist
        assertNotNull(spo1.urls());
    }
}
