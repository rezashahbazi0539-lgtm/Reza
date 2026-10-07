import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function PUT(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { name, description, image, seoTitle, seoDescription, displayOrder, status } = body;
  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name, description, image, seoTitle, seoDescription, displayOrder: parseInt(displayOrder) || 0, status },
  });
  return NextResponse.json({ category, message: 'Kategori güncellendi.' });
}

export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Kategori silindi.' });
}
