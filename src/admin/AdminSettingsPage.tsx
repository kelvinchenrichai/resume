import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import { Download, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { InquiryOption } from '../types';

function OptionEditor({ title, options, setOptions, zh }: { title: string; options: InquiryOption[]; setOptions: Dispatch<SetStateAction<InquiryOption[]>>; zh: boolean }) {
  const update = (id: string, field: 'label' | 'labelZh', value: string) => setOptions((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  return <div className="option-editor">
    <div className="contact-links-heading"><b>{title}</b><button type="button" className="button secondary small" onClick={() => setOptions((current) => [...current, { id: `option-${Date.now()}-${current.length}`, label: '', labelZh: '' }])}><Plus size={15}/>{zh ? '新增' : 'Add'}</button></div>
    {options.length === 0 && <p className="empty-links">{zh ? '目前沒有選項。' : 'No options yet.'}</p>}
    {options.map((item, index) => <div className="option-row" key={item.id}>
      <label>{zh ? '英文內容' : 'English'}<input value={item.label} onChange={(e) => update(item.id, 'label', e.target.value)}/></label>
      <label>{zh ? '中文內容' : 'Chinese'}<input value={item.labelZh || ''} onChange={(e) => update(item.id, 'labelZh', e.target.value)}/></label>
      <button type="button" className="icon-button danger-outline" onClick={() => setOptions((current) => current.filter((option) => option.id !== item.id))} aria-label={`${zh ? '刪除' : 'Remove'} ${item.label || index + 1}`}><Trash2 size={17}/></button>
    </div>)}
  </div>;
}

export function AdminSettingsPage() {
  const { siteConfig, saveSiteConfig, exportBackup, importBackup, resetDemo } = usePortfolio();
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [contactLinks, setContactLinks] = useState(siteConfig.contactLinks || []);
  const [projectTypeOptions, setProjectTypeOptions] = useState(siteConfig.projectTypeOptions || []);
  const [budgetOptions, setBudgetOptions] = useState(siteConfig.budgetOptions || []);
  const [timelineOptions, setTimelineOptions] = useState(siteConfig.timelineOptions || []);
  const file = useRef<HTMLInputElement>(null);

  useEffect(() => { setContactLinks(siteConfig.contactLinks || []); }, [siteConfig.contactLinks]);
  useEffect(() => { setProjectTypeOptions(siteConfig.projectTypeOptions || []); }, [siteConfig.projectTypeOptions]);
  useEffect(() => { setBudgetOptions(siteConfig.budgetOptions || []); }, [siteConfig.budgetOptions]);
  useEffect(() => { setTimelineOptions(siteConfig.timelineOptions || []); }, [siteConfig.timelineOptions]);
  const updateContactLink = (id: string, field: 'label' | 'labelZh' | 'url', nextValue: string) => setContactLinks((current) => current.map((link) => link.id === id ? { ...link, [field]: nextValue } : link));

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const value = (name: string) => String(f.get(name) || '').trim();
    setSaving(true);
    try {
      await saveSiteConfig({
        ...siteConfig,
        name: value('name'),
        tagline: value('tagline'), taglineZh: value('taglineZh'),
        bio: value('bio'), bioZh: value('bioZh'),
        email: value('email'),
        contactLinks: contactLinks.map((link) => ({ ...link, label: link.label.trim(), labelZh: link.labelZh?.trim(), url: link.url.trim() })).filter((link) => link.label && link.url),
        availability: value('availability'), availabilityZh: value('availabilityZh'),
        contactEyebrow: value('contactEyebrow'), contactEyebrowZh: value('contactEyebrowZh'),
        contactTitle: value('contactTitle'), contactTitleZh: value('contactTitleZh'),
        contactBody: value('contactBody'), contactBodyZh: value('contactBodyZh'),
        projectTypeOptions: projectTypeOptions.map((item) => ({ ...item, label: item.label.trim(), labelZh: item.labelZh?.trim() })).filter((item) => item.label),
        budgetOptions: budgetOptions.map((item) => ({ ...item, label: item.label.trim(), labelZh: item.labelZh?.trim() })).filter((item) => item.label),
        timelineOptions: timelineOptions.map((item) => ({ ...item, label: item.label.trim(), labelZh: item.labelZh?.trim() })).filter((item) => item.label),
        showHeader: f.has('showHeader'), showHero: f.has('showHero'), showAbout: f.has('showAbout'), showFinalCta: f.has('showFinalCta'),
        navHome: value('navHome'), navHomeZh: value('navHomeZh'),
        navProjects: value('navProjects'), navProjectsZh: value('navProjectsZh'),
        navGallery: value('navGallery'), navGalleryZh: value('navGalleryZh'),
        navContact: value('navContact'), navContactZh: value('navContactZh'),
        navCta: value('navCta'), navCtaZh: value('navCtaZh'),
        heroEyebrow: value('heroEyebrow'), heroEyebrowZh: value('heroEyebrowZh'),
        heroPrimaryLabel: value('heroPrimaryLabel'), heroPrimaryLabelZh: value('heroPrimaryLabelZh'),
        heroSecondaryLabel: value('heroSecondaryLabel'), heroSecondaryLabelZh: value('heroSecondaryLabelZh'),
        aboutEyebrow: value('aboutEyebrow'), aboutEyebrowZh: value('aboutEyebrowZh'),
        aboutTitle: value('aboutTitle'), aboutTitleZh: value('aboutTitleZh'),
        aboutBody: value('aboutBody'), aboutBodyZh: value('aboutBodyZh'),
        aboutTags: value('aboutTags'), aboutTagsZh: value('aboutTagsZh'),
        ctaEyebrow: value('ctaEyebrow'), ctaEyebrowZh: value('ctaEyebrowZh'),
        ctaTitle: value('ctaTitle'), ctaTitleZh: value('ctaTitleZh'),
        ctaBody: value('ctaBody'), ctaBodyZh: value('ctaBodyZh'),
        ctaButtonLabel: value('ctaButtonLabel'), ctaButtonLabelZh: value('ctaButtonLabelZh'),
      });
      setMessage(zh ? '網站設定已同步至雲端。' : 'Site configuration synced to the cloud.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : zh ? '儲存失敗。' : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  async function load(e: ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    try {
      await importBackup(JSON.parse(await selected.text()));
      setMessage(zh ? '備份已匯入雲端。' : 'Backup imported to the cloud.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : zh ? '匯入失敗。' : 'Import failed.');
    }
    e.target.value = '';
  }

  async function reset() {
    if (!confirm(zh ? '將雲端作品、詢價與設定重設為示範資料？' : 'Reset cloud projects, inquiries and settings to demo data?')) return;
    try {
      await resetDemo();
      setMessage(zh ? '雲端資料已還原為示範內容。' : 'Cloud data restored to the demo dataset.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : zh ? '重設失敗。' : 'Reset failed.');
    }
  }

  return <div className="admin-page">
    <div className="admin-title"><div>
      <div className="eyebrow">{zh ? '設定／備份' : 'SETTINGS / BACKUP'}</div>
      <h1>{zh ? '網站內容與顯示設定' : 'Site content & visibility'}</h1>
      <p>{zh ? '開關首頁區塊並編輯中英文文字；儲存後立即套用至公開網站。' : 'Toggle homepage sections and edit bilingual copy. Changes apply to the public site after saving.'}</p>
    </div></div>
    {message && <div className="notice">{message}</div>}
    <div className="settings-grid">
      <form className="panel editor-form site-settings-form" onSubmit={save}>
        <fieldset className="settings-section">
          <legend>{zh ? '區塊顯示開關' : 'SECTION VISIBILITY'}</legend>
          <div className="visibility-grid">
            <label><input type="checkbox" name="showHeader" defaultChecked={siteConfig.showHeader !== false}/><span><b>{zh ? '頁首導覽' : 'Header navigation'}</b><small>{zh ? 'Logo、選單與語言切換' : 'Logo, menu and language switch'}</small></span></label>
            <label><input type="checkbox" name="showHero" defaultChecked={siteConfig.showHero !== false}/><span><b>{zh ? '首頁主視覺' : 'Homepage hero'}</b><small>{zh ? '大標題、簡介與按鈕' : 'Headline, intro and buttons'}</small></span></label>
            <label><input type="checkbox" name="showAbout" defaultChecked={siteConfig.showAbout !== false}/><span><b>{zh ? '關於我區塊' : 'About section'}</b><small>{zh ? '介紹文字與標籤' : 'Introduction and tags'}</small></span></label>
            <label><input type="checkbox" name="showFinalCta" defaultChecked={siteConfig.showFinalCta !== false}/><span><b>{zh ? '合作邀請區塊' : 'Collaboration callout'}</b><small>{zh ? '首頁底部黑色區塊' : 'Dark callout near the homepage footer'}</small></span></label>
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '頁首導覽文字' : 'HEADER NAVIGATION COPY'}</legend>
          <label>{zh ? '網站名稱' : 'Site name'}<input name="name" defaultValue={siteConfig.name}/></label>
          <div className="form-two">
            <label>Home (English)<input name="navHome" defaultValue={siteConfig.navHome}/></label><label>首頁（繁中）<input name="navHomeZh" defaultValue={siteConfig.navHomeZh}/></label>
            <label>Projects (English)<input name="navProjects" defaultValue={siteConfig.navProjects}/></label><label>作品（繁中）<input name="navProjectsZh" defaultValue={siteConfig.navProjectsZh}/></label>
            <label>Gallery (English)<input name="navGallery" defaultValue={siteConfig.navGallery}/></label><label>相簿（繁中）<input name="navGalleryZh" defaultValue={siteConfig.navGalleryZh}/></label>
            <label>Contact (English)<input name="navContact" defaultValue={siteConfig.navContact}/></label><label>聯絡（繁中）<input name="navContactZh" defaultValue={siteConfig.navContactZh}/></label>
            <label>CTA button (English)<input name="navCta" defaultValue={siteConfig.navCta}/></label><label>右側按鈕（繁中）<input name="navCtaZh" defaultValue={siteConfig.navCtaZh}/></label>
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '首頁主視覺文字' : 'HOMEPAGE HERO COPY'}</legend>
          <div className="form-two">
            <label>Eyebrow (English)<input name="heroEyebrow" defaultValue={siteConfig.heroEyebrow}/></label><label>小標（繁中）<input name="heroEyebrowZh" defaultValue={siteConfig.heroEyebrowZh}/></label>
            <label>Headline (English)<textarea name="tagline" rows={3} defaultValue={siteConfig.tagline}/></label><label>大標題（繁中）<textarea name="taglineZh" rows={3} defaultValue={siteConfig.taglineZh}/></label>
            <label>Introduction (English)<textarea name="bio" rows={4} defaultValue={siteConfig.bio}/></label><label>簡介（繁中）<textarea name="bioZh" rows={4} defaultValue={siteConfig.bioZh}/></label>
            <label>Primary button (English)<input name="heroPrimaryLabel" defaultValue={siteConfig.heroPrimaryLabel}/></label><label>主要按鈕（繁中）<input name="heroPrimaryLabelZh" defaultValue={siteConfig.heroPrimaryLabelZh}/></label>
            <label>Secondary button (English)<input name="heroSecondaryLabel" defaultValue={siteConfig.heroSecondaryLabel}/></label><label>次要按鈕（繁中）<input name="heroSecondaryLabelZh" defaultValue={siteConfig.heroSecondaryLabelZh}/></label>
          </div>
          <p className="field-help">{zh ? '大標題可按 Enter 換行；「×」會保留淡色造型。' : 'Press Enter to add headline line breaks. The × character keeps its muted styling.'}</p>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '關於我文字' : 'ABOUT COPY'}</legend>
          <div className="form-two">
            <label>Eyebrow (English)<input name="aboutEyebrow" defaultValue={siteConfig.aboutEyebrow}/></label><label>小標（繁中）<input name="aboutEyebrowZh" defaultValue={siteConfig.aboutEyebrowZh}/></label>
            <label>Title (English)<textarea name="aboutTitle" rows={3} defaultValue={siteConfig.aboutTitle}/></label><label>標題（繁中）<textarea name="aboutTitleZh" rows={3} defaultValue={siteConfig.aboutTitleZh}/></label>
            <label>Body (English)<textarea name="aboutBody" rows={5} defaultValue={siteConfig.aboutBody}/></label><label>內文（繁中）<textarea name="aboutBodyZh" rows={5} defaultValue={siteConfig.aboutBodyZh}/></label>
            <label>Tags (English)<textarea name="aboutTags" rows={6} defaultValue={siteConfig.aboutTags}/></label><label>標籤（繁中）<textarea name="aboutTagsZh" rows={6} defaultValue={siteConfig.aboutTagsZh}/></label>
          </div>
          <p className="field-help">{zh ? '標籤請一行輸入一個，也可用逗號分隔。' : 'Enter one tag per line, or separate tags with commas.'}</p>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '合作邀請文字' : 'COLLABORATION CALLOUT COPY'}</legend>
          <div className="form-two">
            <label>Eyebrow (English)<input name="ctaEyebrow" defaultValue={siteConfig.ctaEyebrow}/></label><label>小標（繁中）<input name="ctaEyebrowZh" defaultValue={siteConfig.ctaEyebrowZh}/></label>
            <label>Title (English)<textarea name="ctaTitle" rows={3} defaultValue={siteConfig.ctaTitle}/></label><label>標題（繁中）<textarea name="ctaTitleZh" rows={3} defaultValue={siteConfig.ctaTitleZh}/></label>
            <label>Description (English)<textarea name="ctaBody" rows={4} defaultValue={siteConfig.ctaBody}/></label><label>說明（繁中）<textarea name="ctaBodyZh" rows={4} defaultValue={siteConfig.ctaBodyZh}/></label>
            <label>Button (English)<input name="ctaButtonLabel" defaultValue={siteConfig.ctaButtonLabel}/></label><label>按鈕（繁中）<input name="ctaButtonLabelZh" defaultValue={siteConfig.ctaButtonLabelZh}/></label>
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '聯絡頁文字' : 'CONTACT PAGE COPY'}</legend>
          <div className="form-two">
            <label>Eyebrow (English)<input name="contactEyebrow" defaultValue={siteConfig.contactEyebrow}/></label><label>小標（繁中）<input name="contactEyebrowZh" defaultValue={siteConfig.contactEyebrowZh}/></label>
            <label>Title (English)<textarea name="contactTitle" rows={4} defaultValue={siteConfig.contactTitle}/></label><label>標題（繁中）<textarea name="contactTitleZh" rows={4} defaultValue={siteConfig.contactTitleZh}/></label>
            <label>Introduction (English)<textarea name="contactBody" rows={5} defaultValue={siteConfig.contactBody}/></label><label>介紹（繁中）<textarea name="contactBodyZh" rows={5} defaultValue={siteConfig.contactBodyZh}/></label>
            <label>Availability (English)<textarea name="availability" rows={3} defaultValue={siteConfig.availability}/></label><label>合作狀態（繁中）<textarea name="availabilityZh" rows={3} defaultValue={siteConfig.availabilityZh}/></label>
          </div>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '詢價表單下拉選單' : 'INQUIRY DROPDOWN OPTIONS'}</legend>
          <p className="field-help">{zh ? '每個選項都可以新增、刪除，並分別設定中英文內容。' : 'Add, remove, and edit every option in English and Chinese.'}</p>
          <OptionEditor title={zh ? '專案類型' : 'Project types'} options={projectTypeOptions} setOptions={setProjectTypeOptions} zh={zh}/>
          <OptionEditor title={zh ? '預算範圍' : 'Budget ranges'} options={budgetOptions} setOptions={setBudgetOptions} zh={zh}/>
          <OptionEditor title={zh ? '時程' : 'Timelines'} options={timelineOptions} setOptions={setTimelineOptions} zh={zh}/>
        </fieldset>

        <fieldset className="settings-section">
          <legend>{zh ? '聯絡連結與 Email' : 'CONTACT LINKS & EMAIL'}</legend>
          <label>Email<input name="email" type="email" defaultValue={siteConfig.email}/></label>
          <div className="contact-links-editor">
            <div className="contact-links-heading"><div><b>{zh ? '自訂聯絡連結' : 'Custom contact links'}</b><small>{zh ? '可自由新增、刪除、改名稱與網址。' : 'Add, remove, rename, and update each URL.'}</small></div><button type="button" className="button secondary small" onClick={() => setContactLinks((current) => [...current, { id: `link-${Date.now()}-${current.length}`, label: '', labelZh: '', url: '' }])}><Plus size={15}/>{zh ? '新增連結' : 'Add link'}</button></div>
            {contactLinks.length === 0 && <p className="empty-links">{zh ? '目前沒有連結，按「新增連結」建立第一個。' : 'No links yet. Add your first link.'}</p>}
            {contactLinks.map((link, index) => <div className="contact-link-row" key={link.id}>
              <label>{zh ? '英文名稱' : 'English label'}<input value={link.label} onChange={(e) => updateContactLink(link.id, 'label', e.target.value)} placeholder="GitHub"/></label>
              <label>{zh ? '中文名稱' : 'Chinese label'}<input value={link.labelZh || ''} onChange={(e) => updateContactLink(link.id, 'labelZh', e.target.value)} placeholder="GitHub"/></label>
              <label>{zh ? '網址' : 'URL'}<input type="url" value={link.url} onChange={(e) => updateContactLink(link.id, 'url', e.target.value)} placeholder="https://..."/></label>
              <button type="button" className="icon-button danger-outline" onClick={() => setContactLinks((current) => current.filter((item) => item.id !== link.id))} aria-label={`${zh ? '刪除' : 'Remove'} ${link.label || index + 1}`}><Trash2 size={17}/></button>
            </div>)}
          </div>
        </fieldset>

        <button className="button settings-save" disabled={saving}>{saving ? (zh ? '儲存中…' : 'Saving…') : (zh ? '儲存並套用到網站' : 'Save and apply to site')}</button>
      </form>
      <section className="panel backup-panel">
        <div className="eyebrow">{zh ? '備份' : 'BACKUP'}</div>
        <h2>{zh ? '雲端資料' : 'Cloud data'}</h2>
        <p>{zh ? '將作品、詢價與雙語網站設定匯出成單一 JSON 備份。' : 'Export projects, inquiries and bilingual site configuration as one JSON backup.'}</p>
        <button className="button secondary" onClick={exportBackup}><Download size={16}/>{zh ? '匯出 JSON' : 'Export JSON'}</button>
        <input ref={file} hidden type="file" accept="application/json" onChange={load}/>
        <button className="button secondary" onClick={() => file.current?.click()}><Upload size={16}/>{zh ? '匯入 JSON' : 'Import JSON'}</button>
        <hr/>
        <p>{zh ? '將所有雲端內容重設為內建示範資料。' : 'Reset all cloud content to the bundled demo dataset.'}</p>
        <button className="button danger" onClick={reset}><RotateCcw size={16}/>{zh ? '重設示範資料' : 'Reset demo data'}</button>
      </section>
    </div>
  </div>;
}
