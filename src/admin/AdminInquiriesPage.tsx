import { ExternalLink, Mail, Save, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { InquiryItem, InquiryStatus } from '../types';
import { safeHttpUrl } from '../utils/projectLinks';

const STATUSES: InquiryStatus[] = ['NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'CLOSED', 'ARCHIVED'];

export function AdminInquiriesPage() {
  const { inquiries, saveInquiry, deleteInquiry } = usePortfolio();
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const [filter, setFilter] = useState('ALL');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<InquiryItem | null>(null);
  const visible = useMemo(() => inquiries.filter((item) => (filter === 'ALL' || item.status === filter) && `${item.clientName} ${item.projectName} ${item.projectType}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [inquiries, filter, q]);
  const count = (status: string) => status === 'ALL' ? inquiries.length : inquiries.filter((item) => item.status === status).length;

  return <div className="admin-page">
    <div className="admin-title"><div><div className="eyebrow">{zh ? '詢價 CRM' : 'INQUIRY CRM'}</div><h1>{zh ? '詢價管理' : 'Inquiries'}</h1><p>{zh ? '從第一則訊息一路追蹤至結案或封存。' : 'Track conversations from first message to archive.'}</p></div></div>
    <div className="pipeline">{['ALL', ...STATUSES].map((status) => <button className={filter === status ? 'active' : ''} key={status} onClick={() => setFilter(status)}><strong>{count(status)}</strong><span>{status === 'ALL' && zh ? '全部' : status}</span></button>)}</div>
    <div className="admin-toolbar"><div className="search"><Search size={16}/><input value={q} onChange={(event) => setQ(event.target.value)} placeholder={zh ? '搜尋詢價' : 'Search inquiries'}/></div></div>
    <div className="inquiry-list">{visible.map((item) => <button key={item.id} onClick={() => setSelected(item)}><span className="date-box">{item.date}</span><span><strong>{item.clientName}</strong><small>{item.projectType || item.projectName}</small></span><span>{item.budgetRange}</span><span>{item.desiredTimeline || 'Flexible'}</span><b>{item.status}</b></button>)}</div>
    {selected && <InquiryDrawer key={selected.id} inquiry={selected} zh={zh} onSave={async (item) => { await saveInquiry(item); setSelected(item); }} onDelete={async (id) => { await deleteInquiry(id); setSelected(null); }} onClose={() => setSelected(null)}/>}
  </div>;
}

function InquiryDrawer({ inquiry, zh, onSave, onDelete, onClose }: { inquiry: InquiryItem; zh: boolean; onSave(item: InquiryItem): Promise<void>; onDelete(id: string): Promise<void>; onClose(): void }) {
  const [draft, setDraft] = useState(inquiry);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const referenceUrl = safeHttpUrl(draft.referenceUrl);

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const next = { ...draft, updatedAt: new Date().toISOString() };
      await onSave(next);
      setDraft(next);
      setMessage(zh ? '已儲存。' : 'Saved.');
    } catch {
      setMessage(zh ? '儲存失敗，請再試一次。' : 'Save failed. Please try again.');
    } finally { setSaving(false); }
  }

  return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={(event) => event.stopPropagation()}>
    <button className="drawer-close" onClick={onClose}>{zh ? '關閉' : 'Close'}</button><div className="eyebrow">{zh ? '詢價詳情' : 'INQUIRY DETAIL'}</div><h2>{draft.clientName}</h2><p className="lead">{draft.projectName}</p>
    <label>{zh ? '狀態' : 'Status'}<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as InquiryStatus })}>{STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label>
    <dl><dt>Email</dt><dd>{draft.clientEmail || '—'}</dd><dt>{zh ? '偏好聯絡' : 'Preferred contact'}</dt><dd>{draft.contactMethod || '—'}</dd><dt>{zh ? '專案類型' : 'Project type'}</dt><dd>{draft.projectType || '—'}</dd><dt>{zh ? '預算' : 'Budget'}</dt><dd>{draft.budgetRange}</dd><dt>{zh ? '時程' : 'Timeline'}</dt><dd>{draft.desiredTimeline || '—'}</dd><dt>{zh ? '來源作品' : 'Source project'}</dt><dd>{draft.sourceProjectTitle || '—'}</dd><dt>{zh ? '建立時間' : 'Created'}</dt><dd>{new Date(draft.createdAt).toLocaleString(zh ? 'zh-TW' : 'en')}</dd></dl>
    <div className="drawer-section"><div className="eyebrow">{zh ? '需求說明' : 'DESCRIPTION'}</div><p>{draft.requirements}</p></div>
    {referenceUrl && <a className="text-link" target="_blank" rel="noopener noreferrer" href={referenceUrl}>{zh ? '參考網址' : 'Reference URL'} <ExternalLink size={14}/></a>}
    <label>{zh ? '內部／報價備註' : 'Internal / quotation notes'}<textarea rows={7} value={draft.internalNotes || ''} onChange={(event) => setDraft({ ...draft, internalNotes: event.target.value })}/></label>
    {message && <p className="drawer-message">{message}</p>}
    <div className="actions"><button className="button" onClick={save} disabled={saving}><Save size={15}/>{saving ? (zh ? '儲存中…' : 'Saving…') : (zh ? '儲存變更' : 'Save changes')}</button>{draft.clientEmail && <a className="button secondary" href={`mailto:${draft.clientEmail}?subject=${encodeURIComponent(`Re: ${draft.projectName}`)}`}><Mail size={15}/>Email</a>}<button className="button danger" onClick={() => confirm(zh ? '刪除這筆詢價？' : 'Delete this inquiry?') && onDelete(draft.id)}><Trash2 size={15}/>{zh ? '刪除' : 'Delete'}</button></div>
  </aside></div>;
}
