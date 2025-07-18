"use client";

import { useState, useEffect } from "react";
import { SocialPost, SocialTracker } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { PageHeader } from "@/components/layout/page-header";
import { TrackerList } from "@/components/social-gpt/tracker-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  RefreshCw,
  Target,
  Eye,
  MessageCircle,
  Heart,
  Activity,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SocialGPT() {
  const router = useRouter();
  const [trackers, setTrackers] = useState<SocialTracker[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const [trackersData, postsData] = await Promise.all([
        api.getSocialTrackers("1"),
        api.getSocialPosts("1"),
      ]);
      setTrackers(trackersData);
      setSocialPosts(postsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleStatusChange = async (
    trackerId: string,
    status: SocialTracker["status"]
  ) => {
    try {
      await api.updateSocialTracker(trackerId, { status });
      setTrackers((prev) =>
        prev.map((t) => (t.id === trackerId ? { ...t, status } : t))
      );
    } catch (error) {
      console.error("Error updating tracker status:", error);
    }
  };

  const handleDelete = async (trackerId: string) => {
    // In a real app, this would call an API to delete the tracker
    setTrackers((prev) => prev.filter((t) => t.id !== trackerId));
  };

  const handleViewResults = (trackerId: string) => {
    router.push(`/social-gpt/trackers/${trackerId}`);
  };

  const getOverallStats = () => {
    const totalPosts = socialPosts.length;
    const totalReach = socialPosts.reduce((sum, post) => sum + post.reach, 0);
    const totalEngagement = socialPosts.reduce(
      (sum, post) => sum + post.likes + post.shares + post.comments,
      0
    );
    const activeTrackers = trackers.filter((t) => t.status === "active").length;

    // Platform distribution
    const platformCounts = socialPosts.reduce((acc, post) => {
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
      activeTrackers,
      topPlatform,
      avgEngagement: totalPosts > 0 ? totalEngagement / totalPosts : 0,
    };
  };

  const getRecentActivity = () => {
    return socialPosts
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, 5);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const stats = getOverallStats();
  const recentActivity = getRecentActivity();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Social"
        description="AI-powered social media monitoring and analytics platform"
      >
        <div className="flex items-center space-x-3">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Link href="/social-gpt/trackers/new">
              <Plus className="h-4 w-4 mr-2" />
              New Tracker
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="trackers" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Trackers ({trackers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Recent Activity</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Trackers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeTrackers}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-pink-500" />
                </div>
              </CardContent>
            </Card>

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
                  <Heart className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5 text-pink-500" />
                  <span>Quick Start</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Get started with AI-powered social media monitoring
                </p>
                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
                    <Link href="/social-gpt/trackers/new">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create AI Tracker
                    </Link>
                  </Button>
                  <p className="text-xs text-gray-500">
                    Describe what you want to track in natural language
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span>Performance Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top Platform</span>
                    <span className="text-sm font-semibold capitalize">
                      {stats.topPlatform}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Avg Engagement
                    </span>
                    <span className="text-sm font-semibold">
                      {formatNumber(stats.avgEngagement)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Active Monitoring
                    </span>
                    <span className="text-sm font-semibold">
                      {stats.activeTrackers} trackers
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <span>Recent Activity</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("activity")}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">@{post.author}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {post.content}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {post.platform}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNumber(post.reach)} reach
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trackers" className="space-y-6">
          {trackers.length === 0 && !loading ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                No Social Trackers
              </h2>
              <p className="text-gray-600 mb-6">
                Create your first AI-powered social media tracker to start
                monitoring
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <Link href="/social-gpt/trackers/new">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create AI Tracker
                </Link>
              </Button>
            </div>
          ) : (
            <TrackerList
              trackers={trackers}
              loading={loading}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onViewResults={handleViewResults}
            />
          )}
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <span>Recent Social Media Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium">@{post.author}</span>
                          <Badge variant="outline" className="text-xs">
                            {post.platform}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-2">{post.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1" />
                            {formatNumber(post.likes)}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {formatNumber(post.comments)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatNumber(post.reach)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
