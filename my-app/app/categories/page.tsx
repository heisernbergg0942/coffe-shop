'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PageShell } from '@/components/page-shell';
import { useAuth } from '@/hooks/use-auth';

type Category = { id: string; name: string; description?: string; isActive: boolean };

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await api.categories.findAll();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.categories.create({ name, description });
      setName('');
      setDescription('');
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
    }
  }

  async function update(id: string) {
    setError('');
    setSubmitting(true);
    try {
      await api.categories.update(id, { name: editName, description: editDescription });
      setEditingId(null);
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update category');
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this category? This may affect books in this category.')) return;
    setError('');
    try {
      await api.categories.remove(id);
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete category');
    }
  }

  return (
    <PageShell title="Book Categories" subtitle="Browse and manage book categories">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}
      {isAdmin && (
        <form onSubmit={create} className="card p-6 mb-8 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary h-[42px]">
            {submitting ? 'Saving...' : 'Add Category'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-border rounded w-1/2 mb-3" />
              <div className="h-4 bg-border rounded w-full mb-2" />
              <div className="h-4 bg-border rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message="No categories yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((c) => (
            <div key={c.id} className="card p-5">
              {editingId === c.id ? (
                <div className="space-y-3">
                  <input className="input-field" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <input className="input-field" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => update(c.id)} disabled={submitting} className="btn-primary text-sm">
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <p className="text-sm text-foreground/70 mt-1">{c.description || 'No description'}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => { setEditingId(c.id); setEditName(c.name); setEditDescription(c.description || ''); setError(''); }}
                        className="text-sm px-3 py-1.5 rounded border border-border hover:bg-background transition-colors"
                      >
                        Edit
                      </button>
                      <button onClick={() => remove(c.id)} className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-700 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-foreground/70">{message}</p>
    </div>
  );
}
