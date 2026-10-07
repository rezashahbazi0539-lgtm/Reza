'use client';

import { useState } from 'react';
import StorefrontLayout from '@/components/StorefrontLayout';
import { useStore } from '@/components/StoreContext';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { CheckCircle, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const { cart, cartSubtotal, coupon, clearCart, user } = useStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    shippingMethod: 'standard',
    paymentMethod: 'CASH_ON_DELIVERY',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const discount = coupon?.discount || 0;
  const freeShippingThreshold = 750;
  const shippingBase = coupon?.freeShipping ? 0 : (cartSubtotal >= freeShippingThreshold ? 0 : 49);
  const expressShipping = 99;
  const shipping = form.shippingMethod === 'express' ? expressShipping : shippingBase;
  const total = cartSubtotal - discount + shipping;

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = 'Bu alan zorunludur.';
    if (!form.lastName) e.lastName = 'Bu alan zorunludur.';
    if (!form.phone) e.phone = 'Bu alan zorunludur.';
    else if (!/^[0-9\s+]{10,}$/.test(form.phone)) e.phone = 'Geçerli bir telefon numarası girin.';
    if (!form.email) e.email = 'Bu alan zorunludur.';
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = 'Lütfen geçerli bir e-posta adresi girin.';
    if (!form.address) e.address = 'Bu alan zorunludur.';
    if (!form.city) e.city = 'Bu alan zorunludur.';
    if (!form.district) e.district = 'Bu alan zorunludur.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customer: form,
          couponCode: coupon?.code,
          shipping,
          paymentMethod: form.paymentMethod,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrderResult(data.order);
        clearCart();
        setStep(6);
      }
    } catch {}
    setSubmitting(false);
  };

  // Success page
  if (orderResult) {
    return (
      <StorefrontLayout>
        <div className="container-page section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-serif font-medium mb-2">Siparişiniz Alındı</h1>
            <p className="text-brand-muted mb-2">Teşekkür ederiz.</p>
            <p className="text-sm text-brand-muted mb-8">Sipariş Numarası: <strong className="text-brand-dark">{orderResult.orderNumber}</strong></p>

            <div className="bg-brand-pink-soft p-6 text-left mb-6">
              <h2 className="font-semibold mb-4">Sipariş Özeti</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-brand-muted">Ara Toplam</span><span>{formatPrice(orderResult.subtotal)}</span></div>
                {orderResult.discount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{formatPrice(orderResult.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-brand-muted">Kargo</span><span>{orderResult.shipping === 0 ? 'Ücretsiz' : formatPrice(orderResult.shipping)}</span></div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200"><span>Toplam</span><span>{formatPrice(orderResult.total)}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-brand-muted">Teslimat Adresi:</p>
                <p className="text-sm">{orderResult.shippingAddress}</p>
                <p className="text-sm text-brand-muted mt-2">Tahmini Teslimat: 2-4 iş günü</p>
              </div>
            </div>

            <Link href="/hesabim" className="btn-primary">SİPARİŞLERİMİ GÖR</Link>
            <Link href="/magaza" className="block mt-4 text-sm text-brand-muted hover:text-brand-pink">Alışverişe Devam Et</Link>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (cart.length === 0 && !orderResult) {
    return (
      <StorefrontLayout>
        <div className="container-page section-padding text-center">
          <p className="text-lg mb-4">Sepetiniz şu anda boş.</p>
          <Link href="/magaza" className="btn-primary">ALIŞVERİŞE BAŞLA</Link>
        </div>
      </StorefrontLayout>
    );
  }

  const steps = ['Sepet', 'Teslimat Bilgileri', 'Kargo', 'Ödeme', 'Sipariş Özeti'];

  return (
    <StorefrontLayout>
      <div className="container-page section-padding">
        <h1 className="text-3xl font-serif font-medium mb-8 text-center">Ödeme</h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex items-center gap-2 ${step >= i + 1 ? 'text-brand-pink' : 'text-brand-muted'}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${step >= i + 1 ? 'bg-brand-pink text-white' : 'bg-gray-100'}`}>
                  {i + 1}
                </span>
                <span className="text-sm font-medium hidden md:block">{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`w-8 md:w-16 h-px mx-2 ${step > i + 1 ? 'bg-brand-pink' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Cart review */}
            {step === 1 && (
              <div>
                <h2 className="font-semibold mb-4">Sepetiniz</h2>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-brand-pink-soft" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-brand-muted">{item.quantity} adet × {formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6">Devam Et</button>
              </div>
            )}

            {/* Step 2: Delivery info */}
            {step === 2 && (
              <div>
                <h2 className="font-semibold mb-4">Teslimat Bilgileri</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Ad *</label>
                    <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input-field" />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Soyad *</label>
                    <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input-field" />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Telefon *</label>
                    <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" placeholder="05XX XXX XX XX" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">E-posta *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium block mb-1">Adres *</label>
                    <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field" placeholder="Mahalle, sokak, no" />
                    {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">İl *</label>
                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-field" placeholder="İstanbul" />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">İlçe *</label>
                    <input value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="input-field" placeholder="Kadıköy" />
                    {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Posta Kodu</label>
                    <input value={form.postalCode} onChange={e => setForm({...form, postalCode: e.target.value})} className="input-field" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-secondary">Geri</button>
                  <button onClick={() => { if (validate()) setStep(3); }} className="btn-primary">Devam Et</button>
                </div>
              </div>
            )}

            {/* Step 3: Shipping */}
            {step === 3 && (
              <div>
                <h2 className="font-semibold mb-4">Kargo Seçenekleri</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border cursor-pointer ${form.shippingMethod === 'standard' ? 'border-brand-pink bg-brand-pink-soft' : 'border-gray-200'}`}>
                    <input type="radio" name="shipping" value="standard" checked={form.shippingMethod === 'standard'} onChange={e => setForm({...form, shippingMethod: e.target.value})} className="accent-brand-pink" />
                    <Truck size={20} className="text-brand-pink" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Standart Kargo</p>
                      <p className="text-xs text-brand-muted">2-4 iş günü</p>
                    </div>
                    <p className="text-sm font-semibold">{shippingBase === 0 ? 'Ücretsiz' : formatPrice(shippingBase)}</p>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border cursor-pointer ${form.shippingMethod === 'express' ? 'border-brand-pink bg-brand-pink-soft' : 'border-gray-200'}`}>
                    <input type="radio" name="shipping" value="express" checked={form.shippingMethod === 'express'} onChange={e => setForm({...form, shippingMethod: e.target.value})} className="accent-brand-pink" />
                    <Truck size={20} className="text-brand-pink" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Hızlı Kargo</p>
                      <p className="text-xs text-brand-muted">1-2 iş günü</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(expressShipping)}</p>
                  </label>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="btn-secondary">Geri</button>
                  <button onClick={() => setStep(4)} className="btn-primary">Devam Et</button>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div>
                <h2 className="font-semibold mb-4">Ödeme Yöntemi</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border cursor-pointer ${form.paymentMethod === 'CASH_ON_DELIVERY' ? 'border-brand-pink bg-brand-pink-soft' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" value="CASH_ON_DELIVERY" checked={form.paymentMethod === 'CASH_ON_DELIVERY'} onChange={e => setForm({...form, paymentMethod: e.target.value})} className="accent-brand-pink" />
                    <CreditCard size={20} className="text-brand-pink" />
                    <div>
                      <p className="text-sm font-medium">Kapıda Ödeme</p>
                      <p className="text-xs text-brand-muted">Sipariş tesliminde ödeme yapın</p>
                    </div>
                  </label>
                  <div className="p-4 border border-dashed border-gray-200">
                    <p className="text-sm text-brand-muted">Kredi kartı ile ödeme yakında aktif olacaktır. (iyzico, PayTR entegrasyonu hazırlanıyor)</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(3)} className="btn-secondary">Geri</button>
                  <button onClick={() => setStep(5)} className="btn-primary">Devam Et</button>
                </div>
              </div>
            )}

            {/* Step 5: Summary */}
            {step === 5 && (
              <div>
                <h2 className="font-semibold mb-4">Sipariş Özeti</h2>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <p className="text-sm font-medium mb-1">Teslimat Adresi</p>
                    <p className="text-sm text-brand-muted">{form.firstName} {form.lastName}</p>
                    <p className="text-sm text-brand-muted">{form.phone}</p>
                    <p className="text-sm text-brand-muted">{form.address}, {form.district}, {form.city} {form.postalCode}</p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <p className="text-sm font-medium mb-1">Kargo</p>
                    <p className="text-sm text-brand-muted">{form.shippingMethod === 'express' ? 'Hızlı Kargo (1-2 iş günü)' : 'Standart Kargo (2-4 iş günü)'}</p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <p className="text-sm font-medium mb-1">Ödeme</p>
                    <p className="text-sm text-brand-muted">Kapıda Ödeme</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Ürünler</p>
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm mb-1">
                        <span className="text-brand-muted">{item.name} × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(4)} className="btn-secondary">Geri</button>
                  <button onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1">{submitting ? 'İşleniyor...' : 'SİPARİŞİ TAMAMLA'}</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-brand-pink-soft p-6 sticky top-24">
              <h2 className="font-semibold mb-4">Özet</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-brand-muted">Ara Toplam</span><span>{formatPrice(cartSubtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>İndirim</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-brand-muted">Kargo</span><span>{shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200"><span>Toplam</span><span>{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
