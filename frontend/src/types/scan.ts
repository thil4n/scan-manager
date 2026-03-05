export type ScanType = 'VERACODE' | 'FOSSA' | 'JFROG';

export type ScanStatus = 'PASS' | 'FAIL' | 'RUNNING' | 'QUEUED';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ScanSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface Finding {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  file?: string;
}

export interface Scan {
  id: string;
  type: ScanType;
  status: ScanStatus;
  summary: ScanSummary;
  findings: Finding[];
}
