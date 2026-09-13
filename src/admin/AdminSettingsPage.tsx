import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';

export function AdminSettingsPage() {
  const { siteConfig, saveSiteConfig, exportBackup, importBackup, resetDemo } = usePortfolio();
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const file = useRef<HTMLInputElement>(null);

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
        github: value('github'), tradingView: value('tradingView'), linkedIn: value('linkedIn'),
        discord: value('discord'), instagram: value('instagram'), x: value('x'),
        availability: value('availability'), availabilityZh: value('availabilityZh'),
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
          <legend>{zh ? '聯絡與其他設定' : 'CONTACT & OTHER SETTINGS'}</legend>
          <label>Email<input name="email" type="email" defaultValue={siteConfig.email}/></label>
          <div className="form-two">
            <label>GitHub<input name="github" defaultValue={siteConfig.github}/></label><label>TradingView<input name="tradingView" defaultValue={siteConfig.tradingView}/></label>
            <label>LinkedIn<input name="linkedIn" defaultValue={siteConfig.linkedIn}/></label><label>Discord<input name="discord" defaultValue={siteConfig.discord}/></label>
            <label>Instagram<input name="instagram" defaultValue={siteConfig.instagram}/></label><label>X<input name="x" defaultValue={siteConfig.x}/></label>
            <label>Availability (English)<textarea name="availability" rows={3} defaultValue={siteConfig.availability}/></label><label>合作狀態（繁中）<textarea name="availabilityZh" rows={3} defaultValue={siteConfig.availabilityZh}/></label>
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
