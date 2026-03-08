package com.wso2.vms.product;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProductVersionService {
    private final ProductVersionRepository productVersionRepository;
    private final ProductRepository productRepository;

    public ProductVersionService(ProductVersionRepository productVersionRepository, ProductRepository productRepository) {
        this.productVersionRepository = productVersionRepository;
        this.productRepository = productRepository;
    }

    public ProductVersionResponseDto create(CreateProductVersionDto dto) {
        ProductVersion version = new ProductVersion();
        version.setVersion(dto.getVersion());
        if (dto.getProductId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ProductId is required");
        }
        Product product = productRepository.findById(dto.getProductId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        version.setProduct(product);
        try {
            return ProductVersionMapper.toDto(productVersionRepository.save(version));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create product version: " + e.getMessage());
        }
    }

    public List<ProductVersionResponseDto> findAll() {
        return productVersionRepository.findAll()
                .stream()
                .map(ProductVersionMapper::toDto)
                .toList();
    }

    public ProductVersion findOne(UUID id) {
        return productVersionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ProductVersion with ID " + id + " not found"));
    }

    public ProductVersionResponseDto update(UUID id, UpdateProductVersionDto dto) {
        ProductVersion version = findOne(id);
        if (dto.getVersion() != null) version.setVersion(dto.getVersion());
        try {
            return ProductVersionMapper.toDto(productVersionRepository.save(version));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update product version: " + e.getMessage());
        }
    }

    public void remove(UUID id) {
        productVersionRepository.delete(findOne(id));
    }
}
