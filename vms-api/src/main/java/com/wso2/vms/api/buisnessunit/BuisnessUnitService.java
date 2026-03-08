package com.wso2.vms.api.buisnessunit;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class BuisnessUnitService {

    private final BuisnessUnitRepository buisnessUnitRepository;

    public BuisnessUnitService(BuisnessUnitRepository buisnessUnitRepository) {
        this.buisnessUnitRepository = buisnessUnitRepository;
    }

    public BuisnessUnit create(CreateBuisnessUnitDto dto) {
        BuisnessUnit unit = new BuisnessUnit();
        unit.setName(dto.getName());
        return buisnessUnitRepository.save(unit);
    }

    public List<BuisnessUnit> findAll() {
        return buisnessUnitRepository.findAll();
    }

    public BuisnessUnit findOne(UUID id) {
        return buisnessUnitRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Business unit with ID " + id + " not found"));
    }

    public BuisnessUnit update(UUID id, UpdateBuisnessUnitDto dto) {
        BuisnessUnit unit = findOne(id);
        if (dto.getName() != null) unit.setName(dto.getName());
        return buisnessUnitRepository.save(unit);
    }

    public void remove(UUID id) {
        buisnessUnitRepository.delete(findOne(id));
    }
}
