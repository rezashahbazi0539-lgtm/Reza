'use client';

import { useState, useEffect } from 'react';
import { formatDateTime } from '@/lib/utils';
import { Plus, Minus, X } from 'lucide-react';

const statusLabels = { inStock: 'Stokta', lowStock: 'Az Stok', outOfStock: 'Tükendi' };

export default function AdminInventory() {
  const [data, setData] = useState({ products: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [showAdjust, setShowAdjust] = useState(null);
  const [adjust, setAdjust] = useState({ change: '', reason: '' });
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdjust = async () => {
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/inventory', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: showAdjust.id, change: parseInt(adjust.change), reason: adjust.reason }),
    });
    setShowAdjust(null); setAdjust({ change: '', reason: '' });
    setToast('Stok güncellendi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const getStatus = (p) => {
    if (p.stock <= 0) return 'outOfStock';
    if (p.stock <= p.lowStockThreshold) return 'lowStock';
    return 'inStock';
  };

  const statusColors = { inStock: 'bg-green-100 text-green-700', lowStock: 'bg-yellow-100 text-yellow-700', outOfStock: 'bg-red-100 text-red-700' };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Stok Yönetimi</h1>

      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium text-center">Mevcut Stok</th>
              <th className="px-4 py-3 font-medium text-center">Min. Stok</th>
              <th className="px-4 py-3 font-medium text-center">Durum</th>
              <th className="px-4 py-3 font-medium text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-400">Yükleniyor...</td></tr>
            ) : data.products.map(p => {
              const status = getStatus(p);
              return (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.sku}</td>
                  <td className="px-4 py-3 text-center font-medium">{p.stock}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{p.lowStockThreshold}</td>
                  <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>{statusLabels[status]}</span></td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setShowAdjust(p)} className="text-brand-pink text-sm hover:underline">Stok Düzelt</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* History */}
      <h2 className="font-semibold text-gray-700 mb-3">Stok Hareketleri</h2>
      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium">Ürün</th>
              <th className="px-4 py-3 font-medium text-center">Değişim</th>
              <th className="px-4 py-3 font-medium">Neden</th>
            </tr>
          </thead>
          <tbody>
            {data.transactions.map(t => (
              <tr key={t.id} className="border-b border-gray-50">
                <td className="px-4 py-3 text-gray-600">{formatDateTime(t.createdAt)}</td>
                <td className="px-4 py-3">{t.product?.name}</td>
                <td className="px-4 py-3 text-center"><span className={t.change > 0 ? 'text-green-600' : 'text-red-600'}>{t.change > 0 ? '+' : ''}{t.change}</span></td>
                <td className="px-4 py-3 text-gray-600">{t.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdjust && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdjust(null)} />
          <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Stok Düzelt: {showAdjust.name}</h2>
              <button onClick={() => setShowAdjust(null)}><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Mevcut stok: {showAdjust.stock}</p>
              <div><label className="text-sm font-medium block mb-1">Değişim (+/-)</label><input type="number" value={adjust.change} onChange={e => setAdjust({...adjust, change: e.target.value})} className="input-field" placeholder="örn: +20 veya -5" /></div>
              <div><label className="text-sm font-medium block mb-1">Neden *</label><input value={adjust.reason} onChange={e => setAdjust({...adjust, reason: e.target.value})} className="input-field" placeholder="örn: Yeni gelen ürün" /></div>
              <button onClick={handleAdjust} className="btn-primary w-full">Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
