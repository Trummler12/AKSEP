package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.Tag;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TagCsvLoaderTest {

    @Test
    void loadsTagsFromCsv() {
        TagCsvLoader loader = new TagCsvLoader();

        List<Tag> tags = loader.loadAll();

        Tag first = tags.get(0);
        assertEquals(1, first.id());
        assertEquals(List.of("art"), first.labels());
        assertEquals(1, first.version());

        // Example with synonyms in current CSV (id 76: "artificial intelligence","AI|A.I.")
        Tag tag76 = tags.stream()
                .filter(t -> t.id() == 76)
                .findFirst()
                .orElseThrow();

        assertEquals(List.of("artificial intelligence", "AI", "A.I."), tag76.labels());
    }

    @Test
    void parseSynonymsHandlesEmptyAndSimpleValues() {
        assertTrue(TagCsvLoader.parseSynonyms("").isEmpty());
        assertEquals(List.of("acanthology"), TagCsvLoader.parseSynonyms("acanthology"));
    }

    @Test
    void parseSynonymsHandlesArrayLikeValues() {
        List<String> parsed = TagCsvLoader.parseSynonyms("[\"foo\",\"bar\"]");
        assertEquals(List.of("foo", "bar"), parsed);

        List<String> parsedNoQuotes = TagCsvLoader.parseSynonyms("[foo, bar]");
        assertEquals(List.of("foo", "bar"), parsedNoQuotes);
    }

    @Test
    void parseSynonymsHandlesPipeSeparatedValues() {
        assertEquals(List.of("AI", "A.I."), TagCsvLoader.parseSynonyms("AI|A.I."));
        assertEquals(List.of("AI", "A.I."), TagCsvLoader.parseSynonyms(" AI | A.I. "));
    }
}
