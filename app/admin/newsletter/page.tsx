'use client';

import { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Mail, Users, UserMinus } from 'lucide-react';

export default function AdminNewsletter() {
  const [data, setData] = useState({ subscribers: [], stats: { total: 0, active: 0, unsubscribed: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/newsletter', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Newsletter</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center gap-3"><Users size={20} className="text-brand-pink" /><div><p className="text-xs text-gray-500">Toplam Abone</p><p className="text-xl font-semibold">{data.stats.total}</p></div></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center gap-3"><Mail size={20} className="text-green-500" /><div><p className="text-xs text-gray-500">Aktif</p><p className="text-xl font-semibold">{data.stats.active}</p></div></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center gap-3"><UserMinus size={20} className="text-red-500" /><div><p className="text-xs text-gray-500">Abonelikten Çıkan</p><p className="text-xl font-semibold">{data.stats.unsubscribed}</p></div></div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 border-b border-gray-100">
            <th className="px-4 py-3 font-medium">E-posta</th>
            <th className="px-4 py-3 font-medium">Ad</th>
            <th className="px-4 py-3 font-medium">Tarih</th>
            <th className="px-4 py-3 font-medium text-center">Durum</th>
          </tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="4" className="text-center py-8 text-gray-400">Yükleniyor...</td></tr> : data.subscribers.map(s => (
              <tr key={s.id} className="border-b border-gray-50">
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 text-gray-600">{s.name || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(s.subscribedAt)}</td>
                <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.status === 'ACTIVE' ? 'Aktif' : 'Çıktı'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
