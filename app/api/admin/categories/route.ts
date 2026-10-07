import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { name, description, image, seoTitle, seoDescription, displayOrder, status } = body;
  if (!name) return NextResponse.json({ error: 'Kategori adı gerekli.' }, { status: 400 });

  const category = await prisma.category.create({
    data: { name, slug: slugify(name), description, image, seoTitle, seoDescription, displayOrder: parseInt(displayOrder) || 0, status: status || 'ACTIVE' },
  });
  return NextResponse.json({ category, message: 'Kategori oluşturuldu.' });
}
