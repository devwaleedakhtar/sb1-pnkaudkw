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
  // TechCrunch articles
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
      "Positive review highlighting innovative features and user experience. The device's AI capabilities and seamless integration make it a standout product.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 180000,
    topic: "Smart Home Technology",
    author: "Sarah Johnson",
    source: "Direct",
  },
  {
    id: "2",
    campaignId: "1",
    title: "Smart Home Security Concerns Raised by Experts",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/example2",
    sentiment: "negative",
    reach: 180000,
    publishedAt: new Date("2024-06-10"),
    summary:
      "Critical analysis of potential security vulnerabilities in new smart home devices. Experts raise concerns about data privacy and network security.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 220000,
    topic: "Cybersecurity",
    author: "Michael Chen",
    source: "Direct",
  },
  {
    id: "3",
    campaignId: "1",
    title: "TechCorp Announces Partnership with Major Retailers",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/example3",
    sentiment: "positive",
    reach: 120000,
    publishedAt: new Date("2024-06-08"),
    summary:
      "TechCorp expands distribution network through strategic partnerships. The company aims to make smart home technology more accessible to consumers.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 145000,
    topic: "Business Partnerships",
    author: "Emily Rodriguez",
    source: "Direct",
  },
  {
    id: "4",
    campaignId: "1",
    title: "The Smart Home Market Shows Mixed Results This Quarter",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/example4",
    sentiment: "neutral",
    reach: 95000,
    publishedAt: new Date("2024-06-05"),
    summary:
      "Market analysis shows varied performance across smart home device categories. Some segments show growth while others face challenges.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 110000,
    topic: "Market Analysis",
    author: "David Kim",
    source: "Direct",
  },

  // Wired articles
  {
    id: "5",
    campaignId: "1",
    title: "Smart Home Trends: What to Expect This Summer",
    outlet: "Wired",
    url: "https://wired.com/example",
    sentiment: "neutral",
    reach: 200000,
    publishedAt: new Date("2024-06-20"),
    summary:
      "Feature article mentioning the product among other smart home devices. Industry trends point toward increased adoption of AI-powered home automation.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 240000,
    topic: "Technology Trends",
    author: "Alex Thompson",
    source: "Direct",
  },
  {
    id: "6",
    campaignId: "1",
    title: "The Dark Side of Smart Home Automation",
    outlet: "Wired",
    url: "https://wired.com/example2",
    sentiment: "negative",
    reach: 250000,
    publishedAt: new Date("2024-06-12"),
    summary:
      "Investigation into privacy concerns and potential misuse of smart home data. The article questions whether convenience is worth the privacy trade-offs.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 300000,
    topic: "Privacy & Security",
    author: "Lisa Wang",
    source: "Direct",
  },
  {
    id: "7",
    campaignId: "1",
    title: "How AI is Transforming Home Automation",
    outlet: "Wired",
    url: "https://wired.com/example3",
    sentiment: "positive",
    reach: 180000,
    publishedAt: new Date("2024-06-18"),
    summary:
      "Comprehensive look at AI integration in smart home devices. The article highlights how artificial intelligence is making homes more intelligent and responsive.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 215000,
    topic: "Artificial Intelligence",
    author: "Robert Davis",
    source: "Direct",
  },

  // Forbes articles
  {
    id: "8",
    campaignId: "1",
    title: "TechCorp's Smart Home Strategy: A Case Study",
    outlet: "Forbes",
    url: "https://forbes.com/example",
    sentiment: "positive",
    reach: 300000,
    publishedAt: new Date("2024-06-22"),
    summary:
      "Business analysis of TechCorp's approach to the smart home market. The company's focus on user experience and security is paying dividends.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 350000,
    topic: "Business Strategy",
    author: "Jennifer Smith",
    source: "Direct",
  },
  {
    id: "9",
    campaignId: "1",
    title: "Investment Opportunities in Smart Home Technology",
    outlet: "Forbes",
    url: "https://forbes.com/example2",
    sentiment: "neutral",
    reach: 220000,
    publishedAt: new Date("2024-06-14"),
    summary:
      "Financial analysis of the smart home sector. The article discusses investment potential and market growth projections.",
    mediaType: "Online News",
    month: "June 2024",
    impressions: 260000,
    topic: "Investment",
    author: "Mark Wilson",
    source: "Direct",
  },

  // Social Media posts
  {
    id: "10",
    campaignId: "1",
    title: "Just installed the new TechCorp smart home system! 🤖🏠",
    outlet: "Instagram",
    url: "https://instagram.com/example",
    sentiment: "positive",
    reach: 45000,
    publishedAt: new Date("2024-06-16"),
    summary:
      "Influencer post showing unboxing and setup of the smart home device. Positive first impressions and easy installation process.",
    mediaType: "Social Media",
    month: "June 2024",
    impressions: 52000,
    topic: "Product Review",
    author: "@techreviewer",
    source: "Direct",
  },
  {
    id: "11",
    campaignId: "1",
    title: "Smart home security concerns - what do you think? 🔒",
    outlet: "Twitter",
    url: "https://twitter.com/example",
    sentiment: "negative",
    reach: 32000,
    publishedAt: new Date("2024-06-11"),
    summary:
      "Discussion thread about smart home security risks. Users express concerns about data privacy and potential vulnerabilities.",
    mediaType: "Social Media",
    month: "June 2024",
    impressions: 38000,
    topic: "Security Discussion",
    author: "@securityexpert",
    source: "Direct",
  },
  {
    id: "12",
    campaignId: "1",
    title: "My smart home setup tour 🏠✨",
    outlet: "TikTok",
    url: "https://tiktok.com/example",
    sentiment: "positive",
    reach: 78000,
    publishedAt: new Date("2024-06-19"),
    summary:
      "Viral TikTok video showcasing smart home automation. The video demonstrates various features and gets positive engagement.",
    mediaType: "Social Media",
    month: "June 2024",
    impressions: 95000,
    topic: "Lifestyle",
    author: "@homeautomation",
    source: "Direct",
  },

  // Blog posts
  {
    id: "13",
    campaignId: "1",
    title: "Smart Home Setup Guide: Getting Started with TechCorp",
    outlet: "SmartHomeBlog",
    url: "https://smarthomeblog.com/example",
    sentiment: "positive",
    reach: 25000,
    publishedAt: new Date("2024-06-17"),
    summary:
      "Detailed tutorial on setting up the TechCorp smart home system. Step-by-step guide with tips and best practices.",
    mediaType: "Blog",
    month: "June 2024",
    impressions: 30000,
    topic: "How-to Guide",
    author: "Tech Home Guru",
    source: "Direct",
  },
  {
    id: "14",
    campaignId: "1",
    title: "Comparing Smart Home Ecosystems: TechCorp vs Competitors",
    outlet: "TechReviewBlog",
    url: "https://techreviewblog.com/example",
    sentiment: "neutral",
    reach: 18000,
    publishedAt: new Date("2024-06-13"),
    summary:
      "Comparative analysis of different smart home platforms. TechCorp's system is evaluated alongside major competitors.",
    mediaType: "Blog",
    month: "June 2024",
    impressions: 22000,
    topic: "Product Comparison",
    author: "Tech Reviewer",
    source: "Direct",
  },
  {
    id: "15",
    campaignId: "1",
    title: "The Future of Smart Homes: What's Next?",
    outlet: "FutureTechBlog",
    url: "https://futuretechblog.com/example",
    sentiment: "positive",
    reach: 12000,
    publishedAt: new Date("2024-06-21"),
    summary:
      "Futuristic look at smart home technology evolution. The article discusses upcoming trends and innovations in the space.",
    mediaType: "Blog",
    month: "June 2024",
    impressions: 15000,
    topic: "Future Technology",
    author: "Future Tech Writer",
    source: "Direct",
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
  // Tech YouTubers
  {
    id: "4",
    campaignId: "1",
    name: "Alex TechGuru",
    platform: "youtube",
    followers: 750000,
    engagement: 3.9,
    category: "Technology",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "5",
    campaignId: "1",
    name: "TechWithTina",
    platform: "youtube",
    followers: 320000,
    engagement: 4.8,
    category: "Technology",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "6",
    campaignId: "1",
    name: "GadgetMaster",
    platform: "youtube",
    followers: 180000,
    engagement: 4.1,
    category: "Technology",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  // Fashion influencers on Instagram
  {
    id: "7",
    campaignId: "1",
    name: "StyleByBella",
    platform: "instagram",
    followers: 680000,
    engagement: 5.2,
    category: "Fashion",
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "8",
    campaignId: "1",
    name: "FashionForward_Mia",
    platform: "instagram",
    followers: 890000,
    engagement: 4.7,
    category: "Fashion",
    avatar:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  // Micro-influencers in fitness
  {
    id: "9",
    campaignId: "1",
    name: "FitLifeJenna",
    platform: "instagram",
    followers: 45000,
    engagement: 6.1,
    category: "Fitness",
    avatar:
      "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  {
    id: "10",
    campaignId: "1",
    name: "HealthyHabits_Sam",
    platform: "instagram",
    followers: 67000,
    engagement: 5.8,
    category: "Fitness",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  {
    id: "11",
    campaignId: "1",
    name: "WorkoutWarrior_Kate",
    platform: "youtube",
    followers: 89000,
    engagement: 4.9,
    category: "Fitness",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  // Gaming streamers
  {
    id: "12",
    campaignId: "1",
    name: "ProGamer_Jake",
    platform: "youtube",
    followers: 420000,
    engagement: 4.3,
    category: "Gaming",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "13",
    campaignId: "1",
    name: "GamingQueen_Luna",
    platform: "tiktok",
    followers: 650000,
    engagement: 5.4,
    category: "Gaming",
    avatar:
      "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  // Travel bloggers
  {
    id: "14",
    campaignId: "1",
    name: "WanderlustWill",
    platform: "instagram",
    followers: 52000,
    engagement: 4.6,
    category: "Travel",
    avatar:
      "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  {
    id: "15",
    campaignId: "1",
    name: "AdventureAva",
    platform: "youtube",
    followers: 48000,
    engagement: 4.2,
    category: "Travel",
    avatar:
      "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  // Beauty influencers on TikTok
  {
    id: "16",
    campaignId: "1",
    name: "BeautyByZoe",
    platform: "tiktok",
    followers: 780000,
    engagement: 5.9,
    category: "Beauty",
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "17",
    campaignId: "1",
    name: "MakeupMagic_Aria",
    platform: "tiktok",
    followers: 920000,
    engagement: 6.2,
    category: "Beauty",
    avatar:
      "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  // Food creators
  {
    id: "18",
    campaignId: "1",
    name: "ChefCarlos",
    platform: "youtube",
    followers: 340000,
    engagement: 3.8,
    category: "Food",
    avatar:
      "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: true,
  },
  {
    id: "19",
    campaignId: "1",
    name: "FoodieFinds_Maya",
    platform: "instagram",
    followers: 290000,
    engagement: 4.4,
    category: "Food",
    avatar:
      "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  // Lifestyle influencers under 500k
  {
    id: "20",
    campaignId: "1",
    name: "EverydayElla",
    platform: "instagram",
    followers: 380000,
    engagement: 4.1,
    category: "Lifestyle",
    avatar:
      "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
  },
  {
    id: "21",
    campaignId: "1",
    name: "LifeWithLiam",
    platform: "youtube",
    followers: 420000,
    engagement: 3.6,
    category: "Lifestyle",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    verified: false,
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
