"use client";

import { useState, useEffect, useRef } from "react";
import { MediaResult, SavedFilter, MediaFilters } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { MockAIChat } from "@/lib/mock-ai-chat";
import { PageHeader } from "@/components/layout/page-header";
import { ChatInterface } from "@/components/publicity-gpt/chat-interface";
import { SavedFilters } from "@/components/publicity-gpt/saved-filters";
import { ResultsDisplay } from "@/components/publicity-gpt/results-display";
import { FilterBuildingPreview } from "@/components/publicity-gpt/filter-building-preview";
import { ManualFilterAdjustment } from "@/components/publicity-gpt/manual-filter-adjustment";
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
  Database,
  Grid3X3,
  List,
} from "lucide-react";

export default function PublicityGPT() {
  const [mediaResults, setMediaResults] = useState<MediaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<MediaFilters>({
    dateRange: { start: "", end: "" },
    mediaTypes: [],
    sentiment: [],
    outlets: [],
    minReach: 0,
  });
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isBuilding, setIsBuilding] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [showManualAdjustment, setShowManualAdjustment] = useState(false);

  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const aiChat = MockAIChat.getInstance();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Load default media results
      const data = await api.getMediaResults("1");
      setMediaResults(data);

      // Load saved filters
      const filters = aiChat.getSavedFilters();
      setSavedFilters(filters);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersGenerated = (filters: MediaFilters, query: string) => {
    setCurrentFilters(filters);
    setCurrentQuery(query);
    setLastMessage(query);
    setIsBuilding(true);

    // Stop building after a delay
    setTimeout(() => {
      setIsBuilding(false);
    }, 4000);
  };

  const handleRunSearch = async (filters: MediaFilters, query: string) => {
    setSearching(true);
    setCurrentFilters(filters);
    setCurrentQuery(query);
    setHasActiveSearch(true);

    try {
      const data = await api.getMediaResults("1", filters, query);
      setMediaResults(data);

      // Auto-scroll to results section
      setTimeout(() => {
        if (resultsSectionRef.current) {
          resultsSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
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
    filters: MediaFilters
  ) => {
    const savedFilter = aiChat.saveFilter(name, description, query, filters);
    setSavedFilters((prev) => [...prev, savedFilter]);
  };

  const handleRunSavedFilter = (filter: SavedFilter) => {
    handleRunSearch(filter.filters, filter.query);
  };

  const handleDeleteSavedFilter = (id: string) => {
    const success = aiChat.deleteSavedFilter(id);
    if (success) {
      setSavedFilters((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleRefreshResults = async () => {
    if (hasActiveSearch) {
      await handleRunSearch(currentFilters, currentQuery);
    } else {
      await loadInitialData();
    }
  };

  const handleManualAdjustment = () => {
    setShowManualAdjustment(true);
  };

  const handleManualFiltersChange = (filters: MediaFilters) => {
    setCurrentFilters(filters);
  };

  const handleManualSave = () => {
    setShowManualAdjustment(false);
  };

  const handleManualRunSearch = () => {
    handleRunSearch(currentFilters, currentQuery);
    setShowManualAdjustment(false);
  };

  const getResultsTitle = () => {
    if (hasActiveSearch) {
      return `Search Results: "${currentQuery}"`;
    }
    return "All Media Coverage";
  };

  const getResultsDescription = () => {
    if (hasActiveSearch) {
      const filterCount = Object.values(currentFilters)
        .flat()
        .filter(Boolean).length;
      return `${mediaResults.length} results found with ${filterCount} active searches`;
    }
    return `${mediaResults.length} total media mentions`;
  };

  if (showManualAdjustment) {
    return (
      <ManualFilterAdjustment
        filters={currentFilters}
        onFiltersChange={handleManualFiltersChange}
        onSave={handleManualSave}
        onRunSearch={handleManualRunSearch}
        onClose={() => setShowManualAdjustment(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Publicity"
        description="AI-powered media monitoring and analysis"
      />

      {/* Top Section - Chat and Search Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat & Saved Searches - 75% width */}
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
                currentFilters={currentFilters}
                currentQuery={currentQuery}
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

        {/* Search Builder - 25% width */}
        <div className="lg:col-span-1">
          <FilterBuildingPreview
            currentFilters={currentFilters}
            isBuilding={isBuilding}
            lastMessage={lastMessage}
            onRunSearch={handleRunSearch}
            onSaveFilter={handleSaveFilter}
            onAdjust={handleManualAdjustment}
            currentQuery={currentQuery}
            searching={searching}
          />
        </div>
      </div>

      {/* Bottom Section - Results (Full width, only shown when search is active) */}
      {hasActiveSearch && (
        <div className="mt-6" ref={resultsSectionRef}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    {getResultsTitle()}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {getResultsDescription()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveSearch && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Search className="h-3 w-3" />
                      Active Search
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      <List className="h-4 w-4 mr-1" />
                      Table
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4 mr-1" />
                      Grid
                    </Button>
                  </div>
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

              {/* Active Searches Display */}
              {hasActiveSearch && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 mb-2">
                    Active Searches:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentFilters.dateRange.start && (
                      <Badge variant="outline" className="text-xs">
                        From{" "}
                        {new Date(
                          currentFilters.dateRange.start
                        ).toLocaleDateString()}
                      </Badge>
                    )}
                    {currentFilters.mediaTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                    {currentFilters.sentiment.map((sentiment) => (
                      <Badge
                        key={sentiment}
                        variant="outline"
                        className="text-xs"
                      >
                        {sentiment}
                      </Badge>
                    ))}
                    {currentFilters.outlets.map((outlet) => (
                      <Badge key={outlet} variant="outline" className="text-xs">
                        {outlet}
                      </Badge>
                    ))}
                    {currentFilters.minReach > 0 && (
                      <Badge variant="outline" className="text-xs">
                        Min reach: {currentFilters.minReach.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <ResultsDisplay
                results={mediaResults}
                loading={loading || searching}
                viewMode={viewMode}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
