package com.wso2.vms.api.scanner.service;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.queue.ScanJobQueue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class ScanJobServiceTest {
    private ScanJobService scanJobService;
    private ScanJobQueue scanJobQueue;

    @BeforeEach
    public void setup() {
        scanJobQueue = Mockito.mock(ScanJobQueue.class);
        scanJobService = new ScanJobService(scanJobQueue);
    }

    @Test
    public void testCreateAndGetScanJob() {
        ScanJob job = new ScanJob();
        job.setScanId(UUID.randomUUID());
        job.setProduct("APIM");
        job.setVersion("4.6.0");
        job.setScanType(ScanJob.ScanType.SAST);
        job.setTool("SEMGREP");
        scanJobService.createScanJob(job);
        ScanJob fetched = scanJobService.getScanJob(job.getScanId());
        assertNotNull(fetched);
        assertEquals("APIM", fetched.getProduct());
    }
}
