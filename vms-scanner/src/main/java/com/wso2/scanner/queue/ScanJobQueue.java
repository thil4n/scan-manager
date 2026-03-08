package com.wso2.vms.api.scanner.queue;

import com.wso2.vms.api.scanner.model.ScanJob;
import org.springframework.stereotype.Component;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

@Component
public class ScanJobQueue {
    private final BlockingQueue<ScanJob> queue = new LinkedBlockingQueue<>();

    public void enqueue(ScanJob job) {
        queue.offer(job);
    }

    public ScanJob take() throws InterruptedException {
        return queue.take();
    }
}
