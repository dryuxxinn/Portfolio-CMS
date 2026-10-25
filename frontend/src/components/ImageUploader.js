'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { uploadFileAPI } from '@/lib/api';

export default function ImageUploader({
  label = 'Upload Gambar',
  value = '',
  onChange,
  accept = 'image/*',
  required = false,
  helperText = 'Format: PNG, JPG, WEBP, SVG (Maks. 10MB)'
}) {
  const [uploading, setUploading] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Check size max 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB!');
      return;
    }

    setUploading(true);
    const res = await uploadFileAPI(file);
    setUploading(false);

    if (res.success && res.url) {
      toast.success('Gambar berhasil diunggah!');
      onChange(res.url);
    } else {
      toast.error(res.message || 'Gagal mengunggah gambar.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const isPdf = typeof value === 'string' && value.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-gray-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-[11px] text-[#00f2fe] hover:underline flex items-center gap-1"
        >
          <i className="bi bi-link-45deg" />
          <span>{showManualInput ? 'Sembunyikan URL manual' : 'Opsi URL / Path manual'}</span>
        </button>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Dropzone / Preview */}
      {value ? (
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center gap-4 group">
          <div className="w-20 h-16 rounded-lg bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 relative">
            {isPdf ? (
              <i className="bi bi-file-earmark-pdf-fill text-rose-500 text-3xl" />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{value}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <i className="bi bi-check-circle" /> {isPdf ? 'Berkas PDF aktif' : 'Berkas gambar aktif'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-cyan-400 transition-colors"
                title="Buka / Unduh File"
              >
                <i className="bi bi-box-arrow-up-right" />
              </a>
            )}
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <i className="bi bi-cloud-arrow-up mr-1" />
              Ganti File
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
              title="Hapus File"
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[#00f2fe] bg-[#00f2fe]/10 scale-[1.01]'
              : 'border-white/15 bg-white/[0.02] hover:border-[#00f2fe]/50 hover:bg-white/[0.04]'
          }`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center justify-center gap-2 text-gray-300">
              <i className="bi bi-arrow-repeat animate-spin text-2xl text-[#00f2fe]" />
              <p className="text-xs font-semibold">Mengunggah gambar ke server...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="w-10 h-10 rounded-full bg-[#00f2fe]/10 text-[#00f2fe] flex items-center justify-center text-xl mb-1">
                <i className="bi bi-cloud-arrow-up" />
              </div>
              <p className="text-xs font-bold text-white">
                Klik untuk unggah gambar <span className="text-gray-400 font-normal">atau seret file ke sini</span>
              </p>
              <p className="text-[11px] text-gray-500">{helperText}</p>
            </div>
          )}
        </div>
      )}

      {/* Optional Manual Path Input */}
      {showManualInput && (
        <div className="mt-2 pt-2 border-t border-white/5 animate-fade-in">
          <input
            type="text"
            placeholder="Atau tempel path relatif misal: /assets/img/portfolio/foto.webp"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:border-[#00f2fe] font-mono"
          />
        </div>
      )}
    </div>
  );
}
