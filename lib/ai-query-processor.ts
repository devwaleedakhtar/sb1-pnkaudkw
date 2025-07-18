import { MediaFilters } from "@/lib/types";
import { SearchParams } from "@/components/elevate-gpt/influencer-search";

export interface ProcessedQuery {
  query: string;
  filters: MediaFilters;
  suggestions: string[];
  confidence: number;
}

export interface InfluencerProcessedQuery {
  query: string;
  searchParams: SearchParams;
  suggestions: string[];
  confidence: number;
}

export interface SocialTrackingParams {
  name: string;
  keywords: string[];
  hashtags: string[];
  socialMediaHandles?: string[];
  platforms: ("instagram" | "twitter" | "tiktok" | "youtube")[];
  startDate: string;
  endDate: string;
}

export interface SocialTrackingProcessedQuery {
  trackingParams: SocialTrackingParams;
  suggestions: string[];
  confidence: number;
}

export interface QueryPattern {
  pattern: RegExp;
  handler: (
    match: RegExpMatchArray,
    filters: MediaFilters,
    suggestions: string[]
  ) => void;
}

export interface InfluencerQueryPattern {
  pattern: RegExp;
  handler: (
    match: RegExpMatchArray,
    params: SearchParams,
    suggestions: string[]
  ) => void;
}

export interface SocialTrackingQueryPattern {
  pattern: RegExp;
  handler: (
    match: RegExpMatchArray,
    params: SocialTrackingParams,
    suggestions: string[]
  ) => void;
}

/**
 * AI Query Processor - Converts natural language queries into structured filters
 * In production, this would integrate with an actual LLM API
 */
