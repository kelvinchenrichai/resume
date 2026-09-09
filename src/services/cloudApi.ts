import { InquiryItem, ProjectItem, SiteConfig } from '../types';

type PortfolioState = { projects: ProjectItem[]; inquiries: InquiryItem[]; siteConfig: SiteConfig };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
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
  deleteProject: (id: string) => request<{ ok: true }>(`/aadmin-ck/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveInquiry: (item: InquiryItem) => request<{ ok: true }>(`/aadmin-ck/api/inquiries/${encodeURIComponent(item.id)}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteInquiry: (id: string) => request<{ ok: true }>(`/aadmin-ck/api/inquiries/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  saveSiteConfig: (config: SiteConfig) => request<{ ok: true }>('/aadmin-ck/api/site-config', { method: 'PUT', body: JSON.stringify(config) }),
  importState: (state: PortfolioState) => request<{ ok: true }>('/aadmin-ck/api/import', { method: 'PUT', body: JSON.stringify(state) }),
};
