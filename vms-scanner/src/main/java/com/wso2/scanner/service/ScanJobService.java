package com.wso2.vms.api.scanner.service;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.queue.ScanJobQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ScanJobService {
    private static final Logger logger = LoggerFactory.getLogger(ScanJobService.class);
    private final Map<UUID, ScanJob> jobStore = new ConcurrentHashMap<>();
    private final ScanJobQueue scanJobQueue;

    public ScanJobService(ScanJobQueue scanJobQueue) {
        this.scanJobQueue = scanJobQueue;
    }

    public void createScanJob(ScanJob job) {
        job.setScanId(job.getScanId() != null ? job.getScanId() : UUID.randomUUID());
        job.setStatus(ScanJob.Status.QUEUED);
        job.setCreatedAt(LocalDateTime.now());
        job.setUpdatedAt(LocalDateTime.now());
        jobStore.put(job.getScanId(), job);
        scanJobQueue.enqueue(job);
        logger.info("Scan job {} enqueued", job.getScanId());
    }

    public ScanJob getScanJob(UUID scanId) {
        return jobStore.get(scanId);
    }

    public void updateScanJob(ScanJob job) {
        job.setUpdatedAt(LocalDateTime.now());
        jobStore.put(job.getScanId(), job);
    }
}
