import type { Scan } from '@/types/scan';
import StatusBadge from '@/components/badges/StatusBadge';

interface ScanCardProps {
  scanName: string;
  status: Scan['status'];
  summary: Scan['summary'];
  onViewDetails: () => void;
}

const scanLabels: Record<Scan['type'], string> = {
  VERACODE: 'Veracode SAST',
  FOSSA: 'FOSSA SCA',
  JFROG: 'JFrog Xray',
};

export function getScanLabel(type: Scan['type']): string {
  return scanLabels[type];
}

export default function ScanCard({ scanName, status, summary, onViewDetails }: ScanCardProps) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">{scanName}</h3>
        <StatusBadge status={status} />
      </div>

      {status !== 'QUEUED' && status !== 'RUNNING' ? (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <SeverityCount label="Critical" count={summary.critical} color="text-red-600" />
          <SeverityCount label="High" count={summary.high} color="text-orange-500" />
          <SeverityCount label="Medium" count={summary.medium} color="text-yellow-400" />
          <SeverityCount label="Low" count={summary.low} color="text-blue-400" />
        </div>
      ) : (
        <div className="mt-4 text-sm text-gray-500">
          {status === 'RUNNING' ? 'Scan in progress…' : 'Waiting in queue…'}
        </div>
      )}

      <button
        type="button"
        onClick={onViewDetails}
        className="mt-4 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
      >
        View Details
      </button>
    </div>
  );
}

function SeverityCount({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-lg font-bold ${color}`}>{count}</div>
      <div className="text-[10px] uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}
