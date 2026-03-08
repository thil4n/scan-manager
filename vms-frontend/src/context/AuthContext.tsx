import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuthUser, UserRole } from '@/types/user';
import { login as apiLogin, logout as apiLogout } from '@/services/authService';
import type { LoginPayload } from '@/types/user';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  isAdmin: boolean;
  isSecurityTeam: boolean;
  isProductTeam: boolean;
  isCustomerSuccess: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('auth_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const login = useCallback(async (payload: LoginPayload) => {
    const authUser = await apiLogin(payload);
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      role: user?.role ?? null,
      isAdmin: user?.role === 'ADMIN',
      isSecurityTeam: user?.role === 'SECURITY_TEAM' || user?.role === 'ADMIN',
      isProductTeam: user?.role === 'PRODUCT_TEAM',
      isCustomerSuccess: user?.role === 'CUSTOMER_SUCCESS',
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
