"use client";

import { useState, useEffect } from "react";
import { MediaResult } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLink,
  TrendingUp,
  Calendar,
  Building,
  MoreHorizontal,
  Eye,
  BookmarkPlus,
  Share2,
  Download,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface ResultsTableProps {
  results: MediaResult[];
  loading?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function ResultsTable({ results, loading }: ResultsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResults = results.slice(startIndex, endIndex);

  const getSentimentColor = (sentiment: MediaResult["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSentimentIcon = (sentiment: MediaResult["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-3 w-3" />;
      case "negative":
        return <ThumbsDown className="h-3 w-3" />;
      case "neutral":
        return <Minus className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const formatReach = (reach: number) => {
    if (reach >= 1000000) {
      return `${(reach / 1000000).toFixed(1)}M`;
    } else if (reach >= 1000) {
      return `${(reach / 1000).toFixed(1)}K`;
    }
    return reach.toString();
  };

  const getReachColor = (reach: number) => {
    if (reach >= 1000000) return "text-red-600 font-semibold";
    if (reach >= 100000) return "text-orange-600 font-semibold";
    if (reach >= 10000) return "text-blue-600 font-medium";
    return "text-gray-600";
  };

  const handleSaveArticle = (result: MediaResult) => {
    console.log("Saving article:", result.id);
    // In a real app, this would save to backend
  };

  const handleShareArticle = (result: MediaResult) => {
    console.log("Sharing article:", result.id);
    // In a real app, this would open share dialog
  };

  const handleDownloadArticle = (result: MediaResult) => {
    console.log("Downloading article:", result.id);
    // In a real app, this would download article content
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalReach = results.reduce((sum, r) => sum + r.reach, 0);

  // Reset to page 1 when results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <span>Search Results</span>
            <Badge variant="secondary" className="ml-2">
              {results.length}
            </Badge>
          </CardTitle>
          {results.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>Total Reach: </span>
                <span className={`font-semibold ${getReachColor(totalReach)}`}>
                  {formatReach(totalReach)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="outline">💡 Try "positive news"</Badge>
              <Badge variant="outline">📅 Expand date range</Badge>
              <Badge variant="outline">🔍 Use broader keywords</Badge>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Article</TableHead>
                    <TableHead className="w-[15%]">Outlet</TableHead>
                    <TableHead className="w-[15%]">Date</TableHead>
                    <TableHead className="w-[12%]">Sentiment</TableHead>
                    <TableHead className="w-[12%]">Reach</TableHead>
                    <TableHead className="w-[6%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentResults.map((result) => (
                    <TableRow
                      key={result.id}
                      className="hover:bg-gray-50/50 group"
                    >
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {result.title}
                          </div>
                          <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {result.summary}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {result.outlet}
                            </div>
                            <div className="text-xs text-gray-500">Media</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>
                              {format(result.publishedAt, "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDistanceToNow(result.publishedAt, {
                              addSuffix: true,
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge
                          className={`${getSentimentColor(
                            result.sentiment
                          )} flex items-center gap-1`}
                        >
                          {getSentimentIcon(result.sentiment)}
                          <span className="capitalize">{result.sentiment}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                          <span
                            className={`font-medium ${getReachColor(
                              result.reach
                            )}`}
                          >
                            {formatReach(result.reach)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <a
                              href={result.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-50"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleSaveArticle(result)}
                              >
                                <BookmarkPlus className="h-4 w-4 mr-2" />
                                Save Article
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleShareArticle(result)}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadArticle(result)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={result.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Original
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, results.length)} of {results.length}{" "}
                  results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage) {
                          // Show ellipsis for gaps
                          if (page === 2 && currentPage > 4) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          if (
                            page === totalPages - 1 &&
                            currentPage < totalPages - 3
                          ) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }

                        return (
                          <Button
                            key={page}
                            variant={
                              page === currentPage ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-8 h-8 p-0"
                          >
                            {page}
                          </Button>
                        );
                      }
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
