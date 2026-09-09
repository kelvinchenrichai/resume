import { getDb, json, upsertProject } from '../../../_lib/db.js';

export async function onRequestPost({ request, env }) {
  try { const item = await request.json(); if (!item?.id || !item?.title) return json({ error: 'Invalid project.' }, 400); await upsertProject(await getDb(env), item); return json({ ok: true }, 201); }
  catch (error) { return json({ error: error.message }, 500); }
}
