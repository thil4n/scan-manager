package com.wso2.vms.api.scanner.scanner;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wso2.vms.api.scanner.model.ScanFinding;
import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.parser.SemgrepParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.List;

@Component
public class SemgrepRunner {
    private static final Logger logger = LoggerFactory.getLogger(SemgrepRunner.class);
    private final SemgrepParser semgrepParser;

    public SemgrepRunner(SemgrepParser semgrepParser) {
        this.semgrepParser = semgrepParser;
    }

    public List<ScanFinding> run(ScanJob job, Path workspace) throws Exception {
        logger.info("Running Semgrep for job {} in {}", job.getScanId(), workspace);
        // For demo: simulate Semgrep output
        String semgrepOutput = "{\"results\": [{\"check_id\": \"test\", \"path\": \"src/App.java\", \"start\": {\"line\": 10}, \"extra\": {\"message\": \"Test finding\", \"severity\": \"ERROR\"}}]}";
        // Real: run Semgrep via ProcessBuilder or Docker
        // ...process execution logic...
        return semgrepParser.parse(semgrepOutput);
    }
}
