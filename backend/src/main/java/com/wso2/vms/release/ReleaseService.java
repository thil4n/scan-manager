package com.wso2.vms.release;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.wso2.vms.product.Product;
import com.wso2.vms.product.ProductRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ReleaseService {

    private final ReleaseRepository releaseRepository;
    private final ProductRepository productRepository;

    public ReleaseService(ReleaseRepository releaseRepository, ProductRepository productRepository) {
        this.releaseRepository = releaseRepository;
        this.productRepository = productRepository;
    }

    public ReleaseResponseDto create(CreateReleaseDto dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        Release release = new Release();
        release.setProduct(product);
        release.setVersion(dto.getVersion());
        release.setReleaseDate(dto.getReleaseDate());
        release.setDescription(dto.getDescription());

        return toDto(releaseRepository.save(release));
    }

    public List<ReleaseResponseDto> findAll() {
        return releaseRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<ReleaseResponseDto> findByProduct(UUID productId) {
        return releaseRepository.findAllByProductId(productId).stream().map(this::toDto).toList();
    }

    public Release findOne(UUID id) {
        return releaseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Release with ID " + id + " not found"));
    }

    public ReleaseResponseDto update(UUID id, UpdateReleaseDto dto) {
        Release release = findOne(id);
        if (dto.getVersion() != null) release.setVersion(dto.getVersion());
        if (dto.getReleaseDate() != null) release.setReleaseDate(dto.getReleaseDate());
        if (dto.getDescription() != null) release.setDescription(dto.getDescription());
        return toDto(releaseRepository.save(release));
    }

    public void remove(UUID id) {
        releaseRepository.delete(findOne(id));
    }

    public ReleaseResponseDto toDto(Release release) {
        ReleaseResponseDto dto = new ReleaseResponseDto();
        dto.setId(release.getId());
        dto.setProductId(release.getProduct().getId());
        dto.setProductName(release.getProduct().getName());
        dto.setVersion(release.getVersion());
        dto.setReleaseDate(release.getReleaseDate());
        dto.setDescription(release.getDescription());
        dto.setCreatedAt(release.getCreatedAt());
        dto.setUpdatedAt(release.getUpdatedAt());
        return dto;
    }
}
