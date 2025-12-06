package org.schoolsystem.domain.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Version einer Ressource.
 *
 * Entspricht t_version:
 *  - versionID       -> id
 *  - version_number  -> versionNumber
 *  - changelog       -> changelog (optional)
 *  - version         -> version (technische Version, >= 1)
 *
 * Zusätzlich:
 *  - languageVersions: Liste der Sprachversionen (RLangVersion).
 */
public final class RVersion {

    private final int id;
    private final String versionNumber;
    private final String changelog; // optional, getrimmt
    private final int version;
    private final List<RLangVersion> languageVersions;

    private RVersion(
            int id,
            String versionNumber,
            String changelog,
            int version,
            List<RLangVersion> languageVersions
    ) {
        if (id <= 0) {
            throw new IllegalArgumentException("RVersion id must be > 0, but was: " + id);
            }
        Objects.requireNonNull(versionNumber, "versionNumber must not be null");
        String trimmedVersionNumber = versionNumber.trim();
        if (trimmedVersionNumber.isEmpty()) {
            throw new IllegalArgumentException("versionNumber must not be empty");
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        Objects.requireNonNull(languageVersions, "languageVersions must not be null");
        List<RLangVersion> copy = new ArrayList<>(languageVersions.size());
        for (RLangVersion lv : languageVersions) {
            copy.add(Objects.requireNonNull(lv, "languageVersions must not contain null elements"));
        }

        this.id = id;
        this.versionNumber = trimmedVersionNumber;
        this.changelog = changelog == null ? null : changelog.trim();
        this.version = version;
        this.languageVersions = List.copyOf(copy);
    }

    /**
     * Vollständige Fabrikmethode.
     */
    public static RVersion of(
            int id,
            String versionNumber,
            String changelog,
            int version,
            List<RLangVersion> languageVersions
    ) {
        return new RVersion(id, versionNumber, changelog, version, languageVersions);
    }

    /**
     * Variante ohne Sprachversionen (z. B. direkt nach dem CSV-Import).
     */
    public static RVersion withoutLanguages(
            int id,
            String versionNumber,
            int version
    ) {
        return new RVersion(id, versionNumber, null, version, List.of());
    }

    public int id() {
        return id;
    }

    public String versionNumber() {
        return versionNumber;
    }

    public Optional<String> changelog() {
        return Optional.ofNullable(changelog)
                .filter(s -> !s.isEmpty());
    }

    /**
     * Technische Version (nicht die "fachliche" versionNumber).
     */
    public int version() {
        return version;
    }

    /**
     * Unveränderliche Liste aller Sprachversionen.
     */
    public List<RLangVersion> languageVersions() {
        return languageVersions;
    }

    @Override
    public String toString() {
        return "RVersion{" +
               "id=" + id +
               ", versionNumber='" + versionNumber + '\'' +
               ", version=" + version +
               ", languageVersions=" + languageVersions.size() +
               '}';
    }
}
