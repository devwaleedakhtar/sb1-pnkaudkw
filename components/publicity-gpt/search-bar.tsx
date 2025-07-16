"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Save,
  Download,
  Sparkles,
  Settings,
  X,
  Zap,
} from "lucide-react";
import { MediaFilters } from "./filter-sidebar";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSaveSearch: (query: string) => void;
  onExport: () => void;
  onFiltersChange: (filters: MediaFilters) => void;
  loading?: boolean;
}

interface ParsedQuery {
  query: string;
  filters: MediaFilters;
  suggestions: string[];
}

export function SearchBar({
  onSearch,
  onSaveSearch,
  onExport,
  onFiltersChange,
  loading,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [activeMode, setActiveMode] = useState<"ai" | "manual">("ai");
  const [parsedQuery, setParsedQuery] = useState<ParsedQuery | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Query Processing - This would integrate with an actual LLM in production
  const processAIQuery = async (naturalQuery: string): Promise<ParsedQuery> => {
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock AI processing logic - in production, this would call an LLM API
    const lowerQuery = naturalQuery.toLowerCase();
    const filters: MediaFilters = {
      dateRange: { start: "", end: "" },
      mediaTypes: [],
      sentiment: [],
      outlets: [],
      minReach: 0,
    };

    const suggestions: string[] = [];

    // Date parsing
    if (lowerQuery.includes("last week") || lowerQuery.includes("past week")) {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      filters.dateRange.start = lastWeek.toISOString().split("T")[0];
      suggestions.push("Date range: Last 7 days");
    }

    if (
      lowerQuery.includes("last month") ||
      lowerQuery.includes("past month")
    ) {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      filters.dateRange.start = lastMonth.toISOString().split("T")[0];
      suggestions.push("Date range: Last 30 days");
    }

    // Sentiment parsing
    if (
      lowerQuery.includes("positive") ||
      lowerQuery.includes("good") ||
      lowerQuery.includes("favorable")
    ) {
      filters.sentiment = ["positive"];
      suggestions.push("Sentiment: Positive only");
    }

    if (
      lowerQuery.includes("negative") ||
      lowerQuery.includes("bad") ||
      lowerQuery.includes("critical")
    ) {
      filters.sentiment = ["negative"];
      suggestions.push("Sentiment: Negative only");
    }

    // Media type parsing
    if (lowerQuery.includes("news") || lowerQuery.includes("articles")) {
      filters.mediaTypes = ["Online News"];
      suggestions.push("Media type: Online News");
    }

    if (lowerQuery.includes("social media") || lowerQuery.includes("social")) {
      filters.mediaTypes = ["Social Media"];
      suggestions.push("Media type: Social Media");
    }

    if (lowerQuery.includes("podcast") || lowerQuery.includes("audio")) {
      filters.mediaTypes = ["Podcast"];
      suggestions.push("Media type: Podcast");
    }

    // Outlet parsing
    if (lowerQuery.includes("techcrunch")) {
      filters.outlets = ["TechCrunch"];
      suggestions.push("Outlet: TechCrunch");
    }

    if (lowerQuery.includes("wired")) {
      filters.outlets = ["Wired"];
      suggestions.push("Outlet: Wired");
    }

    // Reach parsing
    if (lowerQuery.includes("high reach") || lowerQuery.includes("popular")) {
      filters.minReach = 100000;
      suggestions.push("Minimum reach: 100K+");
    }

    if (lowerQuery.includes("viral") || lowerQuery.includes("trending")) {
      filters.minReach = 500000;
      suggestions.push("Minimum reach: 500K+");
    }

    // Extract clean search terms
    const cleanQuery = naturalQuery
      .replace(/\b(last|past|this)\s+(week|month|year)\b/gi, "")
      .replace(/\b(positive|negative|good|bad|favorable|critical)\b/gi, "")
      .replace(/\b(news|articles|social media|podcast|audio)\b/gi, "")
      .replace(/\b(high reach|popular|viral|trending)\b/gi, "")
      .replace(/\b(techcrunch|wired|cnn|forbes)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    setIsProcessing(false);

    return {
      query: cleanQuery || naturalQuery,
      filters,
      suggestions,
    };
  };

  const handleAISearch = async () => {
    if (!query.trim()) return;

    try {
      const parsed = await processAIQuery(query);
      setParsedQuery(parsed);
      onFiltersChange(parsed.filters);
      onSearch(parsed.query);
    } catch (error) {
      console.error("AI processing error:", error);
      // Fallback to regular search
      onSearch(query);
    }
  };

  const handleManualSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeMode === "ai") {
      handleAISearch();
    } else {
      handleManualSearch();
    }
  };

  const handleSaveSearch = () => {
    if (query.trim()) {
      onSaveSearch(query.trim());
    }
  };

  const removeSuggestion = (index: number) => {
    if (parsedQuery) {
      const newSuggestions = parsedQuery.suggestions.filter(
        (_, i) => i !== index
      );
      setParsedQuery({ ...parsedQuery, suggestions: newSuggestions });
    }
  };

  const exampleQueries = [
    "Show me positive TechCrunch articles from last week",
    "Find negative mentions with high reach",
    "Get all podcast mentions from this month",
    "Social media posts about our product",
  ];

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <Tabs
          value={activeMode}
          onValueChange={(value) => setActiveMode(value as "ai" | "manual")}
        >
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-[300px] grid-cols-2">
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Search
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manual
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveSearch}
                disabled={!query.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="ai" className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe what you're looking for... (e.g., 'Show me positive TechCrunch articles from last week')"
                  className="pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || isProcessing || !query.trim()}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {isProcessing ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-pulse" />
                    Processing...
                  </>
                ) : loading ? (
                  "Searching..."
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Search
                  </>
                )}
              </Button>
            </form>

            {/* AI Suggestions */}
            {parsedQuery && parsedQuery.suggestions.length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-pink-500" />
                  <span className="text-sm font-medium text-pink-700">
                    AI Applied Filters:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {parsedQuery.suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-pink-100 text-pink-800"
                    >
                      {suggestion}
                      <button
                        onClick={() => removeSuggestion(index)}
                        className="ml-2 hover:text-pink-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Example queries */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(example)}
                    className="text-xs"
                  >
                    {example}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for media mentions, keywords, or topics..."
                  className="pl-10"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !query.trim()}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
