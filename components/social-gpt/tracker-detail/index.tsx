"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SocialPost, SocialTracker } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { mockSocialTrackers } from "@/lib/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { ContentGrid } from "@/components/social-gpt/content-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  RefreshCw,
  Download,
  Calendar,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share,
  TrendingUp,
  TrendingDown,
  Activity,
  Filter,
  Search,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { TikTokIcon } from "@/components/social-gpt/tiktok-icon";
import { formatDistanceToNow, format } from "date-fns";

export default function TrackerDetailComponent() {
  const params = useParams();
  const router = useRouter();
  const trackerId = params.id as string;

  const [tracker, setTracker] = useState<SocialTracker | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "engagement" | "reach">("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<"all" | "7d" | "30d" | "90d">(
    "all"
  );

  useEffect(() => {
    loadTrackerData();
  }, [trackerId]);

  useEffect(() => {
    applyFilters();
  }, [posts, platformFilter, sortBy, searchQuery, dateRange]);

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      const [trackerData, postsData] = await Promise.all([
        api.getSocialTracker(trackerId),
        api.getSocialPosts("1"), // In real app, this would filter by trackerId
      ]);

      setTracker(trackerData);
      // Filter posts by trackerId
      const trackerPosts = postsData.filter(
        (post) => post.trackerId === trackerId
      );
      setPosts(trackerPosts);
    } catch (error) {
      console.error("Error loading tracker data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTrackerData();
    } finally {
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...posts];

    // Platform filter
    if (platformFilter !== "all") {
      filtered = filtered.filter((post) => post.platform === platformFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.hashtags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Date range filter
    if (dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();

      switch (dateRange) {
        case "7d":
          cutoff.setDate(now.getDate() - 7);
          break;
        case "30d":
          cutoff.setDate(now.getDate() - 30);
          break;
        case "90d":
          cutoff.setDate(now.getDate() - 90);
          break;
      }

      filtered = filtered.filter((post) => post.publishedAt >= cutoff);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "engagement":
          const aEngagement = a.likes + a.comments + a.shares;
          const bEngagement = b.likes + b.comments + b.shares;
          return bEngagement - aEngagement;
        case "reach":
          return b.reach - a.reach;
        default:
          return 0;
      }
    });

    setFilteredPosts(filtered);
  };

  const getStats = () => {
    const totalPosts = filteredPosts.length;
    const totalReach = filteredPosts.reduce((sum, post) => sum + post.reach, 0);
    const totalEngagement = filteredPosts.reduce(
      (sum, post) => sum + post.likes + post.comments + post.shares,
      0
    );
    const avgEngagement = totalPosts > 0 ? totalEngagement / totalPosts : 0;

    // Platform distribution
    const platformCounts = filteredPosts.reduce((acc, post) => {
      acc[post.platform] = (acc[post.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlatform =
      Object.entries(platformCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "";

    return {
      totalPosts,
      totalReach,
      totalEngagement,
      avgEngagement,
      topPlatform,
      platformCounts,
    };
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return Instagram;
      case "twitter":
        return Twitter;
      case "tiktok":
        return TikTokIcon;
      case "youtube":
        return Youtube;
      default:
        return Instagram;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "text-pink-500";
      case "twitter":
        return "text-blue-500";
      case "tiktok":
        return "text-purple-500";
      case "youtube":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getStatusColor = (status: SocialTracker["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportData = () => {
    if (!tracker) return;

    const csvContent = [
      [
        "Platform",
        "Author",
        "Content",
        "Likes",
        "Comments",
        "Shares",
        "Reach",
        "Published At",
      ],
      ...filteredPosts.map((post) => [
        post.platform,
        post.author,
        post.content.replace(/,/g, ";"), // Replace commas to avoid CSV issues
        post.likes.toString(),
        post.comments.toString(),
        post.shares.toString(),
        post.reach.toString(),
        format(post.publishedAt, "yyyy-MM-dd HH:mm:ss"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tracker.name}-results-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tracker) {
    return (
      <div className="max-w-7xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tracker Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The tracker you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => router.push("/social-gpt")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to SocialGPT
        </Button>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title={tracker.name}
        description={`Social media tracking results • ${stats.totalPosts} posts found`}
      >
        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(tracker.status)}>
            {tracker.status}
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => router.push("/social-gpt")}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </PageHeader>

      {/* Tracker Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {tracker.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hashtags</h3>
              <div className="flex flex-wrap gap-2">
                {tracker.hashtags.map((hashtag) => (
                  <Badge key={hashtag} variant="outline">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Platforms</h3>
              <div className="flex space-x-2">
                {tracker.platforms.map((platform) => {
                  const Icon = getPlatformIcon(platform);
                  return (
                    <div key={platform} className="flex items-center">
                      <Icon
                        className={`h-5 w-5 ${getPlatformColor(platform)}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                <Calendar className="h-4 w-4 inline mr-1" />
                {format(tracker.startDate, "MMM d, yyyy")} -{" "}
                {format(tracker.endDate, "MMM d, yyyy")}
              </span>
              <span>
                Created{" "}
                {formatDistanceToNow(tracker.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPosts}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.totalReach)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.totalEngagement)}
                </p>
              </div>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Platform</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {stats.topPlatform}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={(value) => setDateRange(value as typeof dateRange)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as typeof sortBy)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Most Recent</SelectItem>
                <SelectItem value="engagement">Most Engaging</SelectItem>
                <SelectItem value="reach">Highest Reach</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setPlatformFilter("all");
                setDateRange("all");
                setSortBy("date");
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <ContentGrid posts={filteredPosts} loading={false} />
    </div>
  );
}
