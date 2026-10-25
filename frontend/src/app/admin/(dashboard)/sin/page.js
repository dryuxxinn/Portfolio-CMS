'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';

export default function AdminSinUsersPage() {
  const [users, setUsers] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    const query = filterType ? `?service_type=${filterType}` : '';
    const res = await fetchAPI(`/sin/users${query}`);
    if (res.success) setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, [filterType]);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'pending' : 'active';
    const res = await fetchAPI(`/sin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    if (res.success) {
      toast.success(res.message);
      loadUsers();
    } else {
      toast.error('Gagal memperbarui status');
    }
  };

  const handleSyncMikrotik = async (id) => {
    setSyncingId(id);
    const res = await fetchAPI(`/sin/users/${id}/sync`, { method: 'POST' });
    setSyncingId(null);
    if (res.success) {
      toast.success(res.message);
      loadUsers();
    } else {
      toast.error(res.message || 'Sinkronisasi MikroTik gagal.');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus akun ini?')) return;
    const res = await fetchAPI(`/sin/users/${id}`, { method: 'DELETE' });
    if (res.success) {
      toast.success('Akun berhasil dihapus');
      loadUsers();
    } else {
      toast.error('Gagal menghapus akun.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Akun Internet (Hotspot & PPPoE)</h1>
          <p className="text-sm text-gray-400 mt-1">
            Data pengguna yang mendaftar melalui form registrasi mandiri (/sin) serta sinkronisasi MikroTik RouterOS.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === '' ? 'bg-[#00f2fe] text-[#0b111a]' : 'bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            Semua ({users.length})
          </button>
          <button
            onClick={() => setFilterType('hotspot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'hotspot' ? 'bg-[#00f2fe] text-[#0b111a]' : 'bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            Hotspot
          </button>
          <button
            onClick={() => setFilterType('pppoe')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              filterType === 'pppoe' ? 'bg-[#b122e5] text-white' : 'bg-white/5 text-gray-300 hover:text-white'
            }`}
          >
            PPPoE
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-gray-400 font-bold">
              <tr>
                <th className="p-4">Username & Password</th>
                <th className="p-4">Layanan</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Status Akun</th>
                <th className="p-4">MikroTik RouterOS</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Memuat data akun...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    Belum ada pendaftaran akun internet. Form tersedia di <a href="/sin" target="_blank" className="text-[#00f2fe] underline">/sin</a>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const uId = u.id || u._id;
                  return (
                  <tr key={uId} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-white block text-sm">{u.username}</span>
                      <span className="font-mono text-xs text-gray-500">Pass: {u.password}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        u.service_type === 'hotspot' ? 'bg-[#00f2fe]/10 text-[#00f2fe] border border-[#00f2fe]/20' : 'bg-[#b122e5]/10 text-[#d880fd] border border-[#b122e5]/20'
                      }`}>
                        {u.service_type}
                      </span>
                    </td>
                    <td className="p-4 text-xs">
                      <p className="font-semibold text-white">{u.full_name || '-'}</p>
                      <p className="text-gray-400">{u.phone || '-'}</p>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(uId, u.status)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                      >
                        {u.status} (Klik ubah)
                      </button>
                    </td>
                    <td className="p-4 text-xs">
                      {u.mikrotik_synced ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <i className="bi bi-check-circle" /> Tersinkron
                        </span>
                      ) : (
                        <span className="text-gray-500 flex items-center gap-1">
                          <i className="bi bi-clock" /> Belum sync
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleSyncMikrotik(uId)}
                        disabled={syncingId === uId}
                        className="px-3 py-1.5 rounded-lg bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] text-xs font-medium cursor-pointer"
                        title="Sync akun ke RouterOS"
                      >
                        <i className="bi bi-arrow-repeat mr-1" />
                        {syncingId === uId ? 'Sync...' : 'Sync MikroTik'}
                      </button>
                      <button
                        onClick={() => handleDelete(uId)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium cursor-pointer"
                        title="Hapus akun"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                );})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

