import { useParams, Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import SeverityBadge from '@/components/badges/SeverityBadge';
import { useReport } from '@/hooks/useReports';
import { formatDate } from '@/utils/format';
import type { Vulnerability } from '@/types/report';

const statusColors: Record<string, string> = {
  OPEN: 'text-red-400 border-red-700/40 bg-red-950/30',
  IN_PROGRESS: 'text-yellow-400 border-yellow-700/40 bg-yellow-950/30',
  RESOLVED: 'text-emerald-400 border-emerald-700/40 bg-emerald-950/30',
  WONT_FIX: 'text-gray-400 border-gray-700/40 bg-gray-800/30',
  FALSE_POSITIVE: 'text-blue-400 border-blue-700/40 bg-blue-950/30',
};

export default function ReportDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: report, isLoading, isError } = useReport(id);

  const columns: Column<Vulnerability>[] = [
    { key: 'title', header: 'Title', render: (v) => <span className="font-medium text-white">{v.title}</span> },
    { key: 'severity', header: 'Severity', render: (v) => <SeverityBadge severity={v.severity} /> },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[v.status]}`}>
          {v.status.replace('_', ' ')}
        </span>
      ),
    },
    { key: 'cveId', header: 'CVE', render: (v) => v.cveId ? <code className="text-xs text-blue-400">{v.cveId}</code> : '—' },
    { key: 'file', header: 'File', render: (v) => v.file ? <code className="text-xs text-gray-400">{v.file}</code> : '—' },
    { key: 'affectedComponent', header: 'Component', render: (v) => v.affectedComponent ?? '—' },
  ];

  if (isLoading) {
    return <PageContainer title="Report"><div className="py-12 text-center text-gray-500">Loading…</div></PageContainer>;
  }

  if (isError || !report) {
    return (
      <PageContainer title="Report">
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          Failed to load report.
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Report Detail" description={`${report.productName} — v${report.versionName}`}>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link to="/reports" className="hover:text-gray-300">Reports</Link>
        <ChevronRightIcon className="h-3.5 w-3.5" />
        <span className="text-gray-300">{report.id.slice(0, 8)}…</span>
      </nav>

      {/* Meta */}
      <div className="mb-6 grid grid-cols-2 gap-4 rounded-lg border border-gray-800 bg-gray-900 p-5 sm:grid-cols-4">
        <div>
          <p className="text-xs text-gray-500">Source</p>
          <p className="mt-0.5 text-sm text-gray-300">{report.source}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Submitted By</p>
          <p className="mt-0.5 text-sm text-gray-300">{report.submittedBy}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Date</p>
          <p className="mt-0.5 text-sm text-gray-300">{formatDate(report.createdAt)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="mt-0.5 text-sm text-gray-300">{report.summary.total} findings</p>
        </div>
      </div>

      {/* Summary bars */}
      <div className="mb-6 flex flex-wrap gap-3">
        {[
          { label: 'Critical', value: report.summary.critical, color: 'bg-red-600' },
          { label: 'High', value: report.summary.high, color: 'bg-orange-500' },
          { label: 'Medium', value: report.summary.medium, color: 'bg-yellow-500' },
          { label: 'Low', value: report.summary.low, color: 'bg-blue-500' },
          { label: 'Info', value: report.summary.info, color: 'bg-gray-500' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span className="text-xs text-gray-500">{item.label}</span>
            <span className="ml-1 text-sm font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-sm font-semibold text-gray-300">Vulnerabilities</h3>
      <DataTable data={report.vulnerabilities} columns={columns} emptyMessage="No vulnerabilities in this report." />
    </PageContainer>
  );
}
