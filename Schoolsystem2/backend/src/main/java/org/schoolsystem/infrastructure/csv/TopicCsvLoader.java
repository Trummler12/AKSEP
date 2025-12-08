package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.LocalizedText;
import org.schoolsystem.domain.model.Topic;
import org.schoolsystem.domain.model.TopicType;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.TopicId;
import org.schoolsystem.domain.value.WebUrl;

import java.util.*;

/**
 * Lädt Topic-Daten aus csv/t_topic.csv.
 *
 * Entspricht t_topic:
 *  - topicID     -> TopicId
 *  - lang        -> LanguageCode (Fallback: "en")
 *  - name        -> LocalizedText (Name)
 *  - typeID      -> TopicType (per ID-Mapping)
 *  - layer       -> int
 *  - description -> optional LocalizedText
 *  - url         -> optional WebUrl (als Liste mit max. einem Eintrag)
 *  - version     -> hier: immer 1
 *
 * TopicLevels und Tags werden in separaten Schritten zugeordnet.
 */
public final class TopicCsvLoader {

    private final CsvFileReader reader;
    private final String resourcePath;
    private final Map<Integer, TopicType> topicTypesById;

    public TopicCsvLoader(List<TopicType> topicTypes) {
        this(new CsvFileReader(), "csv/t_topic.csv", topicTypes);
    }

    TopicCsvLoader(CsvFileReader reader,
                   String resourcePath,
                   List<TopicType> topicTypes) {
        this.reader = reader;
        this.resourcePath = resourcePath;
        this.topicTypesById = buildTypeIndex(topicTypes);
    }

    private static Map<Integer, TopicType> buildTypeIndex(List<TopicType> types) {
        Map<Integer, TopicType> map = new HashMap<>();
        for (TopicType type : types) {
            TopicType previous = map.put(type.id(), type);
            if (previous != null) {
                throw new IllegalArgumentException(
                        "Duplicate TopicType id: " + type.id());
            }
        }
        return Map.copyOf(map);
    }

    public List<Topic> loadAll() {
        List<Map<String, String>> rows = reader.readWithHeader(resourcePath);
        List<Topic> result = new ArrayList<>();

        for (Map<String, String> row : rows) {
            String topicIdRaw = row.get("topicID");
            String langRaw = row.get("lang");
            String nameRaw = row.get("name");
            String typeIdRaw = row.get("typeID");
            String layerRaw = row.get("layer");
            String descRaw = row.get("description");
            String urlRaw = row.get("url");

            TopicId topicId = TopicId.of(topicIdRaw.trim());

            String langCode = (langRaw == null || langRaw.isBlank())
                    ? "en"
                    : langRaw.trim();
            LanguageCode language = new LanguageCode(langCode);

            LocalizedText name = LocalizedText.of(language, nameRaw == null ? "" : nameRaw.trim());

            LocalizedText description = null;
            if (descRaw != null) {
                String trimmed = descRaw.trim();
                if (!trimmed.isEmpty() && !"NULL".equalsIgnoreCase(trimmed)) {
                    description = LocalizedText.of(language, trimmed);
                }
            }

            int typeId = Integer.parseInt(typeIdRaw.trim());
            TopicType type = topicTypesById.get(typeId);
            if (type == null) {
                throw new IllegalStateException(
                        "No TopicType found for typeID=" + typeId + " (topicID=" + topicIdRaw + ")");
            }

            int layer = Integer.parseInt(layerRaw.trim());
            int version = 1; // CSV-Version wird ignoriert

            List<WebUrl> urls = List.of();
            if (urlRaw != null) {
                String trimmedUrl = urlRaw.trim();
                if (!trimmedUrl.isEmpty() && !"NULL".equalsIgnoreCase(trimmedUrl)) {
                    urls = List.of(WebUrl.fromString(trimmedUrl));
                }
            }

            // TopicLevels werden später per TopicLevelCsvLoader zugeordnet,
            // daher hier zunächst eine leere Liste.
            Topic topic = Topic.of(
                    topicId,
                    name,
                    type,
                    layer,
                    description,
                    version,
                    List.of(), // levels
                    urls
            );

            result.add(topic);
        }

        return Collections.unmodifiableList(result);
    }
}
