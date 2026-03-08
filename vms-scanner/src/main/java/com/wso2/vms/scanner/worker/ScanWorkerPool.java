package com.wso2.vms.api.scanner.worker;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.queue.ScanJobQueue;
import com.wso2.vms.api.scanner.service.ScanJobService;
import com.wso2.vms.api.scanner.scanner.ScannerExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Component
public class ScanWorkerPool {
    private static final Logger logger = LoggerFactory.getLogger(ScanWorkerPool.class);

    @Value("${scanner.worker.pool.size:4}")
    private int poolSize;

    private final ScanJobQueue scanJobQueue;
    private final ScanJobService scanJobService;
    private final ScannerExecutor scannerExecutor;
    private ExecutorService executorService;

    public ScanWorkerPool(ScanJobQueue scanJobQueue, ScanJobService scanJobService, ScannerExecutor scannerExecutor) {
        this.scanJobQueue = scanJobQueue;
        this.scanJobService = scanJobService;
        this.scannerExecutor = scannerExecutor;
    }

    @PostConstruct
    public void startWorkers() {
        executorService = Executors.newFixedThreadPool(poolSize);
        logger.info("Starting {} scan workers", poolSize);
        for (int i = 0; i < poolSize; i++) {
            executorService.submit(this::workerLoop);
        }
    }

    private void workerLoop() {
        while (true) {
            try {
                ScanJob job = scanJobQueue.take();
                logger.info("Worker picked up job {}", job.getScanId());
                scannerExecutor.executeScan(job);
            } catch (InterruptedException e) {
                logger.error("Worker interrupted", e);
                Thread.currentThread().interrupt();
                break;
            } catch (Exception e) {
                logger.error("Worker error", e);
            }
        }
    }
}
