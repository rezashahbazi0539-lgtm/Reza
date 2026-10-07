import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const banners = await prisma.banner.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json({ banners });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const body = await req.json();
  const banner = await prisma.banner.create({
    data: { ...body, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null },
  });
  return NextResponse.json({ banner, message: 'Banner oluşturuldu.' });
}

export async function DELETE(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await prisma.banner.delete({ where: { id } });
  return NextResponse.json({ message: 'Banner silindi.' });
}
