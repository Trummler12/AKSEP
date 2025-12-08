package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.model.TopicTag;
import org.schoolsystem.domain.value.TagWeight;
import org.schoolsystem.domain.value.TopicId;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Lädt TopicTag-Verknüpfungen (Topic ↔ Tag mit Gewicht) aus csv/ct_topic_tags.csv.
 *
 * Entspricht ct_topic_tags:
 *  - topicID
 *  - tagID
 *  - weight
 *  - version (wird ignoriert; intern immer 1)
 */
public final class TopicTagCsvLoader {

    private final CsvFileReader reader;
    private final String resourcePath;

    public TopicTagCsvLoader() {
        this(new CsvFileReader(), "csv/ct_topic_tags.csv");
    }

    TopicTagCsvLoader(CsvFileReader reader, String resourcePath) {
        this.reader = reader;
        this.resourcePath = resourcePath;
    }

    /**
     * Lädt alle TopicTag-Einträge.
     *
     * @param tagsById Map von tagID → Tag (z.B. aus TagCsvLoader aufgebaut)
     */
    public List<TopicTag> loadAll(Map<Integer, Tag> tagsById) {
        if (tagsById == null) {
            throw new IllegalArgumentException("tagsById must not be null");
        }

        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<TopicTag> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            String topicIdRaw = row.get("topicID");
            String tagIdRaw = row.get("tagID");
            String weightRaw = row.get("weight");

            if (topicIdRaw == null || tagIdRaw == null || weightRaw == null) {
                // unvollständige Zeile – überspringen
                continue;
            }

            TopicId topicId = TopicId.of(topicIdRaw.trim());
            int tagId = Integer.parseInt(tagIdRaw.trim());
            Tag tag = tagsById.get(tagId);

            if (tag == null) {
                throw new IllegalArgumentException(
                        "No Tag found for tagID=" + tagId + " (referenced from topicID=" + topicId.value() + ")"
                );
            }

            int weightValue = Integer.parseInt(weightRaw.trim());
            TagWeight weight = TagWeight.of(weightValue);

            int version = 1;

            TopicTag topicTag = TopicTag.of(topicId, tag.id(), weight, version);
            result.add(topicTag);
        }

        return Collections.unmodifiableList(result);
    }
}
