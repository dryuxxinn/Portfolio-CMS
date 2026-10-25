'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

export default function PengaturanWebPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchAPI('/config').then((res) => {
      if (res.success && res.data) {
        setConfig(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setConfig((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: value
      }
    }));
  };

  const handleRolesChange = (str) => {
    const rolesArray = str.split(',').map((r) => r.trim()).filter(Boolean);
    setConfig((prev) => ({ ...prev, hero_roles: rolesArray }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetchAPI('/config', {
      method: 'PUT',
      body: JSON.stringify(config)
    });

    setSaving(false);
    if (res.success) {
      toast.success('Pengaturan website berhasil disimpan!');
    } else {
      toast.error(res.message || 'Gagal menyimpan pengaturan.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Password saat ini dan password baru wajib diisi!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter!');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Konfirmasi password baru tidak cocok!');
      return;
    }

    setChangingPassword(true);
    const res = await fetchAPI('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
    });
    setChangingPassword(false);

    if (res.success) {
      toast.success('Password admin berhasil diubah!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.message || 'Gagal mengubah password admin.');
    }
  };

  if (loading) {
    return <div className="text-gray-400 py-10">Memuat konfigurasi website...</div>;
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Pengaturan Website</h1>
        <p className="text-sm text-gray-400 mt-1">
          Ubah identitas profil, teks beranda, link media sosial, dan kontak tanpa menyentuh kode program.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Identitas Utama */}
        <div className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Identitas Utama</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={config?.site_name || ''}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Inisial / Brand Logo</label>
              <input
                type="text"
                value={config?.site_initials || ''}
                onChange={(e) => handleChange('site_initials', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Tagline Profesi</label>
            <input
              type="text"
              value={config?.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              Role Berjalan / Typewriter (Pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={config?.hero_roles?.join(', ') || ''}
              onChange={(e) => handleRolesChange(e.target.value)}
              placeholder="Cyber Security Engineer, Network Engineer, System Administrator"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">Bio Beranda (Hero Bio)</label>
            <textarea
              rows="4"
              value={config?.hero_bio || ''}
              onChange={(e) => handleChange('hero_bio', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUploader
              label="Foto Profil Beranda (Hero Profile)"
              value={config?.profile_image || ''}
              onChange={(url) => handleChange('profile_image', url)}
            />
            <ImageUploader
              label="Berkas CV / Resume (PDF / Dokumen / Gambar)"
              accept=".pdf,image/*"
              helperText="Format: PDF, PNG, JPG, WEBP (Maks. 10MB)"
              value={config?.resume_url || ''}
              onChange={(url) => handleChange('resume_url', url)}
            />
          </div>
        </div>

        {/* Informasi Kontak */}
        <div className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Informasi Kontak</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Domisili</label>
              <input
                type="text"
                value={config?.contact_info?.domicile || ''}
                onChange={(e) => handleNestedChange('contact_info', 'domicile', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">WhatsApp</label>
              <input
                type="text"
                value={config?.contact_info?.whatsapp || ''}
                onChange={(e) => handleNestedChange('contact_info', 'whatsapp', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={config?.contact_info?.email || ''}
                onChange={(e) => handleNestedChange('contact_info', 'email', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
          </div>
        </div>

        {/* Media Sosial */}
        <div className="glass-card p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-white/5 pb-3">Tautan Media Sosial</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">URL GitHub</label>
              <input
                type="text"
                value={config?.social_links?.github || ''}
                onChange={(e) => handleNestedChange('social_links', 'github', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">URL LinkedIn</label>
              <input
                type="text"
                value={config?.social_links?.linkedin || ''}
                onChange={(e) => handleNestedChange('social_links', 'linkedin', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">URL Instagram</label>
              <input
                type="text"
                value={config?.social_links?.instagram || ''}
                onChange={(e) => handleNestedChange('social_links', 'instagram', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">URL Blog Eksternal</label>
              <input
                type="text"
                value={config?.social_links?.blog || ''}
                onChange={(e) => handleNestedChange('social_links', 'blog', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={saving}
            className="btn-cyan-glow font-bold text-sm px-8 py-3.5 cursor-pointer"
          >
            {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan'}
            <i className="bi bi-check2" />
          </button>
        </div>

      </form>

      {/* Keamanan & Ganti Password Admin */}
      <div className="glass-card p-6 sm:p-8 space-y-4 border border-rose-500/20">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="bi bi-shield-lock text-rose-400" />
            <span>Keamanan Akun Administrator</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Perbarui kata sandi untuk akun administrator demi menjaga integritas dan keamanan sistem CMS.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Password Saat Ini</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-rose-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Password Baru (min. 6 char)</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Konfirmasi Password Baru</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-6 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <i className="bi bi-key" />
              <span>{changingPassword ? 'Memproses...' : 'Ubah Password Admin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

