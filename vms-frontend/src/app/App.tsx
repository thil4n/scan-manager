import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ProtectedLayout, PublicLayout, RoleGuard } from './routes';

import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';

// Products
import Products from '@/pages/products/Products';
import ProductDetail from '@/pages/products/ProductDetail';

// Scan Jobs
import ScanJobs from '@/pages/scanjobs/ScanJobs';

// Reports
import Reports from '@/pages/reports/Reports';
import ReportDetail from '@/pages/reports/ReportDetail';

// Admin
import Admin from '@/pages/admin/Admin';
import Users from '@/pages/admin/Users';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Product Management */}
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />

                {/* Scan Jobs — Product Team, Security Team, Admin */}
                <Route element={<RoleGuard roles={['ADMIN', 'SECURITY_TEAM', 'PRODUCT_TEAM']} />}>
                  <Route path="/scan-jobs" element={<ScanJobs />} />
                </Route>

                {/* Reports */}
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/:id" element={<ReportDetail />} />

                {/* Admin — Admin + Security Team */}
                <Route element={<RoleGuard roles={['ADMIN', 'SECURITY_TEAM']} />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>

                {/* Users — Admin only */}
                <Route element={<RoleGuard roles={['ADMIN']} />}>
                  <Route path="/admin/users" element={<Users />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
