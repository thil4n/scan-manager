package com.wso2.vms.scan;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/scans")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ScanResponseDto> createScan(@Valid @RequestBody CreateScanDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(scanService.create(dto));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ScanResponseDto>> getAllScans(
            @RequestParam(required = false) UUID releaseId) {
        if (releaseId != null) {
            return ResponseEntity.ok(scanService.findByRelease(releaseId));
        }
        return ResponseEntity.ok(scanService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ScanResponseDto> getScan(@PathVariable UUID id) {
        return ResponseEntity.ok(scanService.toDto(scanService.findOne(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ScanResponseDto> updateScan(@PathVariable UUID id,
            @RequestBody UpdateScanDto dto) {
        return ResponseEntity.ok(scanService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteScan(@PathVariable UUID id) {
        scanService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
