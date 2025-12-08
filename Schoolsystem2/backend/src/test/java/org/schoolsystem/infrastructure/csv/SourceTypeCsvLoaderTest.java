package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.model.SourceType;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SourceTypeCsvLoaderTest {

    @Test
    void loadsSourceTypesFromCsv() {
        SourceTypeCsvLoader loader = new SourceTypeCsvLoader();

        List<SourceType> types = loader.loadAll();

        assertEquals(3, types.size());

        SourceType st0 = types.get(0);
        assertEquals(0, st0.id());
        assertEquals("Web Page", st0.name());
        assertEquals(1, st0.version());

        SourceType st1 = types.get(1);
        assertEquals(1, st1.id());
        assertEquals("YouTube Video", st1.name());

        SourceType st2 = types.get(2);
        assertEquals(2, st2.id());
        assertEquals("YouTube Playlist", st2.name());
    }
}
