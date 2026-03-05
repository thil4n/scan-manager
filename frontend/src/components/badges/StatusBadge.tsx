import type { ScanStatus } from '@/types/scan';

interface StatusBadgeProps {
  status: ScanStatus;
}

const statusConfig: Record<ScanStatus, { label: string; className: string }> = {
  PASS: {
    label: 'Pass',
    className: 'bg-green-500/15 text-green-500 border-green-500/30',
  },
  FAIL: {
    label: 'Fail',
    className: 'bg-red-500/15 text-red-500 border-red-500/30',
  },
  RUNNING: {
    label: 'Running',
    className: 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30',
  },
  QUEUED: {
    label: 'Queued',
    className: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'PASS'
            ? 'bg-green-500'
            : status === 'FAIL'
              ? 'bg-red-500'
              : status === 'RUNNING'
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-gray-400'
        }`}
      />
      {config.label}
    </span>
  );
}
