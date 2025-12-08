package org.schoolsystem.application.topic;

import org.schoolsystem.domain.model.Resource;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.TopicId;

import java.util.List;
import java.util.Objects;

/**
 * Use-Case-orientierter Service für Topic-Abfragen:
 * - /api/v1/topics
 * - /api/v1/topics/{topicId}
 *
 * Liefert Domain-Objekte + View-Typen für Scoring & "similar topics".
 * Mapping zu REST-DTOs passiert in der interfaces.rest-Schicht.
 */
public interface TopicQueryService {

    /**
     * Use Case: UC-04 / GET /api/v1/topics
     * Filter- und Sortierlogik ist in diesem Service gebündelt.
     */
    TopicListResult listTopics(TopicListQuery query);

    /**
     * Use Case: UC-05, UC-10 / GET /api/v1/topics/{topicId}
     * Enthält auch die ID-Resolution (EXACT/AMBIGUOUS).
     */
    TopicDetailsResolutionResult getTopicDetails(TopicDetailsQuery query);

    // ---------------------------------------------------------------------
    // Query-/Result-Typen
    // ---------------------------------------------------------------------

    /**
     * Eingabeparameter für die Topic-Liste.
     * Entspricht den Query-Parametern von GET /api/v1/topics.
     */
    record TopicListQuery(
            Integer maxLayer,
            Boolean showCourses,
            Boolean showAchievements,
            String sortBy,
            String sortDirection,
            LanguageCode language
    ) {
        public TopicListQuery {
            // defensive defaulting optional; Validierung kann auch in der Implementierung erfolgen
        }
    }

    /**
     * Ergebnis der Topic-Liste.
     * Die Liste ist bereits nach den gewünschten Kriterien sortiert.
     */
    record TopicListResult(
            List<TopicWithTags> items,
            int total
    ) {
        public TopicListResult {
            Objects.requireNonNull(items, "items must not be null");
            if (total < 0) {
                throw new IllegalArgumentException("total must be >= 0, but was: " + total);
            }
        }
    }

    /**
     * Topic inkl. aller zugehörigen Tags (für TopicSummaryDto).
     */
    record TopicWithTags(
            Topic topic,
            List<Tag> tags
    ) {
        public TopicWithTags {
            Objects.requireNonNull(topic, "topic must not be null");
            Objects.requireNonNull(tags, "tags must not be null");
        }
    }

    /**
     * Eingabe für die Detail-Abfrage.
     * rawTopicId ist die ID, wie sie im Pfad steht (case-insensitive Resolution).
     */
    record TopicDetailsQuery(
            String rawTopicId,
            LanguageCode language
    ) {
        public TopicDetailsQuery {
            Objects.requireNonNull(rawTopicId, "rawTopicId must not be null");
        }
    }

    /**
     * Ergebnis der Detail-Abfrage inkl. ID-Resolution.
     * - EXACT: topicDetails ist gefüllt, candidates optional leer.
     * - AMBIGUOUS: topicDetails ist null, candidates enthält alle Kandidaten mit dieser "rohen" ID.
     */
    record TopicDetailsResolutionResult(
            ResolutionStatus resolutionStatus,
            TopicDetailsView topicDetails,
            List<Topic> candidates
    ) {

        public TopicDetailsResolutionResult {
            Objects.requireNonNull(resolutionStatus, "resolutionStatus must not be null");
            Objects.requireNonNull(candidates, "candidates must not be null");

            if (resolutionStatus == ResolutionStatus.EXACT && topicDetails == null) {
                throw new IllegalArgumentException("topicDetails must not be null when resolutionStatus is EXACT");
            }
            if (resolutionStatus == ResolutionStatus.AMBIGUOUS && !candidates.isEmpty() && topicDetails != null) {
                throw new IllegalArgumentException("topicDetails must be null when resolutionStatus is AMBIGUOUS");
            }
        }

        public enum ResolutionStatus {
            EXACT,
            AMBIGUOUS
        }
    }

    /**
     * Vollständige Detail-View eines Topics:
     * - Topic-Domainobjekt
     * - Tags
     * - Ressourcen mit Score + Tag-Beiträgen
     * - ähnliche Topics
     */
    record TopicDetailsView(
            Topic topic,
            List<Tag> tags,
            List<TopicResourceScoreView> resources,
            List<SimilarTopicView> similarTopics
    ) {
        public TopicDetailsView {
            Objects.requireNonNull(topic, "topic must not be null");
            Objects.requireNonNull(tags, "tags must not be null");
            Objects.requireNonNull(resources, "resources must not be null");
            Objects.requireNonNull(similarTopics, "similarTopics must not be null");
        }
    }

    /**
     * Ressource + Score im Kontext eines Topics.
     */
    record TopicResourceScoreView(
            Resource resource,
            String url,
            int score,
            List<ResourceScoreContributionView> contributions
    ) {
        public TopicResourceScoreView {
            Objects.requireNonNull(resource, "resource must not be null");
            Objects.requireNonNull(url, "url must not be null");
            Objects.requireNonNull(contributions, "contributions must not be null");
            if (score < 0) {
                throw new IllegalArgumentException("score must be >= 0, but was: " + score);
            }
        }
    }

    /**
     * Beitrag eines einzelnen Tags zum Resource-Score.
     */
    record ResourceScoreContributionView(
            int tagId,
            String label,
            int topicWeight,
            int resourceWeight,
            int contribution
    ) {
        public ResourceScoreContributionView {
            Objects.requireNonNull(label, "label must not be null");
        }
    }

    /**
     * Ein ähnliches Topic (z.B. gleicher ID-Stamm, anderer Layer).
     */
    record SimilarTopicView(
            TopicId id,
            Topic topic // für Name/Type/Layer
    ) {
        public SimilarTopicView {
            Objects.requireNonNull(id, "id must not be null");
            Objects.requireNonNull(topic, "topic must not be null");
        }
    }
}
