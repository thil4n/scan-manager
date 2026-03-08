package com.wso2.vms.product;

import jakarta.validation.constraints.NotBlank;

public class CreateProductDto {
    private java.util.UUID businessUnitId;

    public java.util.UUID getBusinessUnitId() {
        return businessUnitId;
    }

    public void setBusinessUnitId(java.util.UUID businessUnitId) {
        this.businessUnitId = businessUnitId;
    }

    @NotBlank(message = "Product name is required")
    private String name;

    @NotBlank(message = "Product slug is required")
    private String slug;

    @jakarta.validation.constraints.Size(max = 1000, message = "Description must be at most 1000 characters")
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
