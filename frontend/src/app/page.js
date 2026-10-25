import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundGlow from '@/components/BackgroundGlow';
import TypewriterRole from '@/components/TypewriterRole';
import VisitorTracker from '@/components/VisitorTracker';
import { getServerConfig, getServerProjects } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [config, featuredProjects] = await Promise.all([
    getServerConfig(),
    getServerProjects('?featured=true')
  ]);

  const roles = config?.hero_roles || ['Cyber Security Engineer', 'Network Engineer', 'System Administrator'];
  const siteName = config?.site_name || 'Bergas Ahmad Ardiansyah';
  const heroBio = config?.hero_bio || 'Praktisi jaringan dan keamanan sistem berpengalaman dalam konfigurasi router, pengelolaan server Linux & Windows, serta implementasi SIEM Wazuh dan penetration testing.';
  const profileImage = config?.profile_image || '/assets/img/profile/profile-square-11.webp';
  const tools = config?.tools && config.tools.length > 0
    ? config.tools
    : [
        { name: 'Linux' },
        { name: 'Cisco' },
        { name: 'Wazuh' },
        { name: 'Docker' },
        { name: 'Mikrotik' },
        { name: 'Proxmox' }
      ];

  return (
    <>
      <BackgroundGlow />
      <VisitorTracker page="/" />
      <Navbar config={config} />

      <main className="pt-28 flex-1">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-xs text-[#00f2fe] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
                Available for Projects & Opportunities
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                {siteName}
              </h1>

              <TypewriterRole roles={roles} />

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {heroBio}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <a href="#featured-projects" className="btn-cyan-glow">
                  <span>Lihat Proyek</span>
                  <i className="bi bi-arrow-down" />
                </a>
                <Link href="/contact" className="btn-purple-glow">
                  <span>Let's Talk</span>
                  <i className="bi bi-chat-dots" />
                </Link>
                {config?.resume_url && (
                  <a
                    href={config.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:border-[#00f2fe] hover:text-[#00f2fe] transition-all flex items-center gap-2 font-medium"
                  >
                    <span>Download CV</span>
                    <i className="bi bi-file-earmark-pdf" />
                  </a>
                )}
              </div>
            </div>

            {/* Right Profile Photo with Cyberpunk Badges */}
            <div className="lg:col-span-5 flex justify-center relative animate-fade-in-up delay-200">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00f2fe] to-[#b122e5] rounded-3xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
                <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-3xl overflow-hidden border border-white/10 bg-[#111a26]">
                  <img
                    src={profileImage}
                    alt={siteName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Floating Micro-cards */}
                <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 flex items-center gap-2 text-sm text-white shadow-xl">
                  <i className="bi bi-ubuntu text-orange-400 text-lg" />
                  <span>Linux Server</span>
                </div>
                <div className="absolute -top-4 -right-4 glass-card px-4 py-2 flex items-center gap-2 text-sm text-white shadow-xl">
                  <i className="bi bi-shield-lock text-[#00f2fe] text-lg" />
                  <span>Cyber Security</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: EXPERIENCE & EDUCATION SNIPPET */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Experience Snippet */}
            <div className="glass-card p-6 sm:p-8 animate-fade-in-up delay-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#00f2fe]/10 flex items-center justify-center text-[#00f2fe] text-xl">
                  <i className="bi bi-briefcase" />
                </div>
                <h3 className="text-xl font-bold text-white">Pengalaman Terbaru</h3>
              </div>

              <div className="space-y-6 border-l-2 border-[#00f2fe]/40 pl-4 ml-2">
                {config?.experience && config.experience.length > 0 ? (
                  config.experience.slice(0, 2).map((exp, idx) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#00f2fe] shadow-[0_0_10px_#00f2fe]" />
                      <h4 className="text-base font-semibold text-white">{exp.role}</h4>
                      <p className="text-xs text-[#b122e5] font-medium">{exp.period} | {exp.company}</p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                        {exp.responsibilities?.[0] || ''}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Belum ada riwayat pengalaman.</p>
                )}
              </div>

              <div className="mt-6">
                <Link href="/about" className="text-sm font-semibold text-[#00f2fe] hover:underline flex items-center gap-1">
                  Lihat Riwayat Lengkap &rarr;
                </Link>
              </div>
            </div>

            {/* Education Snippet */}
            <div className="glass-card p-6 sm:p-8 animate-fade-in-up delay-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#b122e5]/10 flex items-center justify-center text-[#b122e5] text-xl">
                  <i className="bi bi-mortarboard" />
                </div>
                <h3 className="text-xl font-bold text-white">Pendidikan & Tools</h3>
              </div>

              <div className="space-y-6 border-l-2 border-[#b122e5]/40 pl-4 ml-2">
                {config?.education && config.education.length > 0 ? (
                  config.education.slice(0, 2).map((edu, idx) => (
                    <div key={idx} className="relative group">
                      <span className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#b122e5] shadow-[0_0_10px_#b122e5]" />
                      <h4 className="text-base font-semibold text-white">{edu.major}</h4>
                      <p className="text-xs text-[#00f2fe] font-medium">{edu.period} | {edu.institution}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Belum ada riwayat pendidikan.</p>
                )}
              </div>

              {/* Tools Badges (Dynamic from Database!) */}
              <div className="mt-6 flex flex-wrap gap-2">
                {tools.slice(0, 8).map((tool, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe]"
                  >
                    {typeof tool === 'string' ? tool : tool.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: FEATURED PROJECTS */}
        <section id="featured-projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in-up delay-500">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Featured <span className="text-gradient-cyan">Projects</span>
              </h2>
              <p className="text-gray-400 mt-2">
                Implementasi infrastruktur, jaringan, dan keamanan siber unggulan.
              </p>
            </div>
            <Link
              href="/project"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#00f2fe] hover:underline"
            >
              Lihat Semua Proyek &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, idx) => (
              <div
                key={project.id || project._id}
                className="glass-card overflow-hidden flex flex-col group animate-fade-in-up"
                style={{ animationDelay: `${(idx + 1) * 150}ms` }}
              >
                <div className="relative h-48 overflow-hidden border-b border-white/5 bg-[#162130]">
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

                  <div className="pt-6 border-t border-white/5 mt-4 flex items-center justify-between">
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
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/project" className="btn-cyan-glow w-full justify-center">
              Lihat Semua Proyek
            </Link>
          </div>
        </section>

        {/* SECTION: CTA */}
        <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-fade-in-up">
          <div className="glass-card p-10 sm:p-16 border border-[#00f2fe]/20 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#00f2fe]/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Tertarik Berkolaborasi atau Mengembangkan Jaringan?
            </h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8 text-base sm:text-lg">
              Mari diskusikan rancangan infrastruktur server, monitoring keamanan SIEM, atau konfigurasi Mikrotik yang handal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-cyan-glow">
                Hubungi Saya Sekarang <i className="bi bi-arrow-right" />
              </Link>
              <Link href="/project" className="btn-purple-glow">
                Jelajahi Semua Proyek <i className="bi bi-kanban" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer config={config} />
    </>
  );
}
