import { ShieldCheckIcon, UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-800 bg-gray-950 px-6">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="h-5 w-5 text-blue-500 sm:hidden" />
        <h1 className="text-sm font-medium text-gray-300">
          Vulnerability Management System
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-gray-500 hover:text-gray-300 transition-colors">
          <BellIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <UserCircleIcon className="h-5 w-5" />
          <span>{user?.email ?? 'Guest'}</span>
        </div>
      </div>
    </header>
  );
}
