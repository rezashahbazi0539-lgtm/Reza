import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest, isAdmin } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true, stock: true, lowStockThreshold: true, images: true },
    orderBy: { name: 'asc' },
  });

  const transactions = await prisma.inventoryTransaction.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { name: true } } },
  });

  return NextResponse.json({ products, transactions });
}

export async function POST(req) {
  const user = await getUserFromRequest(req);
  if (!isAdmin(user)) return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });

  const body = await req.json();
  const { productId, change, reason } = body;
  if (!productId || !change || !reason) return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });

  const product = await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: parseInt(change) } },
  });

  await prisma.inventoryTransaction.create({
    data: { productId, change: parseInt(change), reason, adminId: user.id },
  });

  return NextResponse.json({ product, message: 'Stok güncellendi.' });
}
