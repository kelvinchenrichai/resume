import { getDb, json } from '../../../_lib/db.js';

export async function onRequestPut({ request, env }) {
  try {
    const input = await request.json();
    const ids = Array.isArray(input?.ids) ? input.ids.filter((id) => typeof id === 'string' && id.length <= 120) : [];
    if (!ids.length || ids.length > 100 || new Set(ids).size !== ids.length) return json({ error: 'Invalid featured project order.' }, 400);

    const db = await getDb(env);
    const rows = await db.prepare('SELECT id, data FROM projects WHERE is_public = 1').all();
    const featured = rows.results.map((row) => ({ row, item: JSON.parse(row.data) })).filter(({ item }) => item.isFeatured);
    const available = new Set(featured.map(({ row }) => row.id));
    if (available.size !== ids.length || ids.some((id) => !available.has(id))) return json({ error: 'Featured projects changed. Refresh and try again.' }, 409);

    const order = new Map(ids.map((id, index) => [id, index + 1]));
    const statements = featured.map(({ row, item }) => {
      item.featuredOrder = order.get(row.id);
      return db.prepare('UPDATE projects SET data = ? WHERE id = ?').bind(JSON.stringify(item), row.id);
    });
    await db.batch(statements);
    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unable to save featured order.' }, 500);
  }
}
