"use client";

import { useState, useEffect } from "react";
import { DashboardStats, Activity } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { useCampaign } from "@/app/layout";
import { PageHeader } from "@/components/layout/page-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  MessageSquare,
  Zap,
  Calendar,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { selectedCampaign } = useCampaign();
  const [stats, setStats] = useState<DashboardStats>({
    totalReach: 0,
    mediaItems: 0,
    influencers: 0,
    socialPosts: 0,
    sentiment: { positive: 0, neutral: 0, negative: 0 },
  });
  const [activities, setActivities] = useState<Activity[]>([]);
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
      const [statsData, activitiesData] = await Promise.all([
        api.getDashboardStats(campaignId),
        api.getActivities(campaignId),
      ]);

      setStats(statsData);
      setActivities(activitiesData);
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                        {new Date(
                          selectedCampaign.endDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <StatsCards stats={stats} loading={loading} />

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
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-pink-500" />
                      <span>Performance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-1 h-6 bg-pink-500 rounded-full" />
                          <div className="text-2xl font-bold text-gray-900">
                            {stats.totalReach.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">Total Reach</div>
                      </div>
                      <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-1 h-6 bg-gray-300 rounded-full" />
                          <div className="text-2xl font-bold text-gray-900">
                            {stats.mediaItems}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">Media Items</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <SentimentChart stats={stats} loading={loading} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityFeed activities={activities} loading={loading} />
          </TabsContent>
        </Tabs>
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
