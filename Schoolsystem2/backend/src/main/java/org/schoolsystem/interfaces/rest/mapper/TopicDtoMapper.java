package org.schoolsystem.interfaces.rest.mapper;

import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.WebUrl;
import org.schoolsystem.interfaces.rest.dto.ResourceSummaryDto;
import org.schoolsystem.interfaces.rest.dto.TopicDetailDto;
import org.schoolsystem.interfaces.rest.dto.TopicSummaryDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Mapper für Topic → TopicSummaryDto / TopicDetailDto.
 *
 * Die komplexe Berechnung (Scores, Similar Topics) passiert außerhalb
 * und wird hier nur in die DTO-Struktur gebracht.
 */
public class TopicDtoMapper {

    /**
     * Baut ein TopicSummaryDto aus einem Topic und den dazugehörigen Tags.
     */
    public static TopicSummaryDto toSummaryDto(
            Topic topic,
            List<Tag> tagsForTopic,
            LanguageCode lang
    ) {
        Objects.requireNonNull(topic, "topic must not be null");
        Objects.requireNonNull(tagsForTopic, "tagsForTopic must not be null");

        String name = LocalizedTextMapper.toLocalizedString(topic.name(), lang);
        String shortDescription = topic.description()
                .map(desc -> LocalizedTextMapper.toLocalizedString(desc, lang))
                .orElse(null);

        List<String> tagLabels = tagsForTopic.stream()
                .map(Tag::primaryLabel)
                .toList();

        List<String> links = topic.urls().stream()
                .map(WebUrl::asString)
                .toList();

        return new TopicSummaryDto(
                topic.id().value(),
                name,
                topic.type().name().getOrDefault(lang, new LanguageCode("en")),
                topic.layer(),
                shortDescription,
                tagLabels,
                links
        );
    }

    /**
     * Baut ein TopicDetailDto.
     *
     * @param topic          Domain-Topic
     * @param tagsForTopic   alle Tags, die mit dem Topic verknüpft sind
     * @param scoredResources bereits berechnete Ressourcen-Scores
     * @param similarTopics  bereits berechnete ähnlichere Topics
     * @param lang           gewünschte Sprache
     */
    public static TopicDetailDto toDetailDto(
            Topic topic,
            List<Tag> tagsForTopic,
            List<ScoredResource> scoredResources,
            List<SimilarTopicInfo> similarTopics,
            LanguageCode lang
    ) {
        Objects.requireNonNull(topic, "topic must not be null");
        Objects.requireNonNull(tagsForTopic, "tagsForTopic must not be null");
        Objects.requireNonNull(scoredResources, "scoredResources must not be null");
        Objects.requireNonNull(similarTopics, "similarTopics must not be null");

        String name = LocalizedTextMapper.toLocalizedString(topic.name(), lang);
        String description = topic.description()
                .map(desc -> LocalizedTextMapper.toLocalizedString(desc, lang))
                .orElse(null);

        List<String> links = topic.urls().stream()
                .map(WebUrl::asString)
                .toList();

        // Tags
        List<TopicDetailDto.TopicTagDto> tagDtos = tagsForTopic.stream()
                .map(tag -> new TopicDetailDto.TopicTagDto(
                        tag.id(),
                        tag.primaryLabel()
                ))
                .toList();

        // Ressourcen mit Score
        List<TopicDetailDto.TopicResourceScoreDto> resourceDtos = new ArrayList<>();
        for (ScoredResource sr : scoredResources) {
            ResourceSummaryDto resourceDto = ResourceDtoMapper.toDto(sr.resource(), sr.url());

            List<TopicDetailDto.TopicResourceMatchedTagDto> matchedTagDtos = sr.matchedTags().stream()
                    .map(mt -> new TopicDetailDto.TopicResourceMatchedTagDto(
                            mt.tagId(),
                            mt.label(),
                            mt.topicWeight(),
                            mt.resourceWeight(),
                            mt.contribution()
                    ))
                    .toList();

            resourceDtos.add(new TopicDetailDto.TopicResourceScoreDto(
                    resourceDto,
                    sr.score(),
                    matchedTagDtos
            ));
        }

        // Ähnliche Topics
        List<TopicDetailDto.SimilarTopicDto> similarDtos = similarTopics.stream()
                .map(st -> new TopicDetailDto.SimilarTopicDto(
                        st.id(),
                        st.name(),
                        st.type(),
                        st.layer()
                ))
                .toList();

        return new TopicDetailDto(
                topic.id().value(),
                name,
                topic.type().name().getOrDefault(lang, new LanguageCode("en")),
                topic.layer(),
                description,
                links,
                tagDtos,
                resourceDtos,
                similarDtos
        );
    }

    /**
     * Hilfstyp: ScoredResource für die Detailansicht.
     *
     * Dies ist KEIN Domain-Typ, sondern eine reine View-Projection für die Mapper-Schicht.
     * Kann später problemlos durch einen echten Domain-View-Typ ersetzt werden.
     */
    public record ScoredResource(
            org.schoolsystem.domain.model.Resource resource,
            String url,
            int score,
            List<MatchedTag> matchedTags
    ) {
    }

    /**
     * Hilfstyp für die Erklärung eines Resource-Scores.
     */
    public record MatchedTag(
            int tagId,
            String label,
            int topicWeight,
            int resourceWeight,
            int contribution
    ) {
    }

    /**
     * Hilfstyp für "ähnliche Topics".
     */
    public record SimilarTopicInfo(
            String id,
            String name,
            String type,
            int layer
    ) {
    }
}
