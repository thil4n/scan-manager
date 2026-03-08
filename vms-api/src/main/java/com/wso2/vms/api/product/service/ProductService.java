package com.wso2.vms.api.product.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final com.wso2.vms.api.buisnessunit.BuisnessUnitRepository buisnessUnitRepository;

    public ProductService(ProductRepository productRepository, com.wso2.vms.api.buisnessunit.BuisnessUnitRepository buisnessUnitRepository) {
        this.productRepository = productRepository;
        this.buisnessUnitRepository = buisnessUnitRepository;
    }

    public ProductResponseDto create(CreateProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setDescription(dto.getDescription());
        if (dto.getBusinessUnitId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "BusinessUnitId is required");
        }
        com.wso2.vms.api.buisnessunit.BuisnessUnit bu = buisnessUnitRepository.findById(dto.getBusinessUnitId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business unit not found"));
        product.setBusinessUnit(bu);
        try {
            return ProductMapper.toDto(productRepository.save(product));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create product: " + e.getMessage());
        }
    }

    public List<ProductResponseDto> findAll() {
        return productRepository.findAll()
                .stream()
                .map(ProductMapper::toDto)
                .toList();
    }

    public Product findOne(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product with ID " + id + " not found"));
    }

    public ProductResponseDto update(UUID id, UpdateProductDto dto) {
        Product product = findOne(id);
        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getSlug() != null) product.setSlug(dto.getSlug());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getBusinessUnitId() != null) {
            com.wso2.vms.api.buisnessunit.BuisnessUnit bu = buisnessUnitRepository.findById(dto.getBusinessUnitId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Business unit not found"));
            product.setBusinessUnit(bu);
        }
        try {
            return ProductMapper.toDto(productRepository.save(product));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update product: " + e.getMessage());
        }
    }

    public void remove(UUID id) {
        productRepository.delete(findOne(id));
    }
}
