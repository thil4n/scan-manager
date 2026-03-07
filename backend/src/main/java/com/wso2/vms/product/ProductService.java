package com.wso2.vms.product;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public ProductResponseDto create(CreateProductDto dto) {
        Product product = new Product();
        product.setName(dto.getName());
        product.setVendor(dto.getVendor());
        product.setDescription(dto.getDescription());
        return ProductMapper.toDto(productRepository.save(product));
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
        if (dto.getVendor() != null) product.setVendor(dto.getVendor());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        return ProductMapper.toDto(productRepository.save(product));
    }

    public void remove(UUID id) {
        productRepository.delete(findOne(id));
    }
}
