package com.wso2.vms.stat;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wso2.vms.product.entity.ProductRepository;
import com.wso2.vms.release.ReleaseRepository;
import com.wso2.vms.scan.ScanRepository;
import com.wso2.vms.vulnerability.Severity;
import com.wso2.vms.vulnerability.VulnerabilityRepository;
import com.wso2.vms.vulnerability.VulnerabilityStatus;

@Service
@Transactional
public class StatService {

    private final ProductRepository productRepository;
    private final ReleaseRepository releaseRepository;
    private final ScanRepository scanRepository;
    private final VulnerabilityRepository vulnerabilityRepository;

    public StatService(ProductRepository productRepository,
            ReleaseRepository releaseRepository,
            ScanRepository scanRepository,
            VulnerabilityRepository vulnerabilityRepository) {
        this.productRepository = productRepository;
        this.releaseRepository = releaseRepository;
        this.scanRepository = scanRepository;
        this.vulnerabilityRepository = vulnerabilityRepository;
    }

    public StatResponse getStatistics() {
        long totalProducts = productRepository.count();
        long totalReleases = releaseRepository.count();
        long totalScans = scanRepository.count();
        long totalVulnerabilities = vulnerabilityRepository.count();
        long criticalCount = vulnerabilityRepository.countBySeverity(Severity.CRITICAL);
        long highCount = vulnerabilityRepository.countBySeverity(Severity.HIGH);
        long mediumCount = vulnerabilityRepository.countBySeverity(Severity.MEDIUM);
        long lowCount = vulnerabilityRepository.countBySeverity(Severity.LOW);
        long openCount = vulnerabilityRepository.countByStatus(VulnerabilityStatus.OPEN);
        long resolvedCount = vulnerabilityRepository.countByStatus(VulnerabilityStatus.RESOLVED);

        return new StatResponse(totalProducts, totalReleases, totalScans,
                totalVulnerabilities, criticalCount, highCount, mediumCount,
                lowCount, openCount, resolvedCount);
    }
}
