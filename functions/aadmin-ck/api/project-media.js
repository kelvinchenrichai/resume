import { json } from '../../_lib/db.js';
import { validateImage } from '../../_lib/gallery.js';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.MEDIA) return json({ error: '圖片儲存空間尚未設定。' }, 503);
    const form = await request.formData();
    const file = form.get('image');
    const extension = validateImage(file);
    const id = `${crypto.randomUUID()}.${extension}`;
    await env.MEDIA.put(`projects/${id}`, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    return json({ ok: true, url: `/api/public/project-media/${id}` }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : '圖片上傳失敗。';
    return json({ error: message }, message.includes('8 MB') || message.includes('支援') || message.includes('選擇') ? 400 : 500);
  }
}
