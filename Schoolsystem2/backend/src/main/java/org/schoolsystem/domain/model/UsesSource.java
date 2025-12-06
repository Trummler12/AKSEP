package org.schoolsystem.domain.model;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Verknüpfung zwischen Ressource und Quelle.
 *
 * Entspricht ct_uses_source:
 *  - resourceID  -> resourceId (int > 0)
 *  - sourceID    -> sourceId   (int > 0)
 *  - usage_date  -> usageDate  (optional)
 *  - version     -> version    (int >= 1)
 */
public final class UsesSource {

    private final int resourceId;
    private final int sourceId;
    private final LocalDateTime usageDate; // optional
    private final int version;

    private UsesSource(int resourceId, int sourceId, LocalDateTime usageDate, int version) {
        if (resourceId <= 0) {
            throw new IllegalArgumentException("resourceId must be > 0, but was: " + resourceId);
        }
        if (sourceId <= 0) {
            throw new IllegalArgumentException("sourceId must be > 0, but was: " + sourceId);
        }
        if (version < 1) {
            throw new IllegalArgumentException("version must be >= 1, but was: " + version);
        }

        this.resourceId = resourceId;
        this.sourceId = sourceId;
        this.usageDate = usageDate;
        this.version = version;
    }

    public static UsesSource of(int resourceId, int sourceId, LocalDateTime usageDate, int version) {
        return new UsesSource(resourceId, sourceId, usageDate, version);
    }

    public static UsesSource withoutUsageDate(int resourceId, int sourceId, int version) {
        return new UsesSource(resourceId, sourceId, null, version);
    }

    public int resourceId() {
        return resourceId;
    }

    public int sourceId() {
        return sourceId;
    }

    public Optional<LocalDateTime> usageDate() {
        return Optional.ofNullable(usageDate);
    }

    public int version() {
        return version;
    }

    @Override
    public String toString() {
        return "UsesSource{" +
               "resourceId=" + resourceId +
               ", sourceId=" + sourceId +
               ", usageDate=" + usageDate +
               ", version=" + version +
               '}';
    }
}
