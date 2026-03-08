import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StatusBadge from '@/components/badges/StatusBadge';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import { useProducts } from '@/hooks/useProducts';
import { useScanJobs } from '@/hooks/useScanJobs';
import { useReports } from '@/hooks/useReports';
import { useAuth } from '@/context/AuthContext';
import type { ScanJob } from '@/types/scanJob';
import type { Report } from '@/types/report';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ShieldExclamationIcon,
  DocumentChartBarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: jobs, isLoading: jobsLoading } = useScanJobs();
  const { data: reports, isLoading: reportsLoading } = useReports();

  const isLoading = productsLoading || jobsLoading || reportsLoading;

  const totalProducts = products?.length ?? 0;
  const runningJobs = jobs?.filter((j) => j.status === 'RUNNING').length ?? 0;
  const failedJobs = jobs?.filter((j) => j.status === 'FAILED').length ?? 0;
  const criticalFindings =
    reports?.reduce((sum, r) => sum + r.summary.critical, 0) ?? 0;
  const totalReports = reports?.length ?? 0;

  const summaryCards = [
    { label: 'Products', value: totalProducts, icon: CubeIcon, color: 'text-blue-400', to: '/products' },
    { label: 'Running Scans', value: runningJobs, icon: ArrowPathIcon, color: 'text-yellow-400', to: '/scan-jobs' },
    { label: 'Failed Jobs', value: failedJobs, icon: ExclamationTriangleIcon, color: 'text-red-500', to: '/scan-jobs' },
    { label: 'Critical Findings', value: criticalFindings, icon: ShieldExclamationIcon, color: 'text-red-600', to: '/reports' },
    { label: 'Total Reports', value: totalReports, icon: DocumentChartBarIcon, color: 'text-purple-400', to: '/reports' },
  ];

  const recentJobs = jobs?.slice(0, 5) ?? [];
  const recentReports = reports?.slice(0, 5) ?? [];

  const jobColumns: Column<ScanJob>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (j) => <span className="font-medium text-white">{j.productName}</span>,
    },
    { key: 'version', header: 'Version', render: (j) => <span className="font-mono text-xs">{j.versionName}</span> },
    { key: 'tool', header: 'Tool', render: (j) => j.tool },
    { key: 'status', header: 'Status', render: (j) => <StatusBadge status={j.status} /> },
    {
      key: 'action',
      header: '',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render: (_j) => (
        <Link to="/scan-jobs" className="text-xs font-medium text-blue-400 hover:text-blue-300">
          View →
        </Link>
      ),
    },
  ];

  const reportColumns: Column<Report>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (r) => <span className="font-medium text-white">{r.productName}</span>,
    },
    { key: 'version', header: 'Version', render: (r) => <span className="font-mono text-xs">{r.versionName}</span> },
    {
      key: 'summary',
      header: 'Findings',
      render: (r) => (
        <div className="flex gap-2 text-xs">
          <span className="text-red-400">C:{r.summary.critical}</span>
          <span className="text-orange-400">H:{r.summary.high}</span>
          <span className="text-yellow-400">M:{r.summary.medium}</span>
        </div>
      ),
    },
    { key: 'source', header: 'Source', render: (r) => r.source },
    {
      key: 'action',
      header: '',
      render: (r) => (
        <Link to={`/reports/${r.id}`} className="text-xs font-medium text-blue-400 hover:text-blue-300">
          View →
        </Link>
      ),
    },
  ];

  return (
    <PageContainer
      title="Dashboard"
      description={`Welcome back, ${user?.name ?? 'User'}. Here's an overview of your VMS activity.`}
    >
      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-lg border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {card.label}
              </span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className={`mt-2 text-2xl font-bold ${card.color}`}>
              {isLoading ? '—' : card.value}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Scan Jobs */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Recent Scan Jobs</h3>
            <Link to="/scan-jobs" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          {jobsLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading…</div>
          ) : (
            <DataTable data={recentJobs} columns={jobColumns} emptyMessage="No scan jobs yet." />
          )}
        </div>

        {/* Recent Reports */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-300">Recent Reports</h3>
            <Link to="/reports" className="text-xs text-blue-400 hover:text-blue-300">View all →</Link>
          </div>
          {reportsLoading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading…</div>
          ) : (
            <DataTable data={recentReports} columns={reportColumns} emptyMessage="No reports yet." />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
