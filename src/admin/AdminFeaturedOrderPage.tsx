import { ArrowDown, ArrowUp, GripVertical, Save } from 'lucide-react';
import { DragEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { ProjectItem } from '../types';

function sortedFeatured(projects: ProjectItem[]) {
  return projects.filter((project) => project.isPublic && project.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? a.displayOrder) - (b.featuredOrder ?? b.displayOrder) || a.displayOrder - b.displayOrder);
}

export function AdminFeaturedOrderPage() {
  const { projects, ready, reorderFeatured } = usePortfolio();
  const { locale, projectText } = useLocale();
  const zh = locale === 'zh-TW';
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!dirty) setItems(sortedFeatured(projects));
  }, [projects, dirty]);

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || to >= items.length) return;
    setItems((current) => {
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDirty(true);
    setMessage('');
  }

  function drop(event: DragEvent<HTMLElement>, targetId: string) {
    event.preventDefault();
    if (!dragging) return;
    move(items.findIndex((item) => item.id === dragging), items.findIndex((item) => item.id === targetId));
    setDragging(null);
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      await reorderFeatured(items.map((item) => item.id));
      setDirty(false);
      setMessage(zh ? '首頁順序已儲存並立即更新。' : 'Homepage order saved and updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : (zh ? '儲存失敗，請重新整理後再試。' : 'Save failed. Refresh and try again.'));
    } finally { setSaving(false); }
  }

  return <div className="admin-page featured-order-page">
    <div className="admin-title"><div><div className="eyebrow">{zh ? '首頁精選' : 'HOMEPAGE FEATURED'}</div><h1>{zh ? '首頁排序' : 'Homepage order'}</h1><p>{zh ? '拖曳作品調整首頁出現順序；手機可使用上下按鈕。' : 'Drag projects into order, or use the arrow buttons on mobile.'}</p></div><button className="button" disabled={!dirty || saving || items.length === 0} onClick={save}><Save size={16}/>{saving ? (zh ? '儲存中…' : 'Saving…') : (zh ? '儲存首頁順序' : 'Save homepage order')}</button></div>
    {message && <div className="notice" role="status">{message}</div>}
    {!ready ? <div className="panel">{zh ? '載入精選作品中…' : 'Loading featured projects…'}</div> : items.length === 0 ? <div className="panel featured-order-empty"><h2>{zh ? '目前沒有首頁精選作品' : 'No featured projects yet'}</h2><p>{zh ? '請先到作品管理，點亮作品的星號。' : 'Go to Projects and turn on the star for the projects you want to feature.'}</p><Link className="button secondary" to="/aadmin-ck/projects">{zh ? '前往作品管理' : 'Go to projects'}</Link></div> : <div className="featured-sort-list">
      {items.map((project, index) => {
        const copy = projectText(project);
        return <article className={`featured-sort-card${dragging === project.id ? ' dragging' : ''}`} key={project.id} draggable onDragStart={() => setDragging(project.id)} onDragEnd={() => setDragging(null)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, project.id)}>
          <div className="featured-drag"><GripVertical aria-hidden="true"/><span>#{index + 1}</span></div>
          <img src={project.coverImage || '/ck-logo.jpg'} alt=""/>
          <div className="featured-sort-copy"><strong>{copy.title}</strong><small>{copy.category} · {project.year}</small></div>
          <div className="featured-move-buttons"><button type="button" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label={zh ? '往上移' : 'Move up'}><ArrowUp size={17}/></button><button type="button" disabled={index === items.length - 1} onClick={() => move(index, index + 1)} aria-label={zh ? '往下移' : 'Move down'}><ArrowDown size={17}/></button></div>
        </article>;
      })}
    </div>}
  </div>;
}