export class AIQueryProcessor {
  private patterns: QueryPattern[] = [
    // Date patterns
    {
      pattern: /\b(last|past|previous)\s+(week|7\s*days?)\b/gi,
      handler: (match, filters, suggestions) => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        filters.dateRange.start = date.toISOString().split("T")[0];
        suggestions.push("Date range: Last 7 days");
      },
    },
    {
      pattern: /\b(last|past|previous)\s+(month|30\s*days?)\b/gi,
      handler: (match, filters, suggestions) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        filters.dateRange.start = date.toISOString().split("T")[0];
        suggestions.push("Date range: Last 30 days");
      },
    },
    {
      pattern: /\b(this|current)\s+(week|month|year)\b/gi,
      handler: (match, filters, suggestions) => {
        const date = new Date();
        if (match[2].toLowerCase().includes("week")) {
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          filters.dateRange.start = startOfWeek.toISOString().split("T")[0];
          suggestions.push("Date range: This week");
        } else if (match[2].toLowerCase().includes("month")) {
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          filters.dateRange.start = startOfMonth.toISOString().split("T")[0];
          suggestions.push("Date range: This month");
        }
      },
    },

    // Sentiment patterns
    {
      pattern: /\b(positive|good|favorable|great|excellent|amazing)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.sentiment.includes("positive")) {
          filters.sentiment.push("positive");
          suggestions.push("Sentiment: Positive only");
        }
      },
    },
    {
      pattern: /\b(negative|bad|critical|poor|terrible|awful)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.sentiment.includes("negative")) {
          filters.sentiment.push("negative");
          suggestions.push("Sentiment: Negative only");
        }
      },
    },
    {
      pattern: /\b(neutral|mixed|balanced)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.sentiment.includes("neutral")) {
          filters.sentiment.push("neutral");
          suggestions.push("Sentiment: Neutral only");
        }
      },
    },

    // Media type patterns
    {
      pattern: /\b(news|articles?|online\s+news)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.mediaTypes.includes("Online News")) {
          filters.mediaTypes.push("Online News");
          suggestions.push("Media type: Online News");
        }
      },
    },
    {
      pattern: /\b(social\s+media|social)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.mediaTypes.includes("Social Media")) {
          filters.mediaTypes.push("Social Media");
          suggestions.push("Media type: Social Media");
        }
      },
    },
    {
      pattern: /\b(podcasts?|audio)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.mediaTypes.includes("Podcast")) {
          filters.mediaTypes.push("Podcast");
          suggestions.push("Media type: Podcast");
        }
      },
    },
    {
      pattern: /\b(broadcasts?|tv|television)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.mediaTypes.includes("Broadcast")) {
          filters.mediaTypes.push("Broadcast");
          suggestions.push("Media type: Broadcast");
        }
      },
    },
    {
      pattern: /\b(blogs?|blog\s+posts?)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.mediaTypes.includes("Blog")) {
          filters.mediaTypes.push("Blog");
          suggestions.push("Media type: Blog");
        }
      },
    },
    {
      pattern: /\b(print|newspaper|magazine)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.mediaTypes.includes("Print Media")) {
          filters.mediaTypes.push("Print Media");
          suggestions.push("Media type: Print Media");
        }
      },
    },

    // Outlet patterns
    {
      pattern: /\b(techcrunch|tech\s+crunch)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.outlets.includes("TechCrunch")) {
          filters.outlets.push("TechCrunch");
          suggestions.push("Outlet: TechCrunch");
        }
      },
    },
    {
      pattern: /\bwired\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.outlets.includes("Wired")) {
          filters.outlets.push("Wired");
          suggestions.push("Outlet: Wired");
        }
      },
    },
    {
      pattern: /\b(cnn|cnn\s+business)\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.outlets.includes("CNN Business")) {
          filters.outlets.push("CNN Business");
          suggestions.push("Outlet: CNN Business");
        }
      },
    },
    {
      pattern: /\bforbes\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.outlets.includes("Forbes")) {
          filters.outlets.push("Forbes");
          suggestions.push("Outlet: Forbes");
        }
      },
    },
    {
      pattern: /\breuters\b/gi,
      handler: (match, filters, suggestions) => {
        if (!filters.outlets.includes("Reuters")) {
          filters.outlets.push("Reuters");
          suggestions.push("Outlet: Reuters");
        }
      },
    },

    // Reach patterns
    {
      pattern: /\b(high\s+reach|popular|wide\s+reach)\b/gi,
      handler: (match, filters, suggestions) => {
        filters.minReach = 100000;
        suggestions.push("Minimum reach: 100K+");
      },
    },
    {
      pattern: /\b(viral|trending|massive\s+reach)\b/gi,
      handler: (match, filters, suggestions) => {
        filters.minReach = 500000;
        suggestions.push("Minimum reach: 500K+");
      },
    },
    {
      pattern: /\b(low\s+reach|small\s+audience)\b/gi,
      handler: (match, filters, suggestions) => {
        filters.minReach = 1000;
        suggestions.push("Minimum reach: 1K+");
      },
    },
    {
      pattern: /\b(\d+(?:k|m)?\+?)\s+reach\b/gi,
      handler: (match, filters, suggestions) => {
        const reachStr = match[1].toLowerCase();
        let reach = 0;
        if (reachStr.includes("k")) {
          reach = parseInt(reachStr.replace("k", "")) * 1000;
        } else if (reachStr.includes("m")) {
          reach = parseInt(reachStr.replace("m", "")) * 1000000;
        } else {
          reach = parseInt(reachStr);
        }
        filters.minReach = reach;
        suggestions.push(`Minimum reach: ${reachStr.toUpperCase()}`);
      },
    },
  ];

  /**
   * Process a natural language query into structured filters
   */
  async processQuery(naturalQuery: string): Promise<ProcessedQuery> {
    const filters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };

    const suggestions: string[] = [];
    let confidence = 0;

    // Apply all patterns
    for (const { pattern, handler } of this.patterns) {
      const matches = Array.from(naturalQuery.matchAll(pattern));
      for (const match of matches) {
        handler(match, filters, suggestions);
        confidence += 0.1; // Increase confidence for each matched pattern
      }
    }

    // Clean up the query by removing processed terms
    let cleanQuery = naturalQuery;
    for (const { pattern } of this.patterns) {
      cleanQuery = cleanQuery.replace(pattern, "");
    }

    // Clean up extra whitespace
    cleanQuery = cleanQuery.replace(/\s+/g, " ").trim();

    // If no meaningful query remains, use original
    if (cleanQuery.length < 3) {
      cleanQuery = naturalQuery;
    }

    // Normalize confidence (0-1)
    confidence = Math.min(confidence, 1);

    return {
      query: cleanQuery,
      filters,
      suggestions,
      confidence,
    };
  }

  /**
   * Get example queries for user guidance
   */
  getExampleQueries(): string[] {
    return [
      "Show me positive TechCrunch articles from last week",
      "Find negative mentions with high reach",
      "Get all podcast mentions from this month",
      "Social media posts about our product",
      "Wired articles with viral reach",
      "Recent Forbes coverage with positive sentiment",
      "Bad reviews from last month",
      "Trending news articles",
    ];
  }

  /**
   * Suggest query improvements based on current input
   */
  suggestQueryImprovements(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (
      !lowerQuery.includes("last") &&
      !lowerQuery.includes("this") &&
      !lowerQuery.includes("recent")
    ) {
      suggestions.push('Add time frame (e.g., "last week", "this month")');
    }

    if (
      !lowerQuery.includes("positive") &&
      !lowerQuery.includes("negative") &&
      !lowerQuery.includes("neutral")
    ) {
      suggestions.push('Specify sentiment (e.g., "positive", "negative")');
    }

    if (
      !lowerQuery.includes("techcrunch") &&
      !lowerQuery.includes("wired") &&
      !lowerQuery.includes("forbes")
    ) {
      suggestions.push(
        'Mention specific outlets (e.g., "TechCrunch", "Wired")'
      );
    }

    if (
      !lowerQuery.includes("high") &&
      !lowerQuery.includes("viral") &&
      !lowerQuery.includes("reach")
    ) {
      suggestions.push('Add reach requirement (e.g., "high reach", "viral")');
    }

    return suggestions;
  }
}

