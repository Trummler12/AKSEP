package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.TagWeight;
import org.schoolsystem.domain.value.TopicId;

import java.util.Objects;

/**
 * Verknüpfung zwischen Topic und Tag mit Gewichtung.
 *
 * Entspricht ct_topic_tags:
 *  - topicID  -> topicId (TopicId)
 *  - tagID    -> tagId   (int > 0)
 *  - weight   -> weight  (TagWeight 1..5)
 *  - version  -> version (int >= 1, technische Version)
 */
public final class TopicTag {

    private final TopicId topicId;
    private final int tagId;
    private final TagWeight weight;
    private final int version;

    private TopicTag(TopicId topicId, int tagId, TagWeight weight, int version) {
        this.topicId = Objects.requireNonNull(topicId, "topicId must not be null");

        if (tagId <= 0) {
            throw new IllegalArgumentException("tagId must be > 0, but was: " + tagId);
        }

        this.weight = Objects.requireNonNull(weight, "weight must not be null");

        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        this.tagId = tagId;
        this.version = version;
    }

    public static TopicTag of(TopicId topicId, int tagId, TagWeight weight, int version) {
        return new TopicTag(topicId, tagId, weight, version);
    }

    public TopicId topicId() {
        return topicId;
    }

    public int tagId() {
        return tagId;
    }

    public TagWeight weight() {
        return weight;
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "TopicTag{" +
               "topicId=" + topicId +
               ", tagId=" + tagId +
               ", weight=" + weight +
               ", version=" + version +
               '}';
    }
}
