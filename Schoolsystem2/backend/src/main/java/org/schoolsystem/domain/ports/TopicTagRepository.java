package org.schoolsystem.domain.ports;

import org.schoolsystem.domain.model.TopicTag;
import org.schoolsystem.domain.value.TopicId;

import java.util.List;

/**
 * Repository-Port für die Verknüpfungen zwischen Topics und Tags.
 *
 * Entspricht fachlich der Tabelle ct_topic_tags.
 * Wichtig u.a. für:
 *  - Interessenssuche (Score-Berechnung pro Topic)
 *  - Anzeige von Tags auf einer Topic-Detailseite
 */
public interface TopicTagRepository {

    /**
     * Liefert alle TopicTag-Verknüpfungen eines bestimmten Topics.
     */
    List<TopicTag> findByTopicId(TopicId topicId);

    /**
     * Liefert alle TopicTag-Verknüpfungen zu einem bestimmten Tag.
     */
    List<TopicTag> findByTagId(int tagId);

    /**
     * Liefert alle TopicTag-Verknüpfungen.
     */
    List<TopicTag> findAll();
}
