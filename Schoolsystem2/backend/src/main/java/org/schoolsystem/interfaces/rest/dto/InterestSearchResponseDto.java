package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Response-Body der interessensbasierten Topic-Suche.
 */
public record InterestSearchResponseDto(
        String interestsText,
        String usedLanguage,
        List<InterestMatchedTagDto> matchedTags,
        List<InterestTopicScoreDto> topics
) {

    /**
     * Tag, der zur Interessenbeschreibung passt.
     */
    public record InterestMatchedTagDto(
            int tagId,
            String label,
            int interestWeight
    ) {
    }

    /**
     * Ein Topic mit Score im Kontext der Interessen.
     */
    public record InterestTopicScoreDto(
            TopicSummaryDto topic,
            int score,
            List<InterestTopicMatchedTagDto> matchedTags
    ) {
    }

    /**
     * Beitrag eines einzelnen Tags zum Topic-Score.
     */
    public record InterestTopicMatchedTagDto(
            int tagId,
            String label,
            int interestWeight,
            int topicWeight,
            int contribution
    ) {
    }
}
