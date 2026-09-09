export async function onRequestGet({ env, params }) {
  if (!env.MEDIA) return new Response('Not configured', { status: 503 });
  const object = await env.MEDIA.get(`projects/${params.id}`);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(object.body, { headers });
}
