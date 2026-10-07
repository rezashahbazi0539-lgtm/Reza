import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: true,
      reviews: { where: { status: 'APPROVED' }, orderBy: { createdAt: 'desc' } },
      category: true,
    },
  });

  if (!product || product.status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
  }

  // Get related products from same category
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: 'PUBLISHED',
    },
    include: { images: true, reviews: true },
    take: 4,
  });

  return NextResponse.json({ product, related });
}
