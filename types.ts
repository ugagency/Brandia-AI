
export interface BusinessProfile {
  name: string;
  businessType: string;
  productDescription: string; // New field
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

export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'WhatsApp' | 'YouTube Shorts';

export interface ReelsMetadata {
  hook3s: string; // 3-second hook
  cta: string; // Call to Action
  audioTrend?: string; // Suggested audio trend
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
  platform: Platform;
  status: 'pending' | 'posted';
  isTrend?: boolean;
  dayOfMonth: number;
  reelsMetadata?: ReelsMetadata;
}

export interface PlatformAdaptation {
  postId: string;
  originalTopic: string;
  tiktok: {
    videoIdea: string;
    caption: string;
    hashtags: string[];
    audioTrendSuggestion: string;
  };
  linkedin: {
    postText: string;
    hashtags: string[];
  };
  youtubeShorts: {
    title: string;
    description: string;
    videoIdea: string;
    hashtags: string[];
  };
  whatsapp: {
    message: string;
    statusIdea: string;
  };
}

export interface Competitor {
  name: string;
  postTypes: string;
  engagementLevel: string;
  opportunity: string;
  recentActivity: string;
}

export interface MarketingPlan {
  identity: BrandIdentity;
  strategy: ContentStrategy;
  calendar: PostItem[];
  competitors: Competitor[];
  adaptations?: PlatformAdaptation[];
}

export interface Project {
  id: string;
  projectName: string;
  createdAt: string;
  profile: BusinessProfile;
  plan: MarketingPlan;
}
