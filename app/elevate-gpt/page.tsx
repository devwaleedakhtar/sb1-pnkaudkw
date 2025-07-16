"use client";

import { useState, useEffect } from "react";
import { Influencer } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { PageHeader } from "@/components/layout/page-header";
import { BriefUpload } from "@/components/elevate-gpt/brief-upload";
import {
  InfluencerSearch,
  SearchParams,
} from "@/components/elevate-gpt/influencer-search";
import { InfluencerGrid } from "@/components/elevate-gpt/influencer-grid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Sparkles, TrendingUp, Users, Zap } from "lucide-react";

export default function ElevateGPT() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    averageEngagement: 0,
    topPlatform: "",
    verifiedCount: 0,
  });

  useEffect(() => {
    loadInfluencers();
  }, []);

  useEffect(() => {
    setFilteredInfluencers(influencers);
    updateSearchStats(influencers);
  }, [influencers]);

  const loadInfluencers = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const data = await api.getInfluencers("1");
      setInfluencers(data);
    } catch (error) {
      console.error("Error loading influencers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateSearchStats = (results: Influencer[]) => {
    if (results.length === 0) {
      setSearchStats({
        totalResults: 0,
        averageEngagement: 0,
        topPlatform: "",
        verifiedCount: 0,
      });
      return;
    }

    const averageEngagement =
      results.reduce((sum, inf) => sum + inf.engagement, 0) / results.length;
    const verifiedCount = results.filter((inf) => inf.verified).length;

    // Find most common platform
    const platformCounts = results.reduce((acc, inf) => {
      acc[inf.platform] = (acc[inf.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPlatform =
      Object.entries(platformCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "";

    setSearchStats({
      totalResults: results.length,
      averageEngagement: Math.round(averageEngagement * 10) / 10,
      topPlatform,
      verifiedCount,
    });
  };

  const handleGenerateQueries = (brief: string, queries: string[]) => {
    console.log("Generated queries from brief:", brief, queries);
    // In a real app, this would use AI to generate search queries
  };

  const handleSearchFromBrief = (query: string) => {
    setLastSearchQuery(query);
    // This would trigger the AI search component
    // For now, we'll just log it
    console.log("Searching from brief:", query);
  };

  const generateMockInfluencersForQuery = (query: string): Influencer[] => {
    const lowerQuery = query.toLowerCase();

    // Generate mock influencers based on query
    const mockInfluencers: Influencer[] = [];

    if (lowerQuery.includes("tech") || lowerQuery.includes("youtube")) {
      mockInfluencers.push(
        {
          id: "mock-tech-1",
          campaignId: "1",
          name: "Alex TechGuru",
          platform: "youtube",
          followers: 750000,
          engagement: 3.8,
          category: "Technology",
          avatar:
            "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: true,
        },
        {
          id: "mock-tech-2",
          campaignId: "1",
          name: "TechSavvy Sam",
          platform: "youtube",
          followers: 420000,
          engagement: 4.2,
          category: "Technology",
          avatar:
            "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: false,
        }
      );
    }

    if (lowerQuery.includes("fashion") || lowerQuery.includes("instagram")) {
      mockInfluencers.push(
        {
          id: "mock-fashion-1",
          campaignId: "1",
          name: "Sophia StyleIcon",
          platform: "instagram",
          followers: 890000,
          engagement: 5.2,
          category: "Fashion",
          avatar:
            "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: true,
        },
        {
          id: "mock-fashion-2",
          campaignId: "1",
          name: "Emma ChicStyle",
          platform: "instagram",
          followers: 340000,
          engagement: 4.8,
          category: "Fashion",
          avatar:
            "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: false,
        }
      );
    }

    if (lowerQuery.includes("fitness") || lowerQuery.includes("micro")) {
      mockInfluencers.push(
        {
          id: "mock-fitness-1",
          campaignId: "1",
          name: "Mike FitnessCoach",
          platform: "instagram",
          followers: 85000,
          engagement: 6.1,
          category: "Fitness",
          avatar:
            "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: false,
        },
        {
          id: "mock-fitness-2",
          campaignId: "1",
          name: "Lisa HealthyLiving",
          platform: "tiktok",
          followers: 120000,
          engagement: 5.8,
          category: "Fitness",
          avatar:
            "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: true,
        }
      );
    }

    if (lowerQuery.includes("gaming") || lowerQuery.includes("streamer")) {
      mockInfluencers.push(
        {
          id: "mock-gaming-1",
          campaignId: "1",
          name: "Tyler GameMaster",
          platform: "youtube",
          followers: 1200000,
          engagement: 4.5,
          category: "Gaming",
          avatar:
            "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: true,
        },
        {
          id: "mock-gaming-2",
          campaignId: "1",
          name: "Alex StreamQueen",
          platform: "tiktok",
          followers: 650000,
          engagement: 5.9,
          category: "Gaming",
          avatar:
            "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
          verified: false,
        }
      );
    }

    if (lowerQuery.includes("travel")) {
      mockInfluencers.push({
        id: "mock-travel-1",
        campaignId: "1",
        name: "Maya Wanderlust",
        platform: "instagram",
        followers: 520000,
        engagement: 4.7,
        category: "Travel",
        avatar:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: true,
      });
    }

    if (lowerQuery.includes("beauty") || lowerQuery.includes("tiktok")) {
      mockInfluencers.push({
        id: "mock-beauty-1",
        campaignId: "1",
        name: "Zoe BeautyGuru",
        platform: "tiktok",
        followers: 780000,
        engagement: 6.3,
        category: "Beauty",
        avatar:
          "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: true,
      });
    }

    if (lowerQuery.includes("food")) {
      mockInfluencers.push({
        id: "mock-food-1",
        campaignId: "1",
        name: "Chef Marco",
        platform: "youtube",
        followers: 380000,
        engagement: 4.1,
        category: "Food",
        avatar:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: false,
      });
    }

    if (lowerQuery.includes("lifestyle")) {
      mockInfluencers.push({
        id: "mock-lifestyle-1",
        campaignId: "1",
        name: "Jessica SmartLiving",
        platform: "instagram",
        followers: 320000,
        engagement: 4.8,
        category: "Lifestyle",
        avatar:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        verified: false,
      });
    }

    return mockInfluencers;
  };

  const handleSearch = async (params: SearchParams) => {
    setSearching(true);
    setLastSearchQuery(params.query);

    try {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let filtered = [...influencers];

      // If this is from an example query, generate mock data
      if (params.query && params.query.length > 0) {
        const mockResults = generateMockInfluencersForQuery(params.query);
        if (mockResults.length > 0) {
          filtered = [...filtered, ...mockResults];
        }
      }

      // Apply query filter
      if (params.query) {
        filtered = filtered.filter(
          (inf) =>
            inf.name.toLowerCase().includes(params.query.toLowerCase()) ||
            inf.category.toLowerCase().includes(params.query.toLowerCase())
        );
      }

      // Apply platform filter
      if (params.platform !== "all") {
        filtered = filtered.filter((inf) => inf.platform === params.platform);
      }

      // Apply category filter
      if (params.category !== "all") {
        filtered = filtered.filter((inf) =>
          inf.category.toLowerCase().includes(params.category.toLowerCase())
        );
      }

      // Apply follower range filter
      filtered = filtered.filter(
        (inf) =>
          inf.followers >= params.minFollowers &&
          inf.followers <= params.maxFollowers
      );

      // Apply engagement filter
      filtered = filtered.filter(
        (inf) => inf.engagement >= params.minEngagement
      );

      // If using broad search, simulate finding more influencers
      if (!params.useInternalDb && params.query) {
        // Add some mock additional influencers for broad search
        const additionalInfluencers: Influencer[] = [
          {
            id: "broad-1",
            campaignId: "1",
            name: "Alex TechGuru",
            platform: "youtube",
            followers: 750000,
            engagement: 3.5,
            category: "Technology",
            avatar:
              "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            verified: true,
          },
          {
            id: "broad-2",
            campaignId: "1",
            name: "Jessica SmartLiving",
            platform: "instagram",
            followers: 320000,
            engagement: 4.8,
            category: "Lifestyle",
            avatar:
              "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            verified: false,
          },
          {
            id: "broad-3",
            campaignId: "1",
            name: "Mike FitnessCoach",
            platform: "tiktok",
            followers: 180000,
            engagement: 6.2,
            category: "Fitness",
            avatar:
              "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            verified: true,
          },
          {
            id: "broad-4",
            campaignId: "1",
            name: "Sarah StyleInfluencer",
            platform: "instagram",
            followers: 95000,
            engagement: 4.1,
            category: "Fashion",
            avatar:
              "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
            verified: false,
          },
        ];

        // Filter additional influencers based on search criteria
        const filteredAdditional = additionalInfluencers.filter((inf) => {
          const matchesQuery =
            !params.query ||
            inf.name.toLowerCase().includes(params.query.toLowerCase()) ||
            inf.category.toLowerCase().includes(params.query.toLowerCase());
          const matchesPlatform =
            params.platform === "all" || inf.platform === params.platform;
          const matchesCategory =
            params.category === "all" ||
            inf.category.toLowerCase().includes(params.category.toLowerCase());
          const matchesFollowers =
            inf.followers >= params.minFollowers &&
            inf.followers <= params.maxFollowers;
          const matchesEngagement = inf.engagement >= params.minEngagement;

          return (
            matchesQuery &&
            matchesPlatform &&
            matchesCategory &&
            matchesFollowers &&
            matchesEngagement
          );
        });

        filtered = [...filtered, ...filteredAdditional];
      }

      setFilteredInfluencers(filtered);
      updateSearchStats(filtered);
    } catch (error) {
      console.error("Error searching influencers:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleExportShortlist = (shortlisted: Influencer[]) => {
    console.log("Exporting shortlist:", shortlisted);

    // Create CSV content
    const csvContent = [
      ["Name", "Platform", "Followers", "Engagement", "Category", "Verified"],
      ...shortlisted.map((inf) => [
        inf.name,
        inf.platform,
        inf.followers.toString(),
        `${inf.engagement}%`,
        inf.category,
        inf.verified ? "Yes" : "No",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `influencer-shortlist-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInfluencers();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="ElevateGPT"
        description="AI-powered influencer discovery and analysis platform"
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
        </div>
      </PageHeader>

      {/* Search Statistics */}
      {searchStats.totalResults > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {searchStats.totalResults}
                  </div>
                  <div className="text-sm text-gray-600">Total Results</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">
                    {searchStats.averageEngagement}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold capitalize">
                    {searchStats.topPlatform}
                  </div>
                  <div className="text-sm text-gray-600">Top Platform</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <div className="text-2xl font-bold text-blue-600">
                    {searchStats.verifiedCount}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Verified Accounts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Last Search Query */}
      {lastSearchQuery && (
        <Card className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span className="text-sm text-gray-700">Last search:</span>
              <Badge
                variant="outline"
                className="bg-white border-pink-200 text-pink-800"
              >
                {lastSearchQuery}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <BriefUpload
        onGenerateQueries={handleGenerateQueries}
        onSearchQuery={handleSearchFromBrief}
        loading={searching}
      />

      <InfluencerSearch onSearch={handleSearch} loading={searching} />

      <InfluencerGrid
        influencers={filteredInfluencers}
        loading={loading || searching}
        onExportShortlist={handleExportShortlist}
      />
    </div>
  );
}
