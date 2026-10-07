'use client';

import { useState } from 'react';
import { Instagram, Mail } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {}
  };

  return (
    <footer className="bg-brand-pink-soft border-t border-brand-pink-light">
      <div className="container-page py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4">CITY <span className="text-brand-pink">NAIL</span></h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              City Nail, premium nail art ürünleri sunan Türk markasıdır. Kalite ve yaratıcılığı bir araya getiriyoruz.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:border-brand-pink hover:text-brand-pink transition-colors">
                <Instagram size={16} />
              </a>
              <a href="mailto:info@citynail.com" className="w-9 h-9 border border-gray-300 flex items-center justify-center hover:border-brand-pink hover:text-brand-pink transition-colors">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Mağaza</h4>
            <ul className="space-y-2">
              <li><a href="/kategori/jel-oje" className="text-sm text-brand-muted hover:text-brand-pink">Jel Oje</a></li>
              <li><a href="/kategori/nail-art" className="text-sm text-brand-muted hover:text-brand-pink">Nail Art</a></li>
              <li><a href="/kategori/araclar-fircalar" className="text-sm text-brand-muted hover:text-brand-pink">Araçlar</a></li>
              <li><a href="/kategori/nail-kitleri" className="text-sm text-brand-muted hover:text-brand-pink">Kitler</a></li>
              <li><a href="/magaza" className="text-sm text-brand-muted hover:text-brand-pink">Tüm Ürünler</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Yardım</h4>
            <ul className="space-y-2">
              <li><a href="/iletisim" className="text-sm text-brand-muted hover:text-brand-pink">İletişim</a></li>
              <li><a href="/hesabim" className="text-sm text-brand-muted hover:text-brand-pink">Sipariş Takibi</a></li>
              <li><a href="/iletisim" className="text-sm text-brand-muted hover:text-brand-pink">İade & Değişim</a></li>
              <li><a href="/blog" className="text-sm text-brand-muted hover:text-brand-pink">Sık Sorulan Sorular</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Nail Topluluğumuza Katıl</h4>
            <p className="text-sm text-brand-muted mb-4">Yeni ürünler, trendler ve özel indirimler için abone ol.</p>
            {subscribed ? (
              <p className="text-sm text-brand-pink font-medium">Aboneliğiniz alındı. Teşekkürler!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="input-field text-sm"
                  required
                />
                <button type="submit" className="btn-pink w-full">ABONE OL</button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-muted">© 2026 City Nail. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-brand-muted hover:text-brand-pink">Gizlilik Politikası</a>
            <a href="#" className="text-xs text-brand-muted hover:text-brand-pink">Kullanım Şartları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
