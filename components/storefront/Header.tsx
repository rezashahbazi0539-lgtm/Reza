'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useStore } from '../StoreContext';

const navLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/magaza', label: 'Mağaza' },
  { href: '/kategori/jel-oje', label: 'Jel Oje' },
  { href: '/kategori/nail-art', label: 'Nail Art' },
  { href: '/kategori/press-on-nails', label: 'Press On' },
  { href: '/kategori/nail-kitleri', label: 'Kitler' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const { cartCount, wishlistCount, user, setCartOpen, setSearchOpen, setMobileMenuOpen, mobileMenuOpen } = useStore();

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-brand-pink-light text-center py-2 px-4">
        <p className="text-xs font-medium text-brand-dark tracking-wide">
          750 ₺ ve üzeri siparişlerde ÜCRETSİZ KARGO • İlk siparişe özel %10 indirim: WELCOME10
        </p>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="container-page">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menüyü aç"
            >
              <Menu size={22} />
            </button>

            {/* Logo */}
            <Link href="/" className="flex-1 md:flex-none text-center md:text-left">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-brand-dark">
                CITY <span className="text-brand-pink">NAIL</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4 flex-1 md:flex-none justify-end">
              <button onClick={() => setSearchOpen(true)} aria-label="Ara" className="hover:text-brand-pink transition-colors">
                <Search size={20} />
              </button>
              <Link href={user ? '/hesabim' : '/giris'} aria-label="Hesabım" className="hidden sm:block hover:text-brand-pink transition-colors">
                <User size={20} />
              </Link>
              <Link href="/favorilerim" aria-label="Favoriler" className="relative hover:text-brand-pink transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button onClick={() => setCartOpen(true)} aria-label="Sepet" className="relative hover:text-brand-pink transition-colors">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85%] bg-white p-6 overflow-y-auto animate-slide-in-right">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold">CITY <span className="text-brand-pink">NAIL</span></span>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Kapat"><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="text-base font-medium hover:text-brand-pink" onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link href={user ? '/hesabim' : '/giris'} className="text-base font-medium hover:text-brand-pink" onClick={() => setMobileMenuOpen(false)}>
                Hesabım
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
