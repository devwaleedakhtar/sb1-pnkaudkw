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
  const [currentOriginalQuery, setCurrentOriginalQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<MediaFilters>({
    dateRange: { start: "", end: "" },
    mediaTypes: [],
    sentiment: [],
    outlets: [],
    minReach: 0,
  });
  const [hasSearched, setHasSearched] = useState(false);

  const aiProcessor = new AIQueryProcessor();

  useEffect(() => {
    loadMediaResults();
  }, []);

  const loadMediaResults = async () => {
    try {
      setLoading(true);
      // For demo purposes, using campaign ID '1'
      const data = await api.getMediaResults("1");
      setMediaResults(data);
      if (!hasSearched) {
        setFilteredResults(data);
      }
    } catch (error) {
      console.error("Error loading media results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string, originalQuery?: string) => {
    setSearching(true);
    setCurrentQuery(query);
    setCurrentOriginalQuery(originalQuery || query);
    setHasSearched(true);

    try {
      // Use the enhanced API with search query, filters, and original query
      const data = await api.getMediaResults(
        "1",
        currentFilters,
        query,
        originalQuery
      );
      setFilteredResults(data);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleFiltersChange = async (filters: MediaFilters) => {
    setCurrentFilters(filters);

    // If we have a search query or filters applied, re-search with new filters
    if (hasSearched || currentQuery) {
      setSearching(true);
      try {
        const data = await api.getMediaResults(
          "1",
          filters,
          currentQuery,
          currentOriginalQuery
        );
        setFilteredResults(data);
      } catch (error) {
        console.error("Error applying filters:", error);
      } finally {
        setSearching(false);
      }
    }
  };

  const handleClearFilters = async () => {
    const clearedFilters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };
    setCurrentFilters(clearedFilters);

    // If we have a search query, re-search with cleared filters
    if (hasSearched && currentQuery) {
      setSearching(true);
      try {
        const data = await api.getMediaResults(
          "1",
          clearedFilters,
          currentQuery,
          currentOriginalQuery
        );
        setFilteredResults(data);
      } catch (error) {
        console.error("Error clearing filters:", error);
      } finally {
        setSearching(false);
      }
    } else {
      // If no search query, show original data and reset search state
      setFilteredResults(mediaResults);
      setHasSearched(false);
      setCurrentQuery("");
      setCurrentOriginalQuery("");
    }
  };

  const handleSaveSearch = (query: string) => {
    // Simulate saving search
    console.log("Saving search:", query);
    // In a real app, this would save to backend
  };

  const handleClearSearch = () => {
    // Reset search state and show original data
    setCurrentQuery("");
    setCurrentOriginalQuery("");
    setHasSearched(false);
    setFilteredResults(mediaResults);

    // Also clear filters
    const clearedFilters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };
    setCurrentFilters(clearedFilters);
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
      // If we have active search/filters, re-apply them
      if (hasSearched || currentQuery) {
        const data = await api.getMediaResults(
          "1",
          currentFilters,
          currentQuery,
          currentOriginalQuery
        );
        setFilteredResults(data);
      }
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
          {hasSearched && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {filteredResults.length} results found
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
        onClearSearch={handleClearSearch}
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
          {hasSearched && currentQuery && (
            <div className="mt-2 text-sm text-pink-600">
              <span className="font-medium">Current search:</span> "
              {currentQuery}"
            </div>
          )}
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
