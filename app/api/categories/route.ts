import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { displayOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}
