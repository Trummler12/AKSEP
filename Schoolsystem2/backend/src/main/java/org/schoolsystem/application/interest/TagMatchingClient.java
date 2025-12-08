package org.schoolsystem.application.interest;

import org.schoolsystem.domain.model.Tag;
import org.schoolsystem.domain.value.LanguageCode;

import java.util.List;
import java.util.Map;

/**
 * Abstraktion für die KI-/Matching-Komponente.
 *
 * Aufgabe:
 *  - bekommt eine Interessenbeschreibung + alle bekannten Tags
 *  - liefert eine gewichtete Auswahl an Tag-IDs zurück (1..5)
 *
 * Wichtig:
 *  - Diese Schnittstelle kennt keine HTTP/CSV-Details, nur Domain-Objekte.
 *  - Die konkrete Implementierung (z.B. OpenAI) liegt im Infrastruktur-Layer.
 */
public interface TagMatchingClient {

    /**
     * Bestimmt diejenigen Tags, die zur gegebenen Interessenbeschreibung am besten passen.
     *
     * @param interestsText  Freitext-Beschreibung der Interessen (z.B. vom /interesting-Formular)
     * @param language       Sprache der Beschreibung (z.B. "de" oder "en")
     * @param candidateTags  alle registrierten Tags (Tag-Domainobjekte)
     * @param maxTags        harte Obergrenze der zurückzugebenden Tags (z.B. 15)
     * @return Map von tagId -> interestWeight (1..5)
     */
    Map<Integer, Integer> findBestMatchingTagWeights(
            String interestsText,
            LanguageCode language,
            List<Tag> candidateTags,
            int maxTags
    );
}
