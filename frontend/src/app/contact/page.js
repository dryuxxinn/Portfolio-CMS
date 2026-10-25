import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundGlow from '@/components/BackgroundGlow';
import VisitorTracker from '@/components/VisitorTracker';
import ContactClient from '@/components/ContactClient';
import { getServerConfig } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const config = await getServerConfig();

  return (
    <>
      <BackgroundGlow />
      <VisitorTracker page="/contact" />
      <Navbar config={config} />

      <main className="pt-28 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
          <h1 className="text-4xl font-extrabold text-white">
            Contact <span className="text-gradient-cyan">Me</span>
          </h1>
          <p className="text-gray-400 mt-3 text-base">
            Tertarik untuk berdiskusi seputar keamanan siber, server, atau rancangan jaringan? Mari terhubung!
          </p>
        </div>

        <div className="animate-fade-in-up delay-200">
          <ContactClient config={config} />
        </div>
      </main>

      <Footer config={config} />
    </>
  );
}
