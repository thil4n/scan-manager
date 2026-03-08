package com.wso2.vms.product.mapper;

public class ProductMapper {

    public static ProductResponseDto toDto(Product product) {
        ProductResponseDto dto = new ProductResponseDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        if (product.getBusinessUnit() != null) {
            dto.setBusinessUnitId(product.getBusinessUnit().getId());
        }
        return dto;
    }
}
