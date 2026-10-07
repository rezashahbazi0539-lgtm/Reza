'use client';

import { useState } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { useStore } from '@/components/StoreContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { login, showToast } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name) err.name = 'Bu alan zorunludur.';
    if (!form.email) err.email = 'Lütfen e-posta adresinizi girin.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) err.email = 'Lütfen geçerli bir e-posta adresi girin.';
    if (!form.password) err.password = 'Şifrenizi girin.';
    else if (form.password.length < 6) err.password = 'Şifre en az 6 karakter olmalıdır.';
    if (form.password !== form.confirmPassword) err.confirmPassword = 'Şifreler eşleşmiyor.';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        localStorage.setItem('citynail_token', data.token);
        showToast('Kayıt başarılı. Hoş geldiniz!');
        router.push('/hesabim');
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
          <h1 className="text-3xl font-serif font-medium mb-2 text-center">Kayıt Ol</h1>
          <p className="text-center text-brand-muted text-sm mb-8">Yeni hesap oluşturun</p>

          {errors.general && <div className="bg-red-50 text-red-600 text-sm p-3 mb-4 text-center">{errors.general}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Ad Soyad</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Adınız Soyadınız" />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">E-posta</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="ornek@email.com" />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Telefon</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="05XX XXX XX XX" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Şifre</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="input-field" placeholder="••••••" />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Şifre Tekrar</label>
              <input type="password" value={form.confirmPassword} onChange={e => setForm({...form, confirmPassword: e.target.value})} className="input-field" placeholder="••••••" />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Kayıt yapılıyor...' : 'KAYIT OL'}</button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Zaten hesabınız var mı? <Link href="/giris" className="text-brand-pink font-medium">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </StorefrontLayout>
  );
}
