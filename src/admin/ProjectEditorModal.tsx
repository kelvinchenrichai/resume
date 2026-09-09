import { FormEvent, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLocale } from '../app/LocaleContext';
import { POPULAR_TAGS, PRESET_CATEGORIES } from '../data/initialProjects';
import { cloudApi } from '../services/cloudApi';
import { imageService } from '../services/imageService';
import { ProjectItem } from '../types';

const STATUS_OPTIONS = [
  { en: 'Draft', zh: '草稿' },
  { en: 'In progress', zh: '進行中' },
  { en: 'Prototype', zh: '原型' },
  { en: 'Completed', zh: '已完成' },
  { en: 'Case study', zh: '案例研究' },
];

export function ProjectEditorModal({ project, maxOrder, onSave, onClose }: { project: ProjectItem | null; maxOrder: number; onSave(p: ProjectItem): Promise<void> | void; onClose(): void }) {
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const now = new Date().toISOString();
  const base: ProjectItem = project || { id:`proj-${Date.now()}`, title:'', titleZh:'', coverImage:'', shortDescription:'', shortDescriptionZh:'', detailedDescription:'', detailedDescriptionZh:'', category:PRESET_CATEGORIES[0], categoryZh:'交易／量化', tags:[], year:new Date().getFullYear(), status:'Draft', statusZh:'草稿', isFeatured:false, isPublic:false, displayOrder:maxOrder+1, createdAt:now, updatedAt:now };
  const [tags, setTags] = useState(base.tags);
  const [customTag, setCustomTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrls, setImageUrls] = useState([base.coverImage, base.images?.[0] || '', base.images?.[1] || '']);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null]);
  const [imagePreviews, setImagePreviews] = useState([base.coverImage, base.images?.[0] || '', base.images?.[1] || '']);
  const [preview, setPreview] = useState({
    title: base.title,
    titleZh: base.titleZh,
    coverImage: base.coverImage,
    shortDescription: base.shortDescription,
    shortDescriptionZh: base.shortDescriptionZh,
    category: base.category,
    categoryZh: base.categoryZh,
    status: base.status,
    year: String(base.year),
  });

  const previewStatus = STATUS_OPTIONS.find((item) => item.en === preview.status) || STATUS_OPTIONS[0];
  const previewTitle = zh ? preview.titleZh || preview.title : preview.title || preview.titleZh;
  const previewDescription = zh ? preview.shortDescriptionZh || preview.shortDescription : preview.shortDescription || preview.shortDescriptionZh;
  const previewCategory = zh ? preview.categoryZh || preview.category : preview.category || preview.categoryZh;

  function syncPreview(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (!target.name || !(target.name in preview)) return;
    setPreview((current) => ({ ...current, [target.name]: target.value }));
  }

  function toggleTag(tag: string) {
    setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  }

  function addCustomTag() {
    const next = customTag.trim();
    if (next && !tags.includes(next)) setTags((current) => [...current, next]);
    setCustomTag('');
  }

  function updateImageUrl(index: number, value: string) {
    setImageUrls((current) => current.map((item, position) => position === index ? value : item));
    if (!imageFiles[index]) setImagePreviews((current) => current.map((item, position) => position === index ? value : item));
  }

  async function selectImage(index: number, file?: File) {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setError(zh ? '每張圖片需小於 8 MB。' : 'Each image must be under 8 MB.');
      return;
    }
    setError('');
    const dataUrl = await imageService.fileToDataUrl(file);
    setImageFiles((current) => current.map((item, position) => position === index ? file : item));
    setImagePreviews((current) => current.map((item, position) => position === index ? dataUrl : item));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const status = STATUS_OPTIONS.find((item) => item.en === String(form.get('status'))) || STATUS_OPTIONS[0];
    setSaving(true);
    setError('');
    try {
      const uploaded = await Promise.all(imageFiles.map(async (file) => file ? (await cloudApi.uploadProjectImage(file)).url : null));
      const resolvedImages = imageUrls.map((url, index) => uploaded[index] || url.trim());
      await onSave({
        ...base,
        title: String(form.get('title')).trim(), titleZh: String(form.get('titleZh')).trim(),
        slug: String(form.get('slug')).trim() || undefined, coverImage: resolvedImages[0], images: resolvedImages.slice(1).filter(Boolean),
        shortDescription: String(form.get('shortDescription')).trim(), shortDescriptionZh: String(form.get('shortDescriptionZh')).trim(),
        detailedDescription: String(form.get('detailedDescription')).trim(), detailedDescriptionZh: String(form.get('detailedDescriptionZh')).trim(),
        category: String(form.get('category')), categoryZh: String(form.get('categoryZh')).trim(), tags,
        year: Number(form.get('year')), status: status.en, statusZh: status.zh,
        demoUrl: String(form.get('demoUrl')).trim() || undefined, githubUrl: String(form.get('githubUrl')).trim() || undefined, externalUrl: String(form.get('externalUrl')).trim() || undefined,
        isPublic: form.get('isPublic') === 'on', isFeatured: form.get('isFeatured') === 'on',
        displayOrder: Number(form.get('displayOrder')) || 1, updatedAt: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : zh ? '儲存失敗。' : 'Save failed.');
    } finally { setSaving(false); }
  }

  return <div className="modal-backdrop"><div className="modal">
    <div className="modal-head"><div><div className="eyebrow">{project ? (zh ? '編輯作品' : 'EDIT PROJECT') : (zh ? '新增作品' : 'NEW PROJECT')}</div><h2>{zh ? project?.titleZh || project?.title || '新增作品集項目' : project?.title || 'Add a portfolio project'}</h2></div><button onClick={onClose}><X/></button></div>
    <form onSubmit={submit} onInput={syncPreview} className="editor-form">
      <div className="bilingual-note">{zh ? '中文內容會優先顯示；英文欄位可供英文版網站使用。' : 'Maintain both English and Traditional Chinese copy. English is used as the fallback.'}</div>
      <section className="project-live-preview" aria-live="polite">
        <div className="preview-heading"><span className="eyebrow">{zh ? '即時預覽' : 'LIVE PREVIEW'}</span><small>{zh ? '輸入內容時會同步更新' : 'Updates as you type'}</small></div>
        <div className="preview-project-card">
          <div className="preview-cover"><img src={imagePreviews[0] || '/ck-logo.jpg'} alt=""/><span>{previewCategory || (zh ? '未分類' : 'Uncategorized')}</span></div>
          <div className="preview-copy"><div className="eyebrow">{preview.year || new Date().getFullYear()} · {zh ? previewStatus.zh : previewStatus.en}</div><h3>{previewTitle || (zh ? '作品標題預覽' : 'Project title preview')}</h3><p>{previewDescription || (zh ? '簡短介紹會顯示在這裡。' : 'Your short description will appear here.')}</p>{tags.length > 0 && <div className="tag-row">{tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>}</div>
        </div>
        <div className="preview-photo-strip">{imagePreviews.map((image, index) => <div key={index} className={image ? 'has-image' : ''}>{image ? <img src={image} alt=""/> : <span>{zh ? `圖片 ${index + 1}` : `Photo ${index + 1}`}</span>}</div>)}</div>
      </section>
      <div className="form-two"><label>{zh ? '英文標題' : 'Title (English)'} *<input name="title" required defaultValue={base.title}/></label><label>{zh ? '中文標題（繁中）' : 'Title (Traditional Chinese)'}<input name="titleZh" defaultValue={base.titleZh}/></label></div>
      <label>{zh ? '內部網址代稱（請勿貼完整網址）' : 'Internal slug (not a full URL)'}<input name="slug" defaultValue={base.slug}/></label>
      <div className="project-photo-editor">
        <div className="photo-editor-heading"><strong>{zh ? '作品照片（最多 3 張）' : 'Project photos (up to 3)'}</strong><small>{zh ? '第 1 張會作為作品列表的封面。每張上限 8 MB。' : 'Photo 1 is used as the project card cover. Maximum 8 MB each.'}</small></div>
        {imageUrls.map((url, index) => <div className="project-photo-row" key={index}>
          <label>{zh ? `圖片 ${index + 1}${index === 0 ? '（列表封面）' : ''}網址` : `Photo ${index + 1}${index === 0 ? ' (card cover)' : ''} URL`}<input type="text" inputMode="url" value={url} onChange={(event) => updateImageUrl(index, event.target.value)} placeholder="https://..."/></label>
          <label className="file-label">{zh ? '或從電腦選擇' : 'Or choose from computer'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => selectImage(index, event.target.files?.[0])}/></label>
        </div>)}
      </div>
      <div className="form-two"><label>{zh ? '英文簡短介紹' : 'Short description (English)'}<textarea name="shortDescription" rows={3} defaultValue={base.shortDescription}/></label><label>{zh ? '中文簡短介紹（繁中）' : 'Short description (Traditional Chinese)'}<textarea name="shortDescriptionZh" rows={3} defaultValue={base.shortDescriptionZh}/></label></div>
      <div className="form-two"><label>{zh ? '英文案例內容' : 'Case study (English)'}<textarea name="detailedDescription" rows={7} defaultValue={base.detailedDescription}/></label><label>{zh ? '中文案例內容（繁中）' : 'Case study (Traditional Chinese)'}<textarea name="detailedDescriptionZh" rows={7} defaultValue={base.detailedDescriptionZh}/></label></div>
      <div className="form-two"><label>{zh ? '英文分類' : 'Category (English)'}<select name="category" defaultValue={base.category}>{PRESET_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><label>{zh ? '中文分類（繁中）' : 'Category (Traditional Chinese)'}<input name="categoryZh" defaultValue={base.categoryZh}/></label></div>
      <div className="tag-editor"><span>{zh ? '標籤（點選即可加入或移除）' : 'Tags (click to add or remove)'}</span><div className="tag-options">{POPULAR_TAGS.map((tag) => <button type="button" key={tag} className={tags.includes(tag) ? 'active' : ''} onClick={() => toggleTag(tag)}>{tag}</button>)}</div><div className="custom-tag"><input value={customTag} onChange={(event) => setCustomTag(event.target.value)} placeholder={zh ? '自訂標籤' : 'Custom tag'} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCustomTag(); } }}/><button type="button" onClick={addCustomTag}><Plus size={15}/>{zh ? '加入' : 'Add'}</button></div>{tags.length > 0 && <div className="selected-tags">{tags.map((tag) => <button type="button" key={tag} onClick={() => toggleTag(tag)}>{tag} ×</button>)}</div>}</div>
      <div className="form-four"><label>{zh ? '年份' : 'Year'}<input name="year" type="number" defaultValue={base.year}/></label><label>{zh ? '狀態' : 'Status'}<select name="status" defaultValue={base.status}>{STATUS_OPTIONS.map((item) => <option value={item.en} key={item.en}>{zh ? item.zh : item.en}</option>)}</select></label><label>{zh ? '顯示順序' : 'Order'}<input name="displayOrder" type="number" defaultValue={base.displayOrder}/></label></div>
      <div className="form-three"><label>{zh ? '展示網址' : 'Demo URL'}<input name="demoUrl" type="url" defaultValue={base.demoUrl}/></label><label>GitHub URL<input name="githubUrl" type="url" defaultValue={base.githubUrl}/></label><label>{zh ? '外部網址' : 'External URL'}<input name="externalUrl" type="url" defaultValue={base.externalUrl}/></label></div>
      <div className="checks"><label><input type="checkbox" name="isPublic" defaultChecked={base.isPublic}/>{zh ? '公開顯示' : 'Public'}</label><label><input type="checkbox" name="isFeatured" defaultChecked={base.isFeatured}/>{zh ? '首頁精選' : 'Featured'}</label></div>
      {error && <p className="form-error">{error}</p>}
      <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>{zh ? '取消' : 'Cancel'}</button><button className="button" disabled={saving}>{saving ? (zh ? '儲存中…' : 'Saving…') : (zh ? '儲存作品' : 'Save project')}</button></div>
    </form>
  </div></div>;
}
