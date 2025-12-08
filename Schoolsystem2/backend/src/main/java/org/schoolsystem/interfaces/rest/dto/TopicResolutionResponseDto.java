package org.schoolsystem.interfaces.rest.dto;

import java.util.List;

/**
 * Response für GET /api/v1/topics/{topicId}, inkl. ID-Resolution.
 */
public record TopicResolutionResponseDto(
        TopicResolutionStatus resolutionStatus,
        TopicDetailDto topic,
        List<TopicResolutionCandidateDto> candidates
) {

    /**
     * Status der Topic-ID-Auflösung.
     */
    public enum TopicResolutionStatus {
        EXACT,
        AMBIGUOUS
    }

    /**
     * Kandidat bei uneindeutiger Topic-ID.
     */
    public record TopicResolutionCandidateDto(
            String id,
            String name,
            String type,
            int layer
    ) {
    }
}
