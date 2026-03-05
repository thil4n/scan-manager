import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StatusBadge from '@/components/badges/StatusBadge';
import SeverityBadge from '@/components/badges/SeverityBadge';
import ScanCard, { getScanLabel } from '@/components/scan/ScanCard';
import ScanSummaryComponent from '@/components/scan/ScanSummary';
import ScanTimeline from '@/components/scan/ScanTimeline';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import { useRelease } from '@/hooks/useRelease';
import { formatDateTime } from '@/utils/format';
import type { Scan, Finding } from '@/types/scan';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export default function ReleaseDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: release, isLoading, isError } = useRelease(id ?? '');
  const [expandedScan, setExpandedScan] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageContainer title="Release Detail">
        <div className="flex items-center justify-center py-20">
          <ArrowPathIcon className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">Loading release…</span>
        </div>
      </PageContainer>
    );
  }

  if (isError || !release) {
    return (
      <PageContainer title="Release Detail">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm text-gray-400">Failed to load release.</p>
        </div>
      </PageContainer>
    );
  }

  const isBlocked = release.overallStatus === 'FAIL';
  const isApproved = release.overallStatus === 'PASS';
  const blockReasons = getBlockReasons(release.scans);

  const findingColumns: Column<Finding>[] = [
    {
      key: 'severity',
      header: 'Severity',
      render: (f) => <SeverityBadge severity={f.severity} />,
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (f) => <span className="font-medium text-white">{f.title}</span>,
    },
    {
      key: 'description',
      header: 'Description',
      render: (f) => <span className="text-gray-400">{f.description}</span>,
    },
    {
      key: 'file',
      header: 'File',
      render: (f) => (
        <span className="font-mono text-xs text-gray-500">{f.file ?? '—'}</span>
      ),
    },
  ];

  return (
    <PageContainer
      title={`${release.productName} v${release.version}`}
      description={`Submitted by ${release.submittedBy} on ${formatDateTime(release.createdAt)}`}
    >
      {/* Security Gate Banner */}
      {isBlocked && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-5">
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="text-lg font-bold text-red-500">RELEASE BLOCKED</h3>
              <p className="mt-1 text-sm text-red-400">
                This release cannot proceed due to security policy violations.
              </p>
            </div>
          </div>
          {blockReasons.length > 0 && (
            <ul className="mt-3 space-y-1 pl-11 text-sm text-red-400">
              {blockReasons.map((reason, i) => (
                <li key={i}>• {reason}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isApproved && (
        <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 p-5">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-bold text-green-500">RELEASE APPROVED</h3>
              <p className="mt-1 text-sm text-green-400">
                All security scans passed. This release is cleared for deployment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Release Header Card */}
      <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-white">{release.productName}</h2>
              <StatusBadge status={release.overallStatus} />
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400">
              <span>Version: <span className="text-gray-300">{release.version}</span></span>
              {release.branch && (
                <span>Branch: <span className="text-gray-300">{release.branch}</span></span>
              )}
              {release.jiraTicket && (
                <span>Jira: <span className="text-blue-400">{release.jiraTicket}</span></span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scan Summary */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Aggregate Findings
        </h3>
        <ScanSummaryComponent scans={release.scans} />
      </div>

      {/* Scan Cards */}
      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
          Scan Results
        </h3>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {release.scans.map((scan) => (
            <div key={scan.id}>
              <ScanCard
                scanName={getScanLabel(scan.type)}
                status={scan.status}
                summary={scan.summary}
                onViewDetails={() =>
                  setExpandedScan(expandedScan === scan.id ? null : scan.id)
                }
              />
              {/* Scan Timeline */}
              <div className="mt-3 rounded-lg border border-gray-800 bg-gray-900 p-3">
                <ScanTimeline status={scan.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Findings */}
      {expandedScan && (
        <div className="mb-6">
          {release.scans
            .filter((s) => s.id === expandedScan)
            .map((scan) => (
              <div key={scan.id}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  {getScanLabel(scan.type)} — Detailed Findings
                </h3>
                {scan.findings.length > 0 ? (
                  <DataTable
                    columns={findingColumns}
                    data={scan.findings}
                    keyExtractor={(f) => f.id}
                  />
                ) : (
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-6 text-center text-sm text-gray-500">
                    No findings recorded for this scan.
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </PageContainer>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getBlockReasons(scans: Scan[]): string[] {
  const reasons: string[] = [];
  for (const scan of scans) {
    if (scan.status !== 'FAIL') continue;
    const label = getScanLabel(scan.type);
    if (scan.summary.critical > 0) {
      reasons.push(`${scan.summary.critical} Critical finding(s) in ${label}`);
    }
    if (scan.summary.high > 0) {
      reasons.push(`${scan.summary.high} High finding(s) in ${label}`);
    }
    // Check for license violations in FOSSA
    if (scan.type === 'FOSSA') {
      const licenseViolations = scan.findings.filter(
        (f) => f.title.toLowerCase().includes('license'),
      );
      if (licenseViolations.length > 0) {
        reasons.push(`${licenseViolations.length} License violation(s) in ${label}`);
      }
    }
  }
  return reasons;
}
