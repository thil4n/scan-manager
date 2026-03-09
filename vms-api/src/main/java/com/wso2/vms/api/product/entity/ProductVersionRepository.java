package com.wso2.vms.api.product.entity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductVersionRepository extends JpaRepository<ProductVersion, UUID> {
}