/**
 * AI Query Processor for Social Media Tracking - Converts natural language queries into structured tracking parameters
 */
export class SocialTrackingAIQueryProcessor {
  private patterns: SocialTrackingQueryPattern[] = [
    // Platform patterns
    {
      pattern: /\b(instagram|insta|ig)\b/gi,
      handler: (match, params, suggestions) => {
        if (!params.platforms.includes("instagram")) {
          params.platforms.push("instagram");
          suggestions.push("Platform: Instagram");
        }
      },
    },
    {
      pattern: /\b(youtube|yt)\b/gi,
      handler: (match, params, suggestions) => {
        if (!params.platforms.includes("youtube")) {
          params.platforms.push("youtube");
          suggestions.push("Platform: YouTube");
        }
      },
    },
    {
      pattern: /\b(tiktok|tik\s*tok)\b/gi,
      handler: (match, params, suggestions) => {
        if (!params.platforms.includes("tiktok")) {
          params.platforms.push("tiktok");
          suggestions.push("Platform: TikTok");
        }
      },
    },
    {
      pattern: /\b(twitter|x\.com)\b/gi,
      handler: (match, params, suggestions) => {
        if (!params.platforms.includes("twitter")) {
          params.platforms.push("twitter");
          suggestions.push("Platform: Twitter");
        }
      },
    },

    // Hashtag patterns
    {
      pattern: /#(\w+)/gi,
      handler: (match, params, suggestions) => {
        const hashtag = `#${match[1]}`;
        if (!params.hashtags.includes(hashtag)) {
          params.hashtags.push(hashtag);
          suggestions.push(`Hashtag: ${hashtag}`);
        }
      },
    },

    // Brand/Product patterns
    {
      pattern:
        /\b(brand|product|company)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:mentions?|tracking|monitoring))/gi,
      handler: (match, params, suggestions) => {
        const brandName = match[2].trim();
        if (brandName && !params.keywords.includes(brandName)) {
          params.keywords.push(brandName);
          suggestions.push(`Brand: ${brandName}`);
        }
      },
    },

    // Campaign patterns
    {
      pattern:
        /\b(campaign|launch|promotion)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:tracking|monitoring))/gi,
      handler: (match, params, suggestions) => {
        const campaignName = match[2].trim();
        if (campaignName && !params.keywords.includes(campaignName)) {
          params.keywords.push(campaignName);
          params.name = `${campaignName} Tracking`;
          suggestions.push(`Campaign: ${campaignName}`);
        }
      },
    },

    // Time period patterns
    {
      pattern: /\b(next|coming|upcoming)\s+(\d+)\s+(days?|weeks?|months?)\b/gi,
      handler: (match, params, suggestions) => {
        const amount = parseInt(match[2]);
        const unit = match[3].toLowerCase();

        const startDate = new Date();
        const endDate = new Date();

        if (unit.includes("day")) {
          endDate.setDate(endDate.getDate() + amount);
        } else if (unit.includes("week")) {
          endDate.setDate(endDate.getDate() + amount * 7);
        } else if (unit.includes("month")) {
          endDate.setMonth(endDate.getMonth() + amount);
        }

        params.startDate = startDate.toISOString().split("T")[0];
        params.endDate = endDate.toISOString().split("T")[0];
        suggestions.push(`Duration: ${amount} ${unit}`);
      },
    },

    {
      pattern: /\b(for|during)\s+(\d+)\s+(days?|weeks?|months?)\b/gi,
      handler: (match, params, suggestions) => {
        const amount = parseInt(match[2]);
        const unit = match[3].toLowerCase();

        const startDate = new Date();
        const endDate = new Date();

        if (unit.includes("day")) {
          endDate.setDate(endDate.getDate() + amount);
        } else if (unit.includes("week")) {
          endDate.setDate(endDate.getDate() + amount * 7);
        } else if (unit.includes("month")) {
          endDate.setMonth(endDate.getMonth() + amount);
        }

        params.startDate = startDate.toISOString().split("T")[0];
        params.endDate = endDate.toISOString().split("T")[0];
        suggestions.push(`Duration: ${amount} ${unit}`);
      },
    },

    // Competition patterns
    {
      pattern:
        /\b(competitor|competition|rival)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:mentions?|tracking|monitoring))/gi,
      handler: (match, params, suggestions) => {
        const competitor = match[2].trim();
        if (competitor && !params.keywords.includes(competitor)) {
          params.keywords.push(competitor);
          suggestions.push(`Competitor: ${competitor}`);
        }
      },
    },

    // Event patterns
    {
      pattern:
        /\b(event|conference|webinar|launch)\s+([a-zA-Z0-9\s]+?)(?:\s+(?:mentions?|tracking|monitoring))/gi,
      handler: (match, params, suggestions) => {
        const eventName = match[2].trim();
        if (eventName && !params.keywords.includes(eventName)) {
          params.keywords.push(eventName);
          suggestions.push(`Event: ${eventName}`);
        }
      },
    },

    // Sentiment patterns
    {
      pattern:
        /\b(positive|negative|neutral)\s+(mentions?|sentiment|feedback)\b/gi,
      handler: (match, params, suggestions) => {
        const sentiment = match[1].toLowerCase();
        suggestions.push(`Focus: ${sentiment} sentiment`);
      },
    },

    // Crisis monitoring patterns
    {
      pattern: /\b(crisis|issue|problem|complaint)\s+(monitoring|tracking)\b/gi,
      handler: (match, params, suggestions) => {
        params.keywords.push("complaint", "issue", "problem");
        suggestions.push("Focus: Crisis monitoring");
      },
    },
  ];

  /**
   * Process a natural language query into structured tracking parameters
   */
  async processSocialTrackingQuery(
    naturalQuery: string
  ): Promise<SocialTrackingProcessedQuery> {
    const trackingParams: SocialTrackingParams = {
      name: "",
      keywords: [],
      hashtags: [],
      platforms: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days default
    };

    const suggestions: string[] = [];
    let confidence = 0;

    // Apply all patterns
    for (const { pattern, handler } of this.patterns) {
      const matches = Array.from(naturalQuery.matchAll(pattern));
      for (const match of matches) {
        handler(match, trackingParams, suggestions);
        confidence += 0.1; // Increase confidence for each matched pattern
      }
    }

    // Extract keywords that aren't already captured
    const words = naturalQuery.toLowerCase().split(/\s+/);
    const commonWords = new Set([
      "track",
      "monitor",
      "mentions",
      "social",
      "media",
      "on",
      "for",
      "about",
      "the",
      "and",
      "or",
      "in",
      "at",
      "to",
      "from",
      "with",
      "by",
    ]);

    words.forEach((word) => {
      if (
        word.length > 3 &&
        !commonWords.has(word) &&
        !trackingParams.keywords.includes(word)
      ) {
        // Only add if it's not already a hashtag or platform
        if (
          !word.startsWith("#") &&
          !["instagram", "twitter", "tiktok", "youtube"].includes(word)
        ) {
          trackingParams.keywords.push(word);
        }
      }
    });

    // Generate tracker name if not set
    if (!trackingParams.name) {
      if (trackingParams.keywords.length > 0) {
        trackingParams.name = `${trackingParams.keywords[0]} Tracking`;
      } else if (trackingParams.hashtags.length > 0) {
        trackingParams.name = `${trackingParams.hashtags[0]} Tracking`;
      } else {
        trackingParams.name = "Social Media Tracking";
      }
    }

    // Default to all platforms if none specified
    if (trackingParams.platforms.length === 0) {
      trackingParams.platforms = ["instagram", "twitter", "tiktok", "youtube"];
      suggestions.push("Platforms: All platforms (default)");
    }

    // Ensure at least one keyword
    if (trackingParams.keywords.length === 0) {
      const fallbackKeywords = this.extractFallbackKeywords(naturalQuery);
      trackingParams.keywords = fallbackKeywords;
      if (fallbackKeywords.length > 0) {
        suggestions.push(`Keywords: ${fallbackKeywords.join(", ")}`);
      }
    }

    // Normalize confidence (0-1)
    confidence = Math.min(confidence, 1);

    return {
      trackingParams,
      suggestions,
      confidence,
    };
  }

  private extractFallbackKeywords(query: string): string[] {
    // Remove common words and extract potential keywords
    const words = query
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2);

    const stopWords = new Set([
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "track",
      "monitor",
      "social",
      "media",
      "mentions",
      "tracking",
      "monitoring",
      "create",
      "setup",
      "new",
      "campaign",
      "brand",
      "product",
      "company",
    ]);

    return words.filter((word) => !stopWords.has(word)).slice(0, 5);
  }

  /**
   * Get example queries for user guidance
   */
  getSocialTrackingExampleQueries(): string[] {
    return [
      "Track mentions of TechCorp on Instagram and Twitter for 30 days",
      "Monitor #ProductLaunch campaign across all platforms",
      "Create crisis monitoring for customer complaints",
      "Track competitor Apple mentions on social media",
      "Monitor brand sentiment for next 2 weeks",
      "Track event mentions for TechConf2024 #techconf",
      "Monitor product feedback on Instagram and TikTok",
      "Track campaign performance for summer promotion",
    ];
  }

  /**
   * Suggest query improvements based on current input
   */
  suggestSocialTrackingQueryImprovements(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (
      !lowerQuery.includes("instagram") &&
      !lowerQuery.includes("twitter") &&
      !lowerQuery.includes("tiktok") &&
      !lowerQuery.includes("youtube")
    ) {
      suggestions.push('Specify platforms (e.g., "on Instagram and Twitter")');
    }

    if (!lowerQuery.includes("#") && !lowerQuery.includes("hashtag")) {
      suggestions.push('Add hashtags to track (e.g., "#brandname")');
    }

    if (
      !lowerQuery.includes("day") &&
      !lowerQuery.includes("week") &&
      !lowerQuery.includes("month")
    ) {
      suggestions.push(
        'Specify duration (e.g., "for 30 days", "next 2 weeks")'
      );
    }

    if (
      !lowerQuery.includes("brand") &&
      !lowerQuery.includes("product") &&
      !lowerQuery.includes("campaign") &&
      !lowerQuery.includes("company")
    ) {
      suggestions.push(
        'Specify what to track (e.g., "brand mentions", "product feedback")'
      );
    }

    return suggestions;
  }
}

