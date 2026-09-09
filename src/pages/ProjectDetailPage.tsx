import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { projectExternalUrl } from '../utils/projectLinks';

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { projects, ready } = usePortfolio();
  const { locale, projectText, t } = useLocale();
  const p = projects.find((item) => item.isPublic && (item.slug === slug || item.id === slug));
  if (!p && !ready) return <section className="page page-top empty"><p>{locale === 'zh-TW' ? '載入作品中…' : 'Loading project…'}</p></section>;
  if (!p) return <section className="page page-top empty"><h1>{t('notFound')}</h1><Link to="/projects">{t('backProjects')}</Link></section>;

  const copy = projectText(p);
  const externalUrl = projectExternalUrl(p);
  const savedImages = [p.coverImage, ...(p.images || [])].filter((image, index, all) => Boolean(image) && all.indexOf(image) === index).slice(0, 3);
  const projectImages = savedImages.length ? savedImages : ['/ck-logo.jpg'];

  return <article className="page page-top detail">
    <Link className="text-link" to="/projects"><ArrowLeft size={15}/>{t('allProjects')}</Link>
    <div className="detail-head"><div><div className="eyebrow">{copy.category} / {p.year}</div><h1>{copy.title}</h1><p>{copy.shortDescription}</p></div><span className="status-chip">{copy.status}</span></div>
    {projectImages.length === 1
      ? <img className="detail-cover" src={projectImages[0]} alt=""/>
      : <div className={`detail-image-gallery image-count-${projectImages.length}`}>{projectImages.map((image, index) => <img key={image} src={image} alt={`${copy.title} ${index + 1}`}/>)}</div>}
    <div className="detail-grid"><div><div className="eyebrow">{t('caseStudy')}</div><p className="lead preserve">{copy.detailedDescription}</p></div><aside><div className="eyebrow">{t('stack')}</div><div className="tag-row">{p.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="link-stack">{p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noopener noreferrer">{t('liveDemo')} <ExternalLink size={15}/></a>}{p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">{t('github')} <ExternalLink size={15}/></a>}{externalUrl && <a href={externalUrl} target="_blank" rel="noopener noreferrer">{t('visitProject')} <ExternalLink size={15}/></a>}</div></aside></div>
    <div className="detail-cta"><h2>{t('buildSimilar')}</h2><Link className="button light" to={`/contact?sourceProjectId=${encodeURIComponent(p.id)}&sourceProjectTitle=${encodeURIComponent(copy.title)}`}>{t('discussSimilar')}</Link></div>
  </article>;
}
