import { useMemo, useState } from 'react';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { PublicProjectCard } from '../components/PublicProjectCard';

export function ProjectsPage() {
  const { projects } = usePortfolio();
  const { locale, t, projectText } = useLocale();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('newest');
  const publicProjects = projects.filter((project) => project.isPublic);
  const categories = ['All', ...new Set(publicProjects.map((project) => project.category))];
  const tags = ['All', ...new Set(publicProjects.flatMap((project) => project.tags))];
  const visible = useMemo(() => publicProjects
    .filter((project) => (category === 'All' || project.category === category) && (tag === 'All' || project.tags.includes(tag)) && Object.values(projectText(project)).join(' ').toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => sort === 'newest' ? b.year - a.year || b.updatedAt.localeCompare(a.updatedAt) : sort === 'title' ? projectText(a).title.localeCompare(projectText(b).title, locale) : a.displayOrder - b.displayOrder), [projects, q, category, tag, sort, locale]);

  return <section className="page page-top">
    <div className="eyebrow">{t('projectArchive')}</div>
    <div className="title-row"><h1>{t('projectHeadline')}</h1><p>{visible.length} {t('publicProjects')}</p></div>
    <div className="filters">
      <input value={q} onChange={(event) => setQ(event.target.value)} placeholder={t('searchProjects')}/>
      <select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item} value={item}>{item === 'All' ? t('all') : locale === 'zh-TW' ? (publicProjects.find((project) => project.category === item)?.categoryZh || item) : item}</option>)}</select>
      <select value={tag} onChange={(event) => setTag(event.target.value)}>{tags.map((item) => <option key={item} value={item}>{item === 'All' ? t('all') : item}</option>)}</select>
      <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">{t('newest')}</option><option value="order">{t('curated')}</option><option value="title">{t('title')}</option></select>
    </div>
    <div className="project-grid">{visible.map((project) => <PublicProjectCard key={project.id} project={project}/>)}</div>
    {!visible.length && <div className="empty">{t('noProjects')}</div>}
  </section>;
}
