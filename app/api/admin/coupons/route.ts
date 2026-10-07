import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' }, include: { _count: { select: { usage: true } } } });
  return NextResponse.json({ coupons });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { code, type, value, minOrder, maxDiscount, startDate, endDate, usageLimit, perCustomerLimit, status } = body;
  if (!code || !type) return NextResponse.json({ error: 'Kupon kodu ve tipi gerekli.' }, { status: 400 });

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(), type, value: parseFloat(value) || 0,
      minOrder: parseFloat(minOrder) || 0, maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null, perCustomerLimit: perCustomerLimit ? parseInt(perCustomerLimit) : null,
      status: status || 'ACTIVE',
    },
  });
  return NextResponse.json({ coupon, message: 'Kupon oluşturuldu.' });
}
