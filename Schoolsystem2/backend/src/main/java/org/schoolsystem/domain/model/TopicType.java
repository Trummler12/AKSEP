package org.schoolsystem.domain.model;

import org.schoolsystem.domain.value.LanguageCode;

import java.util.Objects;
import java.util.Optional;

/**
 * Lookup-Typ für Topics (z. B. General Subject, Specialization, Technical Subject).
 *
 * Entspricht t_topic_type:
 *  - typeID       (TINYINT, PK)
 *  - type_name    (lokalisierbar)
 *  - definition   (lokalisierbar, optional)
 *  - version      (int >= 1)
 */
public final class TopicType {

    private final int id;
    private final LocalizedText name;
    private final LocalizedText definition; // darf null sein
    private final int version;

    private TopicType(int id, LocalizedText name, LocalizedText definition, int version) {
        if (id < 0 || id > 127) {
            throw new IllegalArgumentException("TopicType id must be between 0 and 127, but was: " + id);
        }
        Objects.requireNonNull(name, "name must not be null");
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        this.id = id;
        this.name = name;
        this.definition = definition;
        this.version = version;
    }

    public static TopicType of(int id, LocalizedText name, LocalizedText definition, int version) {
        return new TopicType(id, name, definition, version);
    }

    public static TopicType of(int id, LocalizedText name, int version) {
        return new TopicType(id, name, null, version);
    }

    public int id() {
        return id;
    }

    public LocalizedText name() {
        return name;
    }

    public Optional<LocalizedText> definition() {
        return Optional.ofNullable(definition);
    }

    public int version() {
        return version;
    }

    /**
     * Bequeme Methode, um den Namen in einer bestimmten Sprache zu holen.
     */
    public Optional<String> displayName(LanguageCode language) {
        return name.get(language);
    }
}
