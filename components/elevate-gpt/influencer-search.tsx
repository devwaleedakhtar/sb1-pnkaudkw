"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Search,
  Database,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Wand2,
} from "lucide-react";
import { InfluencerAIQueryProcessor } from "@/lib/ai-query-processor";

interface InfluencerSearchProps {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export interface SearchParams {
  query: string;
  platform: string;
  category: string;
  minFollowers: number;
  maxFollowers: number;
  minEngagement: number;
  useInternalDb: boolean;
}

export function InfluencerSearch({ onSearch, loading }: InfluencerSearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: "",
    platform: "all",
    category: "all",
    minFollowers: 1000,
    maxFollowers: 10000000,
    minEngagement: 1,
    useInternalDb: true,
  });

  const [aiQuery, setAiQuery] = useState("");
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchMode, setSearchMode] = useState<"ai" | "manual">("ai");
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [appliedRefinements, setAppliedRefinements] = useState<string[]>([]);
  const [queryProcessor] = useState(() => new InfluencerAIQueryProcessor());
  const [exampleQueries] = useState(() =>
    queryProcessor.getInfluencerExampleQueries()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleAISearch = async (query: string) => {
    if (!query.trim()) return;

    console.log("AI Search started with query:", query);

    try {
      const result = await queryProcessor.processInfluencerQuery(query);
      console.log("AI Query processed result:", result);

      setSearchParams(result.searchParams);
      setAiSuggestions(result.suggestions);
      setAiConfidence(result.confidence);
      setShowFollowUp(true);

      // Reset refinements for new search
      setAppliedRefinements([]);

      // Automatically trigger search
      console.log("Triggering search with params:", result.searchParams);
      onSearch(result.searchParams);
    } catch (error) {
      console.error("Error processing AI query:", error);
    }
  };

  const handleFollowUpSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim()) return;

    try {
      // Combine original query with follow-up for better context
      const combinedQuery = `${aiQuery} ${followUpQuery}`;
      const result = await queryProcessor.processInfluencerQuery(combinedQuery);

      // Update search params but preserve the original query display
      setSearchParams(result.searchParams);

      // Merge new suggestions with existing ones, avoiding duplicates
      const newSuggestions = [...aiSuggestions];
      result.suggestions.forEach((suggestion) => {
        if (!newSuggestions.includes(suggestion)) {
          newSuggestions.push(suggestion);
        }
      });
      setAiSuggestions(newSuggestions);

      // Update confidence (average of original and new)
      setAiConfidence(Math.max(aiConfidence, result.confidence));

      // Add the refinement to applied refinements
      setAppliedRefinements((prev) => [...prev, followUpQuery]);

      // Clear follow-up query but keep everything else
      setFollowUpQuery("");

      // Automatically trigger search
      onSearch(result.searchParams);
    } catch (error) {
      console.error("Error processing follow-up query:", error);
    }
  };

  const handleAISubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAISearch(aiQuery);
  };

  const handleExampleClick = (example: string) => {
    console.log("Example clicked:", example);
    setAiQuery(example);
    handleAISearch(example);
  };

  const updateParam = (key: keyof SearchParams, value: any) => {
    setSearchParams((prev) => ({ ...prev, [key]: value }));
  };

  const platforms = [
    { value: "all", label: "All Platforms" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "twitter", label: "Twitter" },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: "Technology" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "fashion", label: "Fashion" },
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food & Cooking" },
    { value: "travel", label: "Travel" },
    { value: "beauty", label: "Beauty" },
    { value: "gaming", label: "Gaming" },
  ];

  const formatFollowerRange = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            <span>AI-Powered Influencer Search</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Advanced
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          value={searchMode}
          onValueChange={(value) => setSearchMode(value as "ai" | "manual")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Wand2 className="h-4 w-4" />
              <span>AI Search</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Manual Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4">
            <form onSubmit={handleAISubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-pink-400" />
                  <Textarea
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    placeholder="Describe the influencers you're looking for in natural language..."
                    className="pl-10 min-h-[60px] resize-none"
                    rows={2}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading || !aiQuery.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 px-6"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Example Queries */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Try these examples:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {exampleQueries.slice(0, 4).map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example)}
                      className="text-xs bg-gray-50 hover:bg-pink-50 hover:border-pink-300"
                    >
                      {example}
                    </Button>
                  ))}
                </div>
              </div>
            </form>

            {/* AI Suggestions - Outside the form */}
            {aiSuggestions.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-pink-900 flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>AI Interpretation</span>
                  </h4>
                  <Badge
                    variant="secondary"
                    className="bg-pink-100 text-pink-800"
                  >
                    {Math.round(aiConfidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white border-pink-200 text-pink-800"
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>

                {/* Applied Refinements */}
                {appliedRefinements.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-pink-200">
                    <div className="text-sm text-pink-700 mb-2">
                      <span className="font-medium">Applied refinements:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {appliedRefinements.map((refinement, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 border-blue-200 text-blue-800"
                        >
                          + {refinement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Follow-up Query - Outside the main form */}
            {showFollowUp && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                  <Wand2 className="h-4 w-4" />
                  <span>Refine Your Search</span>
                </h4>
                <form onSubmit={handleFollowUpSearch} className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        value={followUpQuery}
                        onChange={(e) => setFollowUpQuery(e.target.value)}
                        placeholder="Add more details or refine your search..."
                        className="bg-white border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || !followUpQuery.trim()}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Refine
                    </Button>
                  </div>
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">Examples:</span> "with higher
                    engagement", "verified accounts only", "under 500k
                    followers"
                  </div>
                </form>
              </div>
            )}
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Manual Search Query */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchParams.query}
                    onChange={(e) => updateParam("query", e.target.value)}
                    placeholder="Search for influencers by keywords, niche, or name..."
                    className="pl-10"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-pink-500 hover:bg-pink-600"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Quick Filter Pills */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Quick Filters:
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={
                      searchParams.minFollowers === 1000 &&
                      searchParams.maxFollowers === 100000
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      updateParam("minFollowers", 1000);
                      updateParam("maxFollowers", 100000);
                    }}
                    className="text-xs"
                  >
                    Micro (1K-100K)
                  </Button>
                  <Button
                    type="button"
                    variant={
                      searchParams.minFollowers === 100000 &&
                      searchParams.maxFollowers === 1000000
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      updateParam("minFollowers", 100000);
                      updateParam("maxFollowers", 1000000);
                    }}
                    className="text-xs"
                  >
                    Macro (100K-1M)
                  </Button>
                  <Button
                    type="button"
                    variant={
                      searchParams.minFollowers >= 1000000
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => {
                      updateParam("minFollowers", 1000000);
                      updateParam("maxFollowers", 10000000);
                    }}
                    className="text-xs"
                  >
                    Mega (1M+)
                  </Button>
                  <Button
                    type="button"
                    variant={
                      searchParams.minEngagement >= 3 ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => updateParam("minEngagement", 3)}
                    className="text-xs"
                  >
                    High Engagement (3%+)
                  </Button>
                </div>
              </div>

              {/* Essential Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform" className="text-sm font-medium">
                    Platform
                  </Label>
                  <Select
                    value={searchParams.platform}
                    onValueChange={(value) => updateParam("platform", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Category
                  </Label>
                  <Select
                    value={searchParams.category}
                    onValueChange={(value) => updateParam("category", value)}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="minFollowers"
                      className="text-sm font-medium"
                    >
                      Follower Range
                    </Label>
                    <span className="text-xs text-gray-500">
                      {formatFollowerRange(
                        searchParams.minFollowers,
                        searchParams.maxFollowers
                      )}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={searchParams.minFollowers}
                      onChange={(e) =>
                        updateParam(
                          "minFollowers",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="Min"
                      className="h-10 text-sm"
                    />
                    <Input
                      type="number"
                      value={searchParams.maxFollowers}
                      onChange={(e) =>
                        updateParam(
                          "maxFollowers",
                          parseInt(e.target.value) || 10000000
                        )
                      }
                      placeholder="Max"
                      className="h-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="minEngagement"
                    className="text-sm font-medium"
                  >
                    Min Engagement %
                  </Label>
                  <Input
                    id="minEngagement"
                    type="number"
                    step="0.1"
                    value={searchParams.minEngagement}
                    onChange={(e) =>
                      updateParam(
                        "minEngagement",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="1.0"
                    className="h-10"
                  />
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Advanced Search Options</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Content Preferences
                  </Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      Verified Accounts Only
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      Recently Active (30 days)
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      High Story Engagement
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">
                    Audience Demographics
                  </Label>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      18-24 Age Group
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      25-34 Age Group
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                    >
                      US/UK Audience
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Database Toggle */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            {searchParams.useInternalDb ? (
              <Database className="h-5 w-5 text-pink-500" />
            ) : (
              <Globe className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <Label htmlFor="dbToggle" className="font-medium">
                {searchParams.useInternalDb
                  ? "Internal Database"
                  : "Broad Search"}
              </Label>
              <p className="text-sm text-gray-600">
                {searchParams.useInternalDb
                  ? "Search our curated database of verified influencers"
                  : "Search across all public social media platforms"}
              </p>
            </div>
          </div>
          <Switch
            id="dbToggle"
            checked={searchParams.useInternalDb}
            onCheckedChange={(checked) => updateParam("useInternalDb", checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
