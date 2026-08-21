'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/use-auth';
import { PageShell } from '@/components/page-shell';

type Purchase = {
  id: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  notes: string | null;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
  book: { id: string; title: string };
};

export default function AdminPurchasesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isReady } = useAuth();
  const [items, setItems] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isAdmin) {
      router.push('/purchases');
      return;
    }
    load();
  }, [isAuthenticated, isAdmin, isReady]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await api.purchases.findAll();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load purchases');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    setError('');
    try {
      await api.purchases.updateStatus(id, { status });
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  }

  if (!isReady || !isAuthenticated || !isAdmin) return null;

  return (
    <PageShell title="All Purchases" subtitle="Admin view of every order">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-border rounded w-1/3 mb-2" />
              <div className="h-4 bg-border rounded w-full mb-2" />
              <div className="h-4 bg-border rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-foreground/70">No purchases yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <div key={p.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-lg">{p.book.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Buyer: <span className="font-medium">{p.user.name || p.user.email}</span> ({p.user.email})
                </p>
                <p className="text-sm text-foreground/70">
                  Payment: <span className="font-medium capitalize">{p.paymentMethod}</span> • {new Date(p.createdAt).toLocaleString()}
                </p>
                {p.notes && <p className="text-sm text-foreground/60 mt-1">Notes: {p.notes}</p>}
              </div>
              <div className="flex flex-col sm:items-end gap-2">
                <span className="text-xl font-bold text-primary">${Number(p.totalAmount).toFixed(2)}</span>
                <div className="flex gap-2">
                  {p.status !== 'completed' && (
                    <button
                      onClick={() => updateStatus(p.id, 'completed')}
                      disabled={updatingId === p.id}
                      className="text-xs px-3 py-1.5 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                    >
                      {updatingId === p.id ? 'Updating...' : 'Complete'}
                    </button>
                  )}
                  {p.status !== 'cancelled' && (
                    <button
                      onClick={() => updateStatus(p.id, 'cancelled')}
                      disabled={updatingId === p.id}
                      className="text-xs px-3 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  {p.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(p.id, 'pending')}
                      disabled={updatingId === p.id}
                      className="text-xs px-3 py-1.5 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors disabled:opacity-50"
                    >
                      Pending
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}
