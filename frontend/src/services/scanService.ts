import type { Scan } from '@/types/scan';

// This service will contain scan-specific API calls.
// For now the scan data is embedded within Release objects via releaseService.

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retrigger a single scan (mock).
 */
export async function retriggerScan(scanId: string): Promise<Scan> {
  await delay(400);
  return {
    id: scanId,
    type: 'VERACODE',
    status: 'QUEUED',
    summary: { critical: 0, high: 0, medium: 0, low: 0 },
    findings: [],
  };
}
