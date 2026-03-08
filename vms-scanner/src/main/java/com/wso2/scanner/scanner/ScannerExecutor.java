package com.wso2.vms.api.scanner.scanner;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.model.ScanFinding;
import com.wso2.vms.api.scanner.service.ScanJobService;
import com.wso2.vms.api.scanner.client.VmsApiClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

@Service
public class ScannerExecutor {
    private static final Logger logger = LoggerFactory.getLogger(ScannerExecutor.class);
    private final ScanJobService scanJobService;
    private final VmsApiClient vmsApiClient;
    private final SemgrepRunner semgrepRunner;
    // Add other runners as needed

    public ScannerExecutor(ScanJobService scanJobService, VmsApiClient vmsApiClient, SemgrepRunner semgrepRunner) {
        this.scanJobService = scanJobService;
        this.vmsApiClient = vmsApiClient;
        this.semgrepRunner = semgrepRunner;
    }

    public void executeScan(ScanJob job) {
        job.setStatus(ScanJob.Status.RUNNING);
        scanJobService.updateScanJob(job);
        logger.info("Scan job {} started", job.getScanId());
        Path workspace = null;
        try {
            workspace = createWorkspace(job.getScanId());
            prepareWorkspace(job, workspace);
            List<ScanFinding> findings = runTool(job, workspace);
            job.setStatus(ScanJob.Status.COMPLETED);
            scanJobService.updateScanJob(job);
            logger.info("Scan job {} completed", job.getScanId());
            vmsApiClient.submitReport(job.getScanId(), findings);
        } catch (Exception e) {
            logger.error("Scan job {} failed: {}", job.getScanId(), e.getMessage());
            job.setStatus(ScanJob.Status.FAILED);
            scanJobService.updateScanJob(job);
            vmsApiClient.updateScanStatus(job.getScanId(), ScanJob.Status.FAILED);
        } finally {
            if (workspace != null) {
                cleanupWorkspace(workspace);
            }
        }
    }

    private Path createWorkspace(UUID scanId) throws Exception {
        Path workspace = Path.of("/tmp/scanner/" + scanId);
        Files.createDirectories(workspace);
        logger.info("Workspace created: {}", workspace);
        return workspace;
    }

    private void prepareWorkspace(ScanJob job, Path workspace) throws Exception {
        // Clone repo or copy artifact
        if (job.getRepositoryUrl() != null && !job.getRepositoryUrl().isEmpty()) {
            // For demo: just log, real: clone git repo
            logger.info("Cloning repo {} into {}", job.getRepositoryUrl(), workspace);
            // ...git clone logic...
        } else if (job.getArtifactPath() != null && !job.getArtifactPath().isEmpty()) {
            logger.info("Copying artifact {} into {}", job.getArtifactPath(), workspace);
            // ...copy artifact logic...
        }
    }

    private List<ScanFinding> runTool(ScanJob job, Path workspace) throws Exception {
        switch (job.getTool().toUpperCase()) {
            case "SEMGREP":
                return semgrepRunner.run(job, workspace);
            // Add other tools: ZAP, FOSSA, etc.
            default:
                throw new IllegalArgumentException("Unknown tool: " + job.getTool());
        }
    }

    private void cleanupWorkspace(Path workspace) {
        try {
            Files.walk(workspace)
                .map(Path::toFile)
                .sorted((a, b) -> -a.compareTo(b))
                .forEach(File::delete);
            logger.info("Workspace deleted: {}", workspace);
        } catch (Exception e) {
            logger.warn("Failed to delete workspace {}: {}", workspace, e.getMessage());
        }
    }
}
