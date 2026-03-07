package com.wso2.vms.buisnessunit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BuisnessUnitRepository extends JpaRepository<BuisnessUnit, UUID> {
}
