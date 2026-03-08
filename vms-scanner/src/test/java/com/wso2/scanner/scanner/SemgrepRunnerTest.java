package com.wso2.vms.api.scanner.scanner;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.parser.SemgrepParser;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class SemgrepRunnerTest {
    @Test
    public void testRunSemgrep() throws Exception {
        SemgrepParser parser = Mockito.mock(SemgrepParser.class);
        SemgrepRunner runner = new SemgrepRunner(parser);
        ScanJob job = new ScanJob();
        Path workspace = Path.of("/tmp/scanner/test");
        runner.run(job, workspace);
        // No assertion, just ensure no exceptions
    }
}
