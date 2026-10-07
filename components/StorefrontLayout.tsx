'use client';

import Header from './storefront/Header';
import Footer from './storefront/Footer';
import CartDrawer from './storefront/CartDrawer';
import SearchModal from './storefront/SearchModal';
import Toast from './storefront/Toast';

export default function StorefrontLayout({ children }) {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      <CartDrawer />
      <SearchModal />
      <Toast />
    </>
  );
}
