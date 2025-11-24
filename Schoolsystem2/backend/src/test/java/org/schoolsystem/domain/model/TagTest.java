package org.schoolsystem.domain.model;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class TagTest {

    @Test
    void createsValidTag() {
        LanguageCode de = new LanguageCode("de");

        TagLocalization loc = TagLocalization.of(
                Map.of(de, List.of("Physik", "Naturwissenschaft"))
        );

        Tag tag = Tag.of(1, loc, 1);

        assertEquals(1, tag.id());
        assertEquals(1, tag.version());
        assertTrue(tag.localization().languages().contains(de));
        assertTrue(tag.localization().containsSynonym(de, "physik"));
    }

    @Test
    void rejectsInvalidIdLocalizationAndVersion() {
        LanguageCode de = new LanguageCode("de");

        TagLocalization loc = TagLocalization.of(
                Map.of(de, List.of("Physik"))
        );

        assertThrows(IllegalArgumentException.class, () -> Tag.of(0, loc, 1));
        assertThrows(IllegalArgumentException.class, () -> Tag.of(-1, loc, 1));
        assertThrows(NullPointerException.class, () -> Tag.of(1, null, 1));
        assertThrows(IllegalArgumentException.class, () -> Tag.of(1, loc, 0));

        // Tag ohne Synonyme nicht erlaubt
        TagLocalization emptyLoc = TagLocalization.empty();
        assertThrows(IllegalArgumentException.class, () -> Tag.of(1, emptyLoc, 1));
    }
}
