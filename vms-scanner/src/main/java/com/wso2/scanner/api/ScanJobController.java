package com.wso2.vms.api.scanner.api;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.service.ScanJobService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/scanner/jobs")
public class ScanJobController {
    private static final Logger logger = LoggerFactory.getLogger(ScanJobController.class);

    @Autowired
    private ScanJobService scanJobService;

    @PostMapping
    public ResponseEntity<?> createScanJob(@RequestBody ScanJob job) {
        logger.info("Received scan job creation request: {}", job);
        scanJobService.createScanJob(job);
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{scanId}")
    public ResponseEntity<?> getScanJobStatus(@PathVariable UUID scanId) {
        ScanJob job = scanJobService.getScanJob(scanId);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(job);
    }
}
