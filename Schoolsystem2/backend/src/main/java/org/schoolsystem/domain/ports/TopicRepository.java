package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.value.TopicId;

import java.util.List;
import java.util.Optional;

/**
 * Repository-Port für Topics.
 *
 * Wird z.B. von Use Cases genutzt, um:
 *  - Alle Topics für /topics zu laden
 *  - Ein einzelnes Topic für /topics/{id} zu laden
 */
public interface TopicRepository {

    /**
     * Liefert alle Topics.
     * Die konkrete Sortierung hängt von der Implementierung ab.
     */
    List<Topic> findAll();

    /**
     * Sucht ein Topic anhand seiner TopicId.
     */
    Optional<Topic> findById(TopicId id);
}
