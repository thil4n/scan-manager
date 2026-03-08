import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FunnelIcon,
  ArrowUpTrayIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/modals/Modal';
import ReportUploadForm from '@/components/forms/ReportUploadForm';
import { useReports, useUploadReport } from '@/hooks/useReports';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/format';
import type { Report, Severity, ReportSource } from '@/types/report';

export default function Reports() {
  const [severityFilter, setSeverityFilter] = useState<Severity | ''>('');
  const [sourceFilter, setSourceFilter] = useState<ReportSource | ''>('');
  const { data: reports, isLoading, isError } = useReports(
    severityFilter || sourceFilter
      ? { ...(severityFilter ? { severity: severityFilter } : {}), ...(sourceFilter ? { source: sourceFilter } : {}) }
      : undefined,
  );
  const uploadReport = useUploadReport();
  const { toast } = useToast();
  const { isAdmin, isCustomerSuccess } = useAuth();

  const [showUpload, setShowUpload] = useState(false);

  const canUpload = isAdmin || isCustomerSuccess;

  const handleUpload = async (productId: string, versionId: string, file: File) => {
    try {
      await uploadReport.mutateAsync({ productId, versionId, file });
      toast({ variant: 'success', title: 'Report uploaded successfully' });
      setShowUpload(false);
    } catch {
      toast({ variant: 'error', title: 'Failed to upload report' });
    }
  };

  const columns: Column<Report>[] = [
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      render: (r) => <span className="font-medium text-white">{r.productName}</span>,
    },
    { key: 'version', header: 'Version', render: (r) => <span className="font-mono text-xs">{r.versionName}</span> },
    {
      key: 'source',
      header: 'Source',
      render: (r) => (
        <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
          {r.source}
        </span>
      ),
    },
    {
      key: 'summary',
      header: 'Vulnerabilities',
      render: (r) => (
        <div className="flex gap-2 text-xs">
          <span className="text-red-400">C:{r.summary.critical}</span>
          <span className="text-orange-400">H:{r.summary.high}</span>
          <span className="text-yellow-400">M:{r.summary.medium}</span>
          <span className="text-blue-400">L:{r.summary.low}</span>
          <span className="text-gray-500">I:{r.summary.info}</span>
        </div>
      ),
    },
    { key: 'submittedBy', header: 'Submitted By', render: (r) => r.submittedBy },
    { key: 'createdAt', header: 'Date', sortable: true, render: (r) => formatDate(r.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <Link to={`/reports/${r.id}`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
          <EyeIcon className="h-3.5 w-3.5" />
          View
        </Link>
      ),
    },
  ];

  return (
    <PageContainer
      title="Reports"
      description="Vulnerability reports from scans and manual submissions"
      action={
        canUpload && (
          <Button
            leftIcon={<ArrowUpTrayIcon className="h-4 w-4" />}
            onClick={() => setShowUpload(true)}
          >
            Upload Report
          </Button>
        )
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FunnelIcon className="h-3.5 w-3.5" />
          Filters:
        </div>
        <div className="flex gap-1.5">
          {(['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                severityFilter === s
                  ? 'border-blue-600 bg-blue-600/20 text-blue-300'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              {s === '' ? 'All Severities' : s}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {(['', 'SCAN', 'MANUAL', 'CSV', 'EXCEL'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSourceFilter(s)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                sourceFilter === s
                  ? 'border-purple-600 bg-purple-600/20 text-purple-300'
                  : 'border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              {s === '' ? 'All Sources' : s}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="py-12 text-center text-gray-500">Loading reports…</div>}
      {isError && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          Failed to load reports.
        </div>
      )}
      {!isLoading && !isError && (
        <DataTable data={reports ?? []} columns={columns} emptyMessage="No reports found." />
      )}

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Vulnerability Report" maxWidth="lg">
        <ReportUploadForm
          onSubmit={handleUpload}
          onCancel={() => setShowUpload(false)}
          loading={uploadReport.isPending}
        />
      </Modal>
    </PageContainer>
  );
}
