
export interface BusinessProfile {
  name: string;
  businessType: string;
  productDescription: string;
  targetAudience: string;
  region: string;
  objective: 'vender' | 'atrair' | 'autoridade';
  style: 'serio' | 'descontraido' | 'popular';
  selectedPlatforms: Platform[]; // User choice
  postsPerDay: number; // Frequency
  selectedDaysOfWeek: string[]; // ['Segunda', 'Quarta', ...]
  businessStage: 'iniciando' | 'reposicionando' | 'escalando';
  logoUrl?: string;
  manualColors?: string[];
}

export interface BrandIdentity {
  bio: string;
  description: string;
  promise: string;
  keywords: string[];
  suggestedColors: string[];
  visualStyle: string;
}

export interface SalesFunnel {
  tofu: {
    stage: string;
    goal: string;
    contentStrategy: string;
  };
  mofu: {
    stage: string;
    goal: string;
    contentStrategy: string;
  };
  bofu: {
    stage: string;
    goal: string;
    contentStrategy: string;
  };
}

export interface ContentStrategy {
  idealTypes: string[];
  frequency: string;
  formats: string[];
  hotTopics: string[];
  rationale: string;
  funnel: SalesFunnel;
}

export type Platform = 'Instagram' | 'TikTok' | 'LinkedIn' | 'WhatsApp' | 'YouTube Shorts';

export interface ReelsMetadata {
  hook3s: string;
  cta: string;
  audioTrend?: string;
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
  funnelStage: 'ToFu' | 'MoFu' | 'BoFu';
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
  summary: string; // New: Brief summary of why this works
  adaptations?: PlatformAdaptation[];
  groundingSources?: any[]; // For Google Search transparency compliance
}

export interface Project {
  id: string;
  projectName: string;
  createdAt: string;
  profile: BusinessProfile;
  plan: MarketingPlan;
}
