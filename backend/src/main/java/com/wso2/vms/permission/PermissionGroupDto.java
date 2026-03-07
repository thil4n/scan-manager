package com.wso2.vms.permission;

import java.util.List;

public class PermissionGroupDto {
    private String description;
    private List<PermissionItemDto> permissions;

    public PermissionGroupDto(String description, List<PermissionItemDto> permissions) {
        this.description = description;
        this.permissions = permissions;
    }

    // getters

    public String getDescription() {
        return description;
    }

    public List<PermissionItemDto> getPermissions() {
        return permissions;
    }
}