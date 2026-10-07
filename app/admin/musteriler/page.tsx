'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Search, Eye } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    fetch(`/api/admin/customers?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setCustomers(data.customers || []))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Müşteriler</h1>

      <div className="relative mb-4 max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Müşteri ara..." className="w-full border border-gray-200 pl-10 pr-4 py-2 text-sm rounded-md outline-none focus:border-brand-pink" />
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">E-posta</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Kayıt Tarihi</th>
              <th className="px-4 py-3 font-medium text-center">Sipariş</th>
              <th className="px-4 py-3 font-medium text-right">Toplam Harcama</th>
              <th className="px-4 py-3 font-medium text-center">Durum</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8 text-gray-400">Yükleniyor...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-8 text-gray-400">Müşteri bulunamadı.</td></tr>
            ) : customers.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-gray-600">{c.phone || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-3 text-center">{c.orderCount}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(c.totalSpending)}</td>
                <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
