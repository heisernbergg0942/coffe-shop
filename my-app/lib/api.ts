const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, cache: 'no-store' });
  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try { message = JSON.parse(text).message || text; } catch {}
    throw new Error(message || `Request failed with ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; password: string; name?: string }) =>
      apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    socialGoogle: (idToken: string) =>
      apiFetch('/auth/social/google', { method: 'POST', body: JSON.stringify({ idToken }) }),
    socialFacebook: (accessToken: string) =>
      apiFetch('/auth/social/facebook', { method: 'POST', body: JSON.stringify({ accessToken }) }),
    profile: () => apiFetch('/auth/profile'),
  },
  users: {
    findAll: () => apiFetch('/users'),
    findOne: (id: string) => apiFetch(`/users/${id}`),
    update: (id: string, data: any) =>
      apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  categories: {
    findAll: () => apiFetch('/book-categories'),
    findOne: (id: string) => apiFetch(`/book-categories/${id}`),
    create: (data: { name: string; description?: string; isActive?: boolean }) =>
      apiFetch('/book-categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiFetch(`/book-categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch(`/book-categories/${id}`, { method: 'DELETE' }),
  },
  books: {
    findAll: (params?: { visibility?: string; categoryId?: string }) => {
      const qs = new URLSearchParams();
      if (params?.visibility) qs.set('visibility', params.visibility);
      if (params?.categoryId) qs.set('categoryId', params.categoryId);
      const q = qs.toString();
      return apiFetch(`/books${q ? `?${q}` : ''}`);
    },
    findOne: (id: string) => apiFetch(`/books/${id}`),
    create: (data: any) =>
      apiFetch('/books', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiFetch(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch(`/books/${id}`, { method: 'DELETE' }),
  },
  purchases: {
    create: (data: { bookId: string; paymentMethod?: string; notes?: string }) =>
      apiFetch('/purchases', { method: 'POST', body: JSON.stringify(data) }),
    myPurchases: () => apiFetch('/purchases/my-purchases'),
    findAll: () => apiFetch('/purchases'),
    findOne: (id: string) => apiFetch(`/purchases/${id}`),
    updateStatus: (id: string, data: { status: string }) =>
      apiFetch(`/purchases/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
  },
};
