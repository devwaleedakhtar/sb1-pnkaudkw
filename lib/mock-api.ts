import {
  Campaign,
  MediaResult,
  Influencer,
  SocialPost,
  Activity,
  DashboardStats,
  MediaFilters,
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

// Example query mappings
const getExampleQueryResults = (query: string): string[] => {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("positive") && lowerQuery.includes("coverage")) {
    // Return IDs of positive articles
    return ["1", "3", "5", "7", "9", "11", "13", "15", "17", "19"];
  }

  if (
    lowerQuery.includes("negative mentions") ||
    lowerQuery.includes("negative coverage")
  ) {
    // Return IDs of negative articles
    return ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20"];
  }

  if (lowerQuery.includes("product launch") || lowerQuery.includes("launch")) {
    // Return IDs related to product launches
    return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  }

  if (lowerQuery.includes("social media") || lowerQuery.includes("social")) {
    // Return IDs for social media content
    return ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
  }

  if (lowerQuery.includes("high reach") || lowerQuery.includes("popular")) {
    // Return IDs of high reach articles
    return ["1", "5", "9", "13", "17", "21", "25"];
  }

  // For any other query, return a general set of results
  return [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
  ];
};

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
  async getMediaResults(
    campaignId: string,
    filters?: MediaFilters,
    searchQuery?: string,
    originalQuery?: string
  ): Promise<MediaResult[]> {
    await delay(400);

    let results = mockMediaResults.filter((m) => m.campaignId === campaignId);

    // Check if this is an example query first - use original query if available
    const queryToCheck = originalQuery || searchQuery;
    if (queryToCheck && queryToCheck.trim()) {
      const exampleResultIds = getExampleQueryResults(queryToCheck);
      if (exampleResultIds.length > 0) {
        results = results.filter((result) =>
          exampleResultIds.includes(result.id)
        );
        return results; // Return early for example queries, don't apply other filters
      }
    }

    // Apply search query filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (result) =>
          result.title.toLowerCase().includes(query) ||
          result.outlet.toLowerCase().includes(query) ||
          result.summary.toLowerCase().includes(query)
      );
    }

    // Apply filters if provided
    if (filters) {
      // Apply date range filter
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        results = results.filter((result) => result.publishedAt >= startDate);
      }
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        results = results.filter((result) => result.publishedAt <= endDate);
      }

      // Apply sentiment filter
      if (filters.sentiment.length > 0) {
        results = results.filter((result) =>
          filters.sentiment.includes(result.sentiment)
        );
      }

      // Apply media types filter
      if (filters.mediaTypes.length > 0) {
        results = results.filter((result) =>
          filters.mediaTypes.includes(result.mediaType)
        );
      }

      // Apply outlets filter
      if (filters.outlets.length > 0) {
        results = results.filter((result) =>
          filters.outlets.includes(result.outlet)
        );
      }

      // Apply minimum reach filter
      if (filters.minReach > 0) {
        results = results.filter((result) => result.reach >= filters.minReach);
      }
    }

    return results;
  },

  // Influencer APIs
  async getInfluencers(campaignId: string): Promise<Influencer[]> {
    await delay(400);
    return mockInfluencers.filter((i) => i.campaignId === campaignId);
  },

  async searchInfluencers(
    campaignId: string,
    params: any
  ): Promise<Influencer[]> {
    await delay(600);
    let results = mockInfluencers.filter((i) => i.campaignId === campaignId);

    // Apply platform filter
    if (params.platform && params.platform !== "all") {
      results = results.filter((i) => i.platform === params.platform);
    }

    // Apply category filter
    if (params.category && params.category !== "all") {
      results = results.filter(
        (i) => i.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Apply follower range filter
    if (params.minFollowers) {
      results = results.filter((i) => i.followers >= params.minFollowers);
    }
    if (params.maxFollowers) {
      results = results.filter((i) => i.followers <= params.maxFollowers);
    }

    // Apply engagement filter
    if (params.minEngagement) {
      results = results.filter((i) => i.engagement >= params.minEngagement);
    }

    // Apply text search filter
    if (params.query && params.query.trim()) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (i) =>
          i.name.toLowerCase().includes(query) ||
          i.category.toLowerCase().includes(query) ||
          i.platform.toLowerCase().includes(query)
      );
    }

    return results;
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
