import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { images: true, category: true, reviews: true, inventoryTxns: { take: 10, orderBy: { createdAt: 'desc' } } },
  });
  if (!product) return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { name, sku, price, discountPrice, cost, stock, lowStockThreshold, brand, tags,
    shortDescription, description, categoryId, isBestSeller, isNew, isFeatured, isOnSale,
    status, ingredients, usageInstructions, features, seoTitle, metaDescription, metaKeywords,
    images, videoUrl } = body;

  const updateData = {
    name, sku, price: parseFloat(price), discountPrice: discountPrice ? parseFloat(discountPrice) : null,
    cost: cost ? parseFloat(cost) : null, stock: parseInt(stock) || 0, lowStockThreshold: parseInt(lowStockThreshold) || 10,
    brand, tags, shortDescription, description, categoryId,
    isBestSeller: !!isBestSeller, isNew: !!isNew, isFeatured: !!isFeatured, isOnSale: !!isOnSale,
    status, ingredients, usageInstructions, features, seoTitle, metaDescription, metaKeywords, videoUrl,
  };
  if (body.slug) updateData.slug = body.slug;

  const product = await prisma.product.update({
    where: { id: params.id },
    data: updateData,
    include: { images: true, category: true },
  });

  if (images && images.length >= 0) {
    await prisma.productImage.deleteMany({ where: { productId: params.id } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url, i) => ({ productId: params.id, url, isPrimary: i === 0, displayOrder: i })),
      });
    }
  }

  return NextResponse.json({ product, message: 'Ürün başarıyla güncellendi.' });
}

export async function DELETE(req, { params }) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Ürün başarıyla silindi.' });
}
