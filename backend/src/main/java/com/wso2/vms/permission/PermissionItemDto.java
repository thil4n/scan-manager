package com.wso2.vms.permission;

public class PermissionItemDto {
    private Long id;
    private String description;

    public PermissionItemDto(Long id, String description) {
        this.id = id;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }
}
