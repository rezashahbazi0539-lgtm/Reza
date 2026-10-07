'use client';

import { useState, useEffect } from 'react';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Search, Eye } from 'lucide-react';

const statusLabels = { NEW: 'Yeni', CONFIRMED: 'Onaylandı', PREPARING: 'Hazırlanıyor', SHIPPED: 'Kargoya Verildi', DELIVERED: 'Teslim Edildi', CANCELLED: 'İptal Edildi', REFUNDED: 'İade Edildi' };
const statusColors = { NEW: 'bg-blue-100 text-blue-700', CONFIRMED: 'bg-purple-100 text-purple-700', PREPARING: 'bg-yellow-100 text-yellow-700', SHIPPED: 'bg-indigo-100 text-indigo-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700', REFUNDED: 'bg-gray-100 text-gray-700' };
const payLabels = { PENDING: 'Bekliyor', PAID: 'Ödendi', FAILED: 'Başarısız', REFUNDED: 'İade Edildi' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    fetch(`/api/admin/orders?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Siparişler</h1>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sipariş no veya müşteri ara..." className="w-full border border-gray-200 pl-10 pr-4 py-2 text-sm rounded-md outline-none focus:border-brand-pink" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 px-3 py-2 text-sm rounded-md outline-none">
          <option value="">Tüm Durumlar</option>
          {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
              <th className="px-4 py-3 font-medium">Sipariş No</th>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Tarih</th>
              <th className="px-4 py-3 font-medium text-center">Ürün</th>
              <th className="px-4 py-3 font-medium text-right">Toplam</th>
              <th className="px-4 py-3 font-medium text-center">Ödeme</th>
              <th className="px-4 py-3 font-medium text-center">Durum</th>
              <th className="px-4 py-3 font-medium text-center">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-8 text-gray-400">Yükleniyor...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-8 text-gray-400">Sipariş bulunamadı.</td></tr>
            ) : orders.map(o => (
              <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-3">{o.customerName}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(o.createdAt)}</td>
                <td className="px-4 py-3 text-center">{o.items.length}</td>
                <td className="px-4 py-3 text-right font-medium">{formatPrice(o.total)}</td>
                <td className="px-4 py-3 text-center"><span className="text-xs text-gray-600">{payLabels[o.paymentStatus]}</span></td>
                <td className="px-4 py-3 text-center"><span className={`text-xs px-2 py-1 rounded-full ${statusColors[o.status]}`}>{statusLabels[o.status]}</span></td>
                <td className="px-4 py-3 text-center">
                  <Link href={`/admin/siparisler/${o.id}`} className="text-gray-500 hover:text-brand-pink inline-block"><Eye size={16} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
