package com.wso2.vms.product;

public class ProductVersionMapper {
    public static ProductVersionResponseDto toDto(ProductVersion version) {
        ProductVersionResponseDto dto = new ProductVersionResponseDto();
        dto.setId(version.getId());
        dto.setVersion(version.getVersion());
        if (version.getProduct() != null) {
            dto.setProductId(version.getProduct().getId());
        }
        dto.setCreatedAt(version.getCreatedAt());
        dto.setUpdatedAt(version.getUpdatedAt());
        return dto;
    }
}
