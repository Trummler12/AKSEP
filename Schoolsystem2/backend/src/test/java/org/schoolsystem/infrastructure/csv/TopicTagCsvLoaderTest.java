package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.model.TopicTag;
import org.schoolsystem.domain.value.TopicId;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

class TopicTagCsvLoaderTest {

    @Test
    void loadAll_shouldResolveTagsByIdAndCreateTopicTagObjects() {
        // 1) Tags laden
        TagCsvLoader tagLoader = new TagCsvLoader();
        List<Tag> tags = tagLoader.loadAll();
        assertFalse(tags.isEmpty(), "Expected at least one Tag from CSV");

        Map<Integer, Tag> tagsById = tags.stream()
                .collect(Collectors.toMap(Tag::id, t -> t));

        // 2) TopicTags laden
        TopicTagCsvLoader loader = new TopicTagCsvLoader();
        List<TopicTag> topicTags = loader.loadAll(tagsById);

        assertFalse(topicTags.isEmpty(), "Expected at least one TopicTag from CSV");

        // 3) Konkretes Beispiel aus der CSV prüfen: ART0,1,5
        TopicId art0 = TopicId.of("ART0");
        Optional<TopicTag> maybeArt0TagArt = topicTags.stream()
                .filter(tt -> tt.topicId().equals(art0) && tt.tagId() == 1)
                .findFirst();

        assertTrue(maybeArt0TagArt.isPresent(), "Expected mapping ART0 -> tagID 1 to exist");

        TopicTag art0TagArt = maybeArt0TagArt.get();
        assertEquals(5, art0TagArt.weight().value(), "Expected weight 5 for ART0 / tagID 1");
    }

    @Test
    void loadAll_shouldFailIfReferencedTagIsMissing() {
        // künstlich leere Map, um Fehlerverhalten zu testen
        TopicTagCsvLoader loader = new TopicTagCsvLoader();

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> loader.loadAll(Map.of()),
                "Expected loader to fail if tagsById does not contain referenced IDs"
        );

        assertTrue(
                ex.getMessage().contains("No Tag found for tagID="),
                "Error message should mention missing tagID"
        );
    }
}
