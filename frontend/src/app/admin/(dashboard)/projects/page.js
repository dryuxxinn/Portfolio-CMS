'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';
import ImageUploader from '@/components/ImageUploader';
import GalleryUploader from '@/components/GalleryUploader';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Server',
    client: 'Self Project',
    date: '2025',
    excerpt: '',
    content: '',
    tech_stack: '',
    thumbnail: '',
    gallery: '',
    status: 'published',
    featured: false,
    live_url: '',
    github_url: ''
  });

  const loadProjects = async () => {
    setLoading(true);
    const res = await fetchAPI('/admin/projects');
    if (res.success) setProjects(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Server',
      client: 'Self Project',
      date: '2025',
      excerpt: '',
      content: '',
      tech_stack: '',
      thumbnail: '',
      gallery: '',
      status: 'published',
      featured: false,
      live_url: '',
      github_url: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      title: p.title || '',
      slug: p.slug || '',
      category: p.category || 'Server',
      client: p.client || '',
      date: p.date || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      tech_stack: p.tech_stack?.join(', ') || '',
      thumbnail: p.thumbnail || '',
      gallery: Array.isArray(p.gallery) ? p.gallery.join(', ') : (p.gallery || ''),
      status: p.status || 'published',
      featured: p.featured || false,
      live_url: p.live_url || '',
      github_url: p.github_url || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    const res = await fetchAPI(`/projects/${id}`, { method: 'DELETE' });
    if (res.success) {
      toast.success('Proyek berhasil dihapus!');
      loadProjects();
    } else {
      toast.error(res.message || 'Gagal menghapus proyek.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.excerpt || !formData.thumbnail) {
      toast.error('Judul, Ringkasan, dan Thumbnail wajib diisi!');
      return;
    }

    const payload = {
      ...formData,
      tech_stack: typeof formData.tech_stack === 'string'
        ? formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
        : formData.tech_stack,
      gallery: Array.isArray(formData.gallery)
        ? formData.gallery
        : (formData.gallery || '').split(',').map((s) => s.trim()).filter(Boolean)
    };

    const projectId = editingProject?.id || editingProject?._id;
    let res;
    if (editingProject && projectId) {
      res = await fetchAPI(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetchAPI('/projects', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    }

    if (res.success) {
      toast.success(editingProject ? 'Proyek berhasil diperbarui!' : 'Proyek berhasil dibuat!');
      setModalOpen(false);
      loadProjects();
    } else {
      toast.error(res.message || 'Gagal menyimpan proyek.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Manajemen Proyek</h1>
          <p className="text-sm text-gray-400 mt-1">
            Tambah, edit konten studi kasus, atau ubah status tayang portofolio.
          </p>
        </div>
        <button onClick={openCreateModal} className="btn-cyan-glow text-sm font-bold cursor-pointer">
          <i className="bi bi-plus-lg" /> Tambah Proyek Baru
        </button>
      </div>

      {/* Projects Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 border-b border-white/5 text-xs uppercase tracking-wider text-gray-400 font-bold">
              <tr>
                <th className="p-4">Thumbnail</th>
                <th className="p-4">Judul & Kategori</th>
                <th className="p-4">Klien & Tanggal</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Memuat data proyek...</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">Belum ada proyek.</td>
                </tr>
              ) : (
                projects.map((p) => {
                  const pId = p.id || p._id;
                  return (
                  <tr key={pId} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 w-20">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-black/40">
                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-white block">{p.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#00f2fe]/10 text-[#00f2fe] font-mono uppercase">
                          {p.category}
                        </span>
                        {p.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-gray-400">
                      <p>{p.client}</p>
                      <p className="text-gray-500">{p.date}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        p.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#00f2fe]/20 text-gray-300 hover:text-[#00f2fe] transition-colors text-xs font-medium cursor-pointer"
                      >
                        <i className="bi bi-pencil" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pId)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors text-xs font-medium cursor-pointer"
                      >
                        <i className="bi bi-trash" /> Hapus
                      </button>
                    </td>
                  </tr>
                );})
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111a26] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Judul Proyek *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0d1420] border border-white/10 text-white focus:border-[#00f2fe]"
                  >
                    <option value="Server">Server</option>
                    <option value="Security">Security</option>
                    <option value="Network">Network</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0d1420] border border-white/10 text-white focus:border-[#00f2fe]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Klien / Tipe Proyek</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Self Project / CCIT"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Tanggal / Periode</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Januari 2025"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Ringkasan Singkat (Excerpt) *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Detail Studi Kasus (Content)</label>
                <textarea
                  rows="5"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Tech Stack (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="Mikrotik, RouterOS, VLAN, Hotspot"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe]"
                />
              </div>

              <ImageUploader
                label="Thumbnail Proyek (Cover Utama)"
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                required
              />

              <GalleryUploader
                label="Galeri Foto Tambahan (Screenshot & Dokumentasi)"
                value={formData.gallery}
                onChange={(galleryArr) => setFormData({ ...formData, gallery: galleryArr.join(', ') })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">URL Live Service</label>
                  <input
                    type="text"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                    placeholder="https://cloud.bgasrdy.my.id"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">URL GitHub Repository</label>
                  <input
                    type="text"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/dryuxxinn/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-[#00f2fe]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-white/5 border-white/20 text-[#00f2fe]"
                />
                <label htmlFor="featuredCheck" className="text-xs text-gray-300 font-medium">
                  Tampilkan di Beranda (Featured Project)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 hover:text-white"
                >
                  Batal
                </button>
                <button type="submit" className="btn-cyan-glow text-xs font-bold cursor-pointer">
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

