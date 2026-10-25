'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const statsRes = await fetchAPI('/admin/stats');
      if (statsRes.success) setStats(statsRes.data);

      const msgRes = await fetchAPI('/messages');
      if (msgRes.success) setRecentMessages(msgRes.data.slice(0, 5));

      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="text-gray-400 py-10">Memuat statistik dasbor...</div>;
  }

  const statCards = [
    { title: 'Total Proyek', count: stats?.totalProjects || 0, icon: 'bi-kanban', color: 'text-[#00f2fe]', bg: 'bg-[#00f2fe]/10', href: '/admin/projects' },
    { title: 'Sertifikat & Lisensi', count: stats?.totalCertificates || 0, icon: 'bi-award', color: 'text-purple-400', bg: 'bg-purple-500/10', href: '/admin/certificates' },
    { title: 'Pesan Masuk', count: stats?.totalMessages || 0, icon: 'bi-envelope', color: 'text-amber-400', bg: 'bg-amber-400/10', href: '/admin/pesan' },
    { title: 'Total Pengunjung', count: stats?.totalVisitors || 0, icon: 'bi-eye', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white">Ringkasan Dasbor</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pantau statistik aktivitas portfolio, kredensial sertifikasi, analitik pengunjung, dan pesan masuk.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="glass-card p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">{card.title}</p>
              <h2 className="text-3xl font-black text-white mt-2">{card.count}</h2>
              {card.href && (
                <Link href={card.href} className="text-xs text-[#00f2fe] hover:underline mt-2 inline-block">
                  Kelola data &rarr;
                </Link>
              )}
            </div>
            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center text-2xl`}>
              <i className={`bi ${card.icon}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns: Recent Messages & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Messages */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="bi bi-envelope text-amber-400" /> Pesan Masuk Terbaru
            </h3>
            <Link href="/admin/pesan" className="text-xs text-[#00f2fe] hover:underline">
              Lihat Semua
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">Belum ada pesan yang masuk dari form kontak.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id || msg._id} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-white text-sm">{msg.name}</span>
                    <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[#00f2fe] font-medium mb-1">{msg.subject || 'Tanpa Subjek'}</p>
                  <p className="text-gray-400 line-clamp-1">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
            <i className="bi bi-lightning text-[#00f2fe]" /> Aksi Cepat Pengelolaan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/projects"
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#00f2fe]/40 hover:bg-white/10 transition-all group block"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center text-xl mb-3">
                <i className="bi bi-plus-circle" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#00f2fe] transition-colors">
                Kelola Proyek
              </h4>
              <p className="text-xs text-gray-400 mt-1">Tambah, edit thumbnail, dan studi kasus proyek.</p>
            </Link>

            <Link
              href="/admin/certificates"
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/40 hover:bg-white/10 transition-all group block"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl mb-3">
                <i className="bi bi-award" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                Kelola Sertifikat
              </h4>
              <p className="text-xs text-gray-400 mt-1">Upload dan atur kredensial lisensi profesional.</p>
            </Link>

            <Link
              href="/admin/pengaturan-web"
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/40 hover:bg-white/10 transition-all group block"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-3">
                <i className="bi bi-sliders2" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Pengaturan Web
              </h4>
              <p className="text-xs text-gray-400 mt-1">Ubah nama, bio, media sosial, kontak, dan password.</p>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/40 hover:bg-white/10 transition-all group block"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-3">
                <i className="bi bi-box-arrow-up-right" />
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Pratinjau Web
              </h4>
              <p className="text-xs text-gray-400 mt-1">Buka website publik di tab baru secara langsung.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
