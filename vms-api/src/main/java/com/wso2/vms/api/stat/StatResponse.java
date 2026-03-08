package com.wso2.vms.api.stat;

public class StatResponse {

    private long totalProducts;
    private long totalReleases;
    private long totalScans;
    private long totalVulnerabilities;
    private long criticalCount;
    private long highCount;
    private long mediumCount;
    private long lowCount;
    private long openCount;
    private long resolvedCount;

    public StatResponse(long totalProducts, long totalReleases, long totalScans,
            long totalVulnerabilities, long criticalCount, long highCount,
            long mediumCount, long lowCount, long openCount, long resolvedCount) {
        this.totalProducts = totalProducts;
        this.totalReleases = totalReleases;
        this.totalScans = totalScans;
        this.totalVulnerabilities = totalVulnerabilities;
        this.criticalCount = criticalCount;
        this.highCount = highCount;
        this.mediumCount = mediumCount;
        this.lowCount = lowCount;
        this.openCount = openCount;
        this.resolvedCount = resolvedCount;
    }

    public long getTotalProducts() { return totalProducts; }
    public long getTotalReleases() { return totalReleases; }
    public long getTotalScans() { return totalScans; }
    public long getTotalVulnerabilities() { return totalVulnerabilities; }
    public long getCriticalCount() { return criticalCount; }
    public long getHighCount() { return highCount; }
    public long getMediumCount() { return mediumCount; }
    public long getLowCount() { return lowCount; }
    public long getOpenCount() { return openCount; }
    public long getResolvedCount() { return resolvedCount; }
}
