package com.wso2.vms.buisnessunit;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/business-units")
public class BuisnessUnitController {

    private final BuisnessUnitService buisnessUnitService;

    public BuisnessUnitController(BuisnessUnitService buisnessUnitService) {
        this.buisnessUnitService = buisnessUnitService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BuisnessUnit> create(@Valid @RequestBody CreateBuisnessUnitDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(buisnessUnitService.create(dto));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BuisnessUnit>> getAll() {
        return ResponseEntity.ok(buisnessUnitService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BuisnessUnit> getOne(@PathVariable UUID id) {
        return ResponseEntity.ok(buisnessUnitService.findOne(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<BuisnessUnit> update(@PathVariable UUID id,
            @RequestBody UpdateBuisnessUnitDto dto) {
        return ResponseEntity.ok(buisnessUnitService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        buisnessUnitService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
