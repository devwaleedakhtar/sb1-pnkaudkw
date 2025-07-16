"use client";

import { useState, useEffect } from "react";
import {
  Influencer,
  InfluencerFilters,
  SavedInfluencerFilter,
} from "@/lib/types";
import { api } from "@/lib/mock-api";
import { MockAIChat } from "@/lib/mock-ai-chat";
import { PageHeader } from "@/components/layout/page-header";
import { ChatInterface } from "@/components/elevate-gpt/chat-interface";
import { SavedFilters } from "@/components/elevate-gpt/saved-filters";
import { InfluencerGrid } from "@/components/elevate-gpt/influencer-grid";
import { FilterBuildingPreview } from "@/components/elevate-gpt/filter-building-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Bookmark,
  Search,
  Sparkles,
  RefreshCw,
  Users,
  TrendingUp,
  Zap,
  Database,
  Grid3X3,
  List,
} from "lucide-react";

export default function ElevateGPT() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<InfluencerFilters>({
    platform: "all",
    category: "all",
    minFollowers: 1000,
    maxFollowers: 10000000,
    minEngagement: 1,
    verified: false,
    useInternalDb: true,
  });
  const [savedFilters, setSavedFilters] = useState<SavedInfluencerFilter[]>([]);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isBuilding, setIsBuilding] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [searchStats, setSearchStats] = useState({
    totalResults: 0,
    averageEngagement: 0,
    topPlatform: "",
    verifiedCount: 0,
  });

  const aiChat = MockAIChat.getInstance();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Load saved filters only, no default influencers
      const filters = aiChat.getSavedInfluencerFilters();
      setSavedFilters(filters);
    } catch (error) {
      console.error("Error loading initial data:", error);
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

  const handleFiltersGenerated = (
    filters: InfluencerFilters,
    query: string
  ) => {
    setCurrentFilters(filters);
    setCurrentQuery(query);
    setLastMessage(query);
    setIsBuilding(true);

    // Stop building after a delay
    setTimeout(() => {
      setIsBuilding(false);
    }, 4000);
  };

  const handleRunSearch = async (filters: InfluencerFilters, query: string) => {
    setSearching(true);
    setCurrentFilters(filters);
    setCurrentQuery(query);
    setHasActiveSearch(true);

    try {
      // Convert InfluencerFilters to SearchParams for API compatibility
      const searchParams = {
        query,
        platform: filters.platform,
        category: filters.category,
        minFollowers: filters.minFollowers,
        maxFollowers: filters.maxFollowers,
        minEngagement: filters.minEngagement,
        useInternalDb: filters.useInternalDb,
      };

      const data = await api.searchInfluencers("all", searchParams);
      setInfluencers(data);
      updateSearchStats(data);
    } catch (error) {
      console.error("Error running search:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleSaveFilter = (
    name: string,
    description: string,
    query: string,
    filters: InfluencerFilters
  ) => {
    const savedFilter = aiChat.saveInfluencerFilter(
      name,
      description,
      query,
      filters
    );
    setSavedFilters((prev) => [...prev, savedFilter]);
  };

  const handleRunSavedFilter = (filter: SavedInfluencerFilter) => {
    handleRunSearch(filter.filters, filter.query);
  };

  const handleDeleteSavedFilter = (id: string) => {
    const success = aiChat.deleteSavedInfluencerFilter(id);
    if (success) {
      setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleRefreshResults = async () => {
    if (hasActiveSearch) {
      await handleRunSearch(currentFilters, currentQuery);
    }
    // No refresh action if no active search
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

  const getResultsTitle = () => {
    return `Search Results: "${currentQuery}"`;
  };

  const getResultsDescription = () => {
    return `${influencers.length} influencers found with active filters`;
  };

  return (
    <div className="space-y-6">
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
            onClick={handleRefreshResults}
            disabled={searching}
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${searching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </PageHeader>

      {/* Top Section - Chat and Filter Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat & Saved Filters - 75% width */}
        <div className="lg:col-span-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                AI Chat
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Saved
                {savedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {savedFilters.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="h-full mt-4">
              <ChatInterface
                onFiltersGenerated={handleFiltersGenerated}
                onSaveFilter={handleSaveFilter}
                onRunSearch={handleRunSearch}
              />
            </TabsContent>

            <TabsContent value="saved" className="h-full mt-4">
              <SavedFilters
                savedFilters={savedFilters}
                onRunFilter={handleRunSavedFilter}
                onDeleteFilter={handleDeleteSavedFilter}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Filter Builder - 25% width */}
        <div className="lg:col-span-1">
          <FilterBuildingPreview
            currentFilters={currentFilters}
            isBuilding={isBuilding}
            lastMessage={lastMessage}
          />
        </div>
      </div>

      {/* Results Section - Only show when there's an active search */}
      {hasActiveSearch && (
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {getResultsTitle()}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {getResultsDescription()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  Active Search
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshResults}
                  disabled={searching}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${searching ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-900 mb-2">
                Active Filters:
              </div>
              <div className="flex flex-wrap gap-2">
                {currentFilters.platform !== "all" && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {currentFilters.platform}
                  </Badge>
                )}
                {currentFilters.category !== "all" && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {currentFilters.category}
                  </Badge>
                )}
                {(currentFilters.minFollowers > 1000 ||
                  currentFilters.maxFollowers < 10000000) && (
                  <Badge variant="outline" className="text-xs">
                    {currentFilters.minFollowers >= 1000000
                      ? `${(currentFilters.minFollowers / 1000000).toFixed(1)}M`
                      : `${(currentFilters.minFollowers / 1000).toFixed(0)}K`}
                    {" - "}
                    {currentFilters.maxFollowers >= 1000000
                      ? `${(currentFilters.maxFollowers / 1000000).toFixed(1)}M`
                      : `${(currentFilters.maxFollowers / 1000).toFixed(0)}K`}
                    {" followers"}
                  </Badge>
                )}
                {currentFilters.minEngagement > 1 && (
                  <Badge variant="outline" className="text-xs">
                    {currentFilters.minEngagement}%+ engagement
                  </Badge>
                )}
                {currentFilters.verified && (
                  <Badge variant="outline" className="text-xs">
                    Verified only
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {currentFilters.useInternalDb
                    ? "Internal DB"
                    : "Broad Search"}
                </Badge>
              </div>
            </div>
          </div>
          <div className="p-6">
            <InfluencerGrid
              influencers={influencers}
              loading={loading || searching}
              onExportShortlist={handleExportShortlist}
            />
          </div>
        </div>
      )}
    </div>
  );
}
