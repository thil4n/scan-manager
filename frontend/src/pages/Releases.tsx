import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '@/components/layout/PageContainer';
import StatusBadge from '@/components/badges/StatusBadge';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import { useReleases } from '@/hooks/useReleases';
import { formatDate } from '@/utils/format';
import type { Release } from '@/types/release';
import type { ScanStatus } from '@/types/scan';
import { PlusCircleIcon, ArrowPathIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const statusOptions: { value: ScanStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PASS', label: 'Pass' },
  { value: 'FAIL', label: 'Fail' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'QUEUED', label: 'Queued' },
];

export default function Releases() {
  const { data: releases, isLoading, isError } = useReleases();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScanStatus | 'ALL'>('ALL');

  const filteredReleases = useMemo(() => {
    if (!releases) return [];
    return releases.filter((r) => {
      const matchesSearch =
        r.productName.toLowerCase().includes(search.toLowerCase()) ||
        r.version.toLowerCase().includes(search.toLowerCase()) ||
        r.submittedBy.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || r.overallStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [releases, search, statusFilter]);

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
      key: 'submittedBy',
      header: 'Submitted By',
      render: (r) => r.submittedBy,
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.overallStatus} />,
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

  if (isLoading) {
    return (
      <PageContainer title="Releases">
        <div className="flex items-center justify-center py-20">
          <ArrowPathIcon className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-sm text-gray-500">Loading releases…</span>
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Releases">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
          <p className="mt-2 text-sm text-gray-400">Failed to load releases.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Releases"
      description="All release submissions and their scan status"
      action={
        <Link
          to="/releases/new"
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircleIcon className="h-4 w-4" />
          New Release
        </Link>
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, version, or user…"
            className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-9 pr-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ScanStatus | 'ALL')}
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredReleases}
        keyExtractor={(r) => r.id}
        emptyMessage="No releases match your filters."
      />
    </PageContainer>
  );
}
