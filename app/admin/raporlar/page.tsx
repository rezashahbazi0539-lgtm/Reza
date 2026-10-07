'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30');

  useEffect(() => {
    const token = localStorage.getItem('citynail_token');
    fetch(`/api/admin/reports?range=${range}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  if (loading) return <div className="text-gray-400">Yükleniyor...</div>;
  if (!data) return <div className="text-red-500">Veri yüklenemedi.</div>;

  const COLORS = ['#E91E63', '#1A1A1A', '#FCE5E5', '#737373', '#FEF5F5'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Raporlar</h1>
        <select value={range} onChange={e => setRange(e.target.value)} className="border border-gray-200 px-3 py-2 text-sm rounded-md outline-none">
          <option value="1">Bugün</option>
          <option value="7">Son 7 Gün</option>
          <option value="30">Son 30 Gün</option>
          <option value="90">Son 90 Gün</option>
          <option value="365">Bu Yıl</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-xs text-gray-500">Toplam Gelir</p><p className="text-xl font-semibold">{formatPrice(data.totalRevenue)}</p></div>
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-xs text-gray-500">Toplam Sipariş</p><p className="text-xl font-semibold">{data.totalOrders}</p></div>
        <div className="bg-white rounded-lg border border-gray-100 p-4"><p className="text-xs text-gray-500">Ortalama Sipariş Değeri</p><p className="text-xl font-semibold">{formatPrice(data.avgOrderValue)}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Günlük Gelir</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={v => formatPrice(v)} />
              <Bar dataKey="revenue" fill="#E91E63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-lg border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Kategori Dağılımı</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {data.categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">En Çok Satan Ürünler</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-500 border-b border-gray-100">
            <th className="pb-2 font-medium">Ürün</th><th className="pb-2 font-medium text-right">Satılan</th><th className="pb-2 font-medium text-right">Gelir</th>
          </tr></thead>
          <tbody>
            {data.topProducts.map((p, i) => (
              <tr key={i} className="border-b border-gray-50"><td className="py-3">{p.name}</td><td className="py-3 text-right">{p.salesCount}</td><td className="py-3 text-right font-medium">{formatPrice(p.revenue)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
