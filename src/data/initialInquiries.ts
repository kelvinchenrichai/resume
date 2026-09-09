import { InquiryItem } from '../types';
// DEMO DATA — replace with live CRM data when Firebase is connected.
export const INITIAL_INQUIRIES: InquiryItem[] = [
  { id: 'inq-1', date: '09/08', clientName: 'Alex Chen', clientEmail: 'alex@example.com', projectName: 'TradingView indicator', projectType: 'TradingView / Pine Script Indicator', budgetRange: 'NT$30,000 – 60,000', desiredTimeline: 'Within 1 month', status: 'NEW', requirements: 'Build and validate a multi-timeframe indicator with configurable alerts.', contactMethod: 'Email', internalNotes: '', createdAt: '2026-09-08T06:30:00Z', updatedAt: '2026-09-08T06:30:00Z' },
  { id: 'inq-2', date: '09/03', clientName: 'Morgan Lin', clientEmail: 'morgan@example.com', projectName: 'Research dashboard', projectType: 'Dashboard / Data Tool', budgetRange: 'NT$60,000 – 100,000', desiredTimeline: '1–3 months', status: 'CONTACTED', requirements: 'A private dashboard for reviewing strategy experiments and notes.', contactMethod: 'Email', internalNotes: 'Discovery call completed.', createdAt: '2026-09-03T09:00:00Z', updatedAt: '2026-09-04T09:00:00Z' }
];
