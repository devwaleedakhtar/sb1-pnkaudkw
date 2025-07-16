import {
  Campaign,
  MediaResult,
  Influencer,
  SocialPost,
  Activity,
} from "./types";
import type { SocialTracker } from "./types";

// Mock campaigns
export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Product Launch",
    client: "TechCorp Inc.",
    description:
      "Launch campaign for new smart home device targeting millennials",
    brief: `Campaign Brief: Smart Home Device Launch

Objective: Launch our new AI-powered home security system to tech-savvy millennials and Gen Z consumers

Target Audience: 
- Age: 25-40 years old
- Demographics: Urban professionals, homeowners, tech enthusiasts
- Interests: Smart home technology, security, convenience, IoT devices

Key Messages:
- Innovation: Cutting-edge AI technology that learns your habits
- Security: Advanced protection for your home and family
- Ease of use: Simple setup and intuitive mobile controls
- Value: Premium features at an affordable price point

Budget: $75,000
Timeline: 3 months (June - August 2024)

Preferred Channels:
- Social media (Instagram, YouTube, TikTok)
- Influencer partnerships with tech reviewers
- Tech blogs and publications
- Podcast sponsorships

Success Metrics:
- Brand awareness increase: 30%
- Lead generation: 1,500 qualified leads
- Social engagement: 60% increase
- Product pre-orders: 500 units

Additional Notes:
Looking for authentic reviews and product demonstrations. Focus on real-world use cases and customer testimonials. Emphasize the security and convenience benefits.`,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    status: "active",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-06-10"),
  },
  {
    id: "2",
    name: "Holiday Shopping Drive",
    client: "RetailMax",
    description: "Holiday season promotion across all channels",
    brief: `Campaign Brief: Holiday Shopping Drive 2024

Objective: Drive holiday sales and increase market share during the peak shopping season

Target Audience: 
- Age: 25-55 years old
- Demographics: Middle to upper-middle class families
- Interests: Holiday shopping, gift-giving, deals and discounts

Key Messages:
- Best deals of the year
- Perfect gifts for everyone
- Convenient online and in-store shopping
- Extended return policy for holiday purchases

Budget: $120,000
Timeline: 2 months (November - December 2024)

Preferred Channels:
- Social media advertising (Facebook, Instagram, Pinterest)
- Google Ads and shopping campaigns
- Email marketing campaigns
- Influencer partnerships with lifestyle bloggers

Success Metrics:
- Sales increase: 40% vs last year
- Website traffic: 200% increase
- Email open rates: 25% minimum
- Social media engagement: 80% increase

Additional Notes:
Focus on creating urgency with limited-time offers. Highlight free shipping and easy returns. Target both gift-givers and self-purchasers.`,
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-12-31"),
    status: "active",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-11-05"),
  },
  {
    id: "3",
    name: "Brand Awareness Q1",
    client: "StartupXYZ",
    description: "Building brand recognition for new fintech startup",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    status: "completed",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-04-01"),
  },
];

// Mock media results
export const mockMediaResults: MediaResult[] = [
  {
    id: "1",
    campaignId: "1",
    title: "Revolutionary Smart Home Device Hits the Market",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/example",
    sentiment: "positive",
    reach: 150000,
    publishedAt: new Date("2024-06-15"),
    summary:
      "Positive review highlighting innovative features and user experience",
  },
  {
    id: "2",
    campaignId: "1",
    title: "Smart Home Trends: What to Expect This Summer",
    outlet: "Wired",
    url: "https://wired.com/example",
    sentiment: "neutral",
    reach: 200000,
    publishedAt: new Date("2024-06-20"),
    summary:
      "Feature article mentioning the product among other smart home devices",
  },
  {
    id: "3",
    campaignId: "2",
    title: "Top Holiday Shopping Deals to Watch",
    outlet: "CNN Business",
    url: "https://cnn.com/example",
    sentiment: "positive",
    reach: 500000,
    publishedAt: new Date("2024-11-10"),
    summary: "Comprehensive guide featuring RetailMax deals prominently",
  },
];

