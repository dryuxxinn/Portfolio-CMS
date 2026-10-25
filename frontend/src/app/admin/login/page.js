'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import BackgroundGlow from '@/components/BackgroundGlow';
import { fetchAPI } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    setLoading(false);
    if (res.success && res.token) {
      localStorage.setItem('port_sin_token', res.token);
      localStorage.setItem('port_sin_admin', JSON.stringify(res.admin));
      toast.success('Login berhasil! Selamat datang di Dasbor CMS.');
      router.push('/admin/dashboard');
    } else {
      toast.error(res.message || 'Kredensial login salah!');
    }
  };

  return (
    <>
      <BackgroundGlow />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8 sm:p-10 border border-[#00f2fe]/30 shadow-2xl relative">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#00f2fe]/20 to-[#b122e5]/20 border border-[#00f2fe]/40 mx-auto flex items-center justify-center text-2xl text-[#00f2fe] mb-3">
                <i className="bi bi-shield-lock" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-wide">
                CMS Administrator
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Port-sin Dynamic Content Management System
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    required
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] text-sm"
                  />
                  <i className="bi bi-person absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] text-sm"
                  />
                  <i className="bi bi-key absolute left-3.5 top-3.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-cyan-glow w-full justify-center py-3.5 mt-2 font-bold cursor-pointer text-sm"
              >
                {loading ? 'Mengotentikasi...' : 'Masuk ke Dasbor'}
                <i className="bi bi-box-arrow-in-right" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <a href="/" className="text-xs text-gray-400 hover:text-[#00f2fe] transition-colors">
                &larr; Kembali ke Website Publik
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

