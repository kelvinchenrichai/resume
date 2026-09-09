const DEFAULT_CONFIG = { name: 'CK', tagline: 'Trading × AI × Systems × Experiments', taglineZh: '交易 × AI × 系統 × 實驗', bio: 'I build tools, systems and experiments around trading, AI and decision-making.', bioZh: '我專注打造與交易、AI 和決策有關的工具、系統與實驗。', email: 'hello@example.com', github: 'https://github.com/', tradingView: 'https://www.tradingview.com/', availability: 'Open to focused collaborations and ambitious prototypes.', availabilityZh: '目前開放目標明確的合作與具企圖心的原型專案。' };

const DEFAULT_PROJECTS = [
  { id: 'proj-1', slug: 'market-structure-lab', title: 'Market Structure Lab', titleZh: '市場結構研究室', coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format&fit=crop', shortDescription: 'A research dashboard for testing market structure, momentum and risk hypotheses.', shortDescriptionZh: '用來驗證市場結構、動能與風險假設的研究儀表板。', detailedDescription: 'An experimental workspace that turns raw market data into repeatable research. It combines regime filters, trade journaling and visual validation so an idea can move from observation to a testable system.', detailedDescriptionZh: '把原始市場資料轉化為可重複研究流程的實驗工作區。結合市場狀態篩選、交易紀錄與視覺驗證，讓一個觀察能逐步變成可測試的系統。', category: 'Trading / Quant', categoryZh: '交易／量化', tags: ['TradingView', 'Research', 'TypeScript'], year: 2026, status: 'In progress', statusZh: '進行中', demoUrl: 'https://example.com', githubUrl: 'https://github.com', isFeatured: true, isPublic: true, displayOrder: 1, createdAt: '2026-01-10T08:00:00Z', updatedAt: '2026-08-20T08:00:00Z' },
  { id: 'proj-2', slug: 'signal-ops', title: 'Signal Ops', titleZh: '訊號作戰室', coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop', shortDescription: 'A compact operating system for alerts, execution checklists and post-trade review.', shortDescriptionZh: '整合警報、執行清單與交易後檢討的精簡操作系統。', detailedDescription: 'Signal Ops connects alert intake, decision rules and review notes in one focused interface. The project explores how small workflow constraints can improve consistency under pressure.', detailedDescriptionZh: 'Signal Ops 在單一聚焦介面中串接警報接收、決策規則與檢討紀錄。這個專案探索小型工作流程限制，如何改善壓力情境下的執行一致性。', category: 'Systems', categoryZh: '系統', tags: ['Automation', 'Dashboard', 'Decision Making'], year: 2026, status: 'Prototype', statusZh: '原型', externalUrl: 'https://example.com', isFeatured: true, isPublic: true, displayOrder: 2, createdAt: '2026-02-12T08:00:00Z', updatedAt: '2026-08-18T08:00:00Z' },
  { id: 'proj-3', slug: 'agent-workbench', title: 'Agent Workbench', titleZh: 'AI Agent 工作台', coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop', shortDescription: 'An AI-native workspace for turning messy briefs into traceable execution plans.', shortDescriptionZh: '把混亂需求轉換成可追蹤執行計畫的 AI 原生工作區。', detailedDescription: 'A practical experiment in human-agent collaboration: structured inputs, explicit checkpoints and reusable output templates designed for real project work.', detailedDescriptionZh: '一個人與 AI Agent 協作的實務實驗：透過結構化輸入、明確檢查點與可重複使用的輸出模板，服務真實專案工作。', category: 'AI / Agents', categoryZh: 'AI／Agents', tags: ['AI', 'Agents', 'Rapid Prototyping'], year: 2025, status: 'Case study', statusZh: '案例研究', isFeatured: true, isPublic: true, displayOrder: 3, createdAt: '2025-05-20T08:00:00Z', updatedAt: '2026-07-03T08:00:00Z' },
  { id: 'proj-4', slug: 'decision-journal', title: 'Decision Journal', titleZh: '決策日誌', coverImage: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1600&auto=format&fit=crop', shortDescription: 'A private review tool for decisions, assumptions and learning loops.', shortDescriptionZh: '用來檢討決策、假設與學習循環的私人工具。', detailedDescription: 'A minimal journal built around decision quality rather than outcome alone. It captures context, confidence and later review without adding unnecessary process.', detailedDescriptionZh: '以決策品質而非單一結果為核心的極簡日誌。記錄當下背景、信心水準與事後檢討，同時避免增加不必要的流程。', category: 'Experiments', categoryZh: '實驗', tags: ['Product', 'Analytics', 'Learning'], year: 2025, status: 'Completed', statusZh: '已完成', isFeatured: true, isPublic: true, displayOrder: 4, createdAt: '2025-03-11T08:00:00Z', updatedAt: '2026-04-12T08:00:00Z' },
  { id: 'proj-5', slug: 'private-strategy-console', title: 'Private Strategy Console', titleZh: '私人策略控制台', coverImage: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=1600&auto=format&fit=crop', shortDescription: 'An internal strategy monitoring concept.', shortDescriptionZh: '內部策略監控概念。', detailedDescription: 'Private draft project.', detailedDescriptionZh: '尚未公開的草稿專案。', category: 'Trading / Quant', categoryZh: '交易／量化', tags: ['Private', 'Research'], year: 2026, status: 'Draft', statusZh: '草稿', isFeatured: false, isPublic: false, displayOrder: 5, createdAt: '2026-06-01T08:00:00Z', updatedAt: '2026-09-01T08:00:00Z' },
];

export const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function getDb(env) {
  if (!env.DB) throw new Error('Cloud database is not configured.');
  const db = env.DB;
  await db.batch([
    db.prepare('CREATE TABLE IF NOT EXISTS portfolio_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, data TEXT NOT NULL, is_public INTEGER NOT NULL DEFAULT 0, display_order INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS inquiries (id TEXT PRIMARY KEY, data TEXT NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS gallery (id TEXT PRIMARY KEY, data TEXT NOT NULL, object_key TEXT NOT NULL UNIQUE, is_public INTEGER NOT NULL DEFAULT 0, display_order INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS site_config (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_projects_public_order ON projects(is_public, display_order)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_inquiries_status_created ON inquiries(status, created_at DESC)'),
    db.prepare('CREATE INDEX IF NOT EXISTS idx_gallery_public_order ON gallery(is_public, display_order)'),
  ]);
  const seeded = await db.prepare("SELECT value FROM portfolio_meta WHERE key = 'seeded'").first();
  if (!seeded) {
    const statements = DEFAULT_PROJECTS.map((item) => db.prepare('INSERT INTO projects (id, data, is_public, display_order, updated_at) VALUES (?, ?, ?, ?, ?)').bind(item.id, JSON.stringify(item), item.isPublic ? 1 : 0, item.displayOrder, item.updatedAt));
    statements.push(db.prepare('INSERT INTO site_config (id, data) VALUES (1, ?)').bind(JSON.stringify(DEFAULT_CONFIG)));
    statements.push(db.prepare("INSERT INTO portfolio_meta (key, value) VALUES ('seeded', '1')"));
    await db.batch(statements);
  }
  return db;
}

export async function publicState(db) {
  const projects = await db.prepare('SELECT data FROM projects WHERE is_public = 1 ORDER BY display_order ASC').all();
  const gallery = await db.prepare('SELECT data FROM gallery WHERE is_public = 1 ORDER BY display_order ASC').all();
  const config = await db.prepare('SELECT data FROM site_config WHERE id = 1').first();
  return { projects: projects.results.map((row) => JSON.parse(row.data)), gallery: gallery.results.map((row) => withGalleryImage(row, false)), siteConfig: JSON.parse(config.data) };
}

export async function adminState(db) {
  const projects = await db.prepare('SELECT data FROM projects ORDER BY display_order ASC').all();
  const inquiries = await db.prepare('SELECT data FROM inquiries ORDER BY created_at DESC').all();
  const gallery = await db.prepare('SELECT data FROM gallery ORDER BY display_order ASC').all();
  const config = await db.prepare('SELECT data FROM site_config WHERE id = 1').first();
  return { projects: projects.results.map((row) => JSON.parse(row.data)), inquiries: inquiries.results.map((row) => JSON.parse(row.data)), gallery: gallery.results.map((row) => withGalleryImage(row, true)), siteConfig: JSON.parse(config.data) };
}

function withGalleryImage(row, admin) {
  const item = JSON.parse(row.data);
  return { ...item, imageUrl: `${admin ? '/aadmin-ck/api/media' : '/api/public/media'}/${encodeURIComponent(item.id)}` };
}

export async function upsertProject(db, item) {
  await db.prepare('INSERT INTO projects (id, data, is_public, display_order, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, is_public = excluded.is_public, display_order = excluded.display_order, updated_at = excluded.updated_at').bind(item.id, JSON.stringify(item), item.isPublic ? 1 : 0, Number(item.displayOrder) || 0, item.updatedAt || new Date().toISOString()).run();
}

export async function upsertInquiry(db, item) {
  await db.prepare('INSERT INTO inquiries (id, data, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, status = excluded.status, updated_at = excluded.updated_at').bind(item.id, JSON.stringify(item), item.status, item.createdAt, item.updatedAt).run();
}

export async function upsertGallery(db, item) {
  const stored = { ...item };
  delete stored.imageUrl;
  await db.prepare('INSERT INTO gallery (id, data, object_key, is_public, display_order, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data, object_key = excluded.object_key, is_public = excluded.is_public, display_order = excluded.display_order, updated_at = excluded.updated_at').bind(item.id, JSON.stringify(stored), item.objectKey, item.isPublic ? 1 : 0, Number(item.displayOrder) || 0, item.updatedAt || new Date().toISOString()).run();
}

export async function galleryById(db, id, publicOnly = false) {
  return db.prepare(`SELECT data, object_key FROM gallery WHERE id = ?${publicOnly ? ' AND is_public = 1' : ''}`).bind(id).first();
}
