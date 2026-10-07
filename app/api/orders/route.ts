import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Giriş yapın.' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: { include: { images: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}

export async function POST(req) {
  const body = await req.json();
  const { items, customer, shippingAddress, couponCode, shipping, paymentMethod } = body;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Sepetiniz boş.' }, { status: 400 });
  }

  const user = await getUserFromRequest(req);

  // Calculate totals
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.id } });
    if (!product) continue;
    const price = product.discountPrice || product.price;
    subtotal += price * item.quantity;
    orderItems.push({ productId: product.id, quantity: item.quantity, unitPrice: price, total: price * item.quantity });
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.status === 'ACTIVE') {
      if (coupon.type === 'PERCENTAGE') {
        discount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      } else if (coupon.type === 'FIXED') {
        discount = coupon.value;
      }
      await prisma.couponUsage.create({ data: { couponId: coupon.id, userId: user?.id } });
    }
  }

  const shippingCost = shipping || (subtotal >= 750 ? 0 : 49);
  const total = subtotal - discount + shippingCost;

  const orderNumber = `CN${String(Date.now()).slice(-6)}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: user?.id,
      status: 'NEW',
      paymentStatus: 'PENDING',
      paymentMethod: paymentMethod || 'CASH_ON_DELIVERY',
      subtotal,
      discount,
      shipping: shippingCost,
      total,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: `${customer.address}, ${customer.district}, ${customer.city}, ${customer.postalCode}`,
      billingAddress: `${customer.address}, ${customer.district}, ${customer.city}, ${customer.postalCode}`,
      couponCode,
      items: { create: orderItems },
    },
  });

  // Update product stock and sales count
  for (const item of orderItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity }, salesCount: { increment: item.quantity } },
    });
  }

  // Create admin notification
  const admins = await prisma.user.findMany({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } });
  for (const admin of admins) {
    await prisma.notification.create({ data: { type: 'NEW_ORDER', message: `Yeni sipariş alındı: ${orderNumber}`, userId: admin.id } });
  }

  return NextResponse.json({ order, message: 'Siparişiniz alındı.' });
}
