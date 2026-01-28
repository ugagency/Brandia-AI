
export interface BusinessProfile {
  name: string;
  businessType: string;
  targetAudience: string;
  region: string;
  objective: 'vender' | 'atrair' | 'autoridade';
  style: 'serio' | 'descontraido' | 'popular';
}

export interface BrandIdentity {
  bio: string;
  description: string;
  promise: string;
  keywords: string[];
  suggestedColors: string[];
  visualStyle: string;
}

export interface ContentStrategy {
  idealTypes: string[];
  frequency: string;
  formats: string[];
  hotTopics: string[];
  rationale: string;
}

export interface PostItem {
  id: string;
  type: string;
  topic: string;
  hook: string;
  caption: string;
  hashtags: string[];
  script?: string;
  bestTime: string;
  platform: 'Instagram' | 'TikTok' | 'WhatsApp';
}

export interface MarketingPlan {
  identity: BrandIdentity;
  strategy: ContentStrategy;
  calendar: PostItem[];
}
