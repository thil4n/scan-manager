package com.wso2.vms.api.product.controller;

import com.wso2.vms.api.product.dto.CreateProductVersionDto;
import com.wso2.vms.api.product.dto.ProductVersionResponseDto;
import com.wso2.vms.api.product.dto.UpdateProductVersionDto;
import com.wso2.vms.api.product.mapper.ProductVersionMapper;
import com.wso2.vms.api.product.service.ProductVersionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/product-versions")
public class ProductVersionController {
    private final ProductVersionService productVersionService;

    public ProductVersionController(ProductVersionService productVersionService) {
        this.productVersionService = productVersionService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductVersionResponseDto> create(@Valid @RequestBody CreateProductVersionDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productVersionService.create(dto));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductVersionResponseDto>> getAll() {
        return ResponseEntity.ok(productVersionService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductVersionResponseDto> getOne(@PathVariable UUID id) {
        return ResponseEntity.ok(ProductVersionMapper.toDto(productVersionService.findOne(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductVersionResponseDto> update(@PathVariable UUID id,
            @RequestBody UpdateProductVersionDto dto) {
        return ResponseEntity.ok(productVersionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        productVersionService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
