import Link from 'next/link';

export default function Footer({ config }) {
  const currentYear = new Date().getFullYear();
  const socialLinks = config?.social_links || {};

  return (
    <footer className="bg-[#060a0f] border-t border-white/5 py-12 text-center text-gray-400 mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        <h3 className="text-2xl font-black text-white mb-4">
          {config?.site_initials || 'BAA'}<span className="text-[#00f2fe]">.</span>
        </h3>

        {/* Socials */}
        <div className="flex justify-center gap-6 text-xl mb-6">
          {socialLinks.github && (
            <a href={socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-[#00f2fe] transition-colors" title="GitHub">
              <i className="bi bi-github"></i>
            </a>
          )}
          {socialLinks.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#00f2fe] transition-colors" title="LinkedIn">
              <i className="bi bi-linkedin"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-[#b122e5] transition-colors" title="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
          )}
          {config?.contact_info?.email && (
            <a href={`mailto:${config.contact_info.email}`} className="hover:text-[#00f2fe] transition-colors" title="Email">
              <i className="bi bi-envelope"></i>
            </a>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-2">
          &copy; {currentYear} {config?.site_name || 'Bergas Ahmad Ardiansyah'}. All rights reserved.
        </p>
        <p className="text-xs text-gray-600">
          Powered by Dynamic Node.js Express API & Next.js Glassmorphism Engine
        </p>
      </div>
    </footer>
  );
}

