import { Fragment, ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { PublicProjectCard } from '../components/PublicProjectCard';

function StyledHeading({ children }: { children: string }) {
  return <>{children.split(/(\n|×)/).map((part, index): ReactNode => {
    if (part === '\n') return <br key={index}/>;
    if (part === '×') return <i key={index}>×</i>;
    return <Fragment key={index}>{part}</Fragment>;
  })}</>;
}

const tagsFrom = (value: string) => value.split(/[\n,，]+/).map((tag) => tag.trim()).filter(Boolean);

export function HomePage() {
  const { projects, gallery, siteConfig } = usePortfolio();
  const { locale, t } = useLocale();
  const zh = locale === 'zh-TW';
  const copy = (en: string | undefined, traditional: string | undefined, fallback: string) => zh ? traditional || en || fallback : en || fallback;
  const featured = projects.filter((project) => project.isPublic && project.isFeatured).sort((a, b) => (a.featuredOrder ?? a.displayOrder) - (b.featuredOrder ?? b.displayOrder) || a.displayOrder - b.displayOrder).slice(0, 6);
  const featuredGallery = gallery.filter((item) => item.isPublic && item.isFeatured).sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 4);
  const heroTitle = copy(siteConfig.tagline, siteConfig.taglineZh, t('selectedTitle'));
  const heroBody = copy(siteConfig.bio, siteConfig.bioZh, t('aboutBody'));
  const aboutTags = tagsFrom(copy(siteConfig.aboutTags, siteConfig.aboutTagsZh, [t('trader'), t('builder'), t('experimenter'), t('thinker'), t('prototyper'), t('research')].join('\n')));

  return <>
    {siteConfig.showHero !== false && <section className="hero page">
      <div className="eyebrow">{siteConfig.name} / {copy(siteConfig.heroEyebrow, siteConfig.heroEyebrowZh, t('independent'))}</div>
      <h1><StyledHeading>{heroTitle}</StyledHeading></h1>
      <p className="preserve">{heroBody}</p>
      <div className="actions">
        <Link className="button" to="/projects">{copy(siteConfig.heroPrimaryLabel, siteConfig.heroPrimaryLabelZh, t('viewMyWork'))} <ArrowRight size={17}/></Link>
        <Link className="button secondary" to="/contact">{copy(siteConfig.heroSecondaryLabel, siteConfig.heroSecondaryLabelZh, t('workWithMe'))}</Link>
      </div>
    </section>}
    {siteConfig.showAbout !== false && <section className="page section split">
      <div><div className="eyebrow">{copy(siteConfig.aboutEyebrow, siteConfig.aboutEyebrowZh, t('about'))} / 01</div><h2 className="preserve">{copy(siteConfig.aboutTitle, siteConfig.aboutTitleZh, t('aboutTitle'))}</h2></div>
      <div><p className="lead preserve">{copy(siteConfig.aboutBody, siteConfig.aboutBodyZh, t('aboutBody'))}</p><div className="pill-grid">{aboutTags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
    </section>}
    <section className="page section"><div className="section-head"><div><div className="eyebrow">{t('selectedWork')} / 02</div><h2>{t('selectedTitle')}</h2></div><Link className="text-link" to="/projects">{t('viewAll')} <ArrowRight size={16}/></Link></div><div className="project-grid">{featured.map((project) => <PublicProjectCard key={project.id} project={project}/>)}</div></section>
    {featuredGallery.length > 0 && <section className="page section home-gallery"><div className="section-head"><div><div className="eyebrow">{t('featuredGallery')} / 03</div><h2>{t('featuredGalleryTitle')}</h2></div><Link className="text-link" to="/gallery">{t('viewAllGallery')} <ArrowRight size={16}/></Link></div><div className="home-gallery-grid">{featuredGallery.map((item) => { const title = zh ? item.titleZh || item.title : item.title; const category = zh ? item.categoryZh || item.category : item.category; return <Link className="home-gallery-card" to="/gallery" key={item.id}><img src={item.imageUrl} alt={title}/><span><small>{category}{item.year ? ` · ${item.year}` : ''}</small><strong>{title}</strong></span></Link>; })}</div></section>}
    {siteConfig.showFinalCta !== false && <section className="page section final-cta">
      <div className="eyebrow">{copy(siteConfig.ctaEyebrow, siteConfig.ctaEyebrowZh, t('haveIdea'))}</div>
      <h2 className="preserve">{copy(siteConfig.ctaTitle, siteConfig.ctaTitleZh, t('makeConcrete'))}</h2>
      <p className="preserve">{copy(siteConfig.ctaBody, siteConfig.ctaBodyZh, t('projectTypes'))}</p>
      <Link className="button light" to="/contact">{copy(siteConfig.ctaButtonLabel, siteConfig.ctaButtonLabelZh, t('discuss'))} <ArrowRight size={17}/></Link>
    </section>}
  </>;
}
