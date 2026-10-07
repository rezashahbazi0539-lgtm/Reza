import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) {
    return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  }

  const [totalSales, todayOrders, totalOrders, totalCustomers, totalProducts, lowStockProducts, orders] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: 10 } } }),
    prisma.order.findMany({
      where: { status: { not: 'CANCELLED' } },
      orderBy: { createdAt: 'desc' },
      take: 30,
      select: { total: true, createdAt: true },
    }),
  ]);

  // Daily revenue for last 7 days
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    const dayOrders = orders.filter(o => o.createdAt >= date && o.createdAt < nextDate);
    last7Days.push({
      date: date.toISOString().split('T')[0],
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    });
  }

  // Top selling products
  const topProducts = await prisma.product.findMany({
    orderBy: { salesCount: 'desc' },
    take: 5,
    select: { id: true, name: true, price: true, discountPrice: true, salesCount: true },
  });

  return NextResponse.json({
    kpis: {
      totalSales: totalSales._sum.total || 0,
      todayOrders,
      totalOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
    },
    chartData: last7Days,
    topProducts,
  });
}
