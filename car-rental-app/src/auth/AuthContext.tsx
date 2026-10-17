import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Role = 'admin' | 'user';
export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  role: Role;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || data.error || 'Login failed');
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    (window as any).google?.accounts?.id?.disableAutoSelect?.();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'admin', loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
