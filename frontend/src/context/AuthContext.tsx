import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';
import type { User, RegisterRequest } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.setToken(token);
    const response = await api.me();
    if (response.success && response.data) {
      setUser({
        user_id: response.data.user_id,
        email: response.data.email,
        role: response.data.role as User['role'],
        is_active: true,
      });
    } else {
      api.setToken(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    if (response.success && response.data) {
      const meResponse = await api.me();
      if (meResponse.success && meResponse.data) {
        setUser({
          user_id: meResponse.data.user_id,
          email: meResponse.data.email,
          role: meResponse.data.role as User['role'],
          is_active: true,
        });
        return { success: true };
      }
    }
    return { success: false, error: response.error?.message || 'Login failed' };
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.register(data);
    if (response.success && response.data) {
      const meResponse = await api.me();
      if (meResponse.success && meResponse.data) {
        setUser({
          user_id: meResponse.data.user_id,
          email: meResponse.data.email,
          role: meResponse.data.role as User['role'],
          is_active: true,
        });
        return { success: true };
      }
    }
    return { success: false, error: response.error?.message || 'Registration failed' };
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}