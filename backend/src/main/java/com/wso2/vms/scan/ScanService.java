package com.wso2.vms.scan;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.wso2.vms.release.Release;
import com.wso2.vms.release.ReleaseRepository;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ScanService {

    private final ScanRepository scanRepository;
    private final ReleaseRepository releaseRepository;

    public ScanService(ScanRepository scanRepository, ReleaseRepository releaseRepository) {
        this.scanRepository = scanRepository;
        this.releaseRepository = releaseRepository;
    }

    public ScanResponseDto create(CreateScanDto dto) {
        Release release = releaseRepository.findById(dto.getReleaseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Release not found"));

        Scan scan = new Scan();
        scan.setRelease(release);
        scan.setTool(dto.getTool());
        scan.setSummary(dto.getSummary());
        scan.setStatus(ScanStatus.PENDING);

        return toDto(scanRepository.save(scan));
    }

    public List<ScanResponseDto> findAll() {
        return scanRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<ScanResponseDto> findByRelease(UUID releaseId) {
        return scanRepository.findAllByReleaseId(releaseId).stream().map(this::toDto).toList();
    }

    public Scan findOne(UUID id) {
        return scanRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Scan with ID " + id + " not found"));
    }

    public ScanResponseDto update(UUID id, UpdateScanDto dto) {
        Scan scan = findOne(id);
        if (dto.getStatus() != null) scan.setStatus(dto.getStatus());
        if (dto.getTool() != null) scan.setTool(dto.getTool());
        if (dto.getSummary() != null) scan.setSummary(dto.getSummary());
        return toDto(scanRepository.save(scan));
    }

    public void remove(UUID id) {
        scanRepository.delete(findOne(id));
    }

    public ScanResponseDto toDto(Scan scan) {
        ScanResponseDto dto = new ScanResponseDto();
        dto.setId(scan.getId());
        dto.setReleaseId(scan.getRelease().getId());
        dto.setReleaseVersion(scan.getRelease().getVersion());
        dto.setProductId(scan.getRelease().getProduct().getId());
        dto.setProductName(scan.getRelease().getProduct().getName());
        dto.setTool(scan.getTool());
        dto.setStatus(scan.getStatus());
        dto.setSummary(scan.getSummary());
        dto.setCreatedAt(scan.getCreatedAt());
        dto.setUpdatedAt(scan.getUpdatedAt());
        return dto;
    }
}
