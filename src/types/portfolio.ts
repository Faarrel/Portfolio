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
  details: string[];
}
