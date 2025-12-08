package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.SourceAuthor;

import java.io.IOException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SourceAuthorCsvLoaderTest {

    @Test
    void loadAll_shouldLoadAtLeastOneAuthorWithValidFields() throws IOException {
        // arrange
        CsvFileReader reader = new CsvFileReader();
        SourceAuthorCsvLoader loader =
                new SourceAuthorCsvLoader(reader, "csv/t_source_author.csv");

        // act
        List<SourceAuthor> authors = loader.loadAll();

        // assert: grundlegende Struktur
        assertNotNull(authors, "Loaded authors list must not be null");
        assertFalse(authors.isEmpty(), "There should be at least one source author");

        // assert: alle Datensätze sind konsistent
        assertTrue(
                authors.stream().allMatch(a -> a.id() > 0),
                "All source authors must have id > 0"
        );

        assertTrue(
                authors.stream().allMatch(a -> a.version() == 1),
                "All source authors should currently be loaded with version == 1"
        );

        assertTrue(
                authors.stream().allMatch(a -> a.name() != null && !a.name().isBlank()),
                "All source authors must have a non-blank name"
        );

        // sanity-check auf dem ersten Element (ohne Annahmen zu konkreten Namen/URLs)
        SourceAuthor first = authors.get(0);
        assertTrue(first.id() > 0);
        assertNotNull(first.name());
        assertFalse(first.name().isBlank());
    }
}
