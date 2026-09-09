import { ProjectItem } from '../types';

export const isExternalProjectUrl = (value?: string) => /^https?:\/\//i.test(value?.trim() || '');

export function projectDetailPath(project: ProjectItem) {
  const slug = project.slug?.trim();
  const routeKey = slug && !isExternalProjectUrl(slug) && !/[\/?#]/.test(slug) ? slug : project.id;
  return `/projects/${encodeURIComponent(routeKey)}`;
}

export function projectExternalUrl(project: ProjectItem) {
  return project.externalUrl || (isExternalProjectUrl(project.slug) ? project.slug : undefined);
}
