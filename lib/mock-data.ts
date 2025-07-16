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
      "Deep dive into AI applications in smart home technology. The article praises innovative approaches to machine learning in home automation.",
    mediaType: "Online News",
  },

  // CNN Business articles
  {
    id: "8",
    campaignId: "2",
    title: "Top Holiday Shopping Deals to Watch",
    outlet: "CNN Business",
    url: "https://cnn.com/example",
    sentiment: "positive",
    reach: 500000,
    publishedAt: new Date("2024-11-10"),
    summary:
      "Comprehensive guide featuring RetailMax deals prominently. The article highlights significant savings and exclusive offers for holiday shoppers.",
    mediaType: "Online News",
  },
  {
    id: "9",
    campaignId: "1",
    title: "Tech Stocks Rally on Smart Home Innovation",
    outlet: "CNN Business",
    url: "https://cnn.com/example2",
    sentiment: "positive",
    reach: 350000,
    publishedAt: new Date("2024-06-14"),
    summary:
      "Market analysis showing positive investor sentiment toward smart home technology companies. TechCorp mentioned as a key player in the sector.",
    mediaType: "Online News",
  },
  {
    id: "10",
    campaignId: "1",
    title: "Consumer Electronics Sales Slow Down",
    outlet: "CNN Business",
    url: "https://cnn.com/example3",
    sentiment: "negative",
    reach: 280000,
    publishedAt: new Date("2024-06-07"),
    summary:
      "Report on declining consumer electronics sales affecting smart home device manufacturers. Market challenges impact industry growth projections.",
    mediaType: "Online News",
  },

  // Forbes articles
  {
    id: "11",
    campaignId: "1",
    title: "The Future of Smart Home Technology",
    outlet: "Forbes",
    url: "https://forbes.com/example",
    sentiment: "positive",
    reach: 320000,
    publishedAt: new Date("2024-06-16"),
    summary:
      "Executive perspective on smart home industry trends and future opportunities. The article positions TechCorp as an innovation leader.",
    mediaType: "Online News",
  },
  {
    id: "12",
    campaignId: "1",
    title: "Smart Home Devices: Worth the Investment?",
    outlet: "Forbes",
    url: "https://forbes.com/example2",
    sentiment: "neutral",
    reach: 290000,
    publishedAt: new Date("2024-06-11"),
    summary:
      "Cost-benefit analysis of smart home technology adoption. The article provides balanced perspective on ROI for consumers and businesses.",
    mediaType: "Online News",
  },
  {
    id: "13",
    campaignId: "2",
    title: "Retail Giants Prepare for Holiday Shopping Rush",
    outlet: "Forbes",
    url: "https://forbes.com/example3",
    sentiment: "positive",
    reach: 280000,
    publishedAt: new Date("2024-11-08"),
    summary:
      "Analysis of retail industry preparations for holiday season. RetailMax featured as a company with strong omnichannel strategy.",
    mediaType: "Online News",
  },

  // Reuters articles
  {
    id: "14",
    campaignId: "1",
    title: "Smart Home Device Recall Announced",
    outlet: "Reuters",
    url: "https://reuters.com/example",
    sentiment: "negative",
    reach: 450000,
    publishedAt: new Date("2024-06-09"),
    summary:
      "Breaking news about safety concerns leading to product recall. The incident affects consumer confidence in smart home device security.",
    mediaType: "Online News",
  },
  {
    id: "15",
    campaignId: "1",
    title: "TechCorp Reports Strong Q2 Earnings",
    outlet: "Reuters",
    url: "https://reuters.com/example2",
    sentiment: "positive",
    reach: 380000,
    publishedAt: new Date("2024-06-17"),
    summary:
      "Financial report showing strong performance driven by smart home device sales. The company exceeds analyst expectations for the quarter.",
    mediaType: "Online News",
  },
  {
    id: "16",
    campaignId: "1",
    title: "Smart Home Market Faces Regulatory Scrutiny",
    outlet: "Reuters",
    url: "https://reuters.com/example3",
    sentiment: "negative",
    reach: 320000,
    publishedAt: new Date("2024-06-13"),
    summary:
      "Government agencies investigate data privacy practices in smart home industry. New regulations may impact how companies collect and use consumer data.",
    mediaType: "Online News",
  },

  // Associated Press articles
  {
    id: "17",
    campaignId: "1",
    title: "Smart Home Technology Gains Mainstream Adoption",
    outlet: "Associated Press",
    url: "https://apnews.com/example",
    sentiment: "positive",
    reach: 600000,
    publishedAt: new Date("2024-06-19"),
    summary:
      "Survey data shows increasing consumer acceptance of smart home devices. The technology is moving from early adopters to mainstream market.",
    mediaType: "Online News",
  },
  {
    id: "18",
    campaignId: "1",
    title: "Cybersecurity Threats Target Smart Home Devices",
    outlet: "Associated Press",
    url: "https://apnews.com/example2",
    sentiment: "negative",
    reach: 520000,
    publishedAt: new Date("2024-06-06"),
    summary:
      "Security researchers identify vulnerabilities in popular smart home devices. The findings highlight need for stronger cybersecurity measures.",
    mediaType: "Online News",
  },
  {
    id: "19",
    campaignId: "2",
    title: "Holiday Shopping Season Kicks Off Early",
    outlet: "Associated Press",
    url: "https://apnews.com/example3",
    sentiment: "neutral",
    reach: 480000,
    publishedAt: new Date("2024-11-05"),
    summary:
      "Retailers launch holiday promotions earlier than previous years. Consumer spending patterns show shift toward online shopping platforms.",
    mediaType: "Online News",
  },

  // Recent articles (last week)
  {
    id: "20",
    campaignId: "1",
    title: "Smart Home Innovation Showcased at Tech Conference",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/recent1",
    sentiment: "positive",
    reach: 140000,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    summary:
      "Coverage of latest smart home innovations presented at major tech conference. Industry leaders demonstrate cutting-edge automation technologies.",
    mediaType: "Online News",
  },
  {
    id: "21",
    campaignId: "1",
    title: "Consumer Reports Tests Smart Home Devices",
    outlet: "Wired",
    url: "https://wired.com/recent1",
    sentiment: "neutral",
    reach: 190000,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    summary:
      "Independent testing reveals mixed results for smart home device performance. Some products excel while others fall short of marketing claims.",
    mediaType: "Online News",
  },
  {
    id: "22",
    campaignId: "1",
    title: "Smart Home Market Reaches New Milestone",
    outlet: "Forbes",
    url: "https://forbes.com/recent1",
    sentiment: "positive",
    reach: 310000,
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    summary:
      "Industry analysis shows smart home market surpassing growth projections. Strong consumer demand drives expansion across all device categories.",
    mediaType: "Online News",
  },

  // High reach viral articles
  {
    id: "23",
    campaignId: "1",
    title: "Smart Home Device Goes Viral on Social Media",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/viral1",
    sentiment: "positive",
    reach: 850000,
    publishedAt: new Date("2024-06-21"),
    summary:
      "Social media buzz propels smart home device to viral status. User-generated content showcases creative applications and positive experiences.",
    mediaType: "Online News",
  },
  {
    id: "24",
    campaignId: "1",
    title: "Smart Home Fail: When Technology Goes Wrong",
    outlet: "Wired",
    url: "https://wired.com/viral1",
    sentiment: "negative",
    reach: 920000,
    publishedAt: new Date("2024-06-04"),
    summary:
      "Viral story about smart home device malfunctions causing user frustration. The incident highlights potential reliability issues with new technology.",
    mediaType: "Online News",
  },

  // Podcast mentions
  {
    id: "25",
    campaignId: "1",
    title: "Tech Talk Podcast: Smart Home Revolution",
    outlet: "Tech Talk Podcast",
    url: "https://techtalk.com/episode1",
    sentiment: "positive",
    reach: 75000,
    publishedAt: new Date("2024-06-22"),
    summary:
      "Podcast discussion featuring smart home technology trends and TechCorp's latest innovations. Expert guests provide industry insights.",
    mediaType: "Podcast",
  },
  {
    id: "26",
    campaignId: "1",
    title: "The Future Show: Smart Home Skepticism",
    outlet: "The Future Show",
    url: "https://futureshow.com/episode2",
    sentiment: "negative",
    reach: 45000,
    publishedAt: new Date("2024-06-03"),
    summary:
      "Podcast episode questioning the value and necessity of smart home technology. Hosts express skepticism about privacy and security concerns.",
    mediaType: "Podcast",
  },

  // Blog posts
  {
    id: "27",
    campaignId: "1",
    title: "My Smart Home Journey: A Personal Review",
    outlet: "Tech Blogger Pro",
    url: "https://techblogger.com/review1",
    sentiment: "positive",
    reach: 25000,
    publishedAt: new Date("2024-06-23"),
    summary:
      "Personal blog post detailing positive experience with smart home setup. The author recommends TechCorp devices for their reliability.",
    mediaType: "Blog",
  },
  {
    id: "28",
    campaignId: "1",
    title: "Smart Home Devices: Overhyped or Undervalued?",
    outlet: "Digital Life Blog",
    url: "https://digitallife.com/analysis1",
    sentiment: "neutral",
    reach: 18000,
    publishedAt: new Date("2024-06-01"),
    summary:
      "Balanced analysis of smart home technology adoption and market trends. The blog post examines both benefits and limitations of current devices.",
    mediaType: "Blog",
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
