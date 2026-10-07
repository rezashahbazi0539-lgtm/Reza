import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'recommended';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '0');
  const inStock = searchParams.get('inStock') === 'true';
  const isBestSeller = searchParams.get('isBestSeller') === 'true';
  const isNew = searchParams.get('isNew') === 'true';
  const isFeatured = searchParams.get('isFeatured') === 'true';
  const limit = parseInt(searchParams.get('limit') || '0');
  const page = parseInt(searchParams.get('page') || '1');
  const brand = searchParams.get('brand') || '';

  let where = { status: 'PUBLISHED' };

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { sku: { contains: search } },
      { tags: { contains: search } },
      { brand: { contains: search } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (minPrice > 0 || maxPrice > 0) {
    where.AND = [];
    if (minPrice > 0) where.AND.push({ OR: [{ price: { gte: minPrice } }, { discountPrice: { gte: minPrice } }] });
    if (maxPrice > 0) where.AND.push({ OR: [{ price: { lte: maxPrice } }, { discountPrice: { lte: maxPrice } }] });
  }

  if (inStock) where.stock = { gt: 0 };
  if (isBestSeller) where.isBestSeller = true;
  if (isNew) where.isNew = true;
  if (isFeatured) where.isFeatured = true;
  if (brand) where.brand = { contains: brand };

  let orderBy = { createdAt: 'desc' };
  if (sort === 'bestSelling') orderBy = { salesCount: 'desc' };
  if (sort === 'priceLow') { where.OR = [...(where.OR || []), {}]; orderBy = { price: 'asc' }; }
  if (sort === 'priceHigh') orderBy = { price: 'desc' };

  const take = limit || 12;
  const skip = (page - 1) * take;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { images: true, reviews: true, category: true },
      orderBy,
      take,
      skip: limit ? 0 : skip,
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / take) });
}