// Mock influencers
export const mockInfluencers: Influencer[] = [
  {
    id: "1",
    campaignId: "1",
    name: "Sarah TechReviewer",
    platform: "youtube",
    followers: 850000,
    engagement: 4.2,
    category: "Technology",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "2",
    campaignId: "1",
    name: "Mike SmartHome",
    platform: "instagram",
    followers: 450000,
    engagement: 3.8,
    category: "Home & Garden",
    avatar:
      "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  {
    id: "3",
    campaignId: "2",
    name: "Emma Lifestyle",
    platform: "tiktok",
    followers: 1200000,
    engagement: 5.1,
    category: "Lifestyle",
    avatar:
      "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
];

// Mock social posts
export const mockSocialPosts: SocialPost[] = [
  {
    id: "1",
    campaignId: "1",
    trackerId: "tracker-1",
    platform: "instagram",
    content:
      "Just tried the new smart home device and I'm blown away! 🏠✨ #SmartHome #TechCorp",
    likes: 1250,
    shares: 89,
    comments: 156,
    reach: 15000,
    publishedAt: new Date("2024-06-18"),
    author: "techielifestyle",
    hashtags: ["SmartHome", "TechCorp"],
    mentions: ["@TechCorp"],
  },
  {
    id: "2",
    campaignId: "1",
    trackerId: "tracker-1",
    platform: "twitter",
    content:
      "The future of home automation is here. This device changes everything! @TechCorp",
    likes: 892,
    shares: 245,
    comments: 78,
    reach: 12000,
    publishedAt: new Date("2024-06-19"),
    author: "smartliving2024",
    hashtags: [],
    mentions: ["@TechCorp"],
  },
  {
    id: "3",
    campaignId: "2",
    trackerId: "tracker-2",
    platform: "tiktok",
    content: "Holiday shopping haul featuring amazing deals from RetailMax! 🛍️",
    likes: 5420,
    shares: 1200,
    comments: 890,
    reach: 85000,
    publishedAt: new Date("2024-11-12"),
    author: "shopwithemma",
    hashtags: ["HolidayShopping", "RetailMax"],
    mentions: ["@RetailMax"],
  },
  {
    id: "4",
    campaignId: "1",
    trackerId: "tracker-1",
    platform: "youtube",
    content:
      "Unboxing and first impressions of the revolutionary smart home device from TechCorp",
    likes: 2340,
    shares: 456,
    comments: 234,
    reach: 45000,
    publishedAt: new Date("2024-06-20"),
    author: "TechReviewChannel",
    hashtags: ["Unboxing", "SmartHome", "TechReview"],
    mentions: ["@TechCorp"],
  },
  {
    id: "5",
    campaignId: "1",
    trackerId: "tracker-1",
    platform: "instagram",
    content:
      "Smart home setup complete! This device has transformed my daily routine 🏡",
    likes: 890,
    shares: 67,
    comments: 123,
    reach: 8500,
    publishedAt: new Date("2024-06-21"),
    author: "modernliving_blog",
    hashtags: ["SmartHome", "HomeAutomation"],
    mentions: [],
  },
];

// Mock social trackers
export const mockSocialTrackers: SocialTracker[] = [
  {
    id: "tracker-1",
    campaignId: "1",
    name: "Smart Home Launch Tracking",
    keywords: ["smart home", "home automation", "TechCorp"],
    hashtags: ["#SmartHome", "#TechCorp", "#HomeAutomation"],
    platforms: ["instagram", "twitter", "youtube", "tiktok"],
    startDate: new Date("2024-06-01"),
    endDate: new Date("2024-08-31"),
    status: "active",
    createdAt: new Date("2024-05-30"),
    updatedAt: new Date("2024-06-15"),
    postsCount: 127,
    totalReach: 285000,
  },
  {
    id: "tracker-2",
    campaignId: "2",
    name: "Holiday Shopping Mentions",
    keywords: ["RetailMax", "holiday deals", "shopping"],
    hashtags: ["#HolidayShopping", "#RetailMax", "#BlackFriday"],
    platforms: ["instagram", "tiktok", "twitter"],
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-12-31"),
    status: "active",
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-11-10"),
    postsCount: 89,
    totalReach: 156000,
  },
  {
    id: "tracker-3",
    campaignId: "3",
    name: "Brand Awareness Monitor",
    keywords: ["StartupXYZ", "fintech", "financial technology"],
    hashtags: ["#StartupXYZ", "#Fintech", "#Innovation"],
    platforms: ["twitter", "instagram"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-03-31"),
    status: "completed",
    createdAt: new Date("2023-12-15"),
    updatedAt: new Date("2024-04-01"),
    postsCount: 45,
    totalReach: 78000,
  },
];

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: "1",
    campaignId: "1",
    type: "media",
    title: "New media coverage",
    description: "TechCrunch published a positive review",
    timestamp: new Date("2024-06-15T10:30:00"),
  },
  {
    id: "2",
    campaignId: "1",
    type: "influencer",
    title: "Influencer engagement",
    description: "Sarah TechReviewer posted unboxing video",
    timestamp: new Date("2024-06-16T14:15:00"),
  },
  {
    id: "3",
    campaignId: "1",
    type: "social",
    title: "Viral post detected",
    description: "Instagram post gained 10K+ likes",
    timestamp: new Date("2024-06-18T09:45:00"),
  },
];
