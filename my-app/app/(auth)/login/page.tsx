'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.login({ email, password });
      login(data);
      router.push('/books');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Link href="/" className="text-xl font-bold text-primary"> Coffee Shop</Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="card p-8">
            <h1 className="text-2xl font-bold text-primary mb-1 text-center">Welcome back</h1>
            <p className="text-sm text-foreground/70 text-center mb-6">Login to your account</p>
            {error && <p className="text-red-600 text-sm mb-4 p-3 rounded bg-red-50 border border-red-200">{error}</p>}
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-foreground/70">
              Don&apos;t have an account? <Link href="/register" className="text-primary font-semibold">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
