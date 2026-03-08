package com.wso2.vms.api.scanner.parser;

import com.wso2.vms.api.scanner.model.ScanFinding;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SemgrepParserTest {
    @Test
    public void testParseSemgrepOutput() throws Exception {
        SemgrepParser parser = new SemgrepParser();
        String output = "{\"results\": [{\"check_id\": \"test\", \"path\": \"src/App.java\", \"start\": {\"line\": 10}, \"extra\": {\"message\": \"Test finding\", \"severity\": \"ERROR\"}}]}";
        List<ScanFinding> findings = parser.parse(output);
        assertEquals(1, findings.size());
        assertEquals("test", findings.get(0).getTitle());
        assertEquals(ScanFinding.Severity.HIGH, findings.get(0).getSeverity());
    }
}
