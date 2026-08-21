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
  createdAt: string;
  book?: { title: string };
};

export default function PurchasesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    load();
  }, [isAuthenticated]);

  async function load() {
    setLoading(true);
    try {
      const data = await api.purchases.myPurchases();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) return null;

  return (
    <PageShell title="My Purchases" subtitle={`${items.length} total purchase${items.length !== 1 ? 's' : ''}`}>
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
        <EmptyState
          title="No purchases yet"
          description="Browse our books and make your first purchase."
          action={{ label: 'Browse Books', href: '/books' }}
        />
      ) : (
        <div className="space-y-4">
          {items.map((p) => (
            <div key={p.id} className="card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{p.book?.title || 'Unknown book'}</h3>
                <p className="text-sm text-foreground/70 mt-1">
                  Payment: <span className="font-medium capitalize">{p.paymentMethod}</span> • Status: <StatusBadge status={p.status} />
                </p>
                <p className="text-xs text-foreground/60 mt-1">{new Date(p.createdAt).toLocaleString()}</p>
              </div>
              <span className="text-xl font-bold text-primary">${Number(p.totalAmount).toFixed(2)}</span>
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

function EmptyState({ title, description, action }: { title: string; description: string; action: { label: string; href: string } }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-lg font-medium mb-1">{title}</p>
      <p className="text-sm text-foreground/70 mb-4">{description}</p>
      <a href={action.href} className="btn-primary inline-block">{action.label}</a>
    </div>
  );
}
