import type { Severity } from '@/types/report';

interface SeverityBadgeProps {
  severity: Severity;
}

const severityConfig: Record<Severity, { className: string }> = {
  CRITICAL: { className: 'bg-red-600/15 text-red-600 border-red-600/30' },
  HIGH: { className: 'bg-orange-500/15 text-orange-500 border-orange-500/30' },
  MEDIUM: { className: 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30' },
  LOW: { className: 'bg-blue-400/15 text-blue-400 border-blue-400/30' },
  INFO: { className: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
};

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      {severity}
    </span>
  );
}
