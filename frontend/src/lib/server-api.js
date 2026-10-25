const API_BASE = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function getServerConfig() {
  try {
    const res = await fetch(`${API_BASE}/config`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    console.error('[Server API] Error fetching config:', e.message);
    return null;
  }
}

export async function getServerProjects(query = '') {
  try {
    const res = await fetch(`${API_BASE}/projects${query}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error(`[Server API] Error fetching projects${query}:`, e.message);
    return [];
  }
}

export async function getServerProjectBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/projects/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    console.error(`[Server API] Error fetching project ${slug}:`, e.message);
    return null;
  }
}

export async function getServerCertificates() {
  try {
    const res = await fetch(`${API_BASE}/certificates`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.error('[Server API] Error fetching certificates:', e.message);
    return [];
  }
}

