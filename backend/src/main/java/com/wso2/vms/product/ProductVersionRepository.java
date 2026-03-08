package com.wso2.vms.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductVersionRepository extends JpaRepository<ProductVersion, UUID> {
}
