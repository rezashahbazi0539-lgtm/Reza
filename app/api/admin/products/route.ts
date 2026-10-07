import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';

  let where = {};
  if (search) where.OR = [{ name: { contains: search } }, { sku: { contains: search } }];
  if (category) where.category = { slug: category };
  if (status) where.status = status;

  const products = await prisma.product.findMany({
    where,
    include: { images: true, category: true, _count: { select: { orderItems: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ products });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { name, sku, price, discountPrice, cost, stock, lowStockThreshold, brand, tags,
    shortDescription, description, categoryId, isBestSeller, isNew, isFeatured, isOnSale,
    status, ingredients, usageInstructions, features, seoTitle, metaDescription, metaKeywords,
    images, videoUrl } = body;

  if (!name || !sku || !price || !categoryId) {
    return NextResponse.json({ error: 'Gerekli alanları doldurun.' }, { status: 400 });
  }

  const slug = body.slug || slugify(name);

  const product = await prisma.product.create({
    data: {
      name, slug, sku, price: parseFloat(price), discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      cost: cost ? parseFloat(cost) : null, stock: parseInt(stock) || 0, lowStockThreshold: parseInt(lowStockThreshold) || 10,
      brand, tags, shortDescription, description, categoryId,
      isBestSeller: !!isBestSeller, isNew: !!isNew, isFeatured: !!isFeatured, isOnSale: !!isOnSale,
      status: status || 'DRAFT', ingredients, usageInstructions, features,
      seoTitle, metaDescription, metaKeywords, videoUrl,
      images: images?.length ? { create: images.map((img, i) => ({ url: img, isPrimary: i === 0, displayOrder: i })) } : undefined,
    },
    include: { images: true, category: true },
  });

  if (stock > 0) {
    await prisma.inventoryTransaction.create({
      data: { productId: product.id, change: parseInt(stock), reason: 'Başlangıç stoku', adminId: user.id },
    });
  }

  return NextResponse.json({ product, message: 'Ürün başarıyla oluşturuldu.' });
}
