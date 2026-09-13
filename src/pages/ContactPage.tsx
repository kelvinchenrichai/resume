import { FormEvent, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { BUDGET_RANGES, PROJECT_TYPES, TIMELINES } from '../config/inquiryOptions';
import { InquiryOption } from '../types';
import { safeHttpUrl } from '../utils/projectLinks';

const legacyOptions = (values: string[]): InquiryOption[] => values.map((label, index) => ({ id: `legacy-${index}`, label, labelZh: label }));

export function ContactPage() {
  const { saveInquiry, siteConfig } = usePortfolio();
  const { locale, t } = useLocale();
  const zh = locale === 'zh-TW';
  const [params] = useSearchParams();
  const sourceId = params.get('sourceProjectId') || undefined;
  const sourceTitle = params.get('sourceProjectTitle') || undefined;
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const copy = (en: string | undefined, traditional: string | undefined, fallback: string) => zh ? traditional || en || fallback : en || fallback;
  const optionLabel = (option: InquiryOption) => zh ? option.labelZh || option.label : option.label;
  const availability = copy(siteConfig.availability, siteConfig.availabilityZh, '');
  const projectTypes = siteConfig.projectTypeOptions?.length ? siteConfig.projectTypeOptions : legacyOptions(PROJECT_TYPES);
  const budgets = siteConfig.budgetOptions?.length ? siteConfig.budgetOptions : legacyOptions(BUDGET_RANGES);
  const timelines = siteConfig.timelineOptions?.length ? siteConfig.timelineOptions : legacyOptions(TIMELINES);
  const contactLinks = (siteConfig.contactLinks || []).map((link) => ({ ...link, safeUrl: safeHttpUrl(link.url) })).filter((link) => link.label && link.safeUrl);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const fd = new FormData(e.currentTarget);
    if (fd.get('website')) return;
    const name = String(fd.get('name') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const requirements = String(fd.get('requirements') || '').trim();
    const projectType = String(fd.get('projectType') || '');
    if (!name || !email || !requirements || !projectType) { setError(t('required')); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError(t('invalidEmail')); return; }
    setLoading(true);
    setError('');
    const now = new Date();
    try {
      await saveInquiry({
        id: `inq-${Date.now()}`,
        date: `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`,
        clientName: name, clientEmail: email, projectName: String(fd.get('projectName') || projectType), projectType,
        budgetRange: String(fd.get('budgetRange') || ''), desiredTimeline: String(fd.get('timeline') || ''),
        referenceUrl: String(fd.get('referenceUrl') || ''), sourceProjectId: sourceId, sourceProjectTitle: sourceTitle,
        status: 'NEW', requirements, contactMethod: String(fd.get('preferredContact') || 'Email'),
        additionalNotes: String(fd.get('notes') || ''), createdAt: now.toISOString(), updatedAt: now.toISOString(),
      });
      setDone(true);
    } catch {
      setError(zh ? '送出失敗，請稍後再試。' : 'Unable to send. Please try again.');
    } finally { setLoading(false); }
  }

  return <section className="page page-top contact-grid">
    <div className="contact-copy">
      <div className="eyebrow">{copy(siteConfig.contactEyebrow, siteConfig.contactEyebrowZh, t('letsTalk'))}</div>
      <h1>{copy(siteConfig.contactTitle, siteConfig.contactTitleZh, t('contactHeadline'))}</h1>
      <p>{copy(siteConfig.contactBody, siteConfig.contactBodyZh, t('contactBody'))}</p>
      <div className="contact-meta">
        <p>{availability}</p>
        {contactLinks.length > 0 && <div className="public-contact-links">{contactLinks.map((link) => <a key={link.id} href={link.safeUrl} target="_blank" rel="noopener noreferrer">{copy(link.label, link.labelZh, link.label)}<ExternalLink size={14}/></a>)}</div>}
      </div>
    </div>
    {done ? <div className="success-panel">
      <div className="eyebrow">{t('thankYou')}</div><h2>{t('received')}</h2><p>{t('receivedBody')}</p>
      <div className="actions"><Link className="button" to="/">{t('backHome')}</Link><Link className="button secondary" to="/projects">{t('viewProjects')}</Link></div>
    </div> : <form className="inquiry-form" onSubmit={submit}>
      <div className="eyebrow">{t('inquiry')}</div>
      {sourceTitle && <div className="source-note">{t('inspired')} <strong>{sourceTitle}</strong></div>}
      <div className="form-two"><label>{t('name')} *<input name="name" required/></label><label>{t('email')} *<input name="email" type="email" required/></label></div>
      <label>{t('projectName')}<input name="projectName" defaultValue={sourceTitle || ''}/></label>
      <label>{t('projectType')} *<select name="projectType" required defaultValue=""><option value="" disabled>{t('selectOne')}</option>{projectTypes.map((option) => <option key={option.id} value={optionLabel(option)}>{optionLabel(option)}</option>)}</select></label>
      <div className="form-two">
        <label>{t('budget')}<select name="budgetRange">{budgets.map((option) => <option key={option.id} value={optionLabel(option)}>{optionLabel(option)}</option>)}</select></label>
        <label>{t('timeline')}<select name="timeline">{timelines.map((option) => <option key={option.id} value={optionLabel(option)}>{optionLabel(option)}</option>)}</select></label>
      </div>
      <label>{t('requirements')} *<textarea name="requirements" rows={6} required/></label>
      <div className="form-two"><label>{t('preferredContact')}<input name="preferredContact" placeholder="Email, LINE, Telegram..."/></label><label>{t('referenceUrl')}<input name="referenceUrl" type="url"/></label></div>
      <label>{t('notes')}<textarea name="notes" rows={3}/></label>
      <input name="website" className="honeypot" tabIndex={-1} autoComplete="off"/>
      {error && <p className="form-error">{error}</p>}
      <button className="button" disabled={loading}>{loading ? t('sending') : t('send')}</button>
    </form>}
  </section>;
}
