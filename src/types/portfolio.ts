export interface ClientReview {
  author: string;
  rating: number;
  comment: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: 'rigging' | 'motion' | 'discord' | 'dev';
  categoryLabel: string;
  description: string;
  year: string;
  role: string;
  tools: string[];
  metrics?: string;
  externalUrl?: string;
  externalLabel?: string;
  externalType?: 'fiverr' | 'discord' | 'github' | 'external';
  previewUrl?: string;
  gallery?: string[];
  clientReview?: ClientReview;
  details: string[];
}
