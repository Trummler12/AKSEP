package org.schoolsystem.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Repräsentiert ein Schlagwort (Tag).
 *
 * Entspricht grob t_tag:
 *  - tagID   (INT, PK)
 *  - tag     (Name/Semantik, bei uns über labels abgebildet)
 *  - version (int >= 1)
 *
 * Die Liste labels enthält mindestens einen Eintrag:
 *  - labels.get(0) = Hauptbezeichnung (Primary Label, englisch)
 *  - labels.get(1..n) = optionale Synonyme (ebenfalls englisch)
 *
 * Gewichtungen zu Topics oder Nutzer-Profilen werden separat modelliert
 * (z. B. über Zuordnungs-Entities mit TagWeight).
 */
public final class Tag {

    private final int id;
    private final List<String> labels;
    private final int version;

    private Tag(int id, List<String> labels, int version) {
        if (id <= 0) {
            throw new IllegalArgumentException("Tag id must be > 0, but was: " + id);
        }
        Objects.requireNonNull(labels, "labels must not be null");
        if (labels.isEmpty()) {
            throw new IllegalArgumentException("Tag must have at least one label");
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }
        // defensiv: unveränderliche Kopie
        this.labels = List.copyOf(labels);
        this.id = id;
        this.version = version;
    }

    /**
     * Fabrikmethode, die Roh-Labels bereinigt:
     * - null-Referenz auf der Liste verboten
     * - null-Elemente verboten
     * - Whitespace wird getrimmt
     * - leere Strings werden entfernt
     * - es muss mindestens ein gültiges Label übrig bleiben
     */
    public static Tag of(int id, List<String> rawLabels, int version) {
        Objects.requireNonNull(rawLabels, "rawLabels must not be null");

        List<String> cleaned = new ArrayList<>();
        for (String label : rawLabels) {
            Objects.requireNonNull(label, "label must not be null");
            String trimmed = label.trim();
            if (!trimmed.isEmpty()) {
                cleaned.add(trimmed);
            }
        }

        if (cleaned.isEmpty()) {
            throw new IllegalArgumentException("Tag must have at least one non-blank label");
        }

        return new Tag(id, cleaned, version);
    }

    public int id() {
        return id;
    }

    /**
     * Hauptbezeichnung des Tags.
     * Definiert als erstes Element der Labels-Liste.
     */
    public String primaryLabel() {
        return labels.get(0);
    }

    /**
     * Gibt alle Labels inkl. Primary Label zurück.
     * Liste ist unveränderlich.
     */
    public List<String> labels() {
        return labels;
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "Tag{id=" + id + ", labels=" + labels + ", version=" + version + "}";
    }
}
