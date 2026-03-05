import type { Scan, ScanStatus } from './scan';

export interface Release {
  id: string;
  productName: string;
  version: string;
  submittedBy: string;
  createdAt: string;
  overallStatus: ScanStatus;
  branch?: string;
  jiraTicket?: string;
  scans: Scan[];
}

export interface CreateReleasePayload {
  productName: string;
  version: string;
  branch?: string;
  jiraTicket?: string;
  artifactType: 'file' | 'docker';
  artifactName?: string;
  dockerImage?: string;
  dockerTag?: string;
  scanTypes: ('VERACODE' | 'FOSSA' | 'JFROG')[];
}
