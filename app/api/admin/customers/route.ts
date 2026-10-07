import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';

  let where = { role: 'CUSTOMER' };
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }];

  const customers = await prisma.user.findMany({
    where,
    include: {
      orders: { select: { total: true, status: true } },
      _count: { select: { reviews: true, wishlist: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const result = customers.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    status: c.status,
    createdAt: c.createdAt,
    orderCount: c.orders.length,
    totalSpending: c.orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0),
    reviewCount: c._count.reviews,
    wishlistCount: c._count.wishlist,
  }));

  return NextResponse.json({ customers: result });
}
