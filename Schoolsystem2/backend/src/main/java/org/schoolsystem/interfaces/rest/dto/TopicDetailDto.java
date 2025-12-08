package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Detailansicht eines Topics inklusive Ressourcen und ähnlicher Topics.
 */
public record TopicDetailDto(
        String id,
        String name,
        String type,
        int layer,
        String description,
        List<String> links,
        List<TopicTagDto> tags,
        List<TopicResourceScoreDto> resources,
        List<SimilarTopicDto> similarTopics
) {

    /**
     * Tag eines Topics in der Detailansicht.
     */
    public record TopicTagDto(
            int tagId,
            String label
    ) {
    }

    /**
     * Ressource inklusive Score und optionaler Tag-Match-Erklärung.
     */
    public record TopicResourceScoreDto(
            ResourceSummaryDto resource,
            int score,
            List<TopicResourceMatchedTagDto> matchedTags
    ) {
    }

    /**
     * Ein einzelner Tag-Beitrag zum Resource-Score.
     */
    public record TopicResourceMatchedTagDto(
            int tagId,
            String label,
            int topicWeight,
            int resourceWeight,
            int contribution
    ) {
    }

    /**
     * Kurzinfo zu einem ähnlichen Topic.
     */
    public record SimilarTopicDto(
            String id,
            String name,
            String type,
            int layer
    ) {
    }
}
