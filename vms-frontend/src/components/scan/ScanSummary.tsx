import type { Scan } from '@/types/scan';

interface ScanSummaryProps {
  scans: Scan[];
}

export default function ScanSummaryComponent({ scans }: ScanSummaryProps) {
  const totals = scans.reduce(
    (acc, scan) => ({
      critical: acc.critical + scan.summary.critical,
      high: acc.high + scan.summary.high,
      medium: acc.medium + scan.summary.medium,
      low: acc.low + scan.summary.low,
    }),
    { critical: 0, high: 0, medium: 0, low: 0 },
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Critical" value={totals.critical} color="text-red-600 bg-red-600/10 border-red-600/20" />
      <StatCard label="High" value={totals.high} color="text-orange-500 bg-orange-500/10 border-orange-500/20" />
      <StatCard label="Medium" value={totals.medium} color="text-yellow-400 bg-yellow-400/10 border-yellow-400/20" />
      <StatCard label="Low" value={totals.low} color="text-blue-400 bg-blue-400/10 border-blue-400/20" />
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-lg border p-3 text-center ${color}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider opacity-70">{label}</div>
    </div>
  );
}
