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
                    "Order Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_ORDER", "Can create new orders"),
                            new PermissionSeedItem("VIEW_ORDER", "Can view orders"),
                            new PermissionSeedItem("UPDATE_ORDER", "Can update existing orders"),
                            new PermissionSeedItem("DELETE_ORDER", "Can delete orders"))),
            new PermissionSetSeed(
                    "Discount Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_DISCOUNT", "Can add new discounts"),
                            new PermissionSeedItem("VIEW_DISCOUNT", "Can view discounts"),
                            new PermissionSeedItem("UPDATE_DISCOUNT", "Can update discount details"),
                            new PermissionSeedItem("DELETE_DISCOUNT", "Can delete discounts"))),
            new PermissionSetSeed(
                    "Operator Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_OPERATOR", "Can add new operators"),
                            new PermissionSeedItem("VIEW_OPERATOR", "Can view operators"),
                            new PermissionSeedItem("UPDATE_OPERATOR", "Can update operator details"),
                            new PermissionSeedItem("DELETE_OPERATOR", "Can delete operators"))),
            new PermissionSetSeed(
                    "Customer Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_CUSTOMER", "Can add new customers"),
                            new PermissionSeedItem("VIEW_CUSTOMER", "Can view customers"),
                            new PermissionSeedItem("UPDATE_CUSTOMER", "Can update customer details"),
                            new PermissionSeedItem("DELETE_CUSTOMER", "Can delete customers"))),
            new PermissionSetSeed(
                    "Supplier Permissions",
                    List.of(
                            new PermissionSeedItem("CREATE_SUPPLIER", "Can add new suppliers"),
                            new PermissionSeedItem("VIEW_SUPPLIER", "Can view suppliers"),
                            new PermissionSeedItem("UPDATE_SUPPLIER", "Can update supplier details"),
                            new PermissionSeedItem("DELETE_SUPPLIER", "Can delete suppliers"))),
            new PermissionSetSeed(
                    "Stock Permissions",
                    List.of(
                            new PermissionSeedItem("MANAGE_STOCK", "Can update stock levels"),
                            new PermissionSeedItem("VIEW_STOCK", "Can view stock information"))),
            new PermissionSetSeed(
                    "Other Permissions",
                    List.of(
                            new PermissionSeedItem("MANAGE_SETTINGS", "Can update POS system settings"))));
}
