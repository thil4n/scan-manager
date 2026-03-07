package com.wso2.vms.permission;

import java.util.List;

public class PermissionSeed {

    public static List<PermissionSetSeed> PERMISSIONS = List.of(
            new PermissionSetSeed(
                    "Product Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_PRODUCT", "Can add new products"),
                            new PermissionSeedItem("VIEW_PRODUCT", "Can view products"),
                            new PermissionSeedItem("UPDATE_PRODUCT", "Can update product details"),
                            new PermissionSeedItem("DELETE_PRODUCT", "Can delete products"))),
            new PermissionSetSeed(
                    "Release Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_RELEASE", "Can create new releases"),
                            new PermissionSeedItem("VIEW_RELEASE", "Can view releases"),
                            new PermissionSeedItem("UPDATE_RELEASE", "Can update release details"),
                            new PermissionSeedItem("DELETE_RELEASE", "Can delete releases"))),
            new PermissionSetSeed(
                    "Scan Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_SCAN", "Can initiate new scans"),
                            new PermissionSeedItem("VIEW_SCAN", "Can view scan reports"),
                            new PermissionSeedItem("UPDATE_SCAN", "Can update scan status"),
                            new PermissionSeedItem("DELETE_SCAN", "Can delete scan records"))),
            new PermissionSetSeed(
                    "Vulnerability Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_VULNERABILITY", "Can add vulnerability findings"),
                            new PermissionSeedItem("VIEW_VULNERABILITY", "Can view vulnerabilities"),
                            new PermissionSeedItem("UPDATE_VULNERABILITY", "Can update vulnerability status"),
                            new PermissionSeedItem("DELETE_VULNERABILITY", "Can delete vulnerability records"))),
            new PermissionSetSeed(
                    "Admin Permissions",
                    List.of(
                            new PermissionSeedItem("MANAGE_USERS", "Can manage system users"),
                            new PermissionSeedItem("VIEW_STATS", "Can view dashboard statistics"),
                            new PermissionSeedItem("MANAGE_SETTINGS", "Can update system settings"))));
}

