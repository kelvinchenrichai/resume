import { galleryById, getDb, json, upsertGallery } from '../../../_lib/db.js';
import { adminGalleryItem, galleryItemFromForm, validateImage } from '../../../_lib/gallery.js';

export async function onRequestPut({ request, env, params }) {
  try {
    if (!env.MEDIA) return json({ error: '圖片儲存空間尚未設定。' }, 503);
    const db = await getDb(env);
    const row = await galleryById(db, params.id);
    if (!row) return json({ error: '找不到相簿項目。' }, 404);
    const existing = JSON.parse(row.data);
    const form = await request.formData();
    const file = form.get('image');
    const extension = validateImage(file, false);
    const objectKey = extension ? `gallery/${crypto.randomUUID()}.${extension}` : row.object_key;
    const item = galleryItemFromForm(form, existing, objectKey, extension ? file : null);
    if (extension) await env.MEDIA.put(objectKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    try {
      await upsertGallery(db, item);
    } catch (error) {
      if (extension) await env.MEDIA.delete(objectKey);
      throw error;
    }
    if (extension) await env.MEDIA.delete(row.object_key);
    return json({ ok: true, item: adminGalleryItem(item) });
  } catch (error) {
    return json({ error: error.message }, error.message.includes('8 MB') || error.message.includes('支援') || error.message.includes('標題') ? 400 : 500);
  }
}

export async function onRequestDelete({ env, params }) {
  try {
    if (!env.MEDIA) return json({ error: '圖片儲存空間尚未設定。' }, 503);
    const db = await getDb(env);
    const row = await galleryById(db, params.id);
    if (!row) return json({ ok: true });
    await db.prepare('DELETE FROM gallery WHERE id = ?').bind(params.id).run();
    await env.MEDIA.delete(row.object_key);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}
