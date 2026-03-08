package com.wso2.vms.api.scanner.client;

import com.wso2.vms.api.scanner.model.ScanFinding;
import com.wso2.vms.api.scanner.model.ScanJob;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.UUID;

@Component
public class VmsApiClient {
    private static final Logger logger = LoggerFactory.getLogger(VmsApiClient.class);
    private final WebClient webClient;

    public VmsApiClient() {
        this.webClient = WebClient.builder().baseUrl("http://localhost:8080/vms/api").build();
    }

    public void submitReport(UUID scanId, List<ScanFinding> findings) {
        logger.info("Submitting report for scan {} to VMS", scanId);
        webClient.post()
                .uri("/reports")
                .bodyValue(findings)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void updateScanStatus(UUID scanId, ScanJob.Status status) {
        logger.info("Updating scan status for {} to {} in VMS", scanId, status);
        webClient.post()
                .uri("/scans/{scanId}/status", scanId)
                .bodyValue(status)
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
