export type ProjectCategory = 'all' | 'rigging' | 'motion' | 'discord' | 'dev';

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
  details: string[];
}
