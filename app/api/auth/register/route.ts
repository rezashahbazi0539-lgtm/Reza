import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { email, password, name, phone } = body;

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Şifre en az 6 karakter olmalıdır.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 400 });
  }

  const user = await prisma.user.create({
    data: { email, password: hashPassword(password), name, phone, role: 'CUSTOMER' },
  });

  const token = generateToken(user);
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    token,
  });
  response.cookies.set('token', token, { httpOnly: true, maxAge: 604800, path: '/' });
  return response;
}
