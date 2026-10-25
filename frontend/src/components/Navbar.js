'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ config }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Project', href: '/project' },
    { name: 'Contact', href: '/contact' },
    { name: 'Blog', href: config?.social_links?.blog || 'https://blog.bgasrdy.my.id', external: true },
  ];

  const socialLinks = config?.social_links || {
    github: 'https://github.com/dryuxxinn',
    instagram: 'https://www.instagram.com/bgasrdy/',
    linkedin: 'https://www.linkedin.com/in/bgasrdy/'
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#0b111a]/80 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Navigation Menu (Left Side) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.external) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? 'text-white font-bold'
                    : 'text-gray-300 hover:text-white font-medium'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Social Icons (Right Side: GitHub, Instagram, LinkedIn) */}
        <div className="hidden md:flex items-center gap-5">
          {socialLinks.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-lg"
              title="GitHub"
            >
              <i className="bi bi-github" />
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-lg"
              title="Instagram"
            >
              <i className="bi bi-instagram" />
            </a>
          )}
          {socialLinks.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white transition-colors text-lg"
              title="LinkedIn"
            >
              <i className="bi bi-linkedin" />
            </a>
          )}
        </div>

        {/* Mobile Nav Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white text-2xl focus:outline-none ml-auto"
          aria-label="Toggle Navigation"
        >
          <i className={mobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'} />
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b111a]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            if (link.external) {
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base text-gray-300 hover:text-white"
                >
                  {link.name}
                </a>
              );
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-base ${
                  isActive ? 'text-white font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-white/10 flex items-center gap-5 text-xl">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                <i className="bi bi-github" />
              </a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                <i className="bi bi-instagram" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white">
                <i className="bi bi-linkedin" />
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
