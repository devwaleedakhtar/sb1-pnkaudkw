"use client";

import { useState, useEffect, useCallback } from "react";
import { MediaResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  Calendar,
  MoreHorizontal,
  Eye,
  BookmarkPlus,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingUp,
  Filter,
  Upload,
  FileDown,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getMediaIcon, getOutletIcon } from "./media-icons";

interface ResultsGridProps {
  results: MediaResult[];
  loading?: boolean;
  onPaginationChange?: (pagination: {
    currentPage: number;
    totalPages: number;
    startIndex: number;
    endIndex: number;
    totalResults: number;
    handlePageChange: (page: number) => void;
  }) => void;
}

const ITEMS_PER_PAGE = 9; // 3x3 grid

export function ResultsGrid({
  results,
  loading,
  onPaginationChange,
}: ResultsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: "",
    outlet: "all",
    sentiment: "all",
    topic: "all",
    source: "all",
  });

  // Get unique values for filter options
  const outlets = Array.from(new Set(results.map((r) => r.outlet)));
  const topics = Array.from(new Set(results.map((r) => r.topic)));
  const sources = Array.from(new Set(results.map((r) => r.source)));

  // Filter results based on current filters
  const filteredResults = results.filter((result) => {
    const matchesSearch =
      !filters.search ||
      result.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      result.summary.toLowerCase().includes(filters.search.toLowerCase()) ||
      result.author.toLowerCase().includes(filters.search.toLowerCase());

    const matchesOutlet =
      filters.outlet === "all" || result.outlet === filters.outlet;
    const matchesSentiment =
      filters.sentiment === "all" || result.sentiment === filters.sentiment;
    const matchesTopic =
      filters.topic === "all" || result.topic === filters.topic;
    const matchesSource =
      filters.source === "all" || result.source === filters.source;

    return (
      matchesSearch &&
      matchesOutlet &&
      matchesSentiment &&
      matchesTopic &&
      matchesSource
    );
  });

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Reset to page 1 when results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results, filters]);

  // Notify parent about pagination state
  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        totalResults: filteredResults.length,
        handlePageChange,
      });
    }
  }, [
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    filteredResults.length,
    onPaginationChange,
  ]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(currentResults.map((r) => r.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(Array.from(selectedItems));
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const handleUpload = () => {
    console.log("Uploading selected items:", Array.from(selectedItems));
    // In a real app, this would trigger file upload
  };

  const handleExport = () => {
    console.log("Exporting selected items:", Array.from(selectedItems));
    // In a real app, this would trigger CSV/Excel export
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      outlet: "all",
      sentiment: "all",
      topic: "all",
      source: "all",
    });
  };

  if (loading) {
    return (
      <div className="max-h-[500px] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-3 w-3" />;
      case "negative":
        return <ThumbsDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const formatImpressions = (impressions: number) => {
    if (impressions >= 1000000) {
      return `${(impressions / 1000000).toFixed(1)}M`;
    } else if (impressions >= 1000) {
      return `${(impressions / 1000).toFixed(1)}K`;
    }
    return impressions.toString();
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="ml-auto"
          >
            Clear All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Search</label>
            <Input
              placeholder="Search articles..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="h-9"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Outlet</label>
            <Select
              value={filters.outlet}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, outlet: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All outlets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All outlets</SelectItem>
                {outlets.map((outlet) => (
                  <SelectItem key={outlet} value={outlet}>
                    {outlet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Sentiment</label>
            <Select
              value={filters.sentiment}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, sentiment: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All sentiments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sentiments</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Topic</label>
            <Select
              value={filters.topic}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, topic: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All topics</SelectItem>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Source</label>
            <Select
              value={filters.source}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, source: value }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                {sources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedItems.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
          <span className="text-sm text-blue-900">
            {selectedItems.size} item{selectedItems.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {currentResults.map((result) => (
            <Card
              key={result.id}
              className="hover:shadow-lg transition-shadow relative"
            >
              <CardContent className="p-4">
                {/* Selection Checkbox */}
                <div className="absolute top-2 right-2 z-10">
                  <Checkbox
                    checked={selectedItems.has(result.id)}
                    onCheckedChange={(checked) =>
                      handleSelectItem(result.id, checked as boolean)
                    }
                  />
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getMediaIcon(result.mediaType, result.outlet)}
                    <div className="flex items-center gap-1">
                      {getOutletIcon(result.outlet)}
                      <span className="text-sm font-medium text-gray-700">
                        {result.outlet}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Article
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BookmarkPlus className="h-4 w-4 mr-2" />
                        Save
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Title */}
                <h3 className="font-medium text-sm mb-2 line-clamp-2 leading-tight">
                  {result.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  {result.summary}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Month:</span>
                    <span className="font-medium">{result.month}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Impressions:</span>
                    <span className="font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {formatImpressions(result.impressions)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Author:</span>
                    <span className="font-medium">{result.author}</span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {result.mediaType}
                  </Badge>
                  <Badge
                    className={`text-xs ${getSentimentColor(result.sentiment)}`}
                  >
                    {getSentimentIcon(result.sentiment)}
                    <span className="ml-1 capitalize">{result.sentiment}</span>
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {result.topic}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {result.source}
                  </Badge>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(result.publishedAt, {
                    addSuffix: true,
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
