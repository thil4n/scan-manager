import { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';

export default function Admin() {
  const [criticalThreshold, setCriticalThreshold] = useState('0');
  const [highThreshold, setHighThreshold] = useState('3');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <PageContainer title="Admin" description="Configure scan policy thresholds">
      <div className="max-w-lg">
        <form
          onSubmit={handleSave}
          className="space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-6"
        >
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Security Gate Policy
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              Set the maximum allowed number of findings per severity level. Releases
              exceeding these thresholds will be blocked.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-400">
              Critical Findings Threshold
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-600">
              Set to 0 to block any release with critical findings.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs text-gray-400">
              High Findings Threshold
            </label>
            <input
              type="number"
              min="0"
              className={inputClass}
              value={highThreshold}
              onChange={(e) => setHighThreshold(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-600">
              Releases with high findings above this count will be flagged.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Save Policy
            </button>
            {saved && (
              <span className="text-sm text-green-500">Policy saved successfully.</span>
            )}
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
