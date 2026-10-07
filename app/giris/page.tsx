'use client';

import { useState } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { useStore } from '@/components/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, showToast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.email) err.email = 'Lütfen e-posta adresinizi girin.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) err.email = 'Lütfen geçerli bir e-posta adresi girin.';
    if (!form.password) err.password = 'Şifrenizi girin.';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        localStorage.setItem('citynail_token', data.token);
        showToast('Giriş başarılı.');
        if (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/hesabim');
        }
      } else {
        setErrors({ general: data.error });
      }
    } catch {
      setErrors({ general: 'Bir hata oluştu.' });
    }
    setLoading(false);
  };

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-serif font-medium mb-2 text-center">Giriş Yap</h1>
          <p className="text-center text-brand-muted text-sm mb-8">Hesabınıza giriş yapın</p>

          {errors.general && <div className="bg-red-50 text-red-600 text-sm p-3 mb-4 text-center">{errors.general}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">E-posta</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="ornek@email.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Şifre</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" placeholder="••••••" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Giriş yapılıyor...' : 'GİRİŞ YAP'}</button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Hesabınız yok mu? <Link href="/kayit" className="text-brand-pink font-medium">Kayıt Ol</Link>
          </p>

          <div className="mt-6 p-4 bg-brand-pink-soft text-sm text-brand-muted">
            <p className="font-medium text-brand-dark mb-1">Demo Hesaplar:</p>
            <p>Admin: admin@citynail.com / admin123</p>
            <p>Müşteri: zeynep@example.com / user123</p>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
