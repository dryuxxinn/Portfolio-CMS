'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    category: 'Academic',
    image: '',
    credential_url: '',
    order: 0
  });

  const loadCertificates = async () => {
    setLoading(true);
    const res = await fetchAPI('/certificates');
    if (res.success && res.data) {
      setCertificates(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      category: 'Academic',
      image: '',
      credential_url: '',
      order: certificates.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title || '',
      issuer: cert.issuer || '',
      category: cert.category || 'Academic',
      image: cert.image || '',
      credential_url: cert.credential_url || '',
      order: cert.order || 0
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id || id === 'undefined') {
      toast.error('ID Sertifikat tidak valid');
      return;
    }
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return;
    const res = await fetchAPI(`/certificates/${id}`, { method: 'DELETE' });
    if (res.success) {
      toast.success('Sertifikat berhasil dihapus!');
      loadCertificates();
    } else {
      toast.error(res.message || 'Gagal menghapus sertifikat.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer || !formData.image) {
      toast.error('Judul, Penerbit (Issuer), dan Gambar wajib diisi!');
      return;
    }

    const payload = {
      ...formData,
      order: parseInt(formData.order) || 0
    };

    const certId = editingCert?.id || editingCert?._id;
    let res;
    if (editingCert && certId) {
      res = await fetchAPI(`/certificates/${certId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetchAPI('/certificates', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    if (res.success) {
      toast.success(editingCert ? 'Sertifikat berhasil diperbarui!' : 'Sertifikat berhasil ditambahkan!');
      setModalOpen(false);
      loadCertificates();
    } else {
      toast.error(res.message || 'Gagal menyimpan sertifikat.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manajemen Sertifikat & Lisensi</h1>
          <p className="text-sm text-gray-400 mt-1">
            Kelola kredensial profesional, sertifikasi keahlian, dan workshop Bergas Ardiansyah.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-cyan-glow flex items-center justify-center gap-2 text-sm font-bold px-5 py-2.5 cursor-pointer self-start sm:self-auto"
        >
          <i className="bi bi-plus-lg text-lg" />
          <span>Tambah Sertifikat</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-xs text-gray-400">Total Sertifikat</p>
          <p className="text-2xl font-bold text-white mt-1">{certificates.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-[#00f2fe]">Akademik / Resmi</p>
          <p className="text-2xl font-bold text-[#00f2fe] mt-1">
            {certificates.filter((c) => c.category === 'Academic').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-purple-400">Workshop & Pelatihan</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {certificates.filter((c) => c.category === 'Workshop').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-emerald-400">Volunteer & Lainnya</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {certificates.filter((c) => c.category === 'Volunteer' || c.category === 'Other').length}
          </p>
        </div>
      </div>

      {/* Table / List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">
            <i className="bi bi-arrow-repeat animate-spin text-2xl mb-2 block" />
            Memuat daftar sertifikat...
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <i className="bi bi-award text-4xl mb-3 block text-gray-600" />
            <p className="font-semibold text-white">Belum ada data sertifikat</p>
            <p className="text-xs mt-1">Klik tombol &ldquo;Tambah Sertifikat&rdquo; untuk menambahkan sertifikasi baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Pratinjau</th>
                  <th className="py-4 px-6">Nama Sertifikasi & Penerbit</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Urutan</th>
                  <th className="py-4 px-6">Tautan Kredensial</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {certificates.map((cert) => {
                  const certId = cert.id || cert._id;
                  return (
                    <tr key={certId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-16 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                          {cert.image ? (
                            <img
                              src={cert.image}
                              alt={cert.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <i className="bi bi-image text-gray-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-white">{cert.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{cert.issuer}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-mono border ${
                            cert.category === 'Academic'
                              ? 'bg-[#00f2fe]/10 text-[#00f2fe] border-[#00f2fe]/20'
                              : cert.category === 'Workshop'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : cert.category === 'Volunteer'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {cert.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-xs text-gray-400">
                        {cert.order}
                      </td>
                      <td className="py-4 px-6">
                        {cert.credential_url ? (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#00f2fe] hover:underline flex items-center gap-1.5"
                          >
                            <span>Verifikasi</span>
                            <i className="bi bi-box-arrow-up-right text-[10px]" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cert)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Edit Sertifikat"
                          >
                            <i className="bi bi-pencil-square" />
                          </button>
                          <button
                            onClick={() => handleDelete(certId)}
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                            title="Hapus Sertifikat"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingCert ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Nama Sertifikasi / Lisensi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cisco Certified Network Associate (CCNA)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Lembaga Penerbit (Issuer) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cisco Networking Academy / BNSP / MikroTik"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0d1420] border border-white/10 text-white text-sm focus:border-[#00f2fe]"
                  >
                    <option value="Academic">Academic / Resmi</option>
                    <option value="Workshop">Workshop & Pelatihan</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="Other">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Urutan Prioritas</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto / Berkas Sertifikat"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                required
              />

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Tautan Verifikasi / Credential URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.linkedin.com/in/bgasrdy/ atau link kredensial"
                  value={formData.credential_url}
                  onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00f2fe]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-cyan-glow px-6 py-2.5 text-sm font-bold cursor-pointer"
                >
                  {editingCert ? 'Perbarui Sertifikat' : 'Simpan Sertifikat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

