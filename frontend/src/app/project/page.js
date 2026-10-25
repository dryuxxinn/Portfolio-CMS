import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackgroundGlow from '@/components/BackgroundGlow';
import VisitorTracker from '@/components/VisitorTracker';
import ProjectCatalogueClient from '@/components/ProjectCatalogueClient';
import { getServerConfig, getServerProjects } from '@/lib/server-api';

export const dynamic = 'force-dynamic';

export default async function ProjectCataloguePage() {
  const [config, projects] = await Promise.all([
    getServerConfig(),
    getServerProjects()
  ]);

  return (
    <>
      <BackgroundGlow />
      <VisitorTracker page="/project" />
      <Navbar config={config} />

      <main className="pt-28 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in-up">
        <ProjectCatalogueClient initialProjects={projects} />
      </main>

      <Footer config={config} />
    </>
  );
}
