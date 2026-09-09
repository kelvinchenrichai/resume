import { galleryById, getDb } from '../../../_lib/db.js';

export async function onRequestGet({ env, params }) {
  if (!env.MEDIA) return new Response('Not configured', { status: 503 });
  const row = await galleryById(await getDb(env), params.id);
  if (!row) return new Response('Not found', { status: 404 });
  const object = await env.MEDIA.get(row.object_key);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Cache-Control', 'private, max-age=300');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}
