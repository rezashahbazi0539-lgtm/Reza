import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: { include: { images: true } } } }, user: true },
  });
  if (!order) return NextResponse.json({ error: 'Sipariş bulunamadı.' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { status, paymentStatus, notes } = body;

  const updateData = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.paymentStatus = paymentStatus;
  if (notes !== undefined) updateData.notes = notes;

  const order = await prisma.order.update({ where: { id: params.id }, data: updateData });
  return NextResponse.json({ order, message: 'Sipariş durumu güncellendi.' });
}
