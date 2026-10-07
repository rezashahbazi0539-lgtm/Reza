import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export async function POST(req) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'E-posta ve şifre girin.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.password)) {
    return NextResponse.json({ error: 'E-posta veya şifre hatalı.' }, { status: 400 });
  }

  if (user.status === 'INACTIVE') {
    return NextResponse.json({ error: 'Hesabınız devre dışı bırakılmış.' }, { status: 403 });
  }

  const token = generateToken(user);
  const response = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone },
    token,
  });
  response.cookies.set('token', token, { httpOnly: true, maxAge: 604800, path: '/' });
  return response;
}
