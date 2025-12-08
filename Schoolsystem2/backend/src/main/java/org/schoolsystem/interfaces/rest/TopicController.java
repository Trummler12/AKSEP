package org.schoolsystem.interfaces.rest;

import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.interfaces.rest.dto.InterestSearchRequestDto;
import org.schoolsystem.interfaces.rest.dto.InterestSearchResponseDto;
import org.schoolsystem.interfaces.rest.dto.TopicListResponseDto;
import org.schoolsystem.interfaces.rest.dto.TopicResolutionResponseDto;

/**
 * Logische REST-Schnittstelle für Topic-bezogene Endpunkte.
 *
 * Bildet den API-Contract für:
 *   - GET /api/v1/topics
 *   - GET /api/v1/topics/{topicId}
 *   - POST /api/v1/topics/interest-search
 *
 * Die konkrete HTTP-Technologie (Spring, Javalin, ...) wird
 * später über Adapter implementiert.
 */
public interface TopicController {

    /**
     * Entspricht GET /api/v1/topics.
     *
     * Query-Parameter (alle optional, können null sein):
     *   - maxLayer
     *   - showCourses
     *   - showAchievements
     *   - sortBy
     *   - sortDirection
     *   - language (aus "lang" Query-Param abgeleitet)
     */
    TopicListResponseDto listTopics(
            Integer maxLayer,
            Boolean showCourses,
            Boolean showAchievements,
            String sortBy,
            String sortDirection,
            LanguageCode language
    );

    /**
     * Entspricht GET /api/v1/topics/{topicId}.
     *
     * Die ID-Resolution (EXACT/AMBIGUOUS bzw. 404 im HTTP-Layer)
     * wird über TopicResolutionResponseDto und Fehler-Handling
     * im Adapter umgesetzt.
     */
    TopicResolutionResponseDto getTopicById(
            String topicId,
            LanguageCode language
    );

    /**
     * Entspricht POST /api/v1/topics/interest-search.
     *
     * Request-Body: InterestSearchRequestDto
     * Response:     InterestSearchResponseDto
     */
    InterestSearchResponseDto searchByInterests(InterestSearchRequestDto request);
}
