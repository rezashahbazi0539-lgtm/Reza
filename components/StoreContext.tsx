'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [toast, setToast] = useState(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('citynail_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedWishlist = localStorage.getItem('citynail_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      const savedUser = localStorage.getItem('citynail_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      const savedCoupon = localStorage.getItem('citynail_coupon');
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    } catch {}
  }, []);

  // Persist
  useEffect(() => { localStorage.setItem('citynail_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('citynail_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { if (user) localStorage.setItem('citynail_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { if (coupon) localStorage.setItem('citynail_coupon', JSON.stringify(coupon)); else localStorage.removeItem('citynail_coupon'); }, [coupon]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: product.id, name: product.name, slug: product.slug, price: product.discountPrice || product.price, image: product.images?.[0]?.url || product.image, quantity }];
    });
    showToast('Ürün sepete eklendi.');
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showToast('Favorilerden çıkarıldı.', 'info');
        return prev.filter(item => item.id !== product.id);
      }
      showToast('Favorilere eklendi.');
      return [...prev, { id: product.id, name: product.name, slug: product.slug, price: product.discountPrice || product.price, image: product.images?.[0]?.url || product.image }];
    });
  }, [showToast]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const moveToCart = useCallback((product) => {
    addToCart(product, 1);
    setWishlist(prev => prev.filter(item => item.id !== product.id));
  }, [addToCart]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('citynail_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('citynail_user');
  }, []);

  const value = {
    cart, wishlist, user, cartOpen, searchOpen, mobileMenuOpen, coupon, toast,
    cartCount, cartSubtotal, wishlistCount,
    setCartOpen, setSearchOpen, setMobileMenuOpen, setCoupon,
    addToCart, removeFromCart, updateQuantity, clearCart,
    toggleWishlist, isInWishlist, moveToCart,
    login, logout, showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
