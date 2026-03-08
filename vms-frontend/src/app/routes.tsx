import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import ToastContainer from '@/components/ui/Toast';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types/user';

/**
 * Wraps protected routes — redirects to /login if not authenticated.
 */
export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-300">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
}

/**
 * Restricts a route to specific roles. Renders 403 if role doesn't match.
 */
export function RoleGuard({ roles }: { roles: UserRole[] }) {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <p className="text-2xl font-bold text-white">403</p>
        <p className="text-gray-400">You don't have permission to access this page.</p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }
  return <Outlet />;
}

/**
 * Redirects authenticated users away from the login page.
 */
export function PublicLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
