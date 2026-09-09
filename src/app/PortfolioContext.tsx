import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_CONFIG } from '../config/siteConfig';
import { INITIAL_PROJECTS } from '../data/initialProjects';
import { cloudApi } from '../services/cloudApi';
import { InquiryItem, ProjectItem, SiteConfig } from '../types';

type ContextValue = {
  projects: ProjectItem[];
  inquiries: InquiryItem[];
  siteConfig: SiteConfig;
  ready: boolean;
  error: string;
  saveProject(p: ProjectItem): Promise<void>;
  deleteProject(id: string): Promise<void>;
  duplicateProject(p: ProjectItem): Promise<void>;
  saveInquiry(i: InquiryItem): Promise<void>;
  deleteInquiry(id: string): Promise<void>;
  saveSiteConfig(c: SiteConfig): Promise<void>;
  importBackup(data: unknown): Promise<void>;
  exportBackup(): void;
  resetDemo(): Promise<void>;
};

const Context = createContext<ContextValue | null>(null);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const isAdmin = () => window.location.pathname.startsWith('/aadmin-ck');

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (isAdmin()) {
          const state = await cloudApi.getAdminState();
          if (!active) return;
          setProjects(state.projects);
          setInquiries(state.inquiries);
          setSiteConfig(state.siteConfig);
        } else {
          const state = await cloudApi.getPublicState();
          if (!active) return;
          setProjects(state.projects);
          setSiteConfig(state.siteConfig);
        }
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Unable to load cloud data.');
      } finally {
        if (active) setReady(true);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const saveProject = async (item: ProjectItem) => {
    const next = { ...item, slug: item.slug || slugify(item.title), updatedAt: new Date().toISOString() };
    const exists = projects.some((p) => p.id === next.id);
    await cloudApi.saveProject(next, exists);
    setProjects((current) => exists ? current.map((p) => p.id === next.id ? next : p) : [next, ...current]);
  };
  const deleteProject = async (id: string) => { await cloudApi.deleteProject(id); setProjects((current) => current.filter((p) => p.id !== id)); };
  const duplicateProject = async (p: ProjectItem) => saveProject({ ...p, id: `proj-${Date.now()}`, slug: `${p.slug || slugify(p.title)}-copy-${Date.now()}`, title: `${p.title} (Copy)`, isPublic: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const saveInquiry = async (item: InquiryItem) => {
    const exists = inquiries.some((i) => i.id === item.id);
    if (isAdmin() && exists) await cloudApi.saveInquiry(item); else await cloudApi.createInquiry(item);
    setInquiries((current) => exists ? current.map((i) => i.id === item.id ? item : i) : [item, ...current]);
  };
  const deleteInquiry = async (id: string) => { await cloudApi.deleteInquiry(id); setInquiries((current) => current.filter((i) => i.id !== id)); };
  const saveSiteConfig = async (config: SiteConfig) => { await cloudApi.saveSiteConfig(config); setSiteConfig(config); };
  const exportBackup = () => { const blob = new Blob([JSON.stringify({ version: 3, projects, inquiries, siteConfig }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ck-portfolio-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href); };
  const importBackup = async (data: unknown) => { if (!data || typeof data !== 'object') throw new Error('Invalid backup file.'); const backup = data as { projects?: ProjectItem[]; inquiries?: InquiryItem[]; siteConfig?: SiteConfig }; if (!Array.isArray(backup.projects)) throw new Error('Backup has no projects array.'); const next = { projects: backup.projects, inquiries: backup.inquiries || [], siteConfig: backup.siteConfig || DEFAULT_SITE_CONFIG }; await cloudApi.importState(next); setProjects(next.projects); setInquiries(next.inquiries); setSiteConfig(next.siteConfig); };
  const resetDemo = async () => { const next = { projects: INITIAL_PROJECTS, inquiries: [], siteConfig: DEFAULT_SITE_CONFIG }; await cloudApi.importState(next); setProjects(next.projects); setInquiries([]); setSiteConfig(next.siteConfig); };

  return <Context.Provider value={{ projects, inquiries, siteConfig, ready, error, saveProject, deleteProject, duplicateProject, saveInquiry, deleteInquiry, saveSiteConfig, importBackup, exportBackup, resetDemo }}>{children}</Context.Provider>;
}

export function usePortfolio() { const value = useContext(Context); if (!value) throw new Error('usePortfolio must be inside PortfolioProvider'); return value; }
