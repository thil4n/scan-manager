package com.wso2.vms.api.product;

import jakarta.validation.constraints.NotBlank;

public class UpdateProductVersionDto {
    @NotBlank(message = "Version is required")
    private String version;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
