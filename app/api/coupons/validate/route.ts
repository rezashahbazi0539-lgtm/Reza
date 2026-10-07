import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  const body = await req.json();
  const { code, subtotal } = body;

  if (!code) {
    return NextResponse.json({ error: 'Kupon kodu girin.' }, { status: 400 });
  }

  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || coupon.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Geçersiz kupon kodu.' }, { status: 400 });
  }

  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) {
    return NextResponse.json({ error: 'Bu kupon henüz başlamamış.' }, { status: 400 });
  }
  if (coupon.endDate && now > coupon.endDate) {
    return NextResponse.json({ error: 'Bu kuponun süresi dolmuş.' }, { status: 400 });
  }

  if (subtotal < coupon.minOrder) {
    return NextResponse.json({ error: `Bu kupon için minimum sepet tutarı ₺${coupon.minOrder} olmalıdır.` }, { status: 400 });
  }

  let discount = 0;
  let freeShipping = false;

  if (coupon.type === 'PERCENTAGE') {
    discount = (subtotal * coupon.value) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.type === 'FIXED') {
    discount = coupon.value;
  } else if (coupon.type === 'FREE_SHIPPING') {
    freeShipping = true;
  }

  return NextResponse.json({
    valid: true,
    coupon: { code: coupon.code, type: coupon.type, value: coupon.value, discount, freeShipping },
  });
}