/**
 * AI Query Processor for Influencer Search - Converts natural language queries into structured search parameters
 */
export class InfluencerAIQueryProcessor {
  private patterns: InfluencerQueryPattern[] = [
    // Platform patterns
    {
      pattern: /\b(instagram|insta|ig)\b/gi,
      handler: (match, params, suggestions) => {
        params.platform = "instagram";
        suggestions.push("Platform: Instagram");
      },
    },
    {
      pattern: /\b(youtube|yt)\b/gi,
      handler: (match, params, suggestions) => {
        params.platform = "youtube";
        suggestions.push("Platform: YouTube");
      },
    },
    {
      pattern: /\b(tiktok|tik\s*tok)\b/gi,
      handler: (match, params, suggestions) => {
        params.platform = "tiktok";
        suggestions.push("Platform: TikTok");
      },
    },
    {
      pattern: /\b(twitter|x\.com)\b/gi,
      handler: (match, params, suggestions) => {
        params.platform = "twitter";
        suggestions.push("Platform: Twitter");
      },
    },

    // Category patterns
    {
      pattern: /\b(tech|technology|gadgets?|software|hardware)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "technology";
        suggestions.push("Category: Technology");
      },
    },
    {
      pattern: /\b(lifestyle|life|daily|living)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "lifestyle";
        suggestions.push("Category: Lifestyle");
      },
    },
    {
      pattern: /\b(fashion|style|clothing|outfit)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "fashion";
        suggestions.push("Category: Fashion");
      },
    },
    {
      pattern: /\b(fitness|gym|workout|health|exercise)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "fitness";
        suggestions.push("Category: Fitness");
      },
    },
    {
      pattern: /\b(food|cooking|recipe|chef|culinary)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "food";
        suggestions.push("Category: Food & Cooking");
      },
    },
    {
      pattern: /\b(travel|vacation|trip|adventure|explore)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "travel";
        suggestions.push("Category: Travel");
      },
    },
    {
      pattern: /\b(beauty|makeup|skincare|cosmetics)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "beauty";
        suggestions.push("Category: Beauty");
      },
    },
    {
      pattern: /\b(gaming|games|esports|streamer)\b/gi,
      handler: (match, params, suggestions) => {
        params.category = "gaming";
        suggestions.push("Category: Gaming");
      },
    },

    // Follower count patterns
    {
      pattern: /\b(micro|small|niche)\s*(influencer|creator)s?\b/gi,
      handler: (match, params, suggestions) => {
        params.minFollowers = 1000;
        params.maxFollowers = 100000;
        suggestions.push("Follower range: 1K-100K (Micro-influencers)");
      },
    },
    {
      pattern: /\b(macro|big|large)\s*(influencer|creator)s?\b/gi,
      handler: (match, params, suggestions) => {
        params.minFollowers = 100000;
        params.maxFollowers = 1000000;
        suggestions.push("Follower range: 100K-1M (Macro-influencers)");
      },
    },
    {
      pattern: /\b(mega|huge|massive)\s*(influencer|creator)s?\b/gi,
      handler: (match, params, suggestions) => {
        params.minFollowers = 1000000;
        params.maxFollowers = 10000000;
        suggestions.push("Follower range: 1M+ (Mega-influencers)");
      },
    },
    {
      pattern:
        /\b(\d+(?:\.\d+)?)\s*([km])\s*(followers?|subs?|subscribers?)\b/gi,
      handler: (match, params, suggestions) => {
        const number = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        const multiplier = unit === "k" ? 1000 : 1000000;
        const followers = number * multiplier;
        params.minFollowers = Math.floor(followers * 0.8); // 20% tolerance
        params.maxFollowers = Math.ceil(followers * 1.2);
        suggestions.push(
          `Follower range: Around ${match[1]}${unit.toUpperCase()}`
        );
      },
    },
    {
      pattern: /\bover\s+(\d+(?:\.\d+)?)\s*([km])\s*(followers?|subs?)\b/gi,
      handler: (match, params, suggestions) => {
        const number = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        const multiplier = unit === "k" ? 1000 : 1000000;
        params.minFollowers = number * multiplier;
        suggestions.push(
          `Minimum followers: ${match[1]}${unit.toUpperCase()}+`
        );
      },
    },
    {
      pattern: /\bunder\s+(\d+(?:\.\d+)?)\s*([km])\s*(followers?|subs?)\b/gi,
      handler: (match, params, suggestions) => {
        const number = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        const multiplier = unit === "k" ? 1000 : 1000000;
        params.maxFollowers = number * multiplier;
        suggestions.push(`Maximum followers: ${match[1]}${unit.toUpperCase()}`);
      },
    },

    // Engagement patterns
    {
      pattern: /\b(high|good|great|excellent)\s*(engagement|interaction)\b/gi,
      handler: (match, params, suggestions) => {
        params.minEngagement = 3.0;
        suggestions.push("Minimum engagement: 3.0%+");
      },
    },
    {
      pattern: /\b(low|poor|bad)\s*(engagement|interaction)\b/gi,
      handler: (match, params, suggestions) => {
        params.minEngagement = 0.5;
        suggestions.push("Minimum engagement: 0.5%+");
      },
    },
    {
      pattern: /\b(\d+(?:\.\d+)?)\s*%\s*(engagement|interaction)\b/gi,
      handler: (match, params, suggestions) => {
        const engagement = parseFloat(match[1]);
        params.minEngagement = engagement;
        suggestions.push(`Minimum engagement: ${engagement}%+`);
      },
    },
    {
      pattern: /\bover\s+(\d+(?:\.\d+)?)\s*%\s*(engagement|interaction)\b/gi,
      handler: (match, params, suggestions) => {
        const engagement = parseFloat(match[1]);
        params.minEngagement = engagement;
        suggestions.push(`Minimum engagement: ${engagement}%+`);
      },
    },

    // Database preference patterns
    {
      pattern: /\b(internal|database|curated|verified)\b/gi,
      handler: (match, params, suggestions) => {
        params.useInternalDb = true;
        suggestions.push("Search: Internal database");
      },
    },
    {
      pattern:
        /\b(broad|external|all|everywhere|public)\s*(search|database)?\b/gi,
      handler: (match, params, suggestions) => {
        params.useInternalDb = false;
        suggestions.push("Search: Broad search");
      },
    },

    // Verification patterns
    {
      pattern: /\b(verified|blue\s*check|authenticated)\b/gi,
      handler: (match, params, suggestions) => {
        // This would need to be added to SearchParams interface
        suggestions.push("Preference: Verified accounts");
      },
    },
  ];

  /**
   * Process a natural language query into structured search parameters
   */
  async processInfluencerQuery(
    naturalQuery: string
  ): Promise<InfluencerProcessedQuery> {
    const searchParams: SearchParams = {
      query: "",
      platform: "all",
      category: "all",
      minFollowers: 1000,
      maxFollowers: 10000000,
      minEngagement: 1,
      useInternalDb: true,
    };

    const suggestions: string[] = [];
    let confidence = 0;

    // Apply all patterns
    for (const { pattern, handler } of this.patterns) {
      const matches = Array.from(naturalQuery.matchAll(pattern));
      for (const match of matches) {
        handler(match, searchParams, suggestions);
        confidence += 0.1; // Increase confidence for each matched pattern
      }
    }

    // Clean up the query by removing processed terms
    let cleanQuery = naturalQuery;
    for (const { pattern } of this.patterns) {
      cleanQuery = cleanQuery.replace(pattern, "");
    }

    // Clean up extra whitespace and common words
    cleanQuery = cleanQuery
      .replace(/\b(find|search|show|get|looking\s+for|want|need)\b/gi, "")
      .replace(/\b(influencers?|creators?|accounts?)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    // If meaningful query remains, use it; otherwise use original
    if (cleanQuery.length >= 2) {
      searchParams.query = cleanQuery;
    } else {
      searchParams.query = naturalQuery;
    }

    // Normalize confidence (0-1)
    confidence = Math.min(confidence, 1);

    return {
      query: cleanQuery || naturalQuery,
      searchParams,
      suggestions,
      confidence,
    };
  }

  /**
   * Get example queries for user guidance
   */
  getInfluencerExampleQueries(): string[] {
    return [
      "Find tech YouTubers with over 100k subscribers",
      "Show me fashion influencers on Instagram with high engagement",
      "Micro-influencers in fitness niche",
      "Gaming streamers with good interaction rates",
      "Travel bloggers with 50k followers",
      "Beauty influencers on TikTok with verified accounts",
      "Food creators with over 3% engagement",
      "Lifestyle influencers under 500k followers",
    ];
  }

  /**
   * Suggest query improvements based on current input
   */
  suggestInfluencerQueryImprovements(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();

    if (
      !lowerQuery.includes("instagram") &&
      !lowerQuery.includes("youtube") &&
      !lowerQuery.includes("tiktok") &&
      !lowerQuery.includes("twitter")
    ) {
      suggestions.push('Specify platform (e.g., "Instagram", "YouTube")');
    }

    if (
      !lowerQuery.includes("tech") &&
      !lowerQuery.includes("fashion") &&
      !lowerQuery.includes("fitness") &&
      !lowerQuery.includes("beauty") &&
      !lowerQuery.includes("gaming")
    ) {
      suggestions.push('Add category (e.g., "tech", "fashion", "fitness")');
    }

    if (
      !lowerQuery.includes("k") &&
      !lowerQuery.includes("m") &&
      !lowerQuery.includes("micro") &&
      !lowerQuery.includes("macro") &&
      !lowerQuery.includes("mega")
    ) {
      suggestions.push(
        'Specify audience size (e.g., "100k followers", "micro-influencers")'
      );
    }

    if (
      !lowerQuery.includes("engagement") &&
      !lowerQuery.includes("interaction")
    ) {
      suggestions.push(
        'Add engagement requirement (e.g., "high engagement", "3% engagement")'
      );
    }

    return suggestions;
  }
}
