import { useState } from 'react';
import { PlusIcon, ArrowPathIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import DataTable from '@/components/table/DataTable';
import type { Column } from '@/components/table/DataTable';
import Button from '@/components/ui/Button';
import Modal from '@/components/modals/Modal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import StatusBadge from '@/components/badges/StatusBadge';
import ScanJobForm from '@/components/forms/ScanJobForm';
import { useScanJobs, useCreateScanJob, useCancelScanJob, useRetriggerScanJob } from '@/hooks/useScanJobs';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/utils/format';
import type { ScanJob, ScanJobStatus } from '@/types/scanJob';

export default function ScanJobs() {
  const [statusFilter, setStatusFilter] = useState<ScanJobStatus | ''>('');
  const { data: jobs, isLoading, isError } = useScanJobs(statusFilter ? { status: statusFilter } : undefined);
  const createScanJob = useCreateScanJob();
  const cancelJob = useCancelScanJob();
  const retriggerJob = useRetriggerScanJob();
  const { toast } = useToast();
  const { isAdmin, isSecurityTeam, isProductTeam } = useAuth();

  const [showCreate, setShowCreate] = useState(false);
  const [cancelling, setCancelling] = useState<ScanJob | null>(null);

  const canSubmit = isAdmin || isSecurityTeam || isProductTeam;

  const handleCreate = async (data: Parameters<typeof createScanJob.mutateAsync>[0]) => {
    try {
      await createScanJob.mutateAsync(data);
      toast({ variant: 'success', title: 'Scan job submitted', description: 'Job has been queued.' });
      setShowCreate(false);
    } catch {
      toast({ variant: 'error', title: 'Failed to submit scan job' });
    }
  };

  const handleCancel = async () => {
    if (!cancelling) return;
    try {
      await cancelJob.mutateAsync(cancelling.id);
      toast({ variant: 'info', title: 'Scan job cancelled' });
      setCancelling(null);
    } catch {
      toast({ variant: 'error', title: 'Failed to cancel scan job' });
    }
  };

  const handleRetrigger = async (id: string) => {
    try {
      await retriggerJob.mutateAsync(id);
      toast({ variant: 'success', title: 'Scan job re-triggered' });
    } catch {
      toast({ variant: 'error', title: 'Failed to re-trigger scan job' });
    }
  };

  const columns: Column<ScanJob>[] = [
    { key: 'id', header: 'Job ID', render: (j) => <code className="text-xs text-gray-400">{j.id.slice(0, 8)}</code> },
    { key: 'product', header: 'Product', render: (j) => <span className="font-medium text-white">{j.productName}</span> },
    { key: 'version', header: 'Version', render: (j) => <span className="font-mono text-xs">{j.versionName}</span> },
    { key: 'tool', header: 'Tool', render: (j) => j.tool },
    { key: 'scanType', header: 'Type', render: (j) => j.scanType },
    { key: 'status', header: 'Status', render: (j) => <StatusBadge status={j.status} /> },
    {
      key: 'summary',
      header: 'Findings',
      render: (j) =>
        j.summary ? (
          <div className="flex gap-2 text-xs">
            <span className="text-red-400">C:{j.summary.critical}</span>
            <span className="text-orange-400">H:{j.summary.high}</span>
            <span className="text-yellow-400">M:{j.summary.medium}</span>
            <span className="text-blue-400">L:{j.summary.low}</span>
          </div>
        ) : (
          <span className="text-gray-600">—</span>
        ),
    },
    { key: 'createdAt', header: 'Submitted', sortable: true, render: (j) => formatDate(j.createdAt) },
    {
      key: 'actions',
      header: '',
      render: (j) => (
        <div className="flex items-center gap-2">
          {(j.status === 'QUEUED' || j.status === 'RUNNING') && (
            <button
              onClick={() => setCancelling(j)}
              className="text-xs text-gray-500 hover:text-red-400"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
          {j.status === 'FAILED' && (
            <button
              onClick={() => handleRetrigger(j.id)}
              disabled={retriggerJob.isPending}
              className="text-xs text-gray-500 hover:text-blue-400"
            >
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Scan Jobs"
      description="Submit and monitor security scan jobs"
      action={
        canSubmit && (
          <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
            New Scan Job
          </Button>
        )
      }
    >
      {/* Status filter */}
      <div className="mb-4 flex gap-2">
        {(['', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'border-blue-600 bg-blue-600/20 text-blue-300'
                : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
            }`}
          >
            {s === '' ? 'All' : s}
          </button>
        ))}
      </div>

      {isLoading && <div className="py-12 text-center text-gray-500">Loading scan jobs…</div>}
      {isError && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
          Failed to load scan jobs.
        </div>
      )}
      {!isLoading && !isError && (
        <DataTable data={jobs ?? []} columns={columns} emptyMessage="No scan jobs found." />
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Submit Scan Job" maxWidth="lg">
        <ScanJobForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={createScanJob.isPending}
        />
      </Modal>

      <ConfirmDialog
        open={!!cancelling}
        onClose={() => setCancelling(null)}
        onConfirm={handleCancel}
        title={`Cancel scan job?`}
        description="The running scan will be stopped and marked as Cancelled."
        confirmLabel="Cancel Job"
        loading={cancelJob.isPending}
      />
    </PageContainer>
  );
}
