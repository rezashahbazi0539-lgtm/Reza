import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';
  const search = searchParams.get('search') || '';

  let where = {};
  if (status) where.status = status;
  if (search) where.OR = [{ orderNumber: { contains: search } }, { customerName: { contains: search } }, { customerEmail: { contains: search } }];

  const orders = await prisma.order.findMany({
    where,
    include: { items: { include: { product: { include: { images: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}
