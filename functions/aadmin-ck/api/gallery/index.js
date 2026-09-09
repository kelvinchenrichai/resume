import { getDb, json, upsertGallery } from '../../../_lib/db.js';
import { adminGalleryItem, galleryItemFromForm, validateImage } from '../../../_lib/gallery.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.MEDIA) return json({ error: '圖片儲存空間尚未設定。' }, 503);
    const form = await request.formData();
    const file = form.get('image');
    const extension = validateImage(file);
    const objectKey = `gallery/${crypto.randomUUID()}.${extension}`;
    const item = galleryItemFromForm(form, null, objectKey, file);
    await env.MEDIA.put(objectKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    try {
      await upsertGallery(await getDb(env), item);
    } catch (error) {
      await env.MEDIA.delete(objectKey);
      throw error;
    }
    return json({ ok: true, item: adminGalleryItem(item) }, 201);
  } catch (error) {
    return json({ error: error.message }, error.message.includes('8 MB') || error.message.includes('支援') || error.message.includes('選擇') || error.message.includes('標題') ? 400 : 500);
  }
}
