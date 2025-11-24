package org.schoolsystem.domain.value;

import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Repräsentiert eine Topic-ID mit speziellem Benennungsschema.
 *
 * Zulässige Formen:
 *  - AAA0..AAA9   (General Subject / Specialization)
 *  - Aaa0..Aaa9   (General/Optional Course)
 *  - aaaa         (Achievement)
 */
public record TopicId(String value) {

    private static final Pattern PATTERN =
        Pattern.compile("([A-Z]{3}\\d)|([A-Z][a-z]{2}\\d)|([a-z]{4})");

    public TopicId {
        Objects.requireNonNull(value, "TopicId must not be null");
        String normalized = value.trim();

        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("TopicId must not be empty");
        }
        if (!PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException(
                "TopicId '" + normalized + "' does not match allowed patterns"
            );
        }

        value = normalized;
    }

    public static TopicId of(String value) {
        return new TopicId(value);
    }

    public boolean isSubject() {
        return value.length() == 4
            && Character.isUpperCase(value.charAt(0))
            && Character.isUpperCase(value.charAt(1))
            && Character.isUpperCase(value.charAt(2))
            && Character.isDigit(value.charAt(3));
    }

    public boolean isCourse() {
        return value.length() == 4
            && Character.isUpperCase(value.charAt(0))
            && Character.isLowerCase(value.charAt(1))
            && Character.isLowerCase(value.charAt(2))
            && Character.isDigit(value.charAt(3));
    }

    public boolean isAchievement() {
        return value.length() == 4
            && value.chars().allMatch(ch -> ch >= 'a' && ch <= 'z');
    }

    public boolean isGeneral() {
        return value.charAt(3) == '0';
    }

    public boolean isOptional() {
        return value.charAt(3) != '0';
    }

    public boolean isGeneralSubject() {
        return isSubject() && isGeneral();
    }

    public boolean isSpecialization() {
        return isSubject() && !isGeneral();
    }

    public boolean isGeneralCourse() {
        return isCourse() && isGeneral();
    }

    public boolean isOptionalCourse() {
        return isCourse() && !isGeneral();
    }

    @Override
    public String toString() {
        return value;
    }
}
