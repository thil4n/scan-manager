package com.wso2.vms.api.scanner.worker;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.queue.ScanJobQueue;
import com.wso2.vms.api.scanner.scanner.ScannerExecutor;
import com.wso2.vms.api.scanner.service.ScanJobService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class ScanWorkerPoolTest {
    @Test
    public void testWorkerPoolStart() {
        ScanJobQueue queue = Mockito.mock(ScanJobQueue.class);
        ScanJobService service = Mockito.mock(ScanJobService.class);
        ScannerExecutor executor = Mockito.mock(ScannerExecutor.class);
        ScanWorkerPool pool = new ScanWorkerPool(queue, service, executor);
        pool.startWorkers();
        // No assertion, just ensure no exceptions
    }
}
