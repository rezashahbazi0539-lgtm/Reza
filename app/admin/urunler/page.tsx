'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice, formatDate } from '@/lib/utils';
import { Plus, Search, Edit2, Copy, Trash2, Power } from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/products?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {});
  }, [search, categoryFilter, statusFilter]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('citynail_token');
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    setToast('Ürün başarıyla silindi.');
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = async (id, currentStatus) => {
    const token = localStorage.getItem('citynail_token');
    const newStatus = currentStatus === 'PUBLISHED' ? 'INACTIVE' : 'PUBLISHED';
    await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const duplicate = async (product) => {
    const token = localStorage.getItem('citynail_token');
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, name: `${product.name} (Kopya)`, sku: `${product.sku}-COPY`, images: product.images?.map(i => i.url) || [] }),
    });
    if (res.ok) {
      const data = await res.json();
      setProducts(prev => [data.product, ...prev]);
      setToast('Ürün kopyalandı.');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const statusLabels = { PUBLISHED: 'Yayında', DRAFT: 'Taslak', INACTIVE: 'Pasif' };
  const statusColors = { PUBLISHED: 'bg-green-100 text-green-700', DRAFT: 'bg-gray-100 text-gray-600', INACTIVE: 'bg-red-100 text-red-700' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Ürünler</h1>
        <Link href="/admin/urunler/yeni" className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm rounded-md hover:bg-brand-pink">
          <Plus size={16} /> Yeni Ürün Ekle
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün ara..." className="w-full border border-gray-200 pl-10 pr-4 py-2 text-sm rounded-md outline-none focus:border-brand-pink" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border border-gray-200 px-3 py-2 text-sm rounded-md outline-none">
          <option value="">Tüm Kategoriler</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 px-3 py-2 text-sm rounded-md outline-none">
          <option value="">Tüm Durumlar</option>
          <option value="PUBLISHED">Yayında</option>
          <option value="DRAFT">Taslak</option>
          <option value="INACTIVE">Pasif</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium text-right">Fiyat</th>
              <th className="px-4 py-3 font-medium text-right">İndirimli</th>
              <th className="px-4 py-3 font-medium text-center">Stok</th>
              <th className="px-4 py-3 font-medium text-center">Durum</th>
              <th className="px-4 py-3 font-medium text-center">Satış</th>
              <th className="px-4 py-3 font-medium text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-8 text-gray-400">Yükleniyor...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-8 text-gray-400">Ürün bulunamadı.</td></tr>
            ) : products.map(p => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={p.images?.[0]?.url} alt="" className="w-10 h-10 object-cover rounded" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.category?.name || '-'}</td>
                <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                <td className="px-4 py-3 text-right">{p.discountPrice ? formatPrice(p.discountPrice) : '-'}</td>
                <td className="px-4 py-3 text-center">
                  <span className={p.stock <= p.lowStockThreshold ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{p.salesCount}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/admin/urunler/${p.id}`} className="text-gray-500 hover:text-brand-pink"><Edit2 size={16} /></Link>
                    <button onClick={() => duplicate(p)} className="text-gray-500 hover:text-blue-500"><Copy size={16} /></button>
                    <button onClick={() => toggleStatus(p.id, p.status)} className="text-gray-500 hover:text-orange-500"><Power size={16} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 relative">
            <p className="text-lg font-medium mb-2">Bu ürünü silmek istediğinizden emin misiniz?</p>
            <p className="text-sm text-gray-500 mb-6">Bu işlem geri alınamaz.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-md">İptal</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md">Sil</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
