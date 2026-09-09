import { getDb, json, upsertInquiry, upsertProject } from '../../_lib/db.js';

export async function onRequestPut({ request, env }) {
  try {
    const state = await request.json();
    if (!Array.isArray(state.projects) || !Array.isArray(state.inquiries) || !state.siteConfig) return json({ error: 'Invalid backup.' }, 400);
    const db = await getDb(env);
    await db.batch([db.prepare('DELETE FROM projects'), db.prepare('DELETE FROM inquiries')]);
    for (const project of state.projects) await upsertProject(db, project);
    for (const inquiry of state.inquiries) await upsertInquiry(db, inquiry);
    await db.prepare('INSERT INTO site_config (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data').bind(JSON.stringify(state.siteConfig)).run();
    return json({ ok: true });
  } catch (error) { return json({ error: error.message }, 500); }
}
