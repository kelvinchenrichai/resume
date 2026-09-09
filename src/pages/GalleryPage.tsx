import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../app/LocaleContext';
import { usePortfolio } from '../app/PortfolioContext';
import { GalleryItem } from '../types';

export function GalleryPage() {
  const { gallery } = usePortfolio();
  const { locale } = useLocale();
  const zh = locale === 'zh-TW';
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const categories = useMemo(() => Array.from(new Set(gallery.map((item) => zh ? item.categoryZh || item.category : item.category))), [gallery, zh]);
  const visible = gallery.filter((item) => !category || (zh ? item.categoryZh || item.category : item.category) === category);
  useEffect(() => setCategory(''), [locale]);

  return <section className="page page-top gallery-page">
    <div className="title-row">
      <div><div className="eyebrow">{zh ? '經歷／收藏' : 'MILESTONES / COLLECTION'}</div><h1>{zh ? '證照／相簿' : 'Certificates / Gallery'}</h1></div>
      <p>{zh ? '紀錄證照、獎項、活動與重要里程碑。' : 'Certificates, awards, events and selected milestones.'}</p>
    </div>
    {categories.length > 1 && <div className="gallery-filters">
      <button className={!category ? 'active' : ''} onClick={() => setCategory('')}>{zh ? '全部' : 'All'}</button>
      {categories.map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}
    </div>}
    {visible.length === 0 ? <div className="empty"><h2>{zh ? '證照／相簿準備中' : 'Certificates / Gallery coming soon'}</h2><p>{zh ? '新的證照與紀錄會陸續更新。' : 'New certificates and milestones will appear here.'}</p></div> : <div className="gallery-grid">
      {visible.map((item) => {
        const title = zh ? item.titleZh || item.title : item.title;
        const description = zh ? item.descriptionZh || item.description : item.description;
        const itemCategory = zh ? item.categoryZh || item.category : item.category;
        return <button className="gallery-card" key={item.id} onClick={() => setSelected(item)}>
          <img src={item.imageUrl} alt={title}/>
          <span className="gallery-card-copy"><small>{itemCategory}{item.year ? ` · ${item.year}` : ''}</small><strong>{title}</strong>{description && <em>{description}</em>}</span>
        </button>;
      })}
    </div>}
    {selected && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={zh ? selected.titleZh || selected.title : selected.title} onClick={() => setSelected(null)}>
      <button className="lightbox-close" onClick={() => setSelected(null)} aria-label={zh ? '關閉' : 'Close'}><X/></button>
      <figure onClick={(event) => event.stopPropagation()}><img src={selected.imageUrl} alt={zh ? selected.titleZh || selected.title : selected.title}/><figcaption><strong>{zh ? selected.titleZh || selected.title : selected.title}</strong><span>{zh ? selected.descriptionZh || selected.description : selected.description}</span></figcaption></figure>
    </div>}
  </section>;
}
