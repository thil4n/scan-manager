package com.wso2.vms.api.scanner.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wso2.vms.api.scanner.model.ScanFinding;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SemgrepParser {
    private static final Logger logger = LoggerFactory.getLogger(SemgrepParser.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<ScanFinding> parse(String semgrepOutput) throws Exception {
        List<ScanFinding> findings = new ArrayList<>();
        JsonNode root = objectMapper.readTree(semgrepOutput);
        JsonNode results = root.get("results");
        if (results != null && results.isArray()) {
            for (JsonNode result : results) {
                String title = result.path("check_id").asText();
                String filePath = result.path("path").asText();
                int lineNumber = result.path("start").path("line").asInt();
                String description = result.path("extra").path("message").asText();
                String severityStr = result.path("extra").path("severity").asText();
                ScanFinding.Severity severity = mapSeverity(severityStr);
                findings.add(new ScanFinding(title, severity, description, filePath, lineNumber, null));
            }
        }
        logger.info("Parsed {} findings from Semgrep output", findings.size());
        return findings;
    }

    private ScanFinding.Severity mapSeverity(String severityStr) {
        switch (severityStr.toUpperCase()) {
            case "CRITICAL": return ScanFinding.Severity.CRITICAL;
            case "ERROR": return ScanFinding.Severity.HIGH;
            case "WARNING": return ScanFinding.Severity.MEDIUM;
            case "INFO": return ScanFinding.Severity.INFO;
            default: return ScanFinding.Severity.LOW;
        }
    }
}
