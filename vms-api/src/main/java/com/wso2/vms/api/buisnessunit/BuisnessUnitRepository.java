package com.wso2.vms.api.buisnessunit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BuisnessUnitRepository extends JpaRepository<BuisnessUnit, UUID> {
}
