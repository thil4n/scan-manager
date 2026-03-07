package com.wso2.vms.release;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReleaseRepository extends JpaRepository<Release, UUID> {
    List<Release> findAllByProductId(UUID productId);
}
