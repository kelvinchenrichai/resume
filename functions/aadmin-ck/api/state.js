import { adminState, getDb, json } from '../../_lib/db.js';

export async function onRequestGet({ env }) {
  try { return json(await adminState(await getDb(env))); }
  catch (error) { return json({ error: error.message }, 503); }
}
