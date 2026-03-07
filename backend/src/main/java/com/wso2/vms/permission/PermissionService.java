package com.wso2.vms.permission;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final PermissionSetRepository permissionSetRepository;

    public PermissionService(PermissionRepository permissionRepository,
            PermissionSetRepository permissionSetRepository) {
        this.permissionRepository = permissionRepository;
        this.permissionSetRepository = permissionSetRepository;
    }

    /**
     * Equivalent of your raw SQL grouped query
     */
    public List<PermissionGroupDto> getAll() {
        List<PermissionSet> sets = permissionSetRepository.findAll();

        List<PermissionGroupDto> response = new ArrayList<>();

        for (PermissionSet set : sets) {
            List<PermissionItemDto> items = set.getPermissions().stream()
                    .map(p -> new PermissionItemDto(p.getId(), p.getDescription()))
                    .toList();

            response.add(new PermissionGroupDto(set.getDescription(), items));
        }

        return response;
    }

    @Transactional
    public void seed() {
        for (PermissionSetSeed setSeed : PermissionSeed.PERMISSIONS) {

            PermissionSet permissionSet = new PermissionSet();
            permissionSet.setDescription(setSeed.title());
            permissionSetRepository.save(permissionSet);

            for (PermissionSeedItem perm : setSeed.permissions()) {
                Permission permission = new Permission();
                permission.setName(perm.name());
                permission.setDescription(perm.description());
                permission.setPermissionSet(permissionSet);

                permissionRepository.save(permission);
            }
        }
    }
}
