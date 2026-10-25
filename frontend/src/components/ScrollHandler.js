'use client';

import { useEffect, useState } from 'react';

export default function ScrollHandler() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Scroll to top on page load / refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Monitor scroll position to toggle the floating Back-to-Top button
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-[#0d1420]/80 backdrop-blur-md border border-[#00f2fe]/40 text-[#00f2fe] hover:bg-[#00f2fe] hover:text-[#0b111a] flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,242,254,0.3)] hover:scale-110 cursor-pointer animate-fade-in"
        >
          <i className="bi bi-arrow-up text-lg font-bold" />
        </button>
      )}
    </>
  );
}

