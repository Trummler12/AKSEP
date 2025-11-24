package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LevelNumber;
import org.schoolsystem.domain.value.TopicId;

import java.util.Objects;
import java.util.Optional;

/**
 * Repräsentiert einen Level eines Topics.
 *
 * Entspricht t_topic_levels:
 *  - topicID        (VARCHAR, FK auf Topic)
 *  - level_number   (TINYINT, bei uns LevelNumber 1..9)
 *  - description    (lokalisierbar, optional)
 *  - version        (int >= 1)
 */
public final class TopicLevel {

    private final TopicId topicId;
    private final LevelNumber level;
    private final LocalizedText description; // optional (kann null sein)
    private final int version;

    private TopicLevel(TopicId topicId, LevelNumber level, LocalizedText description, int version) {
        this.topicId = Objects.requireNonNull(topicId, "topicId must not be null");
        this.level = Objects.requireNonNull(level, "level must not be null");
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        this.description = description; // darf null sein
        this.version = version;
    }

    public static TopicLevel of(TopicId topicId, LevelNumber level, LocalizedText description, int version) {
        return new TopicLevel(topicId, level, description, version);
    }

    public static TopicLevel of(TopicId topicId, LevelNumber level, int version) {
        return new TopicLevel(topicId, level, null, version);
    }

    public TopicId topicId() {
        return topicId;
    }

    public LevelNumber level() {
        return level;
    }

    public Optional<LocalizedText> description() {
        return Optional.ofNullable(description);
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "TopicLevel{topicId=" + topicId + ", level=" + level + ", version=" + version + "}";
    }
}
