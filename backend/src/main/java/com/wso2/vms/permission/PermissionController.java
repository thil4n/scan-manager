package com.wso2.vms.permission;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/permission")
public class PermissionController {

    private final PermissionService permissionService;

    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public List<PermissionGroupDto> getAll() {
        return permissionService.getAll();
    }

    @GetMapping("/seed")
    public String seed() {
        permissionService.seed();
        return "Permissions seeded successfully";
    }
}
