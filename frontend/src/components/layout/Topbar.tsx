import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Topbar() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-800 bg-gray-950 px-6">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="h-5 w-5 text-blue-500 sm:hidden" />
        <h1 className="text-sm font-medium text-gray-300">
          Pre-Release Security Scan Portal
        </h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <UserCircleIcon className="h-5 w-5" />
        <span>current-user@acme.io</span>
      </div>
    </header>
  );
}
