package org.schoolsystem.application.interest;

import org.schoolsystem.application.topic.TopicQueryService;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.List;
import java.util.Objects;

/**
 * Use Case: UC-06 Interessenssuche
 * Entspricht POST /api/v1/topics/interest-search.
 *
 * Diese Schicht:
 *  - ruft die KI-/Matching-Komponente für Tags auf (oder Stub)
 *  - berechnet Scores pro Topic anhand TopicTag + InterestTag-Gewichten
 */
public interface InterestSearchService {

    InterestSearchResult search(InterestSearchQuery query);

    // ---------------------------------------------------------------------
    // Query / Result
    // ---------------------------------------------------------------------

    /**
     * Eingabe der Interessenssuche (Fachlogik, nicht 1:1 der REST-DTO).
     */
    record InterestSearchQuery(
            String interestsText,
            LanguageCode language,
            Integer maxResults,
            Boolean explainMatches
    ) {
        public InterestSearchQuery {
            Objects.requireNonNull(interestsText, "interestsText must not be null");
        }
    }

    /**
     * Ergebnis der Interessenssuche.
     */
    record InterestSearchResult(
            String interestsText,
            LanguageCode usedLanguage,
            List<InterestMatchedTagView> matchedTags,
            List<InterestTopicScoreView> topics
    ) {
        public InterestSearchResult {
            Objects.requireNonNull(interestsText, "interestsText must not be null");
            Objects.requireNonNull(usedLanguage, "usedLanguage must not be null");
            Objects.requireNonNull(matchedTags, "matchedTags must not be null");
            Objects.requireNonNull(topics, "topics must not be null");
        }
    }

    /**
     * Tag, der von der Interessenbeschreibung als relevant identifiziert wurde.
     */
    record InterestMatchedTagView(
            Tag tag,
            int interestWeight
    ) {
        public InterestMatchedTagView {
            Objects.requireNonNull(tag, "tag must not be null");
            if (interestWeight < 1 || interestWeight > 5) {
                throw new IllegalArgumentException("interestWeight must be between 1 and 5, but was: " + interestWeight);
            }
        }
    }

    /**
     * Topic mit Score für die Interessen-Suche.
     */
    record InterestTopicScoreView(
            TopicQueryService.TopicWithTags topicWithTags,
            int score,
            List<InterestTopicMatchedTagView> matchedTags
    ) {
        public InterestTopicScoreView {
            Objects.requireNonNull(topicWithTags, "topicWithTags must not be null");
            Objects.requireNonNull(matchedTags, "matchedTags must not be null");
            if (score < 0) {
                throw new IllegalArgumentException("score must be >= 0, but was: " + score);
            }
        }
    }

    /**
     * Beitrag eines einzelnen Tags zum Topic-Score.
     */
    record InterestTopicMatchedTagView(
            Tag tag,
            int interestWeight,
            int topicWeight,
            int contribution
    ) {
        public InterestTopicMatchedTagView {
            Objects.requireNonNull(tag, "tag must not be null");
        }
    }
}
