package org.schoolsystem.infrastructure.csv;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

class CsvLineParserTest {

    @Test
    void parsesSimpleLine() {
        String line = "1,Hello,World";
        String[] parsed = CsvLineParser.parse(line);
        assertArrayEquals(new String[]{"1", "Hello", "World"}, parsed);
    }

    @Test
    void parsesQuotedWithComma() {
        String line = "0,\"Web Page\"";
        String[] parsed = CsvLineParser.parse(line);
        assertArrayEquals(new String[]{"0", "Web Page"}, parsed);
    }

    @Test
    void parsesQuotedWithCommaInside() {
        String line = "0,\"Hello, World\",\"Another,Field\"";
        String[] parsed = CsvLineParser.parse(line);
        assertArrayEquals(new String[]{
                "0", "Hello, World", "Another,Field"
        }, parsed);
    }

    @Test
    void parsesEscapedQuotes() {
        String line = "1,\"He said \"\"Hi\"\"\"";
        String[] parsed = CsvLineParser.parse(line);
        assertArrayEquals(new String[]{"1", "He said \"Hi\""}, parsed);
    }
}
