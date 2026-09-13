export type ProjectStatus = string;
export interface ProjectItem { id: string; slug?: string; title: string; titleZh?: string; coverImage: string; images?: string[]; shortDescription: string; shortDescriptionZh?: string; detailedDescription: string; detailedDescriptionZh?: string; category: string; categoryZh?: string; tags: string[]; year: number; status: ProjectStatus; statusZh?: string; externalUrl?: string; githubUrl?: string; demoUrl?: string; isFeatured: boolean; featuredOrder?: number; isPublic: boolean; displayOrder: number; createdAt: string; updatedAt: string; }
export type ViewMode = 'showcase' | 'management' | 'inquiries';
export type SortField = 'displayOrder' | 'year' | 'title' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'QUOTED' | 'ACCEPTED' | 'CLOSED' | 'ARCHIVED';
export interface InquiryItem { id: string; date: string; clientName: string; clientEmail?: string; clientPhone?: string; projectName: string; projectType?: string; budgetRange: string; desiredTimeline?: string; referenceUrl?: string; sourceProjectId?: string; sourceProjectTitle?: string; status: InquiryStatus; requirements: string; contactMethod?: string; internalNotes?: string; additionalNotes?: string; createdAt: string; updatedAt: string; }
export interface ContactLink { id: string; label: string; labelZh?: string; url: string; }
export interface InquiryOption { id: string; label: string; labelZh?: string; }
export interface SiteConfig {
  name: string;
  tagline: string;
  taglineZh?: string;
  bio: string;
  bioZh?: string;
  email: string;
  github?: string;
  tradingView?: string;
  linkedIn?: string;
  discord?: string;
  instagram?: string;
  x?: string;
  contactLinks?: ContactLink[];
  availability: string;
  availabilityZh?: string;
  contactEyebrow?: string;
  contactEyebrowZh?: string;
  contactTitle?: string;
  contactTitleZh?: string;
  contactBody?: string;
  contactBodyZh?: string;
  projectTypeOptions?: InquiryOption[];
  budgetOptions?: InquiryOption[];
  timelineOptions?: InquiryOption[];
  showHeader?: boolean;
  showHero?: boolean;
  showAbout?: boolean;
  showFinalCta?: boolean;
  navHome?: string;
  navHomeZh?: string;
  navProjects?: string;
  navProjectsZh?: string;
  navGallery?: string;
  navGalleryZh?: string;
  navContact?: string;
  navContactZh?: string;
  navCta?: string;
  navCtaZh?: string;
  heroEyebrow?: string;
  heroEyebrowZh?: string;
  heroPrimaryLabel?: string;
  heroPrimaryLabelZh?: string;
  heroSecondaryLabel?: string;
  heroSecondaryLabelZh?: string;
  aboutEyebrow?: string;
  aboutEyebrowZh?: string;
  aboutTitle?: string;
  aboutTitleZh?: string;
  aboutBody?: string;
  aboutBodyZh?: string;
  aboutTags?: string;
  aboutTagsZh?: string;
  ctaEyebrow?: string;
  ctaEyebrowZh?: string;
  ctaTitle?: string;
  ctaTitleZh?: string;
  ctaBody?: string;
  ctaBodyZh?: string;
  ctaButtonLabel?: string;
  ctaButtonLabelZh?: string;
}
export interface GalleryItem { id: string; title: string; titleZh?: string; description?: string; descriptionZh?: string; category: string; categoryZh?: string; year?: number; objectKey: string; imageUrl: string; mimeType: string; originalName: string; isPublic: boolean; isFeatured: boolean; displayOrder: number; createdAt: string; updatedAt: string; }
