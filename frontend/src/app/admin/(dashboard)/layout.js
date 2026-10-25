'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('port_sin_token');
    const adminData = localStorage.getItem('port_sin_admin');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (e) {}
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('port_sin_token');
    localStorage.removeItem('port_sin_admin');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b111a] text-white flex items-center justify-center">
        <p className="animate-pulse">Memverifikasi otentikasi admin...</p>
      </div>
    );
  }

  const menu = [
    { name: 'Ringkasan Dasbor', href: '/admin/dashboard', icon: 'bi-grid-1x2' },
    { name: 'Pengaturan Web', href: '/admin/pengaturan-web', icon: 'bi-sliders2' },
    { name: 'Manajemen Proyek', href: '/admin/projects', icon: 'bi-kanban' },
    { name: 'Sertifikat & Lisensi', href: '/admin/certificates', icon: 'bi-award' },
    { name: 'Kotak Masuk Pesan', href: '/admin/pesan', icon: 'bi-envelope' },
  ];

  return (
    <div className="min-h-screen bg-[#070b10] flex text-gray-200">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1420] border-r border-white/5 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f2fe]/20 to-[#b122e5]/20 border border-[#00f2fe]/40 flex items-center justify-center text-[#00f2fe]">
              <i className="bi bi-shield-check text-xl" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Port-sin CMS</h2>
              <p className="text-[10px] text-[#00f2fe] font-mono tracking-wider uppercase">Admin Control</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1.5">
            {menu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/30 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className={`bi ${item.icon} text-lg`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white px-4 py-2 rounded-lg hover:bg-white/5 transition-colors mb-2"
          >
            <i className="bi bi-box-arrow-up-right" />
            <span>Lihat Web Publik ↗</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <i className="bi bi-box-arrow-left" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-[#0d1420]/70 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <span className="font-bold text-white">Port-sin CMS</span>
          </div>

          <div className="hidden sm:block text-xs text-gray-400">
            Sistem Dinamis Berbasis Node.js & PostgreSQL
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white">{admin?.fullName || 'Administrator'}</p>
              <p className="text-[10px] text-[#00f2fe] font-mono">{admin?.role || 'Super Admin'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#00f2fe]/20 border border-[#00f2fe]/50 flex items-center justify-center text-xs font-bold text-[#00f2fe]">
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Dynamic Page Children */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

