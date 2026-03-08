package com.wso2.vms.api.buisnessunit;

import jakarta.validation.constraints.NotBlank;

public class CreateBuisnessUnitDto {

    @NotBlank
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
