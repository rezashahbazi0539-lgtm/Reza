'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Boxes, Users, Star,
  Ticket, Megaphone, Image, Home, FileText, Mail, BarChart3,
  Settings, LogOut, Menu, X, Bell, Search, ShoppingCart
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
  { href: '/admin/urunler', label: 'Ürünler', icon: Package },
  { href: '/admin/kategoriler', label: 'Kategoriler', icon: FolderTree },
  { href: '/admin/stok', label: 'Stok Yönetimi', icon: Boxes },
  { href: '/admin/musteriler', label: 'Müşteriler', icon: Users },
  { href: '/admin/yorumlar', label: 'Yorumlar', icon: Star },
  { href: '/admin/kuponlar', label: 'Kuponlar', icon: Ticket },
  { href: '/admin/kampanyalar', label: 'Kampanyalar', icon: Megaphone },
  { href: '/admin/ana-sayfa', label: 'Ana Sayfa', icon: Home },
  { href: '/admin/bannerlar', label: 'Bannerlar', icon: Image },
  { href: '/admin/blog', label: 'Blog', icon: FileText },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { href: '/admin/raporlar', label: 'Raporlar', icon: BarChart3 },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('citynail_user');
    if (savedUser) {
      const u = JSON.parse(savedUser);
      if (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN') {
        setUser(u);
      } else {
        router.push('/giris');
        return;
      }
    } else {
      router.push('/giris');
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-400">Yükleniyor...</p></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-brand-dark text-white flex flex-col transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold">CITY <span className="text-brand-pink">NAIL</span></Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X size={20} /></button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-md mb-1 transition-colors ${active ? 'bg-brand-pink text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
              >
                <item.icon size={18} /> {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white">
            <Home size={18} /> Mağazaya Git
          </Link>
          <button onClick={() => { localStorage.removeItem('citynail_user'); localStorage.removeItem('citynail_token'); router.push('/giris'); }} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-400 hover:text-white w-full">
            <LogOut size={18} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={22} /></button>
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Ara..." className="bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 text-sm outline-none focus:border-brand-pink w-64" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="relative">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">5</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium hidden md:block">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
