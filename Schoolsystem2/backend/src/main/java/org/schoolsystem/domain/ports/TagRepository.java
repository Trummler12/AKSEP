package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.Tag;

import java.util.List;
import java.util.Optional;

/**
 * Repository-Port für Tags.
 *
 * Wird für die Interessenssuche (UC-06) benötigt, z.B. um
 * alle Tags und ihre Synonyme zu kennen.
 */
public interface TagRepository {

    /**
     * Liefert alle Tags.
     */
    List<Tag> findAll();

    /**
     * Sucht einen Tag anhand seiner numerischen ID.
     */
    Optional<Tag> findById(int id);
}
