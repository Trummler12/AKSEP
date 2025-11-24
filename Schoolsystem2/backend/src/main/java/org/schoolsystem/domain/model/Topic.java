package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.TopicId;
import org.schoolsystem.domain.value.WebUrl;

import java.util.*;

/**
 * Repräsentiert ein Topic (Fach/Kurs/Achievement).
 *
 * Entspricht t_topic plus zugehörige Levels und URLs:
 *  - topicID      (TopicId)
 *  - name         (LocalizedText)
 *  - typeID       (TopicType)
 *  - layer        (int >= 0)
 *  - description  (LocalizedText, optional)
 *  - version      (int >= 1)
 *  - levels       (Liste von TopicLevel)
 *  - urls         (Liste von WebUrl)
 */
public final class Topic {

    private final TopicId id;
    private final LocalizedText name;
    private final TopicType type;
    private final int layer;
    private final LocalizedText description; // optional
    private final int version;
    private final List<TopicLevel> levels;
    private final List<WebUrl> urls;

    private Topic(
            TopicId id,
            LocalizedText name,
            TopicType type,
            int layer,
            LocalizedText description,
            int version,
            List<TopicLevel> levels,
            List<WebUrl> urls
    ) {
        this.id = Objects.requireNonNull(id, "id must not be null");
        this.name = Objects.requireNonNull(name, "name must not be null");
        this.type = Objects.requireNonNull(type, "type must not be null");
        if (layer < 0) {
            throw new IllegalArgumentException("layer must be >= 0, but was: " + layer);
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        this.layer = layer;
        this.description = description; // darf null sein
        this.version = version;

        // Defensivkopien mit Unmodifiable-Lists
        this.levels = levels == null
                ? List.of()
                : List.copyOf(levels);
        this.urls = urls == null
                ? List.of()
                : List.copyOf(urls);
    }

    public static Topic of(
            TopicId id,
            LocalizedText name,
            TopicType type,
            int layer,
            LocalizedText description,
            int version,
            List<TopicLevel> levels,
            List<WebUrl> urls
    ) {
        return new Topic(id, name, type, layer, description, version, levels, urls);
    }

    public static Topic createBasic(
            TopicId id,
            LocalizedText name,
            TopicType type,
            int layer,
            int version
    ) {
        return new Topic(id, name, type, layer, null, version, List.of(), List.of());
    }

    public TopicId id() {
        return id;
    }

    public LocalizedText name() {
        return name;
    }

    public TopicType type() {
        return type;
    }

    public int layer() {
        return layer;
    }

    public Optional<LocalizedText> description() {
        return Optional.ofNullable(description);
    }

    public int version() {
        return version;
    }

    public List<TopicLevel> levels() {
        return levels;
    }

    public List<WebUrl> urls() {
        return urls;
    }

    /**
     * Fügt ein Level hinzu und gibt eine neue Topic-Instanz zurück.
     */
    public Topic addLevel(TopicLevel level) {
        Objects.requireNonNull(level, "level must not be null");
        List<TopicLevel> newLevels = new ArrayList<>(this.levels);
        newLevels.add(level);
        return new Topic(id, name, type, layer, description, version, newLevels, urls);
    }

    /**
     * Fügt eine URL hinzu und gibt eine neue Topic-Instanz zurück.
     */
    public Topic addUrl(WebUrl url) {
        Objects.requireNonNull(url, "url must not be null");
        List<WebUrl> newUrls = new ArrayList<>(this.urls);
        newUrls.add(url);
        return new Topic(id, name, type, layer, description, version, levels, newUrls);
    }
}
