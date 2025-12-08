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

        // Beispiel mit Synonym (id 18: "spines and thorns","acanthology")
        Tag tag18 = tags.stream()
                .filter(t -> t.id() == 18)
                .findFirst()
                .orElseThrow();

        assertEquals(List.of("spines and thorns", "acanthology"), tag18.labels());
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
}
