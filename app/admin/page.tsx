'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, DollarSign } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Yükleniyor...</div>;
  if (!data) return <div className="text-red-500">Veri yüklenemedi.</div>;

  const kpis = data.kpis;
  const cards = [
    { label: 'Toplam Satış', value: formatPrice(kpis.totalSales), icon: DollarSign, color: 'bg-green-500' },
    { label: 'Bugünkü Siparişler', value: `${kpis.todayOrders} Sipariş`, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Toplam Sipariş', value: `${kpis.totalOrders} Sipariş`, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Toplam Müşteri', value: `${kpis.totalCustomers} Müşteri`, icon: Users, color: 'bg-brand-pink' },
    { label: 'Toplam Ürün', value: `${kpis.totalProducts} Ürün`, icon: Package, color: 'bg-orange-500' },
    { label: 'Düşük Stoklu Ürünler', value: `${kpis.lowStockProducts} Düşük Stok`, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Genel Bakış</h1>
        <select value={range} onChange={e => setRange(e.target.value)} className="border border-gray-200 px-3 py-2 text-sm rounded-md outline-none">
          <option value="1">Bugün</option>
          <option value="7">Son 7 Gün</option>
          <option value="30">Son 30 Gün</option>
          <option value="90">Son 90 Gün</option>
          <option value="365">Bu Yıl</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-4 rounded-lg border border-gray-100">
            <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={20} className="text-white" />
            </div>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-lg font-semibold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Satışlar (Son 7 Gün)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => formatPrice(v)} />
              <Bar dataKey="revenue" fill="#E91E63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Sipariş Sayısı (Son 7 Gün)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#1A1A1A" strokeWidth={2} dot={{ fill: '#1A1A1A' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">En Çok Satan Ürünler</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-2 font-medium">Ürün</th>
                <th className="pb-2 font-medium text-right">Satılan Adet</th>
                <th className="pb-2 font-medium text-right">Fiyat</th>
                <th className="pb-2 font-medium text-right">Gelir</th>
              </tr>
            </thead>
            <tbody>
              {data.topProducts.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3 text-right">{p.salesCount}</td>
                  <td className="py-3 text-right">{formatPrice(p.discountPrice || p.price)}</td>
                  <td className="py-3 text-right font-medium">{formatPrice((p.discountPrice || p.price) * p.salesCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
