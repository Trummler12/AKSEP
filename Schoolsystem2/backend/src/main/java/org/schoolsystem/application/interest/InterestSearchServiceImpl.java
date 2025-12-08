package org.schoolsystem.application.interest;

import org.schoolsystem.application.topic.TopicQueryService;
import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.model.TopicTag;
import org.schoolsystem.domain.ports.TagRepository;
import org.schoolsystem.domain.ports.TopicRepository;
import org.schoolsystem.domain.ports.TopicTagRepository;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.TopicId;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Default-Implementierung von {@link InterestSearchService}.
 *
 * Verantwortlichkeiten:
 *  - Ruft TagMatchingClient auf, um Interest-Tags mit Gewicht zu erhalten.
 *  - Ermittelt pro Topic die zugehörigen TopicTags.
 *  - Berechnet pro Topic einen Score durch Kombination von InterestWeight und TopicTag-Weight.
 *  - Sortiert Topics nach Score absteigend.
 */
public final class InterestSearchServiceImpl implements InterestSearchService {

    private static final int DEFAULT_MAX_RESULTS = 200;   // harte Obergrenze für Topics
    private static final int DEFAULT_MAX_INTEREST_TAGS = 15;

    private final TagRepository tagRepository;
    private final TopicRepository topicRepository;
    private final TopicTagRepository topicTagRepository;
    private final TagMatchingClient tagMatchingClient;

    public InterestSearchServiceImpl(
            TagRepository tagRepository,
            TopicRepository topicRepository,
            TopicTagRepository topicTagRepository,
            TagMatchingClient tagMatchingClient
    ) {
        this.tagRepository = Objects.requireNonNull(tagRepository, "tagRepository must not be null");
        this.topicRepository = Objects.requireNonNull(topicRepository, "topicRepository must not be null");
        this.topicTagRepository = Objects.requireNonNull(topicTagRepository, "topicTagRepository must not be null");
        this.tagMatchingClient = Objects.requireNonNull(tagMatchingClient, "tagMatchingClient must not be null");
    }

    @Override
    public InterestSearchResult search(InterestSearchQuery query) {
        Objects.requireNonNull(query, "query must not be null");

        String interestsText = query.interestsText();
        if (interestsText == null || interestsText.isBlank()) {
            throw new IllegalArgumentException("interestsText must not be blank");
        }

        LanguageCode language = resolveLanguage(query.language());
        int maxResults = resolveMaxResults(query.maxResults());
        boolean explainMatches = query.explainMatches() == null || query.explainMatches();

        // 1) Alle Tags laden
        List<Tag> allTags = tagRepository.findAll();

        // 2) KI-Client: Interest-Tags bestimmen (tagId -> interestWeight 1..5)
        Map<Integer, Integer> interestWeightsByTagId =
                tagMatchingClient.findBestMatchingTagWeights(
                        interestsText,
                        language,
                        allTags,
                        DEFAULT_MAX_INTEREST_TAGS
                );

        // In eine sortierte Liste von InterestMatchedTagView konvertieren
        Map<Integer, Tag> tagsById = allTags.stream()
                .collect(Collectors.toMap(Tag::id, t -> t));

        List<InterestMatchedTagView> interestMatchedTags = interestWeightsByTagId.entrySet().stream()
                .map(e -> {
                    Tag tag = tagsById.get(e.getKey());
                    if (tag == null) {
                        return null;
                    }
                    return new InterestMatchedTagView(tag, e.getValue());
                })
                .filter(Objects::nonNull)
                // Absteigend nach InterestWeight sortieren
                .sorted(Comparator.comparingInt(InterestMatchedTagView::interestWeight).reversed())
                .toList();

        // 3) Alle Topics + TopicTags laden
        List<Topic> allTopics = topicRepository.findAll();

        // TopicTags nach Topic gruppieren
        Map<TopicId, List<TopicTag>> topicTagsByTopicId = topicTagRepository.findAll().stream()
                .collect(Collectors.groupingBy(TopicTag::topicId));

        // Vorbereiten: Tag-Map für schnelleren Zugriff
        Map<Integer, Tag> tagLookup = tagsById;

        // 4) Für jedes Topic Score berechnen
        List<InterestTopicScoreView> topicScoreViews = new ArrayList<>();
        for (Topic topic : allTopics) {
            TopicId topicId = topic.id();
            List<TopicTag> topicTags = topicTagsByTopicId.getOrDefault(topicId, List.of());

            // Map<TagId, TopicTag> für schnelle Suche pro TagId
            Map<Integer, TopicTag> topicTagByTagId = topicTags.stream()
                    .collect(Collectors.toMap(TopicTag::tagId, tt -> tt));

            int totalScore = 0;
            List<InterestTopicMatchedTagView> contributions = new ArrayList<>();

            for (InterestMatchedTagView interestTag : interestMatchedTags) {
                int tagId = interestTag.tag().id();
                TopicTag topicTag = topicTagByTagId.get(tagId);
                if (topicTag == null) {
                    continue; // Tag gehört nicht zu diesem Topic
                }

                int interestWeight = interestTag.interestWeight();
                int topicWeight = topicTag.weight().asInt();
                int contribution = interestWeight * topicWeight;

                totalScore += contribution;

                if (explainMatches) {
                    Tag tag = tagLookup.get(tagId);
                    if (tag != null) {
                        contributions.add(new InterestTopicMatchedTagView(
                                tag,
                                interestWeight,
                                topicWeight,
                                contribution
                        ));
                    }
                }
            }

            // TopicWithTags-View bauen
            List<Tag> tagsForTopic = topicTags.stream()
                    .map(tt -> tagLookup.get(tt.tagId()))
                    .filter(Objects::nonNull)
                    .toList();

            TopicQueryService.TopicWithTags topicWithTags =
                    new TopicQueryService.TopicWithTags(topic, tagsForTopic);

            List<InterestTopicMatchedTagView> contributionsForView =
                    explainMatches ? List.copyOf(contributions) : List.of();

            InterestTopicScoreView topicScoreView =
                    new InterestTopicScoreView(topicWithTags, totalScore, contributionsForView);

            topicScoreViews.add(topicScoreView);
        }

        // 5) Nach Score absteigend sortieren
        topicScoreViews.sort(Comparator.comparingInt(InterestTopicScoreView::score).reversed());

        // 6) MaxResults begrenzen
        if (topicScoreViews.size() > maxResults) {
            topicScoreViews = topicScoreViews.subList(0, maxResults);
        }

        return new InterestSearchResult(
                interestsText,
                language,
                interestMatchedTags,
                List.copyOf(topicScoreViews)
        );
    }

    // -------------------------------------------------------------------------
    // Hilfsmethoden
    // -------------------------------------------------------------------------

    private static LanguageCode resolveLanguage(LanguageCode input) {
        if (input == null) {
            // v1 API: primär Englisch
            return new LanguageCode("en");
        }
        return input;
    }

    private static int resolveMaxResults(Integer maxResults) {
        if (maxResults == null || maxResults <= 0) {
            return DEFAULT_MAX_RESULTS;
        }
        return Math.min(maxResults, DEFAULT_MAX_RESULTS);
    }
}
