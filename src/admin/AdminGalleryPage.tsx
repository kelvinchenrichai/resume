import { Edit3, Eye, EyeOff, ImagePlus, Pin, Plus, Trash2, Upload, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { GalleryItem } from '../types';

function GalleryEditor({ item, maxOrder, onSave, onClose }: { item: GalleryItem | null; maxOrder: number; onSave(item: GalleryItem | null, file: File | null, values: Record<string, string | boolean | number>): Promise<void>; onClose(): void }) {
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(item?.imageUrl || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!item && !file) { setError(zh ? '請先選擇圖片。' : 'Choose an image first.'); return; }
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError('');
    try {
      await onSave(item, file, {
        titleZh: String(form.get('titleZh') || ''), title: String(form.get('title') || ''),
        categoryZh: String(form.get('categoryZh') || ''), category: String(form.get('category') || ''),
        descriptionZh: String(form.get('descriptionZh') || ''), description: String(form.get('description') || ''),
        year: Number(form.get('year')) || new Date().getFullYear(), displayOrder: Number(form.get('displayOrder')) || maxOrder + 1,
        isPublic: form.get('isPublic') === 'on',
        isFeatured: form.get('isFeatured') === 'on',
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : zh ? '儲存失敗。' : 'Save failed.');
    } finally { setSaving(false); }
  }

  return <div className="modal-backdrop"><div className="modal gallery-editor">
    <div className="modal-head"><div><div className="eyebrow">{zh ? '證照／相簿 CMS' : 'CERTIFICATES / GALLERY CMS'}</div><h2>{item ? (zh ? '編輯證照／相簿項目' : 'Edit certificate / gallery item') : (zh ? '新增證照／相簿項目' : 'Add certificate / gallery item')}</h2></div><button onClick={onClose}><X/></button></div>
    <form className="editor-form" onSubmit={submit}>
      <label className="gallery-upload">{preview ? <img src={preview} alt=""/> : <span><ImagePlus size={34}/>{zh ? '選擇證照或照片' : 'Choose a credential or photo'}</span>}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setFile(event.target.files?.[0] || null)}/></label>
      <small className="upload-help">{zh ? '支援 JPG、PNG、WebP、GIF，單張最大 8 MB。編輯時不選新圖片會保留原圖。' : 'JPG, PNG, WebP or GIF up to 8 MB. Leave empty while editing to keep the current image.'}</small>
      <div className="form-two"><label>標題（繁中） *<input name="titleZh" required defaultValue={item?.titleZh || item?.title}/></label><label>Title (English)<input name="title" defaultValue={item?.title}/></label></div>
      <div className="form-two"><label>分類（繁中）<input name="categoryZh" defaultValue={item?.categoryZh || '證照'} placeholder="證照、獎項、活動"/></label><label>Category (English)<input name="category" defaultValue={item?.category || 'Credential'} placeholder="Credential, Award, Event"/></label></div>
      <div className="form-two"><label>說明（繁中）<textarea name="descriptionZh" rows={4} defaultValue={item?.descriptionZh}/></label><label>Description (English)<textarea name="description" rows={4} defaultValue={item?.description}/></label></div>
      <div className="form-two"><label>{zh ? '年份' : 'Year'}<input name="year" type="number" min="1900" max="2100" defaultValue={item?.year || new Date().getFullYear()}/></label><label>{zh ? '顯示順序' : 'Display order'}<input name="displayOrder" type="number" min="0" defaultValue={item?.displayOrder || maxOrder + 1}/></label></div>
      <div className="checks"><label><input name="isPublic" type="checkbox" defaultChecked={item?.isPublic ?? true}/>{zh ? '公開顯示' : 'Publish publicly'}</label><label><input name="isFeatured" type="checkbox" defaultChecked={item?.isFeatured ?? false}/>{zh ? '置頂於首頁' : 'Feature on homepage'}</label></div>
      {error && <p className="form-error">{error}</p>}
      <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>{zh ? '取消' : 'Cancel'}</button><button className="button" disabled={saving}><Upload size={16}/>{saving ? (zh ? '上傳中…' : 'Uploading…') : (zh ? '儲存並上架' : 'Save & publish')}</button></div>
    </form>
  </div></div>;
}

export function AdminGalleryPage() {
  const { gallery, saveGallery, deleteGallery } = usePortfolio();
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const [editing, setEditing] = useState<GalleryItem | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const sorted = [...gallery].sort((a, b) => a.displayOrder - b.displayOrder);

  async function remove(item: GalleryItem) {
    if (!confirm(zh ? `刪除「${item.titleZh || item.title}」及其圖片？` : `Delete “${item.title}” and its image?`)) return;
    try { await deleteGallery(item.id); setMessage(zh ? '證照／相簿項目已刪除。' : 'Certificate / gallery item deleted.'); }
    catch (err) { setMessage(err instanceof Error ? err.message : zh ? '刪除失敗。' : 'Delete failed.'); }
  }

  return <div className="admin-page">
    <div className="admin-title"><div><div className="eyebrow">{zh ? '證照／相簿 CMS' : 'CERTIFICATES / GALLERY CMS'}</div><h1>{zh ? '證照／相簿' : 'Certificates / Gallery'}</h1><p>{zh ? '上傳證照、獎項、活動照片與其他重要紀錄。' : 'Upload certificates, awards, event photos and milestones.'}</p></div><button className="button" onClick={() => setEditing(null)}><Plus size={16}/>{zh ? '新增證照／相簿項目' : 'Add certificate / gallery item'}</button></div>
    {message && <div className="notice">{message}</div>}
    {sorted.length === 0 ? <div className="panel gallery-admin-empty"><ImagePlus size={35}/><h2>{zh ? '尚未上傳任何內容' : 'No certificates or gallery items yet'}</h2><p>{zh ? '按「新增證照／相簿項目」上傳第一張證照或照片。' : 'Add your first certificate or photo.'}</p></div> : <div className="admin-gallery-grid">
      {sorted.map((item) => <article className="admin-gallery-card" key={item.id}><img src={item.imageUrl} alt=""/><div><small>{item.categoryZh || item.category}{item.year ? ` · ${item.year}` : ''}</small><h3>{item.titleZh || item.title}</h3><div className="gallery-statuses"><span className={item.isPublic ? 'visibility public' : 'visibility'}>{item.isPublic ? <Eye size={14}/> : <EyeOff size={14}/>} {item.isPublic ? (zh ? '公開' : 'Public') : (zh ? '草稿' : 'Draft')}</span>{item.isFeatured && <span className="visibility featured"><Pin size={14}/>{zh ? '首頁置頂' : 'Homepage'}</span>}</div><div className="table-actions"><button onClick={() => setEditing(item)} aria-label={zh ? '編輯' : 'Edit'}><Edit3 size={16}/></button><button onClick={() => remove(item)} aria-label={zh ? '刪除' : 'Delete'}><Trash2 size={16}/></button></div></div></article>)}
    </div>}
    {editing !== undefined && <GalleryEditor item={editing} maxOrder={Math.max(0, ...gallery.map((item) => item.displayOrder))} onSave={saveGallery} onClose={() => setEditing(undefined)}/>} 
  </div>;
}
