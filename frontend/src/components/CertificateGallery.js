'use client';

import { useState } from 'react';

export default function CertificateGallery({ initialCertificates = [] }) {
  const [activeCertCategory, setActiveCertCategory] = useState('All');
  const [selectedCertModal, setSelectedCertModal] = useState(null);

  const filteredCerts =
    activeCertCategory === 'All'
      ? initialCertificates
      : initialCertificates.filter((c) => c.category === activeCertCategory);

  return (
    <>
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-3xl font-extrabold text-white">
          Certificates & <span className="text-gradient-purple">Credentials</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          Kredensial sertifikasi resmi dan workshop yang telah saya selesaikan.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {['All', 'Academic', 'Volunteer', 'Workshop'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCertCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCertCategory === cat
                  ? 'bg-[#00f2fe] text-[#0b111a] shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert) => (
          <div
            key={cert.id || cert._id}
            onClick={() => setSelectedCertModal(cert)}
            className="glass-card overflow-hidden group cursor-pointer hover:border-[#00f2fe]/50"
          >
            <div className="relative h-52 bg-[#162130] overflow-hidden">
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="px-3 py-1.5 rounded-full bg-[#00f2fe] text-[#0b111a] text-xs font-bold">
                  <i className="bi bi-zoom-in mr-1" /> Zoom View
                </span>
              </div>
            </div>
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00f2fe] px-2 py-0.5 rounded bg-[#00f2fe]/10">
                {cert.category}
              </span>
              <h3 className="text-sm font-bold text-white mt-2 line-clamp-1">{cert.title}</h3>
              <p className="text-xs text-gray-400">{cert.issuer}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Zoom Certificate */}
      {selectedCertModal && (
        <div
          onClick={() => setSelectedCertModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111a26] border border-white/20 rounded-2xl max-w-3xl w-full p-4 overflow-hidden relative shadow-2xl"
          >
            <button
              onClick={() => setSelectedCertModal(null)}
              className="absolute top-4 right-4 text-white hover:text-[#00f2fe] text-2xl z-10"
            >
              &times;
            </button>
            <img
              src={selectedCertModal.image}
              alt={selectedCertModal.title}
              className="w-full max-h-[75vh] object-contain rounded-lg"
            />
            <div className="mt-4 flex justify-between items-center px-2">
              <div>
                <h4 className="text-lg font-bold text-white">{selectedCertModal.title}</h4>
                <p className="text-sm text-gray-400">{selectedCertModal.issuer} - {selectedCertModal.category}</p>
              </div>
              {selectedCertModal.credential_url && (
                <a
                  href={selectedCertModal.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cyan-glow text-xs"
                >
                  Credential Link &rarr;
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

