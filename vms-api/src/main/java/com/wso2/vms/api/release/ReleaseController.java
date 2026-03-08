package com.wso2.vms.api.release;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/releases")
public class ReleaseController {

    private final ReleaseService releaseService;

    public ReleaseController(ReleaseService releaseService) {
        this.releaseService = releaseService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReleaseResponseDto> createRelease(@Valid @RequestBody CreateReleaseDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(releaseService.create(dto));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReleaseResponseDto>> getAllReleases(
            @RequestParam(required = false) UUID productId) {
        if (productId != null) {
            return ResponseEntity.ok(releaseService.findByProduct(productId));
        }
        return ResponseEntity.ok(releaseService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReleaseResponseDto> getRelease(@PathVariable UUID id) {
        return ResponseEntity.ok(releaseService.toDto(releaseService.findOne(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReleaseResponseDto> updateRelease(@PathVariable UUID id,
            @RequestBody UpdateReleaseDto dto) {
        return ResponseEntity.ok(releaseService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteRelease(@PathVariable UUID id) {
        releaseService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
