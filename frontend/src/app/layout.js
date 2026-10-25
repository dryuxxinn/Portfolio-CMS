import './globals.css';
import { Toaster } from 'react-hot-toast';
import ScrollHandler from '@/components/ScrollHandler';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function getConfig() {
  try {
    const res = await fetch(`${API_BASE}/config`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata() {
  const config = await getConfig();
  return {
    title: config ? `${config.site_name} - ${config.tagline}` : 'Bergas Ardiansyah - Cyber Security Network Engineer',
    description: config?.hero_bio || 'Portfolio & Showcase of Cyber Security Engineer, Network Engineer, & System Administrator.',
    icons: {
      icon: '/assets/img/favicon-16x16.png',
      apple: '/assets/img/apple-touch-icon.png',
    }
  };
}

export default async function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@400;600;700;800&family=Roboto:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* Bootstrap Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col justify-between selection:bg-[#00f2fe]/20 selection:text-[#00f2fe]">
        <Toaster position="top-right" />
        <ScrollHandler />
        {children}
      </body>
    </html>
  );
}

