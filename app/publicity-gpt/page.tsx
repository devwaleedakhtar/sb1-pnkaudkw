"use client";

import { useState, useEffect } from "react";
import { MediaResult } from "@/lib/types";
import { api } from "@/lib/mock-api";
import { AIQueryProcessor } from "@/lib/ai-query-processor";
import { PageHeader } from "@/components/layout/page-header";
import { SearchBar } from "@/components/publicity-gpt/search-bar";
import {
  FilterSidebar,
  MediaFilters,
} from "@/components/publicity-gpt/filter-sidebar";
import { ResultsTable } from "@/components/publicity-gpt/results-table";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PublicityGPT() {
  const [mediaResults, setMediaResults] = useState<MediaResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<MediaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<MediaFilters>({
    dateRange: { start: "", end: "" },
    mediaTypes: [],
    sentiment: [],
    outlets: [],
    minReach: 0,
  });

  const aiProcessor = new AIQueryProcessor();

  useEffect(() => {
    loadMediaResults();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [mediaResults, currentQuery, currentFilters]);

  const loadMediaResults = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const data = await api.getMediaResults("1");
      setMediaResults(data);
    } catch (error) {
      console.error("Error loading media results:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...mediaResults];

    // Apply search query filter
    if (currentQuery) {
      filtered = filtered.filter(
        (result) =>
          result.title.toLowerCase().includes(currentQuery.toLowerCase()) ||
          result.outlet.toLowerCase().includes(currentQuery.toLowerCase()) ||
          result.summary.toLowerCase().includes(currentQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (currentFilters.dateRange.start) {
      const startDate = new Date(currentFilters.dateRange.start);
      filtered = filtered.filter((result) => result.publishedAt >= startDate);
    }
    if (currentFilters.dateRange.end) {
      const endDate = new Date(currentFilters.dateRange.end);
      filtered = filtered.filter((result) => result.publishedAt <= endDate);
    }

    // Apply sentiment filter
    if (currentFilters.sentiment.length > 0) {
      filtered = filtered.filter((result) =>
        currentFilters.sentiment.includes(result.sentiment)
      );
    }

    // Apply media types filter
    if (currentFilters.mediaTypes.length > 0) {
      // This would need to be implemented based on your data structure
      // For now, we'll skip this filter since the mock data doesn't include media types
    }

    // Apply outlets filter
    if (currentFilters.outlets.length > 0) {
      filtered = filtered.filter((result) =>
        currentFilters.outlets.includes(result.outlet)
      );
    }

    // Apply minimum reach filter
    if (currentFilters.minReach > 0) {
      filtered = filtered.filter(
        (result) => result.reach >= currentFilters.minReach
      );
    }

    setFilteredResults(filtered);
  };

  const handleSearch = async (query: string) => {
    setSearching(true);
    setCurrentQuery(query);

    try {
      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleFiltersChange = (filters: MediaFilters) => {
    setCurrentFilters(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters({
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    });
  };

  const handleSaveSearch = (query: string) => {
    // Simulate saving search
    console.log("Saving search:", query);
    // In a real app, this would save to backend
  };

  const handleExport = () => {
    // Simulate export functionality
    console.log("Exporting results:", filteredResults);
    // In a real app, this would generate CSV/Excel file
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadMediaResults();
    } finally {
      setRefreshing(false);
    }
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (currentFilters.dateRange.start || currentFilters.dateRange.end) count++;
    if (currentFilters.mediaTypes.length > 0) count++;
    if (currentFilters.sentiment.length > 0) count++;
    if (currentFilters.outlets.length > 0) count++;
    if (currentFilters.minReach > 0) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="PublicityGPT"
        description="AI-powered media monitoring and sentiment analysis"
      >
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="bg-pink-100 text-pink-800">
              {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}{" "}
              active
            </Badge>
          )}
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

      <SearchBar
        onSearch={handleSearch}
        onSaveSearch={handleSaveSearch}
        onExport={handleExport}
        onFiltersChange={handleFiltersChange}
        loading={searching}
      />

      {/* AI Features Banner */}
      <Card className="mb-6 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-500" />
              <span className="font-medium text-pink-700">
                AI-Powered Search
              </span>
            </div>
            <div className="text-sm text-pink-600">
              Use natural language to find exactly what you're looking for
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-6">
        <FilterSidebar
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        <div className="flex-1">
          <ResultsTable
            results={filteredResults}
            loading={loading || searching}
          />
        </div>
      </div>
    </div>
  );
}
