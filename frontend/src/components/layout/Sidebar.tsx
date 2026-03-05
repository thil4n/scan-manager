import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/releases', label: 'Releases', icon: CubeIcon },
  { to: '/releases/new', label: 'New Release', icon: PlusCircleIcon },
  { to: '/admin', label: 'Admin', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-800 bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-800 px-5 py-4">
        <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
        <span className="text-sm font-bold tracking-wide text-white">ScanManager</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-800 px-3 py-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-gray-200"
        >
          <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
