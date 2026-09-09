import { INITIAL_PROJECTS } from '../data/initialProjects';
import { ProjectItem } from '../types';

export interface ProjectRepository {
  getProjects(): ProjectItem[];
  replaceProjects(items: ProjectItem[]): void;
  createProject(item: ProjectItem): void;
  updateProject(item: ProjectItem): void;
  deleteProject(id: string): void;
  reset(): ProjectItem[];
}

const KEY = 'portfolio_cms_projects_v2';
export class LocalProjectRepository implements ProjectRepository {
  getProjects() { try { const value = localStorage.getItem(KEY); if (!value) return this.reset(); const stored = JSON.parse(value) as ProjectItem[]; return stored.map((item) => ({ ...INITIAL_PROJECTS.find((demo) => demo.id === item.id), ...item })); } catch { return [...INITIAL_PROJECTS]; } }
  replaceProjects(items: ProjectItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); }
  createProject(item: ProjectItem) { this.replaceProjects([item, ...this.getProjects()]); }
  updateProject(item: ProjectItem) { this.replaceProjects(this.getProjects().map((p) => p.id === item.id ? item : p)); }
  deleteProject(id: string) { this.replaceProjects(this.getProjects().filter((p) => p.id !== id)); }
  reset() { this.replaceProjects(INITIAL_PROJECTS); return [...INITIAL_PROJECTS]; }
}
export const projectRepository: ProjectRepository = new LocalProjectRepository();
