import { getDb, json, publicState } from '../../_lib/db.js';

export async function onRequestGet({ env }) {
  try { return json(await publicState(await getDb(env))); }
  catch (error) { return json({ error: error.message }, 503); }
}
