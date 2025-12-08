package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.*;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.value.WebUrl;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

/**
 * Lädt t_source.csv und erzeugt:
 * - für jede Zeile ein {@link Source}
 * - für jede Zeile mit sa_resource == 1 zusätzlich:
 *   - eine {@link WebRLangVersion}
 *   - eine {@link RVersion}
 *   - eine {@link Resource} (id == sourceID)
 *   - eine {@link UsesSource}-Beziehung
 */
public final class SourceCsvLoader {

    private static final String DEFAULT_CSV_PATH = "csv/t_source.csv";

    private final CsvFileReader csvFileReader;
    private final String resourcePath;

    private final Map<Integer, SourceType> sourceTypesById;
    private final Map<Integer, ResourceType> resourceTypesById;

    public SourceCsvLoader(
            CsvFileReader csvFileReader,
            List<SourceType> sourceTypes,
            List<ResourceType> resourceTypes
    ) {
        this(csvFileReader, DEFAULT_CSV_PATH, sourceTypes, resourceTypes);
    }

    public SourceCsvLoader(
            CsvFileReader csvFileReader,
            String resourcePath,
            List<SourceType> sourceTypes,
            List<ResourceType> resourceTypes
    ) {
        this.csvFileReader = Objects.requireNonNull(csvFileReader, "csvFileReader must not be null");
        this.resourcePath = Objects.requireNonNull(resourcePath, "resourcePath must not be null");

        Objects.requireNonNull(sourceTypes, "sourceTypes must not be null");
        Objects.requireNonNull(resourceTypes, "resourceTypes must not be null");

        this.sourceTypesById = new HashMap<>();
        for (SourceType st : sourceTypes) {
            this.sourceTypesById.put(st.id(), st);
        }

        this.resourceTypesById = new HashMap<>();
        for (ResourceType rt : resourceTypes) {
            this.resourceTypesById.put(rt.id(), rt);
        }
    }

    public SourceImportResult loadAll() throws IOException {
        List<Map<String, String>> rows = csvFileReader.readWithHeader(resourcePath);

        // SourceAuthor-CSV laden und Map<ID, Author> aufbauen
        SourceAuthorCsvLoader authorLoader = new SourceAuthorCsvLoader(csvFileReader, "csv/t_source_author.csv");
        List<SourceAuthor> authors = authorLoader.loadAll();
        Map<Integer, SourceAuthor> authorsById = authors.stream()
                .collect(java.util.stream.Collectors.toMap(SourceAuthor::id, a -> a));

        List<Source> sources = new ArrayList<>();
        List<Resource> resources = new ArrayList<>();
        List<RVersion> versions = new ArrayList<>();
        List<RLangVersion> langVersions = new ArrayList<>();
        List<UsesSource> usesSources = new ArrayList<>();

        LanguageCode english = new LanguageCode("en");

        int nextVersionId = 1;
        int nextLangVersionId = 1;

        for (Map<String, String> row : rows) {
            int sourceId = parseInt(row.get("sourceID"), "sourceID");
            int sourceTypeId = parseInt(row.get("source_typeID"), "source_typeID");

            String urlString = trimToNull(row.get("source_URL"));
            Optional<WebUrl> sourceUrl = Optional.ofNullable(urlString)
                    .map(WebUrl::fromString);

            String title = trimToEmpty(row.get("source_title"));
            String description = trimToEmpty(row.get("description"));

            LocalDateTime created = parseInstantToLocalDateTime(row.get("created"));
            LocalDateTime updated = parseInstantToLocalDateTime(row.get("updated"));

            int saResourceFlag = parseInt(row.get("sa_resource"), "sa_resource");
            int version = 1;

            SourceType sourceType = resolveSourceType(sourceTypeId);

            // SourceAuthor aus der Map ermitteln (kann null sein, z.B. wenn sauthorID leer/0)
            SourceAuthor author = null;
            String sauthorIdRaw = row.get("sauthorID");
            if (sauthorIdRaw != null && !sauthorIdRaw.isBlank()) {
                int sauthorId = parseInt(sauthorIdRaw, "sauthorID");
                author = authorsById.get(sauthorId);
                // Wenn du es strenger haben willst:
                // if (author == null) {
                //     throw new IllegalArgumentException("Unknown sauthorID: " + sauthorId);
                // }
            }

            Source source = Source.of(
                    sourceId,
                    sourceType,
                    sourceUrl.orElse(null),
                    author,
                    title,
                    description,
                    created,
                    updated,
                    version
            );
            sources.add(source);

            // Nur wenn sa_resource == 1, erzeugen wir zusätzlich Resource + Version + Sprachversion + UsesSource
            if (saResourceFlag == 1 && sourceUrl.isPresent()) {
                int authorId = parseInt(row.get("sauthorID"), "sauthorID");

                WebUrl webUrl = sourceUrl.orElseThrow(); // ist vorhanden, sonst wären wir oben nicht hier

                int langVersionId = nextLangVersionId++;
                int versionId = nextVersionId++;

                WebRLangVersion webLangVersion = WebRLangVersion.minimal(
                        langVersionId,
                        english,
                        authorId,
                        version,
                        webUrl
                );
                langVersions.add(webLangVersion);

                RVersion rVersion = RVersion.of(
                        versionId,
                        "1.0",
                        null,
                        version,
                        List.of(webLangVersion)
                );
                versions.add(rVersion);

                // ResourceType anhand der ID des SourceType (Mapping 1:1 über ID)
                ResourceType resourceType = resolveResourceType(sourceTypeId);

                int resourceId = sourceId; // wichtig, damit ct_resource_tags.csv usw. dazu passen

                Resource resource = Resource.of(
                        resourceId,
                        resourceType,
                        title,
                        description,
                        true, // isActive
                        version,
                        List.of(rVersion)
                );
                resources.add(resource);

                UsesSource usesSource = UsesSource.of(
                        resourceId,
                        sourceId,
                        created, // "verwendet sich selbst" seit Erstellung
                        version
                );
                usesSources.add(usesSource);
            }
        }

        return new SourceImportResult(
                List.copyOf(sources),
                List.copyOf(resources),
                List.copyOf(versions),
                List.copyOf(langVersions),
                List.copyOf(usesSources)
        );
    }

    private SourceType resolveSourceType(int sourceTypeId) {
        SourceType type = sourceTypesById.get(sourceTypeId);
        if (type == null) {
            throw new IllegalArgumentException("Unknown source_typeID: " + sourceTypeId);
        }
        return type;
    }

    private ResourceType resolveResourceType(int resourceTypeId) {
        ResourceType type = resourceTypesById.get(resourceTypeId);
        if (type == null) {
            throw new IllegalArgumentException("Unknown resource_typeID (mapped from source_typeID): " + resourceTypeId);
        }
        return type;
    }

    private static int parseInt(String raw, String fieldName) {
        if (raw == null) {
            throw new IllegalArgumentException("Field '" + fieldName + "' is missing");
        }
        try {
            return Integer.parseInt(raw.trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(
                    "Field '" + fieldName + "' must be an integer, but was: '" + raw + "'", ex
            );
        }
    }

    private static String trimToNull(String raw) {
        if (raw == null) {
            return null;
        }
        String trimmed = raw.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String trimToEmpty(String raw) {
        return raw == null ? "" : raw.trim();
    }

    private static LocalDateTime parseInstantToLocalDateTime(String raw) {
        String trimmed = trimToNull(raw);
        if (trimmed == null) {
            return null;
        }
        // Beispiel-Format in t_source.csv: 2010-08-15T15:59:08Z
        Instant instant = Instant.parse(trimmed);
        return LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
    }
}
