package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResourceTest {

    @Test
    void createsResourceWithVersionsAndNormalizesStrings() {
        ResourceType type = ResourceType.of(1, "Arbeitsblatt", 1);

        RVersion version1 = RVersion.withoutLanguages(1, "1.0.0", 1);
        RVersion version2 = RVersion.withoutLanguages(2, "1.1.0", 1);

        Resource resource = Resource.of(
                10,
                type,
                "  Physik Einführung  ",
                "  Erste Basis-Ressource  ",
                true,
                3,
                List.of(version1, version2)
        );

        assertEquals(10, resource.id());
        assertEquals(type, resource.type());
        assertEquals(3, resource.version());
        assertTrue(resource.isActive());

        assertEquals("Physik Einführung", resource.title().orElseThrow());
        assertEquals("Erste Basis-Ressource", resource.description().orElseThrow());

        assertEquals(2, resource.versions().size());
        assertEquals(version1, resource.versions().get(0));
        assertEquals(version2, resource.versions().get(1));

        // Liste muss unveränderlich sein
        assertThrows(UnsupportedOperationException.class,
                () -> resource.versions().add(version1));
    }

    @Test
    void minimalCreatesActiveResourceWithEmptyVersions() {
        ResourceType type = ResourceType.of(2, "Video", 1);

        Resource resource = Resource.minimal(
                5,
                type,
                "  Video-Titel  ",
                null,
                1
        );

        assertEquals(5, resource.id());
        assertEquals(type, resource.type());
        assertEquals(1, resource.version());
        assertTrue(resource.isActive());

        assertEquals("Video-Titel", resource.title().orElseThrow());
        assertTrue(resource.description().isEmpty());
        assertTrue(resource.versions().isEmpty());
    }

    @Test
    void rejectsInvalidIdVersionOrNullTypeOrVersions() {
        ResourceType type = ResourceType.of(1, "Arbeitsblatt", 1);
        RVersion version = RVersion.withoutLanguages(1, "1.0", 1);

        // ungültige IDs
        assertThrows(IllegalArgumentException.class,
                () -> Resource.of(0, type, null, null, true, 1, List.of(version)));
        assertThrows(IllegalArgumentException.class,
                () -> Resource.of(-1, type, null, null, true, 1, List.of(version)));

        // ungültige Version
        assertThrows(IllegalArgumentException.class,
                () -> Resource.of(1, type, null, null, true, 0, List.of(version)));

        // null-Typ
        assertThrows(NullPointerException.class,
                () -> Resource.of(1, null, null, null, true, 1, List.of(version)));

        // null-Liste
        assertThrows(NullPointerException.class,
                () -> Resource.of(1, type, null, null, true, 1, null));

        // Liste mit null-Element
        assertThrows(NullPointerException.class,
                () -> Resource.of(1, type, null, null, true, 1, List.of(version, null)));
    }
}
