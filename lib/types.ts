export interface Campaign {
  id: string;
  name: string;
  client: string;
  description: string;
  brief?: string;
  startDate: Date;
  endDate: Date;
  status: "active" | "paused" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaResult {
  id: string;
  campaignId: string;
  title: string;
  outlet: string;
  url: string;
  sentiment: "positive" | "neutral" | "negative";
  reach: number;
  publishedAt: Date;
  summary: string;
  mediaType:
    | "Online News"
    | "Print Media"
    | "Broadcast"
    | "Podcast"
    | "Blog"
    | "Social Media";
}

export interface Influencer {
  id: string;
  campaignId: string;
  name: string;
  platform: "instagram" | "twitter" | "tiktok" | "youtube";
  followers: number;
  engagement: number;
  category: string;
  avatar: string;
  verified: boolean;
}

export interface SocialPost {
  id: string;
  campaignId: string;
  trackerId?: string;
  platform: "instagram" | "twitter" | "tiktok" | "youtube";
  content: string;
  likes: number;
  shares: number;
  comments: number;
  reach: number;
  publishedAt: Date;
  author: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface SocialTracker {
  id: string;
  campaignId: string;
  name: string;
  keywords: string[];
  hashtags: string[];
  platforms: ("instagram" | "twitter" | "tiktok" | "youtube")[];
  startDate: Date;
  endDate: Date;
  status: "active" | "paused" | "completed";
  createdAt: Date;
  updatedAt: Date;
  postsCount: number;
  totalReach: number;
}

export interface DashboardStats {
  totalReach: number;
  mediaItems: number;
  influencers: number;
  socialPosts: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface Activity {
  id: string;
  campaignId: string;
  type: "media" | "influencer" | "social";
  title: string;
  description: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  filters?: MediaFilters;
}

export interface SavedFilter {
  id: string;
  name: string;
  description: string;
  query: string;
  filters: MediaFilters;
  createdAt: Date;
  resultCount?: number;
}

export interface MediaFilters {
  dateRange: {
    start: string;
    end: string;
  };
  mediaTypes: string[];
  sentiment: string[];
  outlets: string[];
  minReach: number;
}
