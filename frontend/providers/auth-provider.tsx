"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiClient, readToken, writeToken } from "@/features/api/client";
import type { LoginRequest, RegisterRequest, User } from "@/shared/apiTypes";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (
    credentials: LoginRequest,
    remember?: boolean,
  ) => Promise<{ ok: boolean; message?: string; role?: User["role"] }>;
  register: (
    data: RegisterRequest,
  ) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = readToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    const response = await apiClient.me();
    setUser(response.success ? response.data : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Reads the stored token on mount, then hydrates the user from /auth/me.
    // This is external-store synchronisation, the documented exception.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  // A 401 from any request clears the token in the API client and emits this
  // event; dropping the user makes RequireAuth send them to /login.
  useEffect(() => {
    function onUnauthorized() {
      setUser(null);
      setLoading(false);
    }
    window.addEventListener("openclinic:unauthorized", onUnauthorized);
    return () =>
      window.removeEventListener("openclinic:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest, remember = true) => {
      const response = await apiClient.login(credentials);
      if (!response.success || !response.data) {
        return {
          ok: false,
          message: response.error?.message ?? "Sign in failed",
        };
      }

      // "Remember me" keeps the token in localStorage; leaving it unchecked
      // keeps it in sessionStorage so it clears when the tab closes.
      writeToken(response.data.access_token, remember);

      const me = await apiClient.me();
      if (!me.success || !me.data) {
        writeToken(null);
        return {
          ok: false,
          message: me.error?.message ?? "Could not load your profile",
        };
      }
      setUser(me.data);
      setLoading(false);
      return { ok: true, role: me.data.role };
    },
    [],
  );

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await apiClient.register(data);
    if (!response.success || !response.data) {
      return {
        ok: false,
        message: response.error?.message ?? "Registration failed",
      };
    }
    const me = await apiClient.me();
    if (!me.success || !me.data) {
      writeToken(null);
      return {
        ok: false,
        message: me.error?.message ?? "Could not load your profile",
      };
    }
    setUser(me.data);
    setLoading(false);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    apiClient.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

