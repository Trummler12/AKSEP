package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.UsesSource;

import java.util.List;

/**
 * Repository-Port für die Verknüpfung Resource <-> Source (ct_uses_source).
 */
public interface UsesSourceRepository {

    /**
     * Liefert alle Verknüpfungen für eine bestimmte Ressource.
     */
    List<UsesSource> findByResourceId(int resourceId);

    /**
     * Liefert alle Verknüpfungen für eine bestimmte Quelle.
     */
    List<UsesSource> findBySourceId(int sourceId);

    /**
     * Liefert alle Verknüpfungen.
     */
    List<UsesSource> findAll();
}
