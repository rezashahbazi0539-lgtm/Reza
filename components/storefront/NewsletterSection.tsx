'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterSection({ data }) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      setDone(true);
      setEmail('');
    } catch {}
  };

  return (
    <section className="bg-brand-pink-soft section-padding">
      <div className="container-page text-center max-w-2xl mx-auto">
        <Mail size={32} className="text-brand-pink mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-3">{data?.title || 'Nail Topluluğumuza Katıl'}</h2>
        <p className="text-brand-muted mb-6">{data?.description || 'Yeni ürünler, trendler ve özel indirimler için abone ol.'}</p>
        {done ? (
          <p className="text-brand-pink font-medium">Aboneliğiniz alındı. Teşekkürler!</p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta adresiniz" className="input-field flex-1" required />
            <button type="submit" className="btn-pink whitespace-nowrap">ABONE OL</button>
          </form>
        )}
      </div>
    </section>
  );
}
