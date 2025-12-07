package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.Source;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

/**
 * Repository-Port für Quellen (t_source).
 */
public interface SourceRepository {

    /**
     * Sucht eine Quelle anhand ihrer ID.
     */
    Optional<Source> findById(int id);

    /**
     * Sucht mehrere Quellen anhand ihrer IDs.
     */
    List<Source> findByIds(Collection<Integer> ids);

    /**
     * Liefert alle Quellen.
     */
    List<Source> findAll();
}
