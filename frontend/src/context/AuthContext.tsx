import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/services';
import type { User } from '../api/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<User>;
  register: (data: { fullName: string; username: string; email: string; password: string; phone?: string }) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = localStorage.getItem('giadung_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.me();
      setUser(data);
    } catch {
      localStorage.removeItem('giadung_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(usernameOrEmail, password) {
      const { data } = await authApi.login({ usernameOrEmail, password });
      localStorage.setItem('giadung_token', data.accessToken);
      setUser(data.user);
      setLoading(false);
      return data.user;
    },
    async register(data) {
      const result = await authApi.register(data);
      localStorage.setItem('giadung_token', result.data.accessToken);
      setUser(result.data.user);
      setLoading(false);
      return result.data.user;
    },
    logout() {
      localStorage.removeItem('giadung_token');
      setUser(null);
    },
    refresh,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
