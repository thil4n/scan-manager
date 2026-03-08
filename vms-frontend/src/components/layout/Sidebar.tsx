import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  DocumentChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import RoleBadge from '@/components/badges/RoleBadge';

interface NavItem {
  to: string;
  label: string;
  icon: typeof HomeIcon;
  allowedRoles?: string[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/products', label: 'Products', icon: CubeIcon },
  { to: '/scan-jobs', label: 'Scan Jobs', icon: MagnifyingGlassIcon },
  { to: '/reports', label: 'Reports', icon: DocumentChartBarIcon },
  {
    to: '/admin',
    label: 'Admin',
    icon: Cog6ToothIcon,
    allowedRoles: ['ADMIN', 'SECURITY_TEAM'],
  },
  {
    to: '/admin/users',
    label: 'Users',
    icon: UsersIcon,
    allowedRoles: ['ADMIN'],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleItems = navItems.filter(
    (item) => !item.allowedRoles || (role && item.allowedRoles.includes(role)),
  );

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-gray-800 bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-800 px-5 py-4">
        <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
        <span className="text-sm font-bold tracking-wide text-white">VMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to !== '/products' && item.to !== '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-800 p-3">
        {user && (
          <div className="mb-2 rounded-md bg-gray-900 px-3 py-2">
            <p className="truncate text-xs font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
            {role && <div className="mt-1.5"><RoleBadge role={role} /></div>}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-gray-200"
        >
          <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
