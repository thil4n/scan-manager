import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StatusBadge from '@/components/badges/StatusBadge';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import { useReleases } from '@/hooks/useReleases';
import { formatDate } from '@/utils/format';
import type { Release } from '@/types/release';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { data: releases, isLoading, isError } = useReleases();

  if (isLoading) {
    return (
      <PageContainer title="Dashboard">
        <LoadingState />
      </PageContainer>
    );
  }

  if (isError || !releases) {
    return (
      <PageContainer title="Dashboard">
        <ErrorState />
      </PageContainer>
    );
  }

  const totalReleases = releases.length;
  const failedReleases = releases.filter((r) => r.overallStatus === 'FAIL').length;
  const runningScans = releases.filter((r) => r.overallStatus === 'RUNNING').length;
  const criticalFindings = releases.reduce(
    (sum, r) => sum + r.scans.reduce((s, scan) => s + scan.summary.critical, 0),
    0,
  );

  const summaryCards = [
    { label: 'Total Releases', value: totalReleases, icon: CubeIcon, color: 'text-blue-400' },
    { label: 'Failed Releases', value: failedReleases, icon: ExclamationTriangleIcon, color: 'text-red-500' },
    { label: 'Running Scans', value: runningScans, icon: ArrowPathIcon, color: 'text-yellow-500' },
    { label: 'Critical Findings', value: criticalFindings, icon: ShieldExclamationIcon, color: 'text-red-600' },
  ];

  const recentReleases = releases.slice(0, 5);

  const columns: Column<Release>[] = [
    {
      key: 'product',
      header: 'Product',
      sortable: true,
      render: (r) => <span className="font-medium text-white">{r.productName}</span>,
    },
    {
      key: 'version',
      header: 'Version',
      render: (r) => r.version,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.overallStatus} />,
    },
    {
      key: 'date',
      header: 'Submitted',
      sortable: true,
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: 'action',
      header: '',
      render: (r) => (
        <Link
          to={`/releases/${r.id}`}
          className="text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          View →
        </Link>
      ),
    },
  ];

  return (
    <PageContainer title="Dashboard" description="Overview of security scan activity">
      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-gray-800 bg-gray-900 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                {card.label}
              </span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <div className={`mt-2 text-2xl font-bold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Releases */}
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
        Recent Releases
      </h3>
      <DataTable
        columns={columns}
        data={recentReleases}
        keyExtractor={(r) => r.id}
        emptyMessage="No releases yet."
      />
    </PageContainer>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <ArrowPathIcon className="h-6 w-6 animate-spin text-gray-500" />
      <span className="ml-2 text-sm text-gray-500">Loading dashboard…</span>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
      <p className="mt-2 text-sm text-gray-400">Failed to load dashboard data.</p>
    </div>
  );
}
