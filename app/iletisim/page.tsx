'use client';

import StorefrontLayout from '@/components/StorefrontLayout';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-2">İletişim</h1>
          <p className="text-brand-muted">Sorularınız için bize ulaşın</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <Phone size={20} className="text-brand-pink mt-1" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <p className="text-sm text-brand-muted">+90 212 555 00 00</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-brand-pink mt-1" />
              <div>
                <p className="text-sm font-medium">E-posta</p>
                <p className="text-sm text-brand-muted">info@citynail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-brand-pink mt-1" />
              <div>
                <p className="text-sm font-medium">Adres</p>
                <p className="text-sm text-brand-muted">Bağdat Caddesi No:123, Kadıköy, İstanbul</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-brand-pink mt-1" />
              <div>
                <p className="text-sm font-medium">Çalışma Saatleri</p>
                <p className="text-sm text-brand-muted">Pazartesi - Cumartesi: 09:00 - 19:00</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {sent ? (
              <div className="text-center py-8">
                <p className="text-lg font-medium text-brand-pink mb-2">Mesajınız alındı!</p>
                <p className="text-sm text-brand-muted">En kısa sürede size geri döneceğiz.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Ad Soyad</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">E-posta</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" required />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Mesaj</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="input-field" required />
                </div>
                <button type="submit" className="btn-primary w-full">GÖNDER</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
