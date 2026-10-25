import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundGlow from '@/components/BackgroundGlow';
import VisitorTracker from '@/components/VisitorTracker';
import CertificateGallery from '@/components/CertificateGallery';
import { getServerConfig, getServerCertificates } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const [config, certificates] = await Promise.all([
    getServerConfig(),
    getServerCertificates()
  ]);

  return (
    <>
      <BackgroundGlow />
      <VisitorTracker page="/about" />
      <Navbar config={config} />

      <main className="pt-28 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-white">
            About <span className="text-gradient-cyan">Me</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base">
            Perjalanan akademik, pengalaman praktis, keahlian teknis, dan sertifikasi saya.
          </p>
        </div>

        {/* Education & Core Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          
          {/* Column 1: Education & Skills */}
          <div className="space-y-10 animate-fade-in-up delay-200">
            {/* Education */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <i className="bi bi-mortarboard text-[#00f2fe]" /> Pendidikan
              </h2>
              <div className="space-y-6">
                {config?.education && config.education.length > 0 ? (
                  config.education.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-[#00f2fe] pl-4 relative">
                      <span className="absolute -left-[9px] top-1.5 w-3 h-3 rounded-full bg-[#00f2fe]" />
                      <h3 className="text-lg font-bold text-white">{edu.institution}</h3>
                      <div className="text-xs font-semibold text-[#b122e5] mb-2">{edu.period}</div>
                      <p className="text-sm font-medium text-gray-200 mb-1">{edu.major}</p>
                      <p className="text-xs text-gray-400 leading-relaxed">{edu.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Belum ada data riwayat pendidikan.</p>
                )}
              </div>
            </div>

            {/* Core Skills */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <i className="bi bi-cpu text-[#00f2fe]" /> Core Skills
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {config?.core_skills && config.core_skills.length > 0 ? (
                  config.core_skills.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <i className="bi bi-check-circle-fill text-[#00f2fe] mt-0.5" />
                      <span>{skill}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500">Belum ada daftar keahlian utama.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Column 2: Experience & Tools */}
          <div className="space-y-10 animate-fade-in-up delay-300">
            {/* Experience */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <i className="bi bi-briefcase text-[#b122e5]" /> Pengalaman
              </h2>
              <div className="space-y-8">
                {config?.experience && config.experience.length > 0 ? (
                  config.experience.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-[#b122e5] pl-4 relative">
                      <span className="absolute -left-[9px] top-1.5 w-3 h-3 rounded-full bg-[#b122e5]" />
                      <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                      <div className="text-xs font-semibold text-[#00f2fe] mb-1">{exp.period}</div>
                      <p className="text-sm font-semibold text-gray-200 mb-2">{exp.company}</p>
                      <ul className="space-y-1.5 text-xs text-gray-400 list-disc list-inside">
                        {exp.responsibilities?.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">Belum ada riwayat pengalaman.</p>
                )}
              </div>
            </div>

            {/* Tools Stack */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <i className="bi bi-tools text-[#b122e5]" /> Tools & Tech Stack
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {config?.tools && config.tools.length > 0 ? (
                  config.tools.map((tool, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center hover:border-[#00f2fe]/40 transition-all group"
                    >
                      {tool.icon_url && (
                        <img
                          src={tool.icon_url}
                          alt={tool.name}
                          className="w-10 h-10 object-contain mb-2 group-hover:scale-110 transition-transform"
                        />
                      )}
                      <span className="text-xs font-medium text-gray-300">{tool.name}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 col-span-3">Belum ada tools terdaftar.</p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* SECTION: CERTIFICATES */}
        <section className="pt-10 animate-fade-in-up delay-400">
          <CertificateGallery initialCertificates={certificates} />
        </section>
      </main>

      <Footer config={config} />
    </>
  );
}
