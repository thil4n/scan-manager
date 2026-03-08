package com.wso2.vms.api.product;

public class UpdateProductDto {
    private java.util.UUID businessUnitId;

    public java.util.UUID getBusinessUnitId() {
        return businessUnitId;
    }

    public void setBusinessUnitId(java.util.UUID businessUnitId) {
        this.businessUnitId = businessUnitId;
    }

    private String name;
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
