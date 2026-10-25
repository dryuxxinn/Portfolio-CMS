'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProjectCatalogueClient({ initialProjects = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Security', 'Server', 'Network', 'Cloud'];

  const filteredProjects = initialProjects.filter((project) => {
    const matchCategory =
      activeCategory === 'All' ||
      project.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSearch =
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tech_stack?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <>
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-white">
          Project <span className="text-gradient-cyan">Showcase</span>
        </h1>
        <p className="text-gray-400 mt-3 text-base">
          Kumpulan implementasi arsitektur sistem, simulasi keamanan, dan topologi jaringan yang pernah saya kerjakan.
        </p>

        {/* Search Input */}
        <div className="mt-8 max-w-md mx-auto relative">
          <input
            type="text"
            placeholder="Cari proyek atau teknologi (misal: Wazuh, Mikrotik)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-[#111a26]/80 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#00f2fe] transition-all pl-12 text-sm shadow-inner"
          />
          <i className="bi bi-search absolute left-4 top-3.5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#00f2fe] text-[#0b111a] shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 glass-card max-w-md mx-auto">
          <i className="bi bi-inbox text-4xl text-gray-500 mb-2" />
          <p className="text-gray-300">Tidak ada proyek yang sesuai dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id || project._id}
              className="glass-card overflow-hidden flex flex-col group hover:border-[#00f2fe]/40 transition-all"
            >
              <div className="relative h-52 overflow-hidden border-b border-white/5 bg-[#162130]">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#0b111a]/80 text-[#00f2fe] border border-[#00f2fe]/40 backdrop-blur-md">
                  {project.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-[#00f2fe] transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3 leading-relaxed">
                    {project.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  {/* Tech stack badges */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech_stack.slice(0, 3).map((tech, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{project.date}</span>
                    <Link
                      href={`/project/${project.slug}`}
                      className="text-sm font-semibold text-[#00f2fe] hover:text-white flex items-center gap-1"
                    >
                      Case Study &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

