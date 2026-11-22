export type ProjectCategory = 'all' | 'rigging' | 'motion' | 'discord' | 'dev';

export interface ClientReview {
  author: string;
  rating: number;
  comment: string;
  orderType?: string;
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
  featured?: boolean;
  liveUrl?: string;
  githubUrl?: string;
  externalUrl?: string;
  externalLabel?: string;
  externalType?: 'fiverr' | 'discord' | 'github' | 'external';
  clientReview?: ClientReview;
  details: string[];
}
