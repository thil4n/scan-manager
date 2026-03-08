export type ReportSource = 'SCAN' | 'MANUAL' | 'CSV' | 'EXCEL';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
export type ReportStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'WONT_FIX' | 'FALSE_POSITIVE';

export interface Vulnerability {
  id: string;
  reportId: string;
  title: string;
  description: string;
  severity: Severity;
  cvssScore?: number;
  cveId?: string;
  affectedComponent?: string;
  file?: string;
  line?: number;
  status: ReportStatus;
  remediation?: string;
}

export interface Report {
  id: string;
  productId: string;
  productName: string;
  versionId: string;
  versionName: string;
  scanJobId?: string;
  source: ReportSource;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  vulnerabilities: Vulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
    total: number;
  };
}

export interface ReportFilter {
  productId?: string;
  versionId?: string;
  severity?: Severity;
  source?: ReportSource;
  status?: ReportStatus;
}

export interface CreateManualReportPayload {
  productId: string;
  versionId: string;
  vulnerabilities: Omit<Vulnerability, 'id' | 'reportId'>[];
}
