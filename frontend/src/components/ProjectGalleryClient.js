'use client';

import { useState } from 'react';

export default function ProjectGalleryClient({ thumbnail, title, gallery = [] }) {
  const [activeImage, setActiveImage] = useState(thumbnail || gallery[0] || '');

  return (
    <div className="space-y-4">
      <div className="glass-card overflow-hidden p-2">
        <div className="relative h-72 sm:h-96 rounded-xl overflow-hidden bg-[#162130]">
          <img
            src={activeImage || thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>
      </div>

      {/* Thumbnail Selectors */}
      {gallery && gallery.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                activeImage === img ? 'border-[#00f2fe] scale-105 shadow-[0_0_10px_rgba(0,242,254,0.4)]' : 'border-white/10 opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

