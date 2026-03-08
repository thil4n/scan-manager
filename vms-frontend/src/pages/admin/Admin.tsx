import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  UsersIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import PageContainer from '@/components/layout/PageContainer';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

const inputClass =
  'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export default function Admin() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [criticalThreshold, setCriticalThreshold] = useState('0');
  const [highThreshold, setHighThreshold] = useState('3');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ variant: 'success', title: 'Security policy saved' });
  };

  return (
    <PageContainer title="Admin" description="System settings and management">
      {/* Quick links */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { to: '/admin/users', icon: UsersIcon, label: 'User Management', desc: 'Add, edit, and assign roles to users' },
          { to: '/scan-jobs', icon: ShieldCheckIcon, label: 'Scan Jobs', desc: 'View and manage all scan jobs' },
          { to: '/reports', icon: Cog6ToothIcon, label: 'Reports', desc: 'View all vulnerability reports' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900 p-5 transition-colors hover:border-gray-700"
          >
            <div className="rounded-md bg-gray-800 p-2">
              <item.icon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="mt-0.5 text-xs text-gray-500">{item.desc}</p>
            </div>
            <ChevronRightIcon className="h-4 w-4 self-center text-gray-600" />
          </Link>
        ))}
      </div>

      {/* Security Gate Policy */}
      {isAdmin && (
        <div className="max-w-lg">
          <form
            onSubmit={handleSave}
            className="space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-6"
          >
            <div>
              <h3 className="mb-1 text-sm font-semibold text-gray-300">Security Gate Policy</h3>
              <p className="text-xs text-gray-500">
                Set the maximum allowed findings per severity. Scan jobs exceeding these thresholds
                will be marked as failed.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">Critical Findings Threshold</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-600">Set to 0 to block on any critical finding.</p>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-400">High Findings Threshold</label>
              <input
                type="number"
                min="0"
                className={inputClass}
                value={highThreshold}
                onChange={(e) => setHighThreshold(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Policy'}
            </button>
          </form>
        </div>
      )}
    </PageContainer>
  );
}
