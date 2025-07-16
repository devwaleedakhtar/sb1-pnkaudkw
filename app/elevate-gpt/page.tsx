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

  const handleSearch = async (params: SearchParams) => {
    console.log("handleSearch called with params:", params);
    setSearching(true);
    setLastSearchQuery(params.query);

    try {
      // Use the new search API
      const results = await api.searchInfluencers("1", params);
      console.log("Search results:", results);
      setFilteredInfluencers(results);
      updateSearchStats(results);
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
