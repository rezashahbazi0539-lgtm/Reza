import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function PUT(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const coupon = await prisma.coupon.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ coupon, message: 'Kupon güncellendi.' });
}

export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  await prisma.coupon.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Kupon silindi.' });
}
