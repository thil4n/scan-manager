package com.wso2.vms.api.scanner.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class ScanJob {
    public enum ScanType {
        SAST, DAST, SCA, PENTEST
    }

    public enum Status {
        QUEUED, RUNNING, COMPLETED, FAILED
    }

    private UUID scanId;
    private String product;
    private String version;
    private ScanType scanType;
    private String tool;
    private String repositoryUrl;
    private String artifactPath;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ScanJob() {}

    public ScanJob(UUID scanId, String product, String version, ScanType scanType, String tool, String repositoryUrl, String artifactPath, Status status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.scanId = scanId;
        this.product = product;
        this.version = version;
        this.scanType = scanType;
        this.tool = tool;
        this.repositoryUrl = repositoryUrl;
        this.artifactPath = artifactPath;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public UUID getScanId() { return scanId; }
    public void setScanId(UUID scanId) { this.scanId = scanId; }
    public String getProduct() { return product; }
    public void setProduct(String product) { this.product = product; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public ScanType getScanType() { return scanType; }
    public void setScanType(ScanType scanType) { this.scanType = scanType; }
    public String getTool() { return tool; }
    public void setTool(String tool) { this.tool = tool; }
    public String getRepositoryUrl() { return repositoryUrl; }
    public void setRepositoryUrl(String repositoryUrl) { this.repositoryUrl = repositoryUrl; }
    public String getArtifactPath() { return artifactPath; }
    public void setArtifactPath(String artifactPath) { this.artifactPath = artifactPath; }
    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
