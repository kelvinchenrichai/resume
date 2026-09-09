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
    setSaving(true);
    try {
      await saveSiteConfig({
        ...siteConfig,
        name: String(f.get('name')),
        tagline: String(f.get('tagline')),
        taglineZh: String(f.get('taglineZh')),
        bio: String(f.get('bio')),
        bioZh: String(f.get('bioZh')),
        email: String(f.get('email')),
        github: String(f.get('github')),
        tradingView: String(f.get('tradingView')),
        linkedIn: String(f.get('linkedIn')),
        discord: String(f.get('discord')),
        instagram: String(f.get('instagram')),
        x: String(f.get('x')),
        availability: String(f.get('availability')),
        availabilityZh: String(f.get('availabilityZh')),
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
      <h1>{zh ? '網站設定' : 'Site configuration'}</h1>
      <p>{zh ? '所有變更會同步儲存在雲端，並立即套用至公開網站。' : 'Changes are stored in the cloud and applied to the public site.'}</p>
    </div></div>
    {message && <div className="notice">{message}</div>}
    <div className="settings-grid">
      <form className="panel editor-form" onSubmit={save}>
        <div className="eyebrow">{zh ? '雙語網站設定' : 'BILINGUAL SITE CONFIG'}</div>
        <label>{zh ? '名稱' : 'Name'}<input name="name" defaultValue={siteConfig.name}/></label>
        <div className="form-two">
          <label>Tagline (English)<input name="tagline" defaultValue={siteConfig.tagline}/></label>
          <label>標語（繁中）<input name="taglineZh" defaultValue={siteConfig.taglineZh}/></label>
        </div>
        <div className="form-two">
          <label>Bio (English)<textarea name="bio" rows={4} defaultValue={siteConfig.bio}/></label>
          <label>簡介（繁中）<textarea name="bioZh" rows={4} defaultValue={siteConfig.bioZh}/></label>
        </div>
        <label>Email<input name="email" type="email" defaultValue={siteConfig.email}/></label>
        <div className="form-two">
          <label>GitHub<input name="github" defaultValue={siteConfig.github}/></label>
          <label>TradingView<input name="tradingView" defaultValue={siteConfig.tradingView}/></label>
          <label>LinkedIn<input name="linkedIn" defaultValue={siteConfig.linkedIn}/></label>
          <label>Discord<input name="discord" defaultValue={siteConfig.discord}/></label>
          <label>Instagram<input name="instagram" defaultValue={siteConfig.instagram}/></label>
          <label>X<input name="x" defaultValue={siteConfig.x}/></label>
        </div>
        <div className="form-two">
          <label>Availability (English)<textarea name="availability" rows={3} defaultValue={siteConfig.availability}/></label>
          <label>合作狀態（繁中）<textarea name="availabilityZh" rows={3} defaultValue={siteConfig.availabilityZh}/></label>
        </div>
        <button className="button" disabled={saving}>{saving ? (zh ? '儲存中…' : 'Saving…') : (zh ? '儲存設定' : 'Save configuration')}</button>
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
