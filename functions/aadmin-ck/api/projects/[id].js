import { getDb, json, upsertProject } from '../../../_lib/db.js';

export async function onRequestPut({ request, env, params }) {
  try { const item = await request.json(); if (!item?.id || item.id !== params.id || !item?.title) return json({ error: 'Invalid project.' }, 400); await upsertProject(await getDb(env), item); return json({ ok: true }); }
  catch (error) { return json({ error: error.message }, 500); }
}

export async function onRequestDelete({ env, params }) {
  try { await (await getDb(env)).prepare('DELETE FROM projects WHERE id = ?').bind(params.id).run(); return json({ ok: true }); }
  catch (error) { return json({ error: error.message }, 500); }
}
