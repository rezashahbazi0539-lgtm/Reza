'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Ticket } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const typeLabels = { PERCENTAGE: 'Yüzde', FIXED: 'Sabit Tutar', FREE_SHIPPING: 'Ücretsiz Kargo' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'PERCENTAGE', value: '', minOrder: '0', maxDiscount: '', startDate: new Date().toISOString().split('T')[0], endDate: '', usageLimit: '', perCustomerLimit: '', status: 'ACTIVE' });
  const [toast, setToast] = useState(null);

  const load = () => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/coupons', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCoupons(data.coupons || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('citynail_token');
    await fetch('/api/admin/coupons', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setShowForm(false);
    setForm({ code: '', type: 'PERCENTAGE', value: '', minOrder: '0', maxDiscount: '', startDate: new Date().toISOString().split('T')[0], endDate: '', usageLimit: '', perCustomerLimit: '', status: 'ACTIVE' });
    setToast('Kupon oluşturuldu.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kuponu silmek istediğinizden emin misiniz?')) return;
    const token = localStorage.getItem('citynail_token');
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setToast('Kupon silindi.');
    setTimeout(() => setToast(null), 3000);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Kuponlar</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 text-sm rounded-md hover:bg-brand-pink"><Plus size={16} /> Yeni Kupon</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <p className="text-gray-400">Yükleniyor...</p> : coupons.map(c => (
          <div key={c.id} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Ticket size={20} className="text-brand-pink" />
                <span className="font-mono font-bold text-lg">{c.code}</span>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
            </div>
            <p className="text-sm text-gray-600">{typeLabels[c.type]}: {c.type === 'PERCENTAGE' ? `%${c.value}` : c.type === 'FIXED' ? `₺${c.value}` : 'Ücretsiz Kargo'}</p>
            <p className="text-xs text-gray-500 mt-1">Min: ₺{c.minOrder} • Kullanım: {c._count?.usage || 0}</p>
            <p className="text-xs text-gray-500">Başlangıç: {formatDate(c.startDate)}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="font-semibold">Yeni Kupon</h2><button onClick={() => setShowForm(false)}><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div><label className="text-sm font-medium block mb-1">Kupon Kodu *</label><input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input-field" required /></div>
              <div><label className="text-sm font-medium block mb-1">İndirim Tipi</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field"><option value="PERCENTAGE">Yüzde</option><option value="FIXED">Sabit Tutar</option><option value="FREE_SHIPPING">Ücretsiz Kargo</option></select></div>
              {form.type !== 'FREE_SHIPPING' && <div><label className="text-sm font-medium block mb-1">Değer</label><input type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="input-field" /></div>}
              <div><label className="text-sm font-medium block mb-1">Min. Sepet Tutarı</label><input type="number" value={form.minOrder} onChange={e => setForm({...form, minOrder: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Maks. İndirim</label><input type="number" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Başlangıç Tarihi</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Bitiş Tarihi</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input-field" /></div>
              <div><label className="text-sm font-medium block mb-1">Kullanım Limiti</label><input type="number" value={form.usageLimit} onChange={e => setForm({...form, usageLimit: e.target.value})} className="input-field" /></div>
              <button type="submit" className="btn-primary w-full">Oluştur</button>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 bg-white border border-gray-100 shadow-lg px-5 py-3 rounded-lg text-sm font-medium z-50">{toast}</div>}
    </div>
  );
}
