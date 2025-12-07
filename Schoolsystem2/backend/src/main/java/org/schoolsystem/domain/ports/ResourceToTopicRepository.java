package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.ResourceToTopic;
import org.schoolsystem.domain.value.TopicId;

import java.util.List;

/**
 * Repository-Port für die Verknüpfung zwischen Ressourcen und Topics.
 *
 * Fachlich: Abbildung von "Ressource gehört zu Topic X".
 * (In dieser Iteration ohne Level/Sublevel.)
 */
public interface ResourceToTopicRepository {

    /**
     * Liefert alle Zuordnungen für ein bestimmtes Topic.
     * Kann im Use Case verwendet werden, um alle Ressourcen zu einem Topic zu finden.
     */
    List<ResourceToTopic> findByTopicId(TopicId topicId);

    /**
     * Liefert alle Zuordnungen für eine bestimmte Ressource.
     */
    List<ResourceToTopic> findByResourceId(int resourceId);

    /**
     * Liefert alle Zuordnungen.
     */
    List<ResourceToTopic> findAll();
}
