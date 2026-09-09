import { INITIAL_INQUIRIES } from '../data/initialInquiries';
import { InquiryItem } from '../types';

export interface InquiryRepository { getInquiries(): InquiryItem[]; replaceInquiries(items: InquiryItem[]): void; createInquiry(item: InquiryItem): void; updateInquiry(item: InquiryItem): void; deleteInquiry(id: string): void; reset(): InquiryItem[]; }
const KEY = 'portfolio_cms_inquiries_v2';
export class LocalInquiryRepository implements InquiryRepository {
  getInquiries() { try { const value = localStorage.getItem(KEY); return value ? JSON.parse(value) : this.reset(); } catch { return [...INITIAL_INQUIRIES]; } }
  replaceInquiries(items: InquiryItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); }
  createInquiry(item: InquiryItem) { this.replaceInquiries([item, ...this.getInquiries()]); }
  updateInquiry(item: InquiryItem) { this.replaceInquiries(this.getInquiries().map((i) => i.id === item.id ? item : i)); }
  deleteInquiry(id: string) { this.replaceInquiries(this.getInquiries().filter((i) => i.id !== id)); }
  reset() { this.replaceInquiries(INITIAL_INQUIRIES); return [...INITIAL_INQUIRIES]; }
}
export const inquiryRepository: InquiryRepository = new LocalInquiryRepository();
