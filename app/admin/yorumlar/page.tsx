'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Check, X, Trash2, Star } from 'lucide-react';

const statusLabels = { PENDING: 'Bekliyor', APPROVED: 'Onaylandı', REJECTED: 'Reddedildi' };
const statusColors = { PENDING: 'bg-yellow-100 text-yellow-700', APPROVED: 'bg-green-100 text-green-700', REJECTED: 'bg-red-100 text-red-700' };

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    const params = new URLSearchParams();
    if (filter) params.set('status', filter);
    fetch(`/api/admin/reviews?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setReviews(data.reviews || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/reviews', { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setToast(status === 'APPROVED' ? 'Yorum onaylandı.' : status === 'REJECTED' ? 'Yorum reddedildi.' : 'Yorum güncellendi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('citynail_token');
    await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setToast('Yorum silindi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Yorumlar</h1>

      <div className="flex gap-2 mb-4">
        {[{v:'',l:'Tümü'},{v:'PENDING',l:'Bekliyor'},{v:'APPROVED',l:'Onaylandı'},{v:'REJECTED',l:'Reddedildi'}].map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} className={`px-3 py-1.5 text-sm rounded-md ${filter === f.v ? 'bg-brand-dark text-white' : 'bg-white border border-gray-200'}`}>{f.l}</button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? <p className="text-gray-400">Yükleniyor...</p> : reviews.map(r => (
          <div key={r.id} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{r.userName}</span>
                  <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} size={12} className={i <= r.rating ? 'fill-brand-pink text-brand-pink' : 'text-gray-300'} />)}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>{statusLabels[r.status]}</span>
                </div>
                <p className="text-sm text-gray-600">{r.product?.name}</p>
                <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(r.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                {r.status !== 'APPROVED' && <button onClick={() => updateStatus(r.id, 'APPROVED')} className="text-green-500 hover:bg-green-50 p-1.5 rounded"><Check size={16} /></button>}
                {r.status !== 'REJECTED' && <button onClick={() => updateStatus(r.id, 'REJECTED')} className="text-orange-500 hover:bg-orange-50 p-1.5 rounded"><X size={16} /></button>}
                <button onClick={() => handleDelete(r.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
