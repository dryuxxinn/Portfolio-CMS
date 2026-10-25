import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundGlow from '@/components/BackgroundGlow';
import VisitorTracker from '@/components/VisitorTracker';
import ProjectGalleryClient from '@/components/ProjectGalleryClient';
import { getServerConfig, getServerProjectBySlug } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [config, project] = await Promise.all([
    getServerConfig(),
    getServerProjectBySlug(slug)
  ]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0b111a] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Proyek Tidak Ditemukan</h1>
        <Link href="/project" className="btn-cyan-glow">
          Kembali ke Katalog Proyek
        </Link>
      </div>
    );
  }

  return (
    <>
      <BackgroundGlow />
      <VisitorTracker page={`/project/${slug}`} />
      <Navbar config={config} />

      <main className="pt-28 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8 animate-fade-in-up">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/project" className="hover:text-white">Project</Link>
          <span>/</span>
          <span className="text-[#00f2fe] truncate max-w-xs">{project.title}</span>
        </div>

        {/* Project Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Media / Gallery (Left Column) */}
          <div className="lg:col-span-6 space-y-6 animate-fade-in-up delay-200">
            <ProjectGalleryClient
              thumbnail={project.thumbnail}
              title={project.title}
              gallery={project.gallery}
            />

            {/* Tech Badges */}
            <div className="glass-card p-6">
              <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3">Teknologi yang Digunakan</h4>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Details & Case Study Info (Right Column) */}
          <div className="lg:col-span-6 space-y-8 animate-fade-in-up delay-300">
            
            {/* Metadata Header */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]">
                  {project.category}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <i className="bi bi-calendar-event" /> {project.date}
                </span>
                {project.client && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <i className="bi bi-building" /> {project.client}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {project.title}
              </h1>
            </div>

            {/* Excerpt */}
            <div className="p-4 rounded-xl bg-[#00f2fe]/5 border border-[#00f2fe]/20 text-[#a3b3bc] text-base leading-relaxed">
              {project.excerpt}
            </div>

            {/* Detailed Explanation */}
            <div className="glass-card p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <i className="bi bi-journal-text text-[#00f2fe]" /> Ringkasan Proyek
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {project.content}
              </p>
            </div>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div className="glass-card p-6 sm:p-8 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <i className="bi bi-stars text-[#b122e5]" /> Fitur & Hasil Implementasi
                </h3>
                <ul className="space-y-2.5">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <i className="bi bi-check2-circle text-[#00f2fe] text-lg mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions: Live Demo & GitHub */}
            <div className="flex flex-wrap gap-4 pt-2">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cyan-glow"
                >
                  <i className="bi bi-box-arrow-up-right" />
                  <span>Kunjungi Live Service</span>
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-purple-glow"
                >
                  <i className="bi bi-github" />
                  <span>Lihat Repository GitHub</span>
                </a>
              )}
              <Link href="/project" className="px-6 py-2.5 rounded-full border border-white/20 text-gray-300 hover:text-white transition-all text-sm font-medium">
                &larr; Kembali ke Proyek
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer config={config} />
    </>
  );
}
