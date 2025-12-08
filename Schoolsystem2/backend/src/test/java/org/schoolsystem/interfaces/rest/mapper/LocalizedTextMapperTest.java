package org.schoolsystem.interfaces.rest.mapper;

import org.junit.jupiter.api.Test;
import org.schoolsystem.domain.value.LanguageCode;
import org.schoolsystem.domain.model.LocalizedText;

import static org.junit.jupiter.api.Assertions.assertEquals;

class LocalizedTextMapperTest {

    @Test
    void usesRequestedLanguageIfAvailable() {
        LanguageCode de = new LanguageCode("de");
        LanguageCode en = new LanguageCode("en");

        LocalizedText text = LocalizedText.of(de, "Hallo")
                .with(en, "Hello");

        String result = LocalizedTextMapper.toLocalizedString(text, de);

        assertEquals("Hallo", result);
    }

    @Test
    void fallsBackToEnglishIfRequestedNotAvailable() {
        LanguageCode de = new LanguageCode("de");
        LanguageCode en = new LanguageCode("en");
        LanguageCode fr = new LanguageCode("fr");

        LocalizedText text = LocalizedText.of(en, "Hello")
                .with(de, "Hallo");

        String result = LocalizedTextMapper.toLocalizedString(text, fr);

        assertEquals("Hello", result);
    }
}
