package com.wso2.vms.api.product.controller;
import com.wso2.vms.api.product.service.ProductService;
import com.wso2.vms.api.product.dto.ProductResponseDto;
import com.wso2.vms.api.product.dto.CreateProductDto;
import com.wso2.vms.api.product.dto.UpdateProductDto;
import com.wso2.vms.api.product.mapper.ProductMapper;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody CreateProductDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(dto));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProductResponseDto>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductResponseDto> getProduct(@PathVariable UUID id) {
        return ResponseEntity.ok(ProductMapper.toDto(productService.findOne(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProductResponseDto> updateProduct(@PathVariable UUID id,
            @Valid @RequestBody UpdateProductDto dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
