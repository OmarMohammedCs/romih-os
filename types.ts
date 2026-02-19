
export type Language = 'en' | 'ar';

export interface DeepInfo {
  content: string;
}

export interface Option {
  id: string;
  title: string;
  isLocked: boolean;
  deepInfo?: DeepInfo;
}

export interface Topic {
  id: string;
  title: string;
  isLocked: boolean;
  options?: Option[]; // Exactly 3 options if not locked
}

export interface Section {
  id: string;
  number: string;
  title: string;
  topics: Topic[]; // Exactly 8 topics
}

export type AppView = 'intro' | 'hub' | 'section';
