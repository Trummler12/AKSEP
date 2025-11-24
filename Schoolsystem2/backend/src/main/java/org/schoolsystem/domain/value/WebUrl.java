package org.schoolsystem.domain.value;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Objects;

/**
 * Repräsentiert eine valide Web-URL (aktuell nur http/https).
 */
public record WebUrl(URI value) {

    public WebUrl {
        Objects.requireNonNull(value, "URL must not be null");

        String scheme = value.getScheme();
        if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
            throw new IllegalArgumentException("Only http/https URLs are allowed, but was: " + value);
        }

        if (value.getHost() == null || value.getHost().isBlank()) {
            throw new IllegalArgumentException("URL must contain a host, but was: " + value);
        }
    }

    public static WebUrl fromString(String url) {
        Objects.requireNonNull(url, "URL string must not be null");
        String trimmed = url.trim();
        if (trimmed.isEmpty()) {
            throw new IllegalArgumentException("URL string must not be empty");
        }

        try {
            URI uri = new URI(trimmed);
            return new WebUrl(uri);
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("Invalid URL syntax: " + trimmed, e);
        }
    }

    public String asString() {
        return value.toString();
    }

    @Override
    public String toString() {
        return value.toString();
    }
}
