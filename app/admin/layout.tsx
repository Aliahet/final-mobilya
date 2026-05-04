'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, X, LogOut, ChevronLeft, BarChart2, Handshake, Megaphone, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analitik', icon: BarChart2 },
  { href: '/admin/urunler', label: 'Ürünler', icon: Package },
  { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
  { href: '/admin/kullanicilar', label: 'Kullanıcılar', icon: Users },
  { href: '/admin/bayilik', label: 'Bayilik', icon: Handshake },
  { href: '/admin/kampanyalar', label: 'Kampanyalar', icon: Megaphone },
  { href: '/admin/subeler', label: 'Şubeler', icon: MapPin },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pt-0">
      {/* Top bar for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="font-serif text-lg text-charcoal">FINAL MOBİLYA</h1>
        <div className="w-9" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-charcoal text-white z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-lg text-white">FINAL MOBİLYA</h1>
              <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive ? 'bg-gold text-charcoal font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-3 px-2">
            <ChevronLeft className="w-4 h-4" /> Siteye Dön
          </Link>
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gold">{profile?.full_name?.[0] || 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-xs text-white/40 truncate">{profile?.email}</p>
            </div>
            <button onClick={signOut} className="p-1.5 hover:bg-white/10 rounded transition-colors">
              <LogOut className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
