package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.Resource;

import java.util.List;
import java.util.Optional;

/**
 * Repository-Port für Ressourcen (t_resource + RVersion + RLangVersion).
 *
 * Dient z.B. dazu:
 *  - Ressourcendetails für eine Topic-Detailseite zu laden
 *  - einzelne Ressourcen über ihre ID zu finden
 */
public interface ResourceRepository {

    /**
     * Sucht eine Ressource anhand ihrer ID.
     */
    Optional<Resource> findById(int id);

    /**
     * Liefert alle Ressourcen.
     * Kann für Debugging oder Batch-Operationen nützlich sein.
     */
    List<Resource> findAll();
}
