'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PageShell } from '@/components/page-shell';

type Book = { id: string; title: string; price?: number };

function CheckoutForm() {
  const router = useRouter();
  const search = useSearchParams();
  const bookId = search.get('bookId');
  const [book, setBook] = useState<Book | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookId) {
      setError('Missing book ID');
      setLoading(false);
      return;
    }
    setLoading(true);
    api.books.findOne(bookId)
      .then((b) => setBook(b))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bookId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.purchases.create({ bookId: bookId!, paymentMethod, notes });
      router.push('/purchases');
    } catch (err: any) {
      setError(err.message || 'Purchase failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageShell title="Checkout" subtitle="Complete your purchase">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="card p-6 animate-pulse">
          <div className="h-6 bg-border rounded w-1/2 mb-4" />
          <div className="h-4 bg-border rounded w-full mb-6" />
          <div className="h-10 bg-border rounded w-full mb-4" />
          <div className="h-20 bg-border rounded w-full" />
        </div>
      ) : !book ? (
        <div className="card p-8 text-center">
          <p className="text-foreground/70">Book not found.</p>
        </div>
      ) : (
        <div className="card p-6 max-w-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-sm text-foreground/70">Book ID: {book.id}</p>
            </div>
            <span className="text-2xl font-bold text-primary">${Number(book.price).toFixed(2)}</span>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select className="input-field" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="transfer">Transfer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea className="input-field" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Any special requests?" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Processing...' : 'Complete Purchase'}
            </button>
          </form>
        </div>
      )}
    </PageShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
