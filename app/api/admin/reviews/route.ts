import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';

  let where = {};
  if (status) where.status = status;

  const reviews = await prisma.review.findMany({
    where,
    include: { product: { select: { name: true, images: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ reviews });
}

export async function PUT(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { id, status } = body;

  const review = await prisma.review.update({ where: { id }, data: { status } });
  return NextResponse.json({ review, message: 'Yorum güncellendi.' });
}

export async function DELETE(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ message: 'Yorum silindi.' });
}
