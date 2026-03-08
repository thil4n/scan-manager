package com.wso2.vms.api.scan;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateScanDto {

    @NotNull
    private UUID releaseId;

    private String tool;

    private String summary;

    public UUID getReleaseId() {
        return releaseId;
    }

    public void setReleaseId(UUID releaseId) {
        this.releaseId = releaseId;
    }

    public String getTool() {
        return tool;
    }

    public void setTool(String tool) {
        this.tool = tool;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
