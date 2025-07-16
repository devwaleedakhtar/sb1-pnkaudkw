import {
  Campaign,
  MediaResult,
  Influencer,
  SocialPost,
  Activity,
  DashboardStats,
} from "./types";
import type { SocialTracker } from "./types";
import {
  mockCampaigns,
  mockMediaResults,
  mockInfluencers,
  mockSocialPosts,
  mockActivities,
  mockSocialTrackers,
} from "./mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Campaign APIs
  async getCampaigns(): Promise<Campaign[]> {
    await delay(500);
    return mockCampaigns;
  },

  async getCampaign(id: string): Promise<Campaign | null> {
    await delay(300);
    return mockCampaigns.find((c) => c.id === id) || null;
  },

  async createCampaign(
    campaign: Omit<Campaign, "id" | "createdAt" | "updatedAt">
  ): Promise<Campaign> {
    await delay(800);
    const newCampaign: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCampaigns.push(newCampaign);
    return newCampaign;
  },

  async updateCampaign(
    id: string,
    updates: Partial<Campaign>
  ): Promise<Campaign | null> {
    await delay(600);
    const index = mockCampaigns.findIndex((c) => c.id === id);
    if (index === -1) return null;

    mockCampaigns[index] = {
      ...mockCampaigns[index],
      ...updates,
      updatedAt: new Date(),
    };
    return mockCampaigns[index];
  },

  // Media APIs
  async getMediaResults(campaignId: string): Promise<MediaResult[]> {
    await delay(400);
    return mockMediaResults.filter((m) => m.campaignId === campaignId);
  },

  // Influencer APIs
  async getInfluencers(campaignId: string): Promise<Influencer[]> {
    await delay(400);
    return mockInfluencers.filter((i) => i.campaignId === campaignId);
  },

  // Social APIs
  async getSocialPosts(campaignId: string): Promise<SocialPost[]> {
    await delay(400);
    return mockSocialPosts.filter((s) => s.campaignId === campaignId);
  },

  async getSocialTrackers(campaignId: string): Promise<SocialTracker[]> {
    await delay(300);
    return mockSocialTrackers.filter((t) => t.campaignId === campaignId);
  },

  async getSocialTracker(id: string): Promise<SocialTracker | null> {
    await delay(300);
    return mockSocialTrackers.find((t) => t.id === id) || null;
  },

  async createSocialTracker(
    tracker: Omit<
      SocialTracker,
      "id" | "createdAt" | "updatedAt" | "postsCount" | "totalReach"
    >
  ): Promise<SocialTracker> {
    await delay(800);
    const newTracker: SocialTracker = {
      ...tracker,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      postsCount: 0,
      totalReach: 0,
    };
    mockSocialTrackers.push(newTracker);
    return newTracker;
  },

  async updateSocialTracker(
    id: string,
    updates: Partial<SocialTracker>
  ): Promise<SocialTracker | null> {
    await delay(600);
    const index = mockSocialTrackers.findIndex((t) => t.id === id);
    if (index === -1) return null;

    mockSocialTrackers[index] = {
      ...mockSocialTrackers[index],
      ...updates,
      updatedAt: new Date(),
    };
    return mockSocialTrackers[index];
  },

  async getSocialPostsByTracker(trackerId: string): Promise<SocialPost[]> {
    await delay(400);
    return mockSocialPosts.filter((s) => s.trackerId === trackerId);
  },

  // Activity APIs
  async getActivities(campaignId: string): Promise<Activity[]> {
    await delay(300);
    return mockActivities
      .filter((a) => a.campaignId === campaignId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  },

  // Dashboard APIs
  async getDashboardStats(campaignId: string): Promise<DashboardStats> {
    await delay(600);
    const mediaResults = mockMediaResults.filter(
      (m) => m.campaignId === campaignId
    );
    const influencers = mockInfluencers.filter(
      (i) => i.campaignId === campaignId
    );
    const socialPosts = mockSocialPosts.filter(
      (s) => s.campaignId === campaignId
    );

    const totalReach = [
      ...mediaResults.map((m) => m.reach),
      ...socialPosts.map((s) => s.reach),
    ].reduce((sum, reach) => sum + reach, 0);

    const sentimentCounts = mediaResults.reduce(
      (acc, media) => {
        acc[media.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    return {
      totalReach,
      mediaItems: mediaResults.length,
      influencers: influencers.length,
      socialPosts: socialPosts.length,
      sentiment: sentimentCounts,
    };
  },
};
