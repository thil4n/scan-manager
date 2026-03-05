import type { ScanStatus } from '@/types/scan';

interface ScanTimelineProps {
  status: ScanStatus;
}

const steps = ['Queued', 'Uploading', 'Scanning', 'Completed'] as const;

function getActiveIndex(status: ScanStatus): number {
  switch (status) {
    case 'QUEUED':
      return 0;
    case 'RUNNING':
      return 2;
    case 'PASS':
    case 'FAIL':
      return 3;
  }
}

export default function ScanTimeline({ status }: ScanTimelineProps) {
  const activeIndex = getActiveIndex(status);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const isCompleted = i < activeIndex;
        const isCurrent = i === activeIndex;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                  isCompleted
                    ? 'border-green-500 bg-green-500/20 text-green-500'
                    : isCurrent
                      ? 'border-yellow-500 bg-yellow-500/20 text-yellow-500 animate-pulse'
                      : 'border-gray-700 bg-gray-800 text-gray-600'
                }`}
              >
                {isCompleted ? '✓' : i + 1}
              </div>
              <span
                className={`text-[10px] ${
                  isCompleted
                    ? 'text-green-500'
                    : isCurrent
                      ? 'text-yellow-500'
                      : 'text-gray-600'
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`mx-1 h-px flex-1 ${
                  isCompleted ? 'bg-green-500/50' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
