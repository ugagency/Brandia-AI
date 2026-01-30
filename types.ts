
export interface BusinessProfile {
  name: string;
  businessType: string;
  targetAudience: string;
  region: string;
  objective: 'vender' | 'atrair' | 'autoridade';
  style: 'serio' | 'descontraido' | 'popular';
  logoUrl?: string; // Base64 logo
  manualColors?: string[]; // Colors extracted or chosen
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
  status: 'pending' | 'posted';
  isTrend?: boolean;
  dayOfMonth: number;
}

export interface Competitor {
  name: string;
  postTypes: string;
  engagementLevel: string;
  opportunity: string;
}

export interface MarketingPlan {
  identity: BrandIdentity;
  strategy: ContentStrategy;
  calendar: PostItem[];
  competitors: Competitor[];
}

export interface Project {
  id: string;
  projectName: string;
  createdAt: string;
  profile: BusinessProfile;
  plan: MarketingPlan;
}
