import { getDb, json } from '../../_lib/db.js';

export async function onRequestPut({ request, env }) {
  try { const config = await request.json(); if (!config?.name || !config?.email) return json({ error: 'Invalid site configuration.' }, 400); await (await getDb(env)).prepare('INSERT INTO site_config (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data').bind(JSON.stringify(config)).run(); return json({ ok: true }); }
  catch (error) { return json({ error: error.message }, 500); }
}
