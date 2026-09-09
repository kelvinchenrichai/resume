import { GalleryItem, InquiryItem, ProjectItem, SiteConfig } from '../types';

type PortfolioState = { projects: ProjectItem[]; inquiries: InquiryItem[]; gallery: GalleryItem[]; siteConfig: SiteConfig };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: init?.body instanceof FormData ? init?.headers : { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { error?: string } | null;
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const cloudApi = {
  getPublicState: () => request<Omit<PortfolioState, 'inquiries'>>('/api/public/state'),
  getAdminState: () => request<PortfolioState>('/aadmin-ck/api/state'),
  createInquiry: (item: InquiryItem) => request<{ ok: true }>('/api/public/inquiries', { method: 'POST', body: JSON.stringify(item) }),
  saveProject: (item: ProjectItem, exists: boolean) => request<{ ok: true }>(exists ? `/aadmin-ck/api/projects/${encodeURIComponent(item.id)}` : '/aadmin-ck/api/projects', { method: exists ? 'PUT' : 'POST', body: JSON.stringify(item) }),
  uploadProjectImage: (file: File) => {
    const form = new FormData();
    form.set('image', file);
    return request<{ ok: true; url: string }>('/aadmin-ck/api/project-media', { method: 'POST', body: form });
  },
  deleteProject: (id: string) => request<{ ok: true }>(`/aadmin-ck/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveInquiry: (item: InquiryItem) => request<{ ok: true }>(`/aadmin-ck/api/inquiries/${encodeURIComponent(item.id)}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteInquiry: (id: string) => request<{ ok: true }>(`/aadmin-ck/api/inquiries/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveGallery: (form: FormData, id?: string) => request<{ ok: true; item: GalleryItem }>(id ? `/aadmin-ck/api/gallery/${encodeURIComponent(id)}` : '/aadmin-ck/api/gallery', { method: id ? 'PUT' : 'POST', body: form }),
  deleteGallery: (id: string) => request<{ ok: true }>(`/aadmin-ck/api/gallery/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveSiteConfig: (config: SiteConfig) => request<{ ok: true }>('/aadmin-ck/api/site-config', { method: 'PUT', body: JSON.stringify(config) }),
  importState: (state: Omit<PortfolioState, 'gallery'> & { gallery?: GalleryItem[] }) => request<{ ok: true }>('/aadmin-ck/api/import', { method: 'PUT', body: JSON.stringify(state) }),
};
