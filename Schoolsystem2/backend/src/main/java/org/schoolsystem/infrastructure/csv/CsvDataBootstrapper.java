package org.schoolsystem.infrastructure.csv;

import org.schoolsystem.domain.model.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Orchestriert das Laden aller relevanten CSV-Dateien
 * und baut daraus ein CsvBootstrapResult.
 *
 * Diese Klasse kennt nur den CSV-Layer, NICHT die Repositories.
 * Die Befüllung der Repositories kann dann ein eigener Schritt sein.
 */
public final class CsvDataBootstrapper {

    private final CsvFileReader reader;

    public CsvDataBootstrapper() {
        this(new CsvFileReader());
    }

    // Paket-sichtbar für Tests
    CsvDataBootstrapper(CsvFileReader reader) {
        this.reader = reader;
    }
    public CsvBootstrapResult loadAll() throws IOException {
        // 1) Lookups
        var sourceTypes = new SourceTypeCsvLoader(reader, "csv/t_source_type.csv").loadAll();
        var resourceTypes = new ResourceTypeCsvLoader(reader, "csv/t_resource_type.csv").loadAll();
        var topicTypes = new TopicTypeCsvLoader(reader, "csv/t_topic_type.csv").loadAll();

        // InteractionType ist ein Enum und wird NICHT aus CSV geladen
        var interactionTypes = List.of(InteractionType.values());

        // 2) Tags
        var tagLoader = new TagCsvLoader(); // benutzt eigenen Reader, ist aber idempotent
        var tags = tagLoader.loadAll();
        Map<Integer, Tag> tagsById = tags.stream()
                .collect(Collectors.toUnmodifiableMap(Tag::id, Function.identity()));

        // 3) Topics + Levels + TopicTags
        var topicLoader = new TopicCsvLoader(topicTypes);
        var topics = topicLoader.loadAll();

        var topicLevelLoader = new TopicLevelCsvLoader();
        var topicLevels = topicLevelLoader.loadAll();

        // TopicTagCsvLoader erwartet die Tag-Map als Argument in loadAll(...)
        var topicTagLoader = new TopicTagCsvLoader();
        var topicTags = topicTagLoader.loadAll(tagsById);

        // 4) SourceAuthors
        var sourceAuthorLoader = new SourceAuthorCsvLoader(reader, "csv/t_source_author.csv");
        var sourceAuthors = sourceAuthorLoader.loadAll();

        // 5) Sources + Resources (+ Versions, LangVersions, UsesSource)
        var sourceCsvLoader = new SourceCsvLoader(reader, sourceTypes, resourceTypes);
        var sourceImport = sourceCsvLoader.loadAll();

        // 6) ResourceTags (resourceID <-> tagID with weight)
        var resourceTagLoader = new ResourceTagCsvLoader();
        var resourceTags = resourceTagLoader.loadAll();

        return new CsvBootstrapResult(
                sourceTypes,
                resourceTypes,
                topicTypes,
                interactionTypes,
                tags,
                topics,
                topicLevels,
                topicTags,
                resourceTags,
                sourceAuthors,
                sourceImport.sources(),
                sourceImport.resources(),
                sourceImport.resourceVersions(),
                sourceImport.languageVersions(),
                sourceImport.usesSources()
        );
    }
}
