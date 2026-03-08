import api from './api';
import type { LoginPayload, LoginResponse, AuthUser } from '@/types/user';

export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return { ...data.user, token: data.token };
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout').catch(() => {});
  localStorage.removeItem('auth_user');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
