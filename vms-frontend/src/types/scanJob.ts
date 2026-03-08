export type ScanTool = 'VERACODE' | 'FOSSA' | 'JFROG' | 'TRIVY' | 'SNYK';
export type ScanType = 'SAST' | 'DAST' | 'SCA' | 'CONTAINER' | 'SECRET';
export type ScanJobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface ScanJobSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
}

export interface ScanJob {
  id: string;
  productId: string;
  productName: string;
  versionId: string;
  versionName: string;
  tool: ScanTool;
  scanType: ScanType;
  status: ScanJobStatus;
  submittedBy: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  summary?: ScanJobSummary;
  errorMessage?: string;
  artifactUrl?: string;
}

export interface CreateScanJobPayload {
  productId: string;
  versionId: string;
  tool: ScanTool;
  scanType: ScanType;
  artifactUrl?: string;
  dockerImage?: string;
  dockerTag?: string;
}
