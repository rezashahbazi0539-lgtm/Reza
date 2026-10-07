import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const sections = await prisma.homepageSection.findMany({ orderBy: { displayOrder: 'asc' } });
  return NextResponse.json({ sections });
}

export async function PUT(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
  const body = await req.json();
  const { id, status, content, displayOrder } = body;
  const updateData = {};
  if (status) updateData.status = status;
  if (content !== undefined) updateData.content = content;
  if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder);
  const section = await prisma.homepageSection.update({ where: { id }, data: updateData });
  return NextResponse.json({ section, message: 'Bölüm güncellendi.' });
}
