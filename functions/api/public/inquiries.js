import { getDb, json, upsertInquiry } from '../../_lib/db.js';

const clean = (value, max = 500) => String(value || '').trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  try {
    const input = await request.json();
    if (clean(input.website)) return json({ ok: true });
    const clientName = clean(input.clientName, 120);
    const clientEmail = clean(input.clientEmail, 180).toLowerCase();
    const projectType = clean(input.projectType, 150);
    const requirements = clean(input.requirements, 5000);
    if (!clientName || !/^\S+@\S+\.\S+$/.test(clientEmail) || !projectType || !requirements) return json({ error: 'Please complete all required fields.' }, 400);
    const now = new Date();
    const item = {
      id: `inq-${crypto.randomUUID()}`,
      date: `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`,
      clientName,
      clientEmail,
      clientPhone: clean(input.clientPhone, 80),
      projectName: clean(input.projectName || projectType, 180),
      projectType,
      budgetRange: clean(input.budgetRange || "Let's discuss", 120),
      desiredTimeline: clean(input.desiredTimeline || 'Flexible', 120),
      referenceUrl: clean(input.referenceUrl, 500),
      sourceProjectId: clean(input.sourceProjectId, 120),
      sourceProjectTitle: clean(input.sourceProjectTitle, 180),
      status: 'NEW',
      requirements,
      contactMethod: clean(input.contactMethod || 'Email', 120),
      internalNotes: '',
      additionalNotes: clean(input.additionalNotes, 3000),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    await upsertInquiry(await getDb(env), item);
    return json({ ok: true, id: item.id }, 201);
  } catch (error) { return json({ error: error.message }, 500); }
}
