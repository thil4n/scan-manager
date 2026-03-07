package com.wso2.vms.permission;

import java.util.List;

public record PermissionSetSeed(String title, List<PermissionSeedItem> permissions) {
}
