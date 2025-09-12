export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface BriefingData {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  valueProposition: string;
  problems: string[];
  solution: string;
  testimonials: string;
  offer: string;
  cta: string;
}

export const DEFAULT_BRANDING = {
  companyName: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF'
};

export const INITIAL_BRIEFING: BriefingData = {
  companyName: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#1E40AF',
  valueProposition: '',
  problems: [],
  solution: '',
  testimonials: '',
  offer: '',
  cta: ''
};