package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.TopicType;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TopicTypeCsvLoaderTest {

    @Test
    void loadsTopicTypesFromCsv() {
        TopicTypeCsvLoader loader = new TopicTypeCsvLoader();

        List<TopicType> types = loader.loadAll();

        assertEquals(8, types.size());

        LanguageCode en = new LanguageCode("en");

        TopicType tt0 = types.get(0);
        assertEquals(0, tt0.id());
        assertEquals(1, tt0.version());
        assertEquals("General Subject", tt0.name().get(en).orElseThrow());

        assertTrue(tt0.definition().isPresent());
        assertTrue(tt0.definition().get().get(en).orElseThrow()
                .startsWith("Tests for every half Level"));

        TopicType tt3 = types.get(3);
        assertEquals(3, tt3.id());
        assertEquals("Achievement", tt3.name().get(en).orElseThrow());
        assertTrue(tt3.definition().isEmpty()); // CSV: NULL
    }
}
