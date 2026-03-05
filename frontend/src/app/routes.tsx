import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

function isAuthenticated(): boolean {
  return !!localStorage.getItem('auth_token');
}

/**
 * Wraps protected routes — redirects to /login if no token.
 */
export function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-300">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <Outlet />
      </div>
    </div>
  );
}

/**
 * Redirects authenticated users away from the login page.
 */
export function PublicLayout() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
