package com.wso2.vms.api.scanner.client;

import com.wso2.vms.api.scanner.model.ScanFinding;
import com.wso2.vms.api.scanner.model.ScanJob;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.UUID;

public class VmsApiClientTest {
    @Test
    public void testSubmitReport() {
        VmsApiClient client = new VmsApiClient();
        client.submitReport(UUID.randomUUID(), List.of());
        // No assertion, just ensure no exceptions
    }

    @Test
    public void testUpdateScanStatus() {
        VmsApiClient client = new VmsApiClient();
        client.updateScanStatus(UUID.randomUUID(), ScanJob.Status.COMPLETED);
        // No assertion, just ensure no exceptions
    }
}
