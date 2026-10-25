'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { uploadMultipleFilesAPI, uploadFileAPI } from '@/lib/api';

export default function GalleryUploader({
  label = 'Galeri Screenshot / Gambar Tambahan',
  value = [],
  onChange
}) {
  const [uploading, setUploading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const fileInputRef = useRef(null);

  // Normalize value to array
  const imageList = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    let newUrls = [];

    if (files.length === 1) {
      const res = await uploadFileAPI(files[0]);
      if (res.success && res.url) {
        newUrls = [res.url];
      } else {
        toast.error(res.message || 'Gagal mengunggah gambar');
      }
    } else {
      const res = await uploadMultipleFilesAPI(files);
      if (res.success && res.urls) {
        newUrls = res.urls;
      } else {
        toast.error(res.message || 'Gagal mengunggah berkas-berkas');
      }
    }

    setUploading(false);

    if (newUrls.length > 0) {
      toast.success(`${newUrls.length} gambar berhasil ditambahkan ke galeri!`);
      onChange([...imageList, ...newUrls]);
    }
  };

  const handleRemove = (indexToRemove) => {
    const updated = imageList.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleManualChange = (e) => {
    const raw = e.target.value;
    const arr = raw.split(',').map((s) => s.trim()).filter(Boolean);
    onChange(arr);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold text-gray-300">
            {label} ({imageList.length} gambar)
          </label>
          <p className="text-[11px] text-gray-500">
            Pilih satu atau beberapa screenshot untuk melengkapi studi kasus proyek.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-[#00f2fe] hover:underline flex items-center gap-1"
        >
          <i className="bi bi-link-45deg" />
          <span>{showManualInput ? 'Tutup URL manual' : 'Input teks URL'}</span>
        </button>
      </div>

      {/* Hidden Multiple File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Image Grid with Dropzone card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {imageList.map((imgUrl, idx) => (
          <div
            key={idx}
            className="group relative h-24 rounded-xl bg-black/40 border border-white/10 overflow-hidden"
          >
            <img
              src={imgUrl}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors cursor-pointer text-xs"
                title="Hapus gambar ini"
              >
                <i className="bi bi-trash" />
              </button>
            </div>
            <span className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded text-[9px] bg-black/80 text-gray-300 font-mono">
              #{idx + 1}
            </span>
          </div>
        ))}

        {/* Add more button / dropzone */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="h-24 rounded-xl border-2 border-dashed border-white/20 hover:border-[#00f2fe] hover:bg-[#00f2fe]/5 transition-all flex flex-col items-center justify-center text-center p-2 cursor-pointer group"
        >
          {uploading ? (
            <i className="bi bi-arrow-repeat animate-spin text-xl text-[#00f2fe]" />
          ) : (
            <>
              <i className="bi bi-plus-circle text-xl text-gray-400 group-hover:text-[#00f2fe] transition-colors mb-1" />
              <span className="text-[11px] font-semibold text-gray-400 group-hover:text-white transition-colors">
                + Tambah Foto
              </span>
            </>
          )}
        </button>
      </div>

      {/* Optional Manual Comma-Separated Input */}
      {showManualInput && (
        <div className="mt-2 pt-2 border-t border-white/5 animate-fade-in">
          <input
            type="text"
            placeholder="Pisahkan URL dengan tanda koma (misal: /img1.webp, /img2.webp)"
            value={imageList.join(', ')}
            onChange={handleManualChange}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-[#00f2fe] font-mono"
          />
        </div>
      )}
    </div>
  );
}

