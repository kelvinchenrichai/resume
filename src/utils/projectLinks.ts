import { ProjectItem } from '../types';

export const isExternalProjectUrl = (value?: string) => /^https?:\/\//i.test(value?.trim() || '');

export function safeHttpUrl(value?: string) {
  const candidate = value?.trim();
  if (!candidate || !isExternalProjectUrl(candidate)) return undefined;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : undefined;
  } catch { return undefined; }
}

export function projectDetailPath(project: ProjectItem) {
  const slug = project.slug?.trim();
  const routeKey = slug && !isExternalProjectUrl(slug) && !/[\/?#]/.test(slug) ? slug : project.id;
  return `/projects/${encodeURIComponent(routeKey)}`;
}

export function projectExternalUrl(project: ProjectItem) {
  return safeHttpUrl(project.externalUrl) || safeHttpUrl(project.slug);
}
