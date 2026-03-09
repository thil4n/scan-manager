package com.wso2.vms.api.product.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateProductVersionDto {
    @NotBlank(message = "Version is required")
    private String version;

    private UUID productId;

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }
}
