export type UserRole = 'ADMIN' | 'SECURITY_TEAM' | 'PRODUCT_TEAM' | 'CUSTOMER_SUCCESS';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserPayload {
  id: string;
  name?: string;
  role?: UserRole;
}
