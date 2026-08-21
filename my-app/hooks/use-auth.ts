'use client';

import { useEffect, useState } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
    setIsReady(true);
  }, []);

  function login(data: { access_token: string; user: any }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    setToken(data.access_token);
    setUser(data.user);
    setIsReady(true);
  }

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setToken(null);
    setUser(null);
    setIsReady(true);
  }

  return { user, token, isReady, login, logout, isAuthenticated: !!token };
}
