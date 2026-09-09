import { createContext, ReactNode, useContext, useState } from 'react';
import { inquiryRepository } from '../repositories/inquiryRepository';
import { projectRepository } from '../repositories/projectRepository';
import { siteConfigRepository } from '../repositories/siteConfigRepository';
import { InquiryItem, ProjectItem, SiteConfig } from '../types';

type ContextValue = { projects: ProjectItem[]; inquiries: InquiryItem[]; siteConfig: SiteConfig; saveProject(p: ProjectItem): void; deleteProject(id: string): void; duplicateProject(p: ProjectItem): void; saveInquiry(i: InquiryItem): void; deleteInquiry(id: string): void; saveSiteConfig(c: SiteConfig): void; importBackup(data: unknown): void; exportBackup(): void; resetDemo(): void; };
const Context = createContext<ContextValue | null>(null);
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(() => projectRepository.getProjects());
  const [inquiries, setInquiries] = useState(() => inquiryRepository.getInquiries());
  const [siteConfig, setSiteConfig] = useState(() => siteConfigRepository.get());
  const saveProject = (item: ProjectItem) => { const next = { ...item, slug: item.slug || slugify(item.title), updatedAt: new Date().toISOString() }; const exists = projects.some((p) => p.id === next.id); exists ? projectRepository.updateProject(next) : projectRepository.createProject(next); setProjects(projectRepository.getProjects()); };
  const deleteProject = (id: string) => { projectRepository.deleteProject(id); setProjects(projectRepository.getProjects()); };
  const duplicateProject = (p: ProjectItem) => saveProject({ ...p, id: `proj-${Date.now()}`, slug: `${p.slug || slugify(p.title)}-copy-${Date.now()}`, title: `${p.title} (Copy)`, isPublic: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  const saveInquiry = (item: InquiryItem) => { inquiries.some((i) => i.id === item.id) ? inquiryRepository.updateInquiry(item) : inquiryRepository.createInquiry(item); setInquiries(inquiryRepository.getInquiries()); };
  const deleteInquiry = (id: string) => { inquiryRepository.deleteInquiry(id); setInquiries(inquiryRepository.getInquiries()); };
  const saveSiteConfig = (config: SiteConfig) => { siteConfigRepository.save(config); setSiteConfig(config); };
  const exportBackup = () => { const blob = new Blob([JSON.stringify({ version: 2, projects, inquiries, siteConfig }, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `ck-portfolio-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(a.href); };
  const importBackup = (data: unknown) => { if (!data || typeof data !== 'object') throw new Error('Invalid backup file.'); const backup = data as { projects?: ProjectItem[]; inquiries?: InquiryItem[]; siteConfig?: SiteConfig }; if (!Array.isArray(backup.projects)) throw new Error('Backup has no projects array.'); projectRepository.replaceProjects(backup.projects); inquiryRepository.replaceInquiries(backup.inquiries || []); if (backup.siteConfig) siteConfigRepository.save(backup.siteConfig); setProjects(projectRepository.getProjects()); setInquiries(inquiryRepository.getInquiries()); setSiteConfig(siteConfigRepository.get()); };
  const resetDemo = () => { setProjects(projectRepository.reset()); setInquiries(inquiryRepository.reset()); setSiteConfig(siteConfigRepository.reset()); };
  return <Context.Provider value={{ projects, inquiries, siteConfig, saveProject, deleteProject, duplicateProject, saveInquiry, deleteInquiry, saveSiteConfig, importBackup, exportBackup, resetDemo }}>{children}</Context.Provider>;
}
export function usePortfolio() { const value = useContext(Context); if (!value) throw new Error('usePortfolio must be inside PortfolioProvider'); return value; }
