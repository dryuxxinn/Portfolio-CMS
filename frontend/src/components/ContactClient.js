'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';

export default function ContactClient({ config }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Nama, Email, dan Pesan wajib diisi!');
      return;
    }

    setSubmitting(true);
    const res = await fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    setSubmitting(false);
    if (res.success) {
      toast.success(res.message || 'Pesan Anda berhasil dikirim!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      toast.error(res.message || 'Gagal mengirim pesan.');
    }
  };

  const contact = config?.contact_info || {
    domicile: 'Depok, Indonesia',
    whatsapp: '+6285179958005',
    email: 'bgasrdy@gmail.com'
  };

  const social = config?.social_links || {
    github: 'https://github.com/dryuxxinn',
    linkedin: 'https://www.linkedin.com/in/bgasrdy/',
    instagram: 'https://www.instagram.com/bgasrdy/'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      
      {/* Contact Information & Socials (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className="glass-card p-8 space-y-6">
          <h3 className="text-2xl font-bold text-white mb-2">Kontak Langsung</h3>
          <p className="text-gray-400 text-sm">
            Hubungi saya melalui nomor WhatsApp atau email untuk respon cepat.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center text-xl">
                <i className="bi bi-geo-alt" />
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold text-gray-400">Domisili</h4>
                <p className="text-white font-medium">{contact.domicile || 'Depok, Indonesia'}</p>
              </div>
            </div>

            {contact.whatsapp && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xl">
                  <i className="bi bi-whatsapp" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400">WhatsApp</h4>
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white font-medium hover:text-[#00f2fe] transition-colors"
                  >
                    {contact.whatsapp}
                  </a>
                </div>
              </div>
            )}

            {contact.email && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">
                  <i className="bi bi-envelope" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-bold text-gray-400">Email</h4>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-white font-medium hover:text-[#00f2fe] transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Cards */}
        <div className="glass-card p-8 space-y-4">
          <h3 className="text-xl font-bold text-white mb-2">Media Sosial</h3>
          <div className="space-y-3">
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white group"
              >
                <i className="bi bi-github text-xl text-gray-400 group-hover:text-[#00f2fe]" />
                <span className="text-sm font-medium">GitHub Repository</span>
                <i className="bi bi-box-arrow-up-right text-xs ml-auto text-gray-500 group-hover:text-white" />
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white group"
              >
                <i className="bi bi-linkedin text-xl text-gray-400 group-hover:text-[#00f2fe]" />
                <span className="text-sm font-medium">LinkedIn Profile</span>
                <i className="bi bi-box-arrow-up-right text-xs ml-auto text-gray-500 group-hover:text-white" />
              </a>
            )}
            {social.instagram && (
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-gray-300 hover:text-white group"
              >
                <i className="bi bi-instagram text-xl text-gray-400 group-hover:text-[#b122e5]" />
                <span className="text-sm font-medium">Instagram Profile</span>
                <i className="bi bi-box-arrow-up-right text-xs ml-auto text-gray-500 group-hover:text-white" />
              </a>
            )}
          </div>
        </div>

      </div>

      {/* Message Form (7 cols) */}
      <div className="lg:col-span-7">
        <div className="glass-card p-8 sm:p-10 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-2">Kirim Pesan</h3>
          <p className="text-gray-400 text-sm mb-6">
            Pesan Anda akan otomatis masuk ke inbox database CMS dan dapat dipantau langsung oleh admin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Nama Anda <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Nama Lengkap"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f2fe]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Alamat Email <span className="text-rose-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f2fe]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="+62 812..."
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f2fe]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Subjek Pesan</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Konsultasi Jaringan / Project"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f2fe]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Pesan Anda <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tuliskan detail pertanyaan atau penawaran kerja sama..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:border-[#00f2fe]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-cyan-glow w-full justify-center py-3.5 text-sm font-bold cursor-pointer"
            >
              <i className="bi bi-send" />
              <span>{submitting ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

