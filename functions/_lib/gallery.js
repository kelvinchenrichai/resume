const ALLOWED_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
]);

const clean = (value, max = 500) => String(value || '').trim().slice(0, max);

export function validateImage(file, required = true) {
  if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) {
    if (required) throw new Error('請選擇 JPG、PNG、WebP 或 GIF 圖片。');
    return null;
  }
  const extension = ALLOWED_TYPES.get(file.type);
  if (!extension) throw new Error('只支援 JPG、PNG、WebP 或 GIF 圖片。');
  if (file.size > 8 * 1024 * 1024) throw new Error('圖片大小不可超過 8 MB。');
  return extension;
}

export function galleryItemFromForm(form, existing, objectKey, file) {
  const now = new Date().toISOString();
  const titleZh = clean(form.get('titleZh'), 180);
  const title = clean(form.get('title'), 180) || titleZh;
  const categoryZh = clean(form.get('categoryZh'), 100) || '證照';
  const category = clean(form.get('category'), 100) || categoryZh;
  if (!title) throw new Error('請填寫證照／相簿項目標題。');
  return {
    id: existing?.id || `gallery-${crypto.randomUUID()}`,
    title,
    titleZh: titleZh || title,
    description: clean(form.get('description'), 1200),
    descriptionZh: clean(form.get('descriptionZh'), 1200),
    category,
    categoryZh,
    year: Number(form.get('year')) || new Date().getFullYear(),
    objectKey,
    mimeType: file?.type || existing?.mimeType || 'image/jpeg',
    originalName: clean(file?.name || existing?.originalName || 'image', 240),
    isPublic: form.get('isPublic') === 'true',
    isFeatured: form.get('isFeatured') === 'true',
    displayOrder: Number(form.get('displayOrder')) || 0,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };
}

export function adminGalleryItem(item) {
  return { ...item, imageUrl: `/aadmin-ck/api/media/${encodeURIComponent(item.id)}` };
}
