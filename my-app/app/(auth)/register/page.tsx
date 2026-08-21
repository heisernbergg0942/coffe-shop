'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { CoffeeCupIcon } from '@/components/icons';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.auth.register({ email, password, name });
      login(data);
      router.push('/books');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function socialRegister(provider: 'google' | 'facebook') {
    setLoading(true);
    setError('');
    try {
      const data = provider === 'google'
        ? await api.auth.socialGoogle('demo-token')
        : await api.auth.socialFacebook('demo-token');
      login(data);
      router.push('/books');
    } catch (err: any) {
      setError(err.message || 'Social registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary">
          <CoffeeCupIcon className="w-6 h-6" />
          Coffee Shop
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-primary p-8 text-white flex flex-col justify-between hidden md:flex">
              <div>
                <CoffeeCupIcon className="w-10 h-10 mb-6 text-white/90" />
                <h2 className="text-3xl font-bold mb-4">Create account</h2>
                <p className="text-white/80 leading-relaxed">Join Coffee Shop to browse books, purchase reads, and manage orders.</p>
              </div>
              <div className="mt-auto pt-8">
                <p className="text-sm text-white/70 mb-1">Need an account?</p>
                <p className="text-sm text-white/90">Signing up takes less than a minute.</p>
              </div>
            </div>
            <div className="p-8 md:p-10">
              <div className="md:hidden mb-6 text-center">
                <CoffeeCupIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h1 className="text-2xl font-bold text-primary">Create account</h1>
                <p className="text-sm text-foreground/70 mt-1">Join Coffee Shop today</p>
              </div>
              {error && (
                <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? 'Creating account...' : 'Register'}
                </button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-foreground/50">Or continue with</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => socialRegister('google')} className="btn-secondary flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.14 6.57-6.8 6.57-4.15 0-7.54-3.33-7.54-7.44s3.39-7.44 7.54-7.44c2.35 0 3.91.99 4.79 1.65l2.57-2.48C18.59 5.17 16.57 4 14.09 4 9.57 4 6.05 7.3 6.05 12s3.52 8 8.04 8c4.62 0 7.63-3.24 7.63-7.82 0-.53-.06-1.04-.16-1.52z" /></svg>
                  Google
                </button>
                <button onClick={() => socialRegister('facebook')} className="btn-secondary flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33V21.88C18.34 21.12 22 16.99 22 12z" /></svg>
                  Facebook
                </button>
              </div>
              <p className="mt-6 text-center text-sm text-foreground/70">
                Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
