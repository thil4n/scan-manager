package com.wso2.vms.api.scanner.model;

public class ScanFinding {
    public enum Severity {
        CRITICAL, HIGH, MEDIUM, LOW, INFO
    }

    private String title;
    private Severity severity;
    private String description;
    private String filePath;
    private Integer lineNumber;
    private String cveId;

    public ScanFinding() {}

    public ScanFinding(String title, Severity severity, String description, String filePath, Integer lineNumber, String cveId) {
        this.title = title;
        this.severity = severity;
        this.description = description;
        this.filePath = filePath;
        this.lineNumber = lineNumber;
        this.cveId = cveId;
    }

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Integer getLineNumber() { return lineNumber; }
    public void setLineNumber(Integer lineNumber) { this.lineNumber = lineNumber; }
    public String getCveId() { return cveId; }
    public void setCveId(String cveId) { this.cveId = cveId; }
}
