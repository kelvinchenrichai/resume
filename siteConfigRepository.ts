import { DEFAULT_SITE_CONFIG } from '../config/siteConfig';
import { SiteConfig } from '../types';
export interface SiteConfigRepository { get(): SiteConfig; save(config: SiteConfig): void; reset(): SiteConfig; }
const KEY = 'portfolio_site_config_v1';
export class LocalSiteConfigRepository implements SiteConfigRepository {
  get() { try { const value = localStorage.getItem(KEY); return value ? { ...DEFAULT_SITE_CONFIG, ...JSON.parse(value) } : DEFAULT_SITE_CONFIG; } catch { return DEFAULT_SITE_CONFIG; } }
  save(config: SiteConfig) { localStorage.setItem(KEY, JSON.stringify(config)); }
  reset() { this.save(DEFAULT_SITE_CONFIG); return { ...DEFAULT_SITE_CONFIG }; }
}
export const siteConfigRepository: SiteConfigRepository = new LocalSiteConfigRepository();
