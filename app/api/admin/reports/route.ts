import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const range = parseInt(searchParams.get('range') || '30');
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - range);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: startDate }, status: { not: 'CANCELLED' } },
    include: { items: { include: { product: { include: { category: true } } } } },
    orderBy: { createdAt: 'asc' },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Daily revenue
  const dailyMap = {};
  orders.forEach(o => {
    const d = o.createdAt.toISOString().split('T')[0];
    dailyMap[d] = (dailyMap[d] || 0) + o.total;
  });
  const dailyRevenue = Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }));

  // Category distribution
  const catMap = {};
  orders.forEach(o => o.items.forEach(item => {
    const cat = item.product?.category?.name || 'Diğer';
    catMap[cat] = (catMap[cat] || 0) + item.total;
  }));
  const categoryDistribution = Object.entries(catMap).map(([name, value]) => ({ name, value }));

  // Top products
  const prodMap = {};
  orders.forEach(o => o.items.forEach(item => {
    const name = item.product?.name || 'Bilinmeyen';
    if (!prodMap[name]) prodMap[name] = { name, salesCount: 0, revenue: 0 };
    prodMap[name].salesCount += item.quantity;
    prodMap[name].revenue += item.total;
  }));
  const topProducts = Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  return NextResponse.json({ totalRevenue, totalOrders, avgOrderValue, dailyRevenue, categoryDistribution, topProducts });
}
