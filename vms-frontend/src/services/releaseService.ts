import type { Release, CreateReleasePayload } from '@/types/release';
import type { Scan, Finding } from '@/types/scan';
import { generateId } from '@/utils/format';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const mockFindings: Finding[] = [
  {
    id: 'f1',
    title: 'SQL Injection in UserController',
    severity: 'CRITICAL',
    description: 'Unsanitized input passed directly to SQL query in login handler.',
    file: 'src/controllers/UserController.java',
  },
  {
    id: 'f2',
    title: 'Cross-Site Scripting (XSS)',
    severity: 'CRITICAL',
    description: 'Reflected XSS vulnerability in search endpoint.',
    file: 'src/controllers/SearchController.java',
  },
  {
    id: 'f3',
    title: 'Hardcoded Secret in Config',
    severity: 'HIGH',
    description: 'AWS secret key found hardcoded in application.yml.',
    file: 'src/main/resources/application.yml',
  },
  {
    id: 'f4',
    title: 'Insecure Deserialization',
    severity: 'HIGH',
    description: 'ObjectInputStream used without type validation.',
    file: 'src/utils/Serializer.java',
  },
  {
    id: 'f5',
    title: 'Outdated TLS Configuration',
    severity: 'MEDIUM',
    description: 'Server allows TLS 1.0 connections.',
  },
  {
    id: 'f6',
    title: 'Missing CSRF Token',
    severity: 'MEDIUM',
    description: 'Form submission endpoint missing CSRF protection.',
    file: 'src/controllers/FormController.java',
  },
  {
    id: 'f7',
    title: 'Verbose Error Messages',
    severity: 'LOW',
    description: 'Stack traces exposed in production error responses.',
  },
];

const mockScansForRelease1: Scan[] = [
  {
    id: 's1',
    type: 'VERACODE',
    status: 'FAIL',
    summary: { critical: 2, high: 1, medium: 3, low: 2 },
    findings: mockFindings.slice(0, 4),
  },
  {
    id: 's2',
    type: 'FOSSA',
    status: 'FAIL',
    summary: { critical: 0, high: 1, medium: 1, low: 0 },
    findings: [
      {
        id: 'fl1',
        title: 'GPL-3.0 License Violation',
        severity: 'HIGH',
        description: 'Dependency log4j-extra uses GPL-3.0 which is not permitted.',
      },
      {
        id: 'fl2',
        title: 'Outdated Dependency',
        severity: 'MEDIUM',
        description: 'commons-io 2.6 has known CVE-2021-29425.',
      },
    ],
  },
  {
    id: 's3',
    type: 'JFROG',
    status: 'PASS',
    summary: { critical: 0, high: 0, medium: 1, low: 3 },
    findings: [
      {
        id: 'jf1',
        title: 'Medium Severity CVE in base image',
        severity: 'MEDIUM',
        description: 'CVE-2024-1234 found in base image layer.',
      },
      {
        id: 'jf2',
        title: 'Info: Image uses non-root user',
        severity: 'LOW',
        description: 'Container image runs as non-root — informational.',
      },
    ],
  },
];

const mockScansForRelease2: Scan[] = [
  {
    id: 's4',
    type: 'VERACODE',
    status: 'PASS',
    summary: { critical: 0, high: 0, medium: 1, low: 2 },
    findings: [mockFindings[4], mockFindings[6]],
  },
  {
    id: 's5',
    type: 'FOSSA',
    status: 'PASS',
    summary: { critical: 0, high: 0, medium: 0, low: 1 },
    findings: [],
  },
  {
    id: 's6',
    type: 'JFROG',
    status: 'PASS',
    summary: { critical: 0, high: 0, medium: 0, low: 0 },
    findings: [],
  },
];

const mockScansRunning: Scan[] = [
  {
    id: 's7',
    type: 'VERACODE',
    status: 'RUNNING',
    summary: { critical: 0, high: 0, medium: 0, low: 0 },
    findings: [],
  },
  {
    id: 's8',
    type: 'FOSSA',
    status: 'QUEUED',
    summary: { critical: 0, high: 0, medium: 0, low: 0 },
    findings: [],
  },
  {
    id: 's9',
    type: 'JFROG',
    status: 'QUEUED',
    summary: { critical: 0, high: 0, medium: 0, low: 0 },
    findings: [],
  },
];

const mockReleases: Release[] = [
  {
    id: 'rel-001',
    productName: 'Identity Server',
    version: '7.1.0',
    submittedBy: 'alice@acme.io',
    createdAt: '2026-02-28T10:30:00Z',
    overallStatus: 'FAIL',
    branch: 'release/7.1.0',
    jiraTicket: 'IS-4521',
    scans: mockScansForRelease1,
  },
  {
    id: 'rel-002',
    productName: 'API Manager',
    version: '4.3.0',
    submittedBy: 'bob@acme.io',
    createdAt: '2026-03-01T14:00:00Z',
    overallStatus: 'PASS',
    branch: 'main',
    scans: mockScansForRelease2,
  },
  {
    id: 'rel-003',
    productName: 'Choreo Connect',
    version: '1.2.0-beta',
    submittedBy: 'carol@acme.io',
    createdAt: '2026-03-04T09:15:00Z',
    overallStatus: 'RUNNING',
    scans: mockScansRunning,
  },
  {
    id: 'rel-004',
    productName: 'Asgardeo',
    version: '2.0.1',
    submittedBy: 'dave@acme.io',
    createdAt: '2026-02-20T16:45:00Z',
    overallStatus: 'PASS',
    scans: mockScansForRelease2,
  },
  {
    id: 'rel-005',
    productName: 'Ballerina Runtime',
    version: '2201.9.0',
    submittedBy: 'eve@acme.io',
    createdAt: '2026-02-15T11:00:00Z',
    overallStatus: 'FAIL',
    jiraTicket: 'BAL-8812',
    scans: mockScansForRelease1,
  },
];

// ---------------------------------------------------------------------------
// Simulated delay
// ---------------------------------------------------------------------------

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function fetchReleases(): Promise<Release[]> {
  await delay(600);
  return [...mockReleases];
}

export async function fetchReleaseById(id: string): Promise<Release> {
  await delay(400);
  const release = mockReleases.find((r) => r.id === id);
  if (!release) {
    throw new Error(`Release ${id} not found`);
  }
  return { ...release };
}

export async function createRelease(payload: CreateReleasePayload): Promise<Release> {
  await delay(500);
  const newRelease: Release = {
    id: `rel-${generateId()}`,
    productName: payload.productName,
    version: payload.version,
    submittedBy: 'current-user@acme.io',
    createdAt: new Date().toISOString(),
    overallStatus: 'QUEUED',
    branch: payload.branch,
    jiraTicket: payload.jiraTicket,
    scans: payload.scanTypes.map((type) => ({
      id: generateId(),
      type,
      status: 'QUEUED' as const,
      summary: { critical: 0, high: 0, medium: 0, low: 0 },
      findings: [],
    })),
  };
  mockReleases.unshift(newRelease);
  return newRelease;
}
