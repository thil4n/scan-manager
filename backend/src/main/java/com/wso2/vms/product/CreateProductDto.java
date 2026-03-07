package com.wso2.vms.product;

import jakarta.validation.constraints.NotBlank;

public class CreateProductDto {

    @NotBlank
    private String name;

    private String vendor;

    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
