import { Languages, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { siteConfig, error } = usePortfolio();
  const { locale, t, toggleLocale } = useLocale();
  const tagline = locale === 'zh-TW' ? siteConfig.taglineZh || siteConfig.tagline : siteConfig.tagline;
  const links = [['/', t('home')], ['/projects', t('projects')], ['/gallery', t('gallery')], ['/contact', t('contact')]];
  return <div className="site-shell">
    <header className="public-header">
      <Link className="brand brand-logo" to="/" aria-label={siteConfig.name}><img src="/ck-logo.jpg" alt="CK"/></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'open' : ''}>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>)}<button className="locale-toggle" onClick={toggleLocale} aria-label="Switch language"><Languages size={15}/>{locale === 'en' ? '中文' : 'EN'}</button><Link className="button small" to="/contact">{t('workWithMe')}</Link></nav>
    </header>
    {error && <div className="sync-error" role="alert">{locale === 'zh-TW' ? '網站內容暫時無法載入，請稍後重新整理。' : 'Content is temporarily unavailable. Please refresh shortly.'}</div>}
    <main><Outlet/></main>
    <footer><div><strong>{siteConfig.name}</strong><p>{tagline}</p></div></footer>
  </div>;
}
