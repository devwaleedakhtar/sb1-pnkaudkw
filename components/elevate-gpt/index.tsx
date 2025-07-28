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
import { ManualFilterAdjustment } from "@/components/elevate-gpt/manual-filter-adjustment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Upload,
  FileText,
  X,
  Loader2,
  Star,
  Download,
} from "lucide-react";

export default function ElevateGPTComponent() {
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
  const [showManualAdjustment, setShowManualAdjustment] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleToggleInternalDb = (enabled: boolean) => {
    setCurrentFilters((prev) => ({ ...prev, useInternalDb: enabled }));
  };

  const handleManualAdjustment = () => {
    setShowManualAdjustment(true);
  };

  const handleSaveFilterFromPreview = () => {
    setShowSaveDialog(true);
  };

  const handleSaveFilterDialog = () => {
    if (!filterName.trim()) return;

    handleSaveFilter(
      filterName.trim(),
      "AI-generated influencer filter",
      currentQuery,
      currentFilters
    );
    setShowSaveDialog(false);
    setFilterName("");
  };

  const handleManualAdjustmentSave = (adjustedFilters: InfluencerFilters) => {
    setCurrentFilters(adjustedFilters);
    setShowManualAdjustment(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcessUploads = async () => {
    if (uploadedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically process the files and add them to your database
      console.log("Processing uploaded files:", uploadedFiles);

      // Clear uploaded files after processing
      setUploadedFiles([]);
    } catch (error) {
      console.error("Error processing uploads:", error);
    } finally {
      setIsUploading(false);
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

  const getResultsTitle = () => {
    return `Search Results: "${currentQuery}"`;
  };

  const getResultsDescription = () => {
    return `${influencers.length} influencers found with active filters`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Elevate"
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
            <TabsList className="grid w-full grid-cols-3">
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
              <TabsTrigger value="internal" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Internal Database
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

            <TabsContent value="internal" className="h-full mt-4">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Internal Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Your Data
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add your own influencer data to the internal database.
                      Supported formats: CSV, Excel (.xlsx, .xls)
                    </p>

                    <div className="space-y-4">
                      <div>
                        <input
                          type="file"
                          multiple
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Files
                        </label>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">
                            Selected Files:
                          </h4>
                          <div className="space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <FileText className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFile(index)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={handleProcessUploads}
                            disabled={isUploading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Process Files
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Database Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Database Features:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-500" />
                          <span>
                            View influencers who have worked with your campaigns
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>
                            Track collaboration history and performance
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>Manage internal ratings and notes</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-purple-500" />
                          <span>Export collaboration data</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Users className="h-5 w-5 mb-2" />
                      <span className="text-sm">View All Influencers</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <TrendingUp className="h-5 w-5 mb-2" />
                      <span className="text-sm">Performance Report</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <Download className="h-5 w-5 mb-2" />
                      <span className="text-sm">Export Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Filter Builder - 25% width */}
        <div className="lg:col-span-1">
          <FilterBuildingPreview
            currentFilters={currentFilters}
            isBuilding={isBuilding}
            lastMessage={lastMessage}
            onRunSearch={() => handleRunSearch(currentFilters, currentQuery)}
            onAdjust={handleManualAdjustment}
            onSave={handleSaveFilterFromPreview}
            onToggleInternalDb={handleToggleInternalDb}
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

      {/* Manual Filter Adjustment Modal */}
      {showManualAdjustment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ManualFilterAdjustment
            currentFilters={currentFilters}
            onSave={handleManualAdjustmentSave}
            onCancel={() => setShowManualAdjustment(false)}
          />
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Save Filter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="filterName">Filter Name</Label>
                <Input
                  id="filterName"
                  placeholder="Enter filter name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSaveFilterDialog();
                    }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveFilterDialog} className="flex-1">
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
