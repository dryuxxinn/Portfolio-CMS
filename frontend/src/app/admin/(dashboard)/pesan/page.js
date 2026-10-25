'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchAPI } from '@/lib/api';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    const res = await fetchAPI('/messages');
    if (res.success) setMessages(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id) => {
    const res = await fetchAPI(`/messages/${id}/read`, { method: 'PATCH' });
    if (res.success) {
      toast.success('Pesan ditandai dibaca');
      loadMessages();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesan ini?')) return;
    const res = await fetchAPI(`/messages/${id}`, { method: 'DELETE' });
    if (res.success) {
      toast.success('Pesan dihapus');
      loadMessages();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Kotak Masuk Pesan</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pesan dan pertanyaan yang dikirimkan oleh pengunjung melalui form kontak publik (/contact).
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500 py-10 text-center">Memuat pesan...</div>
        ) : messages.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-400">
            <i className="bi bi-inbox text-4xl mb-2 block" />
            <p>Belum ada pesan yang masuk.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const mId = msg.id || msg._id;
            return (
            <div
              key={mId}
              className={`glass-card p-6 border transition-all ${
                msg.is_read ? 'border-white/5 opacity-80' : 'border-[#00f2fe]/40 bg-[#00f2fe]/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center font-bold">
                    {msg.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h3 className="font-bold text-white text-base">{msg.name}</h3>
                    <p className="text-xs text-gray-400">
                      {msg.email} {msg.phone ? `| WA: ${msg.phone}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleString('id-ID')}
                  </span>
                  {!msg.is_read && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00f2fe] text-[#0b111a]">
                      BARU
                    </span>
                  )}
                </div>
              </div>

              <div className="my-3 p-3 rounded-lg bg-black/30 border border-white/5">
                <p className="text-xs font-bold text-[#00f2fe] mb-1">Subjek: {msg.subject || 'Tanpa Subjek'}</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{msg.message}</p>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <a
                  href={`mailto:${msg.email}?subject=Balasan: ${encodeURIComponent(msg.subject || 'Pertanyaan')}`}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white"
                >
                  <i className="bi bi-reply mr-1" /> Balas Email
                </a>
                {msg.phone && (
                  <a
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-400"
                  >
                    <i className="bi bi-whatsapp mr-1" /> Chat WA
                  </a>
                )}
                {!msg.is_read && (
                  <button
                    onClick={() => handleMarkRead(mId)}
                    className="px-3 py-1.5 rounded-lg bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-xs font-semibold text-[#00f2fe]"
                  >
                    Tandai Dibaca
                  </button>
                )}
                <button
                  onClick={() => handleDelete(mId)}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold text-rose-400"
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            </div>
          );})
        )}
      </div>
    </div>
  );
}

