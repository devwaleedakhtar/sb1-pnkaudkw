"use client";

import { useState, useEffect } from "react";
import { MediaResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = results.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // Notify parent about pagination state
  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange({
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        totalResults: results.length,
        handlePageChange,
      });
    }
  }, [
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    results.length,
    onPaginationChange,
  ]);
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

  return (
    <div className="max-h-[500px] overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {currentResults.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
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
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(result.publishedAt, { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {result.reach.toLocaleString()}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(result.url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-2" />
                  Read Article
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
