"use client";

import { useState, useEffect } from "react";
import { DashboardStats, Activity, SocialTracker } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { useCampaign } from "@/app/layout";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  RefreshCw,
  Users,
  MessageSquare,
  Zap,
  Calendar,
  Target,
  Search,
  Activity as ActivityIcon,
  Pause,
  Play,
  TrendingUp,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface TrackerStats {
  totalTrackers: number;
  activeTrackers: number;
  pausedTrackers: number;
  totalTracks: number;
}

interface SearchStats {
  totalSearches: number;
  activeSearches: number;
  recentSearches: number;
}

export default function DashboardComponent() {
  const { selectedCampaign } = useCampaign();
  const [stats, setStats] = useState<DashboardStats>({
    totalReach: 0,
    mediaItems: 0,
    influencers: 0,
    socialPosts: 0,
    sentiment: { positive: 0, neutral: 0, negative: 0 },
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [trackers, setTrackers] = useState<SocialTracker[]>([]);
  const [trackerStats, setTrackerStats] = useState<TrackerStats>({
    totalTrackers: 0,
    activeTrackers: 0,
    pausedTrackers: 0,
    totalTracks: 0,
  });
  const [searchStats, setSearchStats] = useState<SearchStats>({
    totalSearches: 0,
    activeSearches: 0,
    recentSearches: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedCampaign) {
      loadCampaignData(selectedCampaign.id);
    } else {
      setLoading(false);
    }
  }, [selectedCampaign]);

  const loadCampaignData = async (campaignId: string) => {
    try {
      setLoading(true);
      const [statsData, activitiesData, trackersData] = await Promise.all([
        api.getDashboardStats(campaignId),
        api.getActivities(campaignId),
        api.getSocialTrackers(campaignId),
      ]);

      setStats(statsData);
      setActivities(activitiesData);
      setTrackers(trackersData);

      // Calculate tracker stats
      const totalTrackers = trackersData.length;
      const activeTrackers = trackersData.filter(
        (t) => t.status === "active"
      ).length;
      const pausedTrackers = trackersData.filter(
        (t) => t.status === "paused"
      ).length;
      const totalTracks = trackersData.reduce(
        (sum, tracker) => sum + tracker.postsCount,
        0
      );

      setTrackerStats({
        totalTrackers,
        activeTrackers,
        pausedTrackers,
        totalTracks,
      });

      // Mock search stats (in a real app, this would come from the API)
      setSearchStats({
        totalSearches: 15,
        activeSearches: 8,
        recentSearches: 3,
      });
    } catch (error) {
      console.error("Error loading campaign data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!selectedCampaign) return;

    setRefreshing(true);
    try {
      await loadCampaignData(selectedCampaign.id);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4 text-green-600" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case "completed":
        return <Eye className="h-4 w-4 text-gray-600" />;
      default:
        return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const quickActions = [
    {
      title: "Create Campaign",
      description: "Launch a new marketing campaign",
      href: "/campaigns/new",
      icon: Plus,
    },
    {
      title: "Find Influencers",
      description: "Discover perfect brand ambassadors",
      href: "/elevate-gpt",
      icon: Users,
    },
    {
      title: "Track Social Media",
      description: "Monitor brand mentions and trends",
      href: "/social-gpt",
      icon: MessageSquare,
    },
    {
      title: "Media Coverage",
      description: "Find relevant media opportunities",
      href: "/publicity-gpt",
      icon: Zap,
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "search",
      title: "Smart home security review",
      description: "TechCrunch • News",
      timestamp: new Date("2024-06-20T14:30:00"),
      status: "completed",
    },
    {
      id: "2",
      type: "search",
      title: "Product unboxing video",
      description: "Instagram • Social Media",
      timestamp: new Date("2024-06-20T12:15:00"),
      status: "completed",
    },
    {
      id: "3",
      type: "search",
      title: "Market analysis report",
      description: "Wired • Article",
      timestamp: new Date("2024-06-20T10:45:00"),
      status: "completed",
    },
    {
      id: "4",
      type: "search",
      title: "Customer testimonial",
      description: "Twitter • Social Media",
      timestamp: new Date("2024-06-19T16:20:00"),
      status: "completed",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Dashboard"
        description={
          selectedCampaign
            ? `Campaign: ${selectedCampaign.name}`
            : "Select a campaign to view dashboard"
        }
      >
        <Button
          onClick={handleRefresh}
          disabled={refreshing || !selectedCampaign}
          variant="outline"
          className="border-gray-300 hover:border-gray-400"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white">
          <Link href="/campaigns/new">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </Button>
      </PageHeader>

      {selectedCampaign ? (
        <div className="space-y-6">
          {/* Campaign Info Card */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-12 bg-pink-500 rounded-full" />
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {selectedCampaign.name}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {selectedCampaign.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getStatusColor(
                        selectedCampaign.status
                      )}`}
                    />
                    <Badge variant="secondary" className="capitalize">
                      {selectedCampaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date(
                        selectedCampaign.startDate
                      ).toLocaleDateString()}{" "}
                      -{" "}
                      {new Date(selectedCampaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tracker Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Trackers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {trackerStats.totalTrackers}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ActivityIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Paused Trackers
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {trackerStats.pausedTrackers}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Pause className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Searches
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {searchStats.totalSearches}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Search className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Searches
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {searchStats.activeSearches}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Search className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Feed Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trackers Feed */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ActivityIcon className="h-5 w-5 text-pink-500" />
                  <span>Recent Tracker Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackers.slice(0, 5).map((tracker) => (
                    <div
                      key={tracker.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(tracker.status)}
                        <div>
                          <p className="font-medium text-gray-900">
                            {tracker.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {tracker.postsCount} posts •{" "}
                            {tracker.totalReach.toLocaleString()} reach
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {tracker.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Searches Feed */}
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-pink-500" />
                  <span>Recent Search Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities
                    .filter((activity) => activity.type === "search")
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Search className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-pink-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={action.title} href={action.href}>
                    <Card className="h-full hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-200 bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-1 h-8 rounded-full bg-pink-500" />
                          <action.icon className="h-4 w-4 text-gray-400" />
                          <h3 className="font-semibold text-gray-900">
                            {action.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-16 bg-white border border-gray-200">
          <CardContent>
            <div className="w-16 h-16 mx-auto mb-6 bg-pink-500 rounded-full flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Campaign Selected
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Select a campaign from the sidebar or create your first campaign
              to get started with AI-powered marketing insights.
            </p>
            <Button
              asChild
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Link href="/campaigns/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
